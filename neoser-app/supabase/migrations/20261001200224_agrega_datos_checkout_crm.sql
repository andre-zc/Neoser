-- Datos de identificación y segmentación recogidos en el checkout.
-- Permanecen en Supabase y no se incluyen en la metadata del proveedor de pago.

alter table public.contact_leads
  add column if not exists identity_document text,
  add column if not exists country_code text,
  add column if not exists country text,
  add column if not exists profession text,
  add column if not exists workplace text,
  add column if not exists course_id uuid,
  add column if not exists wa_consent_at timestamptz;

-- Los consentimientos afirmativos anteriores ya se recogieron con el
-- formulario; usamos la creación del lead como evidencia temporal disponible.
update public.contact_leads
set wa_consent_at = created_at
where wa_consent = true
  and wa_consent_at is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_leads_course_id_fkey'
      and conrelid = 'public.contact_leads'::regclass
  ) then
    alter table public.contact_leads
      add constraint contact_leads_course_id_fkey
      foreign key (course_id)
      references public.courses(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_leads_checkout_details_check'
      and conrelid = 'public.contact_leads'::regclass
  ) then
    alter table public.contact_leads
      add constraint contact_leads_checkout_details_check
      check (
        (identity_document is null or char_length(btrim(identity_document)) between 6 and 30)
        and (country_code is null or country_code ~ '^[A-Z]{2}$')
        and (country is null or char_length(btrim(country)) between 2 and 100)
        and (profession is null or char_length(btrim(profession)) between 2 and 120)
        and (workplace is null or char_length(btrim(workplace)) between 2 and 160)
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_leads_wa_consent_evidence_check'
      and conrelid = 'public.contact_leads'::regclass
  ) then
    alter table public.contact_leads
      add constraint contact_leads_wa_consent_evidence_check
      check (wa_consent = false or wa_consent_at is not null);
  end if;
end $$;

create index if not exists contact_leads_course_id_idx
  on public.contact_leads (course_id);

create index if not exists contact_leads_country_code_idx
  on public.contact_leads (country_code)
  where country_code is not null;

comment on column public.contact_leads.identity_document is
  'DNI, cédula o documento declarado durante el checkout.';
comment on column public.contact_leads.country_code is
  'Código ISO 3166-1 alpha-2 del país seleccionado en el checkout.';
comment on column public.contact_leads.course_id is
  'Curso que originó el lead de inscripción; nulo para consultas generales.';
comment on column public.contact_leads.wa_consent_at is
  'Momento en que la persona autorizó el contacto transaccional por WhatsApp.';

