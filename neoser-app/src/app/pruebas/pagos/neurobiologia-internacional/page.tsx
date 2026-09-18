import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AlertTriangle, BadgeCheck, CreditCard, Globe2, ShieldCheck } from "lucide-react";
import { CourseEnrollmentForm } from "@/components/course-enrollment-form";
import { PaymentQaAccessForm } from "@/components/payment-qa-access-form";
import {
  getCulqiEnvironment,
  NEUROBIOLOGY_PAYMENT_QA_COURSE_ID,
  NEUROBIOLOGY_PAYMENT_QA_PRICE_USD,
  NEUROBIOLOGY_PAYMENT_QA_TITLE,
  PAYMENT_QA_COOKIE_NAME,
  verifyPaymentQaSession,
} from "@/lib/payments/payment-qa";

export const metadata: Metadata = {
  title: "Prueba privada de pago internacional",
  description: "Cobro interno en dólares para verificar Culqi en NeoSer.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function NeurobiologyInternationalPaymentQaPage() {
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
                <Globe2 className="h-7 w-7 text-pink-light" />
              </div>
              <h1 className="mt-6 text-3xl leading-tight text-white sm:text-4xl">
                Prueba internacional de Neurobiología
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
                Comprueba un cargo con tarjeta en dólares sin modificar el
                precio publicado ni generar una matrícula real.
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
                ? "Este formulario realizará un cobro real de USD 3"
                : isConfigured
                  ? "Todavía se usan las llaves de prueba de Culqi"
                  : "Las llaves de Culqi no están configuradas correctamente"}
            </p>
            <p className="mt-1 text-sm leading-relaxed opacity-80">
              {isLive
                ? "La tarjeta será debitada y Culqi descontará su comisión del abono. La cuenta debe tener habilitados los cobros en USD."
                : isConfigured
                  ? "Podrás revisar el recorrido sin debitar dinero. Para una prueba real se requieren llaves live y cobros en USD habilitados."
                  : "Revisa que la llave pública y la secreta correspondan al mismo entorno antes de intentar el cobro."}
            </p>
          </div>
        </section>

        <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-500">
              Tarjeta internacional · cobro en dólares
            </p>
            <p className="mt-1 text-4xl font-bold text-navy">
              USD {NEUROBIOLOGY_PAYMENT_QA_PRICE_USD.toFixed(2)}
            </p>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500 sm:mt-0">
            El mínimo de CulqiOnline para tarjetas en USD es 3 dólares. Esta
            prueba se registra aparte y no da acceso al curso.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          <CourseEnrollmentForm
            courseId={NEUROBIOLOGY_PAYMENT_QA_COURSE_ID}
            courseTitle={NEUROBIOLOGY_PAYMENT_QA_TITLE}
            coursePrice={NEUROBIOLOGY_PAYMENT_QA_PRICE_USD}
            courseCurrency="USD"
            priceUSD={NEUROBIOLOGY_PAYMENT_QA_PRICE_USD}
            allowPaypal={false}
            showMarketingOptIn={false}
            submitLabel="Pagar USD 3 de prueba"
            forceCulqiEnabled
            allowedMethods={["culqi-usd"]}
            paymentQa
          />
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-gray-500">
          <CreditCard className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
          Solo tarjeta. No se enviarán correos de matrícula ni se habilitará el
          acceso académico por este cobro interno.
        </p>
      </div>
    </main>
  );
}
