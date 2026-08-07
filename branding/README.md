# Branding NeoSer

Identidad visual oficial de NeoSer — Maternidad y Medicina Humanizada.

## Estructura

| Carpeta / archivo | Qué hay | Uso típico |
|---|---|---|
| [`manual-marca-neoser.pdf`](manual-marca-neoser.pdf) | Logos + paleta de colores oficial | **Punto de partida**. Cualquier decisión visual se valida acá primero. |
| [`logos/`](logos/) | Logos en color, blanco, negro, ícono y variantes (PNG y AI) | Web (`website/`, `neoser-app/public/`), RRSS, materiales impresos |
| [`fonts/`](fonts/) | Tipografías de marca: Brush Script (acentos web), Metropolis (capacitaciones), Abhaya Libre (legado / impresos) | Web usa Google Fonts (Noto Serif Display + Montserrat); copiar a `neoser-app/public/fonts/` solo si se embebe local |
| [`highlights/`](highlights/) | JPGs para highlights de Instagram (Bebé, Cursos, Fundadores, Periné, Prenatal, Testimonios) | Solo RRSS — no se usa en la web |
| [`plantillas-historia/`](plantillas-historia/) | Plantillas editables para Stories de Instagram | Solo RRSS — Diana las usa con su equipo |
| [`plantillas-reel/`](plantillas-reel/) | Plantillas editables para Reels | Solo RRSS |

## Tipografía web (brand book Social media)

| Rol | Fuente | Notas |
|---|---|---|
| Títulos / display | **Noto Serif Display** | Bold; itálica en `.hero-title` y `.section-title` |
| Cuerpo / UI | **Montserrat** | Regular / Medium / Semibold / Bold |
| Acentos cursivos | **Brush Script** | Solo tags, scripts del hero y `.font-brush` |
| Capacitaciones (no web) | **Metropolis** | Materiales de formación; no embebida en Next |

Carga en [`neoser-app/src/app/layout.tsx`](../neoser-app/src/app/layout.tsx): Montserrat y Noto vía `next/font/google`; Brush Script local en `neoser-app/public/fonts/brush-script.ttf`.

## Paleta de colores oficial

(Tomada del `vigente-soporte-tecnico-2026.tex` / manual de marca):

- **Navy**: `#1B3A6B` (primario)
- **Navy oscuro**: `#0F2548`
- **Pink**: `#E8879B` (acento)
- **Pink oscuro**: `#D4637A`
- **Crema**: `#FFF9F5` (fondo)
- **Gris texto**: `#555555`
- **Gris claro**: `#E0E0E0`

## Reglas

- **Logos**: usar siempre desde `logos/` — no recrear ni recortar nuevos.
- **Fuentes web**: no hardcodear Abhaya; títulos = Noto Serif Display (`--font-playfair`), cuerpo = Montserrat (`--font-montserrat`). Brush Script solo para acentos. Metropolis no va a la web.
- **Fuentes locales**: si vas a embeber una, copiarla a `neoser-app/public/fonts/` y referenciarla con `next/font/local`. No subir las `.ai` ni `.otf` pesadas a producción.
- Los archivos `.ai` (Adobe Illustrator) están **gitignored** por tamaño. Existen en disco para que el equipo de diseño los edite localmente, pero no se versionan.
