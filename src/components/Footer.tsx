import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-teal/20 bg-navy/95">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="font-display text-xl text-teal">✦ EthioCosmos</div>
          <p className="mt-3 text-sm text-slate-400">A home for astronomy learners, stargazers, and space dreamers across Ethiopia and Africa.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Quick Links</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-400">
            <Link to="/">Home</Link>
            <Link to="/learning">Learning</Link>
            <Link to="/materials">Materials</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/about">About</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">Contact</h3>
          <p className="mt-4 text-sm text-slate-400">henokgirma648@gmail.com</p>
        </div>
      </div>
      <div className="border-t border-white/5 px-6 py-4 text-center text-xs text-slate-500">
        Copyright © 2024 Ethio-Cosmos Learning Community
      </div>
    </footer>
  )
}
