-- Allow public read of topics and lessons (currently missing from migration 1)
drop policy if exists "topics_read" on public.topics;
create policy "topics_read" on public.topics for select using (true);

drop policy if exists "topics_write_admin" on public.topics;
create policy "topics_write_admin" on public.topics for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select using (true);

drop policy if exists "lessons_write_admin" on public.lessons;
create policy "lessons_write_admin" on public.lessons for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "page_content_read" on public.page_content;
create policy "page_content_read" on public.page_content for select using (true);

drop policy if exists "page_content_write_admin" on public.page_content;
create policy "page_content_write_admin" on public.page_content for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "materials_read" on public.materials;
create policy "materials_read" on public.materials for select using (true);

drop policy if exists "materials_write_admin" on public.materials;
create policy "materials_write_admin" on public.materials for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

-- Presence upsert policy (currently missing)
drop policy if exists "presence_upsert_own" on public.online_presence;
create policy "presence_upsert_own" on public.online_presence
  for insert with check (auth.uid() = id);

drop policy if exists "presence_update_own" on public.online_presence;
create policy "presence_update_own" on public.online_presence
  for update using (auth.uid() = id);
