-- ============================================
-- 003 — Solicitudes de reunión de coordinación (institucional)
-- ============================================
-- Sistema de "Agenda una reunión de coordinación": NO usa calendario.
-- Es un formulario de solicitud que el equipo de NeoSer evalúa y agenda
-- manualmente después. Gestión vía HubSpot (sin panel admin propio).

create table if not exists public.coordination_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  institution text not null,
  position text not null,
  email text not null,
  phone text not null,
  reason text not null,
  description text not null,
  status text not null default 'pendiente'
    check (status in ('pendiente','en_revision','reunion_coordinada','finalizada')),
  source text not null default 'web_coordinacion',
  created_at timestamptz not null default now()
);

-- RLS activado sin policies públicas: solo el service_role (endpoint server-side)
-- puede escribir/leer. El formulario web pasa por /api/coordination-requests
-- que usa service client. La gestión la hace Diana en HubSpot.
alter table public.coordination_requests enable row level security;

create index if not exists idx_coordination_status on public.coordination_requests(status);
create index if not exists idx_coordination_created on public.coordination_requests(created_at desc);
