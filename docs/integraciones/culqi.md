# Integración Culqi — pagos de cursos NeoSer

Guía operativa para desarrollar, probar y desplegar los pagos de cursos con
Culqi en `neoser.pe`.

## Estado actual

- Frontend: Culqi Checkout Custom (`https://js.culqi.com/checkout-js`).
- Seguridad de tarjeta: Culqi3DS (`https://3ds.culqi.com`).
- Backend: API de cargos v2 de Culqi.
- Precio: se resuelve en Supabase; el navegador nunca decide el monto cobrado.
- Persistencia: `contact_leads`, `enrollments` y `payments` después de un cargo
  aprobado.
- Webhook: cerrado por defecto; sin autenticación completa responde `503`.

## Flujo de una compra

1. La persona completa el formulario y elige soles o dólares.
2. Culqi3DS genera la huella del dispositivo.
3. Checkout Custom tokeniza la tarjeta o los datos de Yape. Los datos de la
   tarjeta no pasan por el servidor de NeoSer.
4. El navegador envía el token y la huella a
   `POST /api/payments/culqi/charge`.
5. El backend busca el curso publicado y su precio en Supabase y crea el cargo.
6. Si el motor antifraude responde `REVIEW`, el navegador abre el reto 3DS y
   reintenta con el mismo token y la misma huella.
7. Si el cargo queda aprobado, se crean la inscripción y el pago de forma
   idempotente, se sincronizan los servicios existentes y se muestra la página
   de éxito.
8. El webhook sirve como confirmación asíncrona y para devoluciones. Nunca es
   una fuente confiable si no supera la autenticación.

## Archivos relevantes

| Archivo | Responsabilidad |
|---|---|
| `neoser-app/src/components/course-enrollment-form.tsx` | Checkout Custom, huella y reto 3DS |
| `neoser-app/src/app/api/payments/culqi/charge/route.ts` | Precio autoritativo, cargo y fulfillment |
| `neoser-app/src/app/api/payments/culqi/webhook/route.ts` | Eventos autenticados e idempotentes |
| `neoser-app/src/lib/payments/culqi.ts` | Cliente API, autenticación y sanitización |
| `neoser-app/src/lib/payments/culqi-fulfillment.ts` | Persistencia y sincronizaciones posteriores |
| `neoser-app/src/lib/schemas.ts` | Validación de cargo, 3DS y webhook |
| `neoser-app/.env.example` | Plantilla sin credenciales reales |

## Variables de entorno

### Pruebas

Usar en `.env.local` y en un despliegue de prueba:

```dotenv
NEXT_PUBLIC_CULQI_ENABLED=true
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_test_xxxxx
CULQI_SECRET_KEY=sk_test_xxxxx
```

`NEXT_PUBLIC_CULQI_ENABLED` debe ser exactamente `true`. Si falta, si está en
`false` o tiene otro valor, Culqi no se muestra. Es el interruptor de emergencia.

La llave `pk_*` es pública y llega al navegador. La llave `sk_*` es privada:
nunca debe llevar el prefijo `NEXT_PUBLIC_`, aparecer en Git ni copiarse en una
captura de pantalla.

### Producción en DigitalOcean

En **App Platform → neoser.pe → Settings → App-Level Environment Variables**:

| Variable | Valor | Alcance recomendado |
|---|---|---|
| `NEXT_PUBLIC_CULQI_ENABLED` | `true` | Build + Runtime |
| `NEXT_PUBLIC_CULQI_PUBLIC_KEY` | `pk_live_...` | Build + Runtime |
| `CULQI_SECRET_KEY` | `sk_live_...` | Runtime, cifrada |
| `CULQI_WEBHOOK_USERNAME` | usuario exclusivo del webhook | Runtime, cifrada |
| `CULQI_WEBHOOK_PASSWORD` | contraseña aleatoria exclusiva | Runtime, cifrada |

Las variables `NEXT_PUBLIC_*` se incorporan al JavaScript durante el build. Por
eso cualquier cambio exige un redeploy. No mezclar una llave `pk_test_*` con una
`sk_live_*`, ni al revés.

## Autenticación del webhook

La documentación pública de Culqi explica cómo registrar la URL, pero no define
un header de firma HMAC. Por eso no se debe asumir que existe una cabecera
`x-culqi-signature`.

El endpoint implementa dos modos:

1. HTTP Basic, preferido: `CULQI_WEBHOOK_USERNAME` y
   `CULQI_WEBHOOK_PASSWORD`. Usar credenciales nuevas y exclusivas; nunca las
   credenciales de acceso a CulqiPanel.
2. HMAC legado: `CULQI_WEBHOOK_SECRET`, únicamente si soporte de Culqi confirma
   el header y el algoritmo para la cuenta. No combinarlo con HTTP Basic.

Si en **CulqiPanel → Eventos → Webhooks → Añadir → Activar autenticación**
aparecen campos de usuario y contraseña, colocar allí exactamente las mismas
credenciales exclusivas configuradas en DigitalOcean.

URL:

```text
https://neoser.pe/api/payments/culqi/webhook
```

Eventos mínimos:

- `charge.creation.succeeded`
- `charge.creation.failed`
- `refund.creation.succeeded`

Sin un método completo, el webhook devuelve `503`; con credenciales incorrectas,
`401`. El pago síncrono sigue funcionando, pero no se debe habilitar producción
hasta comprobar un evento de prueba autenticado con respuesta `200`.

## Pruebas antes de producción

Mantener `pk_test_*` y `sk_test_*` durante toda esta etapa.

1. Abrir el curso de prueba en un despliegue que use las llaves test.
2. Probar un cargo aprobado y uno rechazado.
3. Probar Yape en soles.
4. Probar una tarjeta que active 3DS y completar/cancelar el reto.
5. Verificar que no exista doble cargo al hacer doble clic.
6. Confirmar en Supabase una sola fila aprobada en `payments`, una inscripción
   pagada y el lead correspondiente.
7. Confirmar el correo y las sincronizaciones configuradas.
8. Enviar un webhook de prueba desde CulqiPanel y comprobar respuesta `200`.
9. Revisar logs: no deben contener nombres, correos, teléfonos, notas, tokens ni
   respuestas crudas del proveedor.

Las tarjetas de prueba solo funcionan con llaves `test`. Usar siempre los datos
publicados en la documentación vigente de Culqi, porque pueden cambiar.

## Cambio controlado a llaves live

1. Confirmar KYC, cuenta recaudadora y métodos de pago activos en Culqi.
2. Completar todas las pruebas anteriores en un despliegue de prueba.
3. Crear también el webhook en el entorno de producción de Culqi.
4. Cambiar juntas la llave pública y la privada en DigitalOcean:
   `pk_live_*` + `sk_live_*`.
5. Mantener `NEXT_PUBLIC_CULQI_ENABLED=false` durante el primer redeploy.
6. Verificar que el sitio carga y que los endpoints no exponen secretos.
7. Cambiar el interruptor a `true` y redeployar nuevamente.
8. Hacer una compra real controlada con el menor monto válido del curso y
   verificar CulqiPanel, Supabase y el correo.
9. Si algo falla, volver inmediatamente a
   `NEXT_PUBLIC_CULQI_ENABLED=false` y redeployar. No regenerar llaves salvo que
   exista una filtración.

## Seguridad y datos

- Nunca se loguean payloads de Culqi ni datos del comprador.
- `payments.raw_payload` conserva solo ID, tipo, monto, moneda, estado y tipo de
  método; elimina contacto, metadata y mensajes del proveedor.
- Las notas del formulario no se envían en la metadata de Culqi.
- El backend decide el monto usando Supabase o el catálogo del servidor.
- El fulfillment usa `provider_payment_id` para evitar duplicados.
- Un webhook sin autenticación nunca modifica Supabase.

## Diagnóstico rápido

### “El sistema de pago aún se está cargando”

Comprobar que el navegador puede cargar `https://js.culqi.com/checkout-js` y
`https://3ds.culqi.com`, y que un bloqueador no los está filtrando.

### El cargo pide 3DS y no aparece el banco

Comprobar que el segundo script cargó, que el sitio usa HTTPS y que el
`returnUrl` pertenece al mismo origen desde el que se inició el pago.

### `401` en el webhook

Las credenciales enviadas por Culqi no coinciden con DigitalOcean. No mostrar
las credenciales en logs; reemplazarlas por un par nuevo si se expusieron.

### `503` en el webhook

Falta una de las dos variables HTTP Basic o no hay un modo de autenticación
configurado. El cierre es intencional.

### Cargo aprobado en Culqi pero no aparece en Supabase

Mantener el comprobante y el ID del cargo en CulqiPanel. Revisar únicamente los
códigos técnicos de los logs y el historial del webhook; no copiar datos del
cliente a tickets ni chats.

## Referencias oficiales

- https://docs.culqi.com/es/documentacion/checkout/checkout-custom
- https://docs.culqi.com/es/documentacion/culqi-3ds/
- https://docs.culqi.com/es/documentacion/culqi-3ds/v1/configuracion/
- https://docs.culqi.com/es/documentacion/culqi-3ds/v1/uso-libreria/
- https://docs.culqi.com/es/documentacion/pagos-online/webhooks/
- https://docs.culqi.com/es/documentacion/pagos-online/llaves

Última actualización: 2026-09-05.
