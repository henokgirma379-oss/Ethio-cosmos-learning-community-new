import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import { getTopics } from '../lib/api'
import type { Topic } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const fallbackTopicImages: Record<string, string> = {
  fundamentals: '/topic_fundamentals.svg',
  ethiopia: '/topic_ethiopia.svg',
  'solar-system': '/topic_solar_system.svg',
  planets: '/topic_planets.svg',
  moon: '/topic_moon.svg',
  stars: '/topic_stars.svg',
  'black-holes': '/topic_black_holes.svg',
  wormholes: '/topic_wormholes.svg',
  nebulae: '/topic_nebulae.svg',
  asteroids: '/topic_asteroids.svg',
}

const getTopicImage = (topic: Topic) => topic.image_url || fallbackTopicImages[topic.slug] || '/topic_fundamentals.svg'

export default function LearningPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getTopics().then(setTopics)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,197,66,0.14),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.78),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-32">
        <section className="py-12">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Explore the Universe</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Dive into structured astronomy pathways with large, readable topic cards designed for quick discovery and easy learning access.
          </p>
        </section>

        <section className="space-y-6">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/learning/${topic.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/85 shadow-xl shadow-black/20 transition-all duration-300 hover:border-teal/30 hover:shadow-glow lg:flex-row"
            >
              <div className="h-64 w-full overflow-hidden bg-navy lg:h-auto lg:w-80">
                <img src={getTopicImage(topic)} alt={topic.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-3xl">{topic.icon}</span>
                    <span className="rounded-full border border-white/10 bg-navy/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-teal">
                      {topic.difficulty}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-3xl text-white">{topic.title}</h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{topic.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm">
                  <span className="rounded-full border border-white/10 px-4 py-2 text-slate-200">{topic.lesson_count} lessons</span>
                  <span className="font-semibold text-teal transition-transform group-hover:translate-x-1">Open topic →</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {topics[0] && (
          <section className="mt-12">
            <div className="rounded-3xl border border-teal/20 bg-navy/70 p-8 text-center shadow-lg shadow-black/20">
              <h2 className="font-display text-3xl text-white">Ready to begin?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-300">Start with the first topic and build a strong astronomy foundation step by step.</p>
              <Link to={`/learning/${topics[0].slug}`} className="mt-6 inline-block rounded-lg bg-teal px-8 py-4 font-semibold text-slate-950">
                Start with {topics[0].title}
              </Link>
            </div>
          </section>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
