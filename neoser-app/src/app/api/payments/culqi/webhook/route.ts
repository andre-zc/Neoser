/**
 * POST /api/payments/culqi/webhook
 *
 * Recibe eventos asíncronos de Culqi (confirmaciones, refunds, etc).
 * Valida firma HMAC, valida payload con Zod, y delega:
 *  - charge.creation.succeeded → fulfillSuccessfulCharge (idempotente)
 *  - refund.creation.succeeded → marca payment como 'refunded'
 *  - charge.creation.failed    → ignora (ya manejado en /charge)
 *
 * Configurar URL en CulqiPanel > Webhooks y mismo secret en CULQI_WEBHOOK_SECRET.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { culqiWebhookSchema } from "@/lib/schemas";
import {
  verifyCulqiWebhookSignature,
  mapCulqiEventToPaymentStatus,
} from "@/lib/payments/culqi";
import { fulfillSuccessfulCharge } from "@/lib/payments/culqi-fulfillment";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  // Culqi usa nombres de header que pueden variar según versión del panel.
  // Probamos los más comunes.
  const signature =
    request.headers.get("x-culqi-signature") ||
    request.headers.get("culqi-signature") ||
    request.headers.get("x-culqi-signature-256");

  if (!verifyCulqiWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
  }

  let eventRaw: unknown;
  try {
    eventRaw = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
  }

  const parsed = culqiWebhookSchema.safeParse(eventRaw);
  if (!parsed.success) {
    console.error(
      "Culqi webhook payload no soportado:",
      JSON.stringify(parsed.error.flatten()),
    );
    return NextResponse.json(
      { error: "Payload no soportado" },
      { status: 400 },
    );
  }

  const event = parsed.data;
  const newStatus = mapCulqiEventToPaymentStatus(event.type);
  const supabase = createServiceClient();

  // === charge.creation.succeeded → approved ===
  if (newStatus === "approved") {
    const md = event.data.metadata ?? {};

    // Necesitamos la metadata completa para crear lead/enrollment.
    // Si falta (ej. cargo creado fuera del flow del sitio), solo actualizamos
    // el payment a approved si existe.
    if (
      !md.courseId ||
      !md.guestName ||
      !md.guestEmail ||
      !md.guestPhone ||
      !md.courseTitle
    ) {
      const { error } = await supabase
        .from("payments")
        .update({
          status: "approved",
          paid_at: new Date().toISOString(),
          raw_payload: event.data,
        })
        .eq("provider_payment_id", event.data.id);

      if (error) {
        console.error("Webhook update (partial) failed:", error);
      }
      return NextResponse.json({ ok: true, partial: true });
    }

    // Idempotente: si /charge ya hizo el fulfillment, devuelve alreadyProcessed.
    const result = await fulfillSuccessfulCharge({
      chargeId: event.data.id,
      amountCents: event.data.amount ?? 0,
      currency: event.data.currency_code ?? "PEN",
      paymentMethod: event.data.source?.type,
      metadata: {
        courseId: md.courseId,
        courseTitle: md.courseTitle,
        guestName: md.guestName,
        guestEmail: md.guestEmail,
        guestPhone: md.guestPhone,
        notes: md.notes,
        utmSource: md.utmSource,
      },
      rawPayload: event.data,
    });

    if (!result.ok) {
      console.error("Webhook fulfillment failed:", result.error);
      return NextResponse.json(
        { error: "Error procesando webhook" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      alreadyProcessed: result.alreadyProcessed,
      leadId: result.leadId,
      enrollmentId: result.enrollmentId,
    });
  }

  // === refund.creation.succeeded → refunded ===
  if (newStatus === "refunded") {
    const { error } = await supabase
      .from("payments")
      .update({ status: "refunded", raw_payload: event.data })
      .eq("provider_payment_id", event.data.id);

    if (error) {
      console.error("Webhook refund update failed:", error);
      return NextResponse.json(
        { error: "No se pudo registrar refund" },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  // === charge.creation.failed → ya manejado en /charge, solo log ===
  if (newStatus === "rejected") {
    return NextResponse.json({
      ok: true,
      ignored: "already_handled_in_charge_endpoint",
    });
  }

  // === otros eventos (pending, charges no relevantes) ===
  return NextResponse.json({ ok: true, ignored: event.type });
}
