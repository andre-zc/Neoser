# CR-2026-10 — CRM operativo y análisis de campañas

**Estado:** aprobado para implementación local y QA

**Aprobación:** solicitud escrita de la propietaria del repositorio, 5/10/2026

**Responsable técnico:** equipo web NeoSer

## Objetivo

Simplificar el panel administrativo para que el equipo de NeoSer pueda revisar
todos los contactos, asociar varios cursos a una misma persona y analizar la
actividad comercial por rango de fechas sin depender del panel de Supabase.

## Alcance aprobado

- Reemplazar las etapas visibles `Contactado`, `Interesado` y `Perdido` por una
  vista operativa reducida: `Todos`, `Nuevos`, `Propuesta enviada` e `Inscritos`.
- Conservar los valores históricos en base de datos para no destruir trazabilidad.
- Mostrar el total general de contactos y una tabla única con todos los registros.
- Incorporar opciones `Todos` en los filtros de etapa, fuente y curso/interés.
- Corregir la navegación por fuente para que no quede combinada silenciosamente
  con un filtro de etapa anterior.
- Permitir que un contacto tenga varios cursos asociados y distinguir cada uno
  como `Interés` o `Inscrito`.
- Añadir una vista de campañas con rango de fechas, contactos, propuestas,
  inscritos, conversión y desgloses por fuente, UTM y curso.
- Mantener en Google Sheets el reporte financiero y de marketing completo:
  ingresos, GA4 y métricas manuales de ManyChat.

## Datos y seguridad

- La nueva relación curso-contacto solo es accesible para cuentas administradoras.
- No se envían datos personales a GA4 ni a la hoja de reportes.
- Los datos personales siguen almacenados en Supabase y protegidos por RLS.
- La migración debe ejecutarse en staging antes del despliegue de producción.

## Criterios de aceptación

1. `Todos` muestra la tabla completa sin filtros ocultos.
2. Seleccionar una fuente muestra contactos de esa fuente aunque antes hubiera
   una etapa seleccionada.
3. Un contacto puede mostrar y editar más de un curso.
4. La vista de campañas responde a las fechas elegidas y no cuenta registros
   fuera del rango.
5. Solo una cuenta con rol `admin` puede consultar o modificar asociaciones.
6. La interfaz funciona en escritorio y móvil y conserva exportación CSV,
   seguimientos y notas.
