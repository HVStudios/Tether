import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useWeeklySummary } from '../hooks/useWeeklySummary'
import { EntryCard } from '../components/history/EntryCard'
import { EditModal } from '../components/history/EditModal'
import { WeeklySummary } from '../components/history/WeeklySummary'
import { Mark, Wordmark } from '../components/Mark'
import type { MoodEntry } from '../lib/types'

function fmtDayGroup(iso: string): string {
  const d = new Date(iso)
  const today = new Date()
  const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
}

export function HistoryPage() {
  const { entries, loading, error, remove, update, allTags } = useMoodEntries()
  const summary = useWeeklySummary(entries)
  const [editEntry, setEditEntry] = useState<MoodEntry | null>(null)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterScore, setFilterScore] = useState<string>('all')

  const filtered = entries.filter(e => {
    if (search && !e.note?.toLowerCase().includes(search.toLowerCase())) return false
    if (filterTag && !e.tags.includes(filterTag)) return false
    if (filterScore !== 'all') {
      const [min, max] = filterScore.split('-').map(Number)
      if (e.score < min || e.score > max) return false
    }
    return true
  })

  // Group filtered entries by day label, preserving order
  const groups: { day: string; items: MoodEntry[] }[] = []
  for (const e of filtered) {
    const day = fmtDayGroup(e.logged_at)
    const last = groups[groups.length - 1]
    if (last && last.day === day) last.items.push(e)
    else groups.push({ day, items: [e] })
  }

  const recentScores = entries.slice(0, 14).map(e => e.score)

  return (
    <div className="relative px-5 md:px-8 py-6 max-w-lg md:max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 md:hidden">
          <Mark size={28} />
          <Wordmark size={18} />
        </div>
        <div className="hidden md:block" />
        <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-ink-mute dark:text-d-ink-mute">
          {entries.length} {entries.length === 1 ? 'reading' : 'readings'}
        </p>
      </div>

      <h1
        className="text-[32px] md:text-[40px] font-semibold leading-[1.05] text-ink dark:text-d-ink mb-6"
        style={{ letterSpacing: '-0.025em' }}
      >
        This week's weather
      </h1>

      <div className="mb-5">
        <WeeklySummary {...summary} recentScores={recentScores} />
      </div>

      {/* Search & filter */}
      <div className="flex flex-col gap-2.5 mb-4">
        <input
          type="search"
          placeholder="Search notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-2xl border border-rule dark:border-d-rule bg-card dark:bg-d-card text-ink dark:text-d-ink placeholder:text-ink-dim dark:placeholder:text-d-ink-dim px-4 py-2.5 text-[13px] outline-none focus:border-ink/40 dark:focus:border-d-ink/30"
        />
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <select
            value={filterScore}
            onChange={e => setFilterScore(e.target.value)}
            className="rounded-full border border-rule dark:border-d-rule bg-card dark:bg-d-card text-ink2 dark:text-d-ink2 px-3 py-1 text-[12px] shrink-0 outline-none"
          >
            <option value="all">All skies</option>
            <option value="1-3">Stormy (1–3)</option>
            <option value="4-6">Overcast (4–6)</option>
            <option value="7-10">Sunny (7–10)</option>
          </select>

          <button
            onClick={() => setFilterTag(null)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium shrink-0 border transition-colors ${
              filterTag === null
                ? 'bg-ink text-bg border-ink dark:bg-d-ink dark:text-d-bg dark:border-d-ink'
                : 'bg-card dark:bg-d-card text-ink2 dark:text-d-ink2 border-rule dark:border-d-rule hover:border-ink/40 dark:hover:border-d-ink/30'
            }`}
          >
            All tags
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-[12px] font-medium shrink-0 border transition-colors ${
                filterTag === tag
                  ? 'bg-ink text-bg border-ink dark:bg-d-ink dark:text-d-bg dark:border-d-ink'
                  : 'bg-card dark:bg-d-card text-ink2 dark:text-d-ink2 border-rule dark:border-d-rule hover:border-ink/40 dark:hover:border-d-ink/30'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 dark:border-d-ink/30 border-t-ink dark:border-t-d-ink" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-ink-mute dark:text-d-ink-mute text-sm">No readings yet. Log your first sky.</p>
        </div>
      )}

      {!loading && filtered.length === 0 && entries.length > 0 && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-ink-mute dark:text-d-ink-mute text-sm">No readings match your filters.</p>
        </div>
      )}

      {groups.map(({ day, items }) => (
        <div key={day} className="mb-4">
          <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mb-2 pl-1">
            {day}
          </p>
          <div className="flex flex-col gap-2.5">
            <AnimatePresence mode="popLayout">
              {items.map(entry => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={remove}
                  onEdit={setEditEntry}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      ))}

      <EditModal
        entry={editEntry}
        allTags={allTags}
        onSave={update}
        onClose={() => setEditEntry(null)}
      />
    </div>
  )
}
