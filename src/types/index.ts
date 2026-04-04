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
