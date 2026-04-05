import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import StarField from '../components/StarField'
import TopicCard from '../components/TopicCard'
import LoginModal from '../components/LoginModal'
import { getTopics } from '../lib/api'
import type { Topic } from '../types'

const homepageLinks = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
  { label: 'Articles', path: '/articles' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

const features = [
  {
    icon: '🔭',
    title: 'Discover the Cosmos',
    description: 'Explore stars, planets, galaxies and cosmic phenomena in accessible, engaging learning journeys.',
  },
  {
    icon: '🌍',
    title: 'Boost Your Stargazing',
    description: 'Practical stargazing skills optimized for Ethiopia’s clear skies, geography, and learner communities.',
  },
  {
    icon: '☄️',
    title: 'Stay Informed',
    description: 'Follow eclipses, meteor showers, alignments, and celestial events visible from Africa.',
  },
]

const featuredTopics = [
  {
    id: 'featured-1',
    slug: 'stargazing-basics',
    title: 'Stargazing Basics',
    description: 'How to read the night sky, find constellations, and use star maps with confidence.',
    difficulty: 'Beginner' as const,
    lesson_count: 6,
    icon: '🌠',
    color_accent: '#00c8c8',
    order_index: 1,
  },
  {
    id: 'featured-2',
    slug: 'key-astronomical-events',
    title: 'Key Astronomical Events',
    description: 'Lunar eclipses, meteor showers, planetary alignments, and what to watch for each season.',
    difficulty: 'Intermediate' as const,
    lesson_count: 7,
    icon: '🛰️',
    color_accent: '#f5c542',
    order_index: 2,
  },
  {
    id: 'featured-3',
    slug: 'telescope-selection-guide',
    title: 'Telescope Selection Guide',
    description: 'Choose, set up, and maintain your first telescope with practical recommendations.',
    difficulty: 'Beginner' as const,
    lesson_count: 5,
    icon: '🔭',
    color_accent: '#00c8c8',
    order_index: 3,
  },
]

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getTopics().then((data) => setTopics(data.slice(0, 3)))
  }, [])

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={homepageLinks} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 animate-fadeIn pt-24 md:pt-28">
        <section className="flex min-h-screen items-center px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-teal sm:text-sm">Discover the Cosmos</p>
            <h1 className="mt-6 font-display text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
              Explore the Universe From Ethiopia
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
              Learn astronomy, track celestial events, and connect with fellow stargazers across Africa through an inspiring, community-driven platform.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/learning"
                className="rounded-lg bg-teal px-8 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
              >
                Begin Your Journey
              </Link>
              <a
                href="#why-ethio-cosmos"
                className="rounded-lg border border-teal px-8 py-3 font-semibold text-teal transition-all duration-200 hover:scale-[1.02] hover:bg-teal/10"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section id="why-ethio-cosmos" className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl text-white sm:text-4xl">Why Ethio-Cosmos?</h2>
            <p className="mt-4 text-slate-400">A focused platform designed around learning, observation, and African astronomy community.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-white sm:text-4xl">Featured Learning Topics</h2>
              <p className="mt-4 max-w-2xl text-slate-400">Jump into curated content that helps beginners and curious learners build confidence in astronomy.</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(topics.length ? topics : featuredTopics).map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
