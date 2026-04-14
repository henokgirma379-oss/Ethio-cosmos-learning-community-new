create table if not exists public.lesson_content_blocks (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  block_type text not null check (block_type in ('heading', 'text', 'image', 'list', 'video')),
  block_order integer not null default 0,
  text_content text,
  image_url text,
  heading_text text,
  list_items text[],
  video_url text,
  caption text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists lesson_content_blocks_lesson_id_idx on public.lesson_content_blocks(lesson_id);
create index if not exists lesson_content_blocks_order_idx on public.lesson_content_blocks(lesson_id, block_order);

alter table public.lesson_content_blocks enable row level security;

drop policy if exists "lesson_content_blocks_read" on public.lesson_content_blocks;
create policy "lesson_content_blocks_read" on public.lesson_content_blocks
  for select using (true);

drop policy if exists "lesson_content_blocks_write_admin" on public.lesson_content_blocks;
create policy "lesson_content_blocks_write_admin" on public.lesson_content_blocks
  for all using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  )
  with check (
    (select role from public.profiles where id = auth.uid()) = 'admin'
  );

-- Also add user_progress and bookmarks tables if not already present
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.user_progress enable row level security;

drop policy if exists "user_progress_read_own" on public.user_progress;
create policy "user_progress_read_own" on public.user_progress
  for select using (auth.uid() = user_id);

drop policy if exists "user_progress_insert_own" on public.user_progress;
create policy "user_progress_insert_own" on public.user_progress
  for insert with check (auth.uid() = user_id);

create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.bookmarks enable row level security;

drop policy if exists "bookmarks_read_own" on public.bookmarks;
create policy "bookmarks_read_own" on public.bookmarks
  for select using (auth.uid() = user_id);

drop policy if exists "bookmarks_insert_own" on public.bookmarks;
create policy "bookmarks_insert_own" on public.bookmarks
  for insert with check (auth.uid() = user_id);

drop policy if exists "bookmarks_delete_own" on public.bookmarks;
create policy "bookmarks_delete_own" on public.bookmarks
  for delete using (auth.uid() = user_id);
