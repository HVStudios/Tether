import { useId } from 'react'
import { sky } from '../lib/skies'

interface Props {
  size?: number
  /** Sky number to use for the gradient (default: 9 = golden) */
  n?: number
}

export function Mark({ size = 36, n = 9 }: Props) {
  const id = useId().replace(/:/g, '')
  const s = sky(n)
  const [a, b] = s.g

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <clipPath id={`c${id}`}>
          <rect x="0" y="0" width="40" height="40" rx="11" />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <rect width="40" height="40" rx="11" fill={`url(#m${id})`} />
        <path d="M-2 27 Q 20 21 42 27 L 42 42 L -2 42 Z" fill="#1f2433" opacity="0.18" />
        <circle cx="20" cy="18" r="6.2" fill="#fff" opacity="0.85" />
      </g>
    </svg>
  )
}

interface WordProps {
  size?: number
  className?: string
}

export function Wordmark({ size = 22, className = '' }: WordProps) {
  return (
    <span
      className={`text-ink dark:text-d-ink ${className}`}
      style={{
        fontFamily: '"Outfit", system-ui, sans-serif',
        fontWeight: 600,
        fontSize: size,
        letterSpacing: '-0.02em',
        lineHeight: 1,
      }}
    >
      tether
    </span>
  )
}
