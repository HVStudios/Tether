import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoodPicker } from '../components/log/MoodPicker'
import { NoteInput } from '../components/log/NoteInput'
import { TagSelector } from '../components/log/TagSelector'
import { MoodTriggers } from '../components/log/MoodTriggers'
import { DateTimePicker } from '../components/log/DateTimePicker'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useStreak } from '../hooks/useStreak'

const PRESET_TAGS = [
  'work', 'social', 'exercise', 'sleep', 'family',
  'food', 'outdoors', 'creative', 'stress', 'grateful',
]

export function LogPage() {
  const { insert, allTags, entries } = useMoodEntries()
  const suggestions = [...new Set([...PRESET_TAGS, ...allTags])]
  const streak = useStreak(entries)

  const [score, setScore] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [loggedAt, setLoggedAt] = useState(new Date().toISOString())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  function handleTrigger(prompt: string) {
    setNote(prev => prev ? `${prev}\n${prompt} ` : `${prompt} `)
  }

  async function handleSave() {
    if (score === null) return
    setSaving(true)
    setError(null)
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
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">How are you feeling?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Tap an emoji to pick your mood</p>
        </div>
        {streak > 0 && (
          <div className="flex flex-col items-center bg-gradient-to-b from-orange-400 to-red-500 rounded-2xl px-3 py-2 shrink-0 shadow-md shadow-orange-400/30">
            <span className="text-xl leading-none">🔥</span>
            <span className="text-sm font-black text-white leading-tight">{streak}</span>
            <span className="text-[10px] text-orange-100 font-medium">day{streak !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg shadow-violet-500/5 p-5 flex flex-col gap-5">
        <MoodPicker value={score} onChange={setScore} />

        <div className="border-t border-gray-100 dark:border-gray-800" />

        <MoodTriggers onSelect={handleTrigger} />
        <NoteInput value={note} onChange={setNote} />
        <TagSelector selected={tags} suggestions={suggestions} onChange={setTags} />

        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-violet-500 dark:hover:text-violet-400 self-start transition-colors"
        >
          {showAdvanced ? '▲ Hide options' : '▼ Set custom time'}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <DateTimePicker value={loggedAt} onChange={setLoggedAt} />
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 text-center font-medium"
            >
              ✓ Entry saved!
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleSave}
          disabled={score === null || saving}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 transition-all"
        >
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </div>
  )
}
