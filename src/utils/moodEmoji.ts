const MOOD_MAP: Record<number, { emoji: string; label: string; color: string }> = {
  1:  { emoji: '😭', label: 'Terrible', color: '#dc2626' },
  2:  { emoji: '😢', label: 'Very sad',  color: '#ea580c' },
  3:  { emoji: '😞', label: 'Sad',       color: '#d97706' },
  4:  { emoji: '😕', label: 'Not great', color: '#ca8a04' },
  5:  { emoji: '😐', label: 'Neutral',   color: '#65a30d' },
  6:  { emoji: '🙂', label: 'Okay',      color: '#16a34a' },
  7:  { emoji: '😊', label: 'Good',      color: '#0d9488' },
  8:  { emoji: '😁', label: 'Great',     color: '#0284c7' },
  9:  { emoji: '🤩', label: 'Awesome',   color: '#7c3aed' },
  10: { emoji: '🥳', label: 'Amazing',   color: '#db2777' },
}

export function getMood(score: number) {
  return MOOD_MAP[Math.round(score)] ?? MOOD_MAP[5]
}
