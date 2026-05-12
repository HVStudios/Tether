import { motion, AnimatePresence } from 'framer-motion'
import type { Level } from '../../hooks/useXP'
import { SkyChip } from '../SkyChip'
import { skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'

interface Props {
  level: Level | null
  onDismiss: () => void
}

export function LevelUpModal({ level, onDismiss }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const n = level?.level ?? 1
  const [a, b] = skyColors(n, isDark)

  return (
    <AnimatePresence>
      {level && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-7 bg-black/50 backdrop-blur-md"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative w-full max-w-sm bg-card dark:bg-d-card rounded-3xl p-7 border border-rule dark:border-d-rule overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${a}40, transparent 70%)` }}
            />

            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink-mute dark:text-d-ink-mute">
              Level up
            </p>

            <div className="flex items-center gap-4 mt-3 mb-4">
              <SkyChip n={n} size={72} radius={22} />
              <div>
                <p
                  className="text-[26px] font-semibold leading-[1.05] text-ink dark:text-d-ink"
                  style={{ letterSpacing: '-0.025em' }}
                >
                  {level.name}
                </p>
                <p className="font-mono text-[11px] text-ink-mute dark:text-d-ink-mute mt-1">
                  Level {level.level} · {level.minXP} xp
                </p>
              </div>
            </div>

            <p className="text-[14.5px] leading-[1.5] text-ink2 dark:text-d-ink2 mb-5">
              A new horizon. You've earned your way to {level.name}. Keep watching the skies.
            </p>

            <button
              onClick={onDismiss}
              className="w-full py-3 rounded-2xl text-white text-[14px] font-semibold transition-opacity hover:opacity-95"
              style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
            >
              Keep going →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
