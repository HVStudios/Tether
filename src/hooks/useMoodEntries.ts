import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { MoodEntry, MoodEntryInsert } from '../lib/types'
import { useAuthContext, GUEST_ENTRIES_KEY } from '../context/AuthContext'

function loadGuestEntries(): MoodEntry[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_ENTRIES_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveGuestEntries(entries: MoodEntry[]) {
  localStorage.setItem(GUEST_ENTRIES_KEY, JSON.stringify(entries))
}

export function useMoodEntries() {
  const { user, isGuest } = useAuthContext()
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (isGuest) {
      setEntries(loadGuestEntries())
      setLoading(false)
      return
    }
    if (!user) return
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .order('logged_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setEntries(data as MoodEntry[])
    }
    setLoading(false)
  }, [user, isGuest])

  useEffect(() => {
    fetch()
  }, [fetch])

  async function insert(entry: MoodEntryInsert): Promise<{ error: string | null }> {
    if (isGuest) {
      const newEntry: MoodEntry = {
        id: crypto.randomUUID(),
        user_id: 'guest',
        created_at: new Date().toISOString(),
        ...entry,
      }
      const updated = [newEntry, ...entries].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
      )
      setEntries(updated)
      saveGuestEntries(updated)
      return { error: null }
    }

    const { data, error } = await supabase
      .from('mood_entries')
      .insert({ ...entry, user_id: user!.id })
      .select()
      .single()

    if (error) return { error: error.message }
    setEntries(prev => [data as MoodEntry, ...prev].sort(
      (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
    ))
    return { error: null }
  }

  async function update(id: string, patch: Partial<MoodEntryInsert>): Promise<{ error: string | null }> {
    if (isGuest) {
      const updated = entries.map(e => e.id === id ? { ...e, ...patch } : e)
        .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
      setEntries(updated)
      saveGuestEntries(updated)
      return { error: null }
    }

    const { data, error } = await supabase
      .from('mood_entries')
      .update(patch)
      .eq('id', id)
      .select()
      .single()

    if (error) return { error: error.message }
    setEntries(prev =>
      prev.map(e => (e.id === id ? (data as MoodEntry) : e))
          .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
    )
    return { error: null }
  }

  async function remove(id: string): Promise<{ error: string | null }> {
    if (isGuest) {
      const updated = entries.filter(e => e.id !== id)
      setEntries(updated)
      saveGuestEntries(updated)
      return { error: null }
    }

    const { error } = await supabase.from('mood_entries').delete().eq('id', id)
    if (error) return { error: error.message }
    setEntries(prev => prev.filter(e => e.id !== id))
    return { error: null }
  }

  const allTags = Array.from(new Set(entries.flatMap(e => e.tags))).sort()

  return { entries, loading, error, insert, update, remove, refresh: fetch, allTags }
}
