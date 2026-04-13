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

const articles = [
  {
    title: 'How the Moon Shapes Observation Habits',
    description: 'A short guide to lunar phases, visibility, and how moonlight influences beginner stargazing sessions.',
  },
  {
    title: 'Why Nebulae Matter in the Story of Stars',
    description: 'Understand how gas clouds, stellar nurseries, and supernova remnants help scientists trace cosmic life cycles.',
  },
  {
    title: 'Learning Astronomy from Ethiopia’s Night Sky',
    description: 'An overview of how altitude, dark skies, and community curiosity create meaningful astronomy learning opportunities.',
  },
]

export default function ArticlesPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,197,66,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20 pt-24">
        <section className="rounded-3xl border border-white/10 bg-deep-navy/80 p-8 text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Articles & Insights</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Read short, approachable articles that connect astronomy concepts with observation, culture, and curiosity.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article key={article.title} className="rounded-3xl border border-white/10 bg-deep-navy/80 p-6 shadow-lg shadow-black/20">
              <div className="text-3xl">📰</div>
              <h2 className="mt-4 text-2xl font-semibold text-white">{article.title}</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">{article.description}</p>
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
