-- ==========================================================================
-- 007 — Programa de Formación «El Arte del Rebozo» (semipresencial, 64 h)
-- ==========================================================================
-- La clienta entregó la información definitiva del curso presencial de Rebozo
-- (carpeta 3-REBOZO-PRESENCIAL, archivo Programa_Formacion_Rebozo_NeoSer.docx).
-- Deja de ser un placeholder sin datos: pasa a ser un programa de 64 horas
-- académicas (4 créditos) en modalidad semipresencial, con inversión definida.
--
-- Sincroniza la fila con el catálogo estático de `src/lib/courses-catalog.ts`
-- (slug `rebozo-presencial`, UUID 7a8b9c0d-…). Idempotente: seguro de
-- re-ejecutar.
--
-- Inversión confirmada (referencia, no se modela por módulos en la tabla):
--   Regular          → Módulo I S/220 · Módulo II S/500 · Completo S/720
--   Egresadas NeoSer → Módulo I S/180 · Módulo II S/400 · Completo S/580
-- `price` guarda el programa completo (720). El checkout online sigue cerrado
-- (`enrollment: "whatsapp"` en el catálogo) porque las fechas de la próxima
-- edición aún están en programación: el CTA deriva a WhatsApp.

update public.courses
set
  title = 'El Arte del Rebozo desde la Educación Somática para el Embarazo, Parto y Postparto',
  short_description = 'Programa de formación de 64 horas académicas (4 créditos) en modalidad semipresencial: módulo virtual asincrónico + curso taller presencial con práctica clínica supervisada.',
  description = 'Programa desarrollado por Maternidad y Medicina Humanizada NeoSer Perú para fortalecer competencias profesionales mediante evidencia científica, educación somática y práctica clínica. Estructura: Módulo I — Formación Virtual Asincrónica (32 h, 4 seminarios) y Módulo II — Curso Taller Presencial (32 h, 4 unidades prácticas aplicadas al embarazo, parto y postparto). Total 64 horas académicas equivalentes a 4 créditos. Dirigido a obstetras y bachilleres en Obstetricia. Facilitadora: Obsta. Diana Silva Mejía. Inversión: Módulo I S/220, Módulo II S/500, programa completo S/720; tarifa para egresadas NeoSer S/180, S/400 y S/580 respectivamente. Fechas de la próxima edición en programación; la coordinación se hace por WhatsApp (+51 932 713 071) o dsilva@neoserperu.com.',
  price = 720.00,
  currency = 'PEN',
  mode = 'Semipresencial',
  duration_label = '64 horas académicas · 4 créditos',
  hero_color = 'pink',
  is_published = true
where id = '7a8b9c0d-7777-4777-8777-777777777777';
