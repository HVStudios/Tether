import { getMood } from '../../utils/moodEmoji'

interface Props {
  value: number | null
  onChange: (score: number) => void
}

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

export function MoodPicker({ value, onChange }: Props) {
  const selected = value !== null ? getMood(value) : null

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Large selected display */}
      <div className="h-24 flex flex-col items-center justify-center gap-1.5">
        {selected ? (
          <>
            <span className="text-6xl leading-none drop-shadow-sm animate-[scale-in_0.15s_ease-out]">{selected.emoji}</span>
            <span
              className="text-sm font-bold px-3 py-0.5 rounded-full text-white"
              style={{ backgroundColor: selected.color }}
            >
              {selected.label}
            </span>
          </>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-sm text-center leading-relaxed">
            How are you feeling?<br />
            <span className="text-xs opacity-70">Tap an emoji below</span>
          </p>
        )}
      </div>

      {/* 5×2 emoji grid */}
      <div className="grid grid-cols-5 gap-2 w-full">
        {SCORES.map(score => {
          const { emoji, label, color } = getMood(score)
          const isSelected = value === score
          return (
            <button
              key={score}
              type="button"
              onClick={() => onChange(score)}
              title={`${score} – ${label}`}
              className={`flex items-center justify-center rounded-2xl p-3 text-3xl transition-all duration-150 ${
                isSelected ? 'scale-110' : 'opacity-55 hover:opacity-90 hover:scale-105'
              }`}
              style={isSelected
                ? { backgroundColor: `${color}25`, boxShadow: `0 4px 20px ${color}50` }
                : undefined
              }
            >
              <span role="img" aria-label={label}>{emoji}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
