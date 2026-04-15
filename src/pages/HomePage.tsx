import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import TopicCard from '../components/TopicCard'
import SectionHeader from '../components/SectionHeader'
import Card from '../components/Card'
import { getHomeContent, getTopics } from '../lib/api'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import { fallbackHomeContent, type HomeContentValues } from '../lib/homeContent'
import type { Topic } from '../types'

const features = [
  {
    icon: '🔭',
    title: 'Discover the Cosmos',
    description: 'Explore structured astronomy lessons designed to grow confidence from first curiosity to deep understanding.',
  },
  {
    icon: '🌍',
    title: 'Learn from Ethiopia',
    description: 'Connect astronomy learning to Ethiopian skies, regional observation culture, and community discovery.',
  },
  {
    icon: '☄️',
    title: 'Study Together',
    description: 'Join a welcoming learning space with materials, guided lessons, and a live community chat experience.',
  },
]

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [homeContent, setHomeContent] = useState<HomeContentValues>(fallbackHomeContent)

  useEffect(() => {
    const loadHomePage = async () => {
      const [topicsData, contentData] = await Promise.all([getTopics(), getHomeContent()])
      setTopics(topicsData.slice(0, 3))
      setHomeContent(contentData)
    }

    void loadHomePage()
  }, [])

  const primaryCtaPath = homeContent.primaryCtaPath || fallbackHomeContent.primaryCtaPath
  const secondaryCtaPath = homeContent.secondaryCtaPath || fallbackHomeContent.secondaryCtaPath

  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="teal">
      <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-16">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal">{homeContent.eyebrow}</p>
          <h1 className="mt-6 font-display text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            {homeContent.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            {homeContent.subtitle}
          </p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
            {homeContent.intro}
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              to={primaryCtaPath}
              className="inline-flex items-center justify-center rounded-lg bg-teal px-8 py-4 text-center font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95"
            >
              {homeContent.primaryCtaLabel}
            </Link>
            <Link
              to={secondaryCtaPath}
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-center font-semibold text-white transition-all duration-200 hover:border-teal/40 hover:text-teal active:bg-white/10"
            >
              {homeContent.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeader
          title={homeContent.featuresTitle}
          description={homeContent.featuresDescription}
          align="center"
          size="md"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} variant="light" padding="md">
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">{homeContent.featuredTopicsTitle}</h2>
            <p className="mt-4 max-w-2xl text-slate-300">{homeContent.featuredTopicsDescription}</p>
          </div>
          <Link to="/learning" className="font-semibold text-teal hover:text-white">
            View all topics →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.length ? (
            topics.map((topic) => <TopicCard key={topic.id} topic={topic} variant="light" />)
          ) : (
            <Card variant="light" padding="md" className="md:col-span-2 lg:col-span-3">
              <h3 className="font-display text-2xl font-bold text-slate-900">Topics are being prepared</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                We could not load featured topics right now, but you can still explore the rest of the platform safely.
              </p>
            </Card>
          )}
        </div>
      </section>
    </PageShell>
  )
}
