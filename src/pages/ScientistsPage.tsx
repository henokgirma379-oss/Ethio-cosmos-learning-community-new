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
  { emoji: '🌍', name: 'Benjamin Banneker', field: 'Astronomy & Mathematics', years: '1731–1806', contribution: 'Calculated eclipse data, published almanacs, and promoted scientific learning for broader communities.' },
  { emoji: '✨', name: 'Wangari Maathai', field: 'Environmental Science', years: '1940–2011', contribution: 'Though not an astronomer, her scientific leadership and public education inspire African science engagement and stewardship.' },
  { emoji: '🛰️', name: 'Neil deGrasse Tyson', field: 'Astrophysics', years: '1958–present', contribution: 'Popularized astrophysics for global audiences through accessible talks, books, and public science outreach.' },
  { emoji: '🌌', name: 'Galileo Galilei', field: 'Observational Astronomy', years: '1564–1642', contribution: 'Used telescopes to observe moons of Jupiter, phases of Venus, and evidence that transformed astronomy.' },
  { emoji: '🔭', name: 'Vera Rubin', field: 'Galaxy Dynamics', years: '1928–2016', contribution: 'Provided strong evidence for dark matter through galaxy rotation studies.' },
  { emoji: '🧠', name: 'Katherine Johnson', field: 'Space Mathematics', years: '1918–2020', contribution: 'Calculated crucial orbital trajectories for NASA missions and advanced public recognition of women in science.' },
  { emoji: '☀️', name: 'Subrahmanyan Chandrasekhar', field: 'Stellar Physics', years: '1910–1995', contribution: 'Explained stellar evolution limits and laid foundations for black hole theory.' },
  { emoji: '🌠', name: 'Beth Brown', field: 'Astrophysics', years: '1969–2008', contribution: 'Researched elliptical galaxies and inspired students through science communication and mentorship.' },
]

export default function ScientistsPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,197,66,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-24">
        <section className="rounded-3xl border border-white/10 bg-deep-navy/80 p-8 text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Scientists Who Shaped Our View of the Universe</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Meet scientists, educators, and scientific pioneers whose work helps learners understand space, motion, matter, and discovery.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {scientists.map((scientist) => (
            <article key={scientist.name} className="rounded-3xl border border-white/10 bg-deep-navy/80 p-6 shadow-lg shadow-black/20">
              <div className="text-4xl">{scientist.emoji}</div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{scientist.name}</h2>
              <p className="mt-2 text-sm font-semibold text-teal">{scientist.field}</p>
              <p className="mt-1 text-sm text-slate-400">{scientist.years}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{scientist.contribution}</p>
            </article>
          ))}
        </section>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
