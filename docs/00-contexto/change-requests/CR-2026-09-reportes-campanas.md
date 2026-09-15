# CR-2026-09 — Reportes de ventas, campañas y tráfico

**Estado:** aprobado para implementación

**Aprobación:** solicitud escrita de la propietaria del repositorio, 13/09/2026

**Responsable técnico:** equipo web NeoSer

## Objetivo

Crear una vista operativa unificada para analizar ventas de Culqi y PayPal,
atribución de campañas, métricas manuales de ManyChat y tráfico de GA4, con una
plantilla que pueda importarse a Google Sheets.

## Alcance aprobado

- Capturar UTM de la visita y asociarlas a compras sin enviar datos personales a GA4.
- Registrar eventos de comercio electrónico en GA4 para el dominio `neoser.pe`.
- Exponer un endpoint privado, de solo lectura, para sincronizar pagos sin PII.
- Sincronizar pagos y GA4 desde un Google Sheet mediante Apps Script.
- Mantener una tabla manual para resultados de mensajes de ManyChat.
- Excluir localhost, el subdominio de Vercel y cobros internos de QA.

## Límites y controles

- PayPal.me no confirma pagos: sus registros permanecen pendientes hasta revisión manual.
- El token del reporte vive únicamente en DigitalOcean y Script Properties.
- No se exportan nombres, correos, teléfonos, DNI, información clínica ni payloads de pasarela.
- La clave de ManyChat no se incluye en esta fase ni se guarda en el repositorio.
- Despliegue sujeto a migración de Supabase y QA del flujo de compra.

## Criterios de aceptación

1. GA4 recibe `view_item`, `begin_checkout`, `add_payment_info` y `purchase` solo desde producción.
2. `purchase` se dispara solo para un pago aprobado y no para vistas previas o QA.
3. El endpoint responde `401` sin token, `503` si no está configurado y no incluye PII.
4. La plantilla separa PEN y USD y no suma pagos pendientes como ventas.
5. Apps Script filtra GA4 por hostname `neoser.pe` y conserva la carga manual de ManyChat.
