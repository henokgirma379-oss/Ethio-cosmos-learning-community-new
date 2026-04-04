import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface NavbarProps {
  links: Array<{ label: string; path: string }>
  onOpenLogin: () => void
}

export default function Navbar({ links, onOpenLogin }: NavbarProps) {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-teal/30 bg-navy/90 backdrop-blur ${scrolled ? 'shadow-lg shadow-black/40' : ''}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all ${scrolled ? 'h-12' : 'h-16'}`}>
        <Link to="/" className="font-display text-xl font-bold text-teal">
          ✦ EthioCosmos
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm transition-colors duration-200 ${isActive ? 'text-teal' : 'text-slate-300 hover:text-teal'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex">
          {profile ? (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/20 font-semibold text-teal">
                {(profile.username ?? 'U').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="text-white">{profile.username ?? 'Explorer'}</div>
                <button onClick={() => void signOut()} className="text-xs text-slate-400 hover:text-teal">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="rounded-lg bg-teal px-5 py-2 font-semibold text-slate-950 transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
            >
              Get Started
            </button>
          )}
        </div>
        <button onClick={() => setOpen((value) => !value)} className="text-2xl text-slate-200 md:hidden">
          ☰
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-navy px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink key={link.path} to={link.path} onClick={() => setOpen(false)} className="text-slate-300 hover:text-teal">
                {link.label}
              </NavLink>
            ))}
            {profile ? (
              <button onClick={() => void signOut()} className="text-left text-slate-300 hover:text-teal">
                Sign Out
              </button>
            ) : (
              <button onClick={onOpenLogin} className="text-left text-teal">
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
