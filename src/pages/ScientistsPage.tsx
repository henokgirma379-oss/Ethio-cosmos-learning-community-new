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

const scientists = [
  { name: 'Galileo Galilei', years: '1564–1642', field: 'Observational Astronomy', contribution: 'Improved the telescope and confirmed the heliocentric model through direct observation of Jupiter\'s moons and Venus\'s phases.', emoji: '🔭' },
  { name: 'Johannes Kepler', years: '1571–1630', field: 'Orbital Mechanics', contribution: 'Formulated the three laws of planetary motion, showing orbits are ellipses — not circles.', emoji: '🪐' },
  { name: 'Isaac Newton', years: '1643–1727', field: 'Physics & Gravitation', contribution: 'Derived the law of universal gravitation, explaining why planets orbit the Sun.', emoji: '🍎' },
  { name: 'Edwin Hubble', years: '1889–1953', field: 'Extragalactic Astronomy', contribution: 'Proved galaxies exist beyond the Milky Way and discovered the expanding universe.', emoji: '🌌' },
  { name: 'Carl Sagan', years: '1934–1996', field: 'Planetary Science & Science Communication', contribution: 'Pioneered public science education and contributed to planetary exploration missions.', emoji: '🌠' },
  { name: 'Vera Rubin', years: '1928–2016', field: 'Dark Matter Research', contribution: 'Provided the first compelling observational evidence for the existence of dark matter.', emoji: '🌑' },
  { name: 'Annie Jump Cannon', years: '1863–1941', field: 'Stellar Classification', contribution: 'Created the Harvard spectral classification system, cataloguing over 350,000 stars.', emoji: '⭐' },
  { name: 'Katherine Johnson', years: '1918–2020', field: 'Orbital Mechanics & Space Math', contribution: 'Calculated the flight trajectories for NASA\'s Apollo 11 Moon landing and many other missions.', emoji: '🚀' },
]

export default function ScientistsPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: 'url(/topic_nebulae.svg)',
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
          <h1 className="font-display text-5xl font-extrabold text-white">Pioneering Scientists</h1>
          <div className="mt-2 h-1 w-16 rounded-full bg-teal" />
          <p className="mt-4 text-slate-300">The brilliant minds who unlocked our understanding of the cosmos.</p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scientists.map((s) => (
              <div key={s.name} className="rounded-2xl border border-white/10 bg-[#0a1628]/80 p-6 backdrop-blur-sm transition hover:border-teal/30">
                <div className="text-4xl">{s.emoji}</div>
                <h3 className="mt-4 font-display text-xl font-bold text-white">{s.name}</h3>
                <p className="mt-1 text-sm text-teal">{s.field}</p>
                <p className="text-xs text-slate-500">{s.years}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{s.contribution}</p>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
