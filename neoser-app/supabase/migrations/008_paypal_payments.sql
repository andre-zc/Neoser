-- ==========================================================================
-- 008 — Pagos internacionales con PayPal (PayPal.me)
-- ==========================================================================
-- Habilita 'paypal' como proveedor de pago para las inscripciones desde el
-- extranjero.
--
-- IMPORTANTE — cómo funciona este flujo (distinto al de Culqi):
-- PayPal.me es un enlace de cobro personal, NO una pasarela integrada: no
-- envía webhook ni confirmación al sitio. Por eso la inscripción se registra
-- con `enrollments.status = 'pending'` y `payments.status = 'pending'` en el
-- momento en que la persona va a pagar, y NeoSer confirma el pago a mano
-- (verificando en PayPal) cambiando el estado a 'paid' / 'approved'.
--
-- Con Culqi el cargo es sincrónico y solo se persiste tras la aprobación;
-- aquí no es posible saberlo, así que el estado 'pending' es la señal de
-- "dijo que iba a pagar, falta verificar".
--
-- Idempotente: seguro de re-ejecutar.

-- ---------------------------------------------------------------------------
-- 1) Permitir 'paypal' en payments.payment_provider
-- ---------------------------------------------------------------------------
alter table public.payments
  drop constraint if exists payments_payment_provider_check;

alter table public.payments
  add constraint payments_payment_provider_check
  check (payment_provider in ('mercadopago', 'culqi', 'niubiz', 'izipay', 'paypal'));

-- ---------------------------------------------------------------------------
-- 2) Índices para que Diana encuentre rápido los pagos por verificar
-- ---------------------------------------------------------------------------
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_provider on public.payments(payment_provider);
