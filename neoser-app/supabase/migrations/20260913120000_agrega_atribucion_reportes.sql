-- Atribución comercial para el tablero de campañas y sincronización de pagos.
-- No almacena datos clínicos; solo parámetros de campaña y ruta de entrada.

alter table public.contact_leads
  add column if not exists utm_content text,
  add column if not exists landing_path text;

-- El reporte pagina por fecha + UUID para evitar saltos cuando entran nuevos
-- pagos mientras Google Sheets está sincronizando.
create index if not exists payments_reporting_created_at_id_idx
  on public.payments (created_at desc, id desc);

create index if not exists contact_leads_campaign_idx
  on public.contact_leads (utm_campaign)
  where utm_campaign is not null;

comment on column public.contact_leads.utm_content is
  'Variante de anuncio o mensaje de campaña atribuida al lead.';

comment on column public.contact_leads.landing_path is
  'Ruta de entrada con parámetros UTM; no debe contener datos personales.';
