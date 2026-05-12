import { useState } from 'react'
import { usePeriodSummary } from '../../hooks/usePeriodSummary'
import { sky, skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function PeriodSummaryCard({ entries }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [mode, setMode] = useState<'week' | 'month'>('week')
  const summary = usePeriodSummary(entries, mode)

  const avgN = summary.avg !== null ? Math.round(summary.avg) : 7
  const s = sky(avgN)
  const [a, b] = skyColors(avgN, isDark)

  const trendPos = summary.trend !== null && summary.trend > 0
  const trendNeg = summary.trend !== null && summary.trend < 0

  return (
    <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
      <div className="flex items-center justify-between mb-1">
        <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
          {mode === 'week' ? 'Weekly digest' : 'Monthly digest'}
        </p>
        <div className="flex gap-1 rounded-full bg-bg2 dark:bg-d-bg2 p-1">
          {(['week', 'month'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] font-medium transition-all ${
                mode === m
                  ? 'bg-card dark:bg-d-card text-ink dark:text-d-ink shadow-sm'
                  : 'text-ink-mute dark:text-d-ink-mute'
              }`}
            >
              {m === 'week' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[12px] text-ink-mute dark:text-d-ink-mute mb-4">{summary.periodLabel}</p>

      {summary.entries === 0 && (
        <p className="text-center text-sm text-ink-mute dark:text-d-ink-mute py-6">
          No entries {mode === 'week' ? 'this week' : 'this month'} yet.
        </p>
      )}

      {summary.entries > 0 && (
        <>
          <div
            className="rounded-2xl p-4 flex items-center justify-between mb-4 text-white"
            style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
          >
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[40px] font-semibold leading-none"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  {summary.avg}
                </span>
                <span className="text-sm opacity-80">/ 10</span>
              </div>
              <p className="text-[13px] font-medium capitalize opacity-90 mt-1">{s.label}</p>
            </div>
            {summary.trend !== null && (
              <div className="text-right">
                <span
                  className={`text-[18px] font-semibold ${
                    trendPos ? 'text-white' : trendNeg ? 'text-white/90' : 'text-white/60'
                  }`}
                >
                  {trendPos ? '↑' : trendNeg ? '↓' : '→'} {Math.abs(summary.trend)}
                </span>
                <p className="text-[10px] opacity-70 mt-0.5">
                  vs {mode === 'week' ? 'last week' : 'last month'}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 rounded-2xl bg-bg2 dark:bg-d-bg2 p-3 text-center">
              <p className="text-[20px] font-semibold text-ink dark:text-d-ink leading-none" style={{ letterSpacing: '-0.02em' }}>
                {summary.entries}
              </p>
              <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mt-1">
                entries
              </p>
            </div>
            {summary.bestDay && (
              <div className="flex-1 rounded-2xl bg-bg2 dark:bg-d-bg2 p-3 text-center">
                <p className="text-[20px] font-semibold text-ink dark:text-d-ink leading-none" style={{ letterSpacing: '-0.02em' }}>
                  {summary.bestDay.slice(0, 3)}
                </p>
                <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mt-1">
                  best day
                </p>
              </div>
            )}
            {summary.topTag && (
              <div className="flex-1 min-w-0 rounded-2xl bg-bg2 dark:bg-d-bg2 p-3 text-center">
                <p className="text-[20px] font-semibold text-ink dark:text-d-ink leading-none truncate" style={{ letterSpacing: '-0.02em' }}>
                  {summary.topTag}
                </p>
                <p className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mt-1">
                  top tag
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
