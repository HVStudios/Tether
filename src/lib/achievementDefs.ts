import type { MoodEntry } from './types'

export interface AchievementDef {
  id: string
  icon: string
  name: string
  description: string
  xpReward: number
  check: (entries: MoodEntry[]) => boolean
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

function hasGap(entries: MoodEntry[], minGapDays: number): boolean {
  const dates = [...new Set(entries.map(e => e.logged_at.slice(0, 10)))].sort()
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000
    if (diff > minGapDays) return true
  }
  return false
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  // ── Entry count ───────────────────────────────────────────────────────────
  {
    id: 'first_step',
    icon: '🌱',
    name: 'First Step',
    description: 'Log your very first entry',
    xpReward: 25,
    check: e => e.length >= 1,
  },
  {
    id: 'consistent',
    icon: '📅',
    name: 'Consistent',
    description: 'Log 10 total entries',
    xpReward: 50,
    check: e => e.length >= 10,
  },
  {
    id: 'dedicated',
    icon: '💪',
    name: 'Dedicated',
    description: 'Log 30 total entries',
    xpReward: 100,
    check: e => e.length >= 30,
  },
  {
    id: 'marathon',
    icon: '🏃',
    name: 'Marathon',
    description: 'Log 50 total entries',
    xpReward: 150,
    check: e => e.length >= 50,
  },
  {
    id: 'century',
    icon: '💯',
    name: 'Century',
    description: 'Log 100 total entries',
    xpReward: 200,
    check: e => e.length >= 100,
  },
  {
    id: 'legend',
    icon: '🌟',
    name: 'Legend',
    description: 'Log 200 total entries',
    xpReward: 400,
    check: e => e.length >= 200,
  },

  // ── Streaks ───────────────────────────────────────────────────────────────
  {
    id: 'on_a_roll',
    icon: '🔥',
    name: 'On a Roll',
    description: 'Reach a 3-day streak',
    xpReward: 25,
    check: e => longestStreak(e) >= 3,
  },
  {
    id: 'week_warrior',
    icon: '⚔️',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    xpReward: 75,
    check: e => longestStreak(e) >= 7,
  },
  {
    id: 'fortnight',
    icon: '🛡️',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    xpReward: 150,
    check: e => longestStreak(e) >= 14,
  },
  {
    id: 'month_master',
    icon: '👑',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    xpReward: 300,
    check: e => longestStreak(e) >= 30,
  },
  {
    id: 'long_haul',
    icon: '🏔️',
    name: 'Long Haul',
    description: 'Maintain a 60-day streak',
    xpReward: 600,
    check: e => longestStreak(e) >= 60,
  },
  {
    id: 'comeback_kid',
    icon: '🔄',
    name: 'Comeback Kid',
    description: 'Return after a 7+ day break',
    xpReward: 50,
    check: e => hasGap(e, 7),
  },

  // ── Time of day ───────────────────────────────────────────────────────────
  {
    id: 'night_owl',
    icon: '🦉',
    name: 'Night Owl',
    description: 'Log an entry after 11 PM',
    xpReward: 25,
    check: e => e.some(en => { const h = new Date(en.logged_at).getHours(); return h >= 23 || h === 0 }),
  },
  {
    id: 'early_bird',
    icon: '🐦',
    name: 'Early Bird',
    description: 'Log an entry before 6 AM',
    xpReward: 25,
    check: e => e.some(en => new Date(en.logged_at).getHours() < 6),
  },
  {
    id: 'weekend_warrior',
    icon: '🎉',
    name: 'Weekend Warrior',
    description: 'Log on both Saturday and Sunday',
    xpReward: 30,
    check: e => {
      const days = new Set(e.map(en => new Date(en.logged_at).getDay()))
      return days.has(0) && days.has(6)
    },
  },
  {
    id: 'triple_tap',
    icon: '⚡',
    name: 'Triple Tap',
    description: 'Log 3 or more entries in a single day',
    xpReward: 30,
    check: e => {
      const counts = new Map<string, number>()
      for (const en of e) {
        const d = en.logged_at.slice(0, 10)
        counts.set(d, (counts.get(d) ?? 0) + 1)
      }
      return [...counts.values()].some(c => c >= 3)
    },
  },

  // ── Score / mood ──────────────────────────────────────────────────────────
  {
    id: 'full_spectrum',
    icon: '🎭',
    name: 'Full Spectrum',
    description: 'Log entries across all 5 mood ranges',
    xpReward: 75,
    check: e => {
      const s = e.map(en => en.score)
      return [
        s.some(x => x <= 2),
        s.some(x => x >= 3 && x <= 4),
        s.some(x => x >= 5 && x <= 6),
        s.some(x => x >= 7 && x <= 8),
        s.some(x => x >= 9),
      ].every(Boolean)
    },
  },
  {
    id: 'rainbow',
    icon: '🌈',
    name: 'Rainbow',
    description: 'Use every score from 1 to 10',
    xpReward: 100,
    check: e => {
      const scores = new Set(e.map(en => en.score))
      return [1,2,3,4,5,6,7,8,9,10].every(n => scores.has(n))
    },
  },
  {
    id: 'on_top',
    icon: '☀️',
    name: 'On Top of the World',
    description: 'Log 5 entries with a score of 9 or 10',
    xpReward: 75,
    check: e => e.filter(en => en.score >= 9).length >= 5,
  },
  {
    id: 'overachiever',
    icon: '🚀',
    name: 'Overachiever',
    description: 'Log 10 perfect 10 scores',
    xpReward: 100,
    check: e => e.filter(en => en.score === 10).length >= 10,
  },
  {
    id: 'sunshine',
    icon: '🌤️',
    name: 'Sunshine Week',
    description: '7-day streak with every score ≥ 8',
    xpReward: 150,
    check: e => {
      const dates = [...new Set(e.map(en => en.logged_at.slice(0, 10)))].sort()
      if (dates.length < 7) return false
      for (let i = 0; i <= dates.length - 7; i++) {
        let valid = true
        for (let j = i; j < i + 7; j++) {
          if (j > i) {
            const diff = (new Date(dates[j]).getTime() - new Date(dates[j-1]).getTime()) / 86400000
            if (diff !== 1) { valid = false; break }
          }
          const dayEntries = e.filter(en => en.logged_at.slice(0, 10) === dates[j])
          if (!dayEntries.every(en => en.score >= 8)) { valid = false; break }
        }
        if (valid) return true
      }
      return false
    },
  },

  // ── Notes & tags ──────────────────────────────────────────────────────────
  {
    id: 'wordsmith',
    icon: '✍️',
    name: 'Wordsmith',
    description: 'Write a note with 100+ characters',
    xpReward: 50,
    check: e => e.some(en => (en.note?.length ?? 0) >= 100),
  },
  {
    id: 'deep_thinker',
    icon: '🧠',
    name: 'Deep Thinker',
    description: 'Write a note with 250+ characters',
    xpReward: 75,
    check: e => e.some(en => (en.note?.length ?? 0) >= 250),
  },
  {
    id: 'bookworm',
    icon: '📚',
    name: 'Bookworm',
    description: 'Write 20 entries with notes longer than 50 characters',
    xpReward: 100,
    check: e => e.filter(en => (en.note?.length ?? 0) >= 50).length >= 20,
  },
  {
    id: 'tag_explorer',
    icon: '🏷️',
    name: 'Tag Explorer',
    description: 'Use 5 or more different tags',
    xpReward: 50,
    check: e => new Set(e.flatMap(en => en.tags ?? [])).size >= 5,
  },
  {
    id: 'hashtag_hero',
    icon: '#️⃣',
    name: 'Hashtag Hero',
    description: 'Use 10 or more different tags',
    xpReward: 75,
    check: e => new Set(e.flatMap(en => en.tags ?? [])).size >= 10,
  },
  {
    id: 'tag_master',
    icon: '🗂️',
    name: 'Tag Master',
    description: 'Use 20 or more different tags',
    xpReward: 150,
    check: e => new Set(e.flatMap(en => en.tags ?? [])).size >= 20,
  },
]
