import { NavLink } from 'react-router-dom'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

export default function SecondaryNavbar() {
  return (
    <div className="fixed inset-x-0 top-16 z-40 hidden h-12 border-b border-teal/20 bg-deep-navy/95 md:block">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-center gap-8 px-6">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `text-sm transition-colors duration-200 ${isActive ? 'border-b border-teal pb-1 text-teal' : 'text-slate-400 hover:text-teal'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
