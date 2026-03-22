import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'tether_onboarded'

const STEPS = [
  {
    emoji: '🌿',
    title: 'Welcome to Tether',
    body: 'Your personal mood journal. Check in daily to build self-awareness and spot patterns in how you feel.',
  },
  {
    emoji: '😊',
    title: 'Log your mood',
    body: 'Pick a score from 1–10, write a note about your day, and add tags like #work or #exercise to organise entries.',
  },
  {
    emoji: '🏆',
    title: 'Earn XP & level up',
    body: 'Every entry earns XP. Write notes, add tags, and keep your streak going to level up from Newcomer to Transcendent.',
  },
  {
    emoji: '📊',
    title: 'Discover your trends',
    body: 'The Stats tab shows your mood over time, which days you feel best, which tags lift your mood, and your achievements.',
  },
]

export function OnboardingModal() {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== '1'
  )

  function finish() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl border border-white dark:border-gray-800 shadow-2xl p-8 text-center"
          >
            <div className="text-6xl mb-5">{current.emoji}</div>

            <h2 className="text-xl font-black text-gray-900 dark:text-gray-100 mb-2">
              {current.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              {current.body}
            </p>

            {/* Step dots */}
            <div className="flex justify-center gap-1.5 mb-6">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === step
                      ? 'w-5 h-1.5 bg-violet-600'
                      : 'w-1.5 h-1.5 bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Back
                </button>
              )}
              {!isLast && step === 0 && (
                <button
                  onClick={finish}
                  className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-3"
                >
                  Skip
                </button>
              )}
              <button
                onClick={isLast ? finish : () => setStep(s => s + 1)}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                {isLast ? "Let's go 🚀" : 'Next'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
