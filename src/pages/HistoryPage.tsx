import { useMoodEntries } from '../hooks/useMoodEntries'
import { EntryCard } from '../components/history/EntryCard'

export function HistoryPage() {
  const { entries, loading, error } = useMoodEntries()

  return (
    <div className="flex flex-col gap-4 px-4 py-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">History</h2>
        <p className="text-sm text-gray-500 mt-0.5">{entries.length} entries</p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="text-5xl">📋</span>
          <p className="text-gray-500 text-sm">No entries yet. Log your first mood!</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {entries.map(entry => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  )
}
