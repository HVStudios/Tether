import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useWeeklySummary } from '../hooks/useWeeklySummary'
import { EntryCard } from '../components/history/EntryCard'
import { EditModal } from '../components/history/EditModal'
import { WeeklySummary } from '../components/history/WeeklySummary'
import type { MoodEntry } from '../lib/types'

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

  return (
    <div className="flex flex-col gap-4 px-4 py-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">History</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{entries.length} entries</p>
      </div>

      <WeeklySummary {...summary} />

      {/* Search & filter */}
      <div className="flex flex-col gap-2">
        <input
          type="search"
          placeholder="Search notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#0e0a1e] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={filterScore}
            onChange={e => setFilterScore(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-[#0e0a1e] text-gray-700 dark:text-gray-300 px-2.5 py-1 text-xs shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="all">All scores</option>
            <option value="1-3">Low (1–3)</option>
            <option value="4-6">Mid (4–6)</option>
            <option value="7-10">High (7–10)</option>
          </select>

          <button
            onClick={() => setFilterTag(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 transition-colors ${
              filterTag === null
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                : 'bg-white/60 dark:bg-white/6 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/60 dark:border-white/6'
            }`}
          >
            All tags
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 transition-colors ${
                filterTag === tag
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                  : 'bg-white/60 dark:bg-white/6 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/60 dark:border-white/6'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-5xl">📋</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm">No entries yet. Log your first mood!</p>
        </div>
      )}

      {!loading && filtered.length === 0 && entries.length > 0 && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm">No entries match your filters.</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {filtered.map(entry => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onDelete={remove}
              onEdit={setEditEntry}
            />
          ))}
        </AnimatePresence>
      </div>

      <EditModal
        entry={editEntry}
        allTags={allTags}
        onSave={update}
        onClose={() => setEditEntry(null)}
      />
    </div>
  )
}
