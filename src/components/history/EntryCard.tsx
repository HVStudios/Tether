import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MoodEntry } from '../../lib/types'
import { getMood } from '../../utils/moodEmoji'
import { formatEntryDate } from '../../utils/formatDate'

interface Props {
  entry: MoodEntry
  onDelete: (id: string) => void
  onEdit: (entry: MoodEntry) => void
}

export function EntryCard({ entry, onDelete, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { emoji, label } = getMood(entry.score)
  const longNote = entry.note && entry.note.length > 120

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4"
    >
      <div className="flex flex-col items-center gap-1 shrink-0">
        <span className="text-3xl" role="img" aria-label={label}>{emoji}</span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{entry.score}/10</span>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-400 dark:text-gray-500">{formatEntryDate(entry.logged_at)}</p>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onEdit(entry)}
              className="rounded-md px-2 py-0.5 text-xs text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Edit
            </button>
            {confirmDelete ? (
              <div className="flex gap-1">
                <button
                  onClick={() => onDelete(entry.id)}
                  className="rounded-md px-2 py-0.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-md px-2 py-0.5 text-xs text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-md px-2 py-0.5 text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {entry.note && (
          <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${!expanded && longNote ? 'line-clamp-3' : ''}`}>
            {entry.note}
          </p>
        )}

        {longNote && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs text-violet-600 dark:text-violet-400 hover:text-violet-700 self-start font-medium"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {entry.tags.map(tag => (
              <span key={tag} className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-0.5 text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

