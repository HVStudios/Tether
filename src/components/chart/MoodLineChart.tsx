import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts'
import type { ChartPoint } from '../../lib/types'
import { formatChartDate } from '../../utils/formatDate'
import { getMood } from '../../utils/moodEmoji'

interface TooltipPayload {
  payload?: ChartPoint
}

function CustomTooltip({ payload }: { payload?: TooltipPayload[] }) {
  if (!payload?.length || !payload[0].payload) return null
  const { date, average, count } = payload[0].payload
  const { emoji, label } = getMood(Math.round(average))
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm px-3 py-2 text-sm">
      <p className="font-semibold text-gray-700 dark:text-gray-300">{formatChartDate(date)}</p>
      <p className="text-gray-900 dark:text-gray-100">{emoji} {average} <span className="text-gray-400 dark:text-gray-500">({label})</span></p>
      <p className="text-xs text-gray-400 dark:text-gray-500">{count} {count === 1 ? 'entry' : 'entries'}</p>
    </div>
  )
}

interface Props {
  data: ChartPoint[]
}

export function MoodLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-100 dark:text-gray-800" />
        <XAxis
          dataKey="date"
          tickFormatter={formatChartDate}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          domain={[1, 10]}
          ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={5} stroke="#e5e7eb" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="average"
          stroke="#7c3aed"
          strokeWidth={2.5}
          dot={{ r: 4, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
