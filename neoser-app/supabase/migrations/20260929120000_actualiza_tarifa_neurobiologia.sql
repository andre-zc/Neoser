-- Actualiza la tarifa pública de Neurobiología del Parto.
-- Idempotente: puede volver a ejecutarse sin duplicar registros.

update public.courses
set
  price = 300.00,
  description = 'Curso virtual sincrónico dictado por el Dr. Beltrán Lares (Director de AuroraMadre Academia, Buenos Aires) con dirección académica de la Obst. Diana Silva Mejía. Cuatro módulos: Vínculo, Microbiota y Hormonas; Teoría del Apego, Epigenética y Neurociencias; y dos módulos de Protocolos para la Humanización del Nacimiento. Inicio: jueves 08 de octubre de 2026. Jueves de 7:00 a 9:00 p. m. (hora Perú), una vez a la semana. Duración: 2 meses, 64 horas académicas equivalentes a 4 créditos, con certificado de aprobación, Campus Virtual NeoSer y grabaciones durante 12 meses. Tarifas vigentes: S/ 300 para participantes en Perú y USD 75 para participantes del extranjero.'
where slug = 'neurobiologia-parto';
