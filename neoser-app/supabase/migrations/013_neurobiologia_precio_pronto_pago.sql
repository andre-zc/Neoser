-- Precio pronto pago Neurobiología del Parto: S/ 220 (antes S/ 300).
-- Idempotente: seguro de re-ejecutar.

update public.courses
set
  price = 220.00,
  description = 'Curso virtual sincrónico dictado por el Dr. Beltrán Lares (Director de AuroraMadre Academia, Buenos Aires) con dirección académica de la Obst. Diana Silva Mejía. Cuatro módulos: Vínculo, Microbiota y Hormonas; Teoría del Apego, Epigenética y Neurociencias; y dos módulos de Protocolos para la Humanización del Nacimiento. Inicio: jueves 08 de octubre de 2026. Jueves de 7:00 a 9:00 p. m. (hora Perú), una vez a la semana. Duración: 2 meses, 64 horas académicas equivalentes a 4 créditos, con certificado de aprobación, Campus Virtual NeoSer y grabaciones durante 12 meses. Tarifas: S/ 220 precio pronto pago en Perú y USD 75 en el extranjero (USD 60 egresadas NeoSer).',
  updated_at = now()
where slug = 'neurobiologia-parto';
