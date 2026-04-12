import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import TopicCard from '../components/TopicCard'
import { getTopics } from '../lib/api'
import type { Topic } from '../types'

const NAV_LINKS = [
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
    description: 'Learn about stars, planets, galaxies, and more through structured, beginner-friendly lessons.',
  },
  {
    icon: '🌠',
    title: 'Boost Your Stargazing',
    description: 'Skywatching tips and guides for beginners and enthusiasts observing from African skies.',
  },
  {
    icon: '📚',
    title: 'Stay Informed',
    description: 'News, guides, and resources on everything space — eclipses, meteor showers, and more.',
  },
]

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getTopics().then((data) => setTopics(data.slice(0, 3)))
  }, [])

  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=90)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="fixed inset-0 z-0 bg-black/50" />

      <div className="relative z-10">
        <Navbar links={NAV_LINKS} onOpenLogin={() => setLoginOpen(true)} />
        <SecondaryNavbar />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

        <section className="relative flex min-h-screen items-center px-6 pt-28">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.4em] text-teal">
                🇪🇹 Ethiopian Astronomy Community
              </p>
              <h1 className="mt-5 font-display text-5xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl">
                Ethio-Cosmos
                <br />
                <span className="text-teal">Learning Community</span>
              </h1>
              <p className="mt-6 text-xl italic text-slate-200">
                Your Gateway to Astronomy Exploration &amp; Learning
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/learning"
                  className="rounded-lg border-2 border-white/60 bg-[#0d1f3c]/80 px-8 py-3 text-base font-bold text-white backdrop-blur-sm transition hover:border-white hover:bg-[#0d1f3c]"
                >
                  Begin Your Journey
                </Link>
                <Link
                  to="/about"
                  className="rounded-lg border-2 border-white/40 bg-[#0d1f3c]/60 px-8 py-3 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white/70"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-10 pt-4">
          <div className="grid gap-5 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-white/90 p-6 text-slate-900 shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                    {f.icon}
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-900">{f.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24 pt-12">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-4xl font-extrabold text-white drop-shadow">
                Featured Learning Topics
              </h2>
              <p className="mt-2 text-slate-300">Essential Lessons &amp; Guides</p>
            </div>
            <Link to="/learning" className="text-sm font-semibold text-teal hover:underline">
              View all topics →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}
