"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { services } from "@/lib/services";

export function ServicesCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const cardEl = scrollRef.current.querySelector<HTMLElement>("[data-card]");
    const cardWidth = cardEl?.offsetWidth ?? 320;
    const gap = 24;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      {/* Flechas (solo desktop) */}
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Anterior"
        className="hidden md:flex absolute left-0 top-[84px] lg:top-[88px] -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:bg-cream"
      >
        <ChevronLeft className="h-6 w-6 text-navy" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Siguiente"
        className="hidden md:flex absolute right-0 top-[84px] lg:top-[88px] -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:bg-cream"
      >
        <ChevronRight className="h-6 w-6 text-navy" />
      </button>

      {/* Track del carrusel */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 -mx-4 px-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/servicios/${s.slug}`}
            data-card
            className="group snap-start flex-none w-[260px] sm:w-[300px] lg:w-[310px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
              <Image
                src={s.image}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                quality={90}
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col p-6">
              <h3 className="mb-3 text-xl font-bold leading-snug text-navy line-clamp-2 min-h-[60px]">
                {s.title}
              </h3>
              <p className="mb-5 text-base leading-relaxed text-gray-600 line-clamp-3 min-h-[78px]">
                {s.summary}
              </p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-pink transition-all group-hover:gap-2">
                Ver más →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
