import { getMood } from '../../utils/moodEmoji'

interface Props {
  value: number | null
  onChange: (score: number) => void
}

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export function MoodPicker({ value, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 flex-wrap justify-center">
        {SCORES.map(score => {
          const { emoji, label } = getMood(score)
          const selected = value === score
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              title={`${score} – ${label}`}
              className={`flex flex-col items-center gap-0.5 rounded-xl p-2 text-2xl transition-all
                ${selected
                  ? 'ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-gray-900 bg-violet-50 dark:bg-violet-950 scale-110'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105'
                }`}
            >
              <span role="img" aria-label={label}>{emoji}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">{score}</span>
            </button>
          )
        })}
      </div>

      {value !== null && (
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {getMood(value).emoji} {getMood(value).label}
        </p>
      )}
    </div>
  )
}
