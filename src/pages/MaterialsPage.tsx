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
  const [activeSection, setActiveSection] = useState<'images' | 'videos' | 'pdfs' | null>(null)

  useEffect(() => {
    void getMaterials().then(setMaterials)
  }, [])

  const images = useMemo(() => materials.filter((m) => m.type === 'image'), [materials])
  const videos = useMemo(() => materials.filter((m) => m.type === 'video'), [materials])
  const pdfs = useMemo(() => materials.filter((m) => m.type === 'pdf'), [materials])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setModal(null); setActiveSection(null) }
      if (modal?.type === 'gallery' && images.length) {
        if (e.key === 'ArrowRight') setModal({ type: 'gallery', index: (modal.index + 1) % images.length })
        if (e.key === 'ArrowLeft') setModal({ type: 'gallery', index: (modal.index - 1 + images.length) % images.length })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modal, images])

  return (
    <div className="relative min-h-screen text-white" style={{ background: '#06091b' }}>
      <div className="absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <img
          src="/topic_nebulae.svg"
          alt=""
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#06091b]/40 via-transparent to-[#06091b]" />
      </div>

      <div className="relative z-10">
        <Navbar links={NAV_LINKS} onOpenLogin={() => setLoginOpen(true)} />
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

        <main className="mx-auto max-w-6xl animate-fadeIn px-6 pb-24 pt-28">
          <div className="pb-12 pt-10 text-center">
            <h1 className="font-display text-5xl font-extrabold text-white drop-shadow-lg">Our Materials</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Explore and access our collection of resources related to space science and astronomy.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1630]/90 backdrop-blur-sm">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-display text-lg font-bold text-white">Image Gallery</h2>
              </div>
              <div className="grid grid-cols-2 gap-0.5 bg-black/30">
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
                      <div key={i} className="aspect-video bg-navy/60" />
                    ))}
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-slate-400">Browse Our Photos</p>
                <button
                  onClick={() => {
                    if (images.length) {
                      setModal({ type: 'gallery', index: 0 })
                    } else {
                      setActiveSection('images')
                    }
                  }}
                  className="mt-3 w-full rounded-xl bg-teal py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
                >
                  View Gallery
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1630]/90 backdrop-blur-sm">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-display text-lg font-bold text-white">Video Collection</h2>
              </div>
              <div
                className="relative flex items-center justify-center overflow-hidden bg-navy/60"
                style={{ aspectRatio: '16/10' }}
              >
                {videos[0]?.thumbnail_url ? (
                  <img
                    src={videos[0].thumbnail_url}
                    alt={videos[0].title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#1c2d5b]">
                    <span className="text-6xl opacity-30">🎬</span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl backdrop-blur-sm">
                    ▶
                  </div>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-slate-400">Watch Our Videos</p>
                <button
                  onClick={() => {
                    if (videos[0]) setModal({ type: 'video', url: videos[0].url, title: videos[0].title })
                    else setActiveSection('videos')
                  }}
                  className="mt-3 w-full rounded-xl bg-teal py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
                >
                  View Videos
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1630]/90 backdrop-blur-sm">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="font-display text-lg font-bold text-white">PDF Documents</h2>
              </div>
              <div
                className="flex items-center justify-center gap-6 bg-[#0a1628]"
                style={{ aspectRatio: '16/10' }}
              >
                {pdfs.length >= 1 ? (
                  pdfs.slice(0, 2).map((pdf) => (
                    <div key={pdf.id} className="flex flex-col items-center gap-2">
                      <div className="flex h-20 w-16 flex-col items-center justify-center rounded-lg border border-red-500/30 bg-[#1a0a0a] shadow-lg">
                        <div className="text-3xl text-red-500">📄</div>
                        <div className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-red-400">PDF</div>
                      </div>
                      <div className="max-w-[80px] truncate text-center text-[10px] text-slate-400">{pdf.title}</div>
                    </div>
                  ))
                ) : (
                  <>
                    {[1, 2].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="flex h-20 w-16 flex-col items-center justify-center rounded-lg border border-red-500/30 bg-[#1a0a0a] shadow-lg">
                          <div className="text-3xl text-red-500">📄</div>
                          <div className="mt-1 text-center text-[9px] font-bold uppercase tracking-widest text-red-400">PDF</div>
                        </div>
                        <div className="text-[10px] text-slate-500">{i === 1 ? 'Astronomy Guide' : 'Telescope Manual'}</div>
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-slate-400">Download Resources</p>
                <button
                  onClick={() => {
                    if (pdfs[0]) setModal({ type: 'pdf', url: pdfs[0].url, title: pdfs[0].title })
                    else setActiveSection('pdfs')
                  }}
                  className="mt-3 w-full rounded-xl bg-teal py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
                >
                  View PDFs
                </button>
              </div>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl font-bold text-white">All Images</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setModal({ type: 'gallery', index })}
                    className="group overflow-hidden rounded-2xl border border-white/10"
                  >
                    <div className="relative overflow-hidden" style={{ paddingTop: '66%' }}>
                      <img
                        src={img.thumbnail_url ?? img.url}
                        alt={img.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-sm font-semibold text-white">{img.title}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {videos.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl font-bold text-white">All Videos</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setModal({ type: 'video', url: video.url, title: video.title })}
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0d1630]/90 p-4 text-left transition hover:border-teal/40"
                  >
                    <div className="font-semibold text-white group-hover:text-teal">{video.title}</div>
                    <div className="mt-1 text-sm text-slate-400">▶ Click to watch</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {pdfs.length > 0 && (
            <div className="mt-14">
              <h2 className="font-display text-2xl font-bold text-white">All PDFs</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {pdfs.map((pdf) => (
                  <div
                    key={pdf.id}
                    className="rounded-2xl border border-white/10 bg-[#0d1630]/90 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl text-red-400">📄</div>
                      <div className="font-semibold text-white">{pdf.title}</div>
                    </div>
                    <div className="mt-4 flex gap-3 text-sm">
                      <button
                        onClick={() => setModal({ type: 'pdf', url: pdf.url, title: pdf.title })}
                        className="rounded-xl bg-teal px-5 py-2 font-bold text-slate-950 hover:brightness-110"
                      >
                        Preview
                      </button>
                      <a
                        href={pdf.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-white/10 px-5 py-2 font-semibold text-slate-300 hover:border-teal/40 hover:text-teal"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) { setModal(null) } }}
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
                  className="rounded-xl border border-white/10 px-4 py-2 hover:border-teal/40 hover:text-teal"
                >
                  ← Prev
                </button>
                <span>{images[modal.index]?.title} ({modal.index + 1}/{images.length})</span>
                <button
                  onClick={() => setModal({ type: 'gallery', index: (modal.index + 1) % images.length })}
                  className="rounded-xl border border-white/10 px-4 py-2 hover:border-teal/40 hover:text-teal"
                >
                  Next →
                </button>
              </div>
              <img
                src={images[modal.index]?.url}
                alt={images[modal.index]?.title}
                className="max-h-[80vh] w-full rounded-3xl object-contain"
              />
            </div>
          )}

          {modal.type === 'video' && (
            <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-[#0d1630] p-6">
              <h3 className="mb-5 font-display text-2xl font-bold text-white">{modal.title}</h3>
              <video controls className="w-full rounded-2xl">
                <source src={modal.url} />
                Your browser does not support the video tag.
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
              <iframe
                title={modal.title}
                src={modal.url}
                className="h-[72vh] w-full rounded-2xl bg-white"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
