import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'

export interface Records {
  longestStreak: number
  totalEntries: number
  allTimeAvg: number | null
  bestDayAvg: number | null
  bestDayDate: string | null
  mostInOneDay: number
  topTag: string | null
}

function longestStreak(entries: MoodEntry[]): number {
  const dates = [...new Set(entries.map(e => e.logged_at.slice(0, 10)))].sort()
  if (dates.length === 0) return 0
  let max = 1, cur = 1
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000
    if (diff === 1) { cur++; max = Math.max(max, cur) }
    else cur = 1
  }
  return max
}

export function useRecords(entries: MoodEntry[]): Records {
  return useMemo(() => {
    if (entries.length === 0) {
      return {
        longestStreak: 0,
        totalEntries: 0,
        allTimeAvg: null,
        bestDayAvg: null,
        bestDayDate: null,
        mostInOneDay: 0,
        topTag: null,
      }
    }

    const byDate = new Map<string, number[]>()
    for (const e of entries) {
      const d = e.logged_at.slice(0, 10)
      if (!byDate.has(d)) byDate.set(d, [])
      byDate.get(d)!.push(e.score)
    }

    let bestDayAvg: number | null = null
    let bestDayDate: string | null = null
    let mostInOneDay = 0
    for (const [date, scores] of byDate.entries()) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      if (bestDayAvg === null || avg > bestDayAvg) {
        bestDayAvg = Math.round(avg * 10) / 10
        bestDayDate = date
      }
      if (scores.length > mostInOneDay) mostInOneDay = scores.length
    }

    const tagCounts = new Map<string, number>()
    for (const e of entries) {
      for (const t of e.tags ?? []) {
        tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
      }
    }
    const topTag = tagCounts.size > 0
      ? [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
      : null

    const allTimeAvg = Math.round(
      (entries.reduce((s, e) => s + e.score, 0) / entries.length) * 10
    ) / 10

    return {
      longestStreak: longestStreak(entries),
      totalEntries: entries.length,
      allTimeAvg,
      bestDayAvg,
      bestDayDate,
      mostInOneDay,
      topTag,
    }
  }, [entries])
}
