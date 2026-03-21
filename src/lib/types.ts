export interface MoodEntry {
  id: string
  user_id: string
  score: number // 1-10
  note: string | null
  tags: string[]
  logged_at: string // ISO 8601
  created_at: string
}

export type MoodEntryInsert = Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>

export interface ChartPoint {
  date: string    // "2026-03-21"
  average: number // daily average score
  count: number
}
