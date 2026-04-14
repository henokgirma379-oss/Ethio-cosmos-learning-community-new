import { ReactNode, useState } from 'react'
import Navbar from './Navbar'
import SecondaryNavbar from './SecondaryNavbar'
import LoginModal from './LoginModal'
import Footer from './Footer'
import { layouts } from '../lib/designSystem'

interface PageShellProps {
  children: ReactNode
  navLinks?: Array<{ label: string; path: string }>
  gradientStyle?: 'teal' | 'gold' | 'default'
  showSecondaryNav?: boolean
  showFooter?: boolean
}

const defaultNavLinks = [
  { label: 'Home', path: '/' },
  { label: 'Learning', path: '/learning' },
  { label: 'Materials', path: '/materials' },
  { label: 'Chat', path: '/chat' },
  { label: 'About', path: '/about' },
]

export default function PageShell({
  children,
  navLinks = defaultNavLinks,
  gradientStyle = 'default',
  showSecondaryNav = true,
  showFooter = true,
}: PageShellProps) {
  const [loginOpen, setLoginOpen] = useState(false)

  const gradientClass = layouts.gradients[gradientStyle]

  return (
    <div className="relative min-h-screen overflow-hidden bg-space-black text-white">
      {/* Background Gradients */}
      <div className={`fixed inset-0 ${gradientClass}`} />
      <div className="fixed inset-0 bg-space-black/70" />

      {/* Navigation */}
      <Navbar links={navLinks} onOpenLogin={() => setLoginOpen(true)} />
      {showSecondaryNav && <SecondaryNavbar />}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />

      {/* Main Content */}
      <main className="relative z-10 animate-fadeIn">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <div className="relative z-10">
          <Footer />
        </div>
      )}
    </div>
  )
}
