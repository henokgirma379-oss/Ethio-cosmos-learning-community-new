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

const resources = [
  { category: 'Books', icon: '📖', items: [
    { title: 'Cosmos by Carl Sagan', description: 'A timeless introduction to the universe for every age.', link: 'https://www.goodreads.com/book/show/55030.Cosmos' },
    { title: 'A Brief History of Time', description: 'Stephen Hawking explains black holes, the Big Bang, and time itself.', link: 'https://www.goodreads.com/book/show/3869.A_Brief_History_of_Time' },
    { title: 'Astrophysics for People in a Hurry', description: 'Neil deGrasse Tyson makes the universe digestible in one sitting.', link: 'https://www.goodreads.com/book/show/32191710-astrophysics-for-people-in-a-hurry' },
  ]},
  { category: 'Websites', icon: '🌐', items: [
    { title: 'NASA Astronomy Picture of the Day', description: 'Daily stunning space images with expert explanations.', link: 'https://apod.nasa.gov' },
    { title: 'Sky & Telescope', description: 'News, guides, and tools for stargazers worldwide.', link: 'https://skyandtelescope.org' },
    { title: 'Stellarium Web', description: 'Free online planetarium — see tonight\'s sky from any location.', link: 'https://stellarium-web.org' },
  ]},
  { category: 'Tools', icon: '🔭', items: [
    { title: 'Heavens Above', description: 'Real-time satellite tracking, ISS passes, and sky charts.', link: 'https://heavens-above.com' },
    { title: 'Celestia', description: 'Free 3D space simulator for exploring the universe at any scale.', link: 'https://celestia.space' },
    { title: 'WorldWide Telescope', description: 'NASA-backed interactive telescope viewer with guided tours.', link: 'https://worldwidetelescope.org' },
  ]},
]

export default function ResourcesPage() {
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

        <main className="mx-auto max-w-5xl animate-fadeIn px-6 pb-24 pt-28">
          <h1 className="font-display text-5xl font-extrabold text-white">Learning Resources</h1>
          <div className="mt-2 h-1 w-16 rounded-full bg-teal" />
          <p className="mt-4 text-slate-300">Curated books, websites, and tools to deepen your astronomy knowledge.</p>

          <div className="mt-12 space-y-14">
            {resources.map((group) => (
              <div key={group.category}>
                <h2 className="flex items-center gap-3 font-display text-2xl font-bold text-white">
                  <span>{group.icon}</span> {group.category}
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {group.items.map((item) => (
                    <a
                      key={item.title}
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-white/10 bg-[#0a1628]/80 p-5 backdrop-blur-sm transition hover:border-teal/40 hover:shadow-[0_0_20px_rgba(0,200,200,0.1)]"
                    >
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                      <div className="mt-4 text-sm font-semibold text-teal">Visit →</div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
