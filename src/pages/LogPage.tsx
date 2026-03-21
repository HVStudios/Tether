import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoodPicker } from '../components/log/MoodPicker'
import { NoteInput } from '../components/log/NoteInput'
import { TagSelector } from '../components/log/TagSelector'
import { MoodTriggers } from '../components/log/MoodTriggers'
import { DateTimePicker } from '../components/log/DateTimePicker'
import { useMoodEntries } from '../hooks/useMoodEntries'
import { useStreak } from '../hooks/useStreak'

export function LogPage() {
  const { insert, allTags, entries } = useMoodEntries()
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
          <div className="flex flex-col items-center bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-xl px-3 py-1.5 shrink-0">
            <span className="text-lg leading-none">🔥</span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streak}</span>
            <span className="text-[10px] text-orange-400 dark:text-orange-500">day{streak !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col gap-5">
        <MoodPicker value={score} onChange={setScore} />

        <div className="border-t border-gray-100 dark:border-gray-800" />

        <MoodTriggers onSelect={handleTrigger} />
        <NoteInput value={note} onChange={setNote} />
        <TagSelector selected={tags} suggestions={allTags} onChange={setTags} />

        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 self-start transition-colors"
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
          <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400 text-center"
            >
              ✓ Entry saved!
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={handleSave}
          disabled={score === null || saving}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </div>
  )
}
