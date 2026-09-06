/**
 * POST /api/payments/culqi/charge
 *
 * Recibe el token del Custom Checkout (frontend) + datos del comprador.
 * Resuelve precio autoritativamente desde Supabase y ejecuta el cargo
 * contra Culqi API. Si exitoso, persiste lead+enrollment+payment y
 * dispara sync a HubSpot/Brevo/email (no-bloqueantes).
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { culqiChargeRequestSchema } from "@/lib/schemas";
import { coursesCatalog } from "@/lib/courses-catalog";
import { createCulqiCharge } from "@/lib/payments/culqi";
import {
  fulfillSuccessfulCharge,
  recordFailedCharge,
} from "@/lib/payments/culqi-fulfillment";

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_CULQI_ENABLED !== "true") {
    return NextResponse.json(
      { error: "Pagos con Culqi temporalmente no disponibles" },
      { status: 503 },
    );
  }

  try {
    const payload = await request.json();
    const parsed = culqiChargeRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const {
      courseId,
      token,
      guestName,
      guestEmail,
      guestPhone,
      currency,
      deviceFingerprintId,
      authentication3DS,
      marketingConsent,
      notes,
      utmSource,
    } = parsed.data;

    // 1. Resolver curso desde DB (precio autoritativo, no se confía en el cliente)
    const supabase = createServiceClient();
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title, price, currency, slug, is_published")
      .eq("id", courseId)
      .single();

    if (courseError || !course || !course.is_published) {
      return NextResponse.json(
        { error: "Curso no disponible" },
        { status: 404 },
      );
    }

    // 2. Resolver el monto según la moneda elegida. El precio en soles vive en
    // la BD; la tarifa internacional (USD) en el catálogo estático. En ambos
    // casos lo decide el servidor para que no se pueda manipular desde el
    // cliente enviando "USD" para pagar menos.
    let amountValue: number;
    if (currency === "USD") {
      const catalogCourse = coursesCatalog.find((c) => c.id === course.id);
      if (!catalogCourse?.priceUSD || catalogCourse.priceUSD <= 0) {
        return NextResponse.json(
          {
            error:
              "Este curso no tiene tarifa internacional publicada. Escríbenos por WhatsApp.",
          },
          { status: 409 },
        );
      }
      amountValue = catalogCourse.priceUSD;
    } else {
      amountValue = Number(course.price);
    }

    // Culqi requiere el monto en céntimos enteros (de la moneda elegida).
    const amountCents = Math.round(amountValue * 100);

    // 2. Ejecutar charge contra Culqi.
    // metadata acompaña al cargo y vuelve en el webhook → permite que el
    // webhook reconstruya el contexto si /charge crashea entre charge y persist.
    const charge = await createCulqiCharge({
      token,
      amountCents,
      currency,
      customerEmail: guestEmail,
      customerFullName: guestName,
      customerPhone: guestPhone,
      deviceFingerprintId,
      authentication3DS,
      description: `Inscripción: ${course.title}`,
      metadata: {
        courseId: course.id,
        courseTitle: course.title,
        courseSlug: course.slug ?? "",
        guestName,
        guestEmail,
        guestPhone,
      },
    });

    // Culqi puede pedir un reto 3DS antes de decidir el cargo. No se registra
    // como rechazado: el navegador abrirá la autenticación y reintentará con
    // el mismo token y deviceFingerprintId.
    if (charge.requires3DS) {
      return NextResponse.json(
        { ok: false, status: "requires_3ds", requires3DS: true },
        { status: 202 },
      );
    }

    // 3a. Cargo rechazado / error de API: registrar para auditoría y devolver 402
    if (!charge.ok) {
      // Solo campos técnicos. Nunca escribir payloads, mensajes, nombres,
      // teléfonos o correos en los logs de producción.
      console.error("[culqi/charge] cargo rechazado", {
        outcomeType: charge.outcomeType,
      });
      await recordFailedCharge({
        chargeId: charge.chargeId,
        amountCents,
        currency,
        rawPayload: charge.raw,
      });
      return NextResponse.json(
        {
          ok: false,
          status: charge.status,
          message: charge.userMessage || "Pago rechazado",
          chargeId: charge.chargeId,
        },
        { status: 402 }, // Payment Required
      );
    }

    // 3b. Cargo exitoso: crear lead+enrollment+payment + disparar syncs
    const result = await fulfillSuccessfulCharge({
      chargeId: charge.chargeId!,
      amountCents,
      currency,
      paymentMethod: charge.paymentMethod,
      metadata: {
        courseId: course.id,
        courseTitle: course.title,
        guestName,
        guestEmail,
        guestPhone,
        marketingConsent,
        notes,
        utmSource,
      },
      rawPayload: charge.raw,
    });

    if (!result.ok) {
      // Crítico: cargo cobrado pero persistencia falló. El webhook (idempotente)
      // hará el insert cuando llegue. Devolvemos OK al usuario para no bloquearlo.
      console.error("[culqi/charge] persistencia posterior al cobro falló", {
        errorCode: result.error,
      });
      return NextResponse.json({
        ok: true,
        status: "approved",
        chargeId: charge.chargeId,
        warning: "Pago confirmado, sincronización en curso",
      });
    }

    return NextResponse.json({
      ok: true,
      status: "approved",
      chargeId: charge.chargeId,
      leadId: result.leadId,
      enrollmentId: result.enrollmentId,
    });
  } catch {
    console.error("[culqi/charge] error inesperado");
    return NextResponse.json(
      { error: "Error inesperado al procesar el pago" },
      { status: 500 },
    );
  }
}
