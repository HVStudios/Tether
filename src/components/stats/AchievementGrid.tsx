import { motion } from 'framer-motion'
import { useAchievements } from '../../hooks/useAchievements'
import type { MoodEntry } from '../../lib/types'

interface Props {
  entries: MoodEntry[]
}

export function AchievementGrid({ entries }: Props) {
  const achievements = useAchievements(entries)
  const unlocked = achievements.filter(a => a.unlocked).length
  const totalXP = achievements.filter(a => a.unlocked).reduce((s, a) => s + a.xpReward, 0)

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Achievements</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {unlocked} / {achievements.length} unlocked
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400">+{totalXP} XP</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500">from achievements</p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex flex-wrap gap-1 mb-4">
        {achievements.map((a, i) => (
          <div
            key={i}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              a.unlocked ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`rounded-xl p-3 flex items-start gap-2.5 border transition-all ${
              a.unlocked
                ? 'bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-50'
            }`}
          >
            <span className={`text-2xl leading-none mt-0.5 shrink-0 ${a.unlocked ? '' : 'grayscale'}`}>
              {a.icon}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-semibold leading-tight ${
                a.unlocked
                  ? 'text-violet-800 dark:text-violet-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {a.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                {a.description}
              </p>
              <p className={`text-[10px] font-bold mt-1 ${
                a.unlocked ? 'text-violet-500 dark:text-violet-400' : 'text-gray-400 dark:text-gray-600'
              }`}>
                +{a.xpReward} XP
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
