import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { MoodEntry, MoodEntryInsert } from '../lib/types'
import { useAuthContext } from '../context/AuthContext'

export function useMoodEntries() {
  const { user } = useAuthContext()
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
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
  }, [user])

  useEffect(() => {
    fetch()
  }, [fetch])

  async function insert(entry: MoodEntryInsert): Promise<{ error: string | null }> {
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
    const { error } = await supabase.from('mood_entries').delete().eq('id', id)
    if (error) return { error: error.message }
    setEntries(prev => prev.filter(e => e.id !== id))
    return { error: null }
  }

  const allTags = Array.from(new Set(entries.flatMap(e => e.tags))).sort()

  return { entries, loading, error, insert, update, remove, refresh: fetch, allTags }
}
