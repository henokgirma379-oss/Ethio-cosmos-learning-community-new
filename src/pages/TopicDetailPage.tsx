import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { getLessonsByTopicId, getTopicBySlug } from '../lib/api'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import type { Lesson, Topic } from '../types'

export default function TopicDetailPage() {
  const { slug = '' } = useParams()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    void getTopicBySlug(slug).then((topicData) => {
      setTopic(topicData)
      if (topicData) {
        void getLessonsByTopicId(topicData.id).then(setLessons)
      }
    })
  }, [slug])

  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="gold">
      <main className="relative z-10 mx-auto max-w-6xl animate-fadeIn px-6 pb-20 pt-32">
        {/* Back Link */}
        <Link to="/learning" className="inline-flex items-center gap-2 text-sm text-teal transition-colors duration-200 hover:text-white">
          ← Back to learning
        </Link>

        {topic ? (
          <>
            {/* Topic Header */}
            <Card variant="default" borderStyle="teal" padding="lg" className="mt-6">
              <div className="text-5xl">{topic.icon}</div>
              <h1 className="mt-4 font-display text-4xl text-white">{topic.title}</h1>
              <div className="mt-4">
                <Badge variant="difficulty" difficulty={topic.difficulty} />
              </div>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{topic.description}</p>
            </Card>

            {/* Lessons List */}
            <section className="mt-10 space-y-4">
              {lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  to={`/learning/${slug}/${lesson.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-deep-navy/80 p-5 transition-all duration-300 hover:border-teal/30 hover:shadow-glow"
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
          <Card variant="default" borderStyle="default" padding="lg" className="mt-10">
            <div className="text-slate-300">Topic not found.</div>
          </Card>
        )}
      </main>
    </PageShell>
  )
}
