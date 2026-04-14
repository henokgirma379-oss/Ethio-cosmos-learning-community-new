import { useEffect, useMemo, useState } from 'react'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import SectionHeader from '../components/SectionHeader'
import { getMaterials } from '../lib/api'
import { PRIMARY_NAV_LINKS } from '../lib/constants'
import type { Material } from '../types'

type ModalState =
  | { type: 'gallery'; index: number }
  | { type: 'video'; url: string; title: string }
  | { type: 'pdf'; url: string; title: string }
  | null

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [modal, setModal] = useState<ModalState>(null)

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
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="default">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <Card variant="default" borderStyle="accent" padding="lg" className="text-center">
          <h1 className="font-display text-4xl text-white sm:text-5xl">Learning Materials</h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Browse visuals, videos, and downloadable astronomy references from one clean, accessible learning library.
          </p>
        </Card>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl space-y-8 px-6 pb-20">
        {/* Image Gallery Section */}
        <Card variant="default" borderStyle="teal" padding="md">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl text-white">Image Gallery</h2>
              <p className="mt-2 text-slate-300">Open astronomy visuals in a simple gallery with keyboard navigation.</p>
            </div>
            {images[0] && (
              <button
                onClick={() => setModal({ type: 'gallery', index: 0 })}
                className="rounded-lg bg-teal px-5 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110"
              >
                Open Gallery
              </button>
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {images.slice(0, 4).map((image, index) => (
              <button
                key={image.id}
                onClick={() => setModal({ type: 'gallery', index })}
                className="overflow-hidden rounded-2xl border border-white/10 bg-navy/60 text-left transition-all duration-200 hover:border-teal/30 hover:shadow-glow"
              >
                <img src={image.thumbnail_url ?? image.url} alt={image.title} className="h-44 w-full object-cover" />
              </button>
            ))}
          </div>
        </Card>

        {/* Video Collection Section */}
        <Card variant="default" borderStyle="gold" padding="md">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
                className="overflow-hidden rounded-2xl border border-white/10 bg-navy/60 text-left transition-all duration-200 hover:border-teal/30 hover:shadow-glow"
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
        </Card>

        {/* PDF Documents Section */}
        <Card variant="default" borderStyle="default" padding="md">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl text-white">PDF Documents</h2>
              <p className="mt-2 text-slate-300">Preview and open astronomy documents directly in your browser.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pdfs.map((pdf) => (
              <Card key={pdf.id} variant="elevated" padding="md">
                <div className="text-4xl">📄</div>
                <h3 className="mt-4 font-semibold text-white">{pdf.title}</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => setModal({ type: 'pdf', url: pdf.url, title: pdf.title })}
                    className="rounded-lg bg-teal px-4 py-2 font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110"
                  >
                    Preview
                  </button>
                  <a
                    href={pdf.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border border-white/10 px-4 py-2 text-slate-300 transition-all duration-200 hover:border-teal/30 hover:text-teal"
                  >
                    Open
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </section>

      {/* Modal Overlays */}
      {modal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <button onClick={() => setModal(null)} className="absolute right-6 top-6 text-3xl text-white">
            ×
          </button>
          {modal.type === 'gallery' && images.length > 0 && (
            <div className="w-full max-w-5xl">
              <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                <button onClick={() => setModal({ type: 'gallery', index: (modal.index - 1 + images.length) % images.length })}>← Prev</button>
                <span>
                  {modal.index + 1}/{images.length}
                </span>
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
                <a href={modal.url} target="_blank" rel="noreferrer" className="rounded-lg bg-teal px-4 py-2 font-semibold text-slate-950">
                  Open in Browser
                </a>
              </div>
              <iframe title={modal.title} src={modal.url} className="h-[75vh] w-full rounded-2xl bg-white" />
            </div>
          )}
        </div>
      )}
    </PageShell>
  )
}
