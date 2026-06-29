# Integración Culqi — Pagos de cursos NeoSer

Documento operativo para mantener, debuggear y migrar a producción la integración de pagos con Culqi.

## Tabla de contenidos

- [Resumen del flujo](#resumen-del-flujo)
- [Archivos relevantes](#archivos-relevantes)
- [Setup local (desarrollo)](#setup-local-desarrollo)
- [Setup producción (Vercel + dominio real)](#setup-producción-vercel--dominio-real)
- [Tarjetas y datos de prueba](#tarjetas-y-datos-de-prueba)
- [Configurar el webhook en CulqiPanel](#configurar-el-webhook-en-culqipanel)
- [Cambio de modo test → producción](#cambio-de-modo-test--producción)
- [Cómo rotar las llaves](#cómo-rotar-las-llaves)
- [Troubleshooting](#troubleshooting)
- [Decisiones técnicas](#decisiones-técnicas)

---

## Resumen del flujo

```
┌─────────────────────────────────────────────────────────────────────┐
│  Usuario en /cursos/[slug]/inscribirse                              │
│                                                                     │
│  1. Llena form (nombre, email, teléfono, notas)                     │
│  2. Click "Pagar e inscribirme"                                     │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  CourseEnrollmentForm (Client Component)                            │
│                                                                     │
│  3. Abre modal de Culqi (Custom Checkout V4)                        │
│  4. Usuario ingresa tarjeta o Yape                                  │
│  5. Culqi TOKENIZA en su servidor (la tarjeta NUNCA toca el nuestro)│
│  6. Culqi llama callback global window.culqi()                      │
│  7. Frontend POST a /api/payments/culqi/charge con el token         │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  /api/payments/culqi/charge (Server Component)                      │
│                                                                     │
│  8. Valida payload con Zod                                          │
│  9. Resuelve precio desde DB (autoritativo — nunca confía en el     │
│     monto que viene del cliente)                                    │
│  10. POST a https://api.culqi.com/v2/charges con Bearer sk_*        │
│  11. Si charge.outcome === "venta_exitosa":                         │
│        → fulfillSuccessfulCharge()                                  │
│            ↳ INSERT contact_leads (lead_status=inscrito)            │
│            ↳ INSERT enrollments (status=paid)                       │
│            ↳ UPSERT payments (status=approved)                      │
│            ↳ Sync HubSpot (no-bloqueante)                           │
│            ↳ Sync Brevo (no-bloqueante)                             │
│            ↳ Email confirmación al cliente (no-bloqueante)          │
│      Si rechazado: recordFailedCharge() → solo INSERT en payments   │
│      con status=rejected (auditoría).                               │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend recibe response                                            │
│                                                                     │
│  12a. 200 ok → redirect a /checkout/success?ref=chr_xxx             │
│  12b. 402 → mensaje inline "Tarjeta rechazada", el usuario puede    │
│        reintentar con otra tarjeta sin recargar                     │
└─────────────────────────────────────────────────────────────────────┘

         (Asíncrono, ocurre minutos después o nunca)
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│  /api/payments/culqi/webhook                                        │
│                                                                     │
│  13. Culqi envía eventos:                                           │
│      - charge.creation.succeeded (confirma cargos exitosos)         │
│      - charge.creation.failed                                       │
│      - refund.creation.succeeded                                    │
│  14. Valida firma HMAC con CULQI_WEBHOOK_SECRET                     │
│  15. Si "approved" y el chargeId ya está en DB → ignora (idempotente)│
│  16. Si "approved" pero NO está en DB (caso edge: el endpoint /charge│
│      crasheó después del cobro real) → ejecuta fulfillment desde 0  │
│  17. Si "refunded" → UPDATE payments SET status='refunded'          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Archivos relevantes

| Archivo | Rol |
|---|---|
| `neoser-app/src/components/course-enrollment-form.tsx` | Form + integración Custom Checkout client-side |
| `neoser-app/src/lib/payments/culqi.ts` | Tipos, `createCulqiCharge`, `verifyCulqiWebhookSignature`, `mapCulqiEventToPaymentStatus`, `splitName` |
| `neoser-app/src/lib/payments/culqi-fulfillment.ts` | `fulfillSuccessfulCharge` (idempotente) + `recordFailedCharge` |
| `neoser-app/src/app/api/payments/culqi/charge/route.ts` | POST endpoint, lookup curso DB, llama Culqi API, dispara fulfillment |
| `neoser-app/src/app/api/payments/culqi/webhook/route.ts` | Endpoint async para confirmaciones, refunds, idempotencia |
| `neoser-app/src/lib/schemas.ts` | `culqiChargeRequestSchema`, `culqiWebhookSchema` |
| `neoser-app/supabase/migrations/004_culqi_payments.sql` | `enrollment_id` nullable + índice (corregido por 005) |
| `neoser-app/supabase/migrations/005_payments_provider_payment_id_constraint.sql` | Unique constraint válido para ON CONFLICT |
| `neoser-app/.env.example` | Plantilla con las 5 vars Culqi |

---

## Setup local (desarrollo)

### 1. Obtener llaves de CulqiPanel

Login en https://panel.culqi.com → **Desarrollo** → **API Keys** (tab) → copiar:

- `pk_test_xxxxxxxx` — llave pública (va al navegador)
- `sk_test_xxxxxxxx` — llave privada (solo servidor, sensible)

Si querés agregar encriptación RSA (capa extra opcional, Fase 2):
- **Desarrollo** → **RSA Keys** → generar par → copiar `rsa_id` y `rsa_public_key`

### 2. Agregar a `neoser-app/.env.local`

```bash
# Culqi (pagos de cursos)
NEXT_PUBLIC_CULQI_PUBLIC_KEY=pk_test_xxxxxxxx
CULQI_SECRET_KEY=sk_test_xxxxxxxx

# Opcionales — Fase 2 (encriptación RSA del body)
CULQI_RSA_ID=
CULQI_RSA_PUBLIC_KEY=

# Webhook secret (solo si configurás webhook con URL pública via ngrok/tunnel)
CULQI_WEBHOOK_SECRET=
```

Guardá `.env.local` (Ctrl+S) y reiniciá el dev server (`Ctrl+C` y `npm run dev` de nuevo). Next.js lee `.env.local` solo al arrancar.

### 3. Probar el flow

1. `npm run dev`
2. Abrir http://localhost:3000/cursos/prep-parto/inscribirse
3. Llenar form con datos cualquiera (poné tu email real para recibir el confirmation email)
4. Click "Pagar e inscribirme" → debe abrirse el modal Culqi
5. Pagar con [tarjeta de prueba](#tarjetas-y-datos-de-prueba)

---

## Setup producción (Vercel + dominio real)

### 1. Vars en Vercel

**Settings → Environment Variables**, agregar (marcar Production + Preview):

| Key | Value | Sensitive |
|---|---|---|
| `NEXT_PUBLIC_CULQI_PUBLIC_KEY` | `pk_live_xxxxxxxx` (NO `pk_test_*`) | No |
| `CULQI_SECRET_KEY` | `sk_live_xxxxxxxx` | ✅ Sí |
| `CULQI_RSA_ID` | (opcional) | ✅ Sí |
| `CULQI_RSA_PUBLIC_KEY` | (opcional) | No |
| `CULQI_WEBHOOK_SECRET` | el secret del webhook configurado en panel | ✅ Sí |

⚠️ **NUNCA** poner la `sk_*` con prefijo `NEXT_PUBLIC_` (la expondría al navegador → cualquiera podría cobrar a tu cuenta).

Después de agregar: **Deployments → Redeploy** (las env vars solo se aplican al redeployar).

### 2. Configurar webhook en CulqiPanel

Ver sección [Configurar el webhook](#configurar-el-webhook-en-culqipanel).

### 3. Smoke test en prod

Hacer un cargo de prueba con tarjeta real (puede ser tuya, monto bajo). Verificar:
- CulqiPanel muestra el cargo aprobado
- Supabase tiene fila en `payments` con status='approved'
- HubSpot tiene Contact + Deal nuevo (si `HUBSPOT_ACCESS_TOKEN` configurado)
- Brevo tiene contacto en la lista de Inscritos (si `BREVO_LIST_ENROLLMENTS` configurado)
- Email de confirmación llega al inbox (si `EMAIL_API_KEY` configurado)

---

## Tarjetas y datos de prueba

Solo funcionan con `pk_test_*` y `sk_test_*`. En modo prod estas tarjetas son rechazadas.

| Tarjeta | CVV | Vencimiento | Resultado esperado |
|---|---|---|---|
| `4111 1111 1111 1111` | `123` | `12/30` (cualquier futura) | ✅ Cargo aprobado |
| `4000 0000 0000 0002` | `123` | `12/30` | ❌ Tarjeta rechazada |
| `5500 0000 0000 0004` | `123` | `12/30` | ✅ Aprobado (Mastercard) |
| `5400 0000 0000 0005` | `123` | `12/30` | ❌ Rechazada (Mastercard) |

**Yape (modo test)**: Culqi simula el flow sin enviar SMS real. Seguir las instrucciones que muestra el modal.

Documentación oficial: https://docs.culqi.com/integration/cards/test-cards

---

## Configurar el webhook en CulqiPanel

El webhook permite que Culqi notifique cargos confirmados/fallidos/refunds de forma asíncrona. **Crítico para producción** (refunds, disputas, fraudes).

### Pasos

1. **CulqiPanel** → **Webhooks** (en el menú lateral).
2. **+ Agregar Webhook**.
3. **URL**: `https://<tu-dominio-prod>/api/payments/culqi/webhook`
   - En staging/preview: `https://<preview-url>.vercel.app/api/payments/culqi/webhook`
   - En local con tunnel: `https://abc123.ngrok.io/api/payments/culqi/webhook`
4. **Eventos a escuchar** (marcar al menos):
   - ✅ `charge.creation.succeeded`
   - ✅ `charge.creation.failed`
   - ✅ `refund.creation.succeeded`
5. **Secret**: clic en "Generar". Culqi crea un secret aleatorio (formato: 32+ chars).
6. **Copiar el secret** (solo se muestra una vez) y pegarlo en Vercel como `CULQI_WEBHOOK_SECRET`.
7. **Guardar**.

### Probar el webhook

CulqiPanel tiene un botón "Enviar evento de prueba". Después de mandarlo:
- Logs de Vercel → debe aparecer `[culqi] webhook` con status 200.
- Si aparece 401 → el secret no coincide entre Vercel y CulqiPanel.

### Sin webhook configurado (dev)

En desarrollo local, sin webhook el flow funciona igual porque el endpoint `/api/payments/culqi/charge` hace el fulfillment síncrono cuando Culqi devuelve `outcome.type === "venta_exitosa"`. El webhook solo es necesario para:
- Confirmar refunds (no se hacen desde el sitio, solo desde CulqiPanel/dashboard)
- Cubrir el caso edge donde `/charge` crasheó después de cobrar pero antes de persistir

Si `CULQI_WEBHOOK_SECRET` está vacío, `verifyCulqiWebhookSignature` devuelve `true` y loguea warning. Esto es **inseguro en producción** (cualquiera puede falsificar eventos). En producción siempre configurar el secret.

---

## Cambio de modo test → producción

Cuando estés listo para cobrar dinero real:

### 1. Verificar requisitos en Culqi
- Cuenta validada (KYC completo)
- Cuenta bancaria recaudadora vinculada (BCP en soles)
- Métodos de pago activados (Yape, tarjetas internacionales si las querés)

### 2. Conseguir llaves prod
CulqiPanel → **Producción** → **API Keys** → copiar `pk_live_*` y `sk_live_*`.

### 3. Cambiar vars en Vercel
- Reemplazar `pk_test_*` → `pk_live_*` en `NEXT_PUBLIC_CULQI_PUBLIC_KEY`
- Reemplazar `sk_test_*` → `sk_live_*` en `CULQI_SECRET_KEY`

### 4. Reconfigurar webhook
El webhook de modo test NO sirve para modo prod (Culqi los separa). En CulqiPanel:
- Crear webhook NUEVO en la sección **Producción → Webhooks** (no en Desarrollo).
- Mismo proceso del [paso de webhook](#configurar-el-webhook-en-culqipanel).
- Copiar el nuevo secret a `CULQI_WEBHOOK_SECRET` en Vercel.

### 5. Redeploy
**Vercel → Deployments → Redeploy** para que tome las nuevas vars.

### 6. Smoke test final
Hacer un cargo real con tarjeta tuya (S/. 1 si Culqi lo permite). Verificar que aparezca en CulqiPanel **Producción** y en la cuenta recaudadora vinculada.

---

## Cómo rotar las llaves

Si la `sk_test_*` o `sk_live_*` se filtra (commit accidental, log público, etc.):

1. **CulqiPanel → API Keys** → botón "Regenerar" en la llave comprometida.
2. La vieja queda inválida inmediatamente.
3. Actualizar la nueva en `.env.local` (dev) y/o Vercel (prod).
4. Redeploy.
5. **Webhook secret**: si fue el que se filtró, generar nuevo desde CulqiPanel → Webhooks → editar → regenerar secret.

**No se filtran las `pk_*`**, son públicas por diseño (van al navegador).

---

## Troubleshooting

### "El sistema de pago aún se está cargando"
El script `https://checkout.culqi.com/js/v4` no se cargó o no expone `window.Culqi`.
- **Causa común**: usaste la URL incorrecta `https://js.culqi.com/checkout-js` (esa expone `window.CulqiCheckout` con API V4 nueva — distinta a la nuestra).
- **Fix**: verificá en `course-enrollment-form.tsx` que el `<Script src=...>` apunte a `https://checkout.culqi.com/js/v4`.
- **Verificación**: en DevTools console → `typeof window.Culqi` → debe ser `"object"`.

### Modal no abre / `window.Culqi is undefined`
- Adblocker bloqueando `checkout.culqi.com` o `culqi.com` (uBlock, Brave Shields). Desactivar para el dominio.
- En network tab: el script debe responder 200, ~870 KB.

### Doble cobro al mismo cliente
El callback `window.culqi()` se invocó múltiples veces (click doble en el modal de Culqi, race condition).
- **Mitigación implementada**: flag `processing` en el closure del `useEffect`. La primera invocación lo activa y bloquea las subsecuentes hasta éxito/error.
- Si el bug reaparece, revisar `course-enrollment-form.tsx` que el flag esté presente.

### En el panel de Culqi sale "first_last_name first_last_name" como nombre
- **Causa**: el body del POST a Culqi no incluía `antifraud_details.first_name` ni `last_name`. Culqi pone ese placeholder.
- **Fix implementado**: `createCulqiCharge` en `culqi.ts` ahora hace split del `customerFullName` y manda `antifraud_details.first_name + last_name`.

### Botón del modal Culqi muestra el precio duplicado ("Pagar S/. 350 S/ 350.00")
- **Causa**: Culqi agrega automáticamente el monto al `buttonText`. Si vos también lo agregás, sale duplicado.
- **Fix implementado**: `buttonText: "Pagar"` (sin monto) en `course-enrollment-form.tsx`.

### Cargo en Culqi OK pero Supabase vacío
Revisar los logs de Vercel (o dev local):
- `Culqi fulfillment failed despite successful charge: ...` → error de DB. Comunes:
  - **"there is no unique or exclusion constraint matching the ON CONFLICT"** → falta el unique constraint en `payments.provider_payment_id`. Aplicar migration 005.
  - **"violates check constraint payments_payment_provider_check"** → `'culqi'` no está en el enum. Aplicar migration que lo agregue (ya está en `schema.sql` por defecto).
  - **"violates not-null constraint enrollment_id"** → `enrollment_id` aún es NOT NULL. Aplicar migration 004.

### Webhook devuelve 401 "Firma invalida"
- `CULQI_WEBHOOK_SECRET` en Vercel no coincide con el secret en CulqiPanel.
- **Fix**: copiar de nuevo el secret desde CulqiPanel → Webhooks → editar webhook → mostrar secret. Pegar en Vercel y redeploy.

### Webhook no llega
- URL del webhook configurada en CulqiPanel apunta a dominio incorrecto (test vs prod, viejo dominio Vercel, etc).
- Culqi Panel → Webhooks → revisar logs (Culqi muestra los últimos intentos).

---

## Decisiones técnicas

### Por qué `https://checkout.culqi.com/js/v4` y no `https://js.culqi.com/checkout-js`
Son **2 SDKs distintos** servidos por Culqi:

| SDK | URL | Global expuesta | API |
|---|---|---|---|
| Custom Checkout V4 (clásico) | `https://checkout.culqi.com/js/v4` | `window.Culqi` | `Culqi.publicKey = ...; Culqi.settings({...}); Culqi.open()` |
| Checkout JS (nuevo) | `https://js.culqi.com/checkout-js` | `window.CulqiCheckout` | `new CulqiCheckout(pk, config).open()` |

Nuestro código usa la API del primero. Más documentada y estable. Si Culqi deprecara la V4, habría que reescribir el form con la API constructor de la V2 nueva.

### Por qué el monto NUNCA viene del cliente
El frontend solo manda `courseId` (UUID). El backend resuelve el precio en `/api/payments/culqi/charge` haciendo `SELECT price FROM courses WHERE id = courseId`. Esto previene que un atacante manipule el precio en DevTools (cambiar `S/. 1200` por `S/. 1`).

### Por qué `amount` en DB es soles decimal pero Culqi usa céntimos
- `payments.amount numeric(10,2)` = soles decimal (350.00). Convención que ya tenía el schema antes de Culqi.
- Culqi API requiere céntimos enteros (35000). Standard de la industria (Stripe, etc).
- Conversión: `amountSoles = amountCents / 100` antes de insertar en `payments`.
- Si en el futuro se cambia el schema a céntimos, hay que migrar las filas viejas también.

### Por qué el fulfillment está en un helper compartido (`culqi-fulfillment.ts`)
2 puntos de entrada con la misma lógica de persistencia:
- `/api/payments/culqi/charge` (camino feliz síncrono)
- `/api/payments/culqi/webhook` (fallback async + refunds)

El helper centraliza el flow `lead → enrollment → payment → sync HubSpot/Brevo/email`. La idempotencia (`provider_payment_id` unique) garantiza que aunque ambos invoquen `fulfillSuccessfulCharge` con el mismo `chargeId`, solo el primero crea las filas.

### Por qué el flag `processing` en el closure y no un `useRef`
El callback `window.culqi` se asigna UNA vez en el `useEffect`. La variable del closure persiste entre invocaciones. Un `useRef` también funcionaría pero requiere `.current` en cada lectura. Closure es más compacto y suficiente.

### Encriptación RSA (Fase 2, opcional)
Culqi permite cifrar el body del POST `/v2/charges` con AES-256-GCM + clave AES envuelta en RSA-OAEP. Capa extra anti-MITM. **No implementada actualmente** porque:
- Auth `Bearer sk_*` ya autentica.
- HTTPS ya protege en tránsito.
- Solo agrega complejidad sin ventaja medible para nuestro caso.
- Si Culqi lo exige en el futuro, las env vars `CULQI_RSA_ID` y `CULQI_RSA_PUBLIC_KEY` ya están reservadas en `.env.example`.

---

## Cambios futuros sugeridos

- [ ] Activar encriptación RSA (Fase 2) si Culqi lo exige
- [ ] Configurar webhook en CulqiPanel cuando se pase a prod
- [ ] Dashboard admin para ver últimos cargos / refunds (consume `payments` en Supabase)
- [ ] Email customizado al cliente con la factura PDF (hoy solo es HTML inline)
- [ ] Soporte de cuotas (`installments: true` en Culqi options) si se ofrecen
- [ ] Limit-rate / anti-fraud rules en el endpoint `/charge` (rate por IP, por email, por courseId reciente)

---

Última actualización: 2026-06-29
