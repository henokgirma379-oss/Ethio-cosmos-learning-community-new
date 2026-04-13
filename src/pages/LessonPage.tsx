import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import {
  addBookmark,
  getBookmarkedLessonIds,
  getCompletedLessonIds,
  getLessonBySlugs,
  markLessonComplete,
  removeBookmark,
} from '../lib/api'
import type { Lesson, Topic } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

function renderContent(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('# ')) return <h1 key={index} className="mt-6 font-display text-3xl text-white">{line.replace('# ', '')}</h1>
    if (line.startsWith('## ')) return <h2 key={index} className="mt-6 text-2xl font-semibold text-white">{line.replace('## ', '')}</h2>
    if (line.startsWith('- ')) return <li key={index} className="ml-6 list-disc text-slate-300">{line.replace('- ', '')}</li>
    if (!line.trim()) return <div key={index} className="h-2" />
    return <p key={index} className="text-lg leading-8 text-slate-300">{line}</p>
  })
}

export default function LessonPage() {
  const { user } = useAuth()
  const { slug = '', lessonSlug = '' } = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getLessonBySlugs(slug, lessonSlug).then((data) => {
      setTopic(data.topic)
      setLesson(data.lesson)
      setLessons(data.lessons)
    })
  }, [slug, lessonSlug])

  useEffect(() => {
    if (!user) {
      setCompletedLessonIds([])
      return
    }

    void getCompletedLessonIds(user.id).then((ids) => {
      setCompletedLessonIds(ids)
    })
  }, [user])

  useEffect(() => {
    if (!user || !lesson) {
      setIsBookmarked(false)
      return
    }

    void getBookmarkedLessonIds(user.id).then((ids) => {
      setIsBookmarked(ids.includes(lesson.id))
    })
  }, [user, lesson])

  const currentIndex = useMemo(() => lessons.findIndex((item) => item.slug === lessonSlug), [lessons, lessonSlug])
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null
  const isCompleted = lesson ? completedLessonIds.includes(lesson.id) : false

  const handleMarkComplete = async () => {
    if (!user || !lesson || isCompleted) return
    await markLessonComplete(user.id, lesson.id)
    setCompletedLessonIds((prev) => (prev.includes(lesson.id) ? prev : [...prev, lesson.id]))
    toast.success('Lesson marked as complete!')
  }

  const handleBookmarkToggle = async () => {
    if (!lesson) return
    if (!user) {
      setLoginOpen(true)
      return
    }

    if (isBookmarked) {
      await removeBookmark(user.id, lesson.id)
      setIsBookmarked(false)
      toast.success('Bookmark removed.')
      return
    }

    await addBookmark(user.id, lesson.id)
    setIsBookmarked(true)
    toast.success('Lesson bookmarked!')
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.1),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.78),_rgba(5,10,26,0.96))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-20">
        <div className="mb-8 text-sm text-slate-400">
          <Link to="/" className="hover:text-teal">Home</Link> {'>'} <Link to="/learning" className="hover:text-teal">Learning</Link>
          {topic && <> {'>'} <Link to={`/learning/${topic.slug}`} className="hover:text-teal">{topic.title}</Link></>}
          {lesson && <> {'>'} <span className="text-teal">{lesson.title}</span></>}
        </div>

        {lesson && topic ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <article className="rounded-3xl border border-white/5 bg-deep-navy/90 p-8">
              <div className="mb-6 inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-1 text-sm text-teal">
                {topic.title}
              </div>
              <div className="space-y-2">{renderContent(lesson.content)}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                {user && (
                  isCompleted ? (
                    <button disabled className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">
                      ✓ Completed
                    </button>
                  ) : (
                    <button onClick={() => void handleMarkComplete()} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">
                      ✓ Mark as Complete
                    </button>
                  )
                )}
                <button
                  onClick={() => void handleBookmarkToggle()}
                  className={`rounded-lg px-5 py-3 font-semibold transition ${isBookmarked ? 'bg-gold text-slate-950' : 'border border-white/10 bg-navy/60 text-slate-200 hover:border-teal hover:text-teal'}`}
                >
                  {isBookmarked ? '★ Bookmarked' : '☆ Bookmark this lesson'}
                </button>
              </div>
              <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
                {previousLesson ? (
                  <Link to={`/learning/${slug}/${previousLesson.slug}`} className="rounded-lg border border-white/10 px-5 py-3 text-slate-300 hover:border-teal/30 hover:text-teal">
                    ← {previousLesson.title}
                  </Link>
                ) : <div />}
                {nextLesson && (
                  <Link to={`/learning/${slug}/${nextLesson.slug}`} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">
                    {nextLesson.title} →
                  </Link>
                )}
              </div>
            </article>

            <aside className="rounded-3xl border border-white/5 bg-deep-navy/90 p-6 lg:sticky lg:top-24 lg:h-fit">
              <h3 className="font-display text-xl text-white">Topic Lessons</h3>
              <div className="mt-4 space-y-3">
                {lessons.map((item, index) => {
                  const itemCompleted = completedLessonIds.includes(item.id)
                  return (
                    <Link
                      key={item.id}
                      to={`/learning/${slug}/${item.slug}`}
                      className={`block rounded-xl px-4 py-3 text-sm transition ${item.slug === lesson.slug ? 'bg-teal/10 text-teal' : 'bg-navy/60 text-slate-300 hover:text-teal'}`}
                    >
                      <span>{index + 1}. {item.title}</span>
                      {itemCompleted ? <span className="ml-2 text-green-400">✓</span> : null}
                    </Link>
                  )
                })}
              </div>
            </aside>
          </div>
        ) : (
          <div className="rounded-2xl bg-deep-navy p-8 text-slate-300">Lesson not found.</div>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
