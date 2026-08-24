-- ==========================================================================
-- 010 — Consentimiento de marketing (opt-in para recibir información)
-- ==========================================================================
-- Distinto de `wa_consent`, que es el consentimiento TRANSACCIONAL (permite
-- responder la consulta que la persona hizo). Este campo registra el
-- consentimiento para enviar comunicaciones COMERCIALES: novedades, consejos y
-- avisos de cupos de cursos.
--
-- Separarlos es importante:
--   - La Ley 29733 exige consentimiento libre, previo, expreso e informado
--     para el tratamiento con fines publicitarios.
--   - Permite segmentar en Brevo: solo quienes marcaron esta casilla reciben
--     campañas, mientras que todos siguen recibiendo sus correos
--     transaccionales (confirmaciones, recordatorios).
--
-- Por defecto `false`: la casilla nace desmarcada y es opcional.
--
-- Idempotente: seguro de re-ejecutar.

alter table public.contact_leads
  add column if not exists marketing_consent boolean not null default false;

-- Fecha en que se otorgó el consentimiento (evidencia ante una fiscalización).
alter table public.contact_leads
  add column if not exists marketing_consent_at timestamptz;

-- Índice para segmentar rápido a quienes sí aceptaron.
create index if not exists idx_contact_leads_marketing_consent
  on public.contact_leads(marketing_consent)
  where marketing_consent = true;
