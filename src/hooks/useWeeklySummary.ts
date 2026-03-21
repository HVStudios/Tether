import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'
import { startOfWeek, subWeeks, isWithinInterval, endOfWeek, parseISO } from 'date-fns'

function avg(scores: number[]) {
  if (!scores.length) return null
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
}

export function useWeeklySummary(entries: MoodEntry[]) {
  return useMemo(() => {
    const now = new Date()
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 })
    const lastWeekStart = subWeeks(thisWeekStart, 1)
    const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 1 })

    const thisWeekEntries = entries.filter(e =>
      parseISO(e.logged_at) >= thisWeekStart
    )
    const lastWeekEntries = entries.filter(e =>
      isWithinInterval(parseISO(e.logged_at), { start: lastWeekStart, end: lastWeekEnd })
    )

    const thisAvg = avg(thisWeekEntries.map(e => e.score))
    const lastAvg = avg(lastWeekEntries.map(e => e.score))

    // Top tags this week
    const tagCounts = new Map<string, number>()
    for (const e of thisWeekEntries) {
      for (const t of e.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
    }
    const topTags = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag)

    return {
      thisAvg,
      lastAvg,
      count: thisWeekEntries.length,
      topTags,
      trend: thisAvg !== null && lastAvg !== null ? thisAvg - lastAvg : null,
    }
  }, [entries])
}
