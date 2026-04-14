import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import { getAboutContent } from '../lib/api'
import type { PageContent } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const offerCards = [
  {
    icon: '📘',
    title: 'Educational Content',
    description: 'Structured astronomy lessons from beginner to advanced, crafted for clarity and curiosity.',
  },
  {
    icon: '🔭',
    title: 'Stargazing Tips',
    description: 'Practical guides for observing the sky from Ethiopia with confidence and wonder.',
  },
  {
    icon: '🗂️',
    title: 'Astronomy Resources',
    description: 'Curated PDFs, videos, and tools for deeper learning and community discovery.',
  },
]

export default function AboutPage() {
  const [mission, setMission] = useState<PageContent[]>([])
  const [whoWeAre, setWhoWeAre] = useState<PageContent[]>([])
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getAboutContent('mission').then(setMission)
    void getAboutContent('who-we-are').then(setWhoWeAre)
  }, [])

  const missionText = mission.find((item) => item.content_type === 'text')?.content
  const missionImage = mission.find((item) => item.content_type === 'image')?.image_url
  const whoText = whoWeAre.find((item) => item.content_type === 'text')?.content
  const whoImages = whoWeAre.filter((item) => item.content_type === 'image').map((item) => item.image_url).filter(Boolean) as string[]

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 animate-fadeIn pt-32">
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Inspiring your passion for the cosmos</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Discover the mission, values, and educational spirit behind the Ethio-Cosmos Learning Community.
          </p>
          <div className="mx-auto mt-6 h-1 w-28 rounded-full bg-teal" />
        </section>

        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white">Our Mission</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              {missionText ?? 'Ethio-Cosmos is building a welcoming astronomy learning community rooted in curiosity, access, and African perspective.'}
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-deep-navy">
            {missionImage ? (
              <img src={missionImage} alt="Our mission" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-72 items-center justify-center text-6xl text-slate-500">📷</div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-display text-3xl text-white">Who We Are</h2>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            {whoText ?? 'We are learners, stargazers, educators, and builders committed to opening doors into astronomy for Ethiopian and African communities.'}
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {whoImages.length ? (
              whoImages.map((image, index) => (
                <img key={index} src={image} alt={`Who we are ${index + 1}`} className="h-72 w-full rounded-3xl object-cover" />
              ))
            ) : (
              <>
                <div className="flex h-72 items-center justify-center rounded-3xl border border-white/10 bg-deep-navy text-5xl text-slate-500">🌌</div>
                <div className="flex h-72 items-center justify-center rounded-3xl border border-white/10 bg-deep-navy text-5xl text-slate-500">🔭</div>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="font-display text-3xl text-white">What We Offer</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offerCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-teal/20 bg-deep-navy/80 p-6">
                <div className="text-3xl">{card.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
