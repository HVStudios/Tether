import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'

export interface PeriodSummary {
  avg: number | null
  prevAvg: number | null
  trend: number | null
  entries: number
  bestDay: string | null
  topTag: string | null
  periodLabel: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getWeekBounds(offsetWeeks = 0): { start: Date; end: Date } {
  const now = new Date()
  const day = now.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const start = new Date(now)
  start.setDate(now.getDate() + mondayOffset - offsetWeeks * 7)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return { start, end }
}

function getMonthBounds(offsetMonths = 0): { start: Date; end: Date } {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - offsetMonths, 1)
  const end = new Date(now.getFullYear(), now.getMonth() - offsetMonths + 1, 0, 23, 59, 59, 999)
  return { start, end }
}

function computeSummary(
  entries: MoodEntry[],
  start: Date,
  end: Date,
  periodLabel: string,
  prevStart: Date,
  prevEnd: Date,
): PeriodSummary {
  const inPeriod = entries.filter(e => {
    const d = new Date(e.logged_at)
    return d >= start && d <= end
  })
  const inPrev = entries.filter(e => {
    const d = new Date(e.logged_at)
    return d >= prevStart && d <= prevEnd
  })

  const avg =
    inPeriod.length > 0
      ? Math.round((inPeriod.reduce((s, e) => s + e.score, 0) / inPeriod.length) * 10) / 10
      : null
  const prevAvg =
    inPrev.length > 0
      ? Math.round((inPrev.reduce((s, e) => s + e.score, 0) / inPrev.length) * 10) / 10
      : null
  const trend =
    avg !== null && prevAvg !== null ? Math.round((avg - prevAvg) * 10) / 10 : null

  // Best day: only meaningful if 2+ different days have entries
  const byDay = new Map<string, number[]>()
  for (const e of inPeriod) {
    const name = DAY_NAMES[new Date(e.logged_at).getDay()]
    if (!byDay.has(name)) byDay.set(name, [])
    byDay.get(name)!.push(e.score)
  }
  let bestDay: string | null = null
  if (byDay.size >= 2) {
    let best = -Infinity
    for (const [name, scores] of byDay) {
      const a = scores.reduce((s, x) => s + x, 0) / scores.length
      if (a > best) { best = a; bestDay = name }
    }
  }

  // Top tag
  const tagCounts = new Map<string, number>()
  for (const e of inPeriod) {
    for (const tag of e.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
  }
  let topTag: string | null = null
  let topTagCount = 0
  for (const [tag, count] of tagCounts) {
    if (count > topTagCount) { topTagCount = count; topTag = tag }
  }

  return { avg, prevAvg, trend, entries: inPeriod.length, bestDay, topTag, periodLabel }
}

export function usePeriodSummary(entries: MoodEntry[], mode: 'week' | 'month'): PeriodSummary {
  return useMemo(() => {
    const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

    if (mode === 'week') {
      const { start, end } = getWeekBounds(0)
      const { start: ps, end: pe } = getWeekBounds(1)
      return computeSummary(entries, start, end, `${fmt(start)} – ${fmt(end)}`, ps, pe)
    } else {
      const { start, end } = getMonthBounds(0)
      const { start: ps, end: pe } = getMonthBounds(1)
      const label = start.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
      return computeSummary(entries, start, end, label, ps, pe)
    }
  }, [entries, mode])
}
