import { skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function TagCorrelations({ entries }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (entries.length < 3) return null

  const overallAvg = entries.reduce((s, e) => s + e.score, 0) / entries.length

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

  const max = Math.max(...correlations.map(c => Math.abs(c.delta)), 1)
  const [posA, posB] = skyColors(9, isDark)
  const [negA, negB] = skyColors(2, isDark)

  return (
    <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
      <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
        What lifts you
      </p>
      <p className="text-[12px] text-ink2 dark:text-d-ink2 mb-3">
        vs. your overall average ({Math.round(overallAvg * 10) / 10})
      </p>

      <div className="flex flex-col gap-1.5">
        {correlations.map(({ tag, delta, count }) => {
          const pos = delta >= 0
          const pct = (Math.abs(delta) / max) * 100
          return (
            <div
              key={tag}
              className="grid items-center gap-2"
              style={{ gridTemplateColumns: '72px 1fr 1fr 56px' }}
            >
              <span className="text-[12px] text-ink dark:text-d-ink font-medium truncate">
                {tag}
              </span>
              <div className="h-2 flex justify-end">
                {!pos && (
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${negB}, ${negA})`,
                    }}
                  />
                )}
              </div>
              <div className="h-2">
                {pos && (
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${posA}, ${posB})`,
                    }}
                  />
                )}
              </div>
              <div className="text-right">
                <span className={`font-mono text-[11px] font-semibold ${pos ? 'text-ink dark:text-d-ink' : 'text-ink2 dark:text-d-ink2'}`}>
                  {pos ? '+' : ''}{delta}
                </span>
                <span className="font-mono text-[9px] text-ink-mute dark:text-d-ink-mute ml-1">
                  ({count}×)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
