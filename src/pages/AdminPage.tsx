import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import StarField from '../components/StarField'
import { useAuth } from '../context/AuthContext'
import { fallbackTopics } from '../data/fallbackData'
import {
  deleteLessonContentBlock,
  getHomeContentRows,
  getLessonContentBlocks,
  getQuizQuestions,
  getSupabaseStatusMessage,
  reorderLessonContentBlocks,
  reorderQuizQuestions,
  upsertLessonContentBlock,
} from '../lib/api'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import { fallbackHomeContent, HOME_CONTENT_SECTIONS, mapHomeContentRows, type HomeContentValues } from '../lib/homeContent'
import { supabase, supabaseConfigError } from '../lib/supabase'
import type { Lesson, LessonContentBlock, Material, Message, PageContent, QuizQuestion, Topic } from '../types'

const tabs = ['Homepage Content', 'About Page Content', 'Materials Manager', 'Chat Moderation', 'Topic Manager', 'Quiz Manager'] as const

type AdminTab = (typeof tabs)[number]
type MaterialType = 'image' | 'video' | 'pdf'
type ModerationMessage = Message & { profiles?: { username?: string | null } | null }
type UploadBucket = 'materials'
type QuizOptionKey = 'a' | 'b' | 'c' | 'd'

type QuizEditorState = {
  id: string | null
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: QuizOptionKey
  explanation: string
}

const missionFallback = 'Update mission text here...'
const whoWeAreFallback = 'Update who-we-are content here...'

const emptyQuizEditorState: QuizEditorState = {
  id: null,
  question: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_option: 'a',
  explanation: '',
}

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('Homepage Content')
  const [loginOpen, setLoginOpen] = useState(false)
  const [missionText, setMissionText] = useState(missionFallback)
  const [whoWeAreText, setWhoWeAreText] = useState(whoWeAreFallback)
  const [homeForm, setHomeForm] = useState<HomeContentValues>(fallbackHomeContent)
  const [topics, setTopics] = useState<Topic[]>(fallbackTopics)
  const [selectedTopic, setSelectedTopic] = useState(fallbackTopics[0]?.slug ?? 'fundamentals')
  const [topicTitle, setTopicTitle] = useState(fallbackTopics[0]?.title ?? '')
  const [topicDescription, setTopicDescription] = useState(fallbackTopics[0]?.description ?? '')
  const [topicDifficulty, setTopicDifficulty] = useState<Topic['difficulty']>(fallbackTopics[0]?.difficulty ?? 'Beginner')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLessonId, setSelectedLessonId] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonContent, setLessonContent] = useState('')
  const [showLessonEditor, setShowLessonEditor] = useState(false)
  const [showNewTopicForm, setShowNewTopicForm] = useState(false)
  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newTopicDescription, setNewTopicDescription] = useState('')
  const [newTopicDifficulty, setNewTopicDifficulty] = useState<Topic['difficulty']>('Beginner')
  const [newTopicIcon, setNewTopicIcon] = useState('✨')
  const [showNewLessonForm, setShowNewLessonForm] = useState(false)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonContent, setNewLessonContent] = useState('')
  const [newLessonDuration, setNewLessonDuration] = useState(10)
  const [moderationMessages, setModerationMessages] = useState<ModerationMessage[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const pdfInputRef = useRef<HTMLInputElement | null>(null)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [quizEditor, setQuizEditor] = useState<QuizEditorState>(emptyQuizEditorState)
  const [quizValidationErrors, setQuizValidationErrors] = useState<string[]>([])
  const [adminStatusMessage, setAdminStatusMessage] = useState<string | null>(supabaseConfigError)
  const [contentBlocks, setContentBlocks] = useState<LessonContentBlock[]>([])
  const [showBlockEditor, setShowBlockEditor] = useState(false)
  const [newBlockType, setNewBlockType] = useState<LessonContentBlock['block_type']>('text')
  const [newBlockText, setNewBlockText] = useState('')
  const [newBlockHeading, setNewBlockHeading] = useState('')
  const [newBlockImageUrl, setNewBlockImageUrl] = useState('')
  const [newBlockCaption, setNewBlockCaption] = useState('')
  const [newBlockVideoUrl, setNewBlockVideoUrl] = useState('')
  const [newBlockListItems, setNewBlockListItems] = useState('')
  const blockImageInputRef = useRef<HTMLInputElement | null>(null)

  const currentTopic = useMemo(
    () => topics.find((topic) => topic.slug === selectedTopic) ?? topics[0] ?? fallbackTopics[0],
    [topics, selectedTopic],
  )

  const selectedLesson = useMemo(
    () => lessons.find((item) => item.id === selectedLessonId) ?? lessons[0] ?? null,
    [lessons, selectedLessonId],
  )

  const generateSlug = (title: string): string =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

  const handleQuizEditorChange = <K extends keyof QuizEditorState>(field: K, value: QuizEditorState[K]) => {
    setQuizEditor((prev) => ({ ...prev, [field]: value }))
  }

  const resetQuizEditor = () => {
    setQuizEditor(emptyQuizEditorState)
    setQuizValidationErrors([])
  }

  const validateQuizEditor = () => {
    const errors: string[] = []

    if (!quizEditor.question.trim()) errors.push('Question text is required.')

    const optionValues = [quizEditor.option_a, quizEditor.option_b, quizEditor.option_c, quizEditor.option_d].map((value) => value.trim())
    if (optionValues.some((value) => !value)) errors.push('All four answer options are required.')

    const uniqueOptions = new Set(optionValues.filter(Boolean).map((value) => value.toLowerCase()))
    if (uniqueOptions.size !== optionValues.filter(Boolean).length) errors.push('Answer options must be unique.')

    setQuizValidationErrors(errors)
    return errors.length === 0
  }

  useEffect(() => {
    const loadInitialData = async () => {
      if (!supabase) {
        setAdminStatusMessage(supabaseConfigError)
        return
      }

      const [
        { data: topicsData, error: topicsError },
        { data: missionData, error: missionError },
        { data: whoWeAreData, error: whoError },
        homeRows,
      ] = await Promise.all([
        supabase.from('topics').select('*').order('order_index'),
        supabase.from('page_content').select('*').eq('page', 'about').eq('section', 'mission').order('updated_at', { ascending: false }).limit(1),
        supabase.from('page_content').select('*').eq('page', 'about').eq('section', 'who-we-are').order('updated_at', { ascending: false }).limit(1),
        getHomeContentRows(),
      ])

      const initialError = topicsError ?? missionError ?? whoError
      if (initialError) {
        setAdminStatusMessage(initialError.message)
      } else {
        setAdminStatusMessage(getSupabaseStatusMessage())
      }

      const liveTopics = (topicsData as Topic[] | null) ?? []
      if (liveTopics.length) {
        setTopics(liveTopics)
        setSelectedTopic((current) => (liveTopics.some((topic) => topic.slug === current) ? current : liveTopics[0]?.slug ?? current))
      }

      const missionRow = (missionData as PageContent[] | null)?.[0]
      const whoWeAreRow = (whoWeAreData as PageContent[] | null)?.[0]

      if (missionRow?.content) setMissionText(missionRow.content)
      if (whoWeAreRow?.content) setWhoWeAreText(whoWeAreRow.content)
      setHomeForm(mapHomeContentRows(homeRows))
    }

    void loadInitialData()
  }, [])

  useEffect(() => {
    if (!currentTopic) return
    setTopicTitle(currentTopic.title)
    setTopicDescription(currentTopic.description ?? '')
    setTopicDifficulty(currentTopic.difficulty)
  }, [currentTopic])

  useEffect(() => {
    const loadLessons = async () => {
      if (!currentTopic || !supabase) {
        setLessons([])
        setSelectedLessonId('')
        return
      }

      const { data, error } = await supabase.from('lessons').select('*').eq('topic_id', currentTopic.id).order('order_index')
      if (error) {
        handleSupabaseError(error, 'Unable to load lessons.')
        return
      }

      const nextLessons = (data as Lesson[] | null) ?? []
      setLessons(nextLessons)
      setSelectedLessonId((current) => (nextLessons.some((item) => item.id === current) ? current : nextLessons[0]?.id ?? ''))
    }

    if (activeTab === 'Topic Manager') void loadLessons()
  }, [activeTab, currentTopic])

  useEffect(() => {
    if (!selectedLesson) {
      setLessonTitle('')
      setLessonContent('')
      return
    }
    setLessonTitle(selectedLesson.title)
    setLessonContent(selectedLesson.content ?? '')
  }, [selectedLesson])

  useEffect(() => {
    const loadModerationMessages = async () => {
      if (!supabase) {
        setModerationMessages([])
        return
      }
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) {
        handleSupabaseError(error, 'Unable to load moderation messages.')
        return
      }
      setModerationMessages((data as ModerationMessage[] | null) ?? [])
    }
    if (activeTab === 'Chat Moderation') void loadModerationMessages()
  }, [activeTab])

  useEffect(() => {
    const loadMaterials = async () => {
      if (!supabase) {
        setMaterials([])
        return
      }
      const { data, error } = await supabase.from('materials').select('*').order('created_at', { ascending: false })
      if (error) {
        handleSupabaseError(error, 'Unable to load materials.')
        return
      }
      setMaterials((data as Material[] | null) ?? [])
    }
    if (activeTab === 'Materials Manager') void loadMaterials()
  }, [activeTab])

  useEffect(() => {
    const loadQuizManagerQuestions = async () => {
      if (!currentTopic) {
        setQuizQuestions([])
        resetQuizEditor()
        return
      }

      const nextQuestions = await getQuizQuestions(currentTopic.id)
      setQuizQuestions(nextQuestions)
      resetQuizEditor()
    }

    if (activeTab === 'Quiz Manager') void loadQuizManagerQuestions()
  }, [activeTab, currentTopic])

  useEffect(() => {
    const loadBlocks = async () => {
      if (!selectedLesson || !supabase) {
        setContentBlocks([])
        return
      }
      const blocks = await getLessonContentBlocks(selectedLesson.id)
      setContentBlocks(blocks)
    }
    void loadBlocks()
  }, [selectedLesson])

  const requireSupabaseWrite = () => {
    if (supabase) return true
    const message = supabaseConfigError ?? 'Connect Supabase to enable admin writes.'
    setAdminStatusMessage(message)
    toast.error(message)
    return false
  }

  const handleSupabaseError = (error: unknown, fallbackMessage: string, options?: { bucket?: UploadBucket }) => {
    const message = error instanceof Error ? error.message : fallbackMessage
    const bucketNotice = options?.bucket && /bucket|storage/i.test(message)
      ? ` Check the "${options.bucket}" storage bucket configuration and permissions.`
      : ''
    const finalMessage = `${message}${bucketNotice}`
    setAdminStatusMessage(finalMessage)
    toast.error(finalMessage)
  }

  const saveAboutSection = async (section: 'mission' | 'who-we-are', content: string, successMessage: string) => {
    if (!requireSupabaseWrite() || !supabase) return

    const { error } = await supabase
      .from('page_content')
      .upsert(
        { page: 'about', section, content_type: 'text', content, image_url: null, updated_at: new Date().toISOString() },
        { onConflict: 'page,section' },
      )

    if (error) {
      handleSupabaseError(error, 'Unable to save page content.')
      return
    }
    setAdminStatusMessage(getSupabaseStatusMessage())
    toast.success(successMessage)
  }

  const saveHomepageContent = async () => {
    if (!requireSupabaseWrite() || !supabase) return

    const rows = Object.entries(HOME_CONTENT_SECTIONS).map(([key, section]) => ({
      page: 'home',
      section,
      content_type: 'text' as const,
      content: homeForm[key as keyof HomeContentValues],
      image_url: null,
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase.from('page_content').upsert(rows, { onConflict: 'page,section' })
    if (error) {
      handleSupabaseError(error, 'Unable to save homepage content.')
      return
    }

    setAdminStatusMessage(getSupabaseStatusMessage())
    toast.success('Homepage content saved.')
  }

  const handleSaveTopic = async () => {
    if (!currentTopic || !requireSupabaseWrite() || !supabase) return

    const { error } = await supabase
      .from('topics')
      .update({ title: topicTitle, description: topicDescription, difficulty: topicDifficulty })
      .eq('id', currentTopic.id)

    if (error) {
      handleSupabaseError(error, 'Unable to save topic.')
      return
    }
    setAdminStatusMessage(getSupabaseStatusMessage())
    setTopics((prev) => prev.map((topic) => (topic.id === currentTopic.id ? { ...topic, title: topicTitle, description: topicDescription, difficulty: topicDifficulty } : topic)))
    toast.success('Topic saved.')
  }

  const handleAddTopic = async () => {
    if (!newTopicTitle.trim()) {
      toast.error('Topic title is required.')
      return
    }
    if (!newTopicDescription.trim()) {
      toast.error('Topic description is required.')
      return
    }
    if (!newTopicIcon.trim()) {
      toast.error('Topic icon is required.')
      return
    }
    if (!requireSupabaseWrite() || !supabase) return
    const slug = generateSlug(newTopicTitle)
    if (!slug) {
      toast.error('Title produced an invalid slug. Use letters and numbers.')
      return
    }
    const maxOrderIndex = topics.reduce((max, topic) => Math.max(max, topic.order_index), 0)
    const { data, error } = await supabase
      .from('topics')
      .insert({
        slug,
        title: newTopicTitle.trim(),
        description: newTopicDescription.trim(),
        difficulty: newTopicDifficulty,
        icon: newTopicIcon.trim(),
        color_accent: '#00c8c8',
        order_index: maxOrderIndex + 1,
        lesson_count: 0,
      })
      .select()
      .single()
    if (error) {
      handleSupabaseError(error, 'Unable to create topic.')
      return
    }
    setAdminStatusMessage(getSupabaseStatusMessage())
    const inserted = data as Topic
    setTopics((prev) => [...prev, inserted])
    setSelectedTopic(inserted.slug)
    setNewTopicTitle('')
    setNewTopicDescription('')
    setNewTopicDifficulty('Beginner')
    setNewTopicIcon('✨')
    setShowNewTopicForm(false)
    toast.success('Topic created.')
  }

  const handleDeleteTopic = async () => {
    if (!currentTopic || !requireSupabaseWrite() || !supabase) return
    const confirmed = window.confirm(`Delete "${currentTopic.title}"? This will permanently delete all its lessons and student progress. This cannot be undone.`)
    if (!confirmed) return
    const { error } = await supabase.from('topics').delete().eq('id', currentTopic.id)
    if (error) {
      handleSupabaseError(error, 'Unable to delete topic.')
      return
    }
    setAdminStatusMessage(getSupabaseStatusMessage())
    const remaining = topics.filter((topic) => topic.id !== currentTopic.id)
    setTopics(remaining)
    setSelectedTopic(remaining[0]?.slug ?? '')
    setLessons([])
    setSelectedLessonId('')
    toast.success('Topic deleted.')
  }

  const handleSaveLesson = async () => {
    if (!selectedLesson || !requireSupabaseWrite() || !supabase) return

    const { error } = await supabase.from('lessons').update({ title: lessonTitle, content: lessonContent }).eq('id', selectedLesson.id)

    if (error) {
      handleSupabaseError(error, 'Unable to save lesson.')
      return
    }
    setAdminStatusMessage(getSupabaseStatusMessage())
    setLessons((prev) => prev.map((item) => (item.id === selectedLesson.id ? { ...item, title: lessonTitle, content: lessonContent } : item)))
    toast.success('Lesson saved.')
  }

  const handleAddLesson = async () => {
    if (!currentTopic) return
    if (!newLessonTitle.trim()) {
      toast.error('Lesson title is required.')
      return
    }
    if (!newLessonContent.trim()) {
      toast.error('Lesson content is required.')
      return
    }
    if (!requireSupabaseWrite() || !supabase) return
    const slug = generateSlug(newLessonTitle)
    if (!slug) {
      toast.error('Title produced an invalid slug. Use letters and numbers.')
      return
    }
    const maxOrderIndex = lessons.reduce((max, lesson) => Math.max(max, lesson.order_index), 0)
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        topic_id: currentTopic.id,
        slug,
        title: newLessonTitle.trim(),
        content: newLessonContent.trim(),
        order_index: maxOrderIndex + 1,
        duration_minutes: newLessonDuration > 0 ? newLessonDuration : 10,
      })
      .select()
      .single()
    if (error) {
      handleSupabaseError(error, 'Unable to create lesson.')
      return
    }
    setAdminStatusMessage(getSupabaseStatusMessage())
    const inserted = data as Lesson
    setLessons((prev) => [...prev, inserted])
    setSelectedLessonId(inserted.id)
    await supabase.from('topics').update({ lesson_count: currentTopic.lesson_count + 1 }).eq('id', currentTopic.id)
    setTopics((prev) => prev.map((topic) => (topic.id === currentTopic.id ? { ...topic, lesson_count: topic.lesson_count + 1 } : topic)))
    setNewLessonTitle('')
    setNewLessonContent('')
    setNewLessonDuration(10)
    setShowNewLessonForm(false)
    toast.success('Lesson created.')
  }

  const handleDeleteLesson = async () => {
    if (!selectedLesson || !currentTopic || !requireSupabaseWrite() || !supabase) return
    const confirmed = window.confirm(`Delete lesson "${selectedLesson.title}"? Student progress for this lesson will also be deleted. This cannot be undone.`)
    if (!confirmed) return
    const { error } = await supabase.from('lessons').delete().eq('id', selectedLesson.id)
    if (error) {
      handleSupabaseError(error, 'Unable to delete lesson.')
      return
    }
    setAdminStatusMessage(getSupabaseStatusMessage())
    const remaining = lessons.filter((item) => item.id !== selectedLesson.id)
    setLessons(remaining)
    setSelectedLessonId(remaining[0]?.id ?? '')
    const newCount = Math.max(0, currentTopic.lesson_count - 1)
    await supabase.from('topics').update({ lesson_count: newCount }).eq('id', currentTopic.id)
    setTopics((prev) => prev.map((topic) => (topic.id === currentTopic.id ? { ...topic, lesson_count: newCount } : topic)))
    toast.success('Lesson deleted.')
  }

  const handleMaterialUpload = async (file: File | undefined, type: MaterialType) => {
    if (!file || !requireSupabaseWrite() || !supabase) return

    try {
      const extension = file.name.split('.').pop() ?? 'file'
      const path = `${type}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { data, error } = await supabase.storage.from('materials').upload(path, file, { upsert: true, contentType: file.type || undefined })
      if (error) throw error
      const { data: publicUrlData } = supabase.storage.from('materials').getPublicUrl(data.path)
      const title = file.name.replace(new RegExp(`\\.${extension}$`), '')
      const { error: insertError } = await supabase.from('materials').insert({
        type,
        title,
        url: publicUrlData.publicUrl,
        thumbnail_url: type === 'image' ? publicUrlData.publicUrl : null,
      })
      if (insertError) throw insertError
      setAdminStatusMessage(getSupabaseStatusMessage())
      toast.success(`${type.toUpperCase()} uploaded successfully.`)
      const { data: newMaterialData } = await supabase.from('materials').select('*').eq('url', publicUrlData.publicUrl).single()
      if (newMaterialData) setMaterials((prev) => [newMaterialData as Material, ...prev])
    } catch (error) {
      handleSupabaseError(error, `Failed to upload ${type}.`, { bucket: 'materials' })
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!requireSupabaseWrite() || !supabase) return
    const { error } = await supabase.from('messages').delete().eq('id', messageId)
    if (error) {
      handleSupabaseError(error, 'Unable to delete message.')
      return
    }

    setModerationMessages((prev) => prev.filter((message) => message.id !== messageId))
    toast.success('Message removed.')
  }

  const handleDeleteMaterial = async (material: Material) => {
    if (!requireSupabaseWrite() || !supabase) return
    try {
      const storagePath = material.url.split('/storage/v1/object/public/materials/')[1]
      if (storagePath) await supabase.storage.from('materials').remove([storagePath])
      const { error } = await supabase.from('materials').delete().eq('id', material.id)
      if (error) throw error
      setAdminStatusMessage(getSupabaseStatusMessage())
      setMaterials((prev) => prev.filter((item) => item.id !== material.id))
      toast.success('Material deleted.')
    } catch (error) {
      handleSupabaseError(error, 'Failed to delete material.', { bucket: 'materials' })
    }
  }

  const handleEditQuizQuestion = (question: QuizQuestion) => {
    setQuizEditor({
      id: question.id,
      question: question.question,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_option: question.correct_option,
      explanation: question.explanation ?? '',
    })
    setQuizValidationErrors([])
  }

  const handleSaveQuizQuestion = async () => {
    if (!currentTopic || !requireSupabaseWrite() || !supabase) return
    if (!validateQuizEditor()) return

    const payload = {
      topic_id: currentTopic.id,
      question: quizEditor.question.trim(),
      option_a: quizEditor.option_a.trim(),
      option_b: quizEditor.option_b.trim(),
      option_c: quizEditor.option_c.trim(),
      option_d: quizEditor.option_d.trim(),
      correct_option: quizEditor.correct_option,
      explanation: quizEditor.explanation.trim() || null,
    }

    if (quizEditor.id) {
      const { data, error } = await supabase.from('quiz_questions').update(payload).eq('id', quizEditor.id).select().single()
      if (error) {
        handleSupabaseError(error, 'Unable to update quiz question.')
        return
      }
      setQuizQuestions((prev) => prev.map((question) => (question.id === quizEditor.id ? (data as QuizQuestion) : question)))
      toast.success('Quiz question updated.')
    } else {
      const maxOrderIndex = quizQuestions.reduce((max, question) => Math.max(max, question.order_index), 0)
      const { data, error } = await supabase
        .from('quiz_questions')
        .insert({ ...payload, order_index: maxOrderIndex + 1 })
        .select()
        .single()
      if (error) {
        handleSupabaseError(error, 'Unable to add quiz question.')
        return
      }
      setQuizQuestions((prev) => [...prev, data as QuizQuestion])
      toast.success('Quiz question added.')
    }

    setAdminStatusMessage(getSupabaseStatusMessage())
    resetQuizEditor()
  }

  const handleDeleteQuizQuestion = async (questionId: string) => {
    if (!requireSupabaseWrite() || !supabase) return
    const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId)
    if (error) {
      handleSupabaseError(error, 'Unable to delete quiz question.')
      return
    }

    const remaining = quizQuestions.filter((question) => question.id !== questionId)
    const reordered = remaining.map((question, index) => ({ ...question, order_index: index + 1 }))
    setQuizQuestions(reordered)
    resetQuizEditor()

    try {
      await reorderQuizQuestions(reordered.map(({ id, order_index }) => ({ id, order_index })))
    } catch (error) {
      handleSupabaseError(error, 'Question deleted, but reordering did not finish cleanly.')
      return
    }

    setAdminStatusMessage(getSupabaseStatusMessage())
    toast.success('Question deleted.')
  }

  const handleMoveQuizQuestion = async (questionId: string, direction: 'up' | 'down') => {
    const index = quizQuestions.findIndex((question) => question.id === questionId)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === quizQuestions.length - 1) return

    const reordered = [...quizQuestions]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]]

    const normalized = reordered.map((question, idx) => ({ ...question, order_index: idx + 1 }))
    setQuizQuestions(normalized)

    try {
      await reorderQuizQuestions(normalized.map(({ id, order_index }) => ({ id, order_index })))
      toast.success('Question order updated.')
    } catch (error) {
      handleSupabaseError(error, 'Unable to reorder quiz questions.')
    }
  }

  const handleAddBlock = async () => {
    if (!selectedLesson || !requireSupabaseWrite()) return

    const maxOrder = contentBlocks.reduce((max, block) => Math.max(max, block.block_order), -1)
    const blockPayload: Parameters<typeof upsertLessonContentBlock>[0] = {
      lesson_id: selectedLesson.id,
      block_type: newBlockType,
      block_order: maxOrder + 1,
      text_content: newBlockType === 'text' ? newBlockText.trim() : null,
      heading_text: newBlockType === 'heading' ? newBlockHeading.trim() : null,
      image_url: newBlockType === 'image' ? newBlockImageUrl.trim() : null,
      video_url: newBlockType === 'video' ? newBlockVideoUrl.trim() : null,
      caption: ['image', 'video'].includes(newBlockType) ? newBlockCaption.trim() || null : null,
      list_items: newBlockType === 'list' ? newBlockListItems.split('\n').map((item) => item.trim()).filter(Boolean) : null,
    }

    const inserted = await upsertLessonContentBlock(blockPayload)
    if (inserted) {
      setContentBlocks((prev) => [...prev, inserted])
      setNewBlockText('')
      setNewBlockHeading('')
      setNewBlockImageUrl('')
      setNewBlockCaption('')
      setNewBlockVideoUrl('')
      setNewBlockListItems('')
      toast.success('Block added.')
    } else {
      toast.error('Failed to add block.')
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!requireSupabaseWrite()) return
    await deleteLessonContentBlock(blockId)
    setContentBlocks((prev) => prev.filter((block) => block.id !== blockId))
    toast.success('Block deleted.')
  }

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    const index = contentBlocks.findIndex((block) => block.id === blockId)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === contentBlocks.length - 1) return

    const reordered = [...contentBlocks]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    ;[reordered[index], reordered[swapIndex]] = [reordered[swapIndex], reordered[index]]
    const withNewOrder = reordered.map((block, idx) => ({ ...block, block_order: idx }))
    setContentBlocks(withNewOrder)
    await reorderLessonContentBlocks(withNewOrder.map((block) => ({ id: block.id, block_order: block.block_order })))
  }

  const handleBlockImageUpload = async (file: File | undefined) => {
    if (!file || !supabase || !requireSupabaseWrite()) return
    try {
      const path = `lesson-blocks/${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      const { data, error } = await supabase.storage.from('materials').upload(path, file, { upsert: true, contentType: file.type })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('materials').getPublicUrl(data.path)
      setNewBlockImageUrl(urlData.publicUrl)
      toast.success('Image uploaded. Review URL below before adding block.')
    } catch (error) {
      handleSupabaseError(error, 'Failed to upload block image.')
    }
  }

  if (!isAdmin) return null

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={PRIMARY_NAV_LINKS} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <main className="relative z-10 mx-auto grid min-h-screen max-w-7xl animate-fadeIn gap-6 px-6 pb-10 pt-32 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-deep-navy/90 p-5">
          <h1 className="font-display text-2xl text-white">Admin Panel</h1>
          <div className="mt-6 space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${activeTab === tab ? 'bg-teal text-slate-950' : 'bg-navy/60 text-slate-300 hover:text-teal'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </aside>
        <section className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
          <h2 className="font-display text-3xl text-white">{activeTab}</h2>
          {adminStatusMessage && (
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {adminStatusMessage}
            </div>
          )}

          {activeTab === 'Homepage Content' && (
            <div className="mt-8 space-y-6 rounded-2xl bg-navy/60 p-5">
              <p className="text-sm leading-7 text-slate-300">All homepage copy is loaded from the page_content table using page = &quot;home&quot;.</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Eyebrow</label>
                  <input value={homeForm.eyebrow} onChange={(event) => setHomeForm((prev) => ({ ...prev, eyebrow: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Hero subtitle</label>
                  <input value={homeForm.subtitle} onChange={(event) => setHomeForm((prev) => ({ ...prev, subtitle: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Hero title</label>
                <textarea value={homeForm.title} onChange={(event) => setHomeForm((prev) => ({ ...prev, title: event.target.value }))} className="h-24 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">Intro text</label>
                <textarea value={homeForm.intro} onChange={(event) => setHomeForm((prev) => ({ ...prev, intro: event.target.value }))} className="h-28 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Primary CTA label</label>
                  <input value={homeForm.primaryCtaLabel} onChange={(event) => setHomeForm((prev) => ({ ...prev, primaryCtaLabel: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Primary CTA path</label>
                  <input value={homeForm.primaryCtaPath} onChange={(event) => setHomeForm((prev) => ({ ...prev, primaryCtaPath: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Secondary CTA label</label>
                  <input value={homeForm.secondaryCtaLabel} onChange={(event) => setHomeForm((prev) => ({ ...prev, secondaryCtaLabel: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Secondary CTA path</label>
                  <input value={homeForm.secondaryCtaPath} onChange={(event) => setHomeForm((prev) => ({ ...prev, secondaryCtaPath: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Features section title</label>
                  <input value={homeForm.featuresTitle} onChange={(event) => setHomeForm((prev) => ({ ...prev, featuresTitle: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Features section description</label>
                  <input value={homeForm.featuresDescription} onChange={(event) => setHomeForm((prev) => ({ ...prev, featuresDescription: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Featured topics title</label>
                  <input value={homeForm.featuredTopicsTitle} onChange={(event) => setHomeForm((prev) => ({ ...prev, featuredTopicsTitle: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">Featured topics description</label>
                  <input value={homeForm.featuredTopicsDescription} onChange={(event) => setHomeForm((prev) => ({ ...prev, featuredTopicsDescription: event.target.value }))} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                </div>
              </div>
              <button onClick={() => void saveHomepageContent()} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Homepage Content</button>
            </div>
          )}

          {activeTab === 'About Page Content' && (
            <div className="mt-8 space-y-8">
              <div className="rounded-2xl bg-navy/60 p-5">
                <h3 className="text-xl font-semibold text-white">Mission</h3>
                <textarea value={missionText} onChange={(event) => setMissionText(event.target.value)} className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
                <button onClick={() => void saveAboutSection('mission', missionText, 'Mission content saved.')} className="mt-4 rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Mission</button>
              </div>
              <div className="rounded-2xl bg-navy/60 p-5">
                <h3 className="text-xl font-semibold text-white">Who We Are</h3>
                <textarea value={whoWeAreText} onChange={(event) => setWhoWeAreText(event.target.value)} className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
                <button onClick={() => void saveAboutSection('who-we-are', whoWeAreText, 'Who We Are content saved.')} className="mt-4 rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Section</button>
              </div>
            </div>
          )}

          {activeTab === 'Materials Manager' && (
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl bg-navy/60 p-5 text-slate-300">
                Manage image, video, and PDF uploads here.
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => imageInputRef.current?.click()} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Upload Image</button>
                  <button onClick={() => videoInputRef.current?.click()} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-200">Upload Video</button>
                  <button onClick={() => pdfInputRef.current?.click()} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-200">Upload PDF</button>
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => void handleMaterialUpload(event.target.files?.[0], 'image')} />
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(event) => void handleMaterialUpload(event.target.files?.[0], 'video')} />
                <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={(event) => void handleMaterialUpload(event.target.files?.[0], 'pdf')} />
              </div>
              {materials.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Uploaded Materials</h3>
                  {materials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-deep-navy/70 px-5 py-4">
                      <div>
                        <div className="font-semibold text-white">{material.title}</div>
                        <div className="mt-1 text-xs uppercase tracking-widest text-slate-400">{material.type}</div>
                      </div>
                      <button onClick={() => void handleDeleteMaterial(material)} className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-red-500/50 hover:text-red-400">Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Chat Moderation' && (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-navy/60 p-5 text-slate-300">Moderate chat content, review recent reports, and remove messages when needed.</div>
              {moderationMessages.length ? (
                moderationMessages.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-white/10 bg-deep-navy/70 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-white">{message.profiles?.username ?? 'Unknown User'}</div>
                        <div className="mt-1 text-sm text-slate-400">{new Date(message.created_at).toLocaleString()}</div>
                        <div className="mt-3 text-sm text-slate-300">{message.content?.slice(0, 180) || (message.image_url ? 'Image-only message' : 'No content')}</div>
                      </div>
                      <button onClick={() => void handleDeleteMessage(message.id)} className="rounded-lg bg-teal px-4 py-2 font-semibold text-slate-950">Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-deep-navy/70 p-5 text-slate-400">No recent messages found.</div>
              )}
            </div>
          )}

          {activeTab === 'Topic Manager' && currentTopic && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="space-y-4">
                <div className="rounded-2xl bg-navy/60 p-5">
                  <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Select Topic</label>
                  <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                    {topics.map((topic) => <option key={topic.id} value={topic.slug}>{topic.title}</option>)}
                  </select>
                  <button onClick={() => setShowNewTopicForm((prev) => !prev)} className="mt-4 w-full rounded-2xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm font-semibold text-teal">
                    {showNewTopicForm ? 'Cancel New Topic' : '+ Add New Topic'}
                  </button>
                </div>
                {showNewTopicForm && (
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-deep-navy/70 p-5">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">New Topic</h4>
                    <input value={newTopicTitle} onChange={(event) => setNewTopicTitle(event.target.value)} placeholder="Title" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                    <textarea value={newTopicDescription} onChange={(event) => setNewTopicDescription(event.target.value)} placeholder="Description" className="h-24 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-sm text-slate-300 outline-none focus:border-teal" />
                    <input value={newTopicIcon} onChange={(event) => setNewTopicIcon(event.target.value)} placeholder="Icon emoji e.g. ✨" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                    <select value={newTopicDifficulty} onChange={(event) => setNewTopicDifficulty(event.target.value as Topic['difficulty'])} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                    <button onClick={() => void handleAddTopic()} className="w-full rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Create Topic</button>
                  </div>
                )}
              </div>
              <div className="rounded-2xl bg-navy/60 p-5 text-slate-300">
                <input value={topicTitle} onChange={(event) => setTopicTitle(event.target.value)} className="w-full bg-transparent text-xl font-semibold text-white outline-none" />
                <textarea value={topicDescription} onChange={(event) => setTopicDescription(event.target.value)} className="mt-3 h-32 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-sm leading-7 text-slate-300 outline-none focus:border-teal" />
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <select value={topicDifficulty} onChange={(event) => setTopicDifficulty(event.target.value as Topic['difficulty'])} className="rounded-full border border-white/10 bg-deep-navy px-3 py-1 text-slate-200 outline-none focus:border-teal">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-slate-200">{currentTopic.lesson_count} lessons</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => void handleSaveTopic()} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Topic</button>
                  <button onClick={() => setShowLessonEditor((prev) => !prev)} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-200">Manage Lessons</button>
                  <button onClick={() => void handleDeleteTopic()} className="rounded-lg border border-red-500/30 px-5 py-3 font-semibold text-red-400 hover:bg-red-500/10">Delete Topic</button>
                </div>
                {showLessonEditor && (
                  <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-deep-navy/70 p-5">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Select Lesson</label>
                      <button onClick={() => setShowNewLessonForm((prev) => !prev)} className="rounded-xl border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">{showNewLessonForm ? 'Cancel' : '+ New Lesson'}</button>
                    </div>
                    {showNewLessonForm ? (
                      <div className="space-y-3 rounded-2xl border border-white/10 bg-navy/60 p-4">
                        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">New Lesson</h4>
                        <input value={newLessonTitle} onChange={(event) => setNewLessonTitle(event.target.value)} placeholder="Lesson title" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                        <textarea value={newLessonContent} onChange={(event) => setNewLessonContent(event.target.value)} placeholder="Lesson content (supports # headings, ## subheadings, - list items)" className="h-40 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-sm text-slate-300 outline-none focus:border-teal" />
                        <input type="number" min={1} value={newLessonDuration} onChange={(event) => setNewLessonDuration(Number(event.target.value))} placeholder="Duration (minutes)" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                        <button onClick={() => void handleAddLesson()} className="w-full rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Create Lesson</button>
                      </div>
                    ) : (
                      <>
                        <select value={selectedLessonId} onChange={(event) => setSelectedLessonId(event.target.value)} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                          {lessons.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
                        </select>
                        {selectedLesson ? (
                          <>
                            <input value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                            <textarea value={lessonContent} onChange={(event) => setLessonContent(event.target.value)} className="h-48 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
                            <div className="flex flex-wrap gap-3">
                              <button onClick={() => void handleSaveLesson()} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Lesson</button>
                              <button onClick={() => void handleDeleteLesson()} className="rounded-lg border border-red-500/30 px-5 py-3 font-semibold text-red-400 hover:bg-red-500/10">Delete Lesson</button>
                            </div>
                            <div className="mt-6 border-t border-white/10 pt-6">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Content Blocks</h4>
                                <button onClick={() => setShowBlockEditor((prev) => !prev)} className="rounded-xl border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">{showBlockEditor ? 'Close Block Editor' : '+ Add Block'}</button>
                              </div>
                              {contentBlocks.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  {contentBlocks.map((block, index) => (
                                    <div key={block.id} className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-deep-navy/70 px-4 py-3">
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">{block.block_type}</div>
                                        <div className="mt-1 truncate text-sm text-white">
                                          {block.block_type === 'heading' && block.heading_text}
                                          {block.block_type === 'text' && block.text_content?.slice(0, 80)}
                                          {block.block_type === 'image' && (block.caption || block.image_url?.slice(0, 60))}
                                          {block.block_type === 'video' && (block.caption || block.video_url?.slice(0, 60))}
                                          {block.block_type === 'list' && `${block.list_items?.length ?? 0} items`}
                                        </div>
                                      </div>
                                      <div className="flex flex-shrink-0 gap-2">
                                        <button onClick={() => void handleMoveBlock(block.id, 'up')} disabled={index === 0} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-400 disabled:opacity-30">↑</button>
                                        <button onClick={() => void handleMoveBlock(block.id, 'down')} disabled={index === contentBlocks.length - 1} className="rounded-lg border border-white/10 px-2 py-1 text-xs text-slate-400 disabled:opacity-30">↓</button>
                                        <button onClick={() => void handleDeleteBlock(block.id)} className="rounded-lg border border-red-500/30 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10">✕</button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {showBlockEditor && (
                                <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-navy/60 p-4">
                                  <h5 className="text-sm font-semibold text-white">New Block</h5>
                                  <select value={newBlockType} onChange={(event) => setNewBlockType(event.target.value as LessonContentBlock['block_type'])} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                                    <option value="heading">Heading</option>
                                    <option value="text">Text Paragraph</option>
                                    <option value="image">Image</option>
                                    <option value="video">Video</option>
                                    <option value="list">List</option>
                                  </select>
                                  {newBlockType === 'heading' && <input value={newBlockHeading} onChange={(event) => setNewBlockHeading(event.target.value)} placeholder="Heading text" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />}
                                  {newBlockType === 'text' && <textarea value={newBlockText} onChange={(event) => setNewBlockText(event.target.value)} placeholder="Paragraph text" className="h-28 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-sm text-slate-300 outline-none focus:border-teal" />}
                                  {newBlockType === 'image' && (
                                    <>
                                      <div className="flex gap-2">
                                        <input value={newBlockImageUrl} onChange={(event) => setNewBlockImageUrl(event.target.value)} placeholder="Image URL or upload below" className="flex-1 rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                                        <button onClick={() => blockImageInputRef.current?.click()} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:text-teal">Upload</button>
                                      </div>
                                      <input ref={blockImageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => void handleBlockImageUpload(event.target.files?.[0])} />
                                      <input value={newBlockCaption} onChange={(event) => setNewBlockCaption(event.target.value)} placeholder="Caption (optional)" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                                    </>
                                  )}
                                  {newBlockType === 'video' && (
                                    <>
                                      <input value={newBlockVideoUrl} onChange={(event) => setNewBlockVideoUrl(event.target.value)} placeholder="Video URL (mp4, YouTube embed, etc.)" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                                      <input value={newBlockCaption} onChange={(event) => setNewBlockCaption(event.target.value)} placeholder="Caption (optional)" className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                                    </>
                                  )}
                                  {newBlockType === 'list' && <textarea value={newBlockListItems} onChange={(event) => setNewBlockListItems(event.target.value)} placeholder="One list item per line" className="h-28 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-sm text-slate-300 outline-none focus:border-teal" />}
                                  <button onClick={() => void handleAddBlock()} className="w-full rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Add Block</button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm text-slate-400">No lessons found for this topic.</div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Quiz Manager' && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="rounded-2xl bg-navy/60 p-5">
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Select Topic</label>
                <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                  {topics.map((topic) => <option key={topic.id} value={topic.slug}>{topic.title}</option>)}
                </select>
                <div className="mt-4 text-sm text-slate-400">{quizQuestions.length} question{quizQuestions.length !== 1 ? 's' : ''} in this topic</div>
                <button onClick={resetQuizEditor} className="mt-4 w-full rounded-lg border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:border-teal/30 hover:text-teal">Clear Editor</button>
              </div>
              <div className="space-y-6">
                <div className="space-y-4 rounded-2xl bg-navy/60 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{quizEditor.id ? 'Edit Question' : 'Add New Question'}</h3>
                    {quizEditor.id && <span className="rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">Editing existing question</span>}
                  </div>
                  <textarea value={quizEditor.question} onChange={(event) => handleQuizEditorChange('question', event.target.value)} placeholder="Question text" className="h-20 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-sm text-white outline-none focus:border-teal" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input value={quizEditor.option_a} onChange={(event) => handleQuizEditorChange('option_a', event.target.value)} placeholder="Option A" className="rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                    <input value={quizEditor.option_b} onChange={(event) => handleQuizEditorChange('option_b', event.target.value)} placeholder="Option B" className="rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                    <input value={quizEditor.option_c} onChange={(event) => handleQuizEditorChange('option_c', event.target.value)} placeholder="Option C" className="rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                    <input value={quizEditor.option_d} onChange={(event) => handleQuizEditorChange('option_d', event.target.value)} placeholder="Option D" className="rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-sm text-white outline-none focus:border-teal" />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-slate-400">Correct answer:</label>
                    <select value={quizEditor.correct_option} onChange={(event) => handleQuizEditorChange('correct_option', event.target.value as QuizOptionKey)} className="rounded-xl border border-white/10 bg-deep-navy px-4 py-2 text-white outline-none focus:border-teal">
                      <option value="a">A</option>
                      <option value="b">B</option>
                      <option value="c">C</option>
                      <option value="d">D</option>
                    </select>
                  </div>
                  <textarea value={quizEditor.explanation} onChange={(event) => handleQuizEditorChange('explanation', event.target.value)} placeholder="Explanation shown after answering (optional but recommended)" className="h-24 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-sm text-white outline-none focus:border-teal" />
                  {quizValidationErrors.length > 0 && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                      <ul className="list-disc space-y-1 pl-5">
                        {quizValidationErrors.map((error) => <li key={error}>{error}</li>)}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => void handleSaveQuizQuestion()} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">{quizEditor.id ? 'Update Question' : 'Add Question'}</button>
                    {quizEditor.id && <button onClick={resetQuizEditor} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-200">Cancel Edit</button>}
                  </div>
                </div>
                {quizQuestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Existing Questions</h3>
                    {quizQuestions.map((question, index) => (
                      <div key={question.id} className="rounded-2xl border border-white/10 bg-deep-navy/70 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="text-sm font-semibold uppercase tracking-widest text-slate-400">Question {index + 1} · Order {question.order_index}</div>
                            <div className="mt-1 text-white">{question.question}</div>
                            <div className="mt-3 grid gap-1 text-sm">
                              {(['a', 'b', 'c', 'd'] as const).map((optionKey) => (
                                <div key={optionKey} className={`rounded-lg px-3 py-1.5 ${question.correct_option === optionKey ? 'bg-teal/20 text-teal' : 'text-slate-400'}`}>
                                  <span className="font-semibold uppercase">{optionKey}.</span> {question[`option_${optionKey}`]}
                                </div>
                              ))}
                            </div>
                            <div className="mt-3 rounded-xl bg-navy/60 p-3 text-sm text-slate-300">
                              <span className="font-semibold text-white">Explanation:</span> {question.explanation?.trim() || 'No explanation added yet.'}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => handleEditQuizQuestion(question)} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:border-teal/30 hover:text-teal">Edit</button>
                            <button onClick={() => void handleMoveQuizQuestion(question.id, 'up')} disabled={index === 0} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 disabled:opacity-40">Move Up</button>
                            <button onClick={() => void handleMoveQuizQuestion(question.id, 'down')} disabled={index === quizQuestions.length - 1} className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 disabled:opacity-40">Move Down</button>
                            <button onClick={() => void handleDeleteQuizQuestion(question.id)} className="rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10">Delete</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
