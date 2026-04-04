import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import MaterialCard from '../components/MaterialCard'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
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
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      <main className="relative z-10 mx-auto max-w-7xl animate-fadeIn px-6 pb-20 pt-20">
        <section className="rounded-3xl border border-white/5 bg-deep-navy/70 px-8 py-16 text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Our Materials</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">Explore our curated astronomy resources across images, videos, and downloadable PDF references.</p>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <MaterialCard
            title="Image Gallery"
            description="Browse astronomy visuals through a full-screen gallery experience."
            actionLabel="View Gallery"
            onClick={() => setModal(images.length ? { type: 'gallery', index: 0 } : null)}
            preview={
              <div className="grid grid-cols-2 gap-1 bg-navy p-1">
                {images.length
                  ? images.slice(0, 4).map((image) => (
                      <img key={image.id} src={image.thumbnail_url ?? image.url} alt={image.title} className="h-28 w-full object-cover" />
                    ))
                  : Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 bg-space-black" />)}
              </div>
            }
          />
          <MaterialCard
            title="Video Collection"
            description="Open space education videos in a focused modal player with quick access."
            actionLabel="View Videos"
            onClick={() => videos[0] && setModal({ type: 'video', url: videos[0].url, title: videos[0].title })}
            preview={
              <div className="relative flex h-[228px] items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${videos[0]?.thumbnail_url ?? ''})` }}>
                <div className="rounded-full bg-black/60 px-6 py-4 text-3xl">▶</div>
              </div>
            }
          />
          <MaterialCard
            title="PDF Documents"
            description="Preview or download astronomy guides, manuals, and printable references."
            actionLabel="View PDFs"
            onClick={() => pdfs[0] && setModal({ type: 'pdf', url: pdfs[0].url, title: pdfs[0].title })}
            preview={
              <div className="flex h-[228px] items-center justify-center gap-8 bg-navy text-6xl text-slate-300">
                <div>📄</div>
                <div>📘</div>
              </div>
            }
          />
        </section>

        <section className="mt-14 grid gap-10 lg:grid-cols-3">
          <div>
            <h2 className="font-display text-2xl text-white">Images</h2>
            {images.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {images.map((image, index) => (
                  <button key={image.id} onClick={() => setModal({ type: 'gallery', index })}>
                    <img src={image.thumbnail_url ?? image.url} alt={image.title} className="h-40 w-full rounded-2xl object-cover" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No images uploaded yet.</p>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl text-white">Videos</h2>
            {videos.length ? (
              <div className="mt-4 space-y-4">
                {videos.map((video) => (
                  <button key={video.id} onClick={() => setModal({ type: 'video', url: video.url, title: video.title })} className="block w-full rounded-2xl border border-white/10 bg-deep-navy p-4 text-left">
                    <div className="text-white">{video.title}</div>
                    <div className="mt-2 text-sm text-slate-400">Open player</div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No videos available yet.</p>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl text-white">PDFs</h2>
            {pdfs.length ? (
              <div className="mt-4 space-y-4">
                {pdfs.map((pdf) => (
                  <div key={pdf.id} className="rounded-2xl border border-white/10 bg-deep-navy p-4">
                    <div className="text-white">{pdf.title}</div>
                    <div className="mt-4 flex gap-3 text-sm">
                      <button onClick={() => setModal({ type: 'pdf', url: pdf.url, title: pdf.title })} className="rounded-lg bg-teal px-4 py-2 font-semibold text-slate-950">Preview</button>
                      <a href={pdf.url} target="_blank" rel="noreferrer" className="rounded-lg border border-white/10 px-4 py-2 text-slate-300">Download</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-400">No PDF documents yet.</p>
            )}
          </div>
        </section>
      </main>

      {modal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <button onClick={() => setModal(null)} className="absolute right-6 top-6 text-3xl text-white">×</button>
          {modal.type === 'gallery' && images.length > 0 && (
            <div className="w-full max-w-5xl">
              <div className="flex items-center justify-between mb-4 text-sm text-slate-300">
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

      <Footer />
    </div>
  )
}
