import { NextRequest, NextResponse } from "next/server";
import {
  buildProtocolsRegistrationNotificationEmail,
  sendEmail,
} from "@/lib/email";
import {
  PROTOCOLS_COURSE_ID,
  PROTOCOLS_COURSE_TITLE,
} from "@/lib/payments/payment-context";
import { protocolsRegistrationSchema } from "@/lib/schemas";
import { createServiceClient } from "@/lib/supabase/service";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function requestComesFromThisSite(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0];
  const host = forwardedHost?.trim() || request.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!requestComesFromThisSite(request)) {
    return NextResponse.json(
      { error: "Solicitud no permitida" },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const parsed = protocolsRegistrationSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos del formulario" },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }

    const data = parsed.data;
    const supabase = createServiceClient();
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select(
        "enrollment_id, provider_payment_id, payment_provider, amount, currency, paid_at",
      )
      .eq("provider_payment_id", data.reference)
      .eq("payment_provider", "culqi")
      .eq("status", "approved")
      .maybeSingle();

    if (paymentError) {
      console.error("[protocolos/registration] consulta de pago falló", {
        errorCode: paymentError.code,
      });
      return NextResponse.json(
        { error: "No pudimos verificar el pago. Inténtalo nuevamente." },
        { status: 503, headers: NO_STORE_HEADERS },
      );
    }

    if (!payment?.enrollment_id) {
      return NextResponse.json(
        { error: "No encontramos una inscripción aprobada para este pago." },
        { status: 404, headers: NO_STORE_HEADERS },
      );
    }

    const { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("course_id, registration_details_completed_at")
      .eq("id", payment.enrollment_id)
      .maybeSingle();

    if (enrollmentError) {
      console.error("[protocolos/registration] consulta de matrícula falló", {
        errorCode: enrollmentError.code,
      });
      return NextResponse.json(
        { error: "No pudimos verificar la inscripción. Inténtalo nuevamente." },
        { status: 503, headers: NO_STORE_HEADERS },
      );
    }

    if (!enrollment || enrollment.course_id !== PROTOCOLS_COURSE_ID) {
      return NextResponse.json(
        { error: "Esta inscripción no corresponde al curso." },
        { status: 404, headers: NO_STORE_HEADERS },
      );
    }

    // El registro es de una sola escritura. Si el enlace de pago se comparte,
    // nadie puede reemplazar posteriormente los datos ya confirmados.
    if (enrollment.registration_details_completed_at) {
      return NextResponse.json(
        { ok: true, alreadyCompleted: true },
        { headers: NO_STORE_HEADERS },
      );
    }

    const completedAt = new Date().toISOString();
    const { data: updatedEnrollment, error: updateError } = await supabase
      .from("enrollments")
      .update({
        guest_name: data.fullName,
        guest_email: data.email,
        guest_phone: data.whatsappPhone,
        identity_document: data.identityDocument,
        profession: data.profession,
        workplace: data.workplace,
        city: data.city,
        country: data.country,
        registration_details_completed_at: completedAt,
      })
      .eq("id", payment.enrollment_id)
      .is("registration_details_completed_at", null)
      .select("id")
      .maybeSingle();

    if (updateError) {
      console.error("[protocolos/registration] guardado falló", {
        errorCode: updateError.code,
      });
      return NextResponse.json(
        { error: "No pudimos guardar los datos. Inténtalo nuevamente." },
        { status: 500, headers: NO_STORE_HEADERS },
      );
    }

    if (!updatedEnrollment) {
      // Otro envío pudo completarlo simultáneamente. No se reescribe.
      return NextResponse.json(
        { ok: true, alreadyCompleted: true },
        { headers: NO_STORE_HEADERS },
      );
    }

    // El correo se intenta después de persistir la inscripción. Si el proveedor
    // tiene una caída temporal, la participante conserva su acceso al grupo y
    // los datos completos siguen disponibles en Supabase.
    try {
      const notificationEmail =
        process.env.ENROLLMENT_NOTIFY_EMAIL?.trim() ||
        "neoser.admin@gmail.com";
      const { subject, html } =
        buildProtocolsRegistrationNotificationEmail({
          fullName: data.fullName,
          identityDocument: data.identityDocument,
          whatsappPhone: data.whatsappPhone,
          email: data.email,
          profession: data.profession,
          workplace: data.workplace,
          city: data.city,
          country: data.country,
          courseTitle: PROTOCOLS_COURSE_TITLE,
          paymentReference: payment.provider_payment_id,
          paymentProvider: payment.payment_provider,
          amount: Number(payment.amount),
          currency: payment.currency,
          paidAt: payment.paid_at,
          completedAt,
        });

      await sendEmail({ to: notificationEmail, subject, html });
    } catch {
      console.error(
        "[protocolos/registration] aviso interno por correo falló",
      );
    }

    return NextResponse.json({ ok: true }, { headers: NO_STORE_HEADERS });
  } catch {
    console.error("[protocolos/registration] error inesperado");
    return NextResponse.json(
      { error: "Ocurrió un error inesperado. Inténtalo nuevamente." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
