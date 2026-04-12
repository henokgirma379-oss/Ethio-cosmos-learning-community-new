import { useEffect, useState } from 'react'
import { getOnlineProfiles } from '../lib/api'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function OnlineCounter() {
  const { user, profile } = useAuth()
  const [count, setCount] = useState(1)

  useEffect(() => {
    let mounted = true

    const refreshPresence = async () => {
      if (supabase && user) {
        const { error } = await supabase.from('online_presence').upsert({ id: user.id, last_seen: new Date().toISOString() })
        if (error) {
          console.error('[Supabase:online_presence]', error.message)
        }
      }

      const profiles = await getOnlineProfiles()
      if (!mounted) return
      setCount(Math.max(profiles.length, profile ? 1 : 0, 1))
    }

    void refreshPresence()
    const interval = window.setInterval(() => {
      void refreshPresence()
    }, 30000)

    return () => {
      mounted = false
      window.clearInterval(interval)
    }
  }, [user, profile])

  return (
    <div className="inline-flex items-center gap-2 text-sm text-teal">
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
      </span>
      <span>{count} online</span>
    </div>
  )
}
