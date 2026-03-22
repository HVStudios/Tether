import { useMemo } from 'react'
import type { MoodEntry } from '../lib/types'

export interface Achievement {
  id: string
  icon: string
  name: string
  description: string
  unlocked: boolean
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

export function useAchievements(entries: MoodEntry[]): Achievement[] {
  return useMemo(() => {
    const total = entries.length
    const allTags = new Set(entries.flatMap(e => e.tags ?? []))
    const best = longestStreak(entries)
    const scores = entries.map(e => e.score)
    const hasNote100 = entries.some(e => (e.note?.length ?? 0) >= 100)
    const hasNightOwl = entries.some(e => {
      const h = new Date(e.logged_at).getHours()
      return h >= 23 || h === 0
    })
    const hasEarlyBird = entries.some(e => new Date(e.logged_at).getHours() < 6)
    const scoreRanges = [
      scores.some(s => s <= 2),
      scores.some(s => s >= 3 && s <= 4),
      scores.some(s => s >= 5 && s <= 6),
      scores.some(s => s >= 7 && s <= 8),
      scores.some(s => s >= 9),
    ]
    const highScoreCount = scores.filter(s => s >= 9).length

    return [
      {
        id: 'first_step',
        icon: '🌱',
        name: 'First Step',
        description: 'Log your very first entry',
        unlocked: total >= 1,
      },
      {
        id: 'on_a_roll',
        icon: '🔥',
        name: 'On a Roll',
        description: 'Reach a 3-day streak',
        unlocked: best >= 3,
      },
      {
        id: 'week_warrior',
        icon: '⚔️',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        unlocked: best >= 7,
      },
      {
        id: 'fortnight',
        icon: '🛡️',
        name: 'Fortnight Fighter',
        description: 'Maintain a 14-day streak',
        unlocked: best >= 14,
      },
      {
        id: 'month_master',
        icon: '👑',
        name: 'Month Master',
        description: 'Maintain a 30-day streak',
        unlocked: best >= 30,
      },
      {
        id: 'consistent',
        icon: '📅',
        name: 'Consistent',
        description: 'Log 10 total entries',
        unlocked: total >= 10,
      },
      {
        id: 'dedicated',
        icon: '💪',
        name: 'Dedicated',
        description: 'Log 30 total entries',
        unlocked: total >= 30,
      },
      {
        id: 'century',
        icon: '💯',
        name: 'Century',
        description: 'Log 100 total entries',
        unlocked: total >= 100,
      },
      {
        id: 'wordsmith',
        icon: '✍️',
        name: 'Wordsmith',
        description: 'Write a note with 100+ characters',
        unlocked: hasNote100,
      },
      {
        id: 'tag_explorer',
        icon: '🏷️',
        name: 'Tag Explorer',
        description: 'Use 5 or more different tags',
        unlocked: allTags.size >= 5,
      },
      {
        id: 'full_spectrum',
        icon: '🎭',
        name: 'Full Spectrum',
        description: 'Log entries across all mood ranges',
        unlocked: scoreRanges.every(Boolean),
      },
      {
        id: 'on_top',
        icon: '☀️',
        name: 'On Top of the World',
        description: 'Log 5 entries with a score of 9 or 10',
        unlocked: highScoreCount >= 5,
      },
      {
        id: 'night_owl',
        icon: '🦉',
        name: 'Night Owl',
        description: 'Log an entry after 11 PM',
        unlocked: hasNightOwl,
      },
      {
        id: 'early_bird',
        icon: '🐦',
        name: 'Early Bird',
        description: 'Log an entry before 6 AM',
        unlocked: hasEarlyBird,
      },
    ]
  }, [entries])
}
