import { format } from 'date-fns'

interface Props {
  value: string
  onChange: (iso: string) => void
}

export function DateTimePicker({ value, onChange }: Props) {
  const localValue = value ? format(new Date(value), "yyyy-MM-dd'T'HH:mm") : ''

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return
    onChange(new Date(e.target.value).toISOString())
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="logged-at" className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-mute dark:text-d-ink-mute">
        Date & time
      </label>
      <input
        id="logged-at"
        type="datetime-local"
        value={localValue}
        max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
        onChange={handleChange}
        className="rounded-xl border border-rule dark:border-d-rule bg-bg2 dark:bg-d-bg2 text-ink dark:text-d-ink px-3 py-2 text-[13px] outline-none focus:border-ink/40 dark:focus:border-d-ink/30"
      />
    </div>
  )
}
