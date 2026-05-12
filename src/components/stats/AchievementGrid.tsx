import { motion } from 'framer-motion'
import { useAchievements } from '../../hooks/useAchievements'
import { skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

// Spread the 27 achievements across the 10-sky scale, varying by index
function skyForIndex(i: number): number {
  const palette = [1, 2, 3, 4, 6, 7, 8, 9, 10]
  return palette[i % palette.length]
}

export function AchievementGrid({ entries }: Props) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const achievements = useAchievements(entries)
  const unlocked = achievements.filter(a => a.unlocked).length
  const totalXP = achievements.filter(a => a.unlocked).reduce((s, a) => s + a.xpReward, 0)

  return (
    <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
            Achievements
          </p>
          <p className="text-[14px] font-medium text-ink dark:text-d-ink mt-0.5">
            {unlocked} of {achievements.length} unlocked
          </p>
        </div>
        <p className="font-mono text-[11px] font-semibold text-accent dark:text-d-accent">
          +{totalXP} xp
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {achievements.map((a, i) => {
          const n = skyForIndex(i)
          const [c1, c2] = skyColors(n, isDark)
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="flex flex-col items-center text-center"
              style={{ opacity: a.unlocked ? 1 : 0.4 }}
              title={a.description}
            >
              <div
                className="w-full aspect-square rounded-2xl flex items-center justify-center mb-1.5"
                style={{
                  background: a.unlocked
                    ? `linear-gradient(135deg, ${c1}, ${c2})`
                    : isDark
                      ? '#1c1e27'
                      : '#ebe6dd',
                  filter: a.unlocked ? 'none' : 'grayscale(1)',
                }}
              >
                {a.unlocked && (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z" />
                  </svg>
                )}
              </div>
              <p className="text-[10px] font-medium text-ink dark:text-d-ink leading-tight">{a.name}</p>
              <p className="font-mono text-[9px] text-ink-mute dark:text-d-ink-mute mt-0.5">
                {a.unlocked ? `+${a.xpReward}` : `${a.xpReward} xp`}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
