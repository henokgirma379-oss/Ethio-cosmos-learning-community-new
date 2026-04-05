import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { useAuth } from '../context/AuthContext'
import { fallbackTopics } from '../data/fallbackData'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const tabs = ['About Page Content', 'Materials Manager', 'Chat Moderation', 'Topic Manager'] as const

export default function AdminPage() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('About Page Content')
  const [loginOpen, setLoginOpen] = useState(false)
  const [missionText, setMissionText] = useState('Update mission text here...')
  const [whoWeAreText, setWhoWeAreText] = useState('Update who-we-are content here...')
  const [selectedTopic, setSelectedTopic] = useState(fallbackTopics[0]?.slug ?? 'fundamentals')

  const currentTopic = useMemo(() => fallbackTopics.find((topic) => topic.slug === selectedTopic) ?? fallbackTopics[0], [selectedTopic])

  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto grid min-h-screen max-w-7xl animate-fadeIn gap-6 px-6 pb-10 pt-20 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-deep-navy/90 p-5">
          <h1 className="font-display text-2xl text-white">Admin Panel</h1>
          <div className="mt-6 space-y-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full rounded-2xl px-4 py-3 text-left transition ${activeTab === tab ? 'bg-teal text-slate-950' : 'bg-navy/60 text-slate-300 hover:text-teal'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </aside>

        <section className="rounded-3xl border border-white/10 bg-deep-navy/90 p-6">
          <h2 className="font-display text-3xl text-white">{activeTab}</h2>

          {activeTab === 'About Page Content' && (
            <div className="mt-8 space-y-8">
              <div className="rounded-2xl bg-navy/60 p-5">
                <h3 className="text-xl font-semibold text-white">Mission</h3>
                <textarea value={missionText} onChange={(event) => setMissionText(event.target.value)} className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
                <button onClick={() => toast.success('Mission content saved.')} className="mt-4 rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Mission</button>
              </div>
              <div className="rounded-2xl bg-navy/60 p-5">
                <h3 className="text-xl font-semibold text-white">Who We Are</h3>
                <textarea value={whoWeAreText} onChange={(event) => setWhoWeAreText(event.target.value)} className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" />
                <button onClick={() => toast.success('Who We Are content saved.')} className="mt-4 rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Section</button>
              </div>
            </div>
          )}

          {activeTab === 'Materials Manager' && (
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl bg-navy/60 p-5 text-slate-300">
                Manage image, video, and PDF uploads here. Integrate Supabase Storage buckets: materials, about-images, and chat-images.
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={() => toast.success('Image upload flow acknowledged.')} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Upload Image</button>
                  <button onClick={() => toast.success('Video upload flow acknowledged.')} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-200">Upload Video</button>
                  <button onClick={() => toast.success('PDF upload flow acknowledged.')} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-200">Upload PDF</button>
                </div>
              </div>
              <div className="rounded-2xl bg-navy/60 p-5 text-sm text-slate-400">
                Bucket targets: <span className="text-slate-200">materials</span>, <span className="text-slate-200">about-images</span>, <span className="text-slate-200">chat-images</span>
              </div>
            </div>
          )}

          {activeTab === 'Chat Moderation' && (
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl bg-navy/60 p-5 text-slate-300">
                Moderate chat content, review recent reports, and remove messages when needed. This panel is structured to connect to the messages table with admin privileges.
              </div>
              <div className="rounded-2xl border border-white/10 bg-deep-navy/70 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Sample moderation item</div>
                    <div className="mt-1 text-sm text-slate-400">Community message flagged for review</div>
                  </div>
                  <button onClick={() => toast.success('Message removed.')} className="rounded-lg bg-teal px-4 py-2 font-semibold text-slate-950">Remove</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Topic Manager' && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="rounded-2xl bg-navy/60 p-5">
                <label className="block text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Select Topic</label>
                <select value={selectedTopic} onChange={(event) => setSelectedTopic(event.target.value)} className="mt-4 w-full rounded-xl border border-white/10 bg-deep-navy px-4 py-3 text-white outline-none focus:border-teal">
                  {fallbackTopics.map((topic) => (
                    <option key={topic.id} value={topic.slug}>{topic.title}</option>
                  ))}
                </select>
              </div>
              <div className="rounded-2xl bg-navy/60 p-5 text-slate-300">
                <h3 className="text-xl font-semibold text-white">{currentTopic?.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{currentTopic?.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-slate-200">{currentTopic?.difficulty}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-slate-200">{currentTopic?.lesson_count} lessons</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => toast.success('Topic saved.')} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Topic</button>
                  <button onClick={() => toast.success('Lesson editor opened.')} className="rounded-lg border border-white/10 px-5 py-3 font-semibold text-slate-200">Manage Lessons</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
