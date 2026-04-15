import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import type { Profile } from '../types'
import { AUTHORIZED_ADMIN_EMAIL } from '../lib/constants'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  isAdmin: boolean
  loading: boolean
  authMessage: string | null
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const mockProfile: Profile = {
  id: 'demo-user',
  username: 'Guest Explorer',
  avatar_url: null,
  role: 'user',
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authMessage, setAuthMessage] = useState<string | null>(null)

  const fetchProfile = async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data as Profile)
  }

  const updatePresence = async (userId: string) => {
    if (!supabase) return
    await supabase.from('online_presence').upsert({ id: userId, last_seen: new Date().toISOString() })
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    let presenceInterval: ReturnType<typeof setInterval> | null = null

    const startPresence = (userId: string) => {
      void updatePresence(userId)
      if (presenceInterval) clearInterval(presenceInterval)
      presenceInterval = setInterval(() => {
        void updatePresence(userId)
      }, 90_000)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        void fetchProfile(session.user.id)
        startPresence(session.user.id)
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user) {
        void fetchProfile(nextSession.user.id)
        startPresence(nextSession.user.id)
      } else {
        setProfile(null)
        if (presenceInterval) {
          clearInterval(presenceInterval)
          presenceInterval = null
        }
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
      if (presenceInterval) clearInterval(presenceInterval)
    }
  }, [])

  const signInWithGoogle = async () => {
    if (!supabase) {
      setProfile(mockProfile)
      toast.success('Demo sign-in enabled without Supabase credentials.')
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      setProfile({ ...mockProfile, username: email.split('@')[0] || 'Guest Explorer' })
      toast.success(`Welcome back, ${email.split('@')[0] || 'Explorer'}!`)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      setProfile({ ...mockProfile, username: email.split('@')[0] || 'New Explorer' })
      toast.success('Demo account created successfully.')
      return
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    setAuthMessage('Check your email for a confirmation link before signing in.')
  }

  const signOut = async () => {
    if (!supabase) {
      setProfile(null)
      toast.success('Signed out successfully.')
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setProfile(null)
    toast.success('Signed out successfully.')
  }

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      loading,
      authMessage,
      isAdmin: user?.email === AUTHORIZED_ADMIN_EMAIL,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signOut,
    }),
    [user, session, profile, loading, authMessage],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
