import { skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function TagUsageChart({ entries }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const counts = new Map<string, number>()
  for (const e of entries) {
    for (const t of e.tags ?? []) {
      counts.set(t, (counts.get(t) ?? 0) + 1)
    }
  }

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)

  if (top.length === 0) {
    return (
      <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
        <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mb-3">
          Top tags
        </p>
        <p className="text-center text-sm text-ink-mute dark:text-d-ink-mute py-6">
          No tags logged yet
        </p>
      </div>
    )
  }

  const max = top[0][1]
  const [a, b] = skyColors(8, isDark)

  return (
    <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
      <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mb-3">
        Top tags
      </p>

      <div className="flex flex-col gap-2">
        {top.map(([tag, count], i) => {
          const pct = (count / max) * 100
          return (
            <div key={tag} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-ink-mute dark:text-d-ink-mute w-4 text-right shrink-0">
                {i + 1}
              </span>
              <span className="text-[12px] font-medium text-ink dark:text-d-ink w-20 truncate shrink-0">
                {tag}
              </span>
              <div className="flex-1 h-2 bg-bg2 dark:bg-d-bg2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${a}, ${b})` }}
                />
              </div>
              <span className="font-mono text-[10px] text-ink-mute dark:text-d-ink-mute w-5 text-right shrink-0">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
