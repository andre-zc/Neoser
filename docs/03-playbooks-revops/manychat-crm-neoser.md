# ManyChat → CRM NeoSer

## Objetivo

Registrar en el CRM a los contactos que pasan por una automatización de
ManyChat y unirlos con su ficha web cuando comparten el mismo WhatsApp. La
integración guarda identidad y eventos operativos; no copia la conversación.

## Requisitos

- Migración `20261019205229_crm_manychat_unificado.sql` aplicada en Supabase.
- Variable server-only `MANYCHAT_WEBHOOK_SECRET` en DigitalOcean, con alcance
  **Run time** y cifrada.
- Plan de ManyChat con **Dev Tools / External Request** habilitado.

La API key pública/privada de ManyChat no se usa para este flujo. Si alguna API
key fue compartida en un chat o captura, revocarla y generar una nueva antes de
usar otras integraciones.

## Configuración en cada flujo

Agregar una acción **Make External Request** al inicio del flujo y, si se desea
medir el menú, otra después de cada botón relevante.

- Método: `POST`
- URL: `https://neoser.pe/api/integrations/manychat/events`
- Header `Content-Type`: `application/json`
- Header `Authorization`: `Bearer EL_MISMO_SECRETO_DE_DIGITALOCEAN`

Body de referencia:

```json
{
  "subscriberId": "VARIABLE_ID_DEL_CONTACTO",
  "eventType": "flow_entered",
  "channel": "whatsapp",
  "fullName": "VARIABLE_NOMBRE_COMPLETO",
  "phone": "VARIABLE_WHATSAPP_ID",
  "email": "VARIABLE_EMAIL",
  "whatsappConsent": "VARIABLE_OPTED_IN_WHATSAPP",
  "marketingConsent": false,
  "campaignName": "Meta Neurobiología octubre",
  "flowId": "neurobiologia-oct-2026",
  "flowName": "Información Neurobiología",
  "courseSlug": "neurobiologia-parto"
}
```

No escribir literalmente `VARIABLE_...`. En el editor de ManyChat se debe usar
el botón de variables `{}` y elegir los System Fields correspondientes:
Contact ID, Full name, WhatsApp ID, Email y Opted-in for WhatsApp. ManyChat
permite insertar esos campos dentro del JSON. El servidor registra la hora de
recepción; `occurredAt` solo se añade si el flujo entrega ISO 8601.

Para una acción elegida en el menú se puede usar:

```json
{
  "subscriberId": "VARIABLE_ID_DEL_CONTACTO",
  "eventType": "option_selected",
  "channel": "whatsapp",
  "phone": "VARIABLE_WHATSAPP_ID",
  "fullName": "VARIABLE_NOMBRE_COMPLETO",
  "whatsappConsent": "VARIABLE_OPTED_IN_WHATSAPP",
  "campaignName": "Meta Neurobiología octubre",
  "flowId": "neurobiologia-oct-2026",
  "flowName": "Información Neurobiología",
  "selectedOption": "Inscribirme",
  "courseSlug": "neurobiologia-parto"
}
```

Valores recomendados de `eventType`:

- `conversation_started`
- `flow_entered`
- `menu_shown`
- `option_selected`
- `payment_started`
- `flow_completed`

## Consentimiento

`whatsappConsent` solo debe enviarse como `true` cuando el System Field
**Opted-in for WhatsApp** sea verdadero o el flujo haya recogido consentimiento
expreso. Estar en ManyChat por sí solo no autoriza campañas comerciales.
`marketingConsent` permanece `false` salvo una aceptación separada e informada.

## Prueba antes de publicar

1. En ManyChat, elegir un contacto de prueba con WhatsApp ID internacional.
2. Ejecutar **Test Request** y confirmar HTTP `200` o `201`.
3. Entrar a `/admin`, pulsar **Actualizar** y buscar el teléfono.
4. Confirmar la etiqueta **ManyChat** y el flujo/campaña en la ficha.
5. Completar el formulario web con el mismo número local y país; debe seguir
   existiendo una sola ficha, ahora con **Sitio web** y **ManyChat**.
6. Probar un secreto incorrecto: debe responder HTTP `401`.

## Contactos históricos

External Request sincroniza contactos desde que se publica la acción. Para
históricos, exportar desde ManyChat los System Fields mínimos (ID, nombre,
WhatsApp ID, email y consentimiento) y realizar una importación controlada; no
subir exportaciones con conversaciones ni datos de salud.
