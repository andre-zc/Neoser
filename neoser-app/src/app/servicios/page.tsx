import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  services,
  categoryLabels,
  type ServiceCategory,
} from "@/lib/services";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Nuestros Servicios",
  description:
    "Atención médica humanizada, programas de educación somática y espacios de acompañamiento para gestantes y madres en Chiclayo.",
};

const categoryOrder: ServiceCategory[] = ["medica", "somatica", "comunidad"];

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-white pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container-main text-center">
          <p className="section-tag mb-2">Lo que hacemos por ti</p>
          <h1 className="section-title mb-4">Nuestros Servicios</h1>
          <div className="section-divider mx-auto" />
          <p className="mx-auto mt-6 max-w-2xl text-gray-500">
            Atención médica humanizada, programas de educación somática y espacios de acompañamiento para acompañarte en cada etapa de tu maternidad.
          </p>
        </div>
      </section>

      {/* Secciones por categoría */}
      {categoryOrder.map((cat) => {
        const label = categoryLabels[cat];
        const items = services.filter((s) => s.category === cat);
        return (
          <section
            key={cat}
            className={
              cat === "somatica"
                ? "bg-white py-16 md:py-20"
                : "bg-cream py-16 md:py-20"
            }
          >
            <div className="container-main">
              <div className="mb-12 text-center">
                <p className="section-tag mb-2">{label.tag}</p>
                <h2 className="section-title mb-3">{label.title}</h2>
                <div className="section-divider mx-auto" />
                <p className="mx-auto mt-4 max-w-2xl text-gray-500">
                  {label.description}
                </p>
              </div>

              <div className="space-y-16">
                {items.map((s, idx) => (
                  <article
                    key={s.slug}
                    id={s.slug}
                    className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12 scroll-mt-24"
                  >
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-3xl shadow-md ${idx % 2 === 1 ? "lg:order-2" : ""}`}
                    >
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="mb-4 text-2xl font-bold text-navy md:text-3xl">
                        {s.title}
                      </h3>
                      <div className="space-y-3 leading-relaxed text-gray-600">
                        {s.description.map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={`/servicios/${s.slug}`}
                          className="btn-primary text-sm"
                        >
                          Ver más detalles
                        </Link>
                        <Link
                          href="/#contacto"
                          className="btn-pink-outline text-sm"
                        >
                          Consultar
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA final */}
      <section className="bg-navy py-16 text-center text-white">
        <div className="container-main">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            ¿Tienes preguntas?
          </h2>
          <p className="mb-6 text-white/80">
            Escríbenos y te contactamos lo antes posible.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 rounded-full bg-pink px-8 py-3 font-semibold transition hover:bg-pink-dark"
          >
            Contáctanos
          </Link>
        </div>
      </section>
    </main>
  );
}
