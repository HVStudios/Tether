import { getMood } from '../../utils/moodEmoji'

interface Props {
  thisAvg: number | null
  count: number
  topTags: string[]
  trend: number | null
}

export function WeeklySummary({ thisAvg, count, topTags, trend }: Props) {
  if (thisAvg === null && count === 0) return null

  const mood = thisAvg !== null ? getMood(Math.round(thisAvg)) : null

  const trendStr =
    trend === null ? null
    : trend > 0 ? `↑ ${trend.toFixed(1)} vs last week`
    : trend < 0 ? `↓ ${Math.abs(trend).toFixed(1)} vs last week`
    : '= same as last week'

  const trendColor =
    trend === null ? 'text-white/60'
    : trend > 0 ? 'text-emerald-200'
    : trend < 0 ? 'text-red-200'
    : 'text-white/50'

  return (
    <div
      className="rounded-2xl p-4 flex gap-4 items-center shadow-md text-white overflow-hidden relative"
      style={{
        background: mood
          ? `linear-gradient(135deg, ${mood.color}ee, ${mood.color}99)`
          : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
      }}
    >
      {/* Subtle decorative circle */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -right-2 bottom-0 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

      <div className="text-5xl shrink-0 drop-shadow relative">
        {mood ? mood.emoji : '📋'}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0 relative">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">This week</p>
        <div className="flex items-baseline gap-2 flex-wrap">
          {thisAvg !== null ? (
            <span className="text-2xl font-black">
              {thisAvg}<span className="text-sm font-normal opacity-60">/10</span>
            </span>
          ) : (
            <span className="text-sm opacity-70">No entries yet</span>
          )}
          {trendStr && (
            <span className={`text-xs font-semibold ${trendColor}`}>{trendStr}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <span className="text-xs text-white/60">{count} {count === 1 ? 'entry' : 'entries'}</span>
          {topTags.length > 0 && (
            <div className="flex gap-1">
              {topTags.map(tag => (
                <span key={tag} className="rounded-full bg-white/20 text-white px-2 py-0.5 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
