interface Props {
  onSelect: (prompt: string) => void
}

const TRIGGERS = [
  { emoji: '🙏', text: 'Grateful for…' },
  { emoji: '⚡', text: 'Energy level…' },
  { emoji: '😤', text: 'Frustrated by…' },
  { emoji: '🏆', text: 'Proud of…' },
  { emoji: '😰', text: 'Anxious about…' },
  { emoji: '🤝', text: 'Connected with…' },
  { emoji: '🎯', text: 'Focused on…' },
  { emoji: '💤', text: 'Sleep was…' },
]

export function MoodTriggers({ onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wide">Prompts</p>
      <div className="flex flex-wrap gap-1.5">
        {TRIGGERS.map(t => (
          <button
            key={t.text}
            type="button"
            onClick={() => onSelect(t.text)}
            className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-violet-100 dark:hover:bg-violet-900 hover:text-violet-700 dark:hover:text-violet-300 px-3 py-1 text-xs font-medium transition-colors"
          >
            {t.emoji} {t.text}
          </button>
        ))}
      </div>
    </div>
  )
}
