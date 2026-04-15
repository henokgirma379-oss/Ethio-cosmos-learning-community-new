-- Align admin authorization email, ensure homepage content records, and normalize quiz schema

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
    case when new.email = 'henokgirma379@gmail.com' then 'admin' else 'user' end
  )
  on conflict (id) do update
    set username = excluded.username,
        role = case when new.email = 'henokgirma379@gmail.com' then 'admin' else public.profiles.role end;

  return new;
end;
$$;

update public.profiles
set role = 'admin'
where id in (
  select id from auth.users where email = 'henokgirma379@gmail.com'
);

alter table public.quiz_questions
  add column if not exists lesson_id uuid references public.lessons(id) on delete set null,
  add column if not exists option_a text,
  add column if not exists option_b text,
  add column if not exists option_c text,
  add column if not exists option_d text,
  add column if not exists correct_option text check (correct_option in ('a', 'b', 'c', 'd')),
  add column if not exists explanation text,
  add column if not exists order_index integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

update public.quiz_questions
set
  option_a = coalesce(option_a, options->>0),
  option_b = coalesce(option_b, options->>1),
  option_c = coalesce(option_c, options->>2),
  option_d = coalesce(option_d, options->>3),
  correct_option = coalesce(
    correct_option,
    case correct_answer
      when options->>0 then 'a'
      when options->>1 then 'b'
      when options->>2 then 'c'
      when options->>3 then 'd'
      else null
    end
  ),
  order_index = case when order_index = 0 then row_number() over (partition by topic_id order by created_at, id) else order_index end,
  updated_at = now()
where option_a is null
   or option_b is null
   or option_c is null
   or option_d is null
   or correct_option is null
   or order_index = 0;

insert into public.page_content (page, section, content_type, content, image_url)
values
  ('home', 'hero-eyebrow', 'text', 'EthioCosmos Learning Community', null),
  ('home', 'hero-title', 'text', 'Explore the Universe with clarity, wonder, and community.', null),
  ('home', 'hero-subtitle', 'text', 'A welcoming astronomy learning platform built for curious minds across Ethiopia and beyond.', null),
  ('home', 'hero-intro', 'text', 'Learn astronomy through guided topics, practical materials, and a vibrant Ethiopian-centered learning journey built for curious minds.', null),
  ('home', 'hero-primary-cta-label', 'text', 'Start Learning', null),
  ('home', 'hero-primary-cta-path', 'text', '/learning', null),
  ('home', 'hero-secondary-cta-label', 'text', 'Browse Materials', null),
  ('home', 'hero-secondary-cta-path', 'text', '/materials', null),
  ('home', 'features-title', 'text', 'Why learners choose EthioCosmos', null),
  ('home', 'features-description', 'text', 'A clean learning experience first — ready for future visual theming without breaking structure.', null),
  ('home', 'featured-topics-title', 'text', 'Featured Topics', null),
  ('home', 'featured-topics-description', 'text', 'Start with three popular astronomy pathways designed for beginners and growing explorers.', null)
on conflict (page, section) do nothing;
