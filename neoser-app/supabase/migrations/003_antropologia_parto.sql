-- ============================================
-- 003 — Seed curso "Antropología del Parto" (Curso Internacional NeoSer + Aurora Madre)
-- Idempotente por id/slug. Seguro de re-ejecutar.
-- ============================================

insert into public.courses (id, slug, title, short_description, description, price, currency, mode, duration_label, hero_color, is_published)
values
  (
    '5a6b7c8d-5555-4555-8555-555555555555',
    'antropologia-parto',
    'Antropología del Parto',
    'Curso Internacional: una mirada profunda a los paradigmas sociales y culturales del nacimiento, las tendencias mundiales en obstetricia y la partería posmoderna.',
    'Curso Internacional dictado por NeoSer en alianza con Aurora Madre. Ofrece una visión integral sobre los modelos de atención, las dinámicas sociales y culturales que rodean el nacimiento y la violencia obstétrica desde una perspectiva de derechos humanos. Cuatro módulos: Antropología del nacimiento, Sociología en Salud Reproductiva, Violencia obstétrica y Tendencias Mundiales en Obstetricia. Facilitadores: Dr. Beltrán Lares Díaz (Aurora Madre, Venezuela) y Dra. Robbie Davis-Floyd (antropóloga médica, EE. UU.). Modalidad online, 48 horas académicas (3 créditos), certificado digital.',
    200.00, 'PEN', 'Online', '1 mes · 8 sesiones',
    'navy', true
  )
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  price = excluded.price,
  currency = excluded.currency,
  mode = excluded.mode,
  duration_label = excluded.duration_label,
  hero_color = excluded.hero_color,
  is_published = excluded.is_published;
