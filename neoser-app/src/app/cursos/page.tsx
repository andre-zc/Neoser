import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { DecorParticles } from "@/components/decor-particles";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  coursesCatalog,
  formatCoursePrice,
  whatsappHref,
} from "@/lib/courses-catalog";

export const metadata: Metadata = {
  title: "Catálogo de Cursos 2026",
  description:
    "Formación profesional NeoSer 2026: Neurobiología del Parto, El Arte del Rebozo (virtual y presencial), Antropología y Sociología del Nacimiento y la jornada Herramientas para un Nacimiento Humanizado.",
  alternates: { canonical: "/cursos" },
};

function modeBadgeColor(mode: string) {
  const m = mode.toLowerCase();
  return m.includes("presencial") || m.includes("jornada") ? "bg-pink" : "bg-navy";
}

export default function CursosPage() {
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
                Cursos 2026
              </span>
            </h1>
            <div className="section-divider mx-auto" />
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Formación profesional y vivencial para quienes desean transformar la
              atención materna con un enfoque humanizado y basado en evidencia.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coursesCatalog.map((c) => {
              const href = c.landingHref ?? `/cursos/${c.slug}`;
              const isOpen = c.enrollment === "checkout" && c.price !== null;
              return (
                <article key={c.id} className="course-card group">
                  <Link
                    href={href}
                    className="relative block aspect-[4/5] overflow-hidden bg-navy"
                  >
                    <Image
                      src={c.image}
                      alt={`${c.title} — NeoSer`}
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      className={`course-badge ${modeBadgeColor(c.mode)} text-white`}
                    >
                      {c.mode}
                    </span>
                  </Link>
                  <div className="course-body">
                    <h2 className="mb-2 text-lg font-bold leading-snug text-navy">
                      {c.title}
                    </h2>
                    <p className="mb-3 text-sm text-gray-500">{c.summary}</p>

                    <div className="mb-4 space-y-1.5">
                      {c.startLabel && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Calendar className="h-3.5 w-3.5 text-pink" />
                          Inicio: {c.startLabel}
                        </p>
                      )}
                      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-gray-400">
                        <Clock className="h-3.5 w-3.5 text-pink" />
                        {c.durationLabel}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <span className="course-price">
                        {isOpen
                          ? formatCoursePrice(c.price, c.currency)
                          : "A consultar"}
                      </span>
                      <Link href={href} className="btn-pink-outline text-xs">
                        Ver más
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Consultas generales */}
          <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-cream p-8 text-center">
            <p className="section-tag mb-2">¿Tienes dudas?</p>
            <h2 className="mb-3 text-xl font-bold text-navy md:text-2xl">
              Te ayudamos a elegir tu formación
            </h2>
            <p className="mb-6 text-sm text-gray-500">
              Escríbenos y te orientamos sobre cuál de nuestros programas se ajusta
              mejor a tu práctica profesional.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={whatsappHref(
                  "Hola%20NeoSer%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20cursos%202026",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                WhatsApp {CONTACT_PHONE}
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="btn-pink-outline text-sm"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/" className="btn-pink-outline text-sm">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
