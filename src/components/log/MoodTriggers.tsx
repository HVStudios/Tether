interface Props {
  onSelect: (prompt: string) => void
}

const TRIGGERS = [
  'Grateful for…',
  'Energy level…',
  'Frustrated by…',
  'Proud of…',
  'Anxious about…',
  'Connected with…',
  'Focused on…',
  'Sleep was…',
]

export function MoodTriggers({ onSelect }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {TRIGGERS.slice(0, 6).map(p => (
        <button
          key={p}
          type="button"
          onClick={() => onSelect(p)}
          className="rounded-full border border-rule dark:border-d-rule bg-transparent text-ink2 dark:text-d-ink2 px-2.5 py-1 text-[11px] font-medium hover:border-ink/40 dark:hover:border-d-ink/30 transition-colors"
        >
          {p}
        </button>
      ))}
    </div>
  )
}
