import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,200,200,0.12),_transparent_30%),linear-gradient(180deg,_rgba(5,10,26,0.76),_rgba(5,10,26,0.95))]" />
      <div className="fixed inset-0 bg-space-black/70" />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl">🪐</div>
          <h1 className="mt-6 font-display text-5xl text-white">404 — Lost in Space</h1>
          <p className="mt-4 text-slate-400">The page you’re looking for drifted beyond our current orbit.</p>
          <Link to="/" className="mt-8 inline-block rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950">Go Home</Link>
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}
