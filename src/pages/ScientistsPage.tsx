import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { getScientists } from '../lib/api'
import type { Scientist } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Articles', path: '/articles' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

export default function ScientistsPage() {
  const [scientists, setScientists] = useState<Scientist[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    const loadScientists = async () => {
      try {
        const data = await getScientists()
        setScientists(data)
      } catch (error) {
        console.error('Failed to load scientists:', error)
      } finally {
        setLoading(false)
      }
    }
    loadScientists()
  }, [])

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-24">
        <section className="mb-16">
          <div className="inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-sm text-teal">
            Astronomers & Pioneers
          </div>
          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Meet the Scientists Who Shaped Our Understanding of the Cosmos
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Discover the brilliant minds and groundbreaking discoveries that transformed astronomy and our view of the universe.
          </p>
        </section>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-deep-navy/50" />
            ))}
          </div>
        ) : (
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {scientists.map((scientist) => (
              <div
                key={scientist.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/90 transition-all hover:border-teal/40 hover:shadow-glow"
              >
                {scientist.portrait_url && (
                  <div className="overflow-hidden">
                    <img
                      src={scientist.portrait_url}
                      alt={scientist.name}
                      className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-2xl text-white">{scientist.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-teal">{scientist.contribution}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-300">{scientist.biography}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {!loading && scientists.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-deep-navy/90 p-12 text-center">
            <p className="text-slate-400">No scientists found.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
