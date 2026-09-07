import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AlertTriangle, BadgeCheck, CreditCard, ShieldCheck } from "lucide-react";
import { CourseEnrollmentForm } from "@/components/course-enrollment-form";
import { PaymentQaAccessForm } from "@/components/payment-qa-access-form";
import {
  getCulqiEnvironment,
  PAYMENT_QA_COOKIE_NAME,
  PAYMENT_QA_COURSE_ID,
  PAYMENT_QA_PRICE_PEN,
  PAYMENT_QA_PRICE_USD,
  PAYMENT_QA_TITLE,
  verifyPaymentQaSession,
} from "@/lib/payments/payment-qa";

export const metadata: Metadata = {
  title: "Prueba privada de pagos",
  description: "Página interna para verificar cobros reales de NeoSer.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ProtocolsPaymentQaPage() {
  const cookieStore = await cookies();
  const hasAccess = verifyPaymentQaSession(
    cookieStore.get(PAYMENT_QA_COOKIE_NAME)?.value,
  );

  if (!hasAccess) return <PaymentQaAccessForm />;

  const culqiEnvironment = getCulqiEnvironment();
  const isLive = culqiEnvironment === "live";
  const isConfigured = culqiEnvironment !== "invalid";

  return (
    <main className="min-h-screen bg-cream py-10 md:py-16">
      <div className="container-main mx-auto max-w-3xl">
        <header className="rounded-[2rem] bg-navy px-7 py-8 text-white shadow-[0_20px_60px_rgba(15,37,72,0.16)] sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <CreditCard className="h-7 w-7 text-pink-light" />
              </div>
              <h1 className="mt-6 text-3xl leading-tight text-white sm:text-4xl">
                Laboratorio de cobros de Protocolos
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
                Esta página reproduce el checkout de Culqi sin modificar el
                precio ni las inscripciones del curso publicado.
              </p>
            </div>
            <div
              className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full px-4 py-2 text-xs font-bold ${
                isLive
                  ? "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/30"
                  : isConfigured
                    ? "bg-amber-300/15 text-amber-100 ring-1 ring-amber-200/30"
                    : "bg-red-300/15 text-red-100 ring-1 ring-red-200/30"
              }`}
            >
              {isLive ? (
                <BadgeCheck className="h-4 w-4" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {isLive
                ? "Culqi en producción"
                : isConfigured
                  ? "Culqi en modo de pruebas"
                  : "Configuración incompleta"}
            </div>
          </div>
        </header>

        <section
          className={`mt-5 flex gap-3 rounded-2xl border p-5 ${
            isLive
              ? "border-amber-300 bg-amber-50 text-amber-950"
              : isConfigured
                ? "border-blue-200 bg-blue-50 text-navy"
                : "border-red-200 bg-red-50 text-red-950"
          }`}
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">
              {isLive
                ? "Este formulario realizará un cobro real"
                : isConfigured
                  ? "Este formulario todavía usa las llaves de prueba de Culqi"
                  : "Las llaves de Culqi no están configuradas correctamente"}
            </p>
            <p className="mt-1 text-sm leading-relaxed opacity-80">
              {isLive
                ? "La tarjeta o Yape seleccionados serán debitados. Culqi descontará su comisión del abono."
                : isConfigured
                  ? "Puedes revisar el flujo, pero no se debitará dinero hasta configurar las llaves live en DigitalOcean."
                  : "Revisa que la llave pública y la llave secreta sean del mismo entorno antes de intentar un cobro."}
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-navy/10 bg-white p-5">
            <p className="text-sm font-semibold text-gray-500">Prueba en soles</p>
            <p className="mt-1 text-3xl font-bold text-navy">S/ 5.00</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Tarjeta nacional o Yape.
            </p>
          </div>
          <div className="rounded-2xl border border-navy/10 bg-white p-5">
            <p className="text-sm font-semibold text-gray-500">Prueba en dólares</p>
            <p className="mt-1 text-3xl font-bold text-navy">USD 1.50</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Tarjeta con cobro en USD; requiere multimoneda activa.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          <CourseEnrollmentForm
            courseId={PAYMENT_QA_COURSE_ID}
            courseTitle={PAYMENT_QA_TITLE}
            coursePrice={PAYMENT_QA_PRICE_PEN}
            courseCurrency="PEN"
            priceUSD={PAYMENT_QA_PRICE_USD}
            allowPaypal={false}
            showMarketingOptIn={false}
            submitLabel="Realizar cobro de prueba"
            forceCulqiEnabled
          />
        </div>
      </div>
    </main>
  );
}
