import { useState } from 'react'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useChartData } from '../hooks/useChartData'
import { MoodLineChart } from '../components/chart/MoodLineChart'
import { LevelCard } from '../components/stats/LevelCard'
import { AchievementGrid } from '../components/stats/AchievementGrid'
import { RecordsGrid } from '../components/stats/RecordsGrid'
import { MoodDistributionChart } from '../components/stats/MoodDistributionChart'
import { DayOfWeekChart } from '../components/stats/DayOfWeekChart'
import { TagUsageChart } from '../components/stats/TagUsageChart'
import { TagCorrelations } from '../components/stats/TagCorrelations'
import { MissionsCard } from '../components/stats/MissionsCard'
import { PeriodSummaryCard } from '../components/stats/PeriodSummaryCard'
import { Mark, Wordmark } from '../components/Mark'

const RANGE_OPTIONS = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
]

export function ChartPage() {
  const { entries, loading, error } = useMoodEntries()
  const [days, setDays] = useState(30)
  const chartData = useChartData(entries, days)

  const avgScore =
    chartData.length > 0
      ? Math.round((chartData.reduce((s, p) => s + p.average, 0) / chartData.length) * 10) / 10
      : null

  return (
    <div className="flex flex-col gap-4 px-5 md:px-8 py-6 max-w-lg md:max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 md:hidden">
          <Mark size={28} />
          <Wordmark size={18} />
        </div>
        <div className="hidden md:block" />
        <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-ink-mute dark:text-d-ink-mute">
          {entries.length} readings
        </p>
      </div>

      <div>
        <h1
          className="text-[32px] md:text-[40px] font-semibold leading-[1.05] text-ink dark:text-d-ink"
          style={{ letterSpacing: '-0.025em' }}
        >
          Your atmosphere
        </h1>
        <p className="text-[14px] text-ink-mute dark:text-d-ink-mute mt-1">
          A view of your inner weather over time
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 dark:border-d-ink/30 border-t-ink dark:border-t-d-ink" />
        </div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <LevelCard entries={entries} />

          <RecordsGrid entries={entries} />

          <PeriodSummaryCard entries={entries} />

          {/* Trend card */}
          <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
                  Forecast
                </p>
                <p className="text-[15px] font-medium text-ink dark:text-d-ink mt-0.5">
                  {avgScore !== null
                    ? avgScore >= 7
                      ? 'Mostly bright'
                      : avgScore >= 5
                        ? 'Mixed skies'
                        : 'Cloudy stretch'
                    : 'No data yet'}
                </p>
              </div>
              <div className="flex gap-1 rounded-full bg-bg2 dark:bg-d-bg2 p-1">
                {RANGE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDays(opt.value)}
                    className={`rounded-full px-3 py-1 font-mono text-[10px] font-medium transition-all ${
                      days === opt.value
                        ? 'bg-card dark:bg-d-card text-ink dark:text-d-ink shadow-sm'
                        : 'text-ink-mute dark:text-d-ink-mute'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {chartData.length === 0 ? (
              <p className="text-center text-sm text-ink-mute dark:text-d-ink-mute py-8">
                No data for this period yet.
              </p>
            ) : (
              <MoodLineChart data={chartData} />
            )}
          </div>

          <MoodDistributionChart entries={entries} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DayOfWeekChart entries={entries} />
            <TagUsageChart entries={entries} />
          </div>

          <TagCorrelations entries={entries} />

          <MissionsCard entries={entries} />

          <AchievementGrid entries={entries} />
        </>
      )}
    </div>
  )
}
