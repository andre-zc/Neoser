"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  Laptop,
  Mail,
  MapPin,
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

const course = getCatalogCourse("seminario-protocolos-nacimiento-humanizado")!;

const ENROLL_HREF =
  "/cursos/seminario-protocolos-nacimiento-humanizado/inscribirse";
const WHATSAPP_HREF = whatsappHref(course.whatsappText);
const FLYER_HREF = course.brochureHref!;

const topics = (course.modules ?? []).map((m) => ({
  icon: ShieldCheck,
  title: m.title,
  text: m.purpose,
}));

const perks = [
  {
    icon: Video,
    title: "04 seminarios online",
    text: "Sesiones en vivo con espacio de interacción, consultas y reflexión sobre la práctica clínica.",
  },
  {
    icon: BookOpen,
    title: "NeoSer Workbook",
    text: "Material de trabajo para integrar los contenidos y favorecer su aplicación profesional.",
  },
  {
    icon: Laptop,
    title: "Videos y bibliografía",
    text: "Videos documentales y bibliografía complementaria que respaldan los contenidos del seminario.",
  },
  {
    icon: Clock,
    title: "Grabaciones 1 año",
    text: "Acceso a las grabaciones de las clases durante un año para repasar cuando lo necesites.",
  },
  {
    icon: GraduationCap,
    title: "32 horas académicas",
    text: "Carga académica equivalente a 2 créditos académicos.",
  },
  {
    icon: Award,
    title: "Certificado digital",
    text: "Certificado digital con código QR al completar el seminario.",
  },
];

const keyInfo = [
  { icon: Laptop, label: "Modalidad", value: course.mode },
  { icon: Calendar, label: "Inicio", value: course.startLabel! },
  { icon: Clock, label: "Horario", value: course.scheduleLabel! },
  { icon: GraduationCap, label: "Duración", value: "04 seminarios online · 32 h académicas" },
  { icon: Users, label: "Dirigido a", value: course.audience! },
  { icon: Award, label: "Certificación", value: course.certification! },
];

export function SeminarioProtocolosLanding() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("aos-visible");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
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
              Seminario Internacional
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-pink-dark">
              <Sparkles className="h-3.5 w-3.5" /> Inscripciones abiertas
            </span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div data-aos="fade-up">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Seminario Internacional
              </p>
              <h1
                className="section-title text-navy"
                style={{ fontSize: "clamp(2rem,4.2vw,3.2rem)" }}
              >
                Protocolos para un{" "}
                <span className="bg-gradient-to-r from-pink to-pink-dark bg-clip-text text-transparent">
                  Nacimiento Humanizado
                </span>
              </h1>
              <p className="mt-5 text-lg font-bold text-navy md:text-xl">
                {course.tagline}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  `Inicio: ${course.startLabel}`,
                  "🌎 Virtual en vivo",
                  "04 seminarios online",
                  "32 h académicas · 2 créditos",
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
                  Inscribirme <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={FLYER_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pink-outline"
                >
                  <Download className="h-4 w-4" /> Descargar flyer
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
                  alt="Seminario Internacional Protocolos para un Nacimiento Humanizado — NeoSer"
                  fill
                  sizes="(max-width: 1023px) 100vw, 420px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-white">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold leading-tight text-navy">
                  Septiembre 2026
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

      {/* ===== SOBRE EL SEMINARIO ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Sobre el seminario</p>
            <h2 className="section-title mx-auto max-w-3xl">
              De la evidencia científica a la{" "}
              <span className="text-pink">práctica clínica responsable.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4 text-center" data-aos="fade-up">
            {course.description.map((p) => (
              <p key={p} className="leading-relaxed text-gray-500">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUÉ ABORDAREMOS ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-blue py-20 text-white md:py-28">
        <DecorParticles tone="dark" />
        <div className="container-main relative">
          <div className="mb-12 text-center" data-aos="fade-up">
            <p className="section-tag mb-2 !text-pink-light">¿Qué abordaremos?</p>
            <h2 className="mx-auto max-w-3xl text-3xl font-bold md:text-4xl">
              Cinco ejes para actualizar tu práctica profesional.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <div
                key={t.title}
                className="group rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:bg-white/10"
                data-aos="fade-up"
                data-aos-delay={i * 80}
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pink text-white shadow-md transition-transform duration-500 group-hover:-rotate-6">
                  <t.icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <h3 className="mb-2 text-sm font-bold leading-snug">{t.title}</h3>
                <p className="text-sm leading-relaxed text-white/80">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DE LA NEUROBIOLOGÍA A LA PRÁCTICA ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div
            className="surface-card mx-auto max-w-4xl p-8 text-center md:p-12"
            data-aos="fade-up"
          >
            <p className="section-tag mb-2">Programa de formación NeoSer</p>
            <h2 className="section-title mx-auto mb-4 max-w-2xl">
              Comprender la fisiología es el primer paso.{" "}
              <span className="text-pink">Protegerla desde nuestra práctica es el siguiente.</span>
            </h2>
            <p className="mx-auto mb-4 max-w-2xl text-sm leading-relaxed text-gray-500">
              <strong className="text-navy">Neurobiología del Parto</strong> permite
              comprender los procesos fisiológicos, neurobiológicos y hormonales que
              intervienen durante el nacimiento.
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-gray-500">
              <strong className="text-navy">Protocolos para un Nacimiento Humanizado</strong>{" "}
              lleva estos conocimientos hacia la práctica mediante la revisión de
              protocolos, rutinas e intervenciones presentes en la atención del
              nacimiento.
            </p>
            <Link href="/cursos/neurobiologia-parto" className="btn-pink-outline">
              Conoce el curso de Neurobiología del Parto
            </Link>
          </div>
        </div>
      </section>

      {/* ===== DOCENTE ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Docente</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Un referente en{" "}
              <span className="text-pink">humanización del nacimiento.</span>
            </h2>
          </div>

          <div
            className="surface-card mx-auto grid max-w-4xl items-center gap-8 p-6 md:grid-cols-[auto_1fr] md:p-10"
            data-aos="fade-up"
          >
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-lg md:mx-0">
              <Image
                src="/assets/cursos/dr-beltran-lares.jpg"
                alt="Dr. Beltrán Lares Díaz"
                width={320}
                height={320}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-navy">Dr. Beltrán Lares Díaz</h3>
              <p className="mb-4 text-sm font-semibold text-pink">
                Director Aurora Madre · Médico ginecólogo-obstetra
              </p>
              <p className="text-sm leading-relaxed text-gray-500">
                Con más de 30 años de experiencia clínica y docente, ha dedicado su
                trayectoria a la formación de profesionales de la salud y al
                desarrollo de modelos de atención centrados en la fisiología del
                nacimiento, promoviendo una práctica clínica sustentada en evidencia
                científica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== QUÉ INCLUYE ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">El seminario incluye</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Todo lo necesario para{" "}
              <span className="text-pink">tu actualización profesional.</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <div
                key={p.title}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-navy/5 bg-white p-6 transition duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 80}
              >
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white shadow-md ring-1 ring-blue/20 transition-transform duration-500 group-hover:-rotate-6">
                  <p.icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <h3 className="mb-2 text-sm font-bold leading-snug text-navy">
                  {p.title}
                </h3>
                <p className="text-xs leading-relaxed text-gray-500">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INFORMACIÓN ACADÉMICA ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Información académica</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Todo lo que necesitas saber{" "}
              <span className="text-pink">de un vistazo.</span>
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
      <section id="inscribirse" className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div
            className="surface-card mx-auto max-w-2xl p-8 text-center shadow-sm md:p-12"
            data-aos="fade-up"
          >
            <p className="section-tag mb-2">Inversión</p>
            <h2 className="section-title mb-6">
              Reserva tu vacante en el{" "}
              <span className="text-pink">Seminario Internacional.</span>
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
                    style={{
                      fontFamily:
                        "var(--font-playfair), 'Noto Serif Display', Georgia, serif",
                    }}
                  >
                    {t.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mx-auto mb-8 max-w-md space-y-3 text-left">
              {course.includes.map((it) => (
                <div key={it} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink" />
                  <span className="text-sm text-gray-600">{it}</span>
                </div>
              ))}
            </div>

            <Link href={ENROLL_HREF} className="btn-primary mx-auto justify-center">
              Quiero inscribirme <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-gray-400">
              Pago seguro con tarjeta o Yape (soles) · Tarjeta en dólares para el
              extranjero
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
              Resolvemos tus dudas{" "}
              <span className="text-pink">antes de inscribirte.</span>
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
              <h4 className="mb-4 font-semibold text-white">El seminario</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#inscribirse">Inscribirme</a>
                </li>
                <li>
                  <a href={FLYER_HREF} target="_blank" rel="noopener noreferrer">
                    Descargar flyer
                  </a>
                </li>
                <li>
                  <Link href="/cursos/neurobiologia-parto">Curso de Neurobiología</Link>
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
                  <Phone className="h-4 w-4 flex-shrink-0 text-pink" /> {CONTACT_PHONE}
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-pink" /> {CONTACT_EMAIL}
                </li>
                <li className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 flex-shrink-0 text-pink" /> En alianza
                  con AuroraMadre Academia
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
