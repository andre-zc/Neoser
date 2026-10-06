-- Relación muchos-a-muchos entre contactos y cursos.
-- Conserva el course_id histórico en contact_leads durante la transición.

alter table public.contact_leads
  add column if not exists status_updated_at timestamptz;

update public.contact_leads
set status_updated_at = created_at
where status_updated_at is null;

alter table public.contact_leads
  alter column status_updated_at set default now(),
  alter column status_updated_at set not null;

create index if not exists contact_leads_status_updated_at_idx
  on public.contact_leads(lead_status, status_updated_at desc);

create table if not exists public.contact_course_interests (
  lead_id uuid not null references public.contact_leads(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  relationship text not null default 'interes'
    check (relationship in ('interes', 'inscrito')),
  created_at timestamptz not null default now(),
  primary key (lead_id, course_id)
);

create index if not exists contact_course_interests_course_id_idx
  on public.contact_course_interests(course_id);

alter table public.contact_course_interests enable row level security;

-- Desde octubre de 2026 las tablas nuevas pueden no quedar expuestas a la Data
-- API automáticamente. Declaramos los privilegios mínimos de forma explícita.
revoke all on table public.contact_course_interests from anon, authenticated;
grant select, insert, update, delete
  on table public.contact_course_interests
  to authenticated;

drop policy if exists "Admin manage contact course interests"
  on public.contact_course_interests;
create policy "Admin manage contact course interests"
on public.contact_course_interests
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = (select auth.uid())
      and profiles.role = 'admin'
  )
);

-- Backfill desde la relación directa que ya usa el checkout.
insert into public.contact_course_interests (lead_id, course_id, relationship)
select
  id,
  course_id,
  case when lead_status = 'inscrito' then 'inscrito' else 'interes' end
from public.contact_leads
where course_id is not null
on conflict (lead_id, course_id) do update
set relationship = case
  when excluded.relationship = 'inscrito' then 'inscrito'
  else contact_course_interests.relationship
end;

-- Los enrollments son la fuente más precisa para participaciones ya existentes.
insert into public.contact_course_interests (lead_id, course_id, relationship)
select
  lead_id,
  course_id,
  case when status = 'paid' then 'inscrito' else 'interes' end
from public.enrollments
where lead_id is not null
on conflict (lead_id, course_id) do update
set relationship = case
  when excluded.relationship = 'inscrito' then 'inscrito'
  else contact_course_interests.relationship
end;

comment on table public.contact_course_interests is
  'Cursos asociados a un contacto del CRM como interés o inscripción.';

comment on column public.contact_leads.status_updated_at is
  'Momento del último cambio de etapa comercial usado en reportes del CRM.';
