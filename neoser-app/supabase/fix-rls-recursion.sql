-- ============================================================
-- FIX: Recursión infinita en políticas RLS
-- ============================================================
-- Causa: las políticas "Admin ..." consultaban public.profiles
-- para verificar el rol, lo cual disparaba la misma política
-- de profiles → bucle infinito.
--
-- Solución: usar una función SECURITY DEFINER que bypasea RLS
-- y consulta el rol directamente.
-- ============================================================

-- 1) Función auxiliar para verificar rol admin (bypass RLS)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- 2) Eliminar las políticas con recursión
drop policy if exists "Admin manage profiles"   on public.profiles;
drop policy if exists "Admin manage courses"    on public.courses;
drop policy if exists "Admin read all enrollments" on public.enrollments;
drop policy if exists "Admin read all payments" on public.payments;
drop policy if exists "Admin update payments"   on public.payments;
drop policy if exists "Admin read contact leads" on public.contact_leads;
drop policy if exists "Admin update contact leads" on public.contact_leads;
drop policy if exists "Admin manage lead notes" on public.lead_notes;
drop policy if exists "Admin read opt-outs"     on public.wa_opt_outs;
drop policy if exists "Admin read bookings"     on public.bookings;
drop policy if exists "Admin update bookings"   on public.bookings;
drop policy if exists "Admin read email events" on public.email_events;

-- 3) Recrear las políticas públicas de INSERT (en caso de que no se hayan aplicado)
drop policy if exists "Public create contact leads" on public.contact_leads;
drop policy if exists "Public create bookings"     on public.bookings;
drop policy if exists "Public read published courses" on public.courses;
drop policy if exists "Profiles own read"          on public.profiles;

create policy "Public create contact leads"  on public.contact_leads for insert to anon, authenticated with check (true);
create policy "Public create bookings"       on public.bookings      for insert to anon, authenticated with check (true);
create policy "Public read published courses" on public.courses      for select to anon, authenticated using (is_published = true);
create policy "Profiles own read"            on public.profiles      for select to authenticated using (auth.uid() = id);

-- 4) Recrear las políticas de admin usando is_admin()
create policy "Admin manage profiles"      on public.profiles      for all    using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage courses"       on public.courses       for all    using (public.is_admin()) with check (public.is_admin());
create policy "Admin read all enrollments" on public.enrollments   for select using (public.is_admin());
create policy "Admin read all payments"    on public.payments      for select using (public.is_admin());
create policy "Admin update payments"      on public.payments      for update using (public.is_admin()) with check (public.is_admin());
create policy "Admin read contact leads"   on public.contact_leads for select using (public.is_admin());
create policy "Admin update contact leads" on public.contact_leads for update using (public.is_admin()) with check (public.is_admin());
create policy "Admin manage lead notes"    on public.lead_notes    for all    using (public.is_admin()) with check (public.is_admin());
create policy "Admin read opt-outs"        on public.wa_opt_outs   for select using (public.is_admin());
create policy "Admin read bookings"        on public.bookings      for select using (public.is_admin());
create policy "Admin update bookings"      on public.bookings      for update using (public.is_admin()) with check (public.is_admin());
create policy "Admin read email events"    on public.email_events  for select using (public.is_admin());
