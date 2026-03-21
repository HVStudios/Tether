import { getMood } from '../../utils/moodEmoji'

interface Props {
  thisAvg: number | null
  count: number
  topTags: string[]
  trend: number | null
}

export function WeeklySummary({ thisAvg, count, topTags, trend }: Props) {
  if (thisAvg === null && count === 0) return null

  const trendStr =
    trend === null ? null
    : trend > 0 ? `↑ ${trend.toFixed(1)} vs last week`
    : trend < 0 ? `↓ ${Math.abs(trend).toFixed(1)} vs last week`
    : '= same as last week'

  const trendColor =
    trend === null ? ''
    : trend > 0 ? 'text-green-600 dark:text-green-400'
    : trend < 0 ? 'text-red-500 dark:text-red-400'
    : 'text-gray-400 dark:text-gray-500'

  return (
    <div className="bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 flex gap-4 items-center">
      <div className="text-4xl shrink-0">
        {thisAvg !== null ? getMood(Math.round(thisAvg)).emoji : '📋'}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">This week</p>
        <div className="flex items-baseline gap-2">
          {thisAvg !== null ? (
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {thisAvg}<span className="text-sm font-normal text-gray-400 dark:text-gray-500">/10</span>
            </span>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">No entries yet</span>
          )}
          {trendStr && (
            <span className={`text-xs font-medium ${trendColor}`}>{trendStr}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 dark:text-gray-500">{count} {count === 1 ? 'entry' : 'entries'}</span>
          {topTags.length > 0 && (
            <div className="flex gap-1">
              {topTags.map(tag => (
                <span key={tag} className="rounded-full bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-0.5 text-xs">
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
