import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import { getMaterials } from '../lib/api'
import type { Material } from '../types'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

type ModalState =
  | { type: 'gallery'; index: number }
  | { type: 'video'; url: string; title: string }
  | { type: 'pdf'; url: string; title: string }
  | null

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [modal, setModal] = useState<ModalState>(null)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    void getMaterials().then(setMaterials)
  }, [])

  const images = useMemo(() => materials.filter((m) => m.type === 'image'), [materials])
  const videos = useMemo(() => materials.filter((m) => m.type === 'video'), [materials])
  const pdfs = useMemo(() => materials.filter((m) => m.type === 'pdf'), [materials])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModal(null)
      if (modal?.type === 'gallery' && images.length) {
        if (e.key === 'ArrowRight') setModal({ type: 'gallery', index: (modal.index + 1) % images.length })
        if (e.key === 'ArrowLeft') setModal({ type: 'gallery', index: (modal.index - 1 + images.length) % images.length })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal, images])

  return (
    <div
      className="relative min-h-screen text-white"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=90)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="fixed inset-0 z-0 bg-black/55" />
      <div className="relative z-10">
        <Navbar links={NAV_LINKS} onOpenLogin={() => setLoginOpen(true)} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

        <main className="mx-auto max-w-2xl animate-fadeIn px-6 pb-24 pt-28">
          <div className="mb-12 text-center">
            <h1 className="font-display text-5xl font-extrabold text-white drop-shadow-lg">
              Our Materials
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base text-slate-300">
              Explore and access our collection of resources related to space science and astronomy.
            </p>
          </div>

          <div className="space-y-8">
            <div className="rounded-2xl border border-teal/40 bg-[#0a1628]/80 p-6 shadow-[0_0_30px_rgba(0,200,200,0.15)] backdrop-blur-sm">
              <h2 className="mb-5 text-center font-display text-2xl font-bold text-white">Image Gallery</h2>
              <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-xl">
                {images.length >= 1
                  ? images.slice(0, 4).map((img) => (
                      <div key={img.id} className="relative overflow-hidden" style={{ paddingTop: '75%' }}>
                        <img
                          src={img.thumbnail_url ?? img.url}
                          alt={img.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                    ))
                  : Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="aspect-square bg-slate-800/60" />
                    ))}
              </div>
              <p className="mt-5 text-center text-sm text-slate-300">Browse Our Photos</p>
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => images.length && setModal({ type: 'gallery', index: 0 })}
                  className="rounded-lg border border-teal/60 bg-transparent px-10 py-2 text-sm font-semibold text-teal transition hover:bg-teal/10"
                >
                  View Gallery
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-teal/40 bg-[#0a1628]/80 p-6 shadow-[0_0_30px_rgba(0,200,200,0.15)] backdrop-blur-sm">
              <h2 className="mb-5 text-center font-display text-2xl font-bold text-white">Video Collection</h2>
              <div className="relative overflow-hidden rounded-xl bg-black" style={{ aspectRatio: '16/9' }}>
                {videos[0]?.thumbnail_url ? (
                  <img src={videos[0].thumbnail_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900">
                    <span className="text-5xl opacity-30">🎬</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 text-2xl text-white">▶</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 bg-black/60 px-3 py-2">
                  <span className="text-xs text-white">▶</span>
                  <div className="h-1 flex-1 rounded-full bg-white/30">
                    <div className="h-1 w-1/3 rounded-full bg-red-500" />
                  </div>
                  <span className="text-xs text-white">🔊</span>
                </div>
              </div>
              <p className="mt-5 text-center text-sm text-slate-300">Watch Our Videos</p>
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => videos[0] && setModal({ type: 'video', url: videos[0].url, title: videos[0].title })}
                  className="rounded-lg border border-teal/60 bg-transparent px-10 py-2 text-sm font-semibold text-teal transition hover:bg-teal/10"
                >
                  View Videos
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-teal/40 bg-[#0a1628]/80 p-6 shadow-[0_0_30px_rgba(0,200,200,0.15)] backdrop-blur-sm">
              <h2 className="mb-5 text-center font-display text-2xl font-bold text-white">PDF Documents</h2>
              <div className="flex justify-center gap-8">
                {pdfs.length >= 1
                  ? pdfs.slice(0, 2).map((pdf) => (
                      <div key={pdf.id} className="flex flex-col items-center gap-2">
                        <div className="flex h-24 w-20 flex-col items-center justify-center rounded-xl border border-red-500/40 bg-[#1a0808] shadow-lg">
                          <div className="text-4xl">📄</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-red-500">PDF</div>
                        </div>
                        <span className="max-w-[90px] truncate text-center text-[11px] text-slate-400">{pdf.title}</span>
                      </div>
                    ))
                  : ['Astronomy Guide', 'Telescope Manual'].map((name) => (
                      <div key={name} className="flex flex-col items-center gap-2">
                        <div className="flex h-24 w-20 flex-col items-center justify-center rounded-xl border border-red-500/40 bg-[#1a0808] shadow-lg">
                          <div className="text-4xl">📄</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-red-500">PDF</div>
                        </div>
                        <span className="text-center text-[11px] text-slate-400">{name}</span>
                      </div>
                    ))}
              </div>
              <p className="mt-5 text-center text-sm text-slate-300">Download Resources</p>
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => pdfs[0] && setModal({ type: 'pdf', url: pdfs[0].url, title: pdfs[0].title })}
                  className="rounded-lg border border-teal/60 bg-transparent px-10 py-2 text-sm font-semibold text-teal transition hover:bg-teal/10"
                >
                  View PDFs
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal(null)
          }}
        >
          <button
            onClick={() => setModal(null)}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl text-white hover:bg-white/20"
          >
            ✕
          </button>

          {modal.type === 'gallery' && images.length > 0 && (
            <div className="w-full max-w-5xl">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                <button
                  onClick={() => setModal({ type: 'gallery', index: (modal.index - 1 + images.length) % images.length })}
                  className="rounded-xl border border-white/10 px-4 py-2 hover:text-teal"
                >
                  ← Prev
                </button>
                <span>
                  {images[modal.index]?.title} ({modal.index + 1}/{images.length})
                </span>
                <button
                  onClick={() => setModal({ type: 'gallery', index: (modal.index + 1) % images.length })}
                  className="rounded-xl border border-white/10 px-4 py-2 hover:text-teal"
                >
                  Next →
                </button>
              </div>
              <img src={images[modal.index]?.url} alt={images[modal.index]?.title} className="max-h-[80vh] w-full rounded-3xl object-contain" />
            </div>
          )}

          {modal.type === 'video' && (
            <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0d1630] p-6">
              <h3 className="mb-5 font-display text-2xl font-bold text-white">{modal.title}</h3>
              <video controls className="w-full rounded-2xl">
                <source src={modal.url} />
              </video>
            </div>
          )}

          {modal.type === 'pdf' && (
            <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0d1630] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold text-white">{modal.title}</h3>
                <a
                  href={modal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-teal px-5 py-2 font-bold text-slate-950 hover:brightness-110"
                >
                  Open in Browser
                </a>
              </div>
              <iframe title={modal.title} src={modal.url} className="h-[72vh] w-full rounded-2xl bg-white" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
