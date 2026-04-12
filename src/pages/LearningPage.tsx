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
  Beginner: 'text-teal',
  Intermediate: 'text-yellow-300',
  Advanced: 'text-purple-300',
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
    void getTopics().then(setTopics).finally(() => setLoading(false))
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
      <div className="fixed inset-0 z-0 bg-black/55" />
      <div className="relative z-10">
        <Navbar links={NAV_LINKS} onOpenLogin={() => setLoginOpen(true)} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

        <main className="mx-auto max-w-4xl animate-fadeIn px-6 pb-24 pt-28">
          <div className="mb-2">
            <h1 className="font-display text-5xl font-extrabold text-white">Learning Hub</h1>
            <div className="mt-2 h-1 w-16 rounded-full bg-teal" />
          </div>
          <p className="mt-4 text-base text-slate-300">
            Expand your knowledge and explore the wonders of space. Start your learning journey with our comprehensive topics below.
          </p>

          <div className="mt-12 space-y-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-2xl bg-white/10" />
                ))
              : topics.map((topic) => {
                  const image = topic.image_url ?? topicFallbackImages[topic.slug]
                  return (
                    <Link
                      key={topic.id}
                      to={`/learning/${topic.slug}`}
                      className="group flex overflow-hidden rounded-2xl border border-white/15 bg-[#0a1628]/70 backdrop-blur-sm transition-all duration-300 hover:border-teal/50 hover:bg-[#0a1628]/90 hover:shadow-[0_0_25px_rgba(0,200,200,0.2)]"
                    >
                      <div className="relative w-52 flex-shrink-0 overflow-hidden sm:w-60">
                        {image ? (
                          <img
                            src={image}
                            alt={topic.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-800 text-5xl">
                            {topic.icon}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-center px-8 py-7">
                        <h2 className="font-display text-3xl font-bold text-white transition-colors group-hover:text-teal">
                          {topic.title}
                        </h2>
                        <p className="mt-3 text-base leading-7 text-slate-400">{topic.description}</p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                          <span className={difficultyColor[topic.difficulty]}>{topic.difficulty}</span>
                          <span>•</span>
                          <span>📖 {topic.lesson_count} lessons</span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
          </div>

          {!loading && topics.length > 0 && (
            <div className="mt-16 rounded-3xl border border-white/10 bg-[#0a1628]/70 p-12 text-center backdrop-blur-sm">
              <div className="text-5xl">📖✨</div>
              <h3 className="mt-5 font-display text-3xl font-bold text-white">Ready to Start Learning?</h3>
              <p className="mt-3 text-slate-400">Begin your astronomy journey today and unlock the mysteries of the universe.</p>
              <Link
                to={`/learning/${topics[0]?.slug}`}
                className="mt-7 inline-block rounded-xl bg-teal px-10 py-3 font-bold text-slate-950 hover:brightness-110"
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
