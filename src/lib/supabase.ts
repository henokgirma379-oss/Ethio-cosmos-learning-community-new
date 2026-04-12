import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const isValidHttpUrl = (value: string) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export const supabaseConfigError = !supabaseUrl || !supabaseKey
  ? 'Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  : !isValidHttpUrl(supabaseUrl)
    ? 'VITE_SUPABASE_URL is not a valid HTTP(S) URL.'
    : null

export const supabase = !supabaseConfigError
  ? createClient(supabaseUrl, supabaseKey)
  : null
