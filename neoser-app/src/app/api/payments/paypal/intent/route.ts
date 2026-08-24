/**
 * PayPal — registra la INTENCIÓN de pago internacional y devuelve el enlace.
 *
 * ⚠️ Diferencia clave con Culqi: PayPal.me no confirma el pago (no hay webhook),
 * así que este endpoint NO puede saber si la persona pagó. Lo que hace es:
 *   1. Registrar la inscripción como PENDIENTE (enrollment + payment 'pending').
 *   2. Avisar a NeoSer por correo para que verifique el pago en PayPal.
 *   3. Devolver el enlace de PayPal.me con el monto pre-cargado.
 *
 * La confirmación del pago es MANUAL: Diana verifica en PayPal y pasa el
 * enrollment a 'paid' / el payment a 'approved'.
 *
 * El monto NO viene del cliente: se resuelve del catálogo por courseId para
 * evitar manipulación del precio.
 */

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { paypalIntentRequestSchema } from "@/lib/schemas";
import { coursesCatalog } from "@/lib/courses-catalog";
import {
  buildPaypalMeUrl,
  buildPaypalReference,
  PAYPAL_CURRENCY,
} from "@/lib/payments/paypal";
import { syncPendingPaypalEnrollmentToHubspot } from "@/lib/hubspot";
import { syncEnrollmentToBrevo } from "@/lib/brevo";
import {
  sendEmail,
  buildPaypalPendingInternalEmail,
  buildPaypalInstructionsEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = paypalIntentRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const d = parsed.data;

    // Precio resuelto en el servidor desde el catálogo (nunca del cliente).
    const course = coursesCatalog.find((c) => c.id === d.courseId);
    if (!course) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }
    if (!course.priceUSD || course.priceUSD <= 0) {
      return NextResponse.json(
        {
          error:
            "Este curso no tiene tarifa internacional publicada. Coordina por WhatsApp.",
        },
        { status: 409 },
      );
    }

    const amountUsd = course.priceUSD;
    const reference = buildPaypalReference();
    const paypalUrl = buildPaypalMeUrl({
      amount: amountUsd,
      currency: PAYPAL_CURRENCY,
    });

    const supabase = createServiceClient();

    // 1. Lead — 'propuesta_enviada': se le entregó el enlace de pago pero
    //    todavía no está inscrito (eso sería 'inscrito').
    const { data: lead, error: leadError } = await supabase
      .from("contact_leads")
      .insert({
        full_name: d.guestName,
        email: d.guestEmail,
        phone: d.guestPhone,
        message:
          d.notes ||
          `Inscripción internacional (PayPal ${reference}) — ${course.title}` +
            (d.country ? ` · País: ${d.country}` : ""),
        source: d.utmSource || "paypal_internacional",
        wa_consent: false,
        marketing_consent: d.marketingConsent ?? false,
        marketing_consent_at: d.marketingConsent
          ? new Date().toISOString()
          : null,
        lead_status: "propuesta_enviada",
      })
      .select("id")
      .single();

    if (leadError || !lead) {
      return NextResponse.json(
        { error: "No se pudo registrar la inscripción" },
        { status: 500 },
      );
    }

    // 2. Enrollment PENDIENTE
    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .insert({
        course_id: d.courseId,
        guest_name: d.guestName,
        guest_email: d.guestEmail,
        guest_phone: d.guestPhone,
        notes: d.notes ?? null,
        status: "pending",
        lead_id: lead.id,
      })
      .select("id")
      .single();

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: "No se pudo registrar la inscripción" },
        { status: 500 },
      );
    }

    // 3. Payment PENDIENTE. provider_payment_id = nuestra referencia, porque
    //    PayPal.me no nos entrega un id de transacción.
    const { error: paymentError } = await supabase.from("payments").insert({
      enrollment_id: enrollment.id,
      lead_id: lead.id,
      payment_provider: "paypal",
      provider_payment_id: reference,
      amount: amountUsd,
      currency: PAYPAL_CURRENCY,
      status: "pending",
      raw_payload: {
        reference,
        paypalUrl,
        country: d.country ?? null,
        courseTitle: course.title,
      },
    });

    if (paymentError) {
      console.error("PayPal payment insert failed:", paymentError.message);
    }

    const emailInput = {
      guestName: d.guestName,
      guestEmail: d.guestEmail,
      guestPhone: d.guestPhone,
      courseTitle: course.title,
      amountUsd,
      reference,
      country: d.country,
      paypalUrl,
    };

    // 4. Aviso interno a NeoSer (no-bloqueante). Es lo que permite que Diana
    //    cruce el ingreso de PayPal con la persona y el curso.
    try {
      const to =
        process.env.COORDINATION_NOTIFY_EMAIL ||
        process.env.EMAIL_FROM ||
        "neoser.admin@gmail.com";
      const { subject, html } = buildPaypalPendingInternalEmail(emailInput);
      await sendEmail({ to, subject, html });
    } catch (err) {
      console.error("PayPal internal notification failed:", err);
    }

    // 5. Instrucciones al cliente (no-bloqueante)
    try {
      const { subject, html } = buildPaypalInstructionsEmail(emailInput);
      await sendEmail({ to: d.guestEmail, subject, html });
    } catch (err) {
      console.error("PayPal instructions email failed:", err);
    }

    // 6. CRM (no-bloqueante)
    try {
      await syncPendingPaypalEnrollmentToHubspot({
        fullName: d.guestName,
        email: d.guestEmail,
        phone: d.guestPhone,
        courseName: course.title,
        amount: amountUsd,
        reference,
        country: d.country,
      });
    } catch (err) {
      console.error("HubSpot pending enrollment sync failed:", err);
    }

    try {
      await syncEnrollmentToBrevo({
        email: d.guestEmail,
        fullName: d.guestName,
        phone: d.guestPhone,
        courseName: course.title,
        amount: amountUsd,
        marketingConsent: d.marketingConsent,
      });
    } catch (err) {
      console.error("Brevo pending enrollment sync failed:", err);
    }

    return NextResponse.json(
      { ok: true, paypalUrl, reference, amountUsd, currency: PAYPAL_CURRENCY },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
