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
  Dna,
  Download,
  FileText,
  GraduationCap,
  Laptop,
  Library,
  Mail,
  MapPin,
  MessagesSquare,
  Microscope,
  NotebookPen,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  getCatalogCourse,
  whatsappHref,
} from "@/lib/courses-catalog";

const course = getCatalogCourse("neurobiologia-parto")!;

const ENROLL_HREF = "/cursos/neurobiologia-parto/inscribirse";
const WHATSAPP_HREF = whatsappHref(course.whatsappText);
const BROCHURE_HREF = course.brochureHref!;

// "Porque comprender la biología del nacimiento permite:" (docx de la clienta)
const reasons = [
  {
    icon: Microscope,
    text: "Fundamentar las decisiones clínicas en evidencia científica.",
  },
  {
    icon: ShieldCheck,
    text: "Proteger la fisiología del embarazo, el parto y el nacimiento.",
  },
  {
    icon: Baby,
    text: "Favorecer el bienestar de la madre, el recién nacido y la familia.",
  },
  {
    icon: Stethoscope,
    text: "Contribuir a una atención más segura, respetuosa y centrada en las necesidades de cada nacimiento.",
  },
];

const axes = [
  { icon: Brain, label: "Neurobiología del parto" },
  { icon: Dna, label: "Epigenética y microbiota" },
  { icon: Library, label: "Apego y neurociencias" },
  { icon: ShieldCheck, label: "Protocolos basados en evidencia científica" },
];

const moduleIcons = [Baby, Brain, ShieldCheck, Stethoscope];

// "¿Qué incluye tu inscripción?" — 8 tarjetas del docx
const perks = [
  {
    icon: Video,
    title: "8 sesiones académicas en vivo",
    text: "Clases sincrónicas donde podrás interactuar con el docente, resolver consultas y profundizar en los contenidos del programa.",
  },
  {
    icon: Laptop,
    title: "Campus Virtual NeoSer",
    text: "Accede durante 12 meses a las sesiones, materiales académicos y recursos complementarios desde una plataforma diseñada para acompañar tu proceso de aprendizaje.",
  },
  {
    icon: NotebookPen,
    title: "NeoSer Workbook",
    text: "Una guía de trabajo desarrollada para integrar los conocimientos adquiridos y favorecer su aplicación en la práctica clínica.",
  },
  {
    icon: FileText,
    title: "Bibliografía científica",
    text: "Una selección de artículos y publicaciones científicas que complementan y respaldan los contenidos desarrollados durante el curso.",
  },
  {
    icon: Stethoscope,
    title: "Casos clínicos y prácticas guiadas",
    text: "Analiza situaciones clínicas y fortalece la toma de decisiones mediante actividades orientadas a la aplicación de la evidencia científica.",
  },
  {
    icon: Clock,
    title: "Grabaciones disponibles 12 meses",
    text: "Revisa cada sesión a tu propio ritmo y refuerza los contenidos cuando lo necesites durante un año.",
  },
  {
    icon: MessagesSquare,
    title: "Comunidad Académica NeoSer",
    text: "Forma parte de una comunidad de profesionales comprometidos con la actualización permanente y la humanización de la atención materno-perinatal.",
  },
  {
    icon: Award,
    title: "Certificación Académica",
    text: "Recibe un Certificado de Aprobación por 64 horas académicas, equivalentes a 4 créditos académicos.",
  },
];

const keyInfo = [
  { icon: Calendar, label: "Inicio", value: course.startLabel! },
  { icon: Clock, label: "Horario", value: course.scheduleLabel! },
  { icon: Laptop, label: "Modalidad", value: "Virtual sincrónica" },
  { icon: GraduationCap, label: "Duración", value: "64 horas académicas · 4 créditos" },
  { icon: Users, label: "Dirigido a", value: course.audience! },
  { icon: Library, label: "Campus Virtual", value: "Acceso durante 12 meses" },
];

const faqs = [
  {
    q: "¿A quién está dirigido el curso?",
    a: "A obstetras, médicos gineco-obstetras, neonatólogos, pediatras y profesionales vinculados a la atención materno-perinatal que buscan actualizar su práctica clínica con evidencia científica reciente.",
  },
  {
    q: "¿Qué pasa si no puedo asistir a una sesión en vivo?",
    a: "Todas las sesiones quedan grabadas y disponibles en el Campus Virtual NeoSer durante 12 meses, para que puedas revisarlas a tu ritmo.",
  },
  {
    q: "¿Qué certificación recibo?",
    a: "Un Certificado de Aprobación por 64 horas académicas, equivalentes a 4 créditos académicos, emitido por Maternidad y Medicina Humanizada NeoSer.",
  },
  {
    q: "¿Hay un precio especial para egresadas NeoSer?",
    a: "Sí. Si ya llevaste un curso con nosotros, la inversión es de S/ 220 para participantes en Perú y USD 60 para participantes del extranjero. Escríbenos por WhatsApp para aplicar tu tarifa.",
  },
  {
    q: "¿Cómo puedo pagar desde el extranjero?",
    a: "Escríbenos por WhatsApp al " +
      CONTACT_PHONE +
      " y coordinamos el medio de pago internacional que te resulte más cómodo.",
  },
  {
    q: "¿Aún tienes preguntas?",
    a: `Escríbenos a ${CONTACT_EMAIL} o por WhatsApp al ${CONTACT_PHONE}. Con gusto te orientamos antes de reservar tu vacante.`,
  },
];

export function NeurobiologiaLanding() {
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

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-cream pt-32 pb-16 md:pt-40 md:pb-24">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy shadow-sm">
              Curso virtual · Edición 2026
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-pink-dark">
              <Sparkles className="h-3.5 w-3.5" /> Inscripciones abiertas
            </span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div data-aos="fade-up">
              <p
                className="mb-1 text-pink"
                style={{
                  fontFamily: 'var(--font-playfair), "Noto Serif Display", Georgia, serif',
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "clamp(2.4rem,5.5vw,4.2rem)",
                  lineHeight: 1,
                }}
              >
                Neurobiología
              </p>
              <h1
                className="section-title text-navy"
                style={{ fontSize: "clamp(2rem,4.2vw,3.2rem)" }}
              >
                del Parto y Protocolos para un{" "}
                <span className="bg-gradient-to-r from-pink to-pink-dark bg-clip-text text-transparent">
                  Nacimiento Humanizado
                </span>
              </h1>
              <p className="mt-5 text-lg font-bold text-navy md:text-xl">
                {course.tagline}
              </p>
              <p className="mt-2 max-w-xl text-gray-500">
                Un programa que integra los avances en neurobiología, microbiota,
                epigenética, neurociencias y teoría del apego para fortalecer la
                práctica clínica con protocolos basados en evidencia científica.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Inicio: 18 de agosto de 2026",
                  "🌎 Virtual sincrónica",
                  "64 h académicas · 4 créditos",
                  "Campus Virtual 12 meses",
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
                <Link href={ENROLL_HREF} className="btn-primary">
                  Reservar mi vacante <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={BROCHURE_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pink-outline"
                >
                  <Download className="h-4 w-4" /> Descargar brochure
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm" data-aos="fade-up" data-aos-delay="100">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-white shadow-lg">
                <Image
                  src={course.image}
                  alt="Curso Neurobiología del Parto y Protocolos para un Nacimiento Humanizado — NeoSer"
                  fill
                  sizes="(max-width: 1023px) 100vw, 420px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-white">
                  <Brain className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold leading-tight text-navy">
                  Edición 2026
                  <br />
                  <span className="text-xs font-normal text-gray-400">
                    Cupos limitados
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POR QUÉ ESTE CURSO ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Por qué este curso</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Comprender la biología del nacimiento es el primer paso para{" "}
              <span className="text-pink">
                transformar la atención materno-perinatal.
              </span>
            </h2>
          </div>

          <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center" data-aos="fade-up">
            {course.description.map((p) => (
              <p key={p} className="leading-relaxed text-gray-500">
                {p}
              </p>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {reasons.map((r, i) => (
              <div
                key={r.text}
                className="surface-card flex gap-4 p-6"
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 100}
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink to-pink-dark text-white shadow-md ring-1 ring-pink/20">
                  <r.icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <p className="self-center text-sm leading-relaxed text-gray-600">
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EJES TEMÁTICOS ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-blue py-20 text-white md:py-28">
        <DecorParticles tone="dark" />
        <div className="container-main relative">
          <div className="mb-12 text-center" data-aos="fade-up">
            <p className="section-tag mb-2 !text-pink-light">Ejes temáticos del programa</p>
            <h2 className="mx-auto max-w-3xl text-3xl font-bold md:text-4xl">
              Cuatro ejes que sostienen toda la formación.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {axes.map((a, i) => (
              <div
                key={a.label}
                className="group rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:bg-white/10"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink text-white shadow-md transition-transform duration-500 group-hover:-rotate-6">
                  <a.icon className="h-7 w-7" strokeWidth={1.7} />
                </span>
                <p className="text-sm font-semibold leading-snug">{a.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-center text-lg font-semibold italic text-pink-light" data-aos="fade-up">
            ¡Porque nacer y vivir con amor cambia el mundo!
          </p>
        </div>
      </section>

      {/* ===== CONTENIDO ACADÉMICO ===== */}
      <section id="contenidos" className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Contenido académico</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Cuatro módulos que van de la biología del nacimiento{" "}
              <span className="text-pink">a la práctica clínica.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              El programa integra los fundamentos biológicos del nacimiento con su
              aplicación clínica basada en evidencia científica.
            </p>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {(course.modules ?? []).map((m, i) => {
              const Icon = moduleIcons[i] ?? Brain;
              return (
                <details
                  key={m.n}
                  className="surface-card group p-5 transition duration-300 hover:shadow-md md:p-7"
                  data-aos="fade-up"
                  data-aos-delay={(i % 2) * 100}
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
                      <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.7} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Módulo {m.n}
                      </p>
                      <h3 className="text-base font-bold text-navy md:text-lg">
                        {m.title}
                      </h3>
                    </div>
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-light text-xl leading-none text-pink transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="mt-4 border-t border-navy/5 pt-4">
                    <p className="text-sm leading-relaxed text-gray-500">
                      {m.purpose}
                    </p>
                    <p className="mt-4 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Contenidos principales
                    </p>
                    <ul className="space-y-2">
                      {m.topics.map((t) => (
                        <li key={t} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink" />
                          <span className="text-sm leading-snug text-gray-600">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>

          <div className="mt-10 text-center" data-aos="fade-up">
            <a
              href={BROCHURE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pink-outline"
            >
              <Download className="h-4 w-4" /> Descargar brochure completo (PDF)
            </a>
          </div>
        </div>
      </section>

      {/* ===== QUÉ INCLUYE TU INSCRIPCIÓN ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">¿Qué incluye tu inscripción?</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Mucho más que un{" "}
              <span className="text-pink">curso de actualización.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Una experiencia académica diseñada para fortalecer tu aprendizaje y
              facilitar la aplicación de la evidencia científica en la práctica
              clínica.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p, i) => (
              <div
                key={p.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white p-6 transition duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={(i % 4) * 80}
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white shadow-md ring-1 ring-blue/20 transition-transform duration-500 group-hover:-rotate-6">
                  <p.icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <h3 className="mb-2 text-sm font-bold leading-snug text-navy">
                  {p.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">{p.text}</p>
                <span
                  className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-pink to-pink-dark transition-transform duration-500 group-hover:scale-x-100"
                  aria-hidden
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EQUIPO ACADÉMICO ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Equipo académico</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Un referente latinoamericano en{" "}
              <span className="text-pink">humanización del nacimiento.</span>
            </h2>
          </div>

          {/* Docente */}
          <div
            className="surface-card mx-auto grid max-w-4xl items-center gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10"
            data-aos="fade-up"
          >
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-lg md:mx-0">
              <Image
                src="/assets/cursos/dr-beltran-lares.jpg"
                alt="Dr. Beltrán Lares, médico ginecólogo-obstetra"
                width={320}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Docente del programa
              </p>
              <h3 className="mt-1 text-2xl font-bold text-navy">Dr. Beltrán Lares</h3>
              <p className="mb-1 text-sm font-semibold text-pink">
                Médico ginecólogo-obstetra
              </p>
              <p className="mb-4 text-sm text-gray-400">
                Director de AuroraMadre Academia — Buenos Aires, Argentina
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                Con más de 30 años de experiencia clínica y docente, ha dedicado su
                trayectoria a la formación de profesionales de la salud y al
                desarrollo de modelos de atención centrados en la fisiología del
                nacimiento. Su trabajo integra los avances en neurobiología del
                parto, microbiota, epigenética, teoría del apego y neurociencias,
                promoviendo una práctica clínica sustentada en evidencia científica.
              </p>
            </div>
          </div>

          {/* Dirección académica */}
          <div className="mx-auto mt-6 max-w-4xl" data-aos="fade-up">
            <div className="surface-card grid items-center gap-6 p-6 md:grid-cols-[auto_1fr] md:p-8">
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow md:mx-0">
                <Image
                  src="/assets/formadora-diana.png"
                  alt="Obst. Diana Silva Mejía"
                  width={224}
                  height={224}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Dirección académica
                </p>
                <h3 className="mt-1 text-lg font-bold text-navy">
                  Obst. Diana Silva Mejía
                </h3>
                <p className="mb-2 text-sm font-semibold text-pink">
                  Gerente General de NeoSer Perú
                </p>
                <p className="text-sm leading-relaxed text-gray-500">
                  Obstetra especialista en Proyectos de Desarrollo Social. Profesora
                  certificada del método Periné y Movimiento®, doula certificada por
                  AuroraMadre y conferencista nacional e internacional. Lidera
                  programas de formación dirigidos a profesionales de la salud,
                  promoviendo una atención basada en evidencia y centrada en la
                  madre, el recién nacido y la familia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFORMACIÓN CLAVE ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Información clave</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Todo lo que necesitas saber <span className="text-pink">de un vistazo.</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
            {keyInfo.map((k) => (
              <div
                key={k.label}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-navy/5 bg-white p-5 transition duration-500 hover:-translate-y-1 hover:shadow-xl"
                data-aos="fade-up"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white shadow-md ring-1 ring-blue/20 transition-transform duration-500 group-hover:-rotate-6">
                  <k.icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {k.label}
                  </p>
                  <p className="text-sm font-semibold leading-snug text-navy">
                    {k.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INVERSIÓN ===== */}
      <section id="reservar" className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div
            className="surface-card mx-auto max-w-2xl p-8 text-center shadow-sm md:p-12"
            data-aos="fade-up"
          >
            <p className="section-tag mb-2">Inversión</p>
            <h2 className="section-title mb-6">
              Reserva tu vacante en la <span className="text-pink">Edición 2026.</span>
            </h2>

            <div className="mx-auto mb-8 grid max-w-md gap-4 sm:grid-cols-2">
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
                    className="mt-1 text-3xl font-bold text-navy"
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

            <div className="mx-auto mb-8 max-w-md space-y-3 text-left">
              {course.includes.slice(0, 5).map((it) => (
                <div key={it} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink" />
                  <span className="text-sm text-gray-600">{it}</span>
                </div>
              ))}
            </div>

            <Link href={ENROLL_HREF} className="btn-primary mx-auto justify-center">
              Quiero reservar mi vacante <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-gray-400">
              Cupos limitados · Pago con tarjeta o Yape · Tarifa de egresadas y pagos
              desde el extranjero se coordinan por WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Preguntas frecuentes</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Todo lo que necesitas saber{" "}
              <span className="text-pink">antes de reservar tu vacante.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-3" data-aos="fade-up">
            {faqs.map((f) => (
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
                <p className="mt-3 text-sm leading-relaxed text-gray-500">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 text-center" data-aos="fade-up">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pink-outline"
            >
              ¿Aún tienes dudas? Escríbenos por WhatsApp
            </a>
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
                Centro de maternidad y medicina humanizada en Chiclayo. Formación
                profesional en nacimiento respetado.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">El curso</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#contenidos">Contenido académico</a></li>
                <li><a href="#reservar">Reservar vacante</a></li>
                <li>
                  <a href={BROCHURE_HREF} target="_blank" rel="noopener noreferrer">
                    Descargar brochure
                  </a>
                </li>
                <li><Link href="/cursos">Otros cursos</Link></li>
                <li><Link href="/">Volver al inicio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0 text-pink" /> Calle Los Sauces 542, Chiclayo</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0 text-pink" /> {CONTACT_PHONE}</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 flex-shrink-0 text-pink" /> {CONTACT_EMAIL}</li>
                <li className="flex items-center gap-2"><Award className="h-4 w-4 flex-shrink-0 text-pink" /> En alianza con AuroraMadre Academia</li>
              </ul>
            </div>
          </div>
          <div className="footer-divider mt-10 flex flex-col items-center justify-center gap-4 pt-8">
            <p className="text-sm opacity-60">
              &copy; 2026 NeoSer - Maternidad y Medicina Humanizada. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
