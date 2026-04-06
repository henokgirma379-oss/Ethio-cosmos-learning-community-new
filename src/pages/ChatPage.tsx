import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import OnlineCounter from '../components/OnlineCounter'
import StarField from '../components/StarField'
import { useAuth } from '../context/AuthContext'
import { getOnlineProfiles, getRecentMessages } from '../lib/api'
import { supabase } from '../lib/supabase'
import type { Message, Profile } from '../types'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

const demoMessages: Message[] = [
  {
    id: 'demo-1',
    user_id: 'demo-user-1',
    content: 'Selam everyone! What is the best way to start learning constellations from Ethiopia?',
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    profiles: {
      id: 'demo-user-1',
      username: 'SkyWatcher',
      avatar_url: null,
      role: 'user',
      created_at: new Date().toISOString(),
    },
  },
  {
    id: 'demo-2',
    user_id: 'demo-user-2',
    content: 'Try starting with Orion and using a monthly night sky map. It helps a lot.',
    image_url: null,
    created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    profiles: {
      id: 'demo-user-2',
      username: 'CosmosGuide',
      avatar_url: null,
      role: 'user',
      created_at: new Date().toISOString(),
    },
  },
]

export default function ChatPage() {
  const { profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([])
  const [input, setInput] = useState('')
  const [loginOpen, setLoginOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!profile) return

    let mounted = true
    let presenceInterval: ReturnType<typeof setInterval> | null = null

    const loadData = async () => {
      const [chatMessages, online] = await Promise.all([getRecentMessages(), getOnlineProfiles()])
      if (!mounted) return
      setMessages(chatMessages.length ? chatMessages : demoMessages)
      setOnlineUsers(online)
    }

    const updatePresence = async () => {
      if (!supabase) return
      const online = await getOnlineProfiles()
      if (!mounted) return
      setOnlineUsers(online)
    }

    void loadData()

    if (!supabase) {
      return () => {
        mounted = false
      }
    }

    void updatePresence()
    presenceInterval = setInterval(() => {
      void updatePresence()
    }, 60_000)

    const supabaseClient = supabase
    const channel = supabaseClient
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        const { data } = await supabaseClient
          .from('messages')
          .select('*, profiles(username, avatar_url, role, created_at, id)')
          .eq('id', payload.new.id)
          .single()

        if (data) {
          setMessages((prev) => [...prev, data as Message])
        }
      })
      .subscribe()

    return () => {
      mounted = false
      if (presenceInterval) clearInterval(presenceInterval)
      void supabaseClient.removeChannel(channel)
    }
  }, [profile])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const groupedMessages = useMemo(() => {
    return messages.reduce<Array<{ dateLabel: string; items: Message[] }>>((groups, message) => {
      const dateLabel = new Date(message.created_at).toLocaleDateString()
      const existingGroup = groups[groups.length - 1]
      if (existingGroup && existingGroup.dateLabel === dateLabel) {
        existingGroup.items.push(message)
        return groups
      }
      groups.push({ dateLabel, items: [message] })
      return groups
    }, [])
  }, [messages])

  const handleSend = async () => {
    if (!profile || (!input.trim() && !imagePreview)) return

    const optimisticMessage: Message = {
      id: crypto.randomUUID(),
      user_id: profile.id,
      content: input.trim() || null,
      image_url: imagePreview,
      created_at: new Date().toISOString(),
      profiles: profile,
    }

    if (!supabase) {
      setMessages((prev) => [...prev, optimisticMessage])
      setInput('')
      setImagePreview(null)
      return
    }

    const { error } = await supabase.from('messages').insert({
      user_id: profile.id,
      content: optimisticMessage.content,
      image_url: optimisticMessage.image_url,
    })

    if (error) {
      toast.error(error.message)
      return
    }

    setInput('')
    setImagePreview(null)
  }

  const handleImageUpload = async (file: File | undefined) => {
    if (!file || !profile) return

    const localPreview = URL.createObjectURL(file)

    if (!supabase) {
      setImagePreview(localPreview)
      toast.success('Demo image attached locally.')
      return
    }

    try {
      setUploading(true)
      const path = `${profile.id}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from('chat-images').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: publicUrlData } = supabase.storage.from('chat-images').getPublicUrl(data.path)
      setImagePreview(publicUrlData.publicUrl)
      toast.success('Image uploaded successfully.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image.')
    } finally {
      setUploading(false)
    }
  }

  if (!profile) {
    return (
      <div className="relative min-h-screen bg-space-black text-white">
        <StarField />
        <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-16">
          <div className="max-w-xl rounded-3xl border border-white/10 bg-deep-navy/90 p-10 text-center">
            <h1 className="font-display text-3xl text-white">Please sign in to join the community chat</h1>
            <p className="mt-4 text-lg leading-8 text-slate-300">Connect with fellow learners, ask astronomy questions, and share discoveries together.</p>
            <button onClick={() => setLoginOpen(true)} className="mt-8 rounded-lg bg-teal px-8 py-3 font-semibold text-slate-950">
              Sign In
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl animate-fadeIn gap-6 px-6 pb-8 pt-20">
        <aside className="hidden w-64 rounded-3xl border border-white/10 bg-deep-navy/90 p-5 lg:block">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-white">Online Now</h2>
            <OnlineCounter />
          </div>
          <div className="mt-6 space-y-3 overflow-y-auto">
            {(onlineUsers.length ? onlineUsers : [profile]).map((person) => (
              <div key={person.id} className="flex items-center gap-3 rounded-2xl bg-navy/60 px-4 py-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/20 text-teal">{(person.username ?? 'U')[0]}</div>
                <div>
                  <div className="text-sm font-semibold text-white">{person.username ?? 'Explorer'}</div>
                  <div className="text-xs text-slate-400">Active now</div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <section className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-deep-navy/90">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <h1 className="font-display text-2xl text-white">Community Chat</h1>
            <OnlineCounter />
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {groupedMessages.length ? (
              groupedMessages.map((group) => (
                <Fragment key={group.dateLabel}>
                  <div className="flex items-center gap-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                    <div className="h-px flex-1 bg-white/10" />
                    <span>{group.dateLabel}</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  {group.items.map((message) => {
                    const own = message.user_id === profile.id
                    return (
                      <div key={message.id} className={`max-w-3xl rounded-2xl p-4 ${own ? 'ml-auto bg-navy' : 'border border-white/5 bg-deep-navy'}`}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/20 text-teal">
                            {(message.profiles?.username ?? 'U')[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{message.profiles?.username ?? 'Community Member'}</div>
                            <div className="text-xs text-slate-400">{new Date(message.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                        {message.content && <p className="mt-4 text-slate-200">{message.content}</p>}
                        {message.image_url && (
                          <button className="mt-4" onClick={() => setLightbox(message.image_url)}>
                            <img src={message.image_url} alt="Shared upload" className="max-w-xs rounded-2xl" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </Fragment>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-navy/40 p-8 text-center text-slate-400">
                No messages yet. Be the first to say hello!
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="sticky bottom-0 border-t border-white/10 bg-deep-navy/95 px-4 py-4">
            {imagePreview && (
              <div className="mb-3 flex items-center gap-3">
                <img src={imagePreview} alt="Upload preview" className="h-16 w-16 rounded-xl object-cover" />
                <button onClick={() => setImagePreview(null)} className="text-sm text-slate-400 hover:text-teal">Remove</button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer rounded-xl bg-navy px-4 py-3 text-slate-300">
                {uploading ? '...' : '🖼️'}
                <input type="file" accept="image/*" className="hidden" onChange={(event) => void handleImageUpload(event.target.files?.[0])} />
              </label>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void handleSend()
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-white/10 bg-navy px-4 py-3 text-white outline-none focus:border-teal"
              />
              <button
                onClick={() => void handleSend()}
                disabled={!input.trim() && !imagePreview}
                className="rounded-xl bg-teal px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </main>

      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Expanded upload" className="max-h-[85vh] max-w-full rounded-3xl" />
        </div>
      )}

      <Footer />
    </div>
  )
}
