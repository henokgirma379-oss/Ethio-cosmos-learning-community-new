import { useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const resources = {
  Books: [
    'Cosmos by Carl Sagan',
    'Astrophysics for People in a Hurry by Neil deGrasse Tyson',
    'Welcome to the Universe by Neil deGrasse Tyson, Michael Strauss, and J. Richard Gott',
  ],
  Websites: [
    'NASA Solar System Exploration',
    'ESA Space for Kids',
    'Sky & Telescope',
  ],
  Tools: [
    'Stellarium',
    'Heavens-Above',
    'Celestia',
  ],
}

export default function ResourcesPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-32">
        <section className="rounded-3xl border border-white/10 bg-deep-navy/80 p-8 text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Astronomy Resources</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Keep learning with trusted books, websites, and tools that support self-study, classroom learning, and sky observation.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-3">
          {Object.entries(resources).map(([section, items]) => (
            <div key={section} className="rounded-3xl border border-white/10 bg-deep-navy/80 p-6">
              <h2 className="font-display text-3xl text-white">{section}</h2>
              <ul className="mt-5 space-y-3">
                {items.map((item) => (
                  <li key={item} className="rounded-2xl bg-navy/60 px-4 py-3 text-sm leading-7 text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
