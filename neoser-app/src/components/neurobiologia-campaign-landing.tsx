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
      {/* Header mínimo: solo marca + CTAs (sin menú institucional) */}
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

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={course.image}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-navy/30" />
        </div>

        <div className="container-main relative py-16 md:py-24 lg:py-28">
          <div className="max-w-2xl text-white" data-aos="fade-up">
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
                fontSize: "clamp(2.2rem,5vw,3.6rem)",
                lineHeight: 1,
              }}
            >
              Neurobiología
            </p>
            <h1
              className="text-3xl font-bold leading-tight md:text-4xl lg:text-[2.75rem]"
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
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
              Actualiza tu práctica clínica con evidencia en neurobiología,
              microbiota, epigenética, neurociencias y teoría del apego.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#informacion" className="btn-pink-outline !border-white !text-white hover:!bg-white hover:!text-navy">
                Quiero recibir información
              </a>
              <Link href={ENROLL_HREF} className="btn-primary justify-center">
                Quiero inscribirme ahora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Datos clave */}
      <section className="border-b border-navy/5 bg-white py-6">
        <div className="container-main grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyFacts.map((f) => (
            <div key={f.label} className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-pink-light text-pink-dark">
                <f.icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {f.label}
                </p>
                <p className="text-sm font-semibold leading-snug text-navy">
                  {f.value}
                </p>
              </div>
            </div>
          ))}
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

      {/* Incluye + inversión */}
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
            <p className="section-tag mb-2">Inversión</p>
            <h2 className="section-title mb-6 text-2xl md:text-3xl">
              Reserva tu vacante
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
            <p className="mt-3 text-center text-xs text-gray-400">
              Pago seguro con tarjeta o Yape · Cupos limitados
            </p>
          </div>
        </div>
      </section>

      {/* Módulos compactos */}
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

      {/* Formulario: recibir información */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-blue py-16 text-white md:py-20">
        <div className="container-main relative">
          <div className="mx-auto max-w-xl" data-aos="fade-up">
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-pink-light">
                Paso siguiente
              </p>
              <h2 className="text-2xl font-bold md:text-3xl">
                ¿Quieres recibir información?
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Déjanos tus datos y te atendemos por WhatsApp para resolver
                dudas, fechas y formas de pago.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-6 text-navy shadow-xl md:p-8">
              <CampaignLeadForm />
            </div>
            <p className="mt-6 text-center text-sm text-white/60">
              ¿Ya decidiste?{" "}
              <Link
                href={ENROLL_HREF}
                className="font-semibold text-pink-light underline-offset-2 hover:underline"
              >
                Inscribirme ahora
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer mínimo legal (Culqi / confianza) */}
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
    </main>
  );
}
