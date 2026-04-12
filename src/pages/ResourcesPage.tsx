import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Scientists', path: '/scientists' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

const resourceCards = [
  {
    title: 'Learning paths',
    description: 'Move from beginner lessons to advanced topics using the structured astronomy curriculum already built into the site.',
    action: '/learning',
    label: 'Open learning hub',
  },
  {
    title: 'Visual materials',
    description: 'Use the materials area for images, videos, and downloadable documents that support classroom or personal study.',
    action: '/materials',
    label: 'View materials',
  },
  {
    title: 'Community discussion',
    description: 'Ask questions, share observations, and compare notes with other astronomy learners in the chat area.',
    action: '/chat',
    label: 'Join chat',
  },
]

const studyToolkit = [
  {
    title: 'Observation journal',
    text: 'Track date, time, sky conditions, visible objects, and questions that come up during each session.',
  },
  {
    title: 'Constellation checklist',
    text: 'Practice identifying bright constellations one season at a time instead of trying to learn the whole sky at once.',
  },
  {
    title: 'Question prompts',
    text: 'Ask what you see, how it moves, what causes it, and how astronomers verify that explanation.',
  },
  {
    title: 'Topic revision loop',
    text: 'Read a lesson, observe the sky, revisit the lesson, then take the related quiz to lock in understanding.',
  },
]

export default function ResourcesPage() {
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-24">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-sm text-teal">
              Practical support for learners
            </div>
            <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">Astronomy resources for study, practice, and community learning</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Use these resources to plan observations, review concepts, and connect site features into a smooth learning workflow.
            </p>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-deep-navy/80 p-4 backdrop-blur-sm">
            <img src="/topic_planets.svg" alt="Planet themed astronomy illustration" className="h-full w-full rounded-2xl object-cover" />
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {resourceCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
              <h2 className="font-display text-xl text-white">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
              <Link to={card.action} className="mt-5 inline-flex rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">
                {card.label}
              </Link>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
          <h2 className="font-display text-2xl text-white">Study toolkit</h2>
          <p className="mt-2 text-slate-400">A few habits and tools can make astronomy learning more consistent, especially for self-guided study.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {studyToolkit.map((item) => (
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
