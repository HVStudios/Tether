import { useState } from 'react'
import { usePeriodSummary } from '../../hooks/usePeriodSummary'
import { getMood } from '../../utils/moodEmoji'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function PeriodSummaryCard({ entries }: Props) {
  const [mode, setMode] = useState<'week' | 'month'>('week')
  const summary = usePeriodSummary(entries, mode)
  const mood = summary.avg !== null ? getMood(Math.round(summary.avg)) : null

  const trendPositive = summary.trend !== null && summary.trend > 0
  const trendNegative = summary.trend !== null && summary.trend < 0

  return (
    <div className="bg-white/70 dark:bg-[#1c1530]/70 backdrop-blur-sm rounded-3xl border border-white/80 dark:border-white/6 shadow-lg dark:shadow-violet-950/20 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {mode === 'week' ? 'Weekly' : 'Monthly'} digest
        </h3>
        <div className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
          {(['week', 'month'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                mode === m
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {m === 'week' ? 'Week' : 'Month'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{summary.periodLabel}</p>

      {/* Empty state */}
      {summary.entries === 0 && (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <span className="text-3xl">📋</span>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            No entries {mode === 'week' ? 'this week' : 'this month'} yet.
          </p>
        </div>
      )}

      {/* Data */}
      {summary.entries > 0 && mood && (
        <>
          {/* Avg mood block */}
          <div
            className="rounded-2xl p-4 flex items-center justify-between mb-4 text-white"
            style={{ background: `linear-gradient(135deg, ${mood.color}dd, ${mood.color}88)` }}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl drop-shadow">{mood.emoji}</span>
              <div>
                <p className="text-3xl font-black leading-none">
                  {summary.avg}
                  <span className="text-sm font-normal opacity-70">/10</span>
                </p>
                <p className="text-xs opacity-75 mt-0.5">{mood.label}</p>
              </div>
            </div>
            {summary.trend !== null && (
              <div className="flex flex-col items-end">
                <span
                  className={`text-xl font-black ${
                    trendPositive ? 'text-emerald-300' : trendNegative ? 'text-red-300' : 'text-white/50'
                  }`}
                >
                  {trendPositive ? '↑' : trendNegative ? '↓' : '→'} {Math.abs(summary.trend)}
                </span>
                <span className="text-[10px] opacity-60">
                  vs {mode === 'week' ? 'last week' : 'last month'}
                </span>
              </div>
            )}
          </div>

          {/* Stat tiles */}
          <div className="flex gap-2">
            <div className="flex-1 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-3 text-center">
              <p className="text-xl font-black text-gray-900 dark:text-gray-100">{summary.entries}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide font-medium">
                entries
              </p>
            </div>
            {summary.bestDay && (
              <div className="flex-1 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-3 text-center">
                <p className="text-xl font-black text-gray-900 dark:text-gray-100">
                  {summary.bestDay.slice(0, 3)}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide font-medium">
                  best day
                </p>
              </div>
            )}
            {summary.topTag && (
              <div className="flex-1 min-w-0 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 p-3 text-center">
                <p className="text-xl font-black text-gray-900 dark:text-gray-100 truncate">
                  #{summary.topTag}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-wide font-medium">
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
