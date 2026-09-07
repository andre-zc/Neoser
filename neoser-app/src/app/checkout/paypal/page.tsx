import Link from "next/link";
import type { Metadata } from "next";
import { buildPaypalMeUrl } from "@/lib/payments/paypal";
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from "@/lib/courses-catalog";
import {
  buildProtocolsWhatsappHref,
  getPaymentContext,
  PROTOCOLS_COURSE_ID,
} from "@/lib/payments/payment-context";

export const metadata: Metadata = {
  title: "Completa tu pago",
  robots: { index: false, follow: false },
};

/**
 * Pantalla posterior al envío del formulario de inscripción internacional.
 *
 * PayPal se abre en otra pestaña; esta página queda como "hoja de ruta": lleva
 * la referencia del pago y el CTA para mandar el comprobante. Es importante que
 * exista porque el cupo NO queda confirmado con el pago en sí (PayPal.me no nos
 * avisa), sino cuando NeoSer verifica la transferencia.
 */
export default async function PaypalPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; amount?: string }>;
}) {
  const { ref, amount } = await searchParams;
  const reference = ref?.trim() || null;
  const amountUsd = amount ? Number(amount) : null;
  const paymentContext = await getPaymentContext(reference ?? undefined);
  const isProtocolsPayment =
    paymentContext?.courseId === PROTOCOLS_COURSE_ID;

  const paypalUrl = buildPaypalMeUrl({ amount: amountUsd, currency: "USD" });

  const waText = encodeURIComponent(
    `Hola NeoSer, acabo de realizar el pago de mi inscripción por PayPal${
      reference ? ` (referencia ${reference})` : ""
    }. Les envío el comprobante.`,
  );
  const waHref = isProtocolsPayment
    ? buildProtocolsWhatsappHref({
        reference: reference ?? undefined,
        paypalPending: true,
      })
    : `https://wa.me/${CONTACT_WHATSAPP}?text=${waText}`;

  return (
    <main className="min-h-screen bg-cream py-16 md:py-24">
      <div className="container-main mx-auto max-w-2xl">
        <div className="surface-card p-8 md:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-light">
            <svg
              className="h-8 w-8 text-blue"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>

          <h1 className="text-center text-2xl font-bold text-navy md:text-3xl">
            Completa tu pago en PayPal
          </h1>
          <p className="mt-3 text-center leading-relaxed text-gray-500">
            Abrimos PayPal en otra pestaña. Registramos tus datos y te enviamos
            las instrucciones por correo.
          </p>

          {reference && (
            <div className="mt-6 rounded-xl bg-cream p-5 text-center">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Tu referencia de pago
              </p>
              <p className="mt-1 font-mono text-xl font-bold text-navy">
                {reference}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                Escríbela en la nota de PayPal para que podamos identificar tu
                pago rápidamente.
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <a
              href={paypalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0070BA] px-6 py-3 font-semibold text-white transition hover:bg-[#005c99]"
            >
              Abrir PayPal de nuevo
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:bg-[#1ebe5d]"
            >
              {isProtocolsPayment
                ? "Avisar mi pago por WhatsApp"
                : "Enviar comprobante por WhatsApp"}
            </a>
          </div>

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="mb-1 text-sm font-bold text-amber-900">
              Tu cupo se confirma tras verificar el pago
            </p>
            <p className="text-sm leading-relaxed text-amber-800">
              Cuando recibamos y verifiquemos tu pago, te enviaremos la
              confirmación de inscripción por correo. Enviar el comprobante por
              WhatsApp acelera el proceso.
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Tuviste algún problema? Escríbenos a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-pink hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>

          <div className="mt-8 text-center">
            <Link href="/cursos" className="btn-pink-outline text-sm">
              ← Volver a los cursos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
