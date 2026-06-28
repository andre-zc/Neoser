"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Anima un número haciendo "count-up" cuando entra en viewport.
 * Conserva prefijo (ej. "+") y sufijo (ej. " Años", " Ed.") del valor original.
 * Ej: "+1,000" -> cuenta 0..1000 con separador de miles; "+5 Años" -> 0..5 + " Años".
 */
export function CountUp({
  value,
  duration = 1600,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  // Descompone "+1,000 Ed." en prefijo / número / sufijo.
  const match = value.match(/^(\D*)([\d.,]+)(.*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2].replace(/[.,]/g, ""), 10) : NaN;
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    // Si no hay número parseable o el usuario prefiere menos movimiento, no animar.
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    const run = () => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(eased * target);
        setDisplay(`${prefix}${current.toLocaleString("en-US")}${suffix}`);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, target, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
