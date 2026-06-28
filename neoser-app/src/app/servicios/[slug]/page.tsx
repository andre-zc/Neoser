import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Stethoscope,
  HeartHandshake,
  ShieldCheck,
  Baby,
  Brain,
  Users,
  Activity,
  Droplets,
  Sparkles,
  Calendar,
  Flower2,
  Wind,
  Music,
  Moon,
  Palette,
  Heart,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { services, categoryLabels, type ServiceCategory } from "@/lib/services";
import { SiteHeader } from "@/components/site-header";
import { ServiceGalleryCarousel } from "@/components/service-gallery-carousel";

type Params = Promise<{ slug: string }>;

// Mapa de claves de ícono (string en services.ts) a componentes de lucide.
const ICONS: Record<string, LucideIcon> = {
  Stethoscope,
  HeartHandshake,
  ShieldCheck,
  Baby,
  Brain,
  Users,
  Activity,
  Droplets,
  Sparkles,
  Calendar,
  Flower2,
  Wind,
  Music,
  Moon,
  Palette,
  Heart,
};

const CATEGORY_ICON: Record<ServiceCategory, LucideIcon> = {
  medica: Stethoscope,
  somatica: Activity,
  comunidad: Users,
};

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
  const CategoryIcon = CATEGORY_ICON[service.category];
  const isVertical = service.imageOrientation === "vertical";

  const bookingUrl = process.env.NEXT_PUBLIC_CAL_BOOKING_URL || "/#reserva";

  // Otros servicios de la misma categoría (sin el actual)
  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />

      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-white pt-32 pb-16 md:pt-40 md:pb-20">
        {/* Partículas decorativas */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <span className="particle particle-circle" style={{ width: 300, height: 300, top: -80, right: -70, background: "var(--pink)", opacity: 0.06 }} />
          <span className="particle particle-circle" style={{ width: 220, height: 220, bottom: -70, left: -60, background: "var(--blue)", opacity: 0.07 }} />
          <span className="particle particle-ring" style={{ width: 130, height: 130, top: "22%", left: "6%", borderColor: "rgba(232,135,155,0.3)" }} />
          <span className="particle particle-dot" style={{ width: 10, height: 10, top: "28%", right: "14%", background: "rgba(232,135,155,0.45)" }} />
          <span className="particle particle-diamond" style={{ top: "62%", right: "22%", background: "rgba(74,127,181,0.18)" }} />
        </div>

        <div className="container-main relative">
          <Link
            href="/servicios"
            className="group inline-flex items-center gap-1 text-sm font-medium text-pink transition-all hover:gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a servicios
          </Link>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Imagen + badge de categoría */}
            <div className={`relative ${isVertical ? "mx-auto w-full max-w-sm" : ""}`}>
              <div
                className={`relative overflow-hidden rounded-[28px] shadow-xl ring-1 ring-black/5 ${
                  isVertical ? "aspect-[2/3]" : "aspect-[4/3]"
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
              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 shadow-lg ring-1 ring-black/5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pink-light text-pink">
                  <CategoryIcon className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-navy">
                  {categoryLabel.title}
                </span>
              </div>
            </div>

            {/* Texto */}
            <div>
              <p className="section-tag mb-2">{categoryLabel.tag}</p>
              <h1 className="text-3xl font-bold leading-tight text-navy md:text-4xl lg:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                {service.summary}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={bookingUrl}
                  {...(bookingUrl.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="btn-primary"
                >
                  <Calendar className="h-5 w-5" /> Reserva tu cita
                </a>
                <Link href="/#contacto" className="btn-pink-outline">
                  Solicitar información
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESCRIPCIÓN + PILARES ===== */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-tag mb-2">Sobre este servicio</p>
            <div className="section-divider mx-auto mb-7" />
            <div className="space-y-4 text-left leading-relaxed text-gray-600 md:text-center">
              {service.description.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {service.benefits && service.benefits.length > 0 && (
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {service.benefits.map((b, i) => {
                const Icon = ICONS[b.icon] ?? Heart;
                const blue = i % 2 === 1;
                return (
                  <div
                    key={b.title}
                    className="group relative overflow-hidden rounded-2xl bg-white p-7 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-pink to-blue transition-transform duration-300 group-hover:scale-x-100" />
                    <div
                      className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
                        blue ? "bg-blue-light text-blue" : "bg-pink-light text-pink"
                      }`}
                    >
                      <Icon className="h-8 w-8" strokeWidth={1.6} />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-navy">{b.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-500">{b.text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== ¿QUÉ INCLUYE? + ¿PARA QUIÉN ES? ===== */}
      {(service.included || service.forWho) && (
        <section className="relative overflow-hidden bg-white py-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <span className="particle particle-circle" style={{ width: 240, height: 240, top: -60, left: "8%", background: "var(--pink)", opacity: 0.05 }} />
            <span className="particle particle-ring" style={{ width: 110, height: 110, bottom: "12%", right: "7%", borderColor: "rgba(74,127,181,0.25)" }} />
            <span className="particle particle-dot" style={{ width: 9, height: 9, top: "20%", right: "18%", background: "rgba(232,135,155,0.4)" }} />
          </div>

          <div className="container-main relative grid gap-8 lg:grid-cols-5">
            {service.included && service.included.length > 0 && (
              <div className="surface-card p-8 shadow-sm md:p-10 lg:col-span-3">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-light text-pink">
                    <Sparkles className="h-6 w-6" />
                  </span>
                  <h2 className="text-xl font-bold text-navy md:text-2xl">
                    ¿Qué incluye?
                  </h2>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-pink" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.forWho && (
              <div className="relative flex flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-dark p-8 text-white shadow-md md:p-10 lg:col-span-2">
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                  <span className="particle particle-circle" style={{ width: 160, height: 160, top: -40, right: -40, background: "var(--pink)", opacity: 0.18 }} />
                  <span className="particle particle-ring" style={{ width: 90, height: 90, bottom: "8%", left: "6%", borderColor: "rgba(255,255,255,0.18)" }} />
                </div>
                <span className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                  <Heart className="h-6 w-6" />
                </span>
                <h2 className="relative mb-3 text-xl font-bold md:text-2xl">
                  ¿Para quién es?
                </h2>
                <p className="relative leading-relaxed text-white/85">
                  {service.forWho}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== GALERÍA ===== */}
      {service.gallery && service.gallery.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10 text-center">
              <p className="section-tag mb-2">Galería</p>
              <h2 className="section-title text-3xl md:text-4xl">
                Conoce más en imágenes
              </h2>
              <div className="section-divider mx-auto mt-4" />
            </div>
            <ServiceGalleryCarousel slides={service.gallery} />
          </div>
        </section>
      )}

      {/* ===== FAQ ===== */}
      {service.faq && service.faq.length > 0 && (
        <section className="relative overflow-hidden bg-white py-16 md:py-20">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <span className="particle particle-circle" style={{ width: 200, height: 200, bottom: -50, right: "10%", background: "var(--blue)", opacity: 0.05 }} />
            <span className="particle particle-diamond" style={{ top: "18%", left: "10%", background: "rgba(232,135,155,0.18)" }} />
          </div>
          <div className="container-main relative mx-auto max-w-3xl">
            <div className="mb-10 text-center">
              <p className="section-tag mb-2">Preguntas frecuentes</p>
              <h2 className="section-title text-3xl md:text-4xl">
                Resolvemos tus dudas
              </h2>
              <div className="section-divider mx-auto mt-4" />
            </div>
            <div className="space-y-4">
              {service.faq.map((f) => (
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
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <span className="particle particle-circle" style={{ width: 280, height: 280, top: -80, left: "12%", background: "var(--pink)", opacity: 0.14 }} />
          <span className="particle particle-circle" style={{ width: 180, height: 180, bottom: -60, right: "14%", background: "#ffffff", opacity: 0.06 }} />
          <span className="particle particle-ring" style={{ width: 120, height: 120, top: "20%", right: "10%", borderColor: "rgba(255,255,255,0.18)" }} />
          <span className="particle particle-dot" style={{ width: 8, height: 8, bottom: "24%", left: "16%", background: "rgba(255,255,255,0.4)" }} />
        </div>
        <div className="container-main relative">
          <p className="section-tag mb-2">Damos el siguiente paso juntas</p>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            ¿Lista para acompañarte de cerca?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-white/80">
            Escríbenos o agenda tu cita; te acompañamos con calidez y respeto en
            cada paso de tu maternidad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={bookingUrl}
              {...(bookingUrl.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="btn-primary !border-white !bg-white !text-pink-dark"
            >
              <Calendar className="h-5 w-5" /> Reserva tu cita
            </a>
            <Link
              href="/#contacto"
              className="btn-secondary !border-white !text-white"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS RELACIONADOS ===== */}
      {related.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="mb-10 text-center">
              <p className="section-tag mb-2">Sigue explorando</p>
              <h2 className="section-title text-3xl md:text-4xl">
                También te puede interesar
              </h2>
              <div className="section-divider mx-auto mt-4" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/servicios/${r.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      quality={90}
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 font-bold text-navy line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-500 line-clamp-2">
                      {r.summary}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-pink transition-all group-hover:gap-2">
                      Ver más <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
