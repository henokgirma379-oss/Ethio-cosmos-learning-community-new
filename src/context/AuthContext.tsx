import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import toast from 'react-hot-toast'
import type { Profile } from '../types'
import { supabase, supabaseConfigError } from '../lib/supabase'

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
  const [authMessage, setAuthMessage] = useState<string | null>(supabaseConfigError)

  const fetchProfile = async (userId: string) => {
    if (!supabase) return
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()

    if (error) {
      setAuthMessage(`Unable to load your profile: ${error.message}`)
      return
    }

    if (data) {
      setProfile(data as Profile)
      setAuthMessage(null)
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthMessage(`Unable to read Supabase session: ${error.message}`)
      }
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      if (nextSession?.user) {
        void fetchProfile(nextSession.user.id)
      } else {
        setProfile(null)
        setAuthMessage(supabaseConfigError)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    if (!supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase authentication is not configured.')
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw new Error(`Google sign-in failed: ${error.message}`)
  }

  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase email sign-in is not configured.')
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(`Email sign-in failed: ${error.message}`)
    setAuthMessage(null)
  }

  const signUpWithEmail = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase sign-up is not configured.')
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw new Error(`Sign-up failed: ${error.message}`)
    setAuthMessage(null)
  }

  const signOut = async () => {
    if (!supabase) {
      throw new Error(supabaseConfigError ?? 'Supabase sign-out is not configured.')
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(`Sign-out failed: ${error.message}`)
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
      isAdmin: profile?.role === 'admin',
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
