import { Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

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
                <textarea className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" defaultValue="Update mission text here..." />
                <button onClick={() => toast.success('Mission content saved.')} className="mt-4 rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Mission</button>
              </div>
              <div className="rounded-2xl bg-navy/60 p-5">
                <h3 className="text-xl font-semibold text-white">Who We Are</h3>
                <textarea className="mt-4 h-32 w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-white outline-none focus:border-teal" defaultValue="Update who-we-are content here..." />
                <button onClick={() => toast.success('Who We Are content saved.')} className="mt-4 rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Save Section</button>
              </div>
            </div>
          )}

          {activeTab === 'Materials Manager' && (
            <div className="mt-8 rounded-2xl bg-navy/60 p-5 text-slate-300">
              Manage image, video, and PDF uploads here. Integrate Supabase Storage buckets: materials, about-images, and chat-images.
              <div className="mt-4">
                <button onClick={() => toast.success('Materials manager ready for Supabase integration.')} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">Acknowledge Setup</button>
              </div>
            </div>
          )}

          {activeTab === 'Chat Moderation' && (
            <div className="mt-8 rounded-2xl bg-navy/60 p-5 text-slate-300">
              Moderate chat content, review recent reports, and remove messages when needed. This panel is structured to connect to the messages table with admin privileges.
            </div>
          )}

          {activeTab === 'Topic Manager' && (
            <div className="mt-8 rounded-2xl bg-navy/60 p-5 text-slate-300">
              Create, update, and organize topics and lessons here. Supabase tables required: topics and lessons with admin write policies.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
