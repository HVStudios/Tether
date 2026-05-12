import { useRecords } from '../../hooks/useRecords'
import { SkyChip } from '../SkyChip'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

function fmtShortDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function RecordsGrid({ entries }: Props) {
  const r = useRecords(entries)

  const tiles: Array<{ label: string; value: string; sub: string; sky: number }> = [
    { label: 'Streak',   value: r.longestStreak ? `${r.longestStreak}` : '—', sub: 'days', sky: 9 },
    { label: 'Entries',  value: `${r.totalEntries}`, sub: 'logged', sky: 7 },
    { label: 'Avg',      value: r.allTimeAvg !== null ? `${r.allTimeAvg}` : '—', sub: 'all-time', sky: 8 },
    { label: 'Best day', value: r.bestDayAvg !== null ? `${r.bestDayAvg}` : '—', sub: fmtShortDate(r.bestDayDate), sky: 10 },
    { label: 'Most/day', value: r.mostInOneDay ? `${r.mostInOneDay}` : '—', sub: 'entries', sky: 6 },
    { label: 'Top tag',  value: r.topTag ? `${r.topTag}` : '—', sub: 'most used', sky: 4 },
  ]

  return (
    <div className="grid grid-cols-2 gap-2">
      {tiles.map(t => (
        <div
          key={t.label}
          className="bg-card dark:bg-d-card border border-rule dark:border-d-rule rounded-2xl p-3.5"
        >
          <div className="flex items-center gap-2 mb-2">
            <SkyChip n={t.sky} size={20} radius={6} sun={false} />
            <span className="font-mono text-[9px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
              {t.label}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[26px] font-semibold leading-none text-ink dark:text-d-ink truncate"
              style={{ letterSpacing: '-0.03em' }}
            >
              {t.value}
            </span>
            <span className="text-[11px] text-ink-mute dark:text-d-ink-mute truncate">{t.sub}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
