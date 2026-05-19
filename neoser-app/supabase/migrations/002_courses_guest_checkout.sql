-- ============================================
-- 002 — Guest checkout para enrollments + seed cursos NeoSer
-- ============================================

-- Permitir enrollment sin auth.users (guest checkout)
alter table public.enrollments
  alter column user_id drop not null;

-- Campos guest
alter table public.enrollments
  add column if not exists guest_name text,
  add column if not exists guest_email text,
  add column if not exists guest_phone text,
  add column if not exists lead_id uuid references public.contact_leads(id) on delete set null;

-- Quitar unique(user_id, course_id) que choca con guests
alter table public.enrollments
  drop constraint if exists enrollments_user_id_course_id_key;

-- Constraint: o user_id O guest_email+name+phone
alter table public.enrollments
  drop constraint if exists enrollments_user_or_guest_check;
alter table public.enrollments
  add constraint enrollments_user_or_guest_check
  check (
    user_id is not null
    or (guest_email is not null and guest_name is not null and guest_phone is not null)
  );

-- RLS: la creación de enrollments en producción ocurre desde el webhook
-- usando service role (bypassa RLS), así que NO agregamos policy pública
-- para insert. La policy existente "Users create own enrollments" sigue
-- valida para flujos con auth (V2).

-- Indexes
create index if not exists idx_enrollments_lead_id on public.enrollments(lead_id);
create index if not exists idx_enrollments_guest_email on public.enrollments(guest_email);
create index if not exists idx_enrollments_status on public.enrollments(status);

-- Slug en courses (URL amigable)
alter table public.courses
  add column if not exists slug text unique,
  add column if not exists short_description text,
  add column if not exists duration_label text,
  add column if not exists hero_color text;

-- Seed: cursos NeoSer (idempotente por slug)
insert into public.courses (id, slug, title, short_description, description, price, currency, mode, duration_label, hero_color, is_published)
values
  (
    '1a2b3c4d-1111-4111-8111-111111111111',
    'prep-parto',
    'Curso de Preparación al Parto',
    'Técnicas de respiración, posiciones de parto, plan de nacimiento y vínculo temprano.',
    'Curso integral de preparación para el parto. Incluye técnicas de respiración, posiciones recomendadas durante el trabajo de parto, elaboración del plan de nacimiento personalizado y herramientas para fortalecer el vínculo temprano con tu bebé.',
    350.00, 'PEN', 'Presencial', '6 sesiones',
    'navy', true
  ),
  (
    '2a3b4c5d-2222-4222-8222-222222222222',
    'diplomado-parto',
    'Diplomado en Parto Humanizado',
    'Formación integral para profesionales de salud en atención humanizada del nacimiento.',
    'Diplomado certificado dirigido a obstetras, ginecólogos, enfermeras y doulas. Programa académico completo de atención humanizada del nacimiento con módulos teóricos y casos prácticos.',
    1200.00, 'PEN', 'Online', '12 semanas',
    'navy', true
  ),
  (
    '3a4b5c6d-3333-4333-8333-333333333333',
    'rebozo-cert',
    'Técnica Rebozo Certificación',
    'Certificación internacional en técnica Rebozo con reconocimiento de Spinning Babies.',
    'Programa de certificación oficial en técnica Rebozo, con aval internacional de Spinning Babies. Incluye prácticas presenciales y teoría online.',
    800.00, 'PEN', 'Híbrido', '4 sesiones',
    'navy', true
  ),
  (
    '4a5b6c7d-4444-4444-8444-444444444444',
    'taller-lactancia',
    'Taller de Lactancia Materna',
    'Taller práctico sobre técnicas de lactancia, posiciones y resolución de problemas comunes.',
    'Taller dirigido a gestantes en tercer trimestre y madres en lactancia. Cubre técnicas de agarre, posiciones, prevención de grietas, manejo de extracción y banco de leche.',
    180.00, 'PEN', 'Presencial', '1 sesión intensiva',
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
