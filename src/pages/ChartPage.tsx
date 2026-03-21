import { useState } from 'react'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useChartData } from '../hooks/useChartData'
import { MoodLineChart } from '../components/chart/MoodLineChart'
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
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Mood trend</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Daily average score</p>
        </div>
        <div className="flex gap-1 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 p-1 shadow-sm">
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
          className="rounded-2xl p-4 flex gap-4 items-center shadow-md text-white"
          style={{ background: `linear-gradient(135deg, ${mood.color}dd, ${mood.color}99)` }}
        >
          <span className="text-5xl drop-shadow">{mood.emoji}</span>
          <div>
            <p className="text-3xl font-black leading-none">
              {avgScore}<span className="text-base font-normal opacity-70">/10</span>
            </p>
            <p className="text-sm opacity-80 font-medium mt-0.5">{mood.label}</p>
            <p className="text-xs opacity-60 mt-0.5">
              {days}-day average · {chartData.reduce((s, p) => s + p.count, 0)} entries
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-sm p-4">
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
        {!loading && !error && chartData.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-5xl">📈</span>
            <p className="text-gray-500 dark:text-gray-400 text-sm">No data for this period yet.</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">Log some entries to see your trend.</p>
          </div>
        )}
        {!loading && chartData.length > 0 && <MoodLineChart data={chartData} />}
      </div>
    </div>
  )
}
