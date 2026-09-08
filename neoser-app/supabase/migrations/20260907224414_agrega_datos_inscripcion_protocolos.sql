-- Datos complementarios que la participante confirma después del pago.
-- Se guardan en la matrícula ya creada por Culqi y permanecen protegidos por
-- el RLS existente de public.enrollments. La escritura pública sigue cerrada:
-- únicamente el endpoint de servidor usa service_role.
alter table public.enrollments
  add column if not exists identity_document text,
  add column if not exists profession text,
  add column if not exists workplace text,
  add column if not exists city text,
  add column if not exists country text,
  add column if not exists registration_details_completed_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'enrollments_registration_details_complete_check'
      and conrelid = 'public.enrollments'::regclass
  ) then
    alter table public.enrollments
      add constraint enrollments_registration_details_complete_check
      check (
        registration_details_completed_at is null
        or (
          char_length(btrim(coalesce(guest_name, ''))) between 2 and 120
          and char_length(btrim(coalesce(guest_email, ''))) between 3 and 254
          and char_length(btrim(coalesce(guest_phone, ''))) between 7 and 20
          and char_length(btrim(coalesce(identity_document, ''))) between 6 and 30
          and char_length(btrim(coalesce(profession, ''))) between 2 and 120
          and char_length(btrim(coalesce(workplace, ''))) between 2 and 160
          and char_length(btrim(coalesce(city, ''))) between 2 and 100
          and char_length(btrim(coalesce(country, ''))) between 2 and 100
        )
      );
  end if;
end $$;

comment on column public.enrollments.identity_document is
  'DNI o cédula declarada por la participante después del pago.';
comment on column public.enrollments.profession is
  'Profesión u ocupación actual declarada por la participante.';
comment on column public.enrollments.workplace is
  'Centro de trabajo declarado por la participante.';
comment on column public.enrollments.registration_details_completed_at is
  'Fecha en que se completaron los datos requeridos antes del acceso al grupo.';
