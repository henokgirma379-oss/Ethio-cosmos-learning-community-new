import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { getLessonsByTopicId, getQuizQuestionCount, getTopicBySlug } from '../lib/api'
import type { Lesson, Topic } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Scientists', path: '/scientists' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

export default function TopicDetailPage() {
  const { slug = '' } = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [quizCount, setQuizCount] = useState(0)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    void getTopicBySlug(slug).then((topicData) => {
      setTopic(topicData)
      if (topicData) {
        void getLessonsByTopicId(topicData.id).then(async (lessonData) => {
          setLessons(lessonData)
          const qCount = await getQuizQuestionCount(topicData.id)
          setQuizCount(qCount)
          setLoading(false)
        })
      } else {
        setQuizCount(0)
        setLoading(false)
      }
    })
  }, [slug])

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-6xl animate-fadeIn px-6 pb-20 pt-20">
        <Link to="/learning" className="inline-flex items-center gap-2 text-sm text-teal">← Back to learning</Link>

        {loading ? (
          <div className="mt-6 animate-pulse space-y-4">
            <div className="h-10 w-2/3 rounded-2xl bg-deep-navy" />
            <div className="h-48 rounded-3xl bg-deep-navy" />
            <div className="h-16 rounded-2xl bg-deep-navy" />
            <div className="h-16 rounded-2xl bg-deep-navy" />
          </div>
        ) : topic ? (
          <>
            <section className="rounded-3xl border border-teal/20 bg-deep-navy/80 p-8 mt-6">
              <div className="text-5xl">{topic.icon}</div>
              <h1 className="mt-4 font-display text-4xl text-white">{topic.title}</h1>
              <div className="mt-4 inline-flex rounded-full border border-teal/40 bg-teal/10 px-4 py-1 text-sm text-teal">
                {topic.difficulty}
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{topic.description}</p>
            </section>

            <section className="mt-10 space-y-4">
              {lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  to={`/learning/${slug}/${lesson.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-deep-navy/80 p-5 transition hover:border-teal/30 hover:shadow-glow"
                >
                  <div>
                    <p className="text-sm text-teal">Lesson {index + 1}</p>
                    <h2 className="mt-1 text-xl font-semibold text-white">{lesson.title}</h2>
                    <p className="mt-2 text-sm text-slate-400">{lesson.duration_minutes} min read</p>
                  </div>
                  <span className="text-2xl text-teal">→</span>
                </Link>
              ))}
            </section>
            {quizCount > 0 && (
              <div className="mt-8 rounded-3xl border border-teal/20 bg-deep-navy/80 p-8 text-center">
                <div className="text-4xl">🧠</div>
                <h2 className="mt-4 font-display text-2xl text-white">Test Your Knowledge</h2>
                <p className="mt-3 text-slate-300">
                  This topic has {quizCount} question{quizCount !== 1 ? 's' : ''}. Take the quiz to check your understanding.
                </p>
                <Link
                  to={`/learning/${slug}/quiz`}
                  className="mt-6 inline-block rounded-lg bg-teal px-8 py-3 font-semibold text-slate-950"
                >
                  Take Quiz
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-2xl bg-deep-navy p-8 text-slate-300">Topic not found.</div>
        )}
      </main>

      <Footer />
    </div>
  )
}
