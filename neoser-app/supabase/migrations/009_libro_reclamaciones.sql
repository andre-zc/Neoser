-- ==========================================================================
-- 009 — Libro de Reclamaciones virtual (INDECOPI)
-- ==========================================================================
-- Obligatorio por el Código de Protección y Defensa del Consumidor (Ley 29571)
-- y su Reglamento del Libro de Reclamaciones.
--
-- Culqi lo exige explícitamente para aprobar el comercio online, y con una
-- condición dura: debe estar INTEGRADO en la web. No vale enlazar a un Google
-- Form, un PDF ni un servicio externo — por eso las hojas se guardan aquí.
--
-- Campos según el formato oficial de la Hoja de Reclamación:
--   1. Fecha y número correlativo
--   2. Identificación del consumidor (incluye tutor si es menor de edad)
--   3. Identificación del bien contratado (producto/servicio, monto)
--   4. Detalle de la reclamación (reclamo vs. queja, detalle y pedido)
--   5. Espacio para la respuesta del proveedor
--
-- Idempotente: seguro de re-ejecutar.

create table if not exists public.complaint_book (
  id uuid primary key default gen_random_uuid(),

  -- Número correlativo visible para el consumidor (INDECOPI exige numeración
  -- correlativa de las hojas de reclamación).
  correlativo bigint generated always as identity,

  -- 2. Identificación del consumidor
  full_name text not null,
  document_type text not null
    check (document_type in ('DNI', 'CE', 'Pasaporte', 'RUC')),
  document_number text not null,
  address text not null,
  phone text not null,
  email text not null,
  is_minor boolean not null default false,
  guardian_name text,

  -- 3. Identificación del bien contratado
  item_type text not null check (item_type in ('producto', 'servicio')),
  item_description text not null,
  claimed_amount numeric(10, 2),

  -- 4. Detalle de la reclamación
  -- reclamo = disconformidad con el producto/servicio
  -- queja   = malestar respecto a la atención al público
  complaint_type text not null check (complaint_type in ('reclamo', 'queja')),
  detail text not null,
  consumer_request text not null,

  -- 5. Gestión y respuesta del proveedor
  status text not null default 'pendiente'
    check (status in ('pendiente', 'en_proceso', 'respondido')),
  response text,
  responded_at timestamptz,

  created_at timestamptz not null default now()
);

-- RLS activado sin policies públicas: las hojas contienen datos personales y
-- solo se escriben desde /api/complaint-book con service_role. La lectura es
-- administrativa (el proveedor debe conservarlas mínimo 2 años).
alter table public.complaint_book enable row level security;

create index if not exists idx_complaint_book_status on public.complaint_book(status);
create index if not exists idx_complaint_book_created on public.complaint_book(created_at desc);
create index if not exists idx_complaint_book_email on public.complaint_book(email);
