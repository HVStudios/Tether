import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'

export interface Level {
  level: number
  name: string
  minXP: number
}

export const LEVELS: Level[] = [
  { level: 1,  name: 'Newcomer',     minXP: 0 },
  { level: 2,  name: 'Journaler',    minXP: 100 },
  { level: 3,  name: 'Seeker',       minXP: 250 },
  { level: 4,  name: 'Reflector',    minXP: 500 },
  { level: 5,  name: 'Mindful',      minXP: 800 },
  { level: 6,  name: 'Sage',         minXP: 1200 },
  { level: 7,  name: 'Guru',         minXP: 1700 },
  { level: 8,  name: 'Mystic',       minXP: 2300 },
  { level: 9,  name: 'Enlightened',  minXP: 3000 },
  { level: 10, name: 'Transcendent', minXP: 4000 },
]

export function calcTotalXP(entries: MoodEntry[]): number {
  const seenDates = new Set<string>()
  let xp = 0
  for (const e of entries) {
    xp += 10
    if (e.note && e.note.length > 10) xp += 5
    xp += Math.min((e.tags?.length ?? 0) * 2, 10)
    const date = e.logged_at.slice(0, 10)
    if (!seenDates.has(date)) {
      seenDates.add(date)
      xp += 5
    }
  }
  return xp
}

export function useXP(entries: MoodEntry[]) {
  return useMemo(() => {
    const totalXP = calcTotalXP(entries)
    const currentLevel = [...LEVELS].reverse().find(l => totalXP >= l.minXP) ?? LEVELS[0]
    const nextLevel = LEVELS[currentLevel.level] ?? null
    const xpIntoLevel = totalXP - currentLevel.minXP
    const xpForLevel = nextLevel ? nextLevel.minXP - currentLevel.minXP : 1
    const progress = nextLevel ? Math.min(xpIntoLevel / xpForLevel, 1) : 1
    return { totalXP, currentLevel, nextLevel, xpIntoLevel, xpForLevel, progress }
  }, [entries])
}
