-- Permite distinguir las fichas creadas por el equipo desde el CRM sin
-- confundirlas con captaciones del sitio web o de ManyChat.
alter table public.crm_contact_origins
  drop constraint if exists crm_contact_origins_origin_type_check;

alter table public.crm_contact_origins
  add constraint crm_contact_origins_origin_type_check
  check (origin_type in ('website', 'manychat', 'manual'));

comment on table public.crm_contact_origins is
  'Procedencias de un contacto: sitio web, ManyChat y/o registro manual del equipo.';
