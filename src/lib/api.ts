import { fallbackAboutContent, fallbackLessons, fallbackMaterials, fallbackTopics, fallbackArticles, fallbackScientists, fallbackResources } from '../data/fallbackData'
import type { Lesson, Material, Message, PageContent, Profile, QuizAttempt, QuizQuestion, Topic, Article, Scientist, Resource } from '../types'
import { supabase, supabaseConfigError } from './supabase'

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

const missingTables = new Set<string>()
const missingBuckets = new Set<string>()

const logSupabaseError = (context: string, error: unknown, options?: { allowFallback?: boolean; table?: string; bucket?: string }) => {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown Supabase error'

  if (options?.table && /relation .* does not exist|Could not find the table|schema cache/i.test(message)) {
    missingTables.add(options.table)
  }

  if (options?.bucket && /bucket|storage/i.test(message)) {
    missingBuckets.add(options.bucket)
  }

  console.error(`[Supabase:${context}] ${message}`)

  if (options?.allowFallback) {
    return
  }
}

export function getSupabaseStatusMessage() {
  if (supabaseConfigError) return supabaseConfigError
  if (missingTables.size) return `Supabase is missing required tables: ${Array.from(missingTables).join(', ')}.`
  if (missingBuckets.size) return `Supabase storage bucket issue detected: ${Array.from(missingBuckets).join(', ')}.`
  return null
}

export async function getTopics(): Promise<Topic[]> {
  if (!supabase) {
    await wait()
    return [...fallbackTopics].sort((a, b) => a.order_index - b.order_index)
  }

  const { data, error } = await supabase.from('topics').select('*').order('order_index')
  if (error || !data?.length) {
    if (error) logSupabaseError('getTopics', error, { allowFallback: true, table: 'topics' })
    return [...fallbackTopics].sort((a, b) => a.order_index - b.order_index)
  }
  return data as Topic[]
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  if (!supabase) {
    await wait()
    return fallbackTopics.find((topic) => topic.slug === slug) ?? null
  }

  const { data, error } = await supabase.from('topics').select('*').eq('slug', slug).single()
  if (error) logSupabaseError('getTopicBySlug', error, { allowFallback: true, table: 'topics' })
  return (data as Topic | null) ?? fallbackTopics.find((topic) => topic.slug === slug) ?? null
}

export async function getLessonsByTopicId(topicId: string): Promise<Lesson[]> {
  if (!supabase) {
    await wait()
    return fallbackLessons.filter((lesson) => lesson.topic_id === topicId).sort((a, b) => a.order_index - b.order_index)
  }

  const { data, error } = await supabase.from('lessons').select('*').eq('topic_id', topicId).order('order_index')
  if (error || !data?.length) {
    if (error) logSupabaseError('getLessonsByTopicId', error, { allowFallback: true, table: 'lessons' })
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

  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', 'about')
    .eq('section', section)
    .order('id')

  if (error) logSupabaseError('getAboutContent', error, { allowFallback: true, table: 'page_content' })
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
  const { data, error } = await query
  if (error) logSupabaseError('getMaterials', error, { allowFallback: true, table: 'materials' })
  const materials = (data as Material[] | null) ?? []
  if (!materials.length) return type ? fallbackMaterials.filter((item) => item.type === type) : fallbackMaterials
  return materials
}

export async function getRecentMessages(): Promise<Message[]> {
  if (!supabase) {
    await wait()
    return []
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*, profiles(username, avatar_url, role, created_at, id)')
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) logSupabaseError('getRecentMessages', error, { allowFallback: true, table: 'messages' })
  return (data as Message[] | null) ?? []
}

export async function getOnlineProfiles(): Promise<Profile[]> {
  if (!supabase) {
    await wait()
    return []
  }

  const since = new Date(Date.now() - 2 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('online_presence')
    .select('profiles(id, username, avatar_url, role, created_at)')
    .gt('last_seen', since)

  if (error) logSupabaseError('getOnlineProfiles', error, { allowFallback: true, table: 'online_presence' })
  const rows = (data ?? []) as Array<{ profiles: Profile[] | null }>
  return rows.flatMap((entry) => entry.profiles ?? [])
}

export async function getCompletedLessonIds(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('user_progress')
    .select('lesson_id')
    .eq('user_id', userId)
  if (error) {
    logSupabaseError('getCompletedLessonIds', error, { allowFallback: true, table: 'user_progress' })
    return []
  }
  return (data ?? []).map((row: { lesson_id: string }) => row.lesson_id)
}

export async function markLessonComplete(userId: string, lessonId: string): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, lesson_id: lessonId })

  if (error) throw new Error(`Unable to save lesson progress: ${error.message}`)
}

export async function getCompletedLessonCount(userId: string): Promise<number> {
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('user_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  if (error) {
    logSupabaseError('getCompletedLessonCount', error, { allowFallback: true, table: 'user_progress' })
    return 0
  }
  return count ?? 0
}

export async function getQuizQuestions(topicId: string): Promise<QuizQuestion[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('topic_id', topicId)
    .order('order_index')
  if (error) {
    logSupabaseError('getQuizQuestions', error, { allowFallback: true, table: 'quiz_questions' })
    return []
  }
  return (data as QuizQuestion[] | null) ?? []
}

export async function getQuizAttempt(userId: string, topicId: string): Promise<QuizAttempt | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .order('attempted_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) {
    logSupabaseError('getQuizAttempt', error, { allowFallback: true, table: 'quiz_attempts' })
    return null
  }
  return (data as QuizAttempt | null) ?? null
}

export async function saveQuizAttempt(
  userId: string,
  topicId: string,
  score: number,
  total: number,
): Promise<void> {
  if (!supabase) return
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const { error } = await supabase.from('quiz_attempts').insert({
    user_id: userId,
    topic_id: topicId,
    lesson_id: null,
    score,
    total,
    percentage,
  })

  if (error) throw new Error(`Unable to save quiz attempt: ${error.message}`)
}

export async function getQuizQuestionCount(topicId: string): Promise<number> {
  if (!supabase) return 0
  const { count, error } = await supabase
    .from('quiz_questions')
    .select('*', { count: 'exact', head: true })
    .eq('topic_id', topicId)
  if (error) {
    logSupabaseError('getQuizQuestionCount', error, { allowFallback: true, table: 'quiz_questions' })
    return 0
  }
  return count ?? 0
}

export async function getArticles(): Promise<Article[]> {
  if (!supabase) {
    await wait()
    return fallbackArticles
  }

  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
  if (error) logSupabaseError('getArticles', error, { allowFallback: true, table: 'articles' })
  const articles = (data as Article[] | null) ?? []
  return articles.length ? articles : fallbackArticles
}

export async function getScientists(): Promise<Scientist[]> {
  if (!supabase) {
    await wait()
    return fallbackScientists
  }

  const { data, error } = await supabase.from('scientists').select('*').order('order_index')
  if (error) logSupabaseError('getScientists', error, { allowFallback: true, table: 'scientists' })
  const scientists = (data as Scientist[] | null) ?? []
  return scientists.length ? scientists : fallbackScientists
}

export async function getResources(): Promise<Resource[]> {
  if (!supabase) {
    await wait()
    return fallbackResources
  }

  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
  if (error) logSupabaseError('getResources', error, { allowFallback: true, table: 'resources' })
  const resources = (data as Resource[] | null) ?? []
  return resources.length ? resources : fallbackResources
}

export async function getBookmarkedLessonIds(userId: string): Promise<string[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('bookmarks')
    .select('lesson_id')
    .eq('user_id', userId)
  return (data ?? []).map((row: { lesson_id: string }) => row.lesson_id)
}

export async function addBookmark(userId: string, lessonId: string): Promise<void> {
  if (!supabase) return
  await supabase.from('bookmarks').upsert({ user_id: userId, lesson_id: lessonId })
}

export async function removeBookmark(userId: string, lessonId: string): Promise<void> {
  if (!supabase) return
  await supabase
    .from('bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
}

export async function getBookmarkedLessons(userId: string): Promise<Lesson[]> {
  if (!supabase) return []
  const { data } = await supabase
    .from('bookmarks')
    .select('lesson_id, lessons(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (!data) return []
  return (data as Array<{ lessons: Lesson | Lesson[] | null }>)
    .map((row) => (Array.isArray(row.lessons) ? row.lessons[0] ?? null : row.lessons))
    .filter((lesson): lesson is Lesson => lesson !== null)
}
