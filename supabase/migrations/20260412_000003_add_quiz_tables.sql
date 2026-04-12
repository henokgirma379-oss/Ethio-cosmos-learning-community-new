-- Add quiz tables aligned with topics and lessons

create table if not exists public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  topic_id uuid not null references public.topics(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option text not null check (correct_option in ('a', 'b', 'c', 'd')),
  explanation text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  score integer not null check (score >= 0),
  total integer not null check (total > 0),
  percentage integer generated always as ((score * 100) / nullif(total, 0)) stored,
  attempted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists quiz_questions_topic_id_idx on public.quiz_questions(topic_id);
create index if not exists quiz_questions_lesson_id_idx on public.quiz_questions(lesson_id);
create unique index if not exists quiz_questions_topic_order_idx on public.quiz_questions(topic_id, order_index);
create index if not exists quiz_attempts_user_topic_attempted_at_idx on public.quiz_attempts(user_id, topic_id, attempted_at desc);
create index if not exists quiz_attempts_lesson_id_idx on public.quiz_attempts(lesson_id);

create or replace function public.set_quiz_question_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_quiz_question_updated_at on public.quiz_questions;
create trigger set_quiz_question_updated_at
before update on public.quiz_questions
for each row execute procedure public.set_quiz_question_updated_at();

alter table public.quiz_questions enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "quiz_questions_read" on public.quiz_questions;
create policy "quiz_questions_read" on public.quiz_questions for select using (true);

drop policy if exists "quiz_questions_write" on public.quiz_questions;
create policy "quiz_questions_write" on public.quiz_questions for all using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
) with check (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);

drop policy if exists "quiz_attempts_read_own" on public.quiz_attempts;
create policy "quiz_attempts_read_own" on public.quiz_attempts for select using (auth.uid() = user_id);

drop policy if exists "quiz_attempts_insert_own" on public.quiz_attempts;
create policy "quiz_attempts_insert_own" on public.quiz_attempts for insert with check (auth.uid() = user_id);

drop policy if exists "quiz_attempts_delete_admin" on public.quiz_attempts;
create policy "quiz_attempts_delete_admin" on public.quiz_attempts for delete using (
  (select role from public.profiles where id = auth.uid()) = 'admin'
);
