-- Pronto pago Neurobiología: S/ 220 (Perú) y USD 60 (extranjero) hasta el 30/09/2026.
-- Idempotente: seguro de re-ejecutar.
-- El cobro USD sale del catálogo estático (priceUSD); este update alinea la ficha en BD.

update public.courses
set
  price = 220.00,
  description = 'Curso virtual sincrónico dictado por el Dr. Beltrán Lares (Director de AuroraMadre Academia, Buenos Aires) con dirección académica de la Obst. Diana Silva Mejía. Cuatro módulos: Vínculo, Microbiota y Hormonas; Teoría del Apego, Epigenética y Neurociencias; y dos módulos de Protocolos para la Humanización del Nacimiento. Inicio: jueves 08 de octubre de 2026. Jueves de 7:00 a 9:00 p. m. (hora Perú), una vez a la semana. Duración: 2 meses, 64 horas académicas equivalentes a 4 créditos, con certificado de aprobación, Campus Virtual NeoSer y grabaciones durante 12 meses. Pronto pago vigente hasta el 30 de septiembre de 2026: S/ 220 en Perú y USD 60 en el extranjero.',
  updated_at = now()
where slug = 'neurobiologia-parto';
