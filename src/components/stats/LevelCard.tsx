import { useTotalXP } from '../../hooks/useTotalXP'
import { skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function LevelCard({ entries }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { totalXP, currentLevel, nextLevel, xpIntoLevel, xpForLevel, progress } = useTotalXP(entries)

  // Use a sky gradient tied to current level (1-10 → sky 1-10)
  const baseN = currentLevel.level
  const [a] = skyColors(baseN, isDark)
  const [, b] = skyColors(Math.min(10, baseN + 1), isDark)
  const grad = `linear-gradient(135deg, ${a}, ${b})`

  return (
    <div
      className="relative rounded-3xl p-5 text-white overflow-hidden"
      style={{ background: grad, boxShadow: `0 12px 36px ${a}40` }}
    >
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/15 pointer-events-none" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.1em] uppercase opacity-85">
            Level {currentLevel.level} · {totalXP} xp
          </p>
          <p
            className="text-[26px] md:text-[28px] font-semibold mt-1 leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {currentLevel.name}
          </p>
        </div>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0"
          style={{ background: 'rgba(255,255,255,0.22)' }}
        >
          {currentLevel.level}
        </div>
      </div>

      <div className="relative mt-4">
        <div className="h-1.5 bg-white/25 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="flex justify-between mt-2 font-mono text-[11px] opacity-85">
          <span>
            {xpIntoLevel} / {xpForLevel}
          </span>
          <span>{nextLevel ? `→ ${nextLevel.name}` : 'Max level'}</span>
        </div>
      </div>

    </div>
  )
}
