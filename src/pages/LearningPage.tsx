import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import LoadingSkeleton from '../components/LoadingSkeleton'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import TopicCard from '../components/TopicCard'
import { getTopics } from '../lib/api'
import type { Topic } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Scientists', path: '/scientists' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

export default function LearningPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getTopics()
      .then(setTopics)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-20">
        <section className="py-16 text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Explore the Universe</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Dive into structured astronomy lessons, African sky knowledge, and space science pathways from beginner to advanced.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? <LoadingSkeleton count={6} /> : topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)}
        </section>
      </main>

      <Footer />
    </div>
  )
}
