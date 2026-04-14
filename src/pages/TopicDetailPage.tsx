import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import { getLessonsByTopicId, getTopicBySlug } from '../lib/api'
import type { Lesson, Topic } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

export default function TopicDetailPage() {
  const { slug = '' } = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getTopicBySlug(slug).then((topicData) => {
      setTopic(topicData)
      if (topicData) {
        void getLessonsByTopicId(topicData.id).then(setLessons)
      }
    })
  }, [slug])

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,197,66,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-6xl animate-fadeIn px-6 pb-20 pt-32">
        <Link to="/learning" className="inline-flex items-center gap-2 text-sm text-teal">← Back to learning</Link>

        {topic ? (
          <>
            <section className="mt-6 rounded-3xl border border-teal/20 bg-deep-navy/80 p-8">
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
          </>
        ) : (
          <div className="mt-10 rounded-2xl bg-deep-navy p-8 text-slate-300">Topic not found.</div>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
