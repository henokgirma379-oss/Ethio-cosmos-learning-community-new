import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import { getAboutContent } from '../lib/api'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import type { PageContent } from '../types'

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

  useEffect(() => {
    void getAboutContent('mission').then(setMission)
    void getAboutContent('who-we-are').then(setWhoWeAre)
  }, [])

  const missionText = mission.find((item) => item.content_type === 'text')?.content
  const missionImage = mission.find((item) => item.content_type === 'image')?.image_url
  const whoText = whoWeAre.find((item) => item.content_type === 'text')?.content
  const whoImages = whoWeAre
    .filter((item) => item.content_type === 'image')
    .map((item) => item.image_url)
    .filter(Boolean) as string[]

  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="default">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl text-white sm:text-5xl">Inspiring your passion for the cosmos</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Discover the mission, values, and educational spirit behind the Ethio-Cosmos Learning Community.
        </p>
        <div className="mx-auto mt-6 h-1 w-28 rounded-full bg-teal" />
      </section>

      {/* Mission Section */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-white">Our Mission</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            {missionText ?? 'Ethio-Cosmos is building a welcoming astronomy learning community rooted in curiosity, access, and African perspective.'}
          </p>
        </div>
        <Card variant="default" borderStyle="default" padding="md" className="overflow-hidden">
          {missionImage ? (
            <img src={missionImage} alt="Our mission" className="h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-72 items-center justify-center text-6xl text-slate-500">📷</div>
          )}
        </Card>
      </section>

      {/* Who We Are Section */}
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
              <div className="flex h-72 items-center justify-center rounded-3xl border border-white/10 bg-deep-navy text-5xl text-slate-500">
                🌌
              </div>
              <div className="flex h-72 items-center justify-center rounded-3xl border border-white/10 bg-deep-navy text-5xl text-slate-500">
                🔭
              </div>
            </>
          )}
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <h2 className="font-display text-3xl text-white">What We Offer</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offerCards.map((card) => (
            <Card key={card.title} variant="default" borderStyle="teal" padding="md">
              <div className="text-3xl">{card.icon}</div>
              <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
            </Card>
          ))}
        </div>
      </section>
    </PageShell>
  )
}
