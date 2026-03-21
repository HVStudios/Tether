interface Props {
  value: string
  onChange: (value: string) => void
}

const MAX = 500

export function NoteInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-medium text-gray-700" htmlFor="mood-note">
          Note <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <span className={`text-xs ${value.length > MAX * 0.9 ? 'text-red-500' : 'text-gray-400'}`}>
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        id="mood-note"
        rows={3}
        maxLength={MAX}
        placeholder="How are you feeling? What's on your mind?"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  )
}
