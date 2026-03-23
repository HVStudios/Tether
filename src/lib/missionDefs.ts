import type { MoodEntry } from './types'

export type MissionType = 'daily' | 'weekly'

export interface MissionDef {
  id: string
  type: MissionType
  icon: string
  title: string
  description: string
  xpReward: number
  goal: number
  progress: (entries: MoodEntry[], periodStart: Date) => number
}

function entriesInPeriod(entries: MoodEntry[], from: Date): MoodEntry[] {
  return entries.filter(e => new Date(e.logged_at) >= from)
}

// ── Daily missions ────────────────────────────────────────────────────────────

export const DAILY_MISSIONS: MissionDef[] = [
  {
    id: 'log_today',
    type: 'daily',
    icon: '📝',
    title: 'Show Up',
    description: 'Log an entry today',
    xpReward: 15,
    goal: 1,
    progress: (e, from) => Math.min(entriesInPeriod(e, from).length, 1),
  },
  {
    id: 'long_note_today',
    type: 'daily',
    icon: '✍️',
    title: 'Tell Your Story',
    description: 'Write a note with 50+ characters today',
    xpReward: 25,
    goal: 1,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => (en.note?.length ?? 0) >= 50).length, 1),
  },
  {
    id: 'deep_note_today',
    type: 'daily',
    icon: '🧠',
    title: 'Deep Dive',
    description: 'Write a note with 150+ characters today',
    xpReward: 40,
    goal: 1,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => (en.note?.length ?? 0) >= 150).length, 1),
  },
  {
    id: 'two_tags_today',
    type: 'daily',
    icon: '🏷️',
    title: 'Tag It Up',
    description: 'Add 2+ tags to any entry today',
    xpReward: 20,
    goal: 1,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => (en.tags?.length ?? 0) >= 2).length, 1),
  },
  {
    id: 'tag_variety_today',
    type: 'daily',
    icon: '🎨',
    title: 'Tag Variety',
    description: 'Use 3 different tags today',
    xpReward: 30,
    goal: 1,
    progress: (e, from) => {
      const tags = new Set(entriesInPeriod(e, from).flatMap(en => en.tags ?? []))
      return tags.size >= 3 ? 1 : 0
    },
  },
  {
    id: 'perfect_ten',
    type: 'daily',
    icon: '🚀',
    title: 'Perfect Day',
    description: 'Log a score of 10 today',
    xpReward: 35,
    goal: 1,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => en.score === 10).length, 1),
  },
  {
    id: 'high_spirits',
    type: 'daily',
    icon: '☀️',
    title: 'High Spirits',
    description: 'Log a score of 8 or higher today',
    xpReward: 20,
    goal: 1,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => en.score >= 8).length, 1),
  },
  {
    id: 'morning_check',
    type: 'daily',
    icon: '🌅',
    title: 'Morning Check-in',
    description: 'Log an entry before noon today',
    xpReward: 25,
    goal: 1,
    progress: (e, from) =>
      Math.min(
        entriesInPeriod(e, from).filter(en => new Date(en.logged_at).getHours() < 12).length,
        1
      ),
  },
  {
    id: 'evening_reflection',
    type: 'daily',
    icon: '🌙',
    title: 'Evening Reflection',
    description: 'Log an entry after 8 PM today',
    xpReward: 25,
    goal: 1,
    progress: (e, from) =>
      Math.min(
        entriesInPeriod(e, from).filter(en => new Date(en.logged_at).getHours() >= 20).length,
        1
      ),
  },
  {
    id: 'complete_picture',
    type: 'daily',
    icon: '🖼️',
    title: 'Complete Picture',
    description: 'Write a note AND add 2+ tags in a single entry today',
    xpReward: 35,
    goal: 1,
    progress: (e, from) =>
      Math.min(
        entriesInPeriod(e, from).filter(
          en => (en.note?.length ?? 0) > 0 && (en.tags?.length ?? 0) >= 2
        ).length,
        1
      ),
  },
  {
    id: 'honest_low',
    type: 'daily',
    icon: '💙',
    title: 'Honest Moment',
    description: 'Log a score of 4 or lower today',
    xpReward: 20,
    goal: 1,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => en.score <= 4).length, 1),
  },
]

// ── Weekly missions ───────────────────────────────────────────────────────────

export const WEEKLY_MISSIONS: MissionDef[] = [
  {
    id: 'five_days',
    type: 'weekly',
    icon: '📆',
    title: 'Five-Day Stretch',
    description: 'Log on 5 different days this week',
    xpReward: 75,
    goal: 5,
    progress: (e, from) =>
      Math.min(new Set(entriesInPeriod(e, from).map(en => en.logged_at.slice(0, 10))).size, 5),
  },
  {
    id: 'full_week',
    type: 'weekly',
    icon: '🏆',
    title: 'Perfect Week',
    description: 'Log every day for 7 days this week',
    xpReward: 150,
    goal: 7,
    progress: (e, from) =>
      Math.min(new Set(entriesInPeriod(e, from).map(en => en.logged_at.slice(0, 10))).size, 7),
  },
  {
    id: 'fresh_tag_week',
    type: 'weekly',
    icon: '🆕',
    title: 'Fresh Tag',
    description: 'Use a tag you haven\'t used in the previous week',
    xpReward: 65,
    goal: 1,
    progress: (entries, from) => {
      const weekAgo = new Date(from)
      weekAgo.setDate(weekAgo.getDate() - 7)
      const recentTags = new Set(
        entries
          .filter(e => new Date(e.logged_at) >= weekAgo && new Date(e.logged_at) < from)
          .flatMap(e => e.tags ?? [])
      )
      const thisWeekTags = new Set(entriesInPeriod(entries, from).flatMap(e => e.tags ?? []))
      return [...thisWeekTags].some(t => !recentTags.has(t)) ? 1 : 0
    },
  },
  {
    id: 'tag_collector_week',
    type: 'weekly',
    icon: '🗂️',
    title: 'Tag Collector',
    description: 'Use 5 different tags this week',
    xpReward: 60,
    goal: 5,
    progress: (e, from) =>
      Math.min(new Set(entriesInPeriod(e, from).flatMap(en => en.tags ?? [])).size, 5),
  },
  {
    id: 'storyteller_week',
    type: 'weekly',
    icon: '📖',
    title: 'Storyteller',
    description: 'Write 3 notes with 50+ characters this week',
    xpReward: 70,
    goal: 3,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => (en.note?.length ?? 0) >= 50).length, 3),
  },
  {
    id: 'high_average_week',
    type: 'weekly',
    icon: '📈',
    title: 'Good Vibes',
    description: 'Keep your weekly average score above 7',
    xpReward: 80,
    goal: 1,
    progress: (e, from) => {
      const period = entriesInPeriod(e, from)
      if (period.length === 0) return 0
      const avg = period.reduce((s, en) => s + en.score, 0) / period.length
      return avg > 7 ? 1 : 0
    },
  },
  {
    id: 'morning_routine_week',
    type: 'weekly',
    icon: '🌄',
    title: 'Morning Routine',
    description: 'Log before 9 AM on 3 different days this week',
    xpReward: 80,
    goal: 3,
    progress: (e, from) => {
      const days = new Set(
        entriesInPeriod(e, from)
          .filter(en => new Date(en.logged_at).getHours() < 9)
          .map(en => en.logged_at.slice(0, 10))
      )
      return Math.min(days.size, 3)
    },
  },
  {
    id: 'variety_week',
    type: 'weekly',
    icon: '🎭',
    title: 'Mood Range',
    description: 'Log entries with 4 different score values this week',
    xpReward: 60,
    goal: 4,
    progress: (e, from) =>
      Math.min(new Set(entriesInPeriod(e, from).map(en => en.score)).size, 4),
  },
  {
    id: 'deep_week',
    type: 'weekly',
    icon: '🔍',
    title: 'Go Deep',
    description: 'Write 2 notes with 150+ characters this week',
    xpReward: 90,
    goal: 2,
    progress: (e, from) =>
      Math.min(entriesInPeriod(e, from).filter(en => (en.note?.length ?? 0) >= 150).length, 2),
  },
  {
    id: 'emotional_range',
    type: 'weekly',
    icon: '🌊',
    title: 'Emotional Range',
    description: 'Log entries spanning 5+ score points this week (e.g. a 3 and an 8)',
    xpReward: 60,
    goal: 1,
    progress: (e, from) => {
      const scores = entriesInPeriod(e, from).map(en => en.score)
      if (scores.length < 2) return 0
      return Math.max(...scores) - Math.min(...scores) >= 5 ? 1 : 0
    },
  },
]

// ── Seeding helpers ───────────────────────────────────────────────────────────

function lcg(seed: number): number {
  return ((seed * 1664525 + 1013904223) & 0x7fffffff)
}

function seededPick<T>(arr: T[], seed: number, count: number): T[] {
  const indices = Array.from({ length: arr.length }, (_, i) => i)
  let s = seed
  for (let i = indices.length - 1; i > 0; i--) {
    s = lcg(s)
    const j = s % (i + 1)
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices.slice(0, count).map(i => arr[i])
}

export function isoWeek(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  return (
    1 +
    Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  )
}

export function getActiveMissions(now: Date): { daily: MissionDef[]; weekly: MissionDef[] } {
  const daysSinceEpoch = Math.floor(now.getTime() / 86400000)
  const weekSeed = now.getFullYear() * 100 + isoWeek(now)

  return {
    daily: seededPick(DAILY_MISSIONS, daysSinceEpoch, 3),
    weekly: seededPick(WEEKLY_MISSIONS, weekSeed, 3),
  }
}

export function getDailyStart(now: Date): Date {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getWeeklyStart(now: Date): Date {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day // Monday start
  d.setDate(d.getDate() + diff)
  return d
}

export function dailyKey(now: Date): string {
  return now.toISOString().slice(0, 10)
}

export function weeklyKey(now: Date): string {
  return `${now.getFullYear()}-W${String(isoWeek(now)).padStart(2, '0')}`
}
