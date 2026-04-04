import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  const handleSubmit = async () => {
    if (mode === 'signup' && password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    try {
      setSubmitting(true)
      if (mode === 'signin') {
        await signInWithEmail(email, password)
      } else {
        await signUpWithEmail(email, password)
      }
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Google sign-in failed.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-teal/30 bg-deep-navy p-8 shadow-[0_0_40px_rgba(0,200,200,0.15)]">
        <button onClick={onClose} className="ml-auto block text-xl text-slate-400 transition hover:text-white">×</button>
        <div className="text-center">
          <div className="text-3xl text-teal">✦</div>
          <h2 className="mt-2 font-display text-2xl text-white">Welcome to EthioCosmos</h2>
          <p className="mt-2 text-sm text-slate-400">Sign in to access the full learning experience</p>
        </div>
        <div className="my-6 h-px bg-white/10" />
        <button
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-4 py-3 font-semibold text-slate-800"
        >
          <span>G</span>
          Continue with Google
        </button>
        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-500">
          <div className="h-px flex-1 bg-white/10" />
          or
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="space-y-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            className="w-full rounded-lg border border-white/10 bg-navy px-4 py-3 text-white outline-none transition focus:border-teal"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-white/10 bg-navy px-4 py-3 text-white outline-none transition focus:border-teal"
          />
          {mode === 'signup' && (
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              placeholder="Confirm password"
              className="w-full rounded-lg border border-white/10 bg-navy px-4 py-3 text-white outline-none transition focus:border-teal"
            />
          )}
          <button
            disabled={submitting || !email || !password}
            onClick={handleSubmit}
            className="w-full rounded-lg bg-teal px-4 py-3 font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
        <p className="mt-5 text-center text-sm text-slate-400">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button className="text-teal" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
