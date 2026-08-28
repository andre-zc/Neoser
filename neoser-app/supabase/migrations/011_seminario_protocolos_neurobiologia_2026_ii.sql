-- ============================================
-- 011 — Seminario Protocolos + Neurobiología Edición 2026 II
-- ============================================
-- Sincroniza `courses` con el catálogo estático (`courses-catalog.ts`).
-- Idempotente: seguro de re-ejecutar.

-- Neurobiología: nueva fecha de inicio (Edición 2026 II)
update public.courses
set
  short_description = 'Edición 2026 II. Neurobiología, microbiota, epigenética y teoría del apego aplicadas a protocolos clínicos basados en evidencia.',
  description = 'Curso virtual sincrónico dictado por el Dr. Beltrán Lares (Director de AuroraMadre Academia, Buenos Aires) con dirección académica de la Obst. Diana Silva Mejía. Cuatro módulos: Vínculo, Microbiota y Hormonas; Teoría del Apego, Epigenética y Neurociencias; y dos módulos de Protocolos para la Humanización del Nacimiento. Inicio: martes 29 de setiembre de 2026. Martes y jueves de 7:00 a 9:00 p. m. (hora Perú). Duración: 64 horas académicas equivalentes a 4 créditos, con certificado de aprobación, Campus Virtual NeoSer y grabaciones durante 12 meses. Tarifas: S/ 300 en Perú (S/ 220 egresadas NeoSer) y USD 75 en el extranjero (USD 60 egresadas).'
where slug = 'neurobiologia-parto';

-- Seminario Internacional: Protocolos para un Nacimiento Humanizado
insert into public.courses (
  id, slug, title, short_description, description,
  price, currency, mode, duration_label, hero_color, is_published
)
values (
  '9a8b7c6d-eeee-4eee-aeee-eeeeeeeeeeee',
  'seminario-protocolos-nacimiento-humanizado',
  'Protocolos para un Nacimiento Humanizado',
  'Seminario Internacional virtual en vivo. 4 seminarios online. Inicio: 8 de septiembre de 2026. Perú: S/ 150 · Internacional: USD 60.',
  'Seminario Internacional dictado por el Dr. Beltrán Lares Díaz. Cuatro seminarios online en modalidad virtual en vivo. Inicio: martes 08 de septiembre de 2026. Martes y jueves de 7:00 a 9:00 p. m. (hora Perú). 32 horas académicas equivalentes a 2 créditos. Incluye NeoSer Workbook, videos documentales, bibliografía complementaria, grabaciones durante 1 año y certificado digital con código QR. Tarifas: S/ 150 en Perú y USD 60 en el extranjero.',
  150.00, 'PEN', 'Virtual en vivo', '32 horas académicas · 4 seminarios',
  'navy', true
)
on conflict (slug) do update set
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  price = excluded.price,
  currency = excluded.currency,
  mode = excluded.mode,
  duration_label = excluded.duration_label,
  hero_color = excluded.hero_color,
  is_published = excluded.is_published;
