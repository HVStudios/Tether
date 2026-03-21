import { getMood } from '../../utils/moodEmoji'

interface Props {
  value: number | null
  onChange: (score: number) => void
}

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export function MoodPicker({ value, onChange }: Props) {
  const selected = value !== null ? getMood(value) : null

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-1.5 flex-wrap justify-center">
        {SCORES.map(score => {
          const { emoji, label, color } = getMood(score)
          const isSelected = value === score
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              title={`${score} – ${label}`}
              style={isSelected ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${color}` } : undefined}
              className={`flex flex-col items-center gap-0.5 rounded-xl p-2 text-2xl transition-all duration-150
                ${isSelected
                  ? 'scale-115 bg-white dark:bg-gray-800'
                  : 'hover:bg-white/70 dark:hover:bg-gray-800 hover:scale-110 opacity-70 hover:opacity-100'
                }`}
            >
              <span role="img" aria-label={label}>{emoji}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{score}</span>
            </button>
          )
        })}
      </div>

      {selected !== null && value !== null && (
        <div
          className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white shadow-md transition-all"
          style={{ backgroundColor: selected.color }}
        >
          <span>{selected.emoji}</span>
          <span>{selected.label}</span>
          <span className="opacity-70 text-xs font-normal">({value}/10)</span>
        </div>
      )}
    </div>
  )
}
