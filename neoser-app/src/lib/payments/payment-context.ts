import "server-only";

import QRCode from "qrcode";
import { createServiceClient } from "@/lib/supabase/service";
import {
  isPaymentQaRawPayload,
  PAYMENT_QA_COURSE_ID,
} from "@/lib/payments/payment-qa";

export const PROTOCOLS_COURSE_ID =
  "9a8b7c6d-eeee-4eee-aeee-eeeeeeeeeeee";
export const PROTOCOLS_COURSE_TITLE =
  "Protocolos para un Nacimiento Humanizado";
export const PROTOCOLS_CONFIRMATION_WHATSAPP = "51959798948";

export function getProtocolsWhatsappGroupUrl(): string | null {
  const configuredUrl = process.env.PROTOCOLS_WHATSAPP_GROUP_URL?.trim();
  if (!configuredUrl) return null;

  try {
    const groupUrl = new URL(configuredUrl);
    const isWhatsappInvite =
      groupUrl.protocol === "https:" &&
      groupUrl.hostname === "chat.whatsapp.com" &&
      /^\/[A-Za-z0-9]+$/.test(groupUrl.pathname);

    if (!isWhatsappInvite) return null;

    return `${groupUrl.origin}${groupUrl.pathname}`;
  } catch {
    return null;
  }
}

type PaymentContext = {
  kind: "course" | "payment_qa";
  status: string;
  provider: string;
  courseId: string;
  registrationCompleted: boolean;
};

/**
 * Resuelve solo los datos mínimos necesarios para adaptar el cierre de compra.
 * Nunca devuelve información personal del participante.
 */
export async function getPaymentContext(
  reference?: string,
): Promise<PaymentContext | null> {
  const normalizedReference = reference?.trim();
  if (!normalizedReference || normalizedReference.length > 120) return null;

  try {
    const supabase = createServiceClient();
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("status, payment_provider, enrollment_id, raw_payload")
      .eq("provider_payment_id", normalizedReference)
      .maybeSingle();

    if (paymentError || !payment) return null;

    if (isPaymentQaRawPayload(payment.raw_payload)) {
      return {
        kind: "payment_qa",
        status: payment.status,
        provider: payment.payment_provider,
        courseId: PAYMENT_QA_COURSE_ID,
        registrationCompleted: false,
      };
    }

    if (!payment.enrollment_id) return null;

    let { data: enrollment, error: enrollmentError } = await supabase
      .from("enrollments")
      .select("course_id, registration_details_completed_at")
      .eq("id", payment.enrollment_id)
      .maybeSingle();

    // Permite desplegar el código antes de ejecutar la migración sin romper la
    // confirmación de compras existentes. Mientras falte la columna se conserva
    // temporalmente el acceso anterior; el formulario se activa al migrar la BD.
    if (
      enrollmentError &&
      ["42703", "PGRST204"].includes(enrollmentError.code)
    ) {
      const fallback = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("id", payment.enrollment_id)
        .maybeSingle();

      enrollment = fallback.data
        ? {
            ...fallback.data,
            registration_details_completed_at: "migration_pending",
          }
        : null;
      enrollmentError = fallback.error;
    }

    if (enrollmentError || !enrollment?.course_id) return null;

    return {
      kind: "course",
      status: payment.status,
      provider: payment.payment_provider,
      courseId: enrollment.course_id,
      registrationCompleted: Boolean(
        enrollment.registration_details_completed_at,
      ),
    };
  } catch {
    // El cierre de compra genérico debe seguir disponible ante una caída externa.
    return null;
  }
}

export function buildProtocolsWhatsappHref({
  reference,
  paypalPending = false,
}: {
  reference?: string;
  paypalPending?: boolean;
}) {
  const referenceText = reference?.trim()
    ? ` Mi referencia es ${reference.trim()}.`
    : "";
  const message = paypalPending
    ? `Hola NeoSer, ya realicé el pago por PayPal para el curso ${PROTOCOLS_COURSE_TITLE}.${referenceText} Adjunto mi comprobante para que puedan validar el pago y enviarme el acceso al grupo de WhatsApp del curso.`
    : `Hola NeoSer, ya realicé el pago y mi inscripción al curso ${PROTOCOLS_COURSE_TITLE} fue confirmada.${referenceText} Quisiera ingresar al grupo de WhatsApp del curso.`;

  return `https://wa.me/${PROTOCOLS_CONFIRMATION_WHATSAPP}?text=${encodeURIComponent(
    message,
  )}`;
}

export async function buildWhatsappQrDataUrl(
  whatsappHref: string,
): Promise<string | null> {
  try {
    return await QRCode.toDataURL(whatsappHref, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 184,
      color: {
        dark: "#1B3A6B",
        light: "#FFFFFF",
      },
    });
  } catch {
    // El botón continúa disponible aunque la imagen QR no pueda generarse.
    return null;
  }
}
