/**
 * Culqi — fulfillment del flow post-cargo.
 *
 * Lógica compartida entre /api/payments/culqi/charge (camino feliz cuando el
 * cargo es 200 inmediato) y /api/payments/culqi/webhook (fallback async / refunds).
 *
 * Idempotencia: ambos endpoints pueden invocar fulfillSuccessfulCharge() con el
 * mismo chargeId. La primera invocación crea lead+enrollment+payment, las
 * siguientes detectan que ya existe payment con status=approved y devuelven
 * alreadyProcessed:true sin duplicar nada.
 *
 * El índice único parcial sobre payments.provider_payment_id (migration 004)
 * garantiza que el upsert con onConflict funcione correctamente.
 */

import { createServiceClient } from "@/lib/supabase/service";
import { syncEnrollmentToHubspot } from "@/lib/hubspot";
import { syncEnrollmentToBrevo } from "@/lib/brevo";
import { sendEmail, buildEnrollmentConfirmationEmail } from "@/lib/email";

export type FulfillmentMetadata = {
  courseId: string;
  courseTitle: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  notes?: string;
  utmSource?: string;
};

export type FulfillmentInput = {
  chargeId: string; // chr_xxx (Culqi). Se guarda como provider_payment_id.
  amountCents: number;
  currency: string;
  paymentMethod?: string; // "card" | "yape" | ...
  metadata: FulfillmentMetadata;
  rawPayload: unknown;
};

export type FulfillmentResult = {
  ok: boolean;
  alreadyProcessed?: boolean;
  leadId?: string;
  enrollmentId?: string;
  paymentId?: string;
  error?: string;
};

/**
 * Procesa un cargo exitoso de Culqi:
 *  1. Verifica idempotencia (si ya está approved, no hace nada).
 *  2. Crea contact_lead con lead_status='inscrito'.
 *  3. Crea enrollment con status='paid'.
 *  4. Upserta payment con status='approved'.
 *  5. Dispara sync HubSpot, Brevo y email (cada uno no-bloqueante).
 *
 * Devuelve los IDs creados o un flag alreadyProcessed.
 */
export async function fulfillSuccessfulCharge(
  input: FulfillmentInput,
): Promise<FulfillmentResult> {
  const supabase = createServiceClient();
  const { chargeId, amountCents, currency, metadata, rawPayload } = input;
  const amountSoles = amountCents / 100; // payments.amount es soles decimal

  // 1. Idempotencia
  const { data: existing } = await supabase
    .from("payments")
    .select("id, status")
    .eq("provider_payment_id", chargeId)
    .maybeSingle();

  if (existing && existing.status === "approved") {
    return { ok: true, alreadyProcessed: true, paymentId: existing.id };
  }

  try {
    // 2. Crear lead
    const { data: lead, error: leadError } = await supabase
      .from("contact_leads")
      .insert({
        full_name: metadata.guestName,
        email: metadata.guestEmail,
        phone: metadata.guestPhone,
        message:
          metadata.notes ||
          `Inscripción en curso "${metadata.courseTitle}" (charge: ${chargeId})`,
        source: metadata.utmSource || "course_enrollment",
        wa_consent: false,
        lead_status: "inscrito",
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      throw new Error(`No se pudo crear lead: ${leadError?.message}`);
    }

    // 3. Crear enrollment (status=paid)
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .insert({
        course_id: metadata.courseId,
        guest_name: metadata.guestName,
        guest_email: metadata.guestEmail,
        guest_phone: metadata.guestPhone,
        notes: metadata.notes ?? null,
        status: "paid",
        lead_id: lead.id,
      })
      .select("id")
      .single();

    if (enrollmentError || !enrollment) {
      throw new Error(
        `No se pudo crear enrollment: ${enrollmentError?.message}`,
      );
    }

    // 4. Upsert payment con status=approved.
    // onConflict provider_payment_id => si el endpoint /charge ya insertó
    // una fila pending, la actualizamos en lugar de crear duplicado.
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .upsert(
        {
          enrollment_id: enrollment.id,
          lead_id: lead.id,
          payment_provider: "culqi",
          provider_payment_id: chargeId,
          amount: amountSoles,
          currency,
          status: "approved",
          raw_payload: rawPayload as object | null,
          paid_at: new Date().toISOString(),
        },
        { onConflict: "provider_payment_id" },
      )
      .select("id")
      .single();

    if (paymentError || !payment) {
      throw new Error(
        `No se pudo crear payment: ${paymentError?.message}`,
      );
    }

    // 5a. Sync HubSpot (no-bloqueante)
    try {
      await syncEnrollmentToHubspot({
        fullName: metadata.guestName,
        email: metadata.guestEmail,
        phone: metadata.guestPhone,
        courseName: metadata.courseTitle,
        amount: amountSoles,
        orderReference: chargeId,
        source: metadata.utmSource || "course_enrollment",
      });
    } catch (err) {
      console.error("HubSpot enrollment sync failed:", err);
    }

    // 5b. Sync Brevo (no-bloqueante)
    try {
      await syncEnrollmentToBrevo({
        email: metadata.guestEmail,
        fullName: metadata.guestName,
        phone: metadata.guestPhone,
        courseName: metadata.courseTitle,
        amount: amountSoles,
      });
    } catch (err) {
      console.error("Brevo enrollment sync failed:", err);
    }

    // 5c. Email confirmación (no-bloqueante)
    try {
      const { subject, html } = buildEnrollmentConfirmationEmail({
        guestName: metadata.guestName,
        courseTitle: metadata.courseTitle,
        amount: amountSoles,
        currency,
        orderReference: chargeId,
      });
      await sendEmail({ to: metadata.guestEmail, subject, html });
    } catch (err) {
      console.error("Confirmation email failed:", err);
    }

    return {
      ok: true,
      leadId: lead.id,
      enrollmentId: enrollment.id,
      paymentId: payment.id,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "unknown",
    };
  }
}

/**
 * Registra un intento de cargo fallido (sin lead/enrollment) para auditoría.
 * Útil para diagnosticar tarjetas rechazadas y patrones de fraude.
 */
export async function recordFailedCharge(input: {
  chargeId?: string;
  amountCents: number;
  currency: string;
  rawPayload: unknown;
}): Promise<{ paymentId?: string }> {
  // Sin chargeId no hay identificador único: solo logueamos y omitimos.
  if (!input.chargeId) {
    console.warn("[culqi] charge fallido sin chargeId, no se registra");
    return {};
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("payments")
    .upsert(
      {
        enrollment_id: null,
        lead_id: null,
        payment_provider: "culqi",
        provider_payment_id: input.chargeId,
        amount: input.amountCents / 100,
        currency: input.currency,
        status: "rejected",
        raw_payload: input.rawPayload as object | null,
      },
      { onConflict: "provider_payment_id" },
    )
    .select("id")
    .single();

  if (error) {
    console.error("recordFailedCharge failed:", error);
    return {};
  }
  return { paymentId: data?.id };
}
