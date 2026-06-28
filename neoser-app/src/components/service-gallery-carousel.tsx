"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import type { GallerySlide } from "@/lib/services";

export function ServiceGalleryCarousel({ slides }: { slides: GallerySlide[] }) {
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
      {/* Flechas (solo desktop, si hay más de una foto) */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Foto anterior"
            className="hidden md:flex absolute left-0 top-[120px] -translate-y-1/2 -translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:bg-cream"
          >
            <ChevronLeft className="h-6 w-6 text-navy" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Foto siguiente"
            className="hidden md:flex absolute right-0 top-[120px] -translate-y-1/2 translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition hover:bg-cream"
          >
            <ChevronRight className="h-6 w-6 text-navy" />
          </button>
        </>
      )}

      {/* Track del carrusel */}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 -mx-4 px-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {slides.map((slide, i) => (
          <article
            key={i}
            data-card
            className="snap-start flex-none w-[280px] sm:w-[320px] lg:w-[340px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 340px"
                  quality={90}
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-pink-light/40 text-center text-pink-dark">
                  <ImageOff className="h-8 w-8 opacity-60" />
                  <span className="text-xs font-medium">Foto próximamente</span>
                </div>
              )}
            </div>
            <div className="flex flex-col p-6">
              <h3 className="mb-2 text-lg font-bold leading-snug text-navy">
                {slide.title}
              </h3>
              {slide.text && (
                <p className="text-sm leading-relaxed text-gray-600">
                  {slide.text}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
