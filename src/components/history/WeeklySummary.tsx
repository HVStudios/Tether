import { sky, skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'

interface Props {
  thisAvg: number | null
  count: number
  topTags: string[]
  trend: number | null
  /** Optional per-entry scores for a mini sparkline */
  recentScores?: number[]
}

export function WeeklySummary({ thisAvg, count, topTags, trend, recentScores = [] }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (thisAvg === null && count === 0) return null

  const avgN = thisAvg !== null ? Math.round(thisAvg) : 7
  const s = sky(avgN)
  const [a, b] = skyColors(avgN, isDark)

  const trendStr =
    trend === null ? null
    : trend > 0 ? `↑ ${trend.toFixed(1)} vs last week`
    : trend < 0 ? `↓ ${Math.abs(trend).toFixed(1)} vs last week`
    : '= same as last week'

  return (
    <div
      className="relative rounded-3xl p-6 text-white overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${a}, ${b})`,
        boxShadow: `0 12px 36px ${a}55`,
      }}
    >
      <div className="absolute -top-5 -right-2 w-28 h-28 rounded-full bg-white/15 pointer-events-none" />
      <div className="absolute top-8 right-12 w-16 h-16 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative">
        <p className="font-mono text-[10px] tracking-[0.1em] uppercase opacity-85">This week</p>

        {thisAvg !== null ? (
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-[58px] font-semibold leading-none tracking-tighter" style={{ letterSpacing: '-0.04em' }}>
              {thisAvg.toFixed(1)}
            </span>
            <span className="text-[15px] opacity-80">/ 10</span>
          </div>
        ) : (
          <p className="mt-1 text-sm opacity-80">No entries yet</p>
        )}

        <p className="text-[16px] font-medium capitalize mt-0.5">{s.label} stretch</p>

        <div className="flex items-center gap-2 flex-wrap mt-3">
          {trendStr && (
            <span className="inline-flex items-center gap-1 bg-white/22 rounded-full px-2.5 py-1 text-[12px] font-medium">
              {trendStr}
            </span>
          )}
          <span className="text-[12px] opacity-80">
            {count} {count === 1 ? 'reading' : 'readings'}
          </span>
        </div>

        {topTags.length > 0 && (
          <div className="flex gap-1.5 mt-2.5">
            {topTags.map(tag => (
              <span key={tag} className="rounded-full bg-white/22 text-white px-2 py-0.5 text-[11px] font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {recentScores.length > 1 && (
          <div className="flex items-end gap-1 mt-4 h-8">
            {recentScores.slice().reverse().map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-white/55"
                style={{ height: `${(v / 10) * 100}%` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
