interface Props {
  value: string
  onChange: (value: string) => void
}

const MAX = 500

export function NoteInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor="mood-note" className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-mute dark:text-d-ink-mute">
          Note
        </label>
        <span
          className={`font-mono text-[10px] ${
            value.length > MAX * 0.9 ? 'text-red-500' : 'text-ink-dim dark:text-d-ink-dim'
          }`}
        >
          {value.length}/{MAX}
        </span>
      </div>
      <textarea
        id="mood-note"
        rows={3}
        maxLength={MAX}
        placeholder="What's the weather, inside?"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent border-0 outline-none resize-none text-[15px] leading-[1.5] text-ink dark:text-d-ink placeholder:text-ink-dim dark:placeholder:text-d-ink-dim"
      />
    </div>
  )
}
