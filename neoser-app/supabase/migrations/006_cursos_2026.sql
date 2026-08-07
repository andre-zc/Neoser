-- ============================================
-- 006 — Catálogo oficial de cursos NeoSer 2026
-- ============================================
-- Sincroniza la tabla `courses` con el listado 2026 entregado por la clienta
-- (carpeta CURSOS/, archivo cursos-neoser.docx) y con el catálogo estático de
-- `src/lib/courses-catalog.ts`. Los UUID deben coincidir con ese archivo porque
-- el checkout (enrollments + payments) referencia `courses.id`.
--
-- Idempotente: seguro de re-ejecutar.
--
-- 1) Despublica los 3 cursos placeholder sembrados en la migración 002 que NO
--    forman parte del listado 2026. NO se borran: `enrollments` y `payments`
--    tienen FK con ON DELETE CASCADE, así que un DELETE destruiría el historial
--    de inscripciones y pagos. Despublicar los saca de la web sin perder datos.
-- 2) Inserta / actualiza los 5 cursos del listado 2026.
--
-- Cursos sin precio confirmado (Rebozo presencial y la jornada Herramientas)
-- se siembran con price 0 y NO abren checkout online: en la web el CTA deriva a
-- WhatsApp (campo `enrollment: "whatsapp"` del catálogo estático). Cuando la
-- clienta confirme la inversión, actualizar aquí y en courses-catalog.ts.

-- ---------------------------------------------------------------------------
-- 1) Despublicar los placeholders que no van en 2026
-- ---------------------------------------------------------------------------
update public.courses
set is_published = false
where slug in ('prep-parto', 'diplomado-parto', 'taller-lactancia');

-- ---------------------------------------------------------------------------
-- 2) Catálogo 2026
-- ---------------------------------------------------------------------------
insert into public.courses (
  id, slug, title, short_description, description,
  price, currency, mode, duration_label, hero_color, is_published
)
values
  -- 1. Neurobiología del Parto y Protocolos para un Nacimiento Humanizado
  (
    '6a7b8c9d-6666-4666-8666-666666666666',
    'neurobiologia-parto',
    'Neurobiología del Parto y Protocolos para un Nacimiento Humanizado',
    'Edición 2026. Neurobiología, microbiota, epigenética y teoría del apego aplicadas a protocolos clínicos basados en evidencia.',
    'Curso virtual sincrónico dictado por el Dr. Beltrán Lares (Director de AuroraMadre Academia, Buenos Aires) con dirección académica de la Obst. Diana Silva Mejía. Cuatro módulos: Vínculo, Microbiota y Hormonas; Teoría del Apego, Epigenética y Neurociencias; y dos módulos de Protocolos para la Humanización del Nacimiento. Inicio: martes 18 de agosto de 2026. Martes y jueves de 7:00 a 9:00 p. m. (hora Perú). Duración: 64 horas académicas equivalentes a 4 créditos, con certificado de aprobación, Campus Virtual NeoSer y grabaciones durante 12 meses. Tarifas: S/ 300 en Perú (S/ 220 egresadas NeoSer) y USD 75 en el extranjero (USD 60 egresadas).',
    300.00, 'PEN', 'Virtual sincrónica', '64 horas académicas · 8 sesiones',
    'navy', true
  ),

  -- 2. El Arte del Rebozo desde la Educación Somática (virtual)
  (
    '3a4b5c6d-3333-4333-8333-333333333333',
    'rebozo-cert',
    'El Arte del Rebozo desde la Educación Somática',
    'Formación especializada que integra la Técnica Rebozo, la educación somática y la atención humanizada, con certificación emitida por Maternidad y Medicina Humanizada NeoSer.',
    'Programa virtual de 4 seminarios a lo largo de 1 mes que une la sabiduría del rebozo con la Educación Somática Prenatal, la Neurobiología del Parto y la Bioética Personalista, aplicado al embarazo, parto y posparto. Incluye 12 videos tutoriales de ejercicios, acceso a la Comunidad de profesionales NeoSer, grabaciones para repaso y certificado de participación NeoSer.',
    300.00, 'PEN', 'Virtual', '1 mes · 4 seminarios',
    'navy', true
  ),

  -- 3. El Arte del Rebozo para el embarazo, parto y posparto (presencial)
  (
    '7a8b9c0d-7777-4777-8777-777777777777',
    'rebozo-presencial',
    'El Arte del Rebozo para el embarazo, parto y posparto',
    'Versión presencial del programa de Rebozo: práctica guiada de balanceo, suspensión y sostén para cada etapa del proceso.',
    'Modalidad presencial del programa de Rebozo, donde toda la práctica es acompañada de forma directa: corrección de postura, tensión de la tela y ejecución en el momento. Fechas, sede e inversión de la edición 2026 en programación; la coordinación se hace por WhatsApp (+51 932 713 071) o dsilva@neoserperu.com.',
    0.00, 'PEN', 'Presencial', 'Edición 2026 · fechas por confirmar',
    'pink', true
  ),

  -- 4. Antropología y Sociología del Nacimiento
  (
    '5a6b7c8d-5555-4555-8555-555555555555',
    'antropologia-parto',
    'Antropología y Sociología del Nacimiento',
    'Curso Internacional: paradigmas culturales del nacimiento, violencia obstétrica y el surgimiento de la partería posmoderna.',
    'Curso Internacional dictado por NeoSer en alianza con Aurora Madre. Ofrece una visión integral sobre los modelos de atención, las dinámicas sociales y culturales que rodean el nacimiento y la violencia obstétrica desde una perspectiva de derechos humanos. Cuatro módulos: Antropología del nacimiento, Sociología en Salud Reproductiva, Violencia obstétrica y Tendencias Mundiales en Obstetricia. Facilitadores: Dr. Beltrán Lares Díaz (Aurora Madre, Venezuela) y Dra. Robbie Davis-Floyd (antropóloga médica, EE. UU.). Modalidad online, 48 horas académicas (3 créditos), certificado digital. Tarifas: S/ 200 en Perú y USD 60 en el extranjero.',
    200.00, 'PEN', 'Online', '1 mes · 8 sesiones',
    'navy', true
  ),

  -- 5. Herramientas para un Nacimiento Humanizado (jornada)
  (
    '8a9b0c1d-8888-4888-8888-888888888888',
    'herramientas-nacimiento-humanizado',
    'Herramientas para un Nacimiento Humanizado',
    'Jornada académica con la participación de profesores especialistas invitados, centrada en herramientas prácticas para la atención del nacimiento.',
    'Jornada académica que reúne a profesores especialistas invitados alrededor de las herramientas concretas que sostienen una atención del nacimiento respetuosa, segura y basada en evidencia. Formato de encuentro intensivo. Programa, fecha e inversión de la edición 2026 en programación; la coordinación se hace por WhatsApp (+51 932 713 071) o dsilva@neoserperu.com.',
    0.00, 'PEN', 'Jornada académica', 'Edición 2026 · fecha por confirmar',
    'pink', true
  )
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  short_description = excluded.short_description,
  description = excluded.description,
  price = excluded.price,
  currency = excluded.currency,
  mode = excluded.mode,
  duration_label = excluded.duration_label,
  hero_color = excluded.hero_color,
  is_published = excluded.is_published;
