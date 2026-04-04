export const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
] as const

export const deploymentChecklist = [
  'Create a Supabase project and copy the project URL and anon key.',
  'Run the SQL migrations in supabase/migrations in order.',
  'Create public storage buckets: chat-images, about-images, materials, avatars.',
  'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.',
  'Deploy using the Vite framework preset with output directory dist.',
  'Set the Supabase Site URL and Redirect URLs to your Vercel production domain.',
]
