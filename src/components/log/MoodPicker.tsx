import { sky, SKIES, skyColors } from '../../lib/skies'
import { SkyChip } from '../SkyChip'
import { useTheme } from '../../context/ThemeContext'

interface Props {
  value: number | null
  onChange: (score: number) => void
}

export function MoodPicker({ value, onChange }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const s = value !== null ? sky(value) : null

  return (
    <div className="flex flex-col gap-4">
      {/* Selected reading */}
      {s ? (
        <div className="flex items-center gap-4">
          <SkyChip n={value!} size={84} radius={22} />
          <div className="flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-mute dark:text-d-ink-mute">Reading</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span
                className="text-5xl font-semibold leading-none tracking-tighter text-ink dark:text-d-ink"
                style={{ letterSpacing: '-0.04em' }}
              >
                {value}
              </span>
              <span className="text-sm text-ink-mute dark:text-d-ink-mute">/ 10</span>
            </div>
            <p className="text-[17px] font-medium text-ink dark:text-d-ink capitalize mt-0.5">{s.label}</p>
          </div>
        </div>
      ) : (
        <p className="text-ink-mute dark:text-d-ink-mute text-[15px]">Tap a sky below to log how you feel.</p>
      )}

      {/* 5×2 sky grid */}
      <div className="grid grid-cols-5 gap-2">
        {SKIES.map(sk => {
          const isSelected = value === sk.n
          const [a] = skyColors(sk.n, isDark)
          return (
            <button
              key={sk.n}
              type="button"
              onClick={() => onChange(sk.n)}
              title={`${sk.n} – ${sk.label}`}
              className="flex flex-col items-center gap-1 p-0 bg-transparent border-0 cursor-pointer transition-transform"
              style={{
                transform: isSelected ? 'scale(1.04)' : 'none',
                filter: isSelected ? `drop-shadow(0 6px 16px ${a}55)` : 'none',
              }}
            >
              <SkyChip n={sk.n} size={48} radius={14} selected={isSelected} />
              <span
                className={`font-mono text-[10px] font-medium ${
                  isSelected ? 'text-ink dark:text-d-ink' : 'text-ink-mute dark:text-d-ink-mute'
                }`}
              >
                {sk.n}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
