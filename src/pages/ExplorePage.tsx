import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const discoveries = [
  {
    title: 'Solar System Wonders',
    description: 'Compare planets, moons, and the Sun through a guided introduction to our home system.',
    image: '/topic_solar_system.svg',
    path: '/learning/solar-system',
  },
  {
    title: 'Nebulae and Star Birth',
    description: 'Explore stellar nurseries and discover how new stars emerge from cosmic clouds.',
    image: '/topic_nebulae.svg',
    path: '/learning/nebulae',
  },
  {
    title: 'The Mystery of Black Holes',
    description: 'Dive into the science of extreme gravity, event horizons, and warped spacetime.',
    image: '/topic_black_holes.svg',
    path: '/learning/black-holes',
  },
]

const paths = [
  {
    title: 'Beginner Path',
    description: 'Start with fundamentals, move through the solar system, and build a strong astronomy foundation.',
    cta: '/learning/fundamentals',
  },
  {
    title: 'Advanced Path',
    description: 'Go deeper into stars, nebulae, black holes, and theoretical ideas shaping modern astrophysics.',
    cta: '/learning/stars',
  },
]

export default function ExplorePage() {
  const [loginOpen, setLoginOpen] = useState(false)

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
        <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

        <main className="mx-auto max-w-6xl animate-fadeIn px-6 pb-24 pt-28">
          <h1 className="font-display text-5xl font-extrabold text-white">Explore the Universe</h1>
          <div className="mt-2 h-1 w-16 rounded-full bg-teal" />
          <p className="mt-4 max-w-2xl text-slate-300">
            Follow curated discovery themes and learning paths designed to help you navigate astronomy with confidence.
          </p>

          <section className="mt-12">
            <h2 className="font-display text-3xl font-bold text-white">Featured Discoveries</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {discoveries.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a1628]/80 backdrop-blur-sm transition hover:border-teal/40 hover:shadow-[0_0_20px_rgba(0,200,200,0.1)]"
                >
                  <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{item.description}</p>
                    <div className="mt-4 text-sm font-semibold text-teal">Explore →</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-3xl font-bold text-white">Recommended Learning Paths</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {paths.map((path) => (
                <div key={path.title} className="rounded-2xl border border-white/10 bg-[#0a1628]/80 p-6 backdrop-blur-sm">
                  <h3 className="font-display text-2xl font-bold text-white">{path.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{path.description}</p>
                  <Link
                    to={path.cta}
                    className="mt-6 inline-block rounded-xl bg-teal px-5 py-3 text-sm font-bold text-slate-950 hover:brightness-110"
                  >
                    Start Path
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}
