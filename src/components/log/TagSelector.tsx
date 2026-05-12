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
      <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-mute dark:text-d-ink-mute">
        Tags
      </p>

      {allDisplayed.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allDisplayed.map(tag => {
            const on = selected.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggle(tag)}
                className={`rounded-full px-2.5 py-1 text-[12px] font-medium border transition-colors ${
                  on
                    ? 'bg-ink text-bg border-ink dark:bg-d-ink dark:text-d-bg dark:border-d-ink'
                    : 'bg-transparent text-ink2 dark:text-d-ink2 border-rule dark:border-d-rule hover:border-ink/40 dark:hover:border-d-ink/30'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex gap-2 mt-1">
        <input
          type="text"
          placeholder="Add a tag…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-xl border border-rule dark:border-d-rule bg-bg2 dark:bg-d-bg2 text-ink dark:text-d-ink placeholder:text-ink-dim dark:placeholder:text-d-ink-dim px-3 py-1.5 text-[13px] outline-none focus:border-ink/40 dark:focus:border-d-ink/30"
        />
        <button
          type="button"
          onClick={addNew}
          disabled={!input.trim()}
          className="rounded-xl bg-ink text-bg dark:bg-d-ink dark:text-d-bg px-3 py-1.5 text-[13px] font-medium disabled:opacity-30 transition-opacity"
        >
          Add
        </button>
      </div>
    </div>
  )
}
