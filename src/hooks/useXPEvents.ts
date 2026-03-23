import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../context/AuthContext'

const LS_KEY = 'tether_missions_completed'

function lsLoad(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? '{}') } catch { return {} }
}

export function useXPEvents() {
  const { user, isGuest } = useAuthContext()
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set())
  const [missionXP, setMissionXP] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isGuest) {
      const stored = lsLoad()
      setCompletedKeys(new Set(Object.keys(stored)))
      setMissionXP(Object.values(stored).reduce((s, v) => s + v, 0))
      setLoading(false)
      return
    }
    if (!user) { setLoading(false); return }

    supabase
      .from('xp_events')
      .select('source_key, xp')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) {
          setCompletedKeys(new Set(data.map(d => d.source_key)))
          setMissionXP(data.reduce((s, d) => s + d.xp, 0))
        }
        setLoading(false)
      })
  }, [user?.id, isGuest])

  const addEvent = useCallback(async (sourceKey: string, xp: number) => {
    if (completedKeys.has(sourceKey)) return

    if (isGuest) {
      const stored = lsLoad()
      stored[sourceKey] = xp
      localStorage.setItem(LS_KEY, JSON.stringify(stored))
      setCompletedKeys(prev => new Set([...prev, sourceKey]))
      setMissionXP(prev => prev + xp)
      return
    }
    if (!user) return

    const { error } = await supabase.from('xp_events').upsert(
      { user_id: user.id, source: 'mission', source_key: sourceKey, xp },
      { onConflict: 'user_id,source_key', ignoreDuplicates: true }
    )
    if (!error) {
      setCompletedKeys(prev => new Set([...prev, sourceKey]))
      setMissionXP(prev => prev + xp)
    }
  }, [user?.id, isGuest, completedKeys])

  return { completedKeys, missionXP, addEvent, loading }
}
