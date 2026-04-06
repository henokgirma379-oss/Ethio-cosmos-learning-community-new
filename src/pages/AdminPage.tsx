import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { useAuth } from '../context/AuthContext'
import { fallbackTopics } from '../data/fallbackData'
import { supabase } from '../lib/supabase'
import type { Lesson, Message, PageContent, Topic } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const tabs = ['About Page Content', 'Materials Manager', 'Chat Moderation', 'Topic Manager'] as const

type AdminTab = (typeof tabs)[number]
type MaterialType = 'image' | 'video' | 'pdf'
type ModerationMessage = Message & { profiles?: { username?: string | null } | null }

const missionFallback = 'Update mission text here...'
const whoWeAreFallback = 'Update who-we-are content here...'

export default function AdminPage() {
  const { isAdmin, profile } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>('About Page Content')
  const [loginOpen, setLoginOpen] = useState(false)
  const [missionText, setMissionText] = useState(missionFallback)
  const [whoWeAreText, setWhoWeAreText] = useState(whoWeAreFallback)
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
  const [moderationMessages, setModerationMessages] = useState<ModerationMessage[]>([])
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const pdfInputRef = useRef<HTMLInputElement | null>(null)

  const currentTopic = useMemo(
    () => topics.find((topic) => topic.slug === selectedTopic) ?? topics[0] ?? fallbackTopics[0],
    [topics, selectedTopic],
  )

  const selectedLesson = useMemo(
    () => lessons.find((item) => item.id === selectedLessonId) ?? lessons[0] ?? null,
    [lessons, selectedLessonId],
  )

  useEffect(() => {
    const loadInitialData = async () => {
      if (!supabase) return

      const [{ data: topicsData }, { data: missionData }, { data: whoWeAreData }] = await Promise.all([
        supabase.from('topics').select('*').order('order_index'),
        supabase.from('page_content').select('*').eq('page', 'about').eq('section', 'mission').order('updated_at', { ascending: false }).limit(1),
        supabase.from('page_content').select('*').eq('page', 'about').eq('section', 'who-we-are').order('updated_at', { ascending: false }).limit(1),
      ])

      const liveTopics = (topicsData as Topic[] | null) ?? []
      if (liveTopics.length) {
        setTopics(liveTopics)
        setSelectedTopic((current) => {
          if (liveTopics.some((topic) => topic.slug === current)) return current
          return liveTopics[0]?.slug ?? current
        })
      }

      const missionRow = (missionData as PageContent[] | null)?.[0]
      const whoWeAreRow = (whoWeAreData as PageContent[] | null)?.[0]

      if (missionRow?.content) setMissionText(missionRow.content)
      if (whoWeAreRow?.content) setWhoWeAreText(whoWeAreRow.content)
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
      if (!currentTopic) {
        setLessons([])
        setSelectedLessonId('')
        return
      }

      if (!supabase) {
        setLessons([])
        setSelectedLessonId('')
        return
      }

      const { data, error } = await supabase.from('lessons').select('*').eq('topic_id', currentTopic.id).order('order_index')
      if (error) {
        toast.error(error.message)
        return
      }

      const nextLessons = (data as Lesson[] | null) ?? []
      setLessons(nextLessons)
      setSelectedLessonId((current) => {
        if (nextLessons.some((item) => item.id === current)) return current
        return nextLessons[0]?.id ?? ''
      })
    }

    if (activeTab === 'Topic Manager') {
      void loadLessons()
    }
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
        toast.error(error.message)
        return
      }

      setModerationMessages((data as ModerationMessage[] | null) ?? [])
    }

    if (activeTab === 'Chat Moderation') {
      void loadModerationMessages()
    }
  }, [activeTab])

  const requireSupabaseWrite = () => {
    if (supabase) return true
    toast.error('Connect Supabase to enable admin writes')
    return false
  }

  const saveAboutSection = async (section: 'mission' | 'who-we-are', content: string, successMessage: string) => {
    if (!requireSupabaseWrite() || !supabase) return

    const { error } = await supabase
      .from('page_content')
      .upsert(
        {
          page: 'about',
          section,
          content_type: 'text',
          content,
          image_url: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'page,section' },
      )

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success(successMessage)
  }

  const handleSaveTopic = async () => {
    if (!currentTopic) return
    if (!requireSupabaseWrite() || !supabase) return

    const { error } = await supabase
      .from('topics')
      .update({
        title: topicTitle,
        description: topicDescription,
        difficulty: topicDifficulty,
      })
      .eq('id', currentTopic.id)

    if (error) {
      toast.error(error.message)
      return
    }

    setTopics((prev) => prev.map((topic) => (topic.id === currentTopic.id ? { ...topic, title: topicTitle, description: topicDescription, difficulty: topicDifficulty } : topic)))
    toast.success('Topic saved.')
  }

  const handleSaveLesson = async () => {
    if (!selectedLesson) return
    if (!requireSupabaseWrite() || !supabase) return

    const { error } = await supabase
      .from('lessons')
      .update({
        title: lessonTitle,
        content: lessonContent,
      })
      .eq('id', selectedLesson.id)

    if (error) {
      toast.error(error.message)
      return
    }

    setLessons((prev) => prev.map((item) => (item.id === selectedLesson.id ? { ...item, title: lessonTitle, content: lessonContent } : item)))
    toast.success('Lesson saved.')
  }

  const handleMaterialUpload = async (file: File | undefined, type: MaterialType) => {
    if (!file) return
    if (!requireSupabaseWrite() || !supabase) return

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
      toast.success(`${type.toUpperCase()} uploaded successfully.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to upload ${type}.`)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!requireSupabaseWrite() || !supabase) return

    const { error } = await supabase.from('messages').delete().eq('id', messageId)
    if (error) {
      toast.error(error.message)
      return
    }

    setModerationMessages((prev) => prev.filter((message) => message.id !== messageId))
    toast.success('Message removed.')
  }

  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto grid min-h-screen max-w-7xl animate-fadeIn gap-6 px-6 pb-10 pt-20 lg:grid-cols-[280px_1fr]">
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
            </div>
          )}

          {activeTab === 'Chat Moderation' && (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-navy/60 p-5 text-slate-300">
                Moderate chat content, review recent reports, and remove messages when needed.
              </div>
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
              <div className="rounded-2xl bg-navy/60 p-5">
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Select Topic</label>
                <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.slug}>{topic.title}</option>
                  ))}
                </select>
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
                </div>

                {showLessonEditor && (
                  <div className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-deep-navy/70 p-5">
                    <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Select Lesson</label>
                    <select value={selectedLessonId} onChange={(event) => setSelectedLessonId(event.target.value)} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                      {lessons.map((item) => (
                        <option key={item.id} value={item.id}>{item.title}</option>
                      ))}
                    </select>
                    {selectedLesson ? (
                      <>
                        <input value={lessonTitle} onChange={(event) => setLessonTitle(event.target.value)} className="w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal" />
                        <textarea value={lessonContent} onChange={(event) => setLessonContent(event.target.value)} className="h-48 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
                        <button onClick={() => void handleSaveLesson()} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Lesson</button>
                      </>
                    ) : (
                      <div className="text-sm text-slate-400">No lessons found for this topic.</div>
                    )}
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
