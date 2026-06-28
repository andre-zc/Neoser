import type { CSSProperties } from "react";

/**
 * Capa de partículas decorativas reutilizable para fondos de sección.
 * Reutiliza las clases .particle-* y keyframes definidos en globals.css.
 * Se coloca como primer hijo de una sección `relative overflow-hidden`,
 * y el contenido debe ir en un contenedor `relative` para quedar por encima.
 *
 * Variantes (a/b/c) cambian posiciones y colores para que las secciones
 * consecutivas no se vean idénticas. `tone="dark"` es para fondos navy.
 */
type Spec = { cls: string; style: CSSProperties };

const LIGHT: Record<string, Spec[]> = {
  a: [
    { cls: "particle particle-circle", style: { width: 300, height: 300, top: -80, left: -70, background: "var(--pink)", opacity: 0.05 } },
    { cls: "particle particle-circle", style: { width: 220, height: 220, bottom: -60, right: -50, background: "var(--blue)", opacity: 0.06 } },
    { cls: "particle particle-ring", style: { width: 120, height: 120, top: "16%", right: "8%", borderColor: "rgba(232,135,155,0.22)" } },
    { cls: "particle particle-dot", style: { width: 9, height: 9, top: "28%", left: "10%", background: "rgba(74,127,181,0.4)" } },
  ],
  b: [
    { cls: "particle particle-circle", style: { width: 260, height: 260, top: -70, right: -60, background: "var(--blue)", opacity: 0.05 } },
    { cls: "particle particle-diamond", style: { top: "14%", left: "8%", background: "rgba(232,135,155,0.16)" } },
    { cls: "particle particle-dot", style: { width: 9, height: 9, bottom: "18%", right: "12%", background: "rgba(232,135,155,0.35)" } },
    { cls: "particle particle-ring", style: { width: 100, height: 100, bottom: "12%", left: "7%", borderColor: "rgba(74,127,181,0.2)" } },
  ],
  c: [
    { cls: "particle particle-circle", style: { width: 280, height: 280, bottom: -80, left: "10%", background: "var(--pink)", opacity: 0.05 } },
    { cls: "particle particle-dot", style: { width: 10, height: 10, top: "18%", right: "14%", background: "rgba(232,135,155,0.4)" } },
    { cls: "particle particle-diamond", style: { bottom: "22%", left: "9%", background: "rgba(74,127,181,0.16)" } },
    { cls: "particle particle-ring", style: { width: 130, height: 130, top: "20%", left: "6%", borderColor: "rgba(232,135,155,0.18)" } },
  ],
};

const DARK: Spec[] = [
  { cls: "particle particle-circle", style: { width: 280, height: 280, top: -80, left: "12%", background: "var(--pink)", opacity: 0.16 } },
  { cls: "particle particle-circle", style: { width: 180, height: 180, bottom: -60, right: "14%", background: "#ffffff", opacity: 0.06 } },
  { cls: "particle particle-ring", style: { width: 120, height: 120, top: "20%", right: "10%", borderColor: "rgba(255,255,255,0.18)" } },
  { cls: "particle particle-dot", style: { width: 8, height: 8, bottom: "24%", left: "16%", background: "rgba(255,255,255,0.4)" } },
];

export function DecorParticles({
  variant = "a",
  tone = "light",
}: {
  variant?: "a" | "b" | "c";
  tone?: "light" | "dark";
}) {
  const specs = tone === "dark" ? DARK : LIGHT[variant];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {specs.map((p, i) => (
        <span key={i} className={p.cls} style={p.style} />
      ))}
    </div>
  );
}
