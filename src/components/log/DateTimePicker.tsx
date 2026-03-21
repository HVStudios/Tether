import { format } from 'date-fns'

interface Props {
  value: string // ISO string
  onChange: (iso: string) => void
}

export function DateTimePicker({ value, onChange }: Props) {
  // datetime-local input requires "yyyy-MM-ddTHH:mm" format
  const localValue = value ? format(new Date(value), "yyyy-MM-dd'T'HH:mm") : ''

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return
    onChange(new Date(e.target.value).toISOString())
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="logged-at">
        Date & time
      </label>
      <input
        id="logged-at"
        type="datetime-local"
        value={localValue}
        max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
        onChange={handleChange}
        className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  )
}
