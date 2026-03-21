import { useState } from 'react'
import type { MoodEntry } from '../../lib/types'
import { getMood } from '../../utils/moodEmoji'
import { formatEntryDate } from '../../utils/formatDate'

interface Props {
  entry: MoodEntry
}

export function EntryCard({ entry }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { emoji, label } = getMood(entry.score)
  const longNote = entry.note && entry.note.length > 120

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4">
      <div className="flex flex-col items-center gap-1 shrink-0">
        <span className="text-3xl" role="img" aria-label={label}>{emoji}</span>
        <span className="text-xs font-semibold text-gray-500">{entry.score}/10</span>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <p className="text-xs text-gray-400">{formatEntryDate(entry.logged_at)}</p>

        {entry.note && (
          <p className={`text-sm text-gray-700 leading-relaxed ${!expanded && longNote ? 'line-clamp-3' : ''}`}>
            {entry.note}
          </p>
        )}

        {longNote && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="text-xs text-violet-600 hover:text-violet-700 self-start font-medium"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {entry.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
