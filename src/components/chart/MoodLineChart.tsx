import { useId } from 'react'
import type { ChartPoint } from '../../lib/types'
import { useTheme } from '../../context/ThemeContext'

interface Props {
  data: ChartPoint[]
}

export function MoodLineChart({ data }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const id = useId().replace(/:/g, '')
  const accent = isDark ? '#7a87f0' : '#3d4ee5'
  const card = isDark ? '#23262f' : '#ffffff'

  const w = 320
  const h = 120
  const max = 10
  const min = 1

  if (data.length === 0) return null

  const pts: [number, number][] = data.map((d, i) => [
    data.length === 1 ? w / 2 : (i / (data.length - 1)) * w,
    h - ((d.average - min) / (max - min)) * h,
  ])

  // Smooth quadratic-through-midpoints curve (matches v3 sparkline)
  let path = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cx = (prev[0] + curr[0]) / 2
    const cy = (prev[1] + curr[1]) / 2
    path += ` Q ${prev[0]} ${prev[1]} ${cx} ${cy} T ${curr[0]} ${curr[1]}`
  }
  const area = `${path} L ${w} ${h} L 0 ${h} Z`

  // Reference line at y=5
  const midY = h - ((5 - min) / (max - min)) * h

  return (
    <div className="w-full">
      <svg
        width="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible', height: 140 }}
      >
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.22" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Reference line */}
        <line x1="0" x2={w} y1={midY} y2={midY} stroke={isDark ? '#f0f1f618' : '#1f243314'} strokeDasharray="3 3" />
        <path d={area} fill={`url(#spark-${id})`} />
        <path d={path} stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill={card} stroke={accent} strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  )
}
