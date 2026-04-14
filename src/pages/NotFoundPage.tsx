import { Link } from 'react-router-dom'
import PageShell from '../components/PageShell'
import Card from '../components/Card'
import { PRIMARY_NAV_LINKS } from '../lib/constants'

export default function NotFoundPage() {
  return (
    <PageShell navLinks={PRIMARY_NAV_LINKS} gradientStyle="default" showSecondaryNav={false}>
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="text-6xl">🪐</div>
          <h1 className="mt-6 font-display text-5xl text-white">404 — Lost in Space</h1>
          <p className="mt-4 text-slate-400">The page you're looking for drifted beyond our current orbit.</p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950 transition-all duration-200 hover:scale-105 hover:brightness-110"
          >
            Go Home
          </Link>
        </div>
      </main>
    </PageShell>
  )
}
