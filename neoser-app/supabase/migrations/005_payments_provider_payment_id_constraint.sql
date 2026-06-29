-- ============================================
-- 005 — Fix migration 004: el indice parcial no sirve para ON CONFLICT
-- ============================================

-- La migration 004 creo un indice unique PARCIAL:
--   create unique index ... on payments(provider_payment_id)
--     where provider_payment_id is not null;
--
-- Pero Postgres NO acepta indices parciales como target de INSERT ... ON CONFLICT.
-- Esto causaba que `fulfillSuccessfulCharge` fallara con:
--   "there is no unique or exclusion constraint matching the ON CONFLICT specification"
--
-- Lo reemplazamos por un UNIQUE CONSTRAINT (no parcial). En Postgres, UNIQUE
-- permite multiples NULL por defecto (NULLs are not considered equal), asi que
-- no perdemos la flexibilidad de rows con provider_payment_id nulo.

drop index if exists public.payments_provider_payment_id_key;

alter table public.payments
  add constraint payments_provider_payment_id_unique
  unique (provider_payment_id);
