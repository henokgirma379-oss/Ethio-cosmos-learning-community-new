import { fallbackAboutContent, fallbackLessons, fallbackMaterials, fallbackTopics } from '../data/fallbackData'
import type { Lesson, Material, Message, PageContent, Profile, QuizAttempt, QuizQuestion, Topic } from '../types'
import { supabase } from './supabase'

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getTopics(): Promise<Topic[]> {
  if (!supabase) {
    await wait()
    return [...fallbackTopics].sort((a, b) => a.order_index - b.order_index)
  }

  const { data, error } = await supabase.from('topics').select('*').order('order_index')
  if (error || !data?.length) return [...fallbackTopics].sort((a, b) => a.order_index - b.order_index)
  return data as Topic[]
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  if (!supabase) {
    await wait()
    return fallbackTopics.find((topic) => topic.slug === slug) ?? null
  }

  const { data } = await supabase.from('topics').select('*').eq('slug', slug).single()
  return (data as Topic | null) ?? fallbackTopics.find((topic) => topic.slug === slug) ?? null
}

export async function getLessonsByTopicId(topicId: string): Promise<Lesson[]> {
  if (!supabase) {
    await wait()
    return fallbackLessons.filter((lesson) => lesson.topic_id === topicId).sort((a, b) => a.order_index - b.order_index)
  }

  const { data, error } = await supabase.from('lessons').select('*').eq('topic_id', topicId).order('order_index')
  if (error || !data?.length) {
    return fallbackLessons.filter((lesson) => lesson.topic_id === topicId).sort((a, b) => a.order_index - b.order_index)
  }
  return data as Lesson[]
}

export async function getLessonBySlugs(topicSlug: string, lessonSlug: string): Promise<{ topic: Topic | null; lesson: Lesson | null; lessons: Lesson[] }> {
  const topic = await getTopicBySlug(topicSlug)
  if (!topic) return { topic: null, lesson: null, lessons: [] }
  const lessons = await getLessonsByTopicId(topic.id)
  const lesson = lessons.find((item) => item.slug === lessonSlug) ?? null
  return { topic, lesson, lessons }
}

export async function getAboutContent(section: string): Promise<PageContent[]> {
  if (!supabase) {
    await wait()
    return fallbackAboutContent[section] ?? []
  }

  const { data } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'about')
    .eq('section', section)
    .order('id')

  const pageContent = (data as PageContent[] | null) ?? []
  return pageContent.length ? pageContent : fallbackAboutContent[section] ?? []
}

export async function getMaterials(type?: Material['type']): Promise<Material[]> {
  if (!supabase) {
    await wait()
    return type ? fallbackMaterials.filter((item) => item.type === type) : fallbackMaterials
  }

  let query = supabase.from('materials').select('*').order('created_at', { ascending: false })
  if (type) query = query.eq('type', type)
  const { data } = await query
  const materials = (data as Material[] | null) ?? []
  if (!materials.length) return type ? fallbackMaterials.filter((item) => item.type === type) : fallbackMaterials
  return materials
}

export async function getRecentMessages(): Promise<Message[]> {
  if (!supabase) {
    await wait()
    return []
  }

  const { data } = await supabase
    .from('messages')
    .select('*, profiles(username, avatar_url, role, created_at, id)')
    .order('created_at', { ascending: true })
    .limit(100)

  return (data as Message[] | null) ?? []
}

export async function getOnlineProfiles(): Promise<Profile[]> {
  if (!supabase) {
    await wait()
    return []
  }

  const since = new Date(Date.now() - 2 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('online_presence')
    .select('profiles(id, username, avatar_url, role, created_at)')
    .gt('last_seen', since)

  const rows = (data ?? []) as Array<{ profiles: Profile[] | null }>
  return rows.flatMap((entry) => entry.profiles ?? [])
}

export async function getCompletedLessonIds(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', userId)
  return (data ?? []).map((row: { lesson_id: string }) => row.lesson_id)
}

export async function markLessonComplete(userId: string, lessonId: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('user_progress')
    .upsert({ user_id: userId, lesson_id: lessonId })
}

export async function getCompletedLessonCount(userId: string): Promise<number> {
  if (!supabase) return 0
  const { count } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  return count ?? 0
}

export async function getQuizQuestions(topicId: string): Promise<QuizQuestion[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('topic_id', topicId)
    .order('order_index')
  return (data as QuizQuestion[] | null) ?? []
}

export async function getQuizAttempt(userId: string, topicId: string): Promise<QuizAttempt | null> {
  if (!supabase) return null
  const { data } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .order('attempted_at', { ascending: false })
    .limit(1)
    .single()
  return (data as QuizAttempt | null) ?? null
}

export async function saveQuizAttempt(
  userId: string,
  topicId: string,
  score: number,
  total: number,
): Promise<void> {
  if (!supabase) return
  await supabase.from('quiz_attempts').insert({ user_id: userId, topic_id: topicId, score, total })
}

export async function getQuizQuestionCount(topicId: string): Promise<number> {
  if (!supabase) return 0
  const { count } = await supabase
    .from('quiz_questions')
    .select('*', { count: 'exact', head: true })
    .eq('topic_id', topicId)
  return count ?? 0
}
