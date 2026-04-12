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
    title: 'The Milky Way as Seen from Ethiopia',
    description: 'Learn how altitude, low light pollution regions, and seasonal sky patterns make Ethiopian skies uniquely rewarding for Milky Way observation.',
  },
  {
    title: 'Understanding Solar Eclipses',
    description: 'A simple guide to how solar eclipses happen, what makes total eclipses special, and how to observe them safely.',
  },
  {
    title: 'Guide to Meteor Showers',
    description: 'Discover when meteor showers occur, why they happen, and how to maximize your chances of seeing them clearly.',
  },
]

export default function ArticlesPage() {
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
          <h1 className="font-display text-5xl font-extrabold text-white">Astronomy Articles</h1>
          <div className="mt-2 h-1 w-16 rounded-full bg-teal" />
          <p className="mt-4 max-w-2xl text-slate-300">
            Read short, accessible articles designed to expand your curiosity and strengthen your astronomy knowledge.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.title}
                className="rounded-2xl border border-white/10 bg-[#0a1628]/80 p-6 backdrop-blur-sm transition hover:border-teal/40 hover:shadow-[0_0_20px_rgba(0,200,200,0.1)]"
              >
                <div className="inline-flex rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                  Article
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold text-white">{article.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{article.description}</p>
                <button className="mt-6 rounded-xl bg-teal px-5 py-3 text-sm font-bold text-slate-950 hover:brightness-110">
                  Read More
                </button>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
