import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { REDES } from "@/lib/legal";

const OG_IMAGE = "/assets/og-registrate.png";

export const metadata: Metadata = {
  title: "Regístrate — Novedades y capacitaciones",
  description:
    "Suscríbete para recibir las novedades de NeoSer: próximas capacitaciones, ediciones de cursos y recursos de maternidad humanizada.",
  alternates: { canonical: "/registrate" },
  openGraph: {
    title: "Regístrate | NeoSer — Novedades y capacitaciones",
    description:
      "Recibe aviso de próximas capacitaciones, talleres y novedades de NeoSer Perú.",
    url: "/registrate",
    images: [
      {
        url: OG_IMAGE,
        width: 1024,
        height: 683,
        alt: "Equipo NeoSer acompañando un parto humanizado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Regístrate | NeoSer",
    description:
      "Suscríbete a las novedades y próximas capacitaciones de NeoSer.",
    images: [OG_IMAGE],
  },
};

export default function RegistratePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-light/40 via-cream to-white">
      <SiteHeader />

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <span
          className="particle particle-circle"
          style={{
            width: 280,
            height: 280,
            top: -60,
            right: -40,
            background: "var(--pink)",
            opacity: 0.08,
          }}
        />
        <span
          className="particle particle-circle"
          style={{
            width: 200,
            height: 200,
            bottom: 80,
            left: -50,
            background: "var(--blue)",
            opacity: 0.07,
          }}
        />
      </div>

      <div className="container-main relative grid gap-10 pt-32 pb-16 md:grid-cols-2 md:items-center md:gap-14 md:pt-40 md:pb-24">
        <div>
          <p className="section-tag mb-3">Comunidad NeoSer</p>
          <h1 className="section-title mb-4 text-left">
            Conéctate con nosotros
          </h1>
          <div className="section-divider mb-6 ml-0" />
          <p className="max-w-md text-base leading-relaxed text-gray-600 md:text-lg">
            Suscríbete para recibir novedades de próximas capacitaciones,
            ediciones de cursos y recursos de maternidad humanizada.
          </p>

          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5">
            <Image
              src={OG_IMAGE}
              alt="Acompañamiento humanizado en NeoSer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold text-navy">Síguenos</p>
            <div className="flex flex-wrap gap-3">
              {REDES.map((r) => (
                <a
                  key={r.href}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border-2 border-pink/40 px-4 py-2 text-sm font-semibold text-pink transition hover:bg-pink hover:text-white"
                >
                  {r.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-4 text-center text-sm font-medium text-gray-600 md:text-left">
            Suscríbete a nuestro boletín informativo:
          </p>
          <NewsletterSignupForm />
          <p className="mt-4 text-center text-xs text-gray-400 md:text-left">
            ¿Buscas una consulta?{" "}
            <Link href="/#contacto" className="text-pink hover:underline">
              Escríbenos aquí
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
