import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'
import { toLocalDateString } from '../utils/formatDate'
import { format, subDays } from 'date-fns'

export function useStreak(entries: MoodEntry[]): number {
  return useMemo(() => {
    if (entries.length === 0) return 0

    const datesWithEntries = new Set(entries.map(e => toLocalDateString(e.logged_at)))
    let streak = 0
    let cursor = new Date()

    // Start from today; if today has no entry, start from yesterday
    if (!datesWithEntries.has(format(cursor, 'yyyy-MM-dd'))) {
      cursor = subDays(cursor, 1)
    }

    while (datesWithEntries.has(format(cursor, 'yyyy-MM-dd'))) {
      streak++
      cursor = subDays(cursor, 1)
    }

    return streak
  }, [entries])
}
