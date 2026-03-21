import { useState, type KeyboardEvent } from 'react'

interface Props {
  selected: string[]
  suggestions: string[]
  onChange: (tags: string[]) => void
}

export function TagSelector({ selected, suggestions, onChange }: Props) {
  const [input, setInput] = useState('')

  function toggle(tag: string) {
    if (selected.includes(tag)) {
      onChange(selected.filter(t => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  function addNew() {
    const tag = input.trim().toLowerCase()
    if (!tag || selected.includes(tag)) {
      setInput('')
      return
    }
    onChange([...selected, tag])
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addNew()
    }
  }

  const newTags = selected.filter(t => !suggestions.includes(t))
  const allDisplayed = [...new Set([...suggestions, ...newTags])]

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tags <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
      </label>

      {allDisplayed.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allDisplayed.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggle(tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selected.includes(tag)
                  ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 ring-1 ring-violet-300 dark:ring-violet-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {selected.includes(tag) && '✓ '}
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a tag…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          type="button"
          onClick={addNew}
          disabled={!input.trim()}
          className="rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-1.5 text-sm font-medium disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  )
}
