-- ============================================
-- 004 — Soporte para charges Culqi: enrollment_id nullable + idempotencia
-- ============================================

-- Permitir registrar charges rechazados o pendientes sin enrollment asociado.
-- (Hoy enrollment_id es NOT NULL, lo que impide guardar el intento de pago
--  cuando la tarjeta es rechazada antes de poder crear el enrollment).
alter table public.payments
  alter column enrollment_id drop not null;

-- Indice unico parcial para idempotencia del webhook Culqi.
-- Si el mismo evento llega 2 veces con el mismo provider_payment_id (chr_xxx),
-- el segundo INSERT falla y el webhook lo trata como "ya procesado".
-- Parcial (where ... is not null) porque rows existentes pueden tener NULL.
create unique index if not exists payments_provider_payment_id_key
  on public.payments(provider_payment_id)
  where provider_payment_id is not null;
