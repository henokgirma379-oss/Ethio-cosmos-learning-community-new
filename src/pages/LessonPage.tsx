import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import {
  addBookmark,
  getBookmarkedLessonIds,
  getCompletedLessonIds,
  getLessonBySlugs,
  getLessonContentBlocks,
  markLessonComplete,
  removeBookmark,
} from '../lib/api'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import type { Lesson, LessonContentBlock, Topic } from '../types'

function renderLegacyContent(content: string) {
  return content.split('\n').map((line, index) => {
    if (line.startsWith('# ')) return <h1 key={index} className="mt-6 font-display text-3xl text-white">{line.replace('# ', '')}</h1>
    if (line.startsWith('## ')) return <h2 key={index} className="mt-6 text-2xl font-semibold text-white">{line.replace('## ', '')}</h2>
    if (line.startsWith('- ')) return <li key={index} className="ml-6 list-disc text-slate-300">{line.replace('- ', '')}</li>
    if (!line.trim()) return <div key={index} className="h-2" />
    return <p key={index} className="text-lg leading-8 text-slate-300">{line}</p>
  })
}

function renderBlock(block: LessonContentBlock) {
  switch (block.block_type) {
    case 'heading':
      return (
        <h2 key={block.id} className="mt-8 font-display text-2xl font-semibold text-white">
          {block.heading_text}
        </h2>
      )
    case 'text':
      return (
        <p key={block.id} className="mt-4 text-lg leading-8 text-slate-300">
          {block.text_content}
        </p>
      )
    case 'image':
      return (
        <figure key={block.id} className="mt-6">
          <img src={block.image_url ?? ''} alt={block.caption ?? ''} className="w-full rounded-2xl object-cover" />
          {block.caption && <figcaption className="mt-2 text-center text-sm text-slate-400">{block.caption}</figcaption>}
        </figure>
      )
    case 'list':
      return (
        <ul key={block.id} className="mt-4 space-y-1">
          {(block.list_items ?? []).map((item, i) => (
            <li key={i} className="ml-6 list-disc text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      )
    case 'video':
      return (
        <div key={block.id} className="mt-6">
          <video controls className="w-full rounded-2xl" src={block.video_url ?? ''} />
          {block.caption && <p className="mt-2 text-center text-sm text-slate-400">{block.caption}</p>}
        </div>
      )
    default:
      return null
  }
}

export default function LessonPage() {
  const { user } = useAuth()
  const { slug = '', lessonSlug = '' } = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [contentBlocks, setContentBlocks] = useState<LessonContentBlock[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    void getLessonBySlugs(slug, lessonSlug).then((data) => {
      setTopic(data.topic)
      setLesson(data.lesson)
      setLessons(data.lessons)
    })
  }, [slug, lessonSlug])

  useEffect(() => {
    if (!lesson) {
      setContentBlocks([])
      return
    }
    void getLessonContentBlocks(lesson.id).then(setContentBlocks)
  }, [lesson])

  useEffect(() => {
    if (!user) {
      setCompletedLessonIds([])
      return
    }
    void getCompletedLessonIds(user.id).then(setCompletedLessonIds)
  }, [user])

  useEffect(() => {
    if (!user || !lesson) {
      setIsBookmarked(false)
      return
    }
    void getBookmarkedLessonIds(user.id).then((ids) => setIsBookmarked(ids.includes(lesson.id)))
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
      toast.error('Please sign in to bookmark lessons.')
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
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="default">
      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-32">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-slate-400">
          <Link to="/" className="hover:text-teal">
            Home
          </Link>{' '}
          {'>'}{' '}
          <Link to="/learning" className="hover:text-teal">
            Learning
          </Link>
          {topic && (
            <>
              {' '}
              {'>'} <Link to={`/learning/${topic.slug}`} className="hover:text-teal">{topic.title}</Link>
            </>
          )}
          {lesson && (
            <>
              {' '}
              {'>'} <span className="text-teal">{lesson.title}</span>
            </>
          )}
        </div>

        {lesson && topic ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            {/* Main Content */}
            <Card variant="default" borderStyle="default" padding="lg">
              <div className="mb-6">
                <Badge variant="teal" size="md">{topic.title}</Badge>
              </div>
              <h1 className="font-display text-3xl text-white">{lesson.title}</h1>
              <div className="mt-6 space-y-2">
                {contentBlocks.length > 0 ? contentBlocks.map(renderBlock) : renderLegacyContent(lesson.content ?? '')}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">
                {user &&
                  (isCompleted ? (
                    <button
                      disabled
                      className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      ✓ Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => void handleMarkComplete()}
                      className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110"
                    >
                      ✓ Mark as Complete
                    </button>
                  ))}
                <button
                  onClick={() => void handleBookmarkToggle()}
                  className={`rounded-lg px-5 py-3 font-semibold transition-all duration-200 ${
                    isBookmarked
                      ? 'bg-gold text-slate-950 hover:scale-105 hover:brightness-110'
                      : 'border border-white/10 bg-navy/60 text-slate-200 hover:border-teal hover:text-teal'
                  }`}
                >
                  {isBookmarked ? '★ Bookmarked' : '☆ Bookmark this lesson'}
                </button>
              </div>

              {/* Navigation */}
              <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
                {previousLesson ? (
                  <Link
                    to={`/learning/${slug}/${previousLesson.slug}`}
                    className="rounded-lg border border-white/10 px-5 py-3 text-slate-300 transition-all duration-200 hover:border-teal/30 hover:text-teal"
                  >
                    ← {previousLesson.title}
                  </Link>
                ) : (
                  <div />
                )}
                {nextLesson && (
                  <Link
                    to={`/learning/${slug}/${nextLesson.slug}`}
                    className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110"
                  >
                    {nextLesson.title} →
                  </Link>
                )}
              </div>
            </Card>

            {/* Sidebar - Topic Lessons */}
            <Card variant="default" borderStyle="default" padding="md" className="lg:sticky lg:top-24 lg:h-fit">
              <h3 className="font-display text-xl text-white">Topic Lessons</h3>
              <div className="mt-4 space-y-3">
                {lessons.map((item, index) => {
                  const itemCompleted = completedLessonIds.includes(item.id)
                  return (
                    <Link
                      key={item.id}
                      to={`/learning/${slug}/${item.slug}`}
                      className={`block rounded-xl px-4 py-3 text-sm transition-all duration-200 ${
                        item.slug === lesson.slug ? 'bg-teal/10 text-teal' : 'bg-navy/60 text-slate-300 hover:text-teal'
                      }`}
                    >
                      <span>
                        {index + 1}. {item.title}
                      </span>
                      {itemCompleted ? <span className="ml-2 text-green-400">✓</span> : null}
                    </Link>
                  )
                })}
              </div>
            </Card>
          </div>
        ) : (
          <Card variant="default" borderStyle="default" padding="lg">
            <div className="text-slate-300">Lesson not found.</div>
          </Card>
        )}
      </main>
    </PageShell>
  )
}
