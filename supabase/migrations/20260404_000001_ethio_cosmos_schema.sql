-- Ethio-Cosmos Learning Community schema and policies
-- Generated from project blueprint on 2026-04-04

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  content text,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.online_presence (
  id uuid references auth.users on delete cascade primary key,
  last_seen timestamptz default now()
);

create table if not exists public.topics (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  lesson_count int default 0,
  icon text,
  color_accent text,
  order_index int default 0,
  image_url text
);

create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.topics(id) on delete cascade,
  slug text not null,
  title text not null,
  content text,
  order_index int default 0,
  duration_minutes int default 10
);

create table if not exists public.page_content (
  id serial primary key,
  page text not null,
  section text not null,
  content_type text check (content_type in ('text', 'image')),
  content text,
  image_url text,
  updated_at timestamptz default now()
);

create table if not exists public.materials (
  id uuid default gen_random_uuid() primary key,
  type text check (type in ('image', 'video', 'pdf')),
  title text not null,
  url text not null,
  thumbnail_url text,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case when new.email = 'henokgirma648@gmail.com' then 'admin' else 'user' end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.messages enable row level security;
alter table public.online_presence enable row level security;
alter table public.page_content enable row level security;
alter table public.materials enable row level security;
alter table public.topics enable row level security;
alter table public.lessons enable row level security;

create unique index if not exists page_content_page_section_idx on public.page_content(page, section);

drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all" on public.profiles for select using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "messages_read" on public.messages;
create policy "messages_read" on public.messages for select using (true);

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages for insert with check (auth.uid() = user_id);

drop policy if exists "messages_delete" on public.messages;
create policy "messages_delete" on public.messages for delete using (
  auth.uid() = user_id or
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "presence_read" on public.online_presence;
create policy "presence_read" on public.online_presence for select using (true);

drop policy if exists "presence_upsert" on public.online_presence;
create policy "presence_upsert" on public.online_presence for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "content_read" on public.page_content;
create policy "content_read" on public.page_content for select using (true);

drop policy if exists "content_write" on public.page_content;
create policy "content_write" on public.page_content for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "materials_read" on public.materials;
create policy "materials_read" on public.materials for select using (true);

drop policy if exists "materials_write" on public.materials;
create policy "materials_write" on public.materials for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "topics_read" on public.topics;
create policy "topics_read" on public.topics for select using (true);

drop policy if exists "topics_write" on public.topics;
create policy "topics_write" on public.topics for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select using (true);

drop policy if exists "lessons_write" on public.lessons;
create policy "lessons_write" on public.lessons for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.user_progress enable row level security;

drop policy if exists "progress_read_own" on public.user_progress;
create policy "progress_read_own" on public.user_progress for select using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.user_progress;
create policy "progress_insert_own" on public.user_progress for insert with check (auth.uid() = user_id);

drop policy if exists "progress_delete_own" on public.user_progress;
create policy "progress_delete_own" on public.user_progress for delete using (auth.uid() = user_id);

create table if not exists public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid references public.topics(id) on delete cascade,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text check (correct_option in ('a','b','c','d')) not null,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  topic_id uuid references public.topics(id) on delete cascade,
  score int not null,
  total int not null,
  attempted_at timestamptz default now()
);

create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, lesson_id)
);

alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.bookmarks enable row level security;

drop policy if exists "quiz_questions_read" on public.quiz_questions;
create policy "quiz_questions_read" on public.quiz_questions for select using (true);

drop policy if exists "quiz_questions_write" on public.quiz_questions;
create policy "quiz_questions_write" on public.quiz_questions for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "quiz_attempts_own" on public.quiz_attempts;
create policy "quiz_attempts_own" on public.quiz_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "bookmarks_own" on public.bookmarks;
create policy "bookmarks_own" on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
