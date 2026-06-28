import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { CourseEnrollmentForm } from "@/components/course-enrollment-form";
import { getCatalogCourse } from "@/lib/courses-catalog";

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

async function getCourse(slug: string): Promise<Course | null> {
  // Catálogo estático primero (confiable); BD como respaldo.
  const cat = getCatalogCourse(slug);
  if (cat) {
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
  const course = await getCourse(slug);

  if (!course || !course.is_published) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-cream py-12 md:py-20">
      <div className="container-main">
        <Link
          href={`/cursos/${course.slug}`}
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

        <div className="mx-auto max-w-2xl">
          <CourseEnrollmentForm
            courseId={course.id}
            courseTitle={course.title}
            coursePrice={Number(course.price)}
            courseCurrency={course.currency}
          />
        </div>
      </div>
    </main>
  );
}
