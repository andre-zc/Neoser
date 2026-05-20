import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { izipayWebhookSchema } from "@/lib/schemas";
import {
  verifyIzipayWebhookSignature,
  parseIzipayWebhookPayload,
  isMockMode,
} from "@/lib/payments/izipay";
import { syncEnrollmentToHubspot } from "@/lib/hubspot";
import { syncEnrollmentToBrevo } from "@/lib/brevo";
import { sendEmail, buildEnrollmentConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-izipay-signature-256") ||
    request.headers.get("x-izipay-signature");

  if (!verifyIzipayWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
  }

  const eventRaw = parseIzipayWebhookPayload(rawBody);
  if (!eventRaw) {
    return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
  }

  const parsed = izipayWebhookSchema.safeParse(eventRaw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload no soportado", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const event = parsed.data;

  // Hardening: rechazar transactionIds mock cuando NO estamos en modo mock
  if (!isMockMode() && event.transactionId.startsWith("mock_")) {
    return NextResponse.json(
      { error: "Mock transactions no permitidas en produccion" },
      { status: 403 },
    );
  }

  // Solo procesar pagos confirmados
  if (event.status !== "AUTHORIZED") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const supabase = createServiceClient();
  const { metadata, transactionId, amount, currency, orderReference } = event;

  try {
    // 1. Crear contact_lead (lead se guarda solo después del pago)
    const { data: lead, error: leadError } = await supabase
      .from("contact_leads")
      .insert({
        full_name: metadata.guestName,
        email: metadata.guestEmail,
        phone: metadata.guestPhone,
        message:
          metadata.notes ||
          `Inscripción en curso (orderRef: ${orderReference})`,
        source: metadata.utmSource || "course_enrollment",
        wa_consent: false,
        lead_status: "inscrito",
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      throw new Error(`No se pudo crear lead: ${leadError?.message}`);
    }

    // 2. Crear enrollment con status="paid"
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

    // 3. Crear payment con status="approved"
    const { error: paymentError } = await supabase.from("payments").insert({
      enrollment_id: enrollment.id,
      lead_id: lead.id,
      payment_provider: "izipay",
      provider_payment_id: transactionId,
      amount,
      currency,
      status: "approved",
      raw_payload: event.raw ?? null,
      paid_at: new Date().toISOString(),
    });

    if (paymentError) {
      throw new Error(`No se pudo crear payment: ${paymentError.message}`);
    }

    // Fetch course title para HubSpot + email (no-bloqueante)
    const { data: course } = await supabase
      .from("courses")
      .select("title")
      .eq("id", metadata.courseId)
      .single();
    const courseTitle = course?.title ?? "Curso NeoSer";
    const source = metadata.utmSource || "course_enrollment";

    // Sync HubSpot (no-bloqueante: si falla, log y seguir)
    try {
      await syncEnrollmentToHubspot({
        fullName: metadata.guestName,
        email: metadata.guestEmail,
        phone: metadata.guestPhone,
        courseName: courseTitle,
        amount,
        orderReference,
        source,
      });
    } catch (error) {
      console.error("HubSpot enrollment sync failed:", error);
    }

    // Sync a Brevo (no-bloqueante)
    try {
      await syncEnrollmentToBrevo({
        email: metadata.guestEmail,
        fullName: metadata.guestName,
        phone: metadata.guestPhone,
        courseName: courseTitle,
        amount,
      });
    } catch (error) {
      console.error("Brevo enrollment sync failed:", error);
    }

    // Email confirmación al cliente (no-bloqueante)
    try {
      const { subject, html } = buildEnrollmentConfirmationEmail({
        guestName: metadata.guestName,
        courseTitle,
        amount,
        currency,
        orderReference,
      });
      await sendEmail({ to: metadata.guestEmail, subject, html });
    } catch (error) {
      console.error("Enrollment confirmation email failed:", error);
    }

    return NextResponse.json({
      ok: true,
      leadId: lead.id,
      enrollmentId: enrollment.id,
    });
  } catch (error) {
    console.error("Izipay webhook error:", error);
    return NextResponse.json(
      { error: "Error procesando pago" },
      { status: 500 },
    );
  }
}
