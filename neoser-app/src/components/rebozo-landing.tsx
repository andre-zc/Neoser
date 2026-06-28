"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Sparkles,
  Wind,
  Compass,
  Flame,
  Baby,
  Brain,
  HeartHandshake,
  Hand,
  Users,
  Award,
  Globe,
  Clock,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";

const ENROLL_HREF = "/cursos/rebozo-cert/inscribirse";
const WHATSAPP_HREF =
  "https://wa.me/51932713071?text=Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20el%20curso%20El%20Arte%20del%20Rebozo";

const pains = [
  {
    tag: "Inseguridad",
    icon: Wind,
    title: "Acompañas partos, pero sientes que te falta método.",
    text:
      "Conoces el rebozo de oídas o por videos sueltos, pero al estar frente a una gestante dudas de cómo, cuándo y por qué aplicar cada técnica con seguridad clínica.",
  },
  {
    tag: "Confusión",
    icon: Compass,
    title: "Quieres humanizar tu atención, pero no sabes por dónde empezar.",
    text:
      "Sientes el llamado a ofrecer un acompañamiento más respetado y fisiológico, pero entre la teoría y la práctica real hay un abismo que no logras cruzar.",
  },
  {
    tag: "Desactualización",
    icon: Flame,
    title: "Aplicas el rebozo como faja, sin entender la biomecánica.",
    text:
      "Mueves el rebozo por intuición, pero no comprendes cómo se comportan la pelvis, las fascias y el suelo pélvico bajo el movimiento somático. Quieres bases sólidas.",
  },
];

const transformations = [
  {
    before: "Acompañas con buena intención, pero sin un marco clínico que respalde lo que haces.",
    after:
      "Aplicas el rebozo dentro de un marco seguro, basado en evidencia y educación somática prenatal.",
  },
  {
    before: "Sabes que el parto humanizado importa, pero no tienes herramientas concretas.",
    after:
      "Dominas técnicas de balanceo, suspensión y sostén que puedes usar desde la próxima atención.",
  },
  {
    before: "El rebozo es para ti un accesorio más, sin fundamento anatómico.",
    after:
      "Entiendes la biomecánica de la pelvis y el suelo pélvico, y mueves con intención y precisión.",
  },
];

const seminars = [
  {
    n: "01",
    icon: Baby,
    title: "Fundamentos de la Educación Somática Prenatal",
    lead: "El punto de partida: el cuerpo gestante como territorio consciente.",
    text:
      "Comprenderás los ejes de la Educación Somática Prenatal y cómo el rebozo se integra como herramienta de percepción corporal, movimiento y sostén al servicio del bienestar de la madre y el bebé.",
  },
  {
    n: "02",
    icon: Brain,
    title: "Neurobiología del Parto y el rol del movimiento",
    lead: "Lo que ocurre en el cuerpo y el cerebro cuando el parto fluye.",
    text:
      "Descubrirás cómo el movimiento, la respiración y el entorno seguro favorecen el flujo hormonal del parto, y cómo el rebozo acompaña la fisiología del nacimiento respetado.",
  },
  {
    n: "03",
    icon: Hand,
    title: "Biomecánica de la pelvis y técnica del Rebozo",
    lead: "De mover la tela a entender el cuerpo en movimiento.",
    text:
      "Aprenderás la anatomía funcional de la pelvis, las fascias y el suelo pélvico, y las técnicas de balanceo, suspensión y sostén con rebozo para cada etapa del embarazo, parto y posparto.",
  },
  {
    n: "04",
    icon: HeartHandshake,
    title: "Bioética Personalista y nacimiento respetado",
    lead: "El para qué profundo de todo lo que acompañas.",
    text:
      "Integrarás la mirada de la Bioética Personalista al cuidado de la madre y el bebé, orientada a reducir la morbilidad y el estrés perinatal y a promover un nacimiento respetado.",
  },
];

const includes = [
  "4 seminarios a lo largo de 1 mes de capacitación",
  "12 videos tutoriales de ejercicios con Rebozo para el embarazo, parto y posparto",
  "Marco clínico y seguro para profesionales de salud y doulas",
  "Acceso a la Comunidad de profesionales NeoSer",
  "Certificado de participación NeoSer",
  "Grabaciones disponibles para repaso",
];

const faqs = [
  {
    q: "¿Necesito experiencia previa para aprovechar el curso?",
    a: "El curso está diseñado para profesionales de la salud (obstetras, ginecólogos, enfermeras) y doulas. No necesitas dominar el rebozo de antemano, pero sí contar con una base de acompañamiento al embarazo, parto o posparto.",
  },
  {
    q: "¿Hay algún requisito para participar?",
    a: "Recomendamos tener formación o experiencia en el área materno-perinatal. Si eres doula o profesional de salud en formación, eres bienvenida; el programa te acompañará desde donde estás.",
  },
  {
    q: "¿Tendré acceso a las grabaciones?",
    a: "Sí. Cada seminario queda grabado y disponible para que puedas repasar el contenido a tu ritmo durante el periodo de capacitación.",
  },
  {
    q: "¿Cómo es la modalidad?",
    a: "Es un programa híbrido: teoría en vivo online y prácticas presenciales para integrar la técnica con el cuerpo. La Obsta. Diana Silva acompaña cada seminario.",
  },
  {
    q: "¿Cuáles son las formas de pago?",
    a: "Aceptamos tarjetas de crédito o débito y transferencia. Al completar tu inscripción verás las opciones disponibles. Todos los precios están en soles (PEN).",
  },
  {
    q: "¿Aún tienes preguntas?",
    a: "Escríbenos a peruneoser@gmail.com o por WhatsApp al +51 932 713 071. Con gusto te orientamos antes de reservar tu lugar.",
  },
];

function Countdown() {
  const [secs, setSecs] = useState(60 * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const Cell = ({ v, label }: { v: string; label: string }) => (
    <div className="flex flex-col items-center">
      <span
        className="rounded-xl bg-pink-light px-3 py-2 text-3xl font-extrabold text-navy md:text-4xl"
        style={{ fontFamily: "var(--font-playfair), serif", minWidth: "3.2rem" }}
      >
        {v}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">{label}</span>
    </div>
  );
  return (
    <div className="flex items-start justify-center gap-3">
      <Cell v={hh} label="Horas" />
      <span className="pt-2 text-3xl font-bold text-pink md:text-4xl">:</span>
      <Cell v={mm} label="Minutos" />
      <span className="pt-2 text-3xl font-bold text-pink md:text-4xl">:</span>
      <Cell v={ss} label="Segundos" />
    </div>
  );
}

export function RebozoLanding() {
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
              Curso online · III Edición
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-pink-light px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-pink-dark">
              <Sparkles className="h-3.5 w-3.5" /> Inscripciones abiertas
            </span>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-2">
            <div data-aos="fade-up">
              <p className="hero-script-rebozo mb-1 text-pink" style={{ fontFamily: "var(--font-dancing), cursive", fontStyle: "italic", fontSize: "clamp(2.6rem,6vw,4.6rem)", lineHeight: 1 }}>
                Rebozo
              </p>
              <h1 className="section-title text-navy" style={{ fontSize: "clamp(2.2rem,4.6vw,3.6rem)" }}>
                El Arte del Rebozo desde la{" "}
                <span className="bg-gradient-to-r from-pink to-pink-dark bg-clip-text text-transparent">
                  Educación Somática
                </span>
              </h1>
              <p className="mt-5 text-lg font-bold text-navy md:text-xl">
                Deja de acompañar a ciegas. Aprende el método.
              </p>
              <p className="mt-2 max-w-xl text-gray-500">
                Un programa que integra la sabiduría del rebozo con la Educación
                Somática Prenatal, la Neurobiología del Parto y la Bioética
                Personalista, para el embarazo, parto y posparto.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "1 mes · 4 seminarios",
                  "🇵🇪 Modalidad híbrida",
                  "Comunidad NeoSer",
                  "Aval Spinning Babies",
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
                <a href="#temario" className="btn-pink-outline">
                  Ver el temario
                </a>
              </div>
            </div>

            <div className="relative" data-aos="fade-up" data-aos-delay="100">
              <div className="relative h-72 w-full overflow-hidden rounded-3xl border-4 border-white shadow-lg md:h-96">
                <Image
                  src="/assets/hero/slide-4-acompanamiento.png"
                  alt="Acompañamiento con técnica Rebozo en NeoSer"
                  fill
                  sizes="(max-width: 1023px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              </div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-white">
                  <Hand className="h-5 w-5" />
                </span>
                <p className="text-sm font-semibold leading-tight text-navy">
                  Técnica Rebozo
                  <br />
                  <span className="text-xs font-normal text-gray-400">con base somática</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARA QUIÉN ES (dolores) ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Este curso es para ti si…</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Sientes el llamado a humanizar el nacimiento, pero{" "}
              <span className="text-pink">algo no termina de encajar.</span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {pains.map((p, i) => (
              <div key={p.tag} className="service-card" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className="service-icon pink-bg">
                  <p.icon />
                </div>
                <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {p.tag}
                </span>
                <h3 className="mb-2 text-lg font-bold text-navy">{p.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{p.text}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-lg font-semibold text-navy">
            Si te reconoces en alguna de estas situaciones,{" "}
            <span className="text-pink">este curso fue diseñado para ti.</span>
          </p>
        </div>
      </section>

      {/* ===== ANTES / DESPUÉS ===== */}
      <section className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Lo que cambia después del curso</p>
            <h2 className="section-title mx-auto max-w-3xl">
              De donde estás <span className="text-pink">hoy</span> a una atención{" "}
              <span className="text-pink">verdaderamente humanizada.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-5">
            {transformations.map((t, i) => (
              <div
                key={i}
                className="grid items-center gap-3 md:grid-cols-[1fr_auto_1fr]"
                data-aos="fade-up"
                data-aos-delay={i * 100}
              >
                <div className="rounded-2xl bg-pink-light/60 p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-pink-dark">
                    Antes
                  </span>
                  <p className="mt-1 text-sm text-gray-600">{t.before}</p>
                </div>
                <ArrowRight className="mx-auto hidden h-6 w-6 text-gray-300 md:block" />
                <div className="rounded-2xl bg-blue-light/70 p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-blue">
                    Después
                  </span>
                  <p className="mt-1 text-sm text-gray-700">{t.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TU FORMADORA ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="a" />
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
                  priority
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-pink px-4 py-1.5 text-xs font-semibold text-white shadow">
                    Obsta. Diana Silva Mejía
                  </span>
                </div>
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <p className="section-tag mb-2">Tu formadora</p>
              <h2 className="section-title mb-1">Diana Silva Mejía</h2>
              <p className="mb-5 font-semibold text-pink">
                Cofundadora y Gerente General de NeoSer Perú
              </p>
              <p className="mb-4 leading-relaxed text-gray-500">
                Obstetra especialista en humanización del embarazo, parto y
                nacimiento. Ex Directora de la Fundación de Waal de los Países
                Bajos en Perú.
              </p>
              <p className="mb-6 leading-relaxed text-gray-500">
                El programa cuenta además con la dirección médica del{" "}
                <span className="font-semibold text-navy">Dr. Luis Chacaliaza Donayre</span>,
                médico ginecólogo-obstetra, garantizando rigor clínico y un marco
                seguro para cada técnica.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "+15 años de trayectoria",
                  "+1,000 profesionales formados",
                  "Red internacional de nacimiento respetado",
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

      {/* ===== TEMARIO / 4 SEMINARIOS ===== */}
      <section id="temario" className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="b" />
        <div className="container-main relative">
          <div className="mb-14 text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Lo que vas a vivir en 1 mes</p>
            <h2 className="section-title mx-auto max-w-3xl">
              Cuatro seminarios. Una sola misión:{" "}
              <span className="text-pink">acompañar el nacimiento con método y respeto.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            {seminars.map((s, i) => (
              <details
                key={s.n}
                className="surface-card group p-5 transition duration-300 hover:shadow-md md:p-7"
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 100}
                {...(i === 0 ? { open: true } : {})}
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
                  <div
                    className="hidden bg-gradient-to-br from-pink/55 to-blue/45 bg-clip-text text-4xl font-extrabold text-transparent sm:block md:text-5xl"
                    style={{ fontFamily: "var(--font-playfair), serif" }}
                  >
                    {s.n}
                  </div>
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink to-pink-dark text-white shadow-md ring-1 ring-pink/20 transition-transform duration-500 group-hover:-rotate-6 md:h-14 md:w-14">
                    <s.icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.7} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-navy md:text-lg">{s.title}</h3>
                    <p className="mt-0.5 text-sm font-semibold text-pink">{s.lead}</p>
                  </div>
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-pink-light text-xl leading-none text-pink transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 border-t border-navy/5 pt-4 text-sm leading-relaxed text-gray-500">
                  {s.text}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BONUS COMUNIDAD ===== */}
      <section className="relative overflow-hidden bg-white py-20 md:py-28">
        <DecorParticles variant="c" />
        <div className="container-main relative">
          <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
            <p className="section-tag mb-2">Bonus de regalo</p>
            <h2 className="section-title mb-4">
              Acceso a la <span className="text-pink">Comunidad de profesionales NeoSer</span>
            </h2>
            <p className="mx-auto max-w-2xl text-gray-500">
              Una red viva de obstetras y doulas de distintas regiones del Perú y
              de América Latina, que ya caminan contigo. Acompañamiento real,
              recursos compartidos y red de apoyo en el nacimiento respetado.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3" data-aos="fade-up">
            {[
              { icon: Users, t: "Red latinoamericana", d: "Obstetras y doulas de todo el continente." },
              { icon: Award, t: "Recursos compartidos", d: "Materiales y casos prácticos del equipo." },
              { icon: Globe, t: "Acompañamiento real", d: "Soporte continuo más allá del curso." },
            ].map((c) => (
              <div key={c.t} className="group relative overflow-hidden rounded-2xl border border-navy/5 bg-white p-6 text-center transition duration-500 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue to-navy text-white shadow-md ring-1 ring-blue/20 transition-transform duration-500 group-hover:-rotate-6">
                  <c.icon className="h-7 w-7" strokeWidth={1.7} />
                </div>
                <h4 className="text-sm font-bold text-navy">{c.t}</h4>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">{c.d}</p>
                <span className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-blue to-navy transition-transform duration-500 group-hover:scale-x-100" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRECIO ===== */}
      <section id="reservar" className="relative overflow-hidden bg-cream py-20 md:py-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="surface-card mx-auto max-w-2xl p-8 text-center shadow-sm md:p-12" data-aos="fade-up">
            <p className="section-tag mb-2">Próxima edición · III Edición</p>
            <h2 className="section-title mb-6">
              Reserva tu lugar con un <span className="text-pink">precio especial.</span>
            </h2>

            <div className="mx-auto mb-8 max-w-md space-y-3 text-left">
              {includes.slice(0, 4).map((it) => (
                <div key={it} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink" />
                  <span className="text-sm text-gray-600">{it}</span>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400 line-through">Precio regular: S/. 1,000</p>
            <p
              className="my-1 text-5xl font-extrabold text-navy"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              S/. 800
            </p>
            <p className="mb-6 text-xs uppercase tracking-wide text-gray-400">
              Oferta válida por tiempo limitado
            </p>

            <div className="mb-8">
              <Countdown />
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {["III Edición", "Modalidad híbrida", "Grabaciones incluidas"].map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-pink-light px-3 py-1.5 text-xs font-medium text-pink-dark"
                >
                  {c}
                </span>
              ))}
            </div>

            <Link href={ENROLL_HREF} className="btn-primary mx-auto justify-center">
              Quiero participar en el curso <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-xs text-gray-400">
              Pago único · Cupos limitados · Acceso a la comunidad NeoSer
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
              <span className="text-pink">antes de reservar tu lugar.</span>
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
                Centro de maternidad y medicina humanizada en Chiclayo.
                Formación profesional en nacimiento respetado.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-white">El curso</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#temario">Temario</a></li>
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
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 flex-shrink-0 text-pink" /> Lun a Sáb: 8:00 AM - 7:00 PM</li>
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
