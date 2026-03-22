import { motion } from 'framer-motion'
import { useXP } from '../../hooks/useXP'
import type { MoodEntry } from '../../lib/types'

const LEVEL_COLORS = [
  'from-gray-400 to-gray-500',       // 1
  'from-green-400 to-emerald-500',   // 2
  'from-teal-400 to-cyan-500',       // 3
  'from-blue-400 to-indigo-500',     // 4
  'from-violet-400 to-purple-500',   // 5
  'from-purple-500 to-fuchsia-500',  // 6
  'from-fuchsia-500 to-pink-500',    // 7
  'from-pink-500 to-rose-500',       // 8
  'from-orange-400 to-amber-500',    // 9
  'from-yellow-400 to-amber-400',    // 10
]

interface Props {
  entries: MoodEntry[]
}

export function LevelCard({ entries }: Props) {
  const { totalXP, currentLevel, nextLevel, xpIntoLevel, xpForLevel, progress } = useXP(entries)
  const gradient = LEVEL_COLORS[currentLevel.level - 1]

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <div className="flex items-center gap-4">
        <div className={`bg-gradient-to-br ${gradient} rounded-2xl w-14 h-14 flex items-center justify-center shadow-md shrink-0`}>
          <span className="text-white font-black text-xl">{currentLevel.level}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">
              {currentLevel.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
              {totalXP} XP total
            </p>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <motion.div
              className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {nextLevel
              ? `${xpIntoLevel} / ${xpForLevel} XP → ${nextLevel.name}`
              : 'Max level reached'}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
        {[
          { label: 'Entry', value: '+10 XP' },
          { label: 'Note', value: '+5 XP' },
          { label: 'Tag', value: '+2 XP' },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-bold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
