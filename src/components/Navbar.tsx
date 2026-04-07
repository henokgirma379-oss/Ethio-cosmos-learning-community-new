import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCompletedLessonCount } from '../lib/api'

interface NavbarProps {
  links: Array<{ label: string; path: string }>
  onOpenLogin: () => void
}

export default function Navbar({ links, onOpenLogin }: NavbarProps) {
  const { profile, isAdmin, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const loadCompletedCount = async () => {
      if (!profile) {
        setCompletedCount(0)
        return
      }

      const count = await getCompletedLessonCount(profile.id)
      setCompletedCount(count)
    }

    void loadCompletedCount()
  }, [profile])

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      if (!dropdownOpen) return
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown)
  }, [dropdownOpen])

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
        <div className="relative hidden md:flex" ref={dropdownRef}>
          {profile ? (
            <>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/20 font-semibold text-teal ring-2 ring-transparent transition hover:ring-teal/50"
              >
                {(profile.username ?? 'U').slice(0, 1).toUpperCase()}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 z-[200] w-72 rounded-2xl border border-white/10 bg-deep-navy shadow-[0_0_40px_rgba(0,0,0,0.6)]">
                  <div className="border-b border-white/10 p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-teal/20 text-xl font-bold text-teal">
                        {(profile.username ?? 'U').slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-white">
                          {profile.username ?? 'Explorer'}
                        </div>
                        <div className="mt-1">
                          {profile.role === 'admin' ? (
                            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-gold">
                              Admin
                            </span>
                          ) : (
                            <span className="rounded-full bg-teal/20 px-2 py-0.5 text-xs font-semibold text-teal">
                              Explorer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-navy/60 px-4 py-3">
                      <span className="text-sm text-slate-400">Member since</span>
                      <span className="text-sm font-semibold text-white">
                        {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-navy/60 px-4 py-3">
                      <span className="text-sm text-slate-400">Lessons completed</span>
                      <span className="text-sm font-semibold text-teal">{completedCount}</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 p-4 space-y-2">
                    <Link
                      to="/learning"
                      onClick={() => setDropdownOpen(false)}
                      className="block rounded-xl bg-teal px-4 py-3 text-center text-sm font-semibold text-slate-950"
                    >
                      Continue Learning
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="block rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-slate-300 hover:border-teal/30 hover:text-teal"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { void signOut(); setDropdownOpen(false) }}
                      className="w-full rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-slate-400 hover:border-red-500/30 hover:text-red-400"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </>
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
              <>
                <div className="border-t border-white/10 pt-3">
                  <div className="text-sm font-semibold text-white">{profile.username ?? 'Explorer'}</div>
                  <div className="mt-1 text-xs text-slate-400">
                    {completedCount} lessons completed
                  </div>
                </div>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="text-slate-300 hover:text-teal">
                    Admin Panel
                  </Link>
                )}
                <button onClick={() => void signOut()} className="text-left text-slate-300 hover:text-teal">
                  Sign Out
                </button>
              </>
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
