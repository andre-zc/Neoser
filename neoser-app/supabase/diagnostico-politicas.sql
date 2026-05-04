-- Lista todas las politicas de la tabla contact_leads para diagnostico
select
  policyname as nombre_politica,
  cmd as operacion,
  roles as roles_permitidos,
  qual as condicion_using,
  with_check as condicion_with_check
from pg_policies
where schemaname = 'public' and tablename = 'contact_leads';
