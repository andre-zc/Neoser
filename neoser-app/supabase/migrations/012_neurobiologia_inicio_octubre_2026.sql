-- Actualiza fechas de Neurobiología del Parto (edición 2026 II).
-- Idempotente: seguro de re-ejecutar.

update public.courses
set
  description = 'Curso virtual sincrónico dictado por el Dr. Beltrán Lares (Director de AuroraMadre Academia, Buenos Aires) con dirección académica de la Obst. Diana Silva Mejía. Cuatro módulos: Vínculo, Microbiota y Hormonas; Teoría del Apego, Epigenética y Neurociencias; y dos módulos de Protocolos para la Humanización del Nacimiento. Inicio: jueves 08 de octubre de 2026. Jueves de 7:00 a 9:00 p. m. (hora Perú), una vez a la semana. Duración: 2 meses, 64 horas académicas equivalentes a 4 créditos, con certificado de aprobación, Campus Virtual NeoSer y grabaciones durante 12 meses. Tarifas: S/ 300 en Perú (S/ 220 egresadas NeoSer) y USD 75 en el extranjero (USD 60 egresadas).',
  updated_at = now()
where slug = 'neurobiologia-parto';
