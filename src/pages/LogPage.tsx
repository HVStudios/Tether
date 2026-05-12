import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoodPicker } from '../components/log/MoodPicker'
import { NoteInput } from '../components/log/NoteInput'
import { TagSelector } from '../components/log/TagSelector'
import { MoodTriggers } from '../components/log/MoodTriggers'
import { DateTimePicker } from '../components/log/DateTimePicker'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useStreak } from '../hooks/useStreak'
import { useLevelUp } from '../hooks/useLevelUp'
import { LevelUpModal } from '../components/stats/LevelUpModal'
import { Mark, Wordmark } from '../components/Mark'
import { useTheme } from '../context/ThemeContext'
import { skyColors, sky } from '../lib/skies'

const PRESET_TAGS = [
  'work', 'social', 'exercise', 'sleep', 'family',
  'food', 'outdoors', 'creative', 'stress', 'grateful',
]

export function LogPage() {
  const { insert, allTags, entries } = useMoodEntries()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const suggestions = [...new Set([...PRESET_TAGS, ...allTags])]
  const streak = useStreak(entries)
  const { celebrateLevel, dismiss } = useLevelUp(entries)

  const [score, setScore] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loggedAt, setLoggedAt] = useState(new Date().toISOString())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedXP, setSavedXP] = useState<number | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  function handleTrigger(prompt: string) {
    setNote(prev => (prev ? `${prompt} ${prev}` : `${prompt} `))
  }

  async function handleSave() {
    if (score === null) return
    setSaving(true)
    setError(null)
    const xpGain = 10 + (note.length > 10 ? 5 : 0) + Math.min(tags.length, 5) * 2
    const { error } = await insert({ score, note: note.trim() || null, tags, logged_at: loggedAt })
    setSaving(false)
    if (error) {
      setError(error)
    } else {
      setScore(null)
      setNote('')
      setTags([])
      setLoggedAt(new Date().toISOString())
      setShowAdvanced(false)
      setSavedXP(xpGain)
      setTimeout(() => setSavedXP(null), 2400)
    }
  }

  const hour = new Date().getHours()
  const greet = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'

  const atmoColors = score !== null ? skyColors(score, isDark) : null
  const saveGrad = score !== null
    ? `linear-gradient(135deg, ${skyColors(score, isDark)[0]}, ${skyColors(score, isDark)[1]})`
    : undefined
  const xpPreview = score !== null
    ? 10 + (note.length > 10 ? 5 : 0) + Math.min(tags.length, 5) * 2
    : 0

  return (
    <div className="relative">
      {/* Atmospheric gradient banner — fades to bg */}
      {atmoColors && (
        <div
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[45%] pointer-events-none transition-opacity duration-300"
          style={{
            background: `linear-gradient(180deg, ${atmoColors[0]} 0%, ${atmoColors[1]} 60%, transparent 100%)`,
            opacity: isDark ? 0.4 : 0.55,
          }}
        />
      )}

      <div className="relative z-10 px-5 md:px-8 pt-6 pb-6 max-w-lg md:max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 md:hidden">
            <Mark size={28} n={score ?? 9} />
            <Wordmark size={18} />
          </div>
          <div className="hidden md:block" />

          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-card dark:bg-d-card rounded-full px-2.5 py-1 border border-rule dark:border-d-rule">
              <span
                className="block w-[18px] h-[18px] rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${sky(9).g[0]}, ${sky(10).g[0]})`,
                }}
              />
              <span className="font-mono text-[12px] font-semibold text-ink dark:text-d-ink">{streak}</span>
              <span className="text-[11px] text-ink-mute dark:text-d-ink-mute">day streak</span>
            </div>
          )}
        </div>

        {/* Greeting */}
        <p className="font-mono text-[11px] tracking-[0.06em] uppercase text-ink-mute dark:text-d-ink-mute">
          Good {greet}
        </p>
        <h1
          className="text-[32px] md:text-[40px] font-semibold leading-[1.05] text-ink dark:text-d-ink mt-2 mb-6"
          style={{ letterSpacing: '-0.025em' }}
        >
          What's the weather, inside?
        </h1>

        {/* Form grid */}
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:items-start md:gap-4">
          {/* Mood picker card */}
          <div className="bg-card dark:bg-d-card rounded-3xl p-5 border border-rule dark:border-d-rule shadow-[0_6px_24px_rgba(31,36,51,0.06)] dark:shadow-none">
            <MoodPicker value={score} onChange={setScore} />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3">
            <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule shadow-[0_6px_24px_rgba(31,36,51,0.06)] dark:shadow-none p-4 flex flex-col gap-3">
              <NoteInput value={note} onChange={setNote} />
              <MoodTriggers onSelect={handleTrigger} />
            </div>

            <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule shadow-[0_6px_24px_rgba(31,36,51,0.06)] dark:shadow-none p-4">
              <TagSelector selected={tags} suggestions={suggestions} onChange={setTags} />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(v => !v)}
              className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute hover:text-ink dark:hover:text-d-ink self-start transition-colors"
            >
              {showAdvanced ? '— Hide options' : '+ Custom time'}
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-4">
                    <DateTimePicker value={loggedAt} onChange={setLoggedAt} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="rounded-2xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={score === null || saving}
              className="w-full rounded-2xl py-4 text-[16px] font-semibold transition-all flex items-center justify-center gap-2.5 disabled:cursor-not-allowed"
              style={
                score === null
                  ? { background: 'var(--color-bg2)', color: 'var(--color-ink-mute)' }
                  : {
                      background: saveGrad,
                      color: '#fff',
                      textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                      boxShadow: atmoColors ? `0 10px 24px ${atmoColors[0]}40` : undefined,
                    }
              }
            >
              <span>{saving ? 'Saving…' : score === null ? 'Pick a sky to save' : 'Save reading'}</span>
              {score !== null && !saving && (
                <span
                  className="font-mono text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.22)' }}
                >
                  +{xpPreview} xp
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Save toast */}
      <AnimatePresence>
        {savedXP !== null && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-bg dark:bg-d-ink dark:text-d-bg text-[13px] font-medium shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Saved · +{savedXP} xp
          </motion.div>
        )}
      </AnimatePresence>

      <LevelUpModal level={celebrateLevel} onDismiss={dismiss} />
    </div>
  )
}
