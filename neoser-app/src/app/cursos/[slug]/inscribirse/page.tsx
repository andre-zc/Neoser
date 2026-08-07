import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { CourseEnrollmentForm } from "@/components/course-enrollment-form";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  getCatalogCourse,
  whatsappHref,
  type CatalogCourse,
} from "@/lib/courses-catalog";

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

// El catálogo estático es la fuente confiable: si dependiéramos solo de la BD,
// la página daría 404 en cualquier entorno donde la siembra no esté aplicada.
async function getCourse(slug: string): Promise<Course | null> {
  const cat = getCatalogCourse(slug);
  if (cat) {
    // Curso sin precio confirmado: no hay checkout, se coordina por WhatsApp.
    if (cat.enrollment !== "checkout" || cat.price === null) return null;
    return {
      id: cat.id,
      slug: cat.slug,
      title: cat.title,
      short_description: cat.summary,
      description: cat.description.join("\n\n"),
      price: cat.price,
      currency: cat.currency,
      mode: cat.mode,
      duration_label: cat.durationLabel,
      hero_color: null,
      is_published: true,
    };
  }

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

/** Tarifas que no pasan por el checkout online (egresadas, extranjero). */
function tierNotes(cat: CatalogCourse | undefined) {
  return (cat?.priceTiers ?? []).filter((t) => t.note);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return { title: "Inscripción", robots: { index: false } };
  }

  return {
    title: `Inscripción — ${course.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function InscribirsePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Cursos sin checkout online: de vuelta al detalle, donde el CTA es WhatsApp.
  const cat = getCatalogCourse(slug);
  if (cat && (cat.enrollment !== "checkout" || cat.price === null)) {
    redirect(cat.landingHref ?? `/cursos/${slug}`);
  }

  const course = await getCourse(slug);

  if (!course || !course.is_published) {
    notFound();
  }

  const notes = tierNotes(cat);

  return (
    <main className="min-h-screen bg-cream py-12 md:py-20">
      <div className="container-main">
        <Link
          href={cat?.landingHref ?? `/cursos/${course.slug}`}
          className="text-sm font-medium text-pink hover:underline"
        >
          ← Volver al curso
        </Link>

        <header className="mt-6 mb-10">
          <p className="section-tag mb-2">Inscripción</p>
          <h1 className="text-3xl font-bold text-navy md:text-4xl">
            {course.title}
          </h1>
          <p className="mt-3 max-w-3xl text-gray-500">
            Completa tus datos para iniciar el proceso de pago. Recibirás la
            confirmación de tu inscripción al correo registrado.
          </p>
        </header>

        <div className="mx-auto max-w-2xl space-y-4">
          <CourseEnrollmentForm
            courseId={course.id}
            courseTitle={course.title}
            coursePrice={Number(course.price)}
            courseCurrency={course.currency}
          />

          {notes.length > 0 && (
            <div className="surface-card p-6 text-sm leading-relaxed text-gray-500">
              <p className="mb-2 font-semibold text-navy">
                ¿Eres egresada NeoSer o participas desde el extranjero?
              </p>
              <ul className="mb-3 space-y-1">
                {notes.map((t) => (
                  <li key={t.label}>
                    <span className="font-medium text-navy">{t.label}:</span> {t.note}
                  </li>
                ))}
              </ul>
              <p>
                Estas tarifas y los pagos internacionales se coordinan de forma
                directa. Escríbenos por{" "}
                <a
                  href={whatsappHref(cat!.whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-pink hover:underline"
                >
                  WhatsApp al {CONTACT_PHONE}
                </a>{" "}
                o a{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-pink hover:underline"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
