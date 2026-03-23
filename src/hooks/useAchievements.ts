import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'
import { ACHIEVEMENT_DEFS } from '../lib/achievementDefs'
import type { AchievementDef } from '../lib/achievementDefs'

export interface Achievement extends AchievementDef {
  unlocked: boolean
}

export function useAchievements(entries: MoodEntry[]): Achievement[] {
  return useMemo(
    () => ACHIEVEMENT_DEFS.map(def => ({ ...def, unlocked: def.check(entries) })),
    [entries]
  )
}
