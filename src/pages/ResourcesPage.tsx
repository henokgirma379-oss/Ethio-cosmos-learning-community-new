import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { getResources } from '../lib/api'
import type { Resource } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Articles', path: '/articles' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

const typeIcons: Record<string, string> = {
  book: '📚',
  video: '🎥',
  website: '🌐',
  pdf: '📄',
  tool: '🛠️',
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await getResources()
        setResources(data)
      } catch (error) {
        console.error('Failed to load resources:', error)
      } finally {
        setLoading(false)
      }
    }
    loadResources()
  }, [])

  const types = Array.from(new Set(resources.map((r) => r.type)))
  const filteredResources = selectedType
    ? resources.filter((r) => r.type === selectedType)
    : resources

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-24">
        <section className="mb-16">
          <div className="inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-sm text-teal">
            Learning Resources
          </div>
          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Curated Tools & Materials for Astronomy Learning
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Explore a collection of books, videos, websites, and tools recommended by astronomy educators and enthusiasts.
          </p>
        </section>

        {types.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedType(null)}
                className={`rounded-full px-4 py-2 font-semibold transition-all ${
                  selectedType === null
                    ? 'bg-teal text-slate-950'
                    : 'border border-white/20 text-slate-300 hover:border-teal/40 hover:text-teal'
                }`}
              >
                All Resources
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-4 py-2 font-semibold transition-all ${
                    selectedType === type
                      ? 'bg-teal text-slate-950'
                      : 'border border-white/20 text-slate-300 hover:border-teal/40 hover:text-teal'
                  }`}
                >
                  {typeIcons[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </section>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-3xl bg-deep-navy/50" />
            ))}
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/90 p-6 transition-all hover:border-teal/40 hover:shadow-glow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-3xl">{typeIcons[resource.type]}</div>
                    <h3 className="mt-4 font-display text-xl text-white">{resource.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{resource.description}</p>
                  </div>
                </div>
                <div className="mt-5 inline-flex items-center text-sm font-semibold text-teal transition-all group-hover:gap-2">
                  Visit Resource
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </a>
            ))}
          </section>
        )}

        {!loading && filteredResources.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-deep-navy/90 p-12 text-center">
            <p className="text-slate-400">No resources found in this category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
