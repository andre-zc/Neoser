import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { calBookingWebhookSchema } from "@/lib/schemas";
import { verifyCalWebhookSignature } from "@/lib/cal";
import { syncBookingToHubspot } from "@/lib/hubspot";
import { syncBookingToBrevo } from "@/lib/brevo";
import { sendEmail } from "@/lib/email";

function mapBookingStatus(status?: string): "pending" | "confirmed" | "cancelled" | "rescheduled" {
  switch ((status || "").toLowerCase()) {
    case "accepted":
    case "confirmed":
      return "confirmed";
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "rescheduled":
      return "rescheduled";
    default:
      return "pending";
  }
}

function getAttendee(payload: { attendees?: Array<{ name?: string; email?: string; phoneNumber?: string }> }) {
  return payload.attendees?.[0];
}

// Cal.com manda los campos del formulario en `responses`. El formato varía:
// puede ser { value: ... } o el valor directo. Esta función normaliza ambos.
function getResponseValue(
  responses: Record<string, unknown> | undefined,
  key: string,
): string | undefined {
  const raw = responses?.[key];
  if (raw == null) return undefined;
  if (typeof raw === "object" && raw !== null && "value" in raw) {
    const v = (raw as { value: unknown }).value;
    if (v == null) return undefined;
    return typeof v === "string" ? v : String(v);
  }
  return typeof raw === "string" ? raw : String(raw);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature =
    request.headers.get("x-cal-signature-256") ||
    request.headers.get("x-cal-signature");

  if (!verifyCalWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Firma invalida" }, { status: 401 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload invalido" }, { status: 400 });
  }

  const parsed = calBookingWebhookSchema.safeParse(parsedBody);
  if (!parsed.success) {
    // Log detallado para diagnosticar qué campo del payload de Cal falló.
    console.error(
      "Cal webhook payload no soportado:",
      JSON.stringify(parsed.error.flatten()),
    );
    return NextResponse.json({ error: "Payload no soportado" }, { status: 400 });
  }

  const { payload } = parsed.data;
  const attendee = getAttendee(payload);
  const bookingStatus = mapBookingStatus(payload.status ?? parsed.data.triggerEvent);
  const supabase = createServiceClient();

  // Campos custom del formulario de reserva (Dr. Chacaliaza y otros event types)
  const responses = payload.responses as Record<string, unknown> | undefined;
  const motivoConsulta = getResponseValue(responses, "motivoConsulta");
  const edad = getResponseValue(responses, "edad");
  const comentarios = getResponseValue(responses, "comentarios");
  const contactoWhatsappRaw =
    responses?.["contactoWhatsapp"] ?? responses?.["contactoWhatsApp"];
  const quiereContactoWhatsapp =
    contactoWhatsappRaw === true ||
    contactoWhatsappRaw === "true" ||
    (typeof contactoWhatsappRaw === "object" &&
      contactoWhatsappRaw !== null &&
      "value" in contactoWhatsappRaw &&
      ((contactoWhatsappRaw as { value: unknown }).value === true ||
        (contactoWhatsappRaw as { value: unknown }).value === "true"));

  // Teléfono/email: preferimos attendee, con fallback a responses del form.
  const phone =
    attendee?.phoneNumber ||
    getResponseValue(responses, "phone") ||
    getResponseValue(responses, "attendeePhoneNumber") ||
    "000000000";
  const email =
    attendee?.email || getResponseValue(responses, "email") || null;

  // Componer notas legibles con todo lo que el form capturó.
  const notesParts: string[] = [];
  if (motivoConsulta) notesParts.push(`Motivo: ${motivoConsulta}`);
  if (edad) notesParts.push(`Edad: ${edad}`);
  if (comentarios) notesParts.push(`Comentarios: ${comentarios}`);
  notesParts.push(
    `Solicita contacto WhatsApp: ${quiereContactoWhatsapp ? "Sí" : "No"}`,
  );
  const notes = notesParts.join(" | ");

  const upsertPayload = {
    cal_booking_uid: payload.uid,
    full_name: attendee?.name || "Reserva Web NeoSer",
    email,
    phone,
    booking_status: bookingStatus,
    service_interest: motivoConsulta || payload.title || null,
    notes,
    cal_event_type_id: payload.eventTypeId ?? null,
    cal_starts_at: payload.startTime ?? null,
    cal_ends_at: payload.endTime ?? null,
    source: "cal_webhook",
  };

  const { data: booking, error } = await supabase
    .from("bookings")
    .upsert(upsertPayload, { onConflict: "cal_booking_uid" })
    .select("*")
    .single();

  if (error || !booking) {
    return NextResponse.json({ error: "No se pudo guardar reserva" }, { status: 500 });
  }

  try {
    await syncBookingToHubspot({
      bookingId: booking.id,
      fullName: booking.full_name,
      email: booking.email,
      phone: booking.phone,
      serviceInterest: booking.service_interest || undefined,
      preferredDate: booking.preferred_date || undefined,
      preferredTime: booking.preferred_time || undefined,
    });
  } catch (syncError) {
    console.error("HubSpot booking sync (cal webhook) failed:", syncError);
  }

  // Sync a Brevo (no-bloqueante). Solo si hay email (Brevo identifica por email).
  if (booking.email) {
    try {
      await syncBookingToBrevo({
        email: booking.email,
        fullName: booking.full_name,
        phone: booking.phone,
        bookingId: booking.id,
        serviceInterest: booking.service_interest || undefined,
      });
    } catch (error) {
      console.error("Brevo booking sync failed:", error);
    }
  }

  if (booking.email && bookingStatus === "confirmed") {
    try {
      const sendResult = await sendEmail({
        to: booking.email,
        subject: "Tu cita en NeoSer fue confirmada",
        html: `<p>Hola ${booking.full_name},</p><p>Tu reserva fue confirmada para ${booking.cal_starts_at || "el horario seleccionado"}.</p>`,
      });

      await supabase.from("email_events").insert({
        booking_id: booking.id,
        provider: sendResult.provider,
        template_key: "confirmacion_reserva",
        recipient_email: booking.email,
        status: sendResult.status,
        metadata: sendResult.data,
      });
    } catch (emailError) {
      console.error("Booking confirmation email failed:", emailError);
    }
  }

  return NextResponse.json({ ok: true });
}

