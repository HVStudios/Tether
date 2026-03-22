import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function TagUsageChart({ entries }: Props) {
  const counts = new Map<string, number>()
  for (const e of entries) {
    for (const t of e.tags ?? []) {
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
  }

  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  if (top.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Top Tags</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 py-6 text-center">No tags logged yet</p>
      </div>
    )
  }

  const maxCount = top[0][1]

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Top Tags</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Your most used mood tags</p>

      <div className="flex flex-col gap-2.5">
        {top.map(([tag, count], i) => {
          const pct = (count / maxCount) * 100
          return (
            <div key={tag} className="flex items-center gap-2">
              <span className="w-4 text-right text-xs font-bold text-gray-400 dark:text-gray-500 shrink-0">
                {i + 1}
              </span>
              <span className="w-20 text-xs text-gray-700 dark:text-gray-300 font-medium truncate shrink-0">
                #{tag}
              </span>
              <div className="flex-1 h-4 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: 'linear-gradient(to right, #7c3aed, #c026d3)',
                  }}
                />
              </div>
              <span className="w-5 text-right text-xs text-gray-400 dark:text-gray-500 shrink-0 font-medium">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
