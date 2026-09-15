# Tablero NeoSer en Google Sheets

La plantilla `Tablero-reportes-NeoSer.xlsx` reúne cuatro fuentes:

- **Pagos:** Culqi y PayPal desde Supabase, sin información personal.
- **Tráfico:** GA4, exclusivamente para el hostname `neoser.pe`.
- **Campañas:** carga manual de ManyChat por mensaje o flujo.
- **Resumen:** indicadores y gráficos calculados desde las otras hojas.

## 1. Preparar producción

1. Ejecuta la migración `20260913120000_agrega_atribucion_reportes.sql` en Supabase.
2. Crea un token aleatorio de al menos 32 caracteres.
3. En DigitalOcean agrega `REPORTING_API_TOKEN` como secreto de **Run time**.
4. Confirma que `NEXT_PUBLIC_GA_ID=G-PV7SHRQEQ1` está definido durante build y runtime.
5. Despliega y comprueba que una llamada sin token a
   `https://neoser.pe/api/reports/commerce` responde `401`.

## 2. Importar el libro

1. Sube `Tablero-reportes-NeoSer.xlsx` a Google Drive.
2. Ábrelo con Google Sheets.
3. Ve a **Extensiones → Apps Script**.
4. Copia `Code.gs`; activa la vista del manifiesto y copia `appsscript.json`.

## 3. Guardar la configuración

En Apps Script abre **Configuración del proyecto → Propiedades del script** y crea:

| Propiedad | Valor |
|---|---|
| `NEOSER_REPORT_URL` | `https://neoser.pe/api/reports/commerce` |
| `NEOSER_REPORT_TOKEN` | el mismo secreto configurado en DigitalOcean |
| `GA4_PROPERTY_ID` | `393610749` |

No escribas el token en una celda. La primera ejecución pedirá permiso para leer
Google Analytics y editar el Sheet. La cuenta que autoriza debe tener acceso a
la propiedad GA4.

## 4. Operación

- Menú **NeoSer · Reportes → Actualizar todo** para una carga inmediata.
- **Crear actualización diaria** para refrescar a las 7 a. m. (Lima).
- Completa `Campañas` manualmente con las métricas exportadas de ManyChat.
- En PayPal, una intención aparecerá como `pending`. Solo contará como venta al
  cambiar el pago a `approved` después de verificarlo en PayPal.

## Seguridad

El endpoint no entrega nombres, correo, teléfono, DNI ni datos clínicos. La clave
de ManyChat no es necesaria en esta versión. Si una clave fue compartida en un
chat o captura, debe revocarse y reemplazarse antes de cualquier automatización.
