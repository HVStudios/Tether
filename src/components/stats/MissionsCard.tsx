import { motion } from 'framer-motion'
import { useMissions } from '../../hooks/useMissions'
import { useXPEvents } from '../../hooks/useXPEvents'
import type { MoodEntry } from '../../lib/types'
import type { ActiveMission } from '../../hooks/useMissions'

interface Props {
  entries: MoodEntry[]
}

function MissionRow({ m, i }: { m: ActiveMission; i: number }) {
  const pct = Math.min((m.current / m.goal) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.04 }}
      className="py-2.5 border-t border-rule dark:border-d-rule first:border-t-0"
    >
      <div className="flex items-center gap-3">
        <span
          className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ${
            m.completed
              ? 'bg-ink dark:bg-d-ink'
              : 'border-[1.5px] border-ink-dim dark:border-d-ink-dim'
          }`}
        >
          {m.completed && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-bg dark:text-d-bg"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-medium text-ink dark:text-d-ink">{m.title}</p>
          <p className="text-[12px] text-ink-mute dark:text-d-ink-mute">{m.description}</p>
        </div>
        <span
          className={`font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
            m.completed
              ? 'bg-bg2 dark:bg-d-bg2 text-ink-mute dark:text-d-ink-mute'
              : 'bg-accent-soft dark:bg-d-accent-soft text-accent dark:text-d-accent'
          }`}
        >
          {m.completed ? `✓ ${m.xpReward}` : `+${m.xpReward} xp`}
        </span>
      </div>
      {!m.completed && (
        <div className="mt-1.5 ml-[34px] h-1 bg-bg2 dark:bg-d-bg2 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent dark:bg-d-accent rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </motion.div>
  )
}

function ResetCountdown({ type }: { type: 'daily' | 'weekly' }) {
  const now = new Date()
  let resetMs: number
  if (type === 'daily') {
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    resetMs = tomorrow.getTime() - now.getTime()
  } else {
    const daysUntilMonday = (8 - now.getDay()) % 7 || 7
    const monday = new Date(now)
    monday.setDate(monday.getDate() + daysUntilMonday)
    monday.setHours(0, 0, 0, 0)
    resetMs = monday.getTime() - now.getTime()
  }

  const h = Math.floor(resetMs / 3600000)
  const m = Math.floor((resetMs % 3600000) / 60000)
  if (type === 'daily') {
    return <span className="font-mono text-[10px] text-ink-mute dark:text-d-ink-mute">Resets in {h}h {m}m</span>
  }
  const days = Math.floor(resetMs / 86400000)
  return <span className="font-mono text-[10px] text-ink-mute dark:text-d-ink-mute">Resets in {days}d {h % 24}h</span>
}

export function MissionsCard({ entries }: Props) {
  const { completedKeys, addEvent } = useXPEvents()
  const { dailyMissions, weeklyMissions } = useMissions(entries, completedKeys, addEvent)
  const allMissions = [...dailyMissions, ...weeklyMissions]
  const completedCount = allMissions.filter(m => m.completed).length

  return (
    <div className="bg-card dark:bg-d-card rounded-3xl border border-rule dark:border-d-rule p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
            Today's missions
          </p>
          <p className="text-[14px] font-medium text-ink dark:text-d-ink mt-0.5">
            {completedCount} of {allMissions.length} complete
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
            Daily
          </p>
          <ResetCountdown type="daily" />
        </div>
        <div>
          {dailyMissions.map((m, i) => (
            <MissionRow key={`${m.id}_${m.periodKey}`} m={m} i={i} />
          ))}
        </div>
      </div>

      <div className="border-t border-rule dark:border-d-rule pt-3">
        <div className="flex items-center justify-between mb-1">
          <p className="font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute">
            Weekly
          </p>
          <ResetCountdown type="weekly" />
        </div>
        <div>
          {weeklyMissions.map((m, i) => (
            <MissionRow key={`${m.id}_${m.periodKey}`} m={m} i={i + 3} />
          ))}
        </div>
      </div>
    </div>
  )
}
