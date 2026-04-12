export interface Profile {
  id: string
  username: string | null
  avatar_url: string | null
  role: 'user' | 'admin'
  created_at: string
}

export interface Message {
  id: string
  user_id: string
  content: string | null
  image_url: string | null
  created_at: string
  profiles?: Profile
}

export interface Topic {
  id: string
  slug: string
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  lesson_count: number
  icon: string
  color_accent: string
  order_index: number
}

export interface Lesson {
  id: string
  topic_id: string
  slug: string
  title: string
  content: string
  order_index: number
  duration_minutes: number
}

export interface PageContent {
  id: number
  page: string
  section: string
  content_type: 'text' | 'image'
  content: string | null
  image_url: string | null
  updated_at: string
}

export interface Material {
  id: string
  type: 'image' | 'video' | 'pdf'
  title: string
  url: string
  thumbnail_url: string | null
  created_at: string
}

export interface OnlinePresence {
  id: string
  last_seen: string
}

export interface QuizQuestion {
  id: string
  topic_id: string
  lesson_id: string | null
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: 'a' | 'b' | 'c' | 'd'
  explanation: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  topic_id: string
  lesson_id: string | null
  score: number
  total: number
  percentage: number | null
  attempted_at: string
  created_at: string
}
