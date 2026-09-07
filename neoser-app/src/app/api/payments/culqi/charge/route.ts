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
  recordSuccessfulQaCharge,
} from "@/lib/payments/culqi-fulfillment";
import {
  getPaymentQaAmount,
  isPaymentQaCourse,
  PAYMENT_QA_COOKIE_NAME,
  PAYMENT_QA_PURPOSE,
  PAYMENT_QA_TITLE,
  verifyPaymentQaSession,
} from "@/lib/payments/payment-qa";

export async function POST(request: NextRequest) {
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

    const isQaCourse = isPaymentQaCourse(courseId);
    const isAuthorizedQa =
      isQaCourse &&
      verifyPaymentQaSession(
        request.cookies.get(PAYMENT_QA_COOKIE_NAME)?.value,
      );

    // La ruta de QA usa un producto interno y una sesión HTTP-only. Nunca
    // reutiliza el curso publicado ni permite que el cliente decida el monto.
    if (isQaCourse && !isAuthorizedQa) {
      return NextResponse.json({ error: "Curso no disponible" }, { status: 404 });
    }

    if (
      !isAuthorizedQa &&
      process.env.NEXT_PUBLIC_CULQI_ENABLED !== "true"
    ) {
      return NextResponse.json(
        { error: "Pagos con Culqi temporalmente no disponibles" },
        { status: 503 },
      );
    }

    // 1. Resolver curso desde DB (precio autoritativo, no se confía en el cliente)
    const supabase = createServiceClient();
    let course: {
      id: string;
      title: string;
      price: number;
      currency: string;
      slug: string;
      is_published: boolean;
    };

    if (isAuthorizedQa) {
      course = {
        id: courseId,
        title: PAYMENT_QA_TITLE,
        price: getPaymentQaAmount("PEN"),
        currency: "PEN",
        slug: PAYMENT_QA_PURPOSE,
        is_published: false,
      };
    } else {
      const { data: storedCourse, error: courseError } = await supabase
        .from("courses")
        .select("id, title, price, currency, slug, is_published")
        .eq("id", courseId)
        .single();

      if (courseError || !storedCourse || !storedCourse.is_published) {
        return NextResponse.json(
          { error: "Curso no disponible" },
          { status: 404 },
        );
      }

      course = {
        ...storedCourse,
        price: Number(storedCourse.price),
        slug: storedCourse.slug ?? "",
      };
    }

    // 2. Resolver el monto según la moneda elegida. El precio en soles vive en
    // la BD; la tarifa internacional (USD) en el catálogo estático. En ambos
    // casos lo decide el servidor para que no se pueda manipular desde el
    // cliente enviando "USD" para pagar menos.
    let amountValue: number;
    if (isAuthorizedQa) {
      amountValue = getPaymentQaAmount(currency);
    } else if (currency === "USD") {
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
      description: isAuthorizedQa
        ? "Prueba real de cobro NeoSer — Protocolos"
        : `Inscripción: ${course.title}`,
      metadata: isAuthorizedQa
        ? { paymentPurpose: PAYMENT_QA_PURPOSE }
        : {
            courseId: course.id,
            courseTitle: course.title,
            courseSlug: course.slug,
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
        purpose: isAuthorizedQa ? PAYMENT_QA_PURPOSE : undefined,
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

    // 3b. Una prueba aprobada se registra sin crear inscripción ni contaminar
    // HubSpot, Brevo o los correos transaccionales del curso real.
    if (isAuthorizedQa) {
      const qaResult = await recordSuccessfulQaCharge({
        chargeId: charge.chargeId!,
        amountCents,
        currency,
        rawPayload: charge.raw,
      });

      return NextResponse.json({
        ok: true,
        status: "approved",
        chargeId: charge.chargeId,
        ...(qaResult.ok ? {} : { warning: "Registro en sincronización" }),
      });
    }

    // 3c. Cargo exitoso normal: crear lead+enrollment+payment + syncs.
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
