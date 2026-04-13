import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import TopicCard from '../components/TopicCard'
import LoginModal from '../components/LoginModal'
import { getTopics } from '../lib/api'
import type { Topic } from '../types'

const homepageLinks = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

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
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getTopics().then((data) => setTopics(data.slice(0, 3)))
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.18),_transparent_35%),linear-gradient(180deg,_rgba(5,10,26,0.75),_rgba(5,10,26,0.92))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={homepageLinks} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 animate-fadeIn pt-28 md:pt-32">
        <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-6 py-16">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal">EthioCosmos Learning Community</p>
            <h1 className="mt-6 font-display text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
              Explore the Universe with clarity, wonder, and community.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
              Learn astronomy through guided topics, practical materials, and a vibrant Ethiopian-centered learning journey built for curious minds.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/learning"
                className="rounded-lg bg-teal px-8 py-4 text-center font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
              >
                Start Learning
              </Link>
              <Link
                to="/materials"
                className="rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-center font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:border-teal/40 hover:text-teal"
              >
                Browse Materials
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-white sm:text-4xl">Why learners choose EthioCosmos</h2>
            <p className="mt-4 text-slate-300">A clean learning experience first — ready for future visual theming without breaking structure.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/30 bg-white p-6 shadow-xl shadow-black/10">
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-4 font-display text-2xl font-bold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-12">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-3xl text-white sm:text-4xl">Featured Topics</h2>
              <p className="mt-4 max-w-2xl text-slate-300">Start with three popular astronomy pathways designed for beginners and growing explorers.</p>
            </div>
            <Link to="/learning" className="font-semibold text-teal hover:text-white">
              View all topics →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
