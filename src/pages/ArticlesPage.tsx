import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { getArticles } from '../lib/api'
import type { Article } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Articles', path: '/articles' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await getArticles()
        setArticles(data)
      } catch (error) {
        console.error('Failed to load articles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticles()
  }, [])

  const categories = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))
  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-24">
        <section className="mb-16">
          <div className="inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-sm text-teal">
            Astronomy News & Insights
          </div>
          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Discover the Latest in Astronomy
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Stay updated with groundbreaking discoveries, space missions, and insights from the astronomy community.
          </p>
        </section>

        {categories.length > 0 && (
          <section className="mb-12">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-4 py-2 font-semibold transition-all ${
                  selectedCategory === null
                    ? 'bg-teal text-slate-950'
                    : 'border border-white/20 text-slate-300 hover:border-teal/40 hover:text-teal'
                }`}
              >
                All Articles
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-teal text-slate-950'
                      : 'border border-white/20 text-slate-300 hover:border-teal/40 hover:text-teal'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>
        )}

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-deep-navy/50" />
            ))}
          </div>
        ) : (
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/90 transition-all hover:border-teal/40 hover:shadow-glow"
              >
                {article.thumbnail_url && (
                  <div className="overflow-hidden">
                    <img
                      src={article.thumbnail_url}
                      alt={article.title}
                      className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  {article.category && (
                    <div className="mb-3 inline-flex rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
                      {article.category}
                    </div>
                  )}
                  <h3 className="font-display text-xl text-white">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{article.summary}</p>
                  {article.author && (
                    <p className="mt-4 text-xs text-slate-400">By {article.author}</p>
                  )}
                  <button className="mt-5 inline-flex rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 transition-all hover:bg-teal/90">
                    Read Article
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-deep-navy/90 p-12 text-center">
            <p className="text-slate-400">No articles found in this category.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
