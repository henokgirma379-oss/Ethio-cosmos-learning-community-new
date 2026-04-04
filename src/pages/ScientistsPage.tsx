import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import LoginModal from '../components/LoginModal'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import { useState } from 'react'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Scientists', path: '/scientists' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
]

export default function ScientistsPage() {
  const [loginOpen, setLoginOpen] = useState(false)
  return (
    <div className="relative min-h-screen bg-space-black text-white">
      <StarField />
      <Navbar links={links} onOpenLogin={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="text-center">
          <div className="text-6xl">🧑🏾‍🔬</div>
          <h1 className="mt-6 font-display text-4xl text-white">Coming Soon — Meet pioneering African astronomers</h1>
          <p className="mt-4 text-slate-400">Profiles and stories are being prepared.</p>
          <Link to="/" className="mt-8 inline-block rounded-lg bg-teal px-6 py-3 font-semibold text-slate-950">Back Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
