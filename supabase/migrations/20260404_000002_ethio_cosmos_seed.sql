-- Ethio-Cosmos Learning Community seed data
-- Topics, starter lessons, and editable page content

insert into public.topics (slug, title, description, difficulty, lesson_count, icon, color_accent, order_index, image_url)
values
  ('fundamentals', 'Fundamentals of Astronomy', 'Core concepts of astronomy, observations, light, distance, and the structure of the sky.', 'Beginner', 12, '✨', '#00c8c8', 1, '/topic_fundamentals.svg'),
  ('ethiopia', 'Astronomy & Ethiopia', 'Explore Ethiopian astronomy heritage, indigenous knowledge, and African sky culture.', 'Beginner', 8, '🇪🇹', '#f5c542', 2, '/topic_ethiopia.svg'),
  ('solar-system', 'Solar System', 'Learn about the Sun, planets, moons, and the dynamic structure of our home system.', 'Beginner', 15, '☀️', '#00c8c8', 3, '/topic_solar_system.svg'),
  ('planets', 'Planets', 'A deeper dive into rocky worlds, gas giants, atmospheres, and planetary science.', 'Beginner', 10, '🪐', '#00c8c8', 4, '/topic_planets.svg'),
  ('moon', 'Moon', 'Understand lunar phases, eclipses, the lunar surface, and the Moon''s effect on Earth.', 'Beginner', 9, '🌙', '#f5c542', 5, '/topic_moon.svg'),
  ('stars', 'Stars', 'Stellar birth, fusion, classification, and the life cycles of stars across the cosmos.', 'Intermediate', 14, '⭐', '#f5c542', 6, '/topic_stars.svg'),
  ('black-holes', 'Black Holes', 'Gravity, spacetime, singularities, event horizons, and the science of the invisible.', 'Advanced', 11, '🕳️', '#7c5cbf', 7, '/topic_black_holes.svg'),
  ('wormholes', 'Wormholes', 'Investigate theoretical tunnels through spacetime and the mathematics behind them.', 'Advanced', 7, '🌀', '#7c5cbf', 8, '/topic_wormholes.svg'),
  ('nebulae', 'Nebulae', 'Discover stellar nurseries, gas clouds, supernova remnants, and cosmic color.', 'Intermediate', 10, '🌌', '#f5c542', 9, '/topic_nebulae.svg'),
  ('asteroids', 'Asteroids', 'Understand minor bodies, asteroid belts, near-Earth objects, and orbital dynamics.', 'Intermediate', 8, '☄️', '#f5c542', 10, '/topic_asteroids.svg')
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  lesson_count = excluded.lesson_count,
  icon = excluded.icon,
  color_accent = excluded.color_accent,
  order_index = excluded.order_index,
  image_url = excluded.image_url;

with topic_map as (
  select id, slug, title from public.topics
), lesson_seed as (
  select
    topic_map.id as topic_id,
    'introduction'::text as slug,
    'Introduction to ' || topic_map.title as title,
    '# Introduction to ' || topic_map.title || E'\n\nThis opening lesson introduces the key ideas, concepts, and observation habits behind the topic.' as content,
    1 as order_index,
    10 as duration_minutes
  from topic_map
  union all
  select
    topic_map.id as topic_id,
    'observation-and-application'::text as slug,
    topic_map.title || ': Observation & Application' as title,
    '# ' || topic_map.title || E': Observation & Application\n\nThis lesson connects theory to observation, interpretation, and practical learning activities.' as content,
    2 as order_index,
    14 as duration_minutes
  from topic_map
)
insert into public.lessons (topic_id, slug, title, content, order_index, duration_minutes)
select topic_id, slug, title, content, order_index, duration_minutes
from lesson_seed
where not exists (
  select 1 from public.lessons l
  where l.topic_id = lesson_seed.topic_id and l.slug = lesson_seed.slug
);

insert into public.page_content (page, section, content_type, content, image_url)
values
  ('about', 'mission', 'text', 'Ethio-Cosmos exists to inspire curiosity, grow astronomical literacy, and make high-quality space education accessible to Ethiopian and African learners.', null),
  ('about', 'who-we-are', 'text', 'We are a learning-centered astronomy community bringing together students, educators, hobbyists, and explorers from across Africa.', null)
on conflict do nothing;
