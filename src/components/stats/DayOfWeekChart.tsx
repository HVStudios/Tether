import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function DayOfWeekChart({ entries }: Props) {
  // getDay() returns 0=Sun, convert to Mon=0 index
  const totals = new Array(7).fill(0)
  const counts = new Array(7).fill(0)

  for (const e of entries) {
    const day = (new Date(e.logged_at).getDay() + 6) % 7 // Mon=0
    totals[day] += e.score
    counts[day]++
  }

  const avgs = totals.map((t, i) => (counts[i] > 0 ? Math.round((t / counts[i]) * 10) / 10 : null))
  const maxAvg = Math.max(...avgs.filter((a): a is number => a !== null), 1)

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Best Days</h3>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Average mood by day of week</p>

      <div className="flex items-end gap-1.5 h-28">
        {avgs.map((avg, i) => {
          const height = avg !== null ? Math.max((avg / maxAvg) * 100, 8) : 0
          const isTop = avg !== null && avg === maxAvg
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex-1 relative flex items-end">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 relative"
                  style={{
                    height: `${height}%`,
                    background: isTop
                      ? 'linear-gradient(to top, #7c3aed, #c026d3)'
                      : avg !== null
                      ? 'linear-gradient(to top, #a78bfa, #c4b5fd)'
                      : 'transparent',
                  }}
                />
              </div>
              {avg !== null && (
                <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400">{avg}</span>
              )}
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{DAYS[i]}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
