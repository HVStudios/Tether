import { sky, skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function DayOfWeekChart({ entries }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const totals = new Array(7).fill(0)
  const counts = new Array(7).fill(0)
  for (const e of entries) {
    const day = (new Date(e.logged_at).getDay() + 6) % 7
    totals[day] += e.score
    counts[day]++
  }
  const avgs = totals.map((t, i) => (counts[i] > 0 ? Math.round((t / counts[i]) * 10) / 10 : null))
  const max = Math.max(...avgs.filter((a): a is number => a !== null), 1)

  return (
    <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
      <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mb-3">
        By day of week
      </p>

      <div className="flex items-end gap-1.5 h-[100px]">
        {avgs.map((avg, i) => {
          const isBest = avg !== null && avg === max
          const sk = avg !== null ? sky(Math.round(avg)) : null
          const [a, b] = sk ? skyColors(sk.n, isDark) : [null, null]
          const height = avg !== null ? Math.max((avg / 10) * 78, 6) : 0

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span
                className={`font-mono text-[9px] ${
                  isBest ? 'text-ink dark:text-d-ink font-semibold' : 'text-ink-mute dark:text-d-ink-mute'
                }`}
              >
                {avg !== null ? avg.toFixed(1) : ''}
              </span>
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full rounded-lg transition-all duration-500"
                  style={{
                    height: avg !== null ? `${height}%` : 0,
                    background:
                      a && b
                        ? `linear-gradient(180deg, ${a}, ${b})`
                        : 'transparent',
                  }}
                />
              </div>
              <span
                className={`font-mono text-[10px] ${
                  isBest ? 'text-ink dark:text-d-ink font-semibold' : 'text-ink-mute dark:text-d-ink-mute'
                }`}
              >
                {DAYS[i]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
