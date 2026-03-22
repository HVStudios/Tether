import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MoodEntry } from '../../lib/types'
import { MoodPicker } from '../log/MoodPicker'
import { NoteInput } from '../log/NoteInput'
import { TagSelector } from '../log/TagSelector'
import { DateTimePicker } from '../log/DateTimePicker'

interface Props {
  entry: MoodEntry | null
  allTags: string[]
  onSave: (id: string, patch: Partial<MoodEntry>) => Promise<{ error: string | null }>
  onClose: () => void
}

export function EditModal({ entry, allTags, onSave, onClose }: Props) {
  const [score, setScore] = useState(entry?.score ?? 5)
  const [note, setNote] = useState(entry?.note ?? '')
  const [tags, setTags] = useState(entry?.tags ?? [])
  const [loggedAt, setLoggedAt] = useState(entry?.logged_at ?? new Date().toISOString())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (entry) {
      setScore(entry.score)
      setNote(entry.note ?? '')
      setTags(entry.tags ?? [])
      setLoggedAt(entry.logged_at)
      setError(null)
    }
  }, [entry?.id])

  async function handleSave() {
    if (!entry) return
    setSaving(true)
    const { error } = await onSave(entry.id, { score, note: note.trim() || null, tags, logged_at: loggedAt })
    setSaving(false)
    if (error) {
      setError(error)
    } else {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {entry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Edit entry</h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <MoodPicker value={score} onChange={setScore} />
            <div className="border-t border-gray-100 dark:border-gray-800" />
            <DateTimePicker value={loggedAt} onChange={setLoggedAt} />
            <NoteInput value={note} onChange={setNote} />
            <TagSelector selected={tags} suggestions={allTags} onChange={setTags} />

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
