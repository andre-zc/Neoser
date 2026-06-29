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
import { createCulqiCharge } from "@/lib/payments/culqi";
import {
  fulfillSuccessfulCharge,
  recordFailedCharge,
} from "@/lib/payments/culqi-fulfillment";

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

    // payments.amount es soles decimal; Culqi requiere céntimos enteros.
    const amountCents = Math.round(Number(course.price) * 100);
    const currency = "PEN" as const;

    // 2. Ejecutar charge contra Culqi.
    // metadata acompaña al cargo y vuelve en el webhook → permite que el
    // webhook reconstruya el contexto si /charge crashea entre charge y persist.
    const charge = await createCulqiCharge({
      token,
      amountCents,
      currency,
      customerEmail: guestEmail,
      customerFullName: guestName,
      description: `Inscripción: ${course.title}`,
      metadata: {
        courseId: course.id,
        courseTitle: course.title,
        courseSlug: course.slug ?? "",
        guestName,
        guestEmail,
        guestPhone,
        ...(notes ? { notes } : {}),
        ...(utmSource ? { utmSource } : {}),
      },
    });

    // 3a. Cargo rechazado / error de API: registrar para auditoría y devolver 402
    if (!charge.ok) {
      // Log diagnostico: el response completo de Culqi para diagnosticar fallas
      // de integracion ("El comercio tiene problemas...", llaves invalidas, etc).
      console.error("[culqi/charge] charge.ok=false detalle:", {
        outcomeType: charge.outcomeType,
        userMessage: charge.userMessage,
        chargeId: charge.chargeId,
        rawResponse: charge.raw,
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
        notes,
        utmSource,
      },
      rawPayload: charge.raw,
    });

    if (!result.ok) {
      // Crítico: cargo cobrado pero persistencia falló. El webhook (idempotente)
      // hará el insert cuando llegue. Devolvemos OK al usuario para no bloquearlo.
      console.error(
        "Culqi fulfillment failed despite successful charge:",
        result.error,
      );
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
  } catch (error) {
    console.error("Culqi charge endpoint error:", error);
    return NextResponse.json(
      { error: "Error inesperado al procesar el pago" },
      { status: 500 },
    );
  }
}
