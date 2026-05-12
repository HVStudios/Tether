import { SKIES, skyColors } from '../../lib/skies'
import { SkyChip } from '../SkyChip'
import { useTheme } from '../../context/ThemeContext'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function MoodDistributionChart({ entries }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const counts: Record<number, number> = {}
  for (let i = 1; i <= 10; i++) counts[i] = 0
  for (const e of entries) counts[e.score] = (counts[e.score] ?? 0) + 1
  const max = Math.max(...Object.values(counts), 1)

  return (
    <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
      <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mb-3">
        Distribution
      </p>

      <div className="flex flex-col gap-1.5">
        {SKIES.map(sk => {
          const count = counts[sk.n] ?? 0
          const barWidth = (count / max) * 100
          const [a, b] = skyColors(sk.n, isDark)
          return (
            <div key={sk.n} className="flex items-center gap-2">
              <SkyChip n={sk.n} size={22} radius={7} sun={false} />
              <span className="font-mono text-[9.5px] tracking-[0.05em] uppercase text-ink-mute dark:text-d-ink-mute w-[60px] shrink-0">
                {sk.label}
              </span>
              <div className="flex-1 h-2 bg-bg2 dark:bg-d-bg2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    background: `linear-gradient(90deg, ${a}, ${b})`,
                    minWidth: count > 0 ? 4 : 0,
                  }}
                />
              </div>
              <span className="font-mono text-[10px] text-ink-mute dark:text-d-ink-mute w-6 text-right">
                {count}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
