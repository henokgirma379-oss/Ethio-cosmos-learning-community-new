import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Scientists', path: '/scientists' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

const scientists = [
  {
    name: 'Benjamin Banneker',
    region: 'North America / African diaspora',
    focus: 'Astronomy, mathematics, almanac making',
    summary: 'Banneker used mathematical skill and celestial observation to produce almanacs and inspire generations of scientific learners.',
    accent: 'bg-teal/10 text-teal',
  },
  {
    name: 'Neil deGrasse Tyson',
    region: 'United States',
    focus: 'Astrophysics, science communication',
    summary: 'Tyson is known for translating astrophysics into accessible public learning through talks, books, and media.',
    accent: 'bg-gold/10 text-gold',
  },
  {
    name: 'Wandile Nkuhlu',
    region: 'South Africa',
    focus: 'Radio astronomy and science policy',
    summary: 'Nkuhlu has contributed to building scientific infrastructure and visibility for astronomy on the African continent.',
    accent: 'bg-cosmos-purple/20 text-purple-200',
  },
  {
    name: 'Thebe Medupe',
    region: 'South Africa',
    focus: 'Astrophysics, outreach, education',
    summary: 'Medupe combines astrophysics with public engagement, helping learners connect modern astronomy to African educational contexts.',
    accent: 'bg-teal/10 text-teal',
  },
]

const contributionAreas = [
  'Astrophysics and cosmology research',
  'Science communication and public outreach',
  'Observatory development and instrumentation',
  'Astronomy education in schools and communities',
]

export default function ScientistsPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-24">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-sm text-teal">
              People who expand our view of the universe
            </div>
            <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">Meet scientists and communicators who help astronomy reach more learners</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              This page highlights astronomers, educators, and science communicators whose work helps connect the cosmos to classrooms, observatories, and communities.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/learning/stars" className="rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950">
                Study stellar science
              </Link>
              <Link to="/articles" className="rounded-lg border border-white/10 px-6 py-3 font-semibold text-slate-200 hover:border-teal/40 hover:text-teal">
                Read articles
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/80 p-4 backdrop-blur-sm">
            <img src="/topic_fundamentals.svg" alt="Astronomy learning illustration" className="h-full w-full rounded-2xl object-cover" />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl text-white">Profiles to explore</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {scientists.map((scientist) => (
              <article key={scientist.name} className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl text-white">{scientist.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{scientist.region}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${scientist.accent}`}>
                    {scientist.focus}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-300">{scientist.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
          <h2 className="font-display text-2xl text-white">Where their impact is felt</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {contributionAreas.map((area, index) => (
              <div key={area} className="flex gap-4 rounded-2xl bg-navy/60 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/15 font-display text-sm text-teal">
                  0{index + 1}
                </div>
                <p className="text-sm leading-7 text-slate-300">{area}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
