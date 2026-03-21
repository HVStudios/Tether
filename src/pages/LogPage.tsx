import { useState } from 'react'
import { MoodPicker } from '../components/log/MoodPicker'
import { NoteInput } from '../components/log/NoteInput'
import { TagSelector } from '../components/log/TagSelector'
import { useMoodEntries } from '../hooks/useMoodEntries'

export function LogPage() {
  const { insert, allTags } = useMoodEntries()

  const [score, setScore] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (score === null) return
    setSaving(true)
    setError(null)
    const { error } = await insert({
      score,
      note: note.trim() || null,
      tags,
      logged_at: new Date().toISOString(),
    })
    setSaving(false)
    if (error) {
      setError(error)
    } else {
      setScore(null)
      setNote('')
      setTags([])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">How are you feeling?</h2>
        <p className="text-sm text-gray-500 mt-0.5">Tap an emoji to pick your mood</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-5">
        <MoodPicker value={score} onChange={setScore} />

        <div className="border-t border-gray-100" />

        <NoteInput value={note} onChange={setNote} />
        <TagSelector selected={tags} suggestions={allTags} onChange={setTags} />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {saved && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 text-center">
            ✓ Entry saved!
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={score === null || saving}
          className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </div>
    </div>
  )
}
