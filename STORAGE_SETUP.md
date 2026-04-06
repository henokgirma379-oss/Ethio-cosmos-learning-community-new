# Supabase Storage Setup

This project requires four storage buckets to be created manually in the Supabase Dashboard:

- `chat-images`
- `about-images`
- `materials`
- `avatars`

Go to **Supabase Dashboard → Storage → New bucket** and create each bucket with the public/private setting described below.

## 1) chat-images

- **Bucket name:** `chat-images`
- **Public:** Yes
- **Who can view:** Everyone
- **Who can upload:** Authenticated users
- **Who can update/delete:** Owner only

### Storage policy SQL
```sql
insert into storage.buckets (id, name, public)
values ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

drop policy if exists "chat_images_public_read" on storage.objects;
create policy "chat_images_public_read"
on storage.objects for select
using (bucket_id = 'chat-images');

drop policy if exists "chat_images_auth_upload" on storage.objects;
create policy "chat_images_auth_upload"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'chat-images'
  and auth.uid() is not null
);

drop policy if exists "chat_images_owner_update" on storage.objects;
create policy "chat_images_owner_update"
on storage.objects for update
to authenticated
using (bucket_id = 'chat-images' and owner = auth.uid())
with check (bucket_id = 'chat-images' and owner = auth.uid());

drop policy if exists "chat_images_owner_delete" on storage.objects;
create policy "chat_images_owner_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'chat-images' and owner = auth.uid());
```

## 2) about-images

- **Bucket name:** `about-images`
- **Public:** Yes
- **Who can view:** Everyone
- **Who can upload:** Admin only
- **Who can update/delete:** Admin only

### Storage policy SQL
```sql
insert into storage.buckets (id, name, public)
values ('about-images', 'about-images', true)
on conflict (id) do nothing;

drop policy if exists "about_images_public_read" on storage.objects;
create policy "about_images_public_read"
on storage.objects for select
using (bucket_id = 'about-images');

drop policy if exists "about_images_admin_insert" on storage.objects;
create policy "about_images_admin_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'about-images'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

drop policy if exists "about_images_admin_update" on storage.objects;
create policy "about_images_admin_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'about-images'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
)
with check (
  bucket_id = 'about-images'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

drop policy if exists "about_images_admin_delete" on storage.objects;
create policy "about_images_admin_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'about-images'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);
```

## 3) materials

- **Bucket name:** `materials`
- **Public:** Yes
- **Who can view:** Everyone
- **Who can upload:** Admin only
- **Who can update/delete:** Admin only

### Storage policy SQL
```sql
insert into storage.buckets (id, name, public)
values ('materials', 'materials', true)
on conflict (id) do nothing;

drop policy if exists "materials_public_read" on storage.objects;
create policy "materials_public_read"
on storage.objects for select
using (bucket_id = 'materials');

drop policy if exists "materials_admin_insert" on storage.objects;
create policy "materials_admin_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'materials'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

drop policy if exists "materials_admin_update" on storage.objects;
create policy "materials_admin_update"
on storage.objects for update
to authenticated
using (
  bucket_id = 'materials'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
)
with check (
  bucket_id = 'materials'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);

drop policy if exists "materials_admin_delete" on storage.objects;
create policy "materials_admin_delete"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'materials'
  and exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);
```

## 4) avatars

- **Bucket name:** `avatars`
- **Public:** Yes
- **Who can view:** Everyone
- **Who can upload:** Authenticated users
- **Who can update/delete:** Owner only

### Storage policy SQL
```sql
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
on storage.objects for select
using (bucket_id = 'avatars');

drop policy if exists "avatars_auth_insert" on storage.objects;
create policy "avatars_auth_insert"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and auth.uid() is not null
);

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update"
on storage.objects for update
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid())
with check (bucket_id = 'avatars' and owner = auth.uid());

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'avatars' and owner = auth.uid());
```

## Recommended manual setup checklist

1. Create each bucket in the dashboard.
2. Set **Public bucket** on for all four buckets above.
3. Run the SQL policies in the **SQL Editor**.
4. Verify uploads with:
   - a normal authenticated user for `chat-images` and `avatars`
   - an admin user for `about-images` and `materials`
5. Confirm public URLs load correctly for images, PDFs, and videos.
