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
  const { emoji, label, color } = getMood(entry.score)
  const longNote = entry.note && entry.note.length > 120

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex"
    >
      {/* Colored left accent */}
      <div className="w-1 shrink-0 rounded-l-2xl" style={{ backgroundColor: color }} />

      <div className="flex gap-3 p-4 flex-1 min-w-0">
        {/* Emoji + score badge */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shadow-sm"
            style={{ backgroundColor: `${color}18` }}
          >
            <span role="img" aria-label={label}>{emoji}</span>
          </div>
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white leading-none"
            style={{ backgroundColor: color }}
          >
            {entry.score}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">{formatEntryDate(entry.logged_at)}</p>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(entry)}
                className="rounded-md px-2 py-0.5 text-xs text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors"
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
                  className="rounded-md px-2 py-0.5 text-xs text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
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
                <span
                  key={tag}
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
