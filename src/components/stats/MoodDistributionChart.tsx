import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

const SCORE_COLORS: Record<number, string> = {
  1:  '#ef4444',
  2:  '#f97316',
  3:  '#fb923c',
  4:  '#facc15',
  5:  '#a3e635',
  6:  '#4ade80',
  7:  '#34d399',
  8:  '#2dd4bf',
  9:  '#38bdf8',
  10: '#818cf8',
}

export function MoodDistributionChart({ entries }: Props) {
  const counts: Record<number, number> = {}
  for (let i = 1; i <= 10; i++) counts[i] = 0
  for (const e of entries) counts[e.score] = (counts[e.score] ?? 0) + 1

  const max = Math.max(...Object.values(counts), 1)

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Mood Distribution</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">How often you log each score</p>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(score => {
          const count = counts[score] ?? 0
          const pct = entries.length > 0 ? Math.round((count / entries.length) * 100) : 0
          const barWidth = max > 0 ? (count / max) * 100 : 0

          return (
            <div key={score} className="flex items-center gap-2">
              <span className="w-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
                {score}
              </span>
              <div className="flex-1 h-5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: SCORE_COLORS[score],
                    minWidth: count > 0 ? '6px' : '0',
                  }}
                />
              </div>
              <span className="w-8 text-right text-xs text-gray-400 dark:text-gray-500 shrink-0">
                {pct > 0 ? `${pct}%` : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
