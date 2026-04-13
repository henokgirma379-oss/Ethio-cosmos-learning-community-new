import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getBookmarkedLessons, getCompletedLessonIds, getTopicBySlug, getTopics } from '../lib/api'
import type { Lesson, Topic } from '../types'

interface NavbarProps {
  links: Array<{ label: string; path: string }>
  onOpenLogin: () => void
}

type BookmarkNavItem = Lesson & { topicSlug: string }

export default function Navbar({ links, onOpenLogin }: NavbarProps) {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [bookmarks, setBookmarks] = useState<BookmarkNavItem[]>([])
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!profile) {
      setBookmarks([])
      setCompletedCount(0)
      return
    }

    const loadProfileMeta = async () => {
      const [bookmarkLessons, completedIds, allTopics] = await Promise.all([
        getBookmarkedLessons(profile.id),
        getCompletedLessonIds(profile.id),
        getTopics(),
      ])

      const topicIdToSlug = new Map(allTopics.map((topic) => [topic.id, topic.slug]))
      const resolvedBookmarks = await Promise.all(
        bookmarkLessons.map(async (lesson) => {
          const existingSlug = topicIdToSlug.get(lesson.topic_id)
          if (existingSlug) return { ...lesson, topicSlug: existingSlug }
          const topic = await getTopicBySlug(lesson.topic_id)
          return { ...lesson, topicSlug: topic?.slug ?? lesson.topic_id }
        }),
      )

      setBookmarks(resolvedBookmarks)
      setCompletedCount(completedIds.length)
    }

    void loadProfileMeta()
  }, [profile])

  const navLinks = useMemo(() => {
    if (profile?.role === 'admin' && !links.some((link) => link.path === '/admin')) {
      return [...links, { label: 'Admin', path: '/admin' }]
    }
    return links
  }, [links, profile])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 border-b border-teal/30 bg-navy/90 backdrop-blur ${scrolled ? 'shadow-lg shadow-black/40' : ''}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all ${scrolled ? 'h-12' : 'h-16'}`}>
        <Link to="/" className="font-display text-xl font-bold text-teal">
          ✦ EthioCosmos
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => {
                const isAdminLink = link.path === '/admin'
                const base = isActive ? 'text-teal' : 'text-slate-300 hover:text-teal'
                return `text-sm transition-colors duration-200 ${isAdminLink ? 'rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-gold hover:text-gold' : base}`
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex">
          {profile ? (
            <div className="relative flex items-center gap-3 text-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal/20 font-semibold text-teal">
                {(profile.username ?? 'U').slice(0, 1).toUpperCase()}
              </div>
              <div>
                <div className="text-white">{profile.username ?? 'Explorer'}</div>
                <div className="text-xs text-slate-400">{completedCount} completed lessons</div>
                <div className="mt-1 flex items-center gap-3">
                  <button onClick={() => setShowBookmarks((value) => !value)} className="text-xs text-slate-400 hover:text-teal">
                    My Bookmarks
                  </button>
                  <button onClick={() => void signOut()} className="text-xs text-slate-400 hover:text-teal">
                    Sign Out
                  </button>
                </div>
              </div>
              {showBookmarks && (
                <div className="absolute right-0 top-14 w-80 rounded-2xl border border-white/10 bg-deep-navy/95 p-4 shadow-lg shadow-black/40">
                  <h3 className="font-semibold text-white">My Bookmarks</h3>
                  <div className="mt-3 space-y-2">
                    {bookmarks.length ? (
                      bookmarks.map((bookmark) => (
                        <Link
                          key={bookmark.id}
                          to={`/learning/${bookmark.topicSlug}/${bookmark.slug}`}
                          onClick={() => setShowBookmarks(false)}
                          className="block rounded-xl bg-navy/60 px-4 py-3 text-sm text-slate-300 transition hover:text-teal"
                        >
                          {bookmark.title}
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-xl bg-navy/60 px-4 py-3 text-sm text-slate-400">No bookmarks yet</div>
                    )}
                  </div>
                </div>
              )}
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
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`${link.path === '/admin' ? 'text-gold' : 'text-slate-300 hover:text-teal'}`}
              >
                {link.label}
              </NavLink>
            ))}
            {profile ? (
              <>
                <button onClick={() => setShowBookmarks((value) => !value)} className="text-left text-slate-300 hover:text-teal">
                  My Bookmarks
                </button>
                {showBookmarks && (
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-deep-navy/80 p-3">
                    {bookmarks.length ? (
                      bookmarks.map((bookmark) => (
                        <Link
                          key={bookmark.id}
                          to={`/learning/${bookmark.topicSlug}/${bookmark.slug}`}
                          onClick={() => {
                            setOpen(false)
                            setShowBookmarks(false)
                          }}
                          className="block rounded-xl bg-navy/60 px-4 py-3 text-sm text-slate-300"
                        >
                          {bookmark.title}
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-xl bg-navy/60 px-4 py-3 text-sm text-slate-400">No bookmarks yet</div>
                    )}
                  </div>
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
