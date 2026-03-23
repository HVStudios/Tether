import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'
import { ACHIEVEMENT_DEFS } from '../lib/achievementDefs'

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

/** Pure calculation — pass missionXP separately so it can come from any source */
export function calcTotalXP(entries: MoodEntry[], missionXP = 0): number {
  const seenDates = new Set<string>()
  let xp = 0

  for (const e of entries) {
    xp += 10
    if (e.note && e.note.length > 10) xp += 5
    xp += Math.min((e.tags?.length ?? 0) * 2, 10)
    const date = e.logged_at.slice(0, 10)
    if (!seenDates.has(date)) { seenDates.add(date); xp += 5 }
  }

  for (const def of ACHIEVEMENT_DEFS) {
    if (def.check(entries)) xp += def.xpReward
  }

  xp += missionXP

  return xp
}

export function deriveXPStats(totalXP: number) {
  const currentLevel = [...LEVELS].reverse().find(l => totalXP >= l.minXP) ?? LEVELS[0]
  const nextLevel = LEVELS[currentLevel.level] ?? null
  const xpIntoLevel = totalXP - currentLevel.minXP
  const xpForLevel = nextLevel ? nextLevel.minXP - currentLevel.minXP : 1
  const progress = nextLevel ? Math.min(xpIntoLevel / xpForLevel, 1) : 1
  return { totalXP, currentLevel, nextLevel, xpIntoLevel, xpForLevel, progress }
}

/** Legacy hook — use useTotalXP instead if mission XP should be included */
export function useXP(entries: MoodEntry[], missionXP = 0) {
  return useMemo(
    () => deriveXPStats(calcTotalXP(entries, missionXP)),
    [entries, missionXP]
  )
}
