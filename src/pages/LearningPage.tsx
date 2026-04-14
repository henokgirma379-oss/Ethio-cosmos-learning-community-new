import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import TopicCard from '../components/TopicCard'
import Card from '../components/Card'
import { getTopics } from '../lib/api'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import type { Topic } from '../types'

export default function LearningPage() {
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    void getTopics().then(setTopics)
  }, [])

  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="gold">
      {/* Header Section */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="font-display text-4xl text-white sm:text-5xl">Explore the Universe</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Dive into structured astronomy pathways with large, readable topic cards designed for quick discovery and easy learning access.
        </p>
      </section>

      {/* Topics List */}
      <section className="mx-auto max-w-7xl space-y-6 px-6 pb-12">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} variant="dark" />
        ))}
      </section>

      {/* CTA Section */}
      {topics[0] && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <Card variant="default" borderStyle="teal" padding="lg" className="text-center">
            <h2 className="font-display text-3xl text-white">Ready to begin?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">Start with the first topic and build a strong astronomy foundation step by step.</p>
            <Link
              to={`/learning/${topics[0].slug}`}
              className="mt-6 inline-block rounded-lg bg-teal px-8 py-4 font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110"
            >
              Start with {topics[0].title}
            </Link>
          </Card>
        </section>
      )}
    </PageShell>
  )
}
