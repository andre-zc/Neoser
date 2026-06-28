import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";

export const metadata: Metadata = {
  title: "Catálogo de Cursos",
  description:
    "Diplomados, talleres y certificaciones en parto humanizado, técnica Rebozo, lactancia materna y preparación al parto.",
};

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

function modeBadgeColor(mode: string | null) {
  if (!mode) return "bg-pink";
  return mode.toLowerCase() === "online" ? "bg-navy" : "bg-pink";
}

async function getCourses(): Promise<Course[]> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const res = await fetch(`${baseUrl}/api/courses`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.items as Course[]) ?? [];
  } catch {
    return [];
  }
}

export default async function CursosPage() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
        <DecorParticles variant="a" />
        <div className="container-main relative">
          <div className="mb-12 text-center">
            <p className="section-tag mb-2">Escuela NeoSer</p>
            <h1 className="section-title mb-4">
              Catálogo de{" "}
              <span className="bg-gradient-to-r from-pink to-pink-dark bg-clip-text text-transparent">
                Cursos
              </span>
            </h1>
            <div className="section-divider mx-auto" />
          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Formación profesional y vivencial para quienes desean transformar la atención materna con un enfoque humanizado y basado en evidencia.
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
            <p className="text-sm">Por ahora no hay cursos disponibles. Vuelve pronto.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((c) => (
              <article key={c.id} className="course-card group">
                <div className="course-image">
                  <span className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" aria-hidden />
                  <span className="pointer-events-none absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/[0.06]" aria-hidden />
                  <GraduationCap className="relative h-14 w-14 text-white/90 transition-transform duration-500 group-hover:scale-110" strokeWidth={1.3} />
                  {c.mode && (
                    <span className={`course-badge ${modeBadgeColor(c.mode)} text-white`}>
                      {c.mode}
                    </span>
                  )}
                </div>
                <div className="course-body">
                  <h2 className="mb-2 text-lg font-bold text-navy">{c.title}</h2>
                  <p className="mb-3 text-sm text-gray-500">{c.short_description}</p>
                  {c.duration_label && (
                    <p className="mb-4 text-xs uppercase tracking-wide text-gray-400">
                      {c.duration_label}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="course-price">{formatPrice(c.price, c.currency)}</span>
                    <Link href={`/cursos/${c.slug}`} className="btn-pink-outline text-xs">
                      Ver más
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/" className="btn-pink-outline text-sm">
            ← Volver al inicio
          </Link>
        </div>
      </div>
      </section>
    </main>
  );
}
