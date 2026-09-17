"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Baby,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  Laptop,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { CampaignLeadForm } from "@/components/campaign-lead-form";
import { LEGAL } from "@/lib/legal";
import { getCatalogCourse } from "@/lib/courses-catalog";

const course = getCatalogCourse("neurobiologia-parto")!;
const ENROLL_HREF = "/cursos/neurobiologia-parto/inscribirse";
const WA_ASESORA = `https://wa.me/${LEGAL.whatsappManychat}?text=${encodeURIComponent(
  "Hola NeoSer, quiero contactarme con una asesora académica sobre el curso Neurobiología del Parto.",
)}`;

const reasons = [
  {
    icon: ShieldCheck,
    text: "Fundamentar decisiones clínicas en evidencia científica.",
  },
  {
    icon: Baby,
    text: "Proteger la fisiología del embarazo, el parto y el nacimiento.",
  },
  {
    icon: Stethoscope,
    text: "Atención más segura, respetuosa y centrada en cada nacimiento.",
  },
  {
    icon: Brain,
    text: "Integrar neurobiología, epigenética, microbiota y apego en la práctica.",
  },
];

const keyFacts = [
  { icon: Calendar, label: "Inicio", value: course.startLabel! },
  { icon: Clock, label: "Horario", value: course.scheduleLabel! },
  { icon: Laptop, label: "Modalidad", value: "Virtual sincrónica" },
  { icon: GraduationCap, label: "Certificación", value: "64 h · 4 créditos" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
    </svg>
  );
}

/**
 * Landing de campaña Meta Ads.
 * Dos caminos al mismo nivel: (1) captación autorizada + WhatsApp,
 * (2) inscripción/pago online. Contenido reutilizado de la página institucional.
 */
export function NeurobiologiaCampaignLanding() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("aos-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-cream">
      {/* Header: marca + ambos caminos */}
      <header className="sticky top-0 z-40 border-b border-navy/5 bg-cream/95 backdrop-blur-md">
        <div className="container-main flex items-center justify-between gap-3 py-3">
          <Image
            src="/assets/logo-full-color.png"
            alt="NeoSer"
            width={140}
            height={48}
            className="h-10 w-auto"
            priority
          />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <a
              href="#informacion"
              className="btn-pink-outline !px-3 !py-2 text-xs sm:text-sm"
            >
              Recibir información
            </a>
            <Link
              href={ENROLL_HREF}
              className="btn-primary !px-3 !py-2 text-xs sm:text-sm"
            >
              Inscribirme ahora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero: copy + formulario (estilo UPC / recomendación Vanderley) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-blue py-10 md:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <Image
            src={course.image}
            alt=""
            fill
            priority
            className="object-cover object-[center_20%]"
            sizes="100vw"
          />
        </div>
        <div className="container-main relative grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div className="text-white" data-aos="fade-up">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-pink-light ring-1 ring-white/15">
              <Sparkles className="h-3.5 w-3.5" />
              Curso virtual · Edición 2026 II · Cupos limitados
            </p>
            <p
              className="mb-1 text-pink-light"
              style={{
                fontFamily:
                  'var(--font-playfair), "Noto Serif Display", Georgia, serif',
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "clamp(2rem,4.5vw,3.2rem)",
                lineHeight: 1,
              }}
            >
              Neurobiología
            </p>
            <h1
              className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl"
              style={{
                fontFamily:
                  'var(--font-playfair), "Noto Serif Display", Georgia, serif',
              }}
            >
              del Parto y Protocolos para un Nacimiento Humanizado
            </h1>
            <p className="mt-4 text-base font-medium text-white/90 md:text-lg">
              {course.tagline}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
              Actualiza tu práctica clínica con evidencia en neurobiología,
              microbiota, epigenética, neurociencias y teoría del apego.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {keyFacts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-start gap-2.5 rounded-xl bg-white/8 px-3 py-2.5 ring-1 ring-white/10"
                >
                  <f.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink-light" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-white/50">
                      {f.label}
                    </p>
                    <p className="text-xs font-medium leading-snug text-white/90">
                      {f.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Camino compra — mismo nivel que el form */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={ENROLL_HREF} className="btn-primary justify-center">
                Quiero inscribirme ahora <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={WA_ASESORA}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Hablar con una asesora
              </a>
            </div>
          </div>

          {/* Panel captación autorizada (donde iba la imagen en la institucional) */}
          <div
            className="rounded-3xl bg-white p-5 text-navy shadow-2xl md:p-6"
            data-aos="fade-up"
            data-aos-delay="80"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-pink">
              Solicita información
            </p>
            <h2 className="mt-1 text-xl font-bold text-navy">
              Déjanos tus datos y te contactamos
            </h2>
            <p className="mt-2 mb-4 text-sm text-gray-500">
              Al autorizar, podemos enviarte información del curso y hacer
              seguimiento. También puedes inscribirte y pagar en línea cuando
              quieras.
            </p>
            <CampaignLeadForm
              compact
              submitLabel="Quiero recibir información"
            />
            <div className="mt-4 border-t border-navy/8 pt-4 text-center">
              <p className="mb-2 text-xs text-gray-500">¿Listo para reservar?</p>
              <Link
                href={ENROLL_HREF}
                className="btn-pink-outline w-full justify-center !py-2.5 text-sm"
              >
                Quiero inscribirme ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="mx-auto mb-10 max-w-2xl text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Por qué este curso</p>
            <h2 className="section-title">
              Diseñado para profesionales que quieren{" "}
              <span className="text-pink">transformar la atención del nacimiento.</span>
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {reasons.map((r, i) => (
              <div
                key={r.text}
                className="flex gap-4 rounded-2xl border border-navy/5 bg-white p-5"
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 80}
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink to-pink-dark text-white">
                  <r.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <p className="self-center text-sm leading-relaxed text-gray-600">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Incluye + inversión / compra */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-main grid items-start gap-10 lg:grid-cols-2">
          <div data-aos="fade-up">
            <p className="section-tag mb-2">Qué incluye</p>
            <h2 className="section-title mb-6">
              Todo lo que recibes al <span className="text-pink">inscribirte.</span>
            </h2>
            <ul className="space-y-3">
              {course.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            id="inscribirme"
            className="rounded-3xl border border-navy/8 bg-cream p-6 shadow-sm md:p-8"
            data-aos="fade-up"
          >
            <p className="section-tag mb-2">Inversión · Inscripción online</p>
            <h2 className="section-title mb-6 text-2xl md:text-3xl">
              Reserva tu vacante ahora
            </h2>
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              {(course.priceTiers ?? []).map((t) => (
                <div
                  key={t.label}
                  className={`rounded-2xl p-4 ${
                    t.tone === "blue" ? "bg-blue-light/70" : "bg-pink-light/60"
                  }`}
                >
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-wide ${
                      t.tone === "blue" ? "text-blue" : "text-pink-dark"
                    }`}
                  >
                    {t.label}
                  </p>
                  <p
                    className="mt-1 text-2xl font-bold text-navy"
                    style={{
                      fontFamily:
                        "var(--font-playfair), 'Noto Serif Display', Georgia, serif",
                    }}
                  >
                    {t.value}
                  </p>
                  {t.note && (
                    <p className="mt-1 text-[11px] leading-snug text-gray-500">
                      {t.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Link
              href={ENROLL_HREF}
              className="btn-primary w-full justify-center"
            >
              Quiero inscribirme ahora <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#informacion"
              className="btn-pink-outline mt-3 w-full justify-center"
            >
              Prefiero recibir información primero
            </a>
            <p className="mt-3 text-center text-xs text-gray-400">
              Pago seguro con tarjeta o Yape · Cupos limitados
            </p>
          </div>
        </div>
      </section>

      {/* Módulos */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="mx-auto mb-10 max-w-2xl text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Programa</p>
            <h2 className="section-title">
              Cuatro módulos, de la biología a la{" "}
              <span className="text-pink">práctica clínica.</span>
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {(course.modules ?? []).map((m, i) => (
              <details
                key={m.n}
                className="group rounded-2xl border border-navy/8 bg-white p-5"
                data-aos="fade-up"
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Módulo {m.n}
                    </p>
                    <h3 className="text-sm font-bold text-navy md:text-base">
                      {m.title}
                    </h3>
                  </div>
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-pink-light text-pink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {m.purpose}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Docente */}
      <section className="bg-white py-16 md:py-20">
        <div className="container-main">
          <div
            className="mx-auto grid max-w-3xl items-center gap-6 rounded-3xl border border-navy/8 bg-cream p-6 md:grid-cols-[auto_1fr] md:p-8"
            data-aos="fade-up"
          >
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow md:mx-0">
              <Image
                src="/assets/cursos/dr-beltran-lares.jpg"
                alt="Dr. Beltrán Lares"
                width={224}
                height={224}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Docente
              </p>
              <h3 className="mt-1 text-xl font-bold text-navy">Dr. Beltrán Lares</h3>
              <p className="mb-2 text-sm font-semibold text-pink">
                Médico ginecólogo-obstetra · AuroraMadre Academia (Argentina)
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                Más de 30 años de experiencia clínica y docente en humanización
                del nacimiento, integrando evidencia científica y fisiología.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cierre dual: info + compra */}
      <section className="bg-gradient-to-br from-navy via-navy to-blue py-14 text-white md:py-16">
        <div className="container-main">
          <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
            <h2 className="text-2xl font-bold md:text-3xl">
              Elige cómo quieres continuar
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Ambos caminos están abiertos: déjanos tus datos con autorización
              o reserva tu vacante con pago en línea.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <a href="#informacion" className="btn-pink-outline !border-white !text-white hover:!bg-white hover:!text-navy">
                Quiero recibir información
              </a>
              <Link href={ENROLL_HREF} className="btn-primary justify-center">
                Quiero inscribirme ahora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <a
              href={WA_ASESORA}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#7CFFB2] underline-offset-2 hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4" />
              O escríbele a una asesora académica por WhatsApp
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-navy/5 bg-cream py-8">
        <div className="container-main flex flex-col items-center gap-3 text-center text-xs text-gray-500">
          <Image
            src="/assets/logo-full-color.png"
            alt="NeoSer"
            width={100}
            height={36}
            className="h-8 w-auto opacity-80"
          />
          <p>
            {LEGAL.razonSocial} · RUC {LEGAL.ruc}
          </p>
          <p>{LEGAL.direccionCorta}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/politica-de-privacidad" className="hover:text-pink">
              Privacidad
            </Link>
            <Link href="/terminos-y-condiciones" className="hover:text-pink">
              Términos
            </Link>
            <span className="inline-flex items-center gap-1">
              <Award className="h-3.5 w-3.5 text-pink" /> En alianza con AuroraMadre
            </span>
          </div>
        </div>
      </footer>

      {/* WhatsApp fijo (obligatorio en campaña) */}
      <a
        href={WA_ASESORA}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar con una asesora por WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-[#1ebe5d] md:bottom-6 md:right-6"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
    </main>
  );
}
