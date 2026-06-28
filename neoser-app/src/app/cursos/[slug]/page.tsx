import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Baby,
  Award,
  Droplets,
  HeartHandshake,
  Globe,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  Calendar,
  Clock,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";
import {
  coursesCatalog,
  getCatalogCourse,
  type CatalogCourse,
} from "@/lib/courses-catalog";

type Params = Promise<{ slug: string }>;

const ICONS: Record<string, LucideIcon> = {
  Baby,
  Award,
  Droplets,
  HeartHandshake,
  Globe,
  GraduationCap,
};

function formatPrice(price: number, currency: string) {
  if (currency === "PEN") return `S/. ${Number(price).toLocaleString("es-PE")}`;
  return `${currency} ${Number(price).toLocaleString("es-PE")}`;
}

type DbCourse = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  price: number;
  currency: string;
  mode: string | null;
  duration_label: string | null;
  is_published: boolean;
};

// Mapea una fila de BD al shape del catálogo para un render uniforme.
function fromDb(c: DbCourse): CatalogCourse {
  return {
    slug: c.slug,
    id: c.id,
    title: c.title,
    summary: c.short_description ?? "",
    description: c.description ? [c.description] : [],
    price: Number(c.price),
    currency: c.currency,
    mode: c.mode ?? "",
    durationLabel: c.duration_label ?? "",
    icon: "GraduationCap",
    includes: [],
  };
}

async function getDbCourse(slug: string): Promise<CatalogCourse | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const res = await fetch(`${protocol}://${host}/api/courses`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    const items: DbCourse[] = json.items ?? [];
    const found = items.find((c) => c.slug === slug && c.is_published);
    return found ? fromDb(found) : null;
  } catch {
    return null;
  }
}

// Catálogo estático primero (rico y confiable); BD como respaldo.
async function resolveCourse(slug: string): Promise<CatalogCourse | null> {
  const fromCatalog = getCatalogCourse(slug);
  if (fromCatalog) return fromCatalog;
  return getDbCourse(slug);
}

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
  const course = await resolveCourse(slug);
  if (!course) return { title: "Curso no encontrado" };
  return {
    title: course.title,
    description: course.summary,
    openGraph: { title: course.title, description: course.summary },
  };
}

export default async function CursoDetallePage({ params }: { params: Params }) {
  const { slug } = await params;

  // Si el slug tiene landing propia, redirige a ella.
  const catalog = getCatalogCourse(slug);
  if (catalog?.landingHref) redirect(catalog.landingHref);

  const course = await resolveCourse(slug);
  if (!course) notFound();

  const Icon = ICONS[course.icon] ?? GraduationCap;
  const enrollHref = `/cursos/${course.slug}/inscribirse`;

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

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div>
              <p className="section-tag mb-2">Escuela NeoSer</p>
              <h1 className="text-3xl font-bold leading-tight text-navy md:text-4xl lg:text-5xl">
                {course.title}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
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
                <Link href={enrollHref} className="btn-primary">
                  <Calendar className="h-5 w-5" /> Inscribirme
                </Link>
                <span
                  className="text-2xl font-extrabold text-navy"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {formatPrice(course.price, course.currency)}
                </span>
              </div>
            </div>

            {/* Tarjeta de ícono */}
            <div className="relative mx-auto w-full max-w-sm">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-navy to-blue shadow-xl ring-1 ring-black/5">
                <DecorParticles tone="dark" />
                <Icon
                  className="relative h-28 w-28 text-white/90"
                  strokeWidth={1.2}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOBRE EL CURSO + QUÉ INCLUYE ===== */}
      <section className="py-16 md:py-20">
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
          <p className="section-tag mb-2">Reserva tu lugar</p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Da el primer paso en tu formación
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/80">
            Cupos limitados. Inscríbete hoy y comienza a transformar tu manera de
            acompañar la maternidad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={enrollHref}
              className="btn-primary !border-white !bg-white !text-pink-dark"
            >
              <Calendar className="h-5 w-5" /> Inscribirme ahora
            </Link>
            <Link href="/cursos" className="btn-secondary !border-white !text-white">
              Ver otros cursos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
