import { motion, AnimatePresence } from 'framer-motion'
import type { Level } from '../../hooks/useXP'

const PARTICLES = ['⭐', '✨', '🌟', '💫', '🎉', '🎊']

const LEVEL_COLORS: Record<number, string> = {
  1:  'from-gray-400 to-gray-500',
  2:  'from-green-400 to-emerald-500',
  3:  'from-teal-400 to-cyan-500',
  4:  'from-blue-400 to-indigo-500',
  5:  'from-violet-400 to-purple-500',
  6:  'from-purple-500 to-fuchsia-500',
  7:  'from-fuchsia-500 to-pink-500',
  8:  'from-pink-500 to-rose-500',
  9:  'from-orange-400 to-amber-500',
  10: 'from-yellow-400 to-amber-400',
}

interface Props {
  level: Level | null
  onDismiss: () => void
}

export function LevelUpModal({ level, onDismiss }: Props) {
  const gradient = level ? LEVEL_COLORS[level.level] ?? LEVEL_COLORS[1] : ''

  return (
    <AnimatePresence>
      {level && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          onClick={onDismiss}
        >
          {/* Floating particles */}
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="fixed text-2xl pointer-events-none select-none"
              initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: -120 - Math.random() * 80,
                x: (Math.random() - 0.5) * 200,
                scale: [0, 1.2, 0.8],
                rotate: (Math.random() - 0.5) * 60,
              }}
              transition={{ duration: 1.4, delay: i * 0.08, ease: 'easeOut' }}
            >
              {p}
            </motion.span>
          ))}

          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 280 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-xs w-full text-center shadow-2xl border border-white dark:border-gray-800"
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 300, delay: 0.1 }}
              className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-5 shadow-xl`}
            >
              <span className="text-white font-black text-4xl">{level.level}</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400 mb-1">
                Level up!
              </p>
              <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 mb-1">
                {level.name}
              </h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                You've reached level {level.level}. Keep going!
              </p>

              <button
                onClick={onDismiss}
                className={`w-full py-3 rounded-2xl bg-gradient-to-r ${gradient} text-white font-bold text-sm shadow-md transition-opacity hover:opacity-90`}
              >
                Keep it up 🚀
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
