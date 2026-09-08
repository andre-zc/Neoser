import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  CreditCard,
  Database,
  ShieldCheck,
} from "lucide-react";
import {
  buildProtocolsWhatsappHref,
  buildWhatsappQrDataUrl,
  getPaymentContext,
  getProtocolsWhatsappGroupUrl,
  PROTOCOLS_COURSE_ID,
  PROTOCOLS_COURSE_TITLE,
} from "@/lib/payments/payment-context";
import { ProtocolsRegistrationForm } from "@/components/protocols-registration-form";

type SearchParams = Promise<{
  ref?: string;
  orderRef?: string;
  preview?: string;
}>;

export const metadata: Metadata = {
  title: "Pago confirmado",
  description:
    "Confirmación de pago e indicaciones de acceso al curso adquirido en NeoSer.",
  robots: { index: false, follow: false },
};

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

function PaymentQaSuccessContent({ reference }: { reference: string }) {
  return (
    <main className="min-h-screen bg-cream py-10 sm:py-14 md:py-20">
      <div className="container-main mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(15,37,72,0.13)] ring-1 ring-navy/5 md:grid md:grid-cols-[0.9fr_1.1fr]">
          <section className="bg-navy px-7 py-10 text-white sm:px-10 md:flex md:min-h-[520px] md:flex-col md:justify-between md:px-12 md:py-14">
            <div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/30">
                <CheckCircle2 className="h-9 w-9 text-emerald-200" />
              </div>
              <p className="mt-7 text-sm font-semibold text-emerald-200">
                Cobro aprobado por Culqi
              </p>
              <h1 className="mt-3 text-3xl leading-tight text-white sm:text-4xl">
                ¡La prueba se completó correctamente!
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
                El pago llegó al flujo real y quedó registrado como una prueba
                operativa independiente.
              </p>
            </div>

            <div className="mt-9 border-t border-white/15 pt-6 md:mt-12">
              <p className="text-xs font-medium text-white/55">
                Referencia del cargo
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-white">
                {reference}
              </p>
            </div>
          </section>

          <section className="px-7 py-10 sm:px-10 md:flex md:flex-col md:justify-center md:px-12 md:py-14">
            <p className="text-sm font-semibold text-pink-dark">
              Flujo verificado
            </p>
            <h2 className="mt-2 text-2xl leading-tight text-navy sm:text-3xl">
              El checkout respondió como esperábamos
            </h2>

            <div className="mt-7 space-y-5">
              <div className="flex gap-3">
                <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-pink-dark" />
                <p className="text-sm leading-relaxed text-gray-600">
                  Culqi autorizó el cargo y devolvió una referencia válida.
                </p>
              </div>
              <div className="flex gap-3">
                <Database className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                <p className="text-sm leading-relaxed text-gray-600">
                  El resultado quedó guardado para conciliación sin crear una
                  inscripción ni un lead comercial.
                </p>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-sm leading-relaxed text-gray-600">
                  Esta prueba no entrega acceso al curso ni al grupo de
                  WhatsApp.
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-navy/10 bg-cream/70 p-5 text-sm leading-relaxed text-gray-600">
              Puedes contrastar esta referencia en CulqiPanel y en el registro
              de pagos de NeoSer.
            </div>

            <Link
              href="/pruebas/pagos/protocolos"
              className="btn-primary mt-8 justify-center"
            >
              Hacer otra prueba
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

async function ProtocolsSuccessContent({
  reference,
  registrationCompleted,
  preview = false,
}: {
  reference: string;
  registrationCompleted: boolean;
  preview?: boolean;
}) {
  const groupHref = registrationCompleted
    ? getProtocolsWhatsappGroupUrl()
    : null;
  const hasDirectGroupAccess = Boolean(groupHref);
  const whatsappHref = registrationCompleted
    ? groupHref ?? buildProtocolsWhatsappHref({ reference })
    : null;
  const whatsappQrDataUrl = whatsappHref
    ? await buildWhatsappQrDataUrl(whatsappHref)
    : null;

  return (
    <main className="min-h-screen bg-cream py-8 sm:py-12 md:py-20">
      <div className="container-main mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(15,37,72,0.13)] ring-1 ring-navy/5 md:grid md:grid-cols-[0.9fr_1.1fr]">
          <section className="relative overflow-hidden bg-navy px-7 py-10 text-white sm:px-10 md:flex md:min-h-[620px] md:flex-col md:justify-between md:px-12 md:py-14">
            <div
              className="absolute -right-20 -top-24 h-64 w-64 rounded-full border-[42px] border-white/5"
              aria-hidden="true"
            />
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20">
                <CheckCircle2 className="h-9 w-9 text-pink-light" />
              </div>
              <p className="mt-7 text-sm font-semibold text-pink-light">
                {registrationCompleted
                  ? "Pago aprobado e inscripción completada"
                  : "Pago aprobado e inscripción registrada"}
              </p>
              <h1 className="mt-3 text-3xl leading-tight text-white sm:text-4xl">
                {registrationCompleted
                  ? "¡Te damos la bienvenida a NeoSer!"
                  : "¡Tu pago fue confirmado!"}
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/80">
                {registrationCompleted ? (
                  <>
                    Ya tienes un lugar en {PROTOCOLS_COURSE_TITLE}. Tu acceso
                    al grupo está listo para que recibas las indicaciones y
                    materiales.
                  </>
                ) : (
                  <>
                    Ya tienes un lugar en {PROTOCOLS_COURSE_TITLE}. Completa
                    tus datos para habilitar el acceso al grupo del curso.
                  </>
                )}
              </p>

              <div className="mt-8 space-y-3" aria-label="Progreso de inscripción">
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  Pago confirmado
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      registrationCompleted
                        ? "bg-emerald-400/20 text-emerald-200"
                        : "bg-pink/25 font-bold text-pink-light ring-1 ring-pink-light/40"
                    }`}
                  >
                    {registrationCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      "2"
                    )}
                  </span>
                  Completar datos de inscripción
                </div>
                <div className="flex items-center gap-3 text-sm text-white/85">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      registrationCompleted
                        ? "bg-pink/25 font-bold text-pink-light ring-1 ring-pink-light/40"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    3
                  </span>
                  Acceso al grupo de WhatsApp
                </div>
              </div>
            </div>

            <div className="relative mt-9 border-t border-white/15 pt-6 md:mt-12">
              <p className="text-xs font-medium text-white/55">
                Referencia de pago
              </p>
              <p className="mt-1 break-all font-mono text-sm font-semibold text-white">
                {reference}
              </p>
            </div>
          </section>

          <section className="px-7 py-10 sm:px-10 md:flex md:flex-col md:justify-center md:px-12 md:py-14">
            {registrationCompleted && whatsappHref ? (
              <>
                <p className="text-sm font-semibold text-pink-dark">
                  Tu acceso está listo
                </p>
                <h2 className="mt-2 text-2xl leading-tight text-navy sm:text-3xl">
                  {hasDirectGroupAccess
                    ? "Únete al grupo de WhatsApp del curso"
                    : "Escríbenos para recibir el enlace del grupo"}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-500 sm:text-base">
                  {hasDirectGroupAccess
                    ? "Pulsa el botón para abrir la invitación. En el grupo recibirás los avisos, materiales e indicaciones del seminario."
                    : "No pudimos abrir la invitación directa. Escríbenos por WhatsApp para que podamos enviarte el acceso."}
                </p>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-center text-base font-bold text-white shadow-[0_8px_0_#159447] transition-transform hover:-translate-y-0.5 hover:bg-[#20c45a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#159447] active:translate-y-1 active:shadow-[0_4px_0_#159447]"
                >
                  <WhatsappIcon className="h-6 w-6 shrink-0" />
                  {hasDirectGroupAccess
                    ? "Únete al grupo de WhatsApp"
                    : "Escríbenos por WhatsApp"}
                </a>

                {whatsappQrDataUrl ? (
              <div className="mt-8 grid grid-cols-[112px_1fr] items-center gap-5 rounded-2xl border border-navy/10 bg-cream/60 p-4 sm:grid-cols-[132px_1fr] sm:gap-6 sm:p-5">
                <div className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-navy/10">
                  <Image
                    src={whatsappQrDataUrl}
                    alt={
                      hasDirectGroupAccess
                        ? "Código QR para unirse al grupo de WhatsApp"
                        : "Código QR para escribir a NeoSer por WhatsApp"
                    }
                    width={184}
                    height={184}
                    unoptimized
                    className="h-auto w-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold leading-snug text-navy sm:text-base">
                    ¿Estás en una computadora?
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
                    {hasDirectGroupAccess
                      ? "Escanea el código con la cámara de tu celular para abrir la invitación al grupo."
                      : "Escanea el código con la cámara de tu celular para escribirnos por WhatsApp."}
                  </p>
                </div>
              </div>
                ) : null}

                <div className="mt-9 space-y-4 border-t border-navy/10 pt-7">
                  <div className="flex gap-3">
                    <BookOpenCheck className="mt-0.5 h-5 w-5 shrink-0 text-pink-dark" />
                    <p className="text-sm leading-relaxed text-gray-600">
                      Dentro del grupo recibirás los materiales y avisos del
                      seminario.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-blue" />
                    <p className="text-sm leading-relaxed text-gray-600">
                      Podrás resolver cualquier duda antes de la primera
                      sesión.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-pink-dark">
                  Un último paso
                </p>
                <h2 className="mt-2 text-2xl leading-tight text-navy sm:text-3xl">
                  Completa tus datos de inscripción
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  Esta información nos permite identificarte correctamente y
                  organizar tu participación en el curso.
                </p>
                <ProtocolsRegistrationForm
                  reference={reference}
                  preview={preview}
                />
              </>
            )}

            <Link
              href="/cursos/seminario-protocolos-nacimiento-humanizado"
              className="mt-9 inline-flex items-center gap-2 self-start text-sm font-semibold text-navy hover:text-pink-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pink"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al curso
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}

function SuccessContent({ orderRef }: { orderRef?: string }) {
  return (
    <main className="min-h-screen bg-cream py-16 md:py-24">
      <div className="container-main mx-auto max-w-2xl">
        <div className="surface-card p-8 text-center md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-navy md:text-4xl">
            ¡Inscripción confirmada!
          </h1>

          {orderRef && (
            <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
              Orden: <span className="font-mono text-navy">{orderRef}</span>
            </p>
          )}

          <p className="mt-6 text-gray-600">
            Gracias por confiar en NeoSer. Te enviamos un correo con los
            detalles del curso al email registrado.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Si no recibes el correo en los próximos minutos, revisa tu bandeja
            de spam o escríbenos.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/cursos" className="btn-primary">
              Volver al catálogo
            </Link>
            <Link href="/" className="btn-pink-outline text-sm">
              Ir al inicio
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { ref, orderRef, preview } = await searchParams;
  const reference = ref?.trim() || orderRef?.trim();
  const isLocalPreview =
    process.env.NODE_ENV !== "production" && reference === "preview_protocols";

  if (isLocalPreview) {
    return (
      <ProtocolsSuccessContent
        reference="Vista previa local"
        registrationCompleted={preview === "access"}
        preview
      />
    );
  }

  const paymentContext = await getPaymentContext(reference);
  const isPaymentQa =
    paymentContext?.kind === "payment_qa" &&
    paymentContext.provider === "culqi" &&
    paymentContext.status === "approved";
  const isProtocolsPayment =
    paymentContext?.kind === "course" &&
    paymentContext?.courseId === PROTOCOLS_COURSE_ID &&
    paymentContext.provider === "culqi" &&
    paymentContext.status === "approved";

  if (isPaymentQa && reference) {
    return <PaymentQaSuccessContent reference={reference} />;
  }

  if (isProtocolsPayment && reference) {
    return (
      <ProtocolsSuccessContent
        reference={reference}
        registrationCompleted={paymentContext.registrationCompleted}
      />
    );
  }

  return (
    <Suspense fallback={null}>
      <SuccessContent orderRef={reference} />
    </Suspense>
  );
}
