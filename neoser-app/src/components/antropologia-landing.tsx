"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Scale,
  ShieldAlert,
  Globe,
  Users,
  Award,
  Calendar,
  Clock,
  Laptop,
  GraduationCap,
  Quote,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";

const ENROLL_HREF = "/cursos/antropologia-parto/inscribirse";
const WHATSAPP_HREF =
  "https://wa.me/51932713071?text=Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20Curso%20Internacional%20Antropolog%C3%ADa%20del%20Parto";

const opportunities = [
  {
    icon: BookOpen,
    text:
      "Explorar los paradigmas sociales y culturales que influyen en las prácticas obstétricas y cómo impactan la salud integral.",
  },
  {
    icon: Users,
    text:
      "Reflexionar sobre el papel del respeto hacia la mujer, su familia y el entorno en el contexto del parto humanizado.",
  },
  {
    icon: ShieldAlert,
    text:
      "Analizar las implicaciones de la violencia obstétrica en la salud y el bienestar de las mujeres.",
  },
  {
    icon: Globe,
    text:
      "Evaluar las tendencias mundiales en obstetricia y el surgimiento de la partería posmoderna.",
  },
];

const audience = [
  "Profesionales del sector salud, educación y desarrollo social que desean profundizar en los enfoques de atención reproductiva.",
  "Quienes buscan promover el respeto genuino hacia las mujeres, sus familias y el entorno en el ámbito de la salud reproductiva.",
];

const modules = [
  {
    n: "01",
    icon: BookOpen,
    title: "Antropología del nacimiento",
    sessions: [
      "Modelos de atención en salud reproductiva",
      "Rituales del nacimiento: el parto como un rito de paso",
      "Sistemas de conocimiento y sus equivalentes antropológicos",
    ],
    text:
      "Una exploración profunda de los paradigmas antropológicos en torno al nacimiento, destacando la influencia del modelo tecnocrático en las prácticas obstétricas contemporáneas. Se analizan los enfoques tecnocrático, humanizado y holístico, y se interpretan los protocolos obstétricos como 'ritos de paso'.",
  },
  {
    n: "02",
    icon: Users,
    title: "Sociología en Salud Reproductiva",
    sessions: ["Sociología del nacimiento y la práctica médica"],
    text:
      "Análisis de la formación y el ejercicio profesional de obstetras, parteras, médicos y enfermeras desde una perspectiva sociológica. Se exploran las tensiones entre la práctica clínica y el respeto a los derechos reproductivos, y las etapas de la cognición (Schroder, Driver y Streufert) bajo la interpretación de R. Davis-Floyd.",
  },
  {
    n: "03",
    icon: ShieldAlert,
    title: "Violencia obstétrica",
    sessions: [
      "Violencia en salud reproductiva",
      "Violencia obstétrica en prosa y fotografía",
    ],
    text:
      "Abordaje de la violencia obstétrica desde una perspectiva sociológica y de derechos humanos y de género. Se revisan las normativas legales y éticas vigentes que promueven la humanización del nacimiento, identificando oportunidades de mejora en la práctica obstétrica.",
  },
  {
    n: "04",
    icon: Globe,
    title: "Tendencias Mundiales en Obstetricia",
    sessions: [
      "El surgimiento de la partería posmoderna",
      "Presentación y discusión de casos",
    ],
    text:
      "Análisis de las tendencias emergentes en obstetricia, con especial enfoque en la partería posmoderna, y discusión de casos clínicos que inspiran un enfoque de atención humanizado, basado en el respeto mutuo, la dignidad y la colaboración.",
  },
];

const facilitators = [
  {
    name: "Dr. Beltrán Lares Díaz",
    role: "Director de Aurora Madre · Venezuela",
    initials: "BL",
    bio:
      "Médico cirujano y pionero de la humanización del parto en Venezuela desde 1989, con más de 30 años de experiencia en obstetricia y ginecología. Fundador de Aquamater, clínica de maternidad humanizada en Caracas. Autor del libro «Violencia en prosa y fotografía» (2021).",
  },
  {
    name: "Dra. Robbie Davis-Floyd",
    role: "Antropóloga médica/cultural · EE. UU.",
    initials: "RD",
    bio:
      "Antropóloga médica y reproductiva de renombre internacional, profesora adjunta en la Universidad Rice (Houston, Texas). Autora de «Birth as an American Rite of Passage» y oradora en más de 1000 conferencias sobre el parto y la obstetricia.",
  },
];

const keyInfo = [
  { icon: Laptop, label: "Modalidad", value: "Online" },
  { icon: Calendar, label: "Duración", value: "1 mes · 8 sesiones" },
  { icon: Clock, label: "Frecuencia", value: "Martes y jueves · 7 a 9 pm (hora Perú)" },
  { icon: GraduationCap, label: "Certificación", value: "48 horas académicas (3 créditos) + certificado digital" },
];

const testimonials = [
  {
    name: "Dr. Beltrán Lares",
    handle: "@dr.beltranlares",
    quote:
      "Para todas las personas involucradas en acompañar a mujeres y familias en la salud reproductiva, este curso proporciona una herramienta invaluable de comprensión y conciencia. Para mí, marcó un antes y un después.",
  },
  {
    name: "Diana Silva",
    handle: "@dianasilvamejia",
    quote:
      "Conocer la antropología del parto marcó un hito en mi vida profesional. Me permitió comprender cómo el modelo biomédico ha limitado a las mujeres, y hoy sé que es fundamental recuperar la sabiduría ancestral respaldada por la ciencia.",
  },
];

const faqs = [
  {
    q: "¿A quién está dirigido el curso?",
    a: "A profesionales del sector salud, educación y desarrollo social que deseen profundizar en los enfoques de atención reproductiva, y a quienes buscan promover el respeto genuino hacia las mujeres, sus familias y el entorno.",
  },
  {
    q: "¿Qué certificación recibo?",
    a: "Se otorga un certificado digital y material de estudio complementario, equivalente a 48 horas académicas (3 créditos).",
  },
  {
    q: "¿Cómo son las clases y el horario?",
    a: "Es un curso 100% online. Las sesiones son dos veces por semana, martes y jueves, de 7 a 9 pm hora Perú, a lo largo de un mes.",
  },
  {
    q: "¿Cuál es la inversión y cómo puedo pagar?",
    a: "La inversión es de S/ 200 para Perú y USD 60 a nivel internacional. Al iniciar tu inscripción te indicamos los medios de pago disponibles (transferencia, Yape y PayPal internacional).",
  },
  {
    q: "¿Aún tienes preguntas?",
    a: "Escríbenos por WhatsApp al +51 932 713 071 o al correo peruneoser@gmail.com. Con gusto te orientamos antes de reservar tu lugar.",
  },
];

export function AntropologiaLanding() {
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
              Curso Internacional · NeoSer + Aurora Madre
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-pink-dark">
              <Sparkles className="h-3.5 w-3.5" /> Inscripciones abiertas
            </span>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-2">
            <div data-aos="fade-up">
              <p
                className="mb-1 text-pink"
                style={{
                  fontFamily: "var(--font-dancing), cursive",
                  fontStyle: "italic",
                  fontSize: "clamp(2.4rem,5.5vw,4.2rem)",
                  lineHeight: 1,
                }}
              >
                Antropología
              </p>
              <h1 className="section-title text-navy" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>
                del Parto, hacia un{" "}
                <span className="bg-gradient-to-r from-pink to-pink-dark bg-clip-text text-transparent">
                  nacimiento humanizado
                </span>
              </h1>
              <p className="mt-5 text-lg font-bold text-navy md:text-xl">
                Una mirada profunda a los paradigmas del nacimiento.
              </p>
              <p className="mt-2 max-w-xl text-gray-500">
                Los paradigmas sociales y culturales del nacimiento, las tendencias
                mundiales en obstetricia y el surgimiento de la partería posmoderna,
                desde una perspectiva de derechos humanos.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "1 mes · 8 sesiones",
                  "🌎 Modalidad online",
                  "48 h académicas · 3 créditos",
                  "Certificado digital",
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
                  Reservar mi lugar <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#contenidos" className="btn-pink-outline">
                  Ver los módulos
                </a>
              </div>
            </div>

            <div className="relative" data-aos="fade-up" data-aos-delay="100">
              <div className="relative h-72 w-full overflow-hidden rounded-3xl border-4 border-white shadow-lg md:h-96">
                <Image
                  src="/assets/hero/slide-1-maternidad.jpg"
                  alt="Curso Internacional Antropología del Parto — NeoSer"
                  fill
                  sizes="(max-width: 1023px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-white">
                  <Scale className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold leading-tight text-navy">
                  Derechos humanos
                  <br />
                  <span className="text-xs font-normal text-gray-400">y nacimiento respetado</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTEXTO / MANIFIESTO ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Por qué este curso</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Surgen términos como «parto humanizado» y «parto respetado»,{" "}
              <span className="text-pink">pero su significado aún está en evolución.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-6" data-aos="fade-up">
            <p className="text-center leading-relaxed text-gray-500">
              Hoy conviven distintas corrientes en la atención a la madre gestante.
              Frente a esa encrucijada, urge reflexionar y actualizar el modelo de
              atención para proteger la vida y la dignidad del ser humano.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "¿Cómo impactan los paradigmas culturales las prácticas obstétricas?",
                "¿Estamos ante un aumento de la violencia obstétrica?",
                "¿Qué modelo de atención debemos adoptar hoy?",
              ].map((q) => (
                <div
                  key={q}
                  className="rounded-2xl border border-navy/5 bg-white p-4 text-sm font-medium leading-snug text-navy shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {q}
                </div>
              ))}
            </div>
            <p className="text-center text-lg font-semibold text-navy">
              Porque nacer y vivir con amor cambia el mundo.
            </p>
          </div>
        </div>
      </section>

      {/* ===== OBJETIVOS / OPORTUNIDADES ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Objetivos del curso</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Una visión integral sobre los modelos de atención y la violencia
              obstétrica <span className="text-pink">desde los derechos humanos.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {opportunities.map((o, i) => (
              <div
                key={i}
                className="surface-card flex gap-4 p-6"
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 100}
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink to-pink-dark text-white shadow-md ring-1 ring-pink/20">
                  <o.icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <p className="text-sm leading-relaxed text-gray-600">{o.text}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-8" data-aos="fade-up">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Dirigido a
            </p>
            <ul className="space-y-3">
              {audience.map((a) => (
                <li key={a} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink" />
                  <span className="text-sm text-gray-600">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== PROGRAMACIÓN DE CONTENIDOS ===== */}
      <section id="contenidos" className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Programación de contenidos</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Cuatro módulos para comprender{" "}
              <span className="text-pink">el nacimiento como fenómeno humano.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {modules.map((m, i) => (
              <details
                key={m.n}
                className="surface-card group p-5 transition duration-300 hover:shadow-md md:p-7"
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 100}
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-start gap-4 [&::-webkit-details-marker]:hidden">
                  <div
                    className="hidden bg-gradient-to-br from-pink/55 to-blue/45 bg-clip-text text-4xl font-extrabold text-transparent sm:block md:text-5xl"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {m.n}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink to-pink-dark text-white shadow-md ring-1 ring-pink/20 transition-transform duration-500 group-hover:-rotate-6">
                        <m.icon className="h-5 w-5" strokeWidth={1.7} />
                      </span>
                      <h3 className="text-base font-bold text-navy md:text-xl">{m.title}</h3>
                    </div>
                    <ul className="flex flex-wrap gap-2">
                      {m.sessions.map((s) => (
                        <li
                          key={s}
                          className="rounded-full bg-blue-light/70 px-3 py-1 text-xs font-medium text-blue"
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-light text-xl leading-none text-pink transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 border-t border-navy/5 pt-4 text-sm leading-relaxed text-gray-500">
                  {m.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FACILITADORES ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Facilitadores</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Referentes internacionales de la{" "}
              <span className="text-pink">humanización del nacimiento.</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {facilitators.map((f) => (
              <div key={f.name} className="surface-card p-6 md:p-8" data-aos="fade-up">
                <div className="mb-4 flex items-center gap-4">
                  <span className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink to-pink-dark text-xl font-bold text-white">
                    {f.initials}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy">{f.name}</h3>
                    <p className="text-sm font-semibold text-pink">{f.role}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-500">{f.bio}</p>
              </div>
            ))}
          </div>

          {/* Coordinadora técnica */}
          <div className="mx-auto mt-8 max-w-4xl" data-aos="fade-up">
            <div className="surface-card grid items-center gap-6 p-6 md:grid-cols-[auto_1fr] md:p-8">
              <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow md:mx-0">
                <Image
                  src="/assets/formadora-diana.png"
                  alt="Obsta. Diana E. Silva Mejía"
                  width={224}
                  height={224}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Coordinadora técnica del curso
                </p>
                <h3 className="mt-1 text-lg font-bold text-navy">Obsta. Diana E. Silva Mejía</h3>
                <p className="mb-2 text-sm font-semibold text-pink">
                  Gerente General y Cofundadora de NeoSer Perú
                </p>
                <p className="text-sm leading-relaxed text-gray-500">
                  Profesora certificada del Método «Periné y Movimiento», pionera en el
                  Perú. Doula perinatal y profesora diplomada en Psicofonía y Canto
                  Prenatal (Método Marie Louise Aucher, Francia), especialista en
                  programas y proyectos de desarrollo social.
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
              <div key={k.label} className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-navy/5 bg-white p-5 transition duration-500 hover:-translate-y-1 hover:shadow-xl" data-aos="fade-up">
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white shadow-md ring-1 ring-blue/20 transition-transform duration-500 group-hover:-rotate-6">
                  <k.icon className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400">{k.label}</p>
                  <p className="text-sm font-semibold text-navy">{k.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRECIO / INVERSIÓN ===== */}
      <section id="reservar" className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="surface-card mx-auto max-w-2xl p-8 text-center shadow-sm md:p-12" data-aos="fade-up">
            <p className="section-tag mb-2">Inversión</p>
            <h2 className="section-title mb-6">
              Reserva tu lugar en el <span className="text-pink">Curso Internacional.</span>
            </h2>

            <div className="mx-auto mb-8 grid max-w-md gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-pink-light/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-pink-dark">
                  Perú
                </p>
                <p
                  className="mt-1 text-3xl font-extrabold text-navy"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  S/ 200
                </p>
              </div>
              <div className="rounded-2xl bg-blue-light/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue">
                  Internacional
                </p>
                <p
                  className="mt-1 text-3xl font-extrabold text-navy"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  USD 60
                </p>
              </div>
            </div>

            <div className="mx-auto mb-8 max-w-md space-y-3 text-left">
              {[
                "Certificado digital — 48 horas académicas (3 créditos)",
                "Material de estudio complementario",
                "8 sesiones en vivo a lo largo de 1 mes",
                "Facilitadores internacionales",
              ].map((it) => (
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
              Cupos limitados · Medios de pago: transferencia, Yape y PayPal internacional
            </p>
          </div>
        </div>
      </section>

      {/* ===== HISTORIAS QUE NOS UNEN ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Historias que nos unen</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Lo que este curso <span className="text-pink">transformó en quienes lo vivieron.</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.name} className="surface-card p-6 md:p-8" data-aos="fade-up">
                <Quote className="mb-3 h-8 w-8 text-pink-light" />
                <p className="mb-5 text-sm leading-relaxed text-gray-600">{t.quote}</p>
                <div>
                  <p className="text-sm font-bold text-navy">{t.name}</p>
                  <p className="text-xs text-gray-400">Instagram: {t.handle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Preguntas frecuentes</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Todo lo que necesitas saber{" "}
              <span className="text-pink">antes de reservar tu lugar.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-3" data-aos="fade-up">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-navy/8 bg-white p-5 transition-colors open:bg-white"
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
                Centro de maternidad y medicina humanizada en Chiclayo.
                Formación profesional en nacimiento respetado.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">El curso</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#contenidos">Módulos</a></li>
                <li><a href="#reservar">Reservar lugar</a></li>
                <li><Link href="/cursos">Otros cursos</Link></li>
                <li><Link href="/">Volver al inicio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 flex-shrink-0 text-pink" /> Calle Los Sauces 542, Chiclayo</li>
                <li className="flex items-center gap-2"><Phone className="h-4 w-4 flex-shrink-0 text-pink" /> +51 932 713 071</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4 flex-shrink-0 text-pink" /> peruneoser@gmail.com</li>
                <li className="flex items-center gap-2"><Award className="h-4 w-4 flex-shrink-0 text-pink" /> En alianza con Aurora Madre</li>
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
