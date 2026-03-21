import { useState } from 'react'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useChartData } from '../hooks/useChartData'
import { MoodLineChart } from '../components/chart/MoodLineChart'
import { getMood } from '../utils/moodEmoji'

const RANGE_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
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
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Mood trend</h2>
          <p className="text-sm text-gray-500 mt-0.5">Daily average score</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                days === opt.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {avgScore !== null && (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 items-center">
          <span className="text-4xl">{getMood(Math.round(avgScore)).emoji}</span>
          <div>
            <p className="text-2xl font-bold text-gray-900">{avgScore}<span className="text-base font-normal text-gray-400">/10</span></p>
            <p className="text-sm text-gray-500">Average over {days} days · {chartData.reduce((s, p) => s + p.count, 0)} entries</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && chartData.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-5xl">📈</span>
            <p className="text-gray-500 text-sm">No data for this period yet.</p>
            <p className="text-gray-400 text-xs">Log some entries to see your trend.</p>
          </div>
        )}

        {!loading && chartData.length > 0 && <MoodLineChart data={chartData} />}
      </div>
    </div>
  )
}
