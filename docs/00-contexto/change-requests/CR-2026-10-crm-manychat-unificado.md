# CR-2026-10 — CRM unificado con ManyChat

## Aprobación

Solicitud directa de la clienta/equipo en conversación del 19/10/2026: mostrar
en el CRM los contactos provenientes del sitio web y de ManyChat, reconocer a
la misma persona por su número internacional y facilitar el uso diario del
panel por el equipo NeoSer.

## Alcance aprobado

- Normalizar teléfonos al formato E.164 usando el país declarado.
- Agrupar visualmente registros históricos con el mismo teléfono canónico sin
  borrar pagos, inscripciones, notas ni trazabilidad.
- Registrar para una persona una o ambas procedencias: sitio web y ManyChat.
- Recibir desde flujos de ManyChat un conjunto mínimo de datos y eventos por un
  endpoint autenticado con secreto propio de NeoSer.
- Mostrar campaña, flujo, canal y actividad reciente en el CRM administrativo.
- Añadir selector de país en formularios web que capturan teléfono.

## Fuera de alcance

- Guardar el texto completo de conversaciones de WhatsApp.
- Descargar automáticamente todo el histórico de ManyChat.
- Enviar campañas desde el CRM NeoSer.
- Reemplazar ManyChat, Supabase o la arquitectura vigente.

## Privacidad y seguridad

- El endpoint no acepta datos clínicos ni contenido libre de conversación.
- Solo se almacena el evento operativo (entrada, opción elegida, finalización),
  campaña/flujo y consentimiento explícito informado por el flujo.
- La integración usa `MANYCHAT_WEBHOOK_SECRET`, solo en servidor y cifrado en
  DigitalOcean. No se reutiliza la API key de ManyChat ni se expone en cliente.
- Las tablas de procedencias y eventos tienen RLS y lectura exclusiva para
  administradores autenticados.

## Criterios de aceptación

1. `932713071` con país Perú y `+51932713071` se muestran como un solo contacto.
2. El contacto puede mostrar simultáneamente “Sitio web” y “ManyChat”.
3. Los filtros de procedencia incluyen contactos mixtos en ambos resultados.
4. Repetir el mismo evento de ManyChat no genera eventos duplicados.
5. Un secreto incorrecto obtiene HTTP 401 y no registra información.
6. Sin la migración aplicada, el flujo público web conserva compatibilidad y
   la integración ManyChat informa que todavía no está inicializada.

## Despliegue y reversión

Aplicar primero la migración en staging, configurar el secreto, probar un flujo
de ManyChat y ejecutar el checklist de QA. La reversión funcional consiste en
retirar la llamada External Request de ManyChat; las tablas nuevas pueden
permanecer sin afectar el checkout ni los formularios web.
