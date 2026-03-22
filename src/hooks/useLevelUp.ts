import { useEffect, useRef, useState } from 'react'
import { useXP, type Level } from './useXP'
import type { MoodEntry } from '../lib/types'

const STORAGE_KEY = 'tether_last_level'

export function useLevelUp(entries: MoodEntry[]) {
  const { currentLevel } = useXP(entries)
  const initialised = useRef(false)
  const [celebrateLevel, setCelebrateLevel] = useState<Level | null>(null)

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? '1', 10)

    if (!initialised.current) {
      // On first render, just record the current level silently
      initialised.current = true
      if (currentLevel.level > stored) {
        localStorage.setItem(STORAGE_KEY, String(currentLevel.level))
      }
      return
    }

    if (currentLevel.level > stored) {
      localStorage.setItem(STORAGE_KEY, String(currentLevel.level))
      setCelebrateLevel(currentLevel)
    }
  }, [currentLevel.level])

  function dismiss() {
    setCelebrateLevel(null)
  }

  return { celebrateLevel, dismiss }
}
