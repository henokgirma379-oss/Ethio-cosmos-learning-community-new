import { useState } from 'react'
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
    title: 'James Webb Deep Field Insights',
    description: 'See how ultra-distant galaxies help learners understand cosmic history, scale, and the early universe.',
    icon: '🔭',
  },
  {
    title: 'Black Hole Imaging Milestones',
    description: 'Explore how global collaboration turned radio observations into the first direct images of black hole shadows.',
    icon: '🕳️',
  },
  {
    title: 'Exoplanet Atmosphere Studies',
    description: 'Follow how scientists detect molecules in distant worlds and compare them to planetary processes in our solar system.',
    icon: '🪐',
  },
]

const learningPaths = [
  {
    title: 'Beginner Sky Explorer',
    steps: ['Fundamentals of Astronomy', 'Moon', 'Stars'],
  },
  {
    title: 'Solar System Builder',
    steps: ['Solar System', 'Planets', 'Asteroids'],
  },
  {
    title: 'Deep Space Thinker',
    steps: ['Nebulae', 'Black Holes', 'Wormholes'],
  },
]

export default function ExplorePage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,92,191,0.14),_transparent_32%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-24">
        <section className="rounded-3xl border border-white/10 bg-deep-navy/80 p-8 text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Explore Beyond the Basics</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Follow discoveries, revisit major breakthroughs, and choose guided learning paths tailored to your curiosity.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-3xl text-white">Featured Discoveries</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {discoveries.map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-deep-navy/80 p-6 shadow-lg shadow-black/20">
                <div className="text-3xl">{item.icon}</div>
                <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl text-white">Recommended Learning Paths</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {learningPaths.map((path) => (
              <div key={path.title} className="rounded-3xl border border-teal/20 bg-navy/70 p-6">
                <h3 className="text-2xl font-semibold text-white">{path.title}</h3>
                <ul className="mt-4 space-y-3 text-slate-300">
                  {path.steps.map((step, index) => (
                    <li key={step} className="flex items-center gap-3 rounded-2xl bg-deep-navy/70 px-4 py-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/15 text-sm font-semibold text-teal">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
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
