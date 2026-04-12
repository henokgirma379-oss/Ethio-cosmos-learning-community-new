import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
  { label: 'Articles', path: '/articles' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

const explorationCollections = [
  {
    title: 'Solar System Tour',
    description: 'Compare rocky planets, gas giants, and icy worlds using quick facts on atmosphere, size, and orbital motion.',
    icon: '🪐',
    image: '/topic_solar_system.svg',
    cta: '/learning/solar-system',
    ctaLabel: 'Open topic',
  },
  {
    title: 'Moon and Eclipse Watch',
    description: 'Understand lunar phases, eclipses, and observation timing for skywatching sessions across Ethiopia.',
    icon: '🌙',
    image: '/topic_moon.svg',
    cta: '/learning/moon',
    ctaLabel: 'Study the Moon',
  },
  {
    title: 'Deep Sky Discoveries',
    description: 'Explore nebulae, star nurseries, and distant structures that reveal how the universe evolves.',
    icon: '🌌',
    image: '/topic_nebulae.svg',
    cta: '/learning/nebulae',
    ctaLabel: 'View deep sky',
  },
]

const observationHighlights = [
  {
    title: 'Best beginner targets',
    text: 'Start with the Moon, Orion, Venus, Jupiter, and bright star clusters before moving to fainter objects.',
  },
  {
    title: 'What to bring outside',
    text: 'A notebook, red-light flashlight, warm clothing, and a sky map can dramatically improve a learning session.',
  },
  {
    title: 'How to observe carefully',
    text: 'Record time, direction, brightness, and weather. Astronomy grows stronger when observations are compared over time.',
  },
]

const skyCalendar = [
  'Early evening: locate bright planets low in the western sky after sunset.',
  'Mid-evening: compare star colors and brightness in major constellations.',
  'Late night: watch how constellations shift westward as Earth rotates.',
]

export default function ExplorePage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-24">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-sm text-teal">
              Interactive astronomy discovery
            </div>
            <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">Explore the cosmos through guided observation and visual comparison</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              This space brings together astronomy topics, skywatching tips, and visual collections so learners can move from curiosity to confident observation.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/learning" className="rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950">
                Start exploring topics
              </Link>
              <Link to="/materials" className="rounded-lg border border-white/10 px-6 py-3 font-semibold text-slate-200 hover:border-teal/40 hover:text-teal">
                Open materials
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/80 p-4 backdrop-blur-sm">
            <img src="/topic_nebulae.svg" alt="Nebula inspired astronomy illustration" className="h-full w-full rounded-2xl object-cover" />
          </div>
        </section>

        <section className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-white">Featured exploration paths</h2>
              <p className="mt-2 max-w-2xl text-slate-400">Choose a theme and continue into the matching learning topic without leaving the current route structure.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {explorationCollections.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/90">
                <img src={item.image} alt={item.title} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="mt-4 font-display text-xl text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
                  <Link to={item.cta} className="mt-5 inline-flex rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">
                    {item.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
            <h2 className="font-display text-2xl text-white">Observation highlights</h2>
            <div className="mt-6 grid gap-4">
              {observationHighlights.map((item) => (
                <div key={item.title} className="rounded-2xl bg-navy/60 p-5">
                  <h3 className="font-display text-lg text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
            <h2 className="font-display text-2xl text-white">Simple night-sky routine</h2>
            <p className="mt-3 text-slate-400">Use this sequence during an evening session to build familiarity with motion, brightness, and orientation.</p>
            <div className="mt-6 space-y-4">
              {skyCalendar.map((item, index) => (
                <div key={item} className="flex gap-4 rounded-2xl bg-navy/60 p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal/15 font-display text-sm text-teal">
                    0{index + 1}
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
