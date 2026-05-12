import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkyChip } from '../SkyChip'
import { skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'

const STORAGE_KEY = 'tether_onboarded'

const STEPS = [
  {
    n: 7,
    eyebrow: 'Welcome',
    title: 'Track how you feel,\nday by day.',
    body: 'Tether turns each day into a sky — a quick reading of your inner weather.',
  },
  {
    n: 4,
    eyebrow: 'How it works',
    title: 'Pick a sky.\nWrite a note.',
    body: 'Storm to aurora — pick the atmosphere that fits, add a sentence about your day.',
  },
  {
    n: 9,
    eyebrow: 'Patterns',
    title: 'Your forecast,\nover time.',
    body: 'After a week, your trends emerge — which days lift you, which tags weigh you down.',
  },
  {
    n: 10,
    eyebrow: 'Begin',
    title: 'Long horizons\nfavor the consistent.',
    body: "Build a streak. Earn XP. Reach Transcendent. Or just check in — that's enough.",
  },
]

export function OnboardingModal() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
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
  const [a, b] = skyColors(current.n, isDark)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-md"
        >
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="w-full max-w-sm bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-7"
          >
            <div className="flex justify-center mb-6">
              <SkyChip n={current.n} size={96} radius={24} />
            </div>

            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-mute dark:text-d-ink-mute">
              {current.eyebrow}
            </p>
            <h2
              className="text-[28px] font-semibold leading-[1.05] text-ink dark:text-d-ink mt-1.5 whitespace-pre-line"
              style={{ letterSpacing: '-0.03em' }}
            >
              {current.title}
            </h2>
            <p className="text-[14.5px] leading-[1.5] text-ink2 dark:text-d-ink2 mt-3">
              {current.body}
            </p>

            <div className="flex items-center gap-1.5 mt-6">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? 24 : 6,
                    background: i <= step
                      ? (isDark ? '#f0f1f6' : '#1f2433')
                      : (isDark ? '#3e424e' : '#b8bcc7'),
                  }}
                />
              ))}
              <span className="ml-auto font-mono text-[10px] text-ink-mute dark:text-d-ink-mute">
                {step + 1}/{STEPS.length}
              </span>
            </div>

            <div className="flex gap-2 mt-5">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="flex-1 py-3 rounded-2xl border border-rule dark:border-d-rule text-[13px] font-medium text-ink2 dark:text-d-ink2 hover:bg-bg2 dark:hover:bg-d-bg2 transition-colors"
                >
                  Back
                </button>
              )}
              {step === 0 && (
                <button
                  onClick={finish}
                  className="px-4 py-3 text-[13px] text-ink-mute dark:text-d-ink-mute hover:text-ink dark:hover:text-d-ink transition-colors"
                >
                  Skip
                </button>
              )}
              <button
                onClick={isLast ? finish : () => setStep(s => s + 1)}
                className="flex-1 py-3 rounded-2xl text-white text-[14px] font-semibold transition-opacity hover:opacity-95"
                style={{
                  background: `linear-gradient(135deg, ${a}, ${b})`,
                  boxShadow: `0 10px 24px ${a}40`,
                }}
              >
                {isLast ? 'Begin →' : 'Continue →'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
