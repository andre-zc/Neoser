import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { services, categoryLabels } from "@/lib/services";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Servicio no encontrado" };
  return {
    title: service.title,
    description: service.summary,
    openGraph: {
      title: service.title,
      description: service.summary,
      images: [service.image],
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const categoryLabel = categoryLabels[service.category];

  // Otros servicios de la misma categoría (sin el actual)
  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-cream py-12 md:py-16">
      <div className="container-main">
        <Link
          href="/servicios"
          className="text-sm font-medium text-pink hover:underline"
        >
          ← Volver a servicios
        </Link>

        {/* Hero */}
        <div className="mt-6 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div
            className={`relative overflow-hidden rounded-3xl shadow-md ${
              service.imageOrientation === "vertical"
                ? "aspect-[2/3] mx-auto w-full max-w-sm"
                : "aspect-[4/3]"
            }`}
          >
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              className="object-cover"
              priority
            />
          </div>
          <div>
            <p className="section-tag mb-2">{categoryLabel.tag}</p>
            <h1 className="text-3xl font-bold text-navy md:text-4xl">
              {service.title}
            </h1>
            <p className="mt-4 text-gray-500">{service.summary}</p>
          </div>
        </div>

        {/* Descripción completa */}
        <article className="mt-12 mx-auto max-w-3xl">
          <div className="surface-card p-8 md:p-10">
            <h2 className="mb-6 text-xl font-bold text-navy">
              Sobre este servicio
            </h2>
            <div className="space-y-4 leading-relaxed text-gray-600">
              {service.description.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/#contacto" className="btn-primary">
                Solicitar más información
              </Link>
              <Link href="/servicios" className="btn-pink-outline">
                Ver todos los servicios
              </Link>
            </div>
          </div>
        </article>

        {/* Servicios relacionados */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-center text-2xl font-bold text-navy">
              También te puede interesar
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/servicios/${r.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5] bg-gray-100">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      quality={90}
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="mb-2 font-bold text-navy line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {r.summary}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
