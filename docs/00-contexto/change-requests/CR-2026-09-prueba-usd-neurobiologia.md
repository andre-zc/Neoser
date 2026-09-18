# CR-2026-09 — Cobro interno en USD para Neurobiología

**Estado:** implementación local para QA; despliegue pendiente de aprobación operativa

**Solicitud:** titular del repositorio, 17/09/2026

## Objetivo

Verificar con una tarjeta real el checkout internacional en dólares del curso
Neurobiología del Parto, usando un importe mínimo y sin tocar la tarifa pública.

## Alcance técnico

- Ruta privada `/pruebas/pagos/neurobiologia-internacional`, protegida por la
  misma clave de acceso del laboratorio de Protocolos y excluida de indexación.
- Cargo exclusivo con tarjeta en USD por 3.00, mínimo publicado por CulqiOnline.
- Monto y moneda fijados en el servidor; la página no permite editarlos.
- Registro conciliable en `payments` con propósito propio, sin crear lead,
  matrícula, correos ni acceso académico.
- Confirmación propia de QA con referencia del cargo; no cuenta como venta en
  los reportes comerciales ni como evento de compra en GA4.

## Fuera de alcance

- No cambia el precio real del curso: S/ 300 o USD 75.
- No activa PayPal ni Yape en la prueba internacional.
- No crea una segunda aplicación ni nuevas variables de entorno.
- No modifica tablas ni ejecuta migraciones de Supabase.

## QA antes de desplegar

1. Confirmar que la ruta pide clave y no aparece en navegación/sitemap.
2. Confirmar que el checkout muestra solo tarjeta y USD 3.00.
3. Rechazar desde la API una solicitud en PEN para el producto de QA.
4. En modo `test`, completar el flujo sin débito y verificar la confirmación.
5. En modo `live`, tras la aprobación, comprobar en CulqiPanel el cargo real
   y su referencia; verificar que no haya matrícula, lead ni correos.
6. Confirmar que el cobro de QA se excluye del reporte comercial.

Fuente del mínimo: [Límites de transacción de CulqiOnline](https://docs.culqi.com/es/documentacion/pagos-online/limites-transaccion).
