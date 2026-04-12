import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
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
    <div className="relative min-h-screen bg-[#05091a] text-white">
      <StarField />
      <Navbar links={NAV_LINKS} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero_stargazer.svg"
            alt="Stargazer with telescope under the Milky Way"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05091a] via-[#05091a]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05091a] via-transparent to-[#05091a]/30" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-28">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-teal">
            🇪🇹 Ethiopian Astronomy Community
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-5xl font-extrabold leading-[1.1] text-white sm:text-6xl lg:text-7xl">
            Ethio-Cosmos<br />
            <span className="text-teal">Learning Community</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Your gateway to astronomy exploration & learning. Discover the universe from Ethiopia.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/learning"
              className="rounded-xl bg-teal px-10 py-4 text-base font-bold text-slate-950 transition hover:brightness-110 hover:scale-[1.02]"
            >
              Begin Your Journey
            </Link>
            <Link
              to="/about"
              className="rounded-xl border border-white/30 px-10 py-4 text-base font-semibold text-white transition hover:border-teal/50 hover:bg-white/5"
            >
              Learn More
            </Link>
          </div>

          <div className="mt-20 grid gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal/20 text-2xl">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{f.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold text-white">Featured Learning Topics</h2>
            <p className="mt-2 text-slate-400">Essential Lessons &amp; Guides</p>
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

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-teal/20 bg-deep-navy p-14 text-center">
          <div className="absolute inset-0 opacity-15">
            <img
              src="/cta_cosmos.svg"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Ready to Explore the Cosmos?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Join the EthioCosmos community — learn astronomy, connect with stargazers, and discover the universe.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/learning" className="rounded-xl bg-teal px-8 py-3 font-bold text-slate-950 hover:brightness-110">
                Start Learning Free
              </Link>
              <Link to="/chat" className="rounded-xl border border-white/20 px-8 py-3 font-semibold text-white hover:border-teal/40 hover:text-teal">
                Join Community Chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
