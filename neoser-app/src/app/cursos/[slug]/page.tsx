import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Award,
  Baby,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  Clock,
  Download,
  Droplets,
  Globe,
  GraduationCap,
  Hand,
  HeartHandshake,
  Laptop,
  MessageCircle,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  coursesCatalog,
  formatCoursePrice,
  getCatalogCourse,
  whatsappHref,
} from "@/lib/courses-catalog";

type Params = Promise<{ slug: string }>;

const ICONS: Record<string, LucideIcon> = {
  Baby,
  Award,
  Brain,
  Droplets,
  Hand,
  HeartHandshake,
  Globe,
  GraduationCap,
  Users,
};

// El catálogo estático es la única fuente de esta plantilla. NO consultamos la
// BD aquí: `headers()`/`cookies()` volverían dinámica una ruta con
// generateStaticParams y Next devolvería 500 en vez de 404 para slugs
// desconocidos (ver app-static-to-dynamic-error). Con `dynamicParams = false`,
// los slugs retirados (prep-parto, diplomado-parto, taller-lactancia) responden
// 404 limpio, que es la señal correcta para Google.
export const dynamicParams = false;

export async function generateStaticParams() {
  // Pre-render de los cursos del catálogo que usan esta plantilla genérica.
  return coursesCatalog
    .filter((c) => !c.landingHref)
    .map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCatalogCourse(slug);
  if (!course) return { title: "Curso no encontrado" };
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/cursos/${course.slug}` },
    openGraph: {
      title: `${course.title} | NeoSer`,
      description: course.summary,
      ...(course.image ? { images: [course.image] } : {}),
    },
  };
}

export default async function CursoDetallePage({ params }: { params: Params }) {
  const { slug } = await params;

  const course = getCatalogCourse(slug);
  if (!course) notFound();

  // Si el slug tiene landing propia, redirige a ella.
  if (course.landingHref) redirect(course.landingHref);

  const Icon = ICONS[course.icon] ?? GraduationCap;
  const enrollHref = `/cursos/${course.slug}/inscribirse`;
  const waHref = whatsappHref(course.whatsappText);
  const isCheckout = course.enrollment === "checkout" && course.price !== null;

  // Ficha "información clave": solo se muestran los campos que existen.
  const keyInfo = [
    course.startLabel && {
      icon: Calendar,
      label: "Inicio",
      value: course.startLabel,
    },
    course.scheduleLabel && {
      icon: Clock,
      label: "Horario",
      value: course.scheduleLabel,
    },
    course.mode && { icon: Laptop, label: "Modalidad", value: course.mode },
    course.durationLabel && {
      icon: Clock,
      label: "Duración",
      value: course.durationLabel,
    },
    course.certification && {
      icon: GraduationCap,
      label: "Certificación",
      value: course.certification,
    },
    course.audience && {
      icon: Users,
      label: "Dirigido a",
      value: course.audience,
    },
  ].filter(Boolean) as { icon: LucideIcon; label: string; value: string }[];

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-white pt-32 pb-16 md:pt-40 md:pb-20">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <Link
            href="/cursos"
            className="inline-flex items-center gap-1 text-sm font-medium text-pink transition-all hover:gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </Link>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <div>
              <p className="section-tag mb-2">Escuela NeoSer</p>
              <h1 className="text-3xl font-bold leading-tight text-navy md:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              {course.tagline && (
                <p className="mt-4 text-lg font-bold text-navy">{course.tagline}</p>
              )}
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-gray-500">
                {course.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[course.mode, course.durationLabel]
                  .filter(Boolean)
                  .map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
                    >
                      {chip === course.mode ? (
                        <Sparkles className="h-3.5 w-3.5 text-pink" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-pink" />
                      )}
                      {chip}
                    </span>
                  ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {isCheckout ? (
                  <>
                    <Link href={enrollHref} className="btn-primary">
                      <Calendar className="h-5 w-5" /> Inscribirme
                    </Link>
                    <span
                      className="text-2xl font-bold text-navy"
                      style={{ fontFamily: "var(--font-playfair), 'Noto Serif Display', Georgia, serif" }}
                    >
                      {formatCoursePrice(course.price, course.currency)}
                    </span>
                  </>
                ) : (
                  <>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <MessageCircle className="h-5 w-5" /> Consultar por WhatsApp
                    </a>
                    <span className="text-sm text-gray-500">
                      Fechas e inversión por confirmar
                    </span>
                  </>
                )}
                {course.brochureHref && (
                  <a
                    href={course.brochureHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pink-outline"
                  >
                    <Download className="h-4 w-4" /> Brochure
                  </a>
                )}
              </div>
            </div>

            {/* Poster oficial del curso (o tarjeta de ícono si no hay foto) */}
            <div className="relative mx-auto w-full max-w-sm">
              {course.image ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border-4 border-white shadow-xl">
                  <Image
                    src={course.image}
                    alt={`${course.title} — NeoSer`}
                    fill
                    sizes="(max-width: 1023px) 100vw, 400px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-navy to-blue shadow-xl ring-1 ring-black/5">
                  <DecorParticles tone="dark" />
                  <Icon className="relative h-28 w-28 text-white/90" strokeWidth={1.2} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFORMACIÓN CLAVE ===== */}
      {keyInfo.length > 0 && (
        <section className="py-14 md:py-16">
          <div className="container-main">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {keyInfo.map((k) => (
                <div
                  key={k.label}
                  className="group flex items-center gap-4 rounded-2xl border border-navy/5 bg-white p-5 transition duration-500 hover:-translate-y-1 hover:shadow-lg"
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
      )}

      {/* ===== SOBRE EL CURSO + QUÉ INCLUYE ===== */}
      <section className="pb-16 md:pb-20">
        <div className="container-main grid gap-8 lg:grid-cols-5">
          {course.description.length > 0 && (
            <div className="surface-card p-8 shadow-sm md:p-10 lg:col-span-3">
              <h2 className="mb-5 text-xl font-bold text-navy md:text-2xl">
                Sobre este curso
              </h2>
              <div className="space-y-4 leading-relaxed text-gray-600">
                {course.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}

          {course.includes.length > 0 && (
            <div className="surface-card p-8 shadow-sm md:p-10 lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-light text-pink">
                  <Sparkles className="h-6 w-6" />
                </span>
                <h2 className="text-xl font-bold text-navy md:text-2xl">
                  ¿Qué incluye?
                </h2>
              </div>
              <ul className="space-y-3">
                {course.includes.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-gray-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink" />
                    <span className="leading-snug">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ===== MÓDULOS ===== */}
      {course.modules && course.modules.length > 0 && (
        <section className="relative overflow-hidden bg-white py-16 md:py-20">
          <DecorParticles variant="c" />
          <div className="container-main relative">
            <div className="mb-10 text-center">
              <p className="section-tag mb-2">Contenido académico</p>
              <h2 className="section-title text-3xl md:text-4xl">
                Módulos del programa
              </h2>
              <div className="section-divider mx-auto mt-4" />
            </div>

            <div className="mx-auto max-w-4xl space-y-4">
              {course.modules.map((m, i) => (
                <details
                  key={m.n}
                  className="group rounded-2xl bg-cream p-6 ring-1 ring-black/5 transition hover:shadow-md"
                  {...(i === 0 ? { open: true } : {})}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Módulo {m.n}
                      </p>
                      <h3 className="font-bold text-navy">{m.title}</h3>
                    </div>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-pink transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-gray-500">
                    {m.purpose}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {m.topics.map((t) => (
                      <li key={t} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink" />
                        <span className="text-sm leading-snug text-gray-600">{t}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== INVERSIÓN ===== */}
      {course.priceTiers && course.priceTiers.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="surface-card mx-auto max-w-2xl p-8 text-center shadow-sm md:p-10">
              <p className="section-tag mb-2">Inversión</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {course.priceTiers.map((t) => (
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
            </div>
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {course.faq && course.faq.length > 0 && (
        <section className="relative overflow-hidden bg-white py-16 md:py-20">
          <DecorParticles variant="b" />
          <div className="container-main relative mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="section-tag mb-2">Preguntas frecuentes</p>
              <h2 className="section-title text-3xl md:text-4xl">
                Resolvemos tus dudas
              </h2>
              <div className="section-divider mx-auto mt-4" />
            </div>
            <div className="space-y-4">
              {course.faq.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl bg-cream p-6 ring-1 ring-black/5 transition hover:shadow-md"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-pink transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-gray-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-blue py-16 text-center text-white md:py-20">
        <DecorParticles tone="dark" />
        <div className="container-main relative">
          <p className="section-tag mb-2 !text-pink-light">
            {isCheckout ? "Reserva tu lugar" : "Quiero más información"}
          </p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            {isCheckout
              ? "Da el primer paso en tu formación"
              : "Te avisamos apenas se abra la convocatoria"}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/80">
            {isCheckout
              ? "Cupos limitados. Inscríbete hoy y comienza a transformar tu manera de acompañar la maternidad."
              : `Escríbenos al ${CONTACT_PHONE} o a ${CONTACT_EMAIL} y te enviamos el programa, las fechas y la inversión en cuanto se confirmen.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isCheckout ? (
              <Link
                href={enrollHref}
                className="btn-primary !border-white !bg-white !text-pink-dark"
              >
                <Calendar className="h-5 w-5" /> Inscribirme ahora
              </Link>
            ) : (
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary !border-white !bg-white !text-pink-dark"
              >
                <MessageCircle className="h-5 w-5" /> Escribir por WhatsApp
              </a>
            )}
            <Link href="/cursos" className="btn-secondary !border-white !text-white">
              Ver otros cursos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
