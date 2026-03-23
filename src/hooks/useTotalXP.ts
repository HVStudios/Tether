import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'
import { calcTotalXP, deriveXPStats } from './useXP'
import { useXPEvents } from './useXPEvents'

/** Full XP hook — includes entry XP + achievement XP + mission XP from Supabase/localStorage */
export function useTotalXP(entries: MoodEntry[]) {
  const { missionXP, loading } = useXPEvents()

  const xpStats = useMemo(
    () => deriveXPStats(calcTotalXP(entries, missionXP)),
    [entries, missionXP]
  )

  return { ...xpStats, loading }
}
