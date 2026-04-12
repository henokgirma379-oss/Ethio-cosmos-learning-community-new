import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import { getTopics } from '../lib/api'
import type { Topic } from '../types'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const difficultyColor: Record<Topic['difficulty'], string> = {
  Beginner: 'bg-teal/20 text-teal border-teal/30',
  Intermediate: 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30',
  Advanced: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
}

const topicFallbackImages: Record<string, string> = {
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

export default function LearningPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getTopics()
      .then(setTopics)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative min-h-screen text-white" style={{ background: '#06091b' }}>
      <div className="fixed inset-0 z-0">
        <img
          src="/topic_nebulae.svg"
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06091b]/80 via-[#06091b]/60 to-[#06091b]/90" />
      </div>

      <div className="relative z-10">
        <Navbar links={NAV_LINKS} onOpenLogin={() => setLoginOpen(true)} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

        <main className="mx-auto max-w-5xl animate-fadeIn px-6 pb-24 pt-28">
          <div className="mb-3">
            <h1 className="font-display text-5xl font-extrabold text-white">Learning Hub</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-teal" />
          </div>
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Expand your knowledge and explore the wonders of space. Start your learning journey with our comprehensive topics below.
          </p>

          <div className="mt-12 space-y-5">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-40 animate-pulse rounded-2xl bg-white/5" />
                ))
              : topics.map((topic) => {
                  const image = topicFallbackImages[topic.slug] ?? null
                  return (
                    <Link
                      key={topic.id}
                      to={`/learning/${topic.slug}`}
                      className="group flex overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-teal/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(0,200,200,0.15)]"
                    >
                      <div className="relative w-52 flex-shrink-0 overflow-hidden sm:w-64">
                        {image ? (
                          <img
                            src={image}
                            alt={topic.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-navy text-5xl">
                            {topic.icon}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#06091b]/80" />
                      </div>

                      <div className="flex flex-1 flex-col justify-center px-7 py-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-2xl">{topic.icon}</span>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${difficultyColor[topic.difficulty]}`}>
                            {topic.difficulty}
                          </span>
                        </div>
                        <h2 className="mt-3 font-display text-2xl font-bold text-white transition-colors group-hover:text-teal">
                          {topic.title}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{topic.description}</p>
                        <div className="mt-4 flex items-center gap-6 text-sm text-slate-500">
                          <span>📖 {topic.lesson_count} lessons</span>
                          <span className="text-teal opacity-0 transition-opacity group-hover:opacity-100">
                            Start learning →
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
          </div>

          {!loading && topics.length > 0 && (
            <div className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm">
              <div className="text-4xl">📖✨</div>
              <h3 className="mt-4 font-display text-2xl font-bold text-white">Ready to Start Learning?</h3>
              <p className="mt-2 text-slate-400">Begin your astronomy journey today and unlock the mysteries of the universe.</p>
              <Link
                to={`/learning/${topics[0]?.slug}`}
                className="mt-6 inline-block rounded-xl bg-teal px-8 py-3 font-bold text-slate-950 hover:brightness-110"
              >
                Start Exploring
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  )
}
