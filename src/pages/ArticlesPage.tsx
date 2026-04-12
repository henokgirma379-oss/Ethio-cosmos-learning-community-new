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

const featuredArticles = [
  {
    title: 'Why dark skies matter for astronomy learning',
    summary: 'A practical introduction to light pollution, visibility, and why dark locations improve both naked-eye and telescope observation.',
    tag: 'Observation',
    image: '/topic_stars.svg',
  },
  {
    title: 'How astronomers measure cosmic distance',
    summary: 'Learn the ladder of distance measurement from parallax to standard candles and why scale is central to astronomy.',
    tag: 'Concepts',
    image: '/topic_fundamentals.svg',
  },
  {
    title: 'The Moon as a classroom laboratory',
    summary: 'Use lunar phases, surface features, and eclipse cycles to build astronomy skills with tools learners already have.',
    tag: 'Moon science',
    image: '/topic_moon.svg',
  },
]

const quickReads = [
  {
    title: 'What makes a planet different from a star?',
    text: 'Planets reflect light from a star, while stars generate energy in their cores through nuclear fusion.',
  },
  {
    title: 'Why do nebulae glow in different colors?',
    text: 'Gas composition, temperature, and nearby starlight influence the colors we observe in these vast clouds.',
  },
  {
    title: 'Can black holes be observed directly?',
    text: 'Not directly by emitted light, but astronomers detect them by how they bend light and affect nearby matter.',
  },
  {
    title: 'Why do constellations change with the season?',
    text: 'As Earth orbits the Sun, the nighttime side of Earth faces different directions into space at different times of year.',
  },
]

export default function ArticlesPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-24">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
              Reading space for learners
            </div>
            <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">Astronomy articles that turn complex ideas into clear, memorable explanations</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Browse short astronomy features, concept explainers, and observation-focused reading prompts designed for students and curious readers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/learning/fundamentals" className="rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950">
                Read with fundamentals
              </Link>
              <Link to="/explore" className="rounded-lg border border-white/10 px-6 py-3 font-semibold text-slate-200 hover:border-teal/40 hover:text-teal">
                Go to explore
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/80 p-4 backdrop-blur-sm">
            <img src="/topic_stars.svg" alt="Stylized star field illustration" className="h-full w-full rounded-2xl object-cover" />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl text-white">Featured reads</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredArticles.map((article) => (
              <article key={article.title} className="overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/90">
                <img src={article.image} alt={article.title} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <span className="rounded-full border border-white/10 bg-navy/60 px-3 py-1 text-xs uppercase tracking-[0.2em] text-teal">
                    {article.tag}
                  </span>
                  <h3 className="mt-4 font-display text-xl text-white">{article.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{article.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl text-white">Quick astronomy reads</h2>
              <p className="mt-2 text-slate-400">Short answers for common questions learners often ask during lessons and skywatching sessions.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {quickReads.map((item) => (
              <div key={item.title} className="rounded-2xl bg-navy/60 p-5">
                <h3 className="font-display text-lg text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
