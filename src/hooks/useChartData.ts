import { useMemo } from 'react'
import type { MoodEntry, ChartPoint } from '../lib/types'
import { toLocalDateString } from '../utils/formatDate'

export function useChartData(entries: MoodEntry[], days = 30): ChartPoint[] {
  return useMemo(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    const grouped = new Map<string, number[]>()

    for (const entry of entries) {
      const date = toLocalDateString(entry.logged_at)
      if (new Date(entry.logged_at) < cutoff) continue
      if (!grouped.has(date)) grouped.set(date, [])
      grouped.get(date)!.push(entry.score)
    }

    return Array.from(grouped.entries())
      .map(([date, scores]) => ({
        date,
        average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
        count: scores.length,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [entries, days])
}
