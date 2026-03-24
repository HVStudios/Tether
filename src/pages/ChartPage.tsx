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
import { getMood } from '../utils/moodEmoji'

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

  const mood = avgScore !== null ? getMood(Math.round(avgScore)) : null

  return (
    <div className="flex flex-col gap-5 px-4 md:px-8 py-6 max-w-lg md:max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100">Stats</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Your mood journey at a glance</p>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <LevelCard entries={entries} />

          <RecordsGrid entries={entries} />

          {/* Trend chart */}
          <div className="bg-white/70 dark:bg-[#1c1530]/70 backdrop-blur-sm rounded-3xl border border-white/80 dark:border-white/6 shadow-lg dark:shadow-violet-950/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Mood trend</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Daily average score</p>
              </div>
              <div className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                {RANGE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setDays(opt.value)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      days === opt.value
                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {mood && avgScore !== null && (
              <div
                className="rounded-xl p-3 flex gap-3 items-center mb-4 text-white"
                style={{ background: `linear-gradient(135deg, ${mood.color}dd, ${mood.color}99)` }}
              >
                <span className="text-3xl drop-shadow">{mood.emoji}</span>
                <div>
                  <p className="text-2xl font-black leading-none">
                    {avgScore}<span className="text-sm font-normal opacity-70">/10</span>
                  </p>
                  <p className="text-xs opacity-70 mt-0.5">
                    {mood.label} · {chartData.reduce((s, p) => s + p.count, 0)} entries
                  </p>
                </div>
              </div>
            )}

            {chartData.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="text-4xl">📈</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No data for this period yet.</p>
              </div>
            ) : (
              <MoodLineChart data={chartData} />
            )}
          </div>

          <MoodDistributionChart entries={entries} />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DayOfWeekChart entries={entries} />
            <TagUsageChart entries={entries} />
          </div>

          <MissionsCard entries={entries} />

          <TagCorrelations entries={entries} />

          <AchievementGrid entries={entries} />
        </>
      )}
    </div>
  )
}
