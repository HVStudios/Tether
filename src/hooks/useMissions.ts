import { useMemo, useEffect } from 'react'
import type { MoodEntry } from '../lib/types'
import {
  getActiveMissions,
  getDailyStart,
  getWeeklyStart,
  dailyKey,
  weeklyKey,
  type MissionDef,
} from '../lib/missionDefs'

export interface ActiveMission extends MissionDef {
  current: number
  completed: boolean
  periodKey: string
}

export function useMissions(
  entries: MoodEntry[],
  completedKeys: Set<string>,
  addEvent: (sourceKey: string, xp: number) => void
) {
  const now = new Date()
  const dKey = dailyKey(now)
  const wKey = weeklyKey(now)
  const dailyStart = getDailyStart(now)
  const weeklyStart = getWeeklyStart(now)
  const { daily, weekly } = getActiveMissions(now)

  const missions: ActiveMission[] = useMemo(() => {
    function toActive(def: MissionDef, periodKey: string, start: Date): ActiveMission {
      const storageKey = `${def.id}_${periodKey}`
      const alreadyCompleted = completedKeys.has(storageKey)
      const current = alreadyCompleted ? def.goal : def.progress(entries, start)
      return {
        ...def,
        current,
        completed: alreadyCompleted || current >= def.goal,
        periodKey,
      }
    }
    return [
      ...daily.map(d => toActive(d, dKey, dailyStart)),
      ...weekly.map(w => toActive(w, wKey, weeklyStart)),
    ]
  }, [entries, completedKeys, dKey, wKey])

  // Bank XP for newly completed missions
  useEffect(() => {
    for (const m of missions) {
      const storageKey = `${m.id}_${m.periodKey}`
      if (m.completed && !completedKeys.has(storageKey)) {
        addEvent(storageKey, m.xpReward)
      }
    }
  }, [missions])

  return {
    dailyMissions: missions.filter(m => m.type === 'daily'),
    weeklyMissions: missions.filter(m => m.type === 'weekly'),
  }
}
