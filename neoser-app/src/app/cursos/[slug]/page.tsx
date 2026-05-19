import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";

type Course = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  price: number;
  currency: string;
  mode: string | null;
  duration_label: string | null;
  hero_color: string | null;
  is_published: boolean;
};

function formatPrice(price: number, currency: string) {
  if (currency === "PEN") {
    return `S/. ${Number(price).toLocaleString("es-PE")}`;
  }
  return `${currency} ${Number(price).toLocaleString("es-PE")}`;
}

async function getCourse(slug: string): Promise<Course | null> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(`${baseUrl}/api/courses`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    const items: Course[] = json.items ?? [];
    return items.find((c) => c.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return { title: "Curso no encontrado" };
  }

  const description =
    course.short_description ?? course.description ?? undefined;

  return {
    title: course.title,
    description,
    openGraph: {
      title: course.title,
      description,
    },
  };
}

export default async function CursoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-cream py-12 md:py-20">
      <div className="container-main">
        <Link href="/cursos" className="text-sm font-medium text-pink hover:underline">
          ← Volver al catálogo
        </Link>

        <header className="mt-6 mb-10">
          <p className="section-tag mb-2">Escuela NeoSer</p>
          <h1 className="text-3xl font-bold text-navy md:text-4xl">
            {course.title}
          </h1>
          {course.short_description && (
            <p className="mt-3 max-w-3xl text-gray-500">
              {course.short_description}
            </p>
          )}
        </header>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="surface-card p-6 md:p-8">
              <h2 className="mb-3 text-xl font-bold text-navy">Sobre este curso</h2>
              <p className="leading-relaxed text-gray-600">
                {course.description}
              </p>
            </section>

            {(course.mode || course.duration_label) && (
              <section className="grid gap-4 sm:grid-cols-2">
                {course.mode && (
                  <div className="surface-card p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Modalidad
                    </p>
                    <p className="mt-1 font-semibold text-navy">{course.mode}</p>
                  </div>
                )}
                {course.duration_label && (
                  <div className="surface-card p-5">
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Duración
                    </p>
                    <p className="mt-1 font-semibold text-navy">
                      {course.duration_label}
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>

          <aside>
            <div className="surface-card sticky top-6 p-6">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Inversión
              </p>
              <p className="course-price mt-1">
                {formatPrice(course.price, course.currency)}
              </p>
              <Link
                href={`/cursos/${course.slug}/inscribirse`}
                className="btn-primary mt-6 w-full justify-center"
              >
                Inscribirme
              </Link>
              <p className="mt-3 text-center text-xs text-gray-400">
                Cupos limitados — reserva el tuyo.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
