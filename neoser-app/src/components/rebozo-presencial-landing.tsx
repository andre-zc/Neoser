"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Baby,
  CheckCircle2,
  Clock,
  FlaskConical,
  GraduationCap,
  Hand,
  HeartHandshake,
  Laptop,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  getCatalogCourse,
  whatsappHref,
} from "@/lib/courses-catalog";

const course = getCatalogCourse("rebozo-presencial")!;
const WHATSAPP_HREF = whatsappHref(course.whatsappText);

// Sección 3 del programa — «¿Por qué formarte?»
const reasons = [
  {
    icon: HeartHandshake,
    title: "Atención respetuosa de la fisiología",
    text: "Acompañas sin interrumpir los procesos naturales del embarazo, el parto y el postparto.",
  },
  {
    icon: Hand,
    title: "Educación somática aplicada",
    text: "Trabajas desde la percepción corporal, el movimiento y el sostén, no desde la técnica suelta.",
  },
  {
    icon: Sparkles,
    title: "Herramientas no farmacológicas",
    text: "Sumas recursos concretos para el alivio del dolor y el progreso del trabajo de parto.",
  },
  {
    icon: FlaskConical,
    title: "Evidencia científica",
    text: "Cada técnica se sustenta en bibliografía y en el marco clínico que la respalda.",
  },
  {
    icon: Stethoscope,
    title: "Modelo de Maternidad y Medicina Humanizada",
    text: "Integras el rebozo dentro del modelo de atención que NeoSer aplica en su práctica clínica.",
  },
];

// Sección 6 del programa — «¿Qué incluye?»
const includesIcons = [
  Laptop,
  GraduationCap,
  FlaskConical,
  Baby,
  Users,
  Hand,
  Award,
  HeartHandshake,
];

// Sección 11 — galería del taller con obstetras (Chiclayo, 2025)
const gallery = [
  {
    src: "/assets/cursos/rebozo-presencial/taller-circulo.jpg",
    alt: "Participantes del taller trabajando en círculo con rebozos — NeoSer, Chiclayo 2025",
    caption: "Trabajo grupal con rebozo",
    wide: true,
  },
  {
    src: "/assets/cursos/rebozo-presencial/taller-manteo.jpg",
    alt: "Práctica de manteo con rebozo supervisada por la facilitadora",
    caption: "Manteo supervisado",
    wide: false,
  },
  {
    src: "/assets/cursos/rebozo-presencial/taller-rebozo-supino.jpg",
    alt: "Técnica de sostén con rebozo aplicada en decúbito supino",
    caption: "Técnica de sostén",
    wide: false,
  },
  {
    src: "/assets/cursos/rebozo-presencial/taller-pelota-parto.jpg",
    alt: "Acompañamiento del trabajo de parto con pelota y rebozo",
    caption: "Acompañamiento del trabajo de parto",
    wide: false,
  },
  {
    src: "/assets/cursos/rebozo-presencial/taller-biomecanica-pelvis.jpg",
    alt: "Revisión de la biomecánica de la pelvis con modelo anatómico",
    caption: "Biomecánica de la pelvis",
    wide: false,
  },
  {
    src: "/assets/cursos/rebozo-presencial/taller-practica-grupal.jpg",
    alt: "Práctica clínica supervisada en grupo durante el curso taller presencial",
    caption: "Práctica clínica supervisada",
    wide: false,
  },
];

export function RebozoPresencialLanding() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("aos-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-cream">
      <SiteHeader />

      {/* ===== 1. HERO ===== */}
      <section className="relative overflow-hidden bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy shadow-sm">
              Programa de Formación · Modalidad semipresencial
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-pink-dark">
              <Sparkles className="h-3.5 w-3.5" /> Próxima edición en programación
            </span>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-2">
            <div data-aos="fade-up">
              <p
                className="mb-1 text-pink"
                style={{
                  fontFamily: 'var(--font-playfair), "Noto Serif Display", Georgia, serif',
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(2.6rem,6vw,4.6rem)",
                  lineHeight: 1,
                }}
              >
                Rebozo
              </p>
              <h1
                className="section-title text-navy"
                style={{ fontSize: "clamp(2rem,4.2vw,3.2rem)" }}
              >
                El Arte del Rebozo desde la{" "}
                <span className="bg-gradient-to-r from-pink to-pink-dark bg-clip-text text-transparent">
                  Educación Somática
                </span>{" "}
                para el Embarazo, Parto y Postparto
              </h1>
              <p className="mt-5 max-w-xl text-gray-500">
                Desarrolla las competencias necesarias para integrar el arte del
                rebozo como una herramienta de acompañamiento obstétrico,
                sustentada en evidencia científica, educación somática y práctica
                clínica supervisada.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "64 horas académicas",
                  "4 créditos académicos",
                  "Modalidad semipresencial",
                  "Certificación NeoSer",
                ].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Solicitar información <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#plan-de-estudios" className="btn-pink-outline">
                  Ver el plan de estudios
                </a>
              </div>
            </div>

            <div
              className="relative mx-auto w-full max-w-sm"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-white shadow-lg">
                <Image
                  src={course.image}
                  alt="El Arte del Rebozo para el embarazo, parto y posparto — NeoSer"
                  fill
                  sizes="(max-width: 1023px) 100vw, 420px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-white">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold leading-tight text-navy">
                  64 h · 4 créditos
                  <br />
                  <span className="text-xs font-normal text-gray-400">
                    práctica clínica supervisada
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. SOBRE ESTE PROGRAMA ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div data-aos="fade-up">
              <p className="section-tag mb-2">Sobre este programa</p>
              <h2 className="section-title mb-6">
                Nace de la{" "}
                <span className="text-pink">experiencia clínica de NeoSer.</span>
              </h2>
              {course.description.slice(0, 2).map((p) => (
                <p key={p} className="mb-4 leading-relaxed text-gray-500">
                  {p}
                </p>
              ))}
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Evidencia científica",
                  "Educación somática",
                  "Práctica clínica",
                ].map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-pink-light px-3 py-1.5 text-xs font-medium text-pink-dark"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-3xl border-4 border-white shadow-lg"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Image
                src="/assets/cursos/rebozo-presencial/taller-circulo.jpg"
                alt="Taller presencial de rebozo con obstetras — NeoSer, Chiclayo 2025"
                width={1600}
                height={1067}
                sizes="(max-width: 1023px) 100vw, 560px"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. ¿POR QUÉ FORMARTE? ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">¿Por qué formarte?</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Cinco razones para incorporar el rebozo{" "}
              <span className="text-pink">con método y respaldo.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-navy/5 bg-white p-8 transition duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 100}
              >
                <r.icon
                  className="pointer-events-none absolute -right-5 -top-5 h-32 w-32 text-pink opacity-[0.06] transition-transform duration-700 ease-out group-hover:rotate-6 group-hover:scale-110"
                  strokeWidth={1}
                  aria-hidden
                />
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink to-pink-dark text-white shadow-md ring-1 ring-pink/20 transition-transform duration-500 group-hover:-rotate-6">
                  <r.icon className="h-7 w-7" strokeWidth={1.6} />
                </div>
                <h3 className="relative mb-2 text-lg font-bold leading-snug text-navy">
                  {r.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-gray-500">
                  {r.text}
                </p>
                <span
                  className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-pink to-pink-dark transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. ESTRUCTURA ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Estructura del programa</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Dos módulos, <span className="text-pink">64 horas académicas.</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {[
              {
                icon: Laptop,
                tag: "Módulo I",
                title: "Formación Virtual Asincrónica",
                hours: "32 horas",
                text: "Base teórica en el Campus Virtual NeoSer, a tu propio ritmo.",
                tone: "blue" as const,
              },
              {
                icon: Hand,
                tag: "Módulo II",
                title: "Curso Taller Presencial",
                hours: "32 horas",
                text: "Práctica supervisada con acompañamiento directo de la facilitadora.",
                tone: "pink" as const,
              },
            ].map((m, i) => (
              <div
                key={m.tag}
                className="surface-card relative overflow-hidden p-8"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div
                  className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-md ${
                    m.tone === "blue"
                      ? "bg-gradient-to-br from-blue to-navy"
                      : "bg-gradient-to-br from-pink to-pink-dark"
                  }`}
                >
                  <m.icon className="h-7 w-7" strokeWidth={1.7} />
                </div>
                <span
                  className={`mb-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    m.tone === "blue"
                      ? "bg-blue-light/70 text-blue"
                      : "bg-pink-light text-pink-dark"
                  }`}
                >
                  {m.tag}
                </span>
                <h3 className="text-xl font-bold leading-snug text-navy">
                  {m.title}
                </h3>
                <p
                  className="mt-1 text-3xl font-bold text-navy"
                  style={{ fontFamily: "var(--font-playfair), 'Noto Serif Display', Georgia, serif" }}
                >
                  {m.hours}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <p
            className="mx-auto mt-10 max-w-2xl text-center text-lg font-semibold text-navy"
            data-aos="fade-up"
          >
            Total:{" "}
            <span className="text-pink">
              64 horas académicas · 4 créditos académicos
            </span>
          </p>
        </div>
      </section>

      {/* ===== 5. PLAN DE ESTUDIOS ===== */}
      <section
        id="plan-de-estudios"
        className="relative overflow-hidden bg-cream py-20 md:py-28"
      >
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Plan de estudios</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Cuatro seminarios virtuales y{" "}
              <span className="text-pink">cuatro unidades prácticas.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {(course.modules ?? []).map((m, i) => (
              <details
                key={m.n}
                className="surface-card group p-5 transition duration-300 hover:shadow-md md:p-7"
                data-aos="fade-up"
                data-aos-delay={i * 100}
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
                  <div
                    className="hidden bg-gradient-to-br from-pink/55 to-blue/45 bg-clip-text text-4xl font-bold text-transparent sm:block md:text-5xl"
                    style={{ fontFamily: "var(--font-playfair), 'Noto Serif Display', Georgia, serif" }}
                  >
                    {m.n}
                  </div>
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink to-pink-dark text-white shadow-md ring-1 ring-pink/20 transition-transform duration-500 group-hover:-rotate-6 md:h-14 md:w-14">
                    {i === 0 ? (
                      <Laptop className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.7} />
                    ) : (
                      <Hand className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.7} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-navy md:text-lg">
                      Módulo {m.n}. {m.title}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-pink">
                      {i === 0
                        ? "La base teórica, a tu ritmo."
                        : "La técnica en el cuerpo, con corrección directa."}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-light text-xl leading-none text-pink transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-4 border-t border-navy/5 pt-4">
                  <p className="text-sm leading-relaxed text-gray-500">
                    {m.purpose}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {m.topics.map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink" />
                        <span className="text-sm text-gray-600">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 6. ¿QUÉ INCLUYE? ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">¿Qué incluye?</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Todo lo que recibes al{" "}
              <span className="text-pink">matricularte en el programa.</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {course.includes.map((it, i) => {
              const Icon = includesIcons[i % includesIcons.length];
              return (
                <div
                  key={it}
                  className="group relative overflow-hidden rounded-2xl border border-navy/5 bg-white p-6 text-center transition duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={(i % 4) * 80}
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white shadow-md ring-1 ring-blue/20 transition-transform duration-500 group-hover:-rotate-6">
                    <Icon className="h-6 w-6" strokeWidth={1.7} />
                  </div>
                  <p className="text-sm font-semibold leading-snug text-navy">
                    {it}
                  </p>
                  <span
                    className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-blue to-navy transition-transform duration-500 group-hover:scale-x-100"
                    aria-hidden
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 7. INVERSIÓN ===== */}
      <section
        id="inversion"
        className="relative overflow-hidden bg-cream py-20 md:py-28"
      >
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div
            className="surface-card mx-auto max-w-3xl p-8 text-center shadow-sm md:p-12"
            data-aos="fade-up"
          >
            <p className="section-tag mb-2">Inversión</p>
            <h2 className="section-title mb-3">
              Puedes llevar el programa{" "}
              <span className="text-pink">completo o por módulos.</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm text-gray-500">
              El Módulo I es requisito previo del Módulo II. Las egresadas de
              cursos NeoSer acceden a una tarifa preferencial en las tres
              opciones.
            </p>

            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              {(course.priceTiers ?? []).map((t) => (
                <div
                  key={t.label}
                  className={`rounded-2xl p-5 ${
                    t.tone === "blue" ? "bg-blue-light/70" : "bg-pink-light/60"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      t.tone === "blue" ? "text-blue" : "text-pink-dark"
                    }`}
                  >
                    {t.label}
                  </p>
                  <p
                    className="mt-2 text-3xl font-bold text-navy"
                    style={{ fontFamily: "var(--font-playfair), 'Noto Serif Display', Georgia, serif" }}
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

            <p className="mb-6 text-xs uppercase tracking-wide text-gray-400">
              Precios en soles (PEN) · Vacantes limitadas ·{" "}
              {course.certification}
            </p>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mx-auto justify-center"
            >
              Consultar fechas y reservar vacante{" "}
              <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-3 text-xs text-gray-400">
              La próxima edición está en programación. Te avisamos apenas se
              confirmen las fechas y la sede.
            </p>
          </div>
        </div>
      </section>

      {/* ===== 8. FACILITADORA ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="flex justify-center" data-aos="fade-up">
              <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-pink-light to-blue-light shadow-lg">
                <Image
                  src="/assets/formadora-diana.png"
                  alt="Obsta. Diana Silva Mejía"
                  width={800}
                  height={1024}
                  className="h-[28rem] w-full object-cover object-top"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-pink px-4 py-1.5 text-xs font-semibold text-white shadow">
                    Obsta. Diana Silva Mejía
                  </span>
                </div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <p className="section-tag mb-2">Facilitadora</p>
              <h2 className="section-title mb-1">Diana Silva Mejía</h2>
              <p className="mb-5 font-semibold text-pink">
                Cofundadora y Gerente General de NeoSer Perú
              </p>
              <p className="mb-4 leading-relaxed text-gray-500">
                Profesora certificada del Método Periné y Movimiento® y de
                Psicofonía y Canto Prenatal Marie-Louise Aucher® (Francia).
              </p>
              <p className="mb-6 leading-relaxed text-gray-500">
                Integra la educación somática y la evidencia científica desde el
                modelo de Maternidad y Medicina Humanizada.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Método Periné y Movimiento®",
                  "Psicofonía y Canto Prenatal Marie-Louise Aucher®",
                  "Maternidad y Medicina Humanizada",
                ].map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-pink-light px-3 py-1.5 text-xs font-medium text-pink-dark"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 11. GALERÍA (antes del FAQ para dar prueba visual) ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Galería</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Así se vive el{" "}
              <span className="text-pink">entrenamiento práctico.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Curso taller presencial con obstetras — Chiclayo, 2025.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g, i) => (
              <figure
                key={g.src}
                className={`group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 ${
                  g.wide ? "sm:col-span-2" : ""
                }`}
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 100}
              >
                <div
                  className={`relative overflow-hidden bg-gray-100 ${
                    g.wide ? "aspect-[16/10]" : "aspect-[4/5]"
                  }`}
                >
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-4 pt-10 text-sm font-semibold text-white">
                  {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 9. PREGUNTAS FRECUENTES ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Preguntas frecuentes</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Todo lo que necesitas saber{" "}
              <span className="text-pink">antes de postular.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-3" data-aos="fade-up">
            {(course.faq ?? []).map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-navy/8 bg-cream p-5 transition-colors open:bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-navy">
                  {f.q}
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-pink-light text-pink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-gray-500">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 10. INFORMES ===== */}
      <section
        id="informes"
        className="relative overflow-hidden bg-cream py-20 md:py-28"
      >
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div
            className="surface-card mx-auto max-w-2xl p-8 text-center shadow-sm md:p-12"
            data-aos="fade-up"
          >
            <p className="section-tag mb-2">Informes</p>
            <h2 className="section-title mb-4">
              Conoce las próximas fechas y{" "}
              <span className="text-pink">reserva tu vacante.</span>
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-sm text-gray-500">
              Comunícate vía WhatsApp o correo electrónico y te enviamos el
              cronograma de la próxima edición, la sede y el proceso de
              matrícula.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp {CONTACT_PHONE}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="btn-pink-outline text-sm"
              >
                <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer py-16">
        <div className="container-main">
          <div className="grid gap-10 md:grid-cols-3">
            <div>
              <Image
                src="/assets/logo-white.png"
                alt="NeoSer"
                width={320}
                height={128}
                className="footer-logo mb-4"
              />
              <p className="text-sm leading-relaxed opacity-70">
                Centro de maternidad y medicina humanizada en Chiclayo.
                Formación profesional en nacimiento respetado.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">El programa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#plan-de-estudios">Plan de estudios</a>
                </li>
                <li>
                  <a href="#inversion">Inversión</a>
                </li>
                <li>
                  <a href="#informes">Informes y vacantes</a>
                </li>
                <li>
                  <Link href="/cursos">Otros cursos</Link>
                </li>
                <li>
                  <Link href="/">Volver al inicio</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-pink" /> Calle Los
                  Sauces 542, Chiclayo
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-pink" />{" "}
                  {CONTACT_PHONE}
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-pink" />{" "}
                  {CONTACT_EMAIL}
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 flex-shrink-0 text-pink" /> Lun a Sáb:
                  8:00 AM - 7:00 PM
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-divider mt-10 flex flex-col items-center justify-center gap-4 pt-8">
            <p className="text-sm opacity-60">
              &copy; 2026 NeoSer - Maternidad y Medicina Humanizada. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
