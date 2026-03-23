import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'
import type { MoodEntry } from '../lib/types'

const GUEST_KEY = 'tether_guest'
const GUEST_ENTRIES_KEY = 'tether_guest_entries'
const GUEST_XP_KEY = 'tether_missions_completed'

interface AuthContextValue {
  session: Session | null
  user: User | null
  loading: boolean
  isGuest: boolean
  continueAsGuest: () => void
  exitGuest: () => void
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<any>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const [isGuest, setIsGuest] = useState(() => localStorage.getItem(GUEST_KEY) === '1')

  // When a guest signs in / signs up, migrate their local entries to Supabase
  useEffect(() => {
    if (auth.user && isGuest) {
      migrateGuestEntries(auth.user.id)
    }
  }, [auth.user?.id])

  async function migrateGuestEntries(userId: string) {
    const stored = localStorage.getItem(GUEST_ENTRIES_KEY)
    if (stored) {
      const entries: MoodEntry[] = JSON.parse(stored)
      if (entries.length > 0) {
        await supabase.from('mood_entries').insert(
          entries.map(e => ({
            score: e.score,
            note: e.note,
            tags: e.tags,
            logged_at: e.logged_at,
            user_id: userId,
          }))
        )
      }
      localStorage.removeItem(GUEST_ENTRIES_KEY)
    }

    // Migrate guest mission XP events
    const xpStored = localStorage.getItem(GUEST_XP_KEY)
    if (xpStored) {
      const events: Record<string, number> = JSON.parse(xpStored)
      const rows = Object.entries(events).map(([source_key, xp]) => ({
        user_id: userId,
        source: 'mission',
        source_key,
        xp,
      }))
      if (rows.length > 0) {
        await supabase
          .from('xp_events')
          .upsert(rows, { onConflict: 'user_id,source_key', ignoreDuplicates: true })
      }
      localStorage.removeItem(GUEST_XP_KEY)
    }

    localStorage.removeItem(GUEST_KEY)
    setIsGuest(false)
  }

  function continueAsGuest() {
    localStorage.setItem(GUEST_KEY, '1')
    setIsGuest(true)
  }

  function exitGuest() {
    localStorage.removeItem(GUEST_KEY)
    localStorage.removeItem(GUEST_ENTRIES_KEY)
    localStorage.removeItem(GUEST_XP_KEY)
    setIsGuest(false)
  }

  async function signOut() {
    exitGuest()
    return auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ ...auth, isGuest, continueAsGuest, exitGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}

export { GUEST_ENTRIES_KEY }
