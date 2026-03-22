import { useRecords } from '../../hooks/useRecords'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function RecordsGrid({ entries }: Props) {
  const r = useRecords(entries)

  const records = [
    { icon: '🏆', label: 'Longest streak', value: r.longestStreak ? `${r.longestStreak} days` : '—' },
    { icon: '📝', label: 'Total entries', value: r.totalEntries ? `${r.totalEntries}` : '—' },
    { icon: '⭐', label: 'All-time avg', value: r.allTimeAvg !== null ? `${r.allTimeAvg}/10` : '—' },
    { icon: '📅', label: 'Best day', value: r.bestDayAvg !== null ? `${r.bestDayAvg}/10` : '—', sub: formatDate(r.bestDayDate) },
    { icon: '🗓️', label: 'Most in one day', value: r.mostInOneDay ? `${r.mostInOneDay}` : '—' },
    { icon: '🏷️', label: 'Top tag', value: r.topTag ? `#${r.topTag}` : '—' },
  ]

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Personal Records</h3>
      <div className="grid grid-cols-2 gap-3">
        {records.map(rec => (
          <div
            key={rec.label}
            className="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base leading-none">{rec.icon}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">
                {rec.label}
              </span>
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-gray-100 leading-tight">
              {rec.value}
            </p>
            {rec.sub && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{rec.sub}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
