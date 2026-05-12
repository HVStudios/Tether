import { useId } from 'react'
import { sky } from '../lib/skies'
import { useTheme } from '../context/ThemeContext'

interface Props {
  n: number
  size?: number
  radius?: number
  sun?: boolean
  selected?: boolean
}

export function SkyChip({ n, size = 56, radius = 18, sun = true, selected = false }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const s = sky(n)
  const [a, b] = isDark ? s.dg : s.g
  const id = useId().replace(/:/g, '')
  const gid = `sky-${id}-${n}-${size}`
  const ink = isDark ? '#f0f1f6' : '#1f2433'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block' }}
      aria-label={`${s.label} (${n}/10)`}
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect width={size} height={size} rx={radius} fill={`url(#${gid})`} />
      {sun && (
        <>
          <circle cx={size * 0.5} cy={size * 0.45} r={size * 0.16} fill="#fff" opacity="0.88" />
          <path
            d={`M -2 ${size * 0.72} Q ${size / 2} ${size * 0.6} ${size + 2} ${size * 0.72} L ${size + 2} ${size} L -2 ${size} Z`}
            fill="#000"
            opacity="0.18"
          />
        </>
      )}
      {selected && (
        <rect
          x="1"
          y="1"
          width={size - 2}
          height={size - 2}
          rx={radius - 1}
          fill="none"
          stroke={ink}
          strokeWidth={2}
        />
      )}
    </svg>
  )
}
