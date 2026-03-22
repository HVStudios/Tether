import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function TagCorrelations({ entries }: Props) {
  if (entries.length < 3) return null

  const overallAvg = entries.reduce((s, e) => s + e.score, 0) / entries.length

  // For each tag: avg mood on entries that have it
  const tagTotals = new Map<string, { sum: number; count: number }>()
  for (const e of entries) {
    for (const t of e.tags ?? []) {
      if (!tagTotals.has(t)) tagTotals.set(t, { sum: 0, count: 0 })
      const s = tagTotals.get(t)!
      s.sum += e.score
      s.count++
    }
  }

  const correlations = [...tagTotals.entries()]
    .filter(([, s]) => s.count >= 2)
    .map(([tag, { sum, count }]) => ({
      tag,
      avg: Math.round((sum / count) * 10) / 10,
      delta: Math.round(((sum / count) - overallAvg) * 10) / 10,
      count,
    }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 8)

  if (correlations.length === 0) return null

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Tag Correlations</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        How each tag affects your average mood (vs {Math.round(overallAvg * 10) / 10} overall)
      </p>

      <div className="flex flex-col gap-2">
        {correlations.map(({ tag, avg, delta, count }) => {
          const positive = delta >= 0
          return (
            <div key={tag} className="flex items-center gap-3">
              <span className="w-20 text-xs font-medium text-gray-700 dark:text-gray-300 truncate shrink-0">
                #{tag}
              </span>
              <div className="flex-1 flex items-center gap-1.5">
                {/* Centre line */}
                <div className="flex-1 relative h-5 flex items-center">
                  <div className="absolute inset-x-0 h-px bg-gray-200 dark:bg-gray-700" />
                  <div className="absolute left-1/2 w-px h-3 bg-gray-300 dark:bg-gray-600" />
                  {/* Bar extending left or right from centre */}
                  <div
                    className="absolute h-4 rounded-full"
                    style={{
                      left: positive ? '50%' : `${50 + (delta / 10) * 50}%`,
                      width: `${Math.abs(delta) / 10 * 50}%`,
                      background: positive
                        ? 'linear-gradient(to right, #7c3aed, #a855f7)'
                        : 'linear-gradient(to left, #ef4444, #f97316)',
                      minWidth: Math.abs(delta) > 0 ? '4px' : '0',
                    }}
                  />
                </div>
              </div>
              <div className="shrink-0 text-right w-20">
                <span className={`text-xs font-bold ${positive ? 'text-violet-600 dark:text-violet-400' : 'text-red-500 dark:text-red-400'}`}>
                  {positive ? '+' : ''}{delta}
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-1">
                  ({avg}/10, {count}×)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
