import { useState } from 'react'
import { motion } from 'framer-motion'
import type { MoodEntry } from '../../lib/types'
import { sky } from '../../lib/skies'
import { SkyChip } from '../SkyChip'
import { formatEntryDate } from '../../utils/formatDate'

interface Props {
  entry: MoodEntry
  onDelete: (id: string) => void
  onEdit: (entry: MoodEntry) => void
}

export function EntryCard({ entry, onDelete, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const s = sky(entry.score)
  const longNote = entry.note && entry.note.length > 120

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-4 flex gap-3.5 shadow-[0_1px_0_rgba(31,36,51,0.04)] dark:shadow-none"
    >
      <SkyChip n={entry.score} size={60} radius={18} />

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[22px] font-semibold text-ink dark:text-d-ink leading-none" style={{ letterSpacing: '-0.02em' }}>
                {entry.score}
              </span>
              <span className="text-[13px] text-ink2 dark:text-d-ink2 capitalize">{s.label}</span>
            </div>
            <p className="font-mono text-[10px] text-ink-mute dark:text-d-ink-mute mt-0.5">
              {formatEntryDate(entry.logged_at)}
            </p>
          </div>

          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onEdit(entry)}
              className="rounded-md px-2 py-0.5 text-[11px] text-ink-mute dark:text-d-ink-mute hover:text-ink dark:hover:text-d-ink transition-colors"
            >
              Edit
            </button>
            {confirmDelete ? (
              <>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="rounded-md px-2 py-0.5 text-[11px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-md px-2 py-0.5 text-[11px] text-ink-mute dark:text-d-ink-mute hover:text-ink dark:hover:text-d-ink transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-md px-1.5 py-0.5 text-[11px] text-ink-dim dark:text-d-ink-dim hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Delete"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {entry.note && (
          <p
            className={`mt-1.5 text-[13.5px] leading-[1.5] text-ink2 dark:text-d-ink2 ${
              !expanded && longNote ? 'line-clamp-3' : ''
            }`}
          >
            {entry.note}
          </p>
        )}

        {longNote && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-1 text-[11px] font-medium text-accent dark:text-d-accent hover:underline"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {entry.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full px-2 py-0.5 text-[11px] font-medium bg-bg2 dark:bg-d-bg2 text-ink2 dark:text-d-ink2"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
