"use client";

import { useState } from "react";
import { homeTestimonials, type HomeTestimonial } from "@/lib/testimonials";

const COLLAPSE_CHARS = 220;

function TestimonialCard({ item }: { item: HomeTestimonial }) {
  const needsCollapse = item.quote.length > COLLAPSE_CHARS;
  const [expanded, setExpanded] = useState(false);
  const shown =
    !needsCollapse || expanded
      ? item.quote
      : `${item.quote.slice(0, COLLAPSE_CHARS).trimEnd()}…`;

  return (
    <article className="testimonial-card testimonial-card--family flex h-full flex-col">
      <span className="quote-icon" aria-hidden>
        &ldquo;
      </span>
      <p className="testimonial-text mt-10 mb-4 flex-1 text-[0.95rem] leading-relaxed">
        {shown}
      </p>
      {needsCollapse && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mb-5 self-start text-sm font-semibold text-pink-dark transition hover:text-pink"
        >
          {expanded ? "Ver menos" : "Leer más"}
        </button>
      )}
      <footer className="mt-auto flex items-center gap-3 border-t border-navy/5 pt-5">
        <div
          className={`testimonial-avatar bg-gradient-to-br ${item.grad}`}
          aria-hidden
        >
          <span className="text-sm tracking-wide">{item.initials}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">{item.name}</p>
          <a
            href={`https://instagram.com/${item.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-pink-dark transition hover:text-pink"
          >
            @{item.handle}
          </a>
        </div>
      </footer>
    </article>
  );
}

export function HomeTestimonials() {
  return (
    <section
      id="testimonios"
      className="relative overflow-hidden bg-cream py-12 md:py-16"
      aria-labelledby="testimonios-title"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <span
          className="particle particle-circle"
          style={{
            width: 260,
            height: 260,
            top: -60,
            left: -40,
            background: "var(--pink)",
            opacity: 0.06,
          }}
        />
        <span
          className="particle particle-ring"
          style={{
            width: 140,
            height: 140,
            bottom: "8%",
            right: "5%",
            borderColor: "rgba(74,127,181,0.18)",
          }}
        />
      </div>

      <div className="container-main relative">
        <div className="mb-10 text-center" data-aos="fade-up">
          <p className="section-tag mb-2">Familias NeoSer</p>
          <h2 id="testimonios-title" className="section-title mb-4">
            Mensajes que nos{" "}
            <span className="bg-gradient-to-r from-pink to-pink-dark bg-clip-text text-transparent">
              llenan el alma
            </span>
          </h2>
          <div className="section-divider mx-auto" />
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 md:text-base">
            Historias reales de mamás y familias que vivieron su nacimiento con
            acompañamiento, cero separación y respeto en Chiclayo.
          </p>
        </div>

        {/* Móvil: carrusel horizontal con snap */}
        <div
          className="testimonial-rail -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:hidden"
          data-aos="fade-up"
        >
          {homeTestimonials.map((t) => (
            <div key={t.id} className="w-[85vw] max-w-sm shrink-0">
              <TestimonialCard item={t} />
            </div>
          ))}
        </div>

        {/* Desktop: grilla */}
        <div
          className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-3"
          data-aos="fade-up"
        >
          {homeTestimonials.map((t, i) => (
            <div
              key={t.id}
              className={i === 4 ? "md:col-span-2 lg:col-span-1 lg:col-start-2" : undefined}
            >
              <TestimonialCard item={t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
