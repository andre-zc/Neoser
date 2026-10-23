-- CRM unificado NeoSer: identidad telefónica, procedencias y actividad ManyChat.
--
-- El teléfono E.164 permite reconocer a la misma persona aunque un origen
-- entregue "932713071" y otro "+51932713071". No eliminamos filas históricas:
-- pagos, inscripciones y notas siguen referenciando sus registros originales;
-- la API administrativa los agrupa en una sola ficha.

alter table public.contact_leads
  add column if not exists phone_e164 text,
  add column if not exists last_activity_at timestamptz;

-- Normaliza los registros existentes. Cuando el número no trae prefijo usamos
-- el país ya guardado; para los formularios históricos sin país se reconoce el
-- móvil peruano de 9 dígitos. Los casos ambiguos quedan nulos y no se fusionan.
with cleaned as (
  select
    id,
    btrim(phone) as raw_phone,
    regexp_replace(phone, '[^0-9]', '', 'g') as digits,
    upper(country_code) as iso_country,
    case upper(country_code)
      when 'PE' then '51'
      when 'CR' then '506'
      when 'EC' then '593'
      when 'CO' then '57'
      when 'CL' then '56'
      when 'AR' then '54'
      when 'BO' then '591'
      when 'MX' then '52'
      when 'PA' then '507'
      when 'GT' then '502'
      when 'SV' then '503'
      when 'HN' then '504'
      when 'NI' then '505'
      when 'VE' then '58'
      when 'PY' then '595'
      when 'UY' then '598'
      when 'US' then '1'
      when 'CA' then '1'
      when 'DO' then '1'
      when 'ES' then '34'
      else null
    end as country_dial
  from public.contact_leads
  where phone_e164 is null
), normalized as (
  select
    id,
    case
      when raw_phone like '+%' and char_length(digits) between 7 and 15
        then '+' || digits
      when raw_phone like '00%' and char_length(regexp_replace(substring(raw_phone from 3), '[^0-9]', '', 'g')) between 7 and 15
        then '+' || regexp_replace(substring(raw_phone from 3), '[^0-9]', '', 'g')
      when country_dial is not null then
        case
          when char_length(digits) > char_length(country_dial) + 5
            and digits like country_dial || '%'
            and char_length(digits) <= 15
            then '+' || digits
          when char_length(digits) between 6 and (15 - char_length(country_dial))
            then '+' || country_dial || digits
          else null
        end
      when char_length(digits) = 9 and digits like '9%'
        then '+51' || digits
      when char_length(digits) between 10 and 15
        and (
          digits like '1%' or digits like '34%' or digits like '51%'
          or digits like '52%' or digits like '54%' or digits like '56%'
          or digits like '57%' or digits like '58%' or digits like '591%'
          or digits like '593%' or digits like '595%' or digits like '598%'
          or digits like '502%' or digits like '503%' or digits like '504%'
          or digits like '505%' or digits like '506%' or digits like '507%'
        )
        then '+' || digits
      else null
    end as e164
  from cleaned
)
update public.contact_leads as lead
set phone_e164 = normalized.e164
from normalized
where lead.id = normalized.id
  and normalized.e164 ~ '^\+[1-9][0-9]{6,14}$';

update public.contact_leads
set last_activity_at = greatest(
  created_at,
  coalesce(status_updated_at, created_at)
)
where last_activity_at is null;

alter table public.contact_leads
  alter column last_activity_at set default now(),
  alter column last_activity_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contact_leads_phone_e164_check'
      and conrelid = 'public.contact_leads'::regclass
  ) then
    alter table public.contact_leads
      add constraint contact_leads_phone_e164_check
      check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{6,14}$');
  end if;
end $$;

create index if not exists contact_leads_phone_e164_idx
  on public.contact_leads(phone_e164)
  where phone_e164 is not null;

create index if not exists contact_leads_last_activity_idx
  on public.contact_leads(last_activity_at desc);

create table if not exists public.crm_contact_origins (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.contact_leads(id) on delete cascade,
  origin_type text not null check (origin_type in ('website', 'manychat')),
  source_detail text not null default 'web',
  channel text not null default 'website',
  external_contact_id text,
  campaign_name text,
  flow_id text,
  flow_name text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (lead_id, origin_type, source_detail, channel)
);

create unique index if not exists crm_contact_origins_external_id_idx
  on public.crm_contact_origins(origin_type, channel, external_contact_id)
  where external_contact_id is not null;

create index if not exists crm_contact_origins_lead_id_idx
  on public.crm_contact_origins(lead_id, last_seen_at desc);

create table if not exists public.crm_contact_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.contact_leads(id) on delete cascade,
  event_key text not null unique,
  origin_type text not null default 'manychat'
    check (origin_type in ('website', 'manychat')),
  event_type text not null,
  channel text not null,
  campaign_name text,
  flow_id text,
  flow_name text,
  selected_option text,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists crm_contact_events_lead_occurred_idx
  on public.crm_contact_events(lead_id, occurred_at desc);

create index if not exists crm_contact_events_campaign_idx
  on public.crm_contact_events(campaign_name, occurred_at desc)
  where campaign_name is not null;

-- Cada registro preexistente conserva su fuente detallada, pero queda agrupado
-- bajo la procedencia operativa "Sitio web".
insert into public.crm_contact_origins (
  lead_id,
  origin_type,
  source_detail,
  channel,
  first_seen_at,
  last_seen_at
)
select
  id,
  'website',
  coalesce(nullif(source, ''), 'web'),
  'website',
  created_at,
  last_activity_at
from public.contact_leads
on conflict (lead_id, origin_type, source_detail, channel) do update
set last_seen_at = greatest(
  crm_contact_origins.last_seen_at,
  excluded.last_seen_at
);

alter table public.crm_contact_origins enable row level security;
alter table public.crm_contact_events enable row level security;

revoke all on table public.crm_contact_origins from anon, authenticated;
revoke all on table public.crm_contact_events from anon, authenticated;
grant select on table public.crm_contact_origins to authenticated;
grant select on table public.crm_contact_events to authenticated;
grant all on table public.crm_contact_origins to service_role;
grant all on table public.crm_contact_events to service_role;

drop policy if exists "Admin read CRM contact origins"
  on public.crm_contact_origins;
create policy "Admin read CRM contact origins"
on public.crm_contact_origins
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admin read CRM contact events"
  on public.crm_contact_events;
create policy "Admin read CRM contact events"
on public.crm_contact_events
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

comment on column public.contact_leads.phone_e164 is
  'Teléfono canónico E.164 usado para unificar contactos entre web y ManyChat.';
comment on column public.contact_leads.last_activity_at is
  'Última interacción conocida, sin guardar el contenido completo del mensaje.';
comment on table public.crm_contact_origins is
  'Procedencias de un contacto: sitio web y/o ManyChat, con campaña y flujo.';
comment on table public.crm_contact_events is
  'Eventos mínimos de ManyChat para el historial comercial del CRM; no almacena conversaciones.';
