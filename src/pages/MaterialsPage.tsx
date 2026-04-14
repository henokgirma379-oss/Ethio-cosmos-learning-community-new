import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import SecondaryNavbar from '../components/SecondaryNavbar'
import { getMaterials } from '../lib/api'
import type { Material } from '../types'

const links = [
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

  const images = useMemo(() => materials.filter((item) => item.type === 'image'), [materials])
  const videos = useMemo(() => materials.filter((item) => item.type === 'video'), [materials])
  const pdfs = useMemo(() => materials.filter((item) => item.type === 'pdf'), [materials])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null)
      if (modal?.type === 'gallery' && images.length) {
        if (event.key === 'ArrowRight') setModal({ type: 'gallery', index: (modal.index + 1) % images.length })
        if (event.key === 'ArrowLeft') setModal({ type: 'gallery', index: (modal.index - 1 + images.length) % images.length })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modal, images])

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <SecondaryNavbar />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-32">
        <section className="rounded-3xl border border-white/10 bg-deep-navy/75 px-8 py-14 text-center shadow-lg shadow-black/20">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Learning Materials</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Browse visuals, videos, and downloadable astronomy references from one clean, accessible learning library.
          </p>
        </section>

        <section className="mt-10 space-y-8">
          <div className="rounded-3xl border border-teal/20 bg-deep-navy/80 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-white">Image Gallery</h2>
                <p className="mt-2 text-slate-300">Open astronomy visuals in a simple gallery with keyboard navigation.</p>
              </div>
              {images[0] && (
                <button onClick={() => setModal({ type: 'gallery', index: 0 })} className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950">
                  Open Gallery
                </button>
              )}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {images.slice(0, 4).map((image, index) => (
                <button key={image.id} onClick={() => setModal({ type: 'gallery', index })} className="overflow-hidden rounded-2xl border border-white/10 bg-navy/60 text-left">
                  <img src={image.thumbnail_url ?? image.url} alt={image.title} className="h-44 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gold/20 bg-deep-navy/80 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-white">Video Collection</h2>
                <p className="mt-2 text-slate-300">Play astronomy explainers inside a focused modal player.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setModal({ type: 'video', url: video.url, title: video.title })}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-navy/60 text-left"
                >
                  <div className="relative h-52 bg-cover bg-center" style={{ backgroundImage: `url(${video.thumbnail_url ?? ''})` }}>
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full bg-black/60 px-5 py-3 text-2xl text-white">▶</div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 h-1 rounded-full bg-white/20">
                      <div className="h-full w-1/3 rounded-full bg-teal" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-white">{video.title}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-deep-navy/80 p-6 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl text-white">PDF Documents</h2>
                <p className="mt-2 text-slate-300">Preview and open astronomy documents directly in your browser.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="rounded-2xl border border-white/10 bg-navy/60 p-5">
                  <div className="text-4xl">📄</div>
                  <h3 className="mt-4 font-semibold text-white">{pdf.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button onClick={() => setModal({ type: 'pdf', url: pdf.url, title: pdf.title })} className="rounded-lg bg-teal px-4 py-2 font-semibold text-slate-950">
                      Preview
                    </button>
                    <a href={pdf.url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-4 py-2 text-slate-300">
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {modal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <button onClick={() => setModal(null)} className="absolute right-6 top-6 text-3xl text-white">×</button>
          {modal.type === 'gallery' && images.length > 0 && (
            <div className="w-full max-w-5xl">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                <button onClick={() => setModal({ type: 'gallery', index: (modal.index - 1 + images.length) % images.length })}>← Prev</button>
                <span>{modal.index + 1}/{images.length}</span>
                <button onClick={() => setModal({ type: 'gallery', index: (modal.index + 1) % images.length })}>Next →</button>
              </div>
              <img src={images[modal.index].url} alt={images[modal.index].title} className="max-h-[80vh] w-full rounded-3xl object-contain" />
            </div>
          )}
          {modal.type === 'video' && (
            <div className="w-full max-w-4xl rounded-3xl bg-deep-navy p-4">
              <h3 className="mb-4 font-display text-2xl text-white">{modal.title}</h3>
              <video controls className="w-full rounded-2xl">
                <source src={modal.url} />
              </video>
            </div>
          )}
          {modal.type === 'pdf' && (
            <div className="w-full max-w-5xl rounded-3xl bg-deep-navy p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-2xl text-white">{modal.title}</h3>
                <a href={modal.url} target="_blank" rel="noreferrer" className="rounded-lg bg-teal px-4 py-2 font-semibold text-slate-950">Open in Browser</a>
              </div>
              <iframe title={modal.title} src={modal.url} className="h-[75vh] w-full rounded-2xl bg-white" />
            </div>
          )}
        </div>
      )}

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
