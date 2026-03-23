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
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: i * 0.05 }}
      className={`rounded-xl p-3.5 border transition-all ${
        m.completed
          ? 'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800'
          : 'bg-white dark:bg-gray-800/60 border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-xl leading-none mt-0.5 shrink-0 ${m.completed ? '' : 'opacity-70'}`}>
          {m.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`text-xs font-semibold leading-tight ${
              m.completed
                ? 'text-violet-800 dark:text-violet-300'
                : 'text-gray-800 dark:text-gray-200'
            }`}>
              {m.title}
            </p>
            <div className="flex items-center gap-1.5 shrink-0">
              {m.completed && (
                <span className="text-[10px] font-bold text-violet-500 dark:text-violet-400">
                  ✓ Done
                </span>
              )}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                m.completed
                  ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                +{m.xpReward} XP
              </span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 leading-tight">
            {m.description}
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  m.completed
                    ? 'bg-gradient-to-r from-violet-500 to-purple-500'
                    : 'bg-gradient-to-r from-violet-400 to-purple-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              />
            </div>
            {m.goal > 1 && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0 w-8 text-right">
                {m.current}/{m.goal}
              </span>
            )}
          </div>
        </div>
      </div>
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
    return <span className="text-[10px] text-gray-400 dark:text-gray-500">Resets in {h}h {m}m</span>
  }
  const days = Math.floor(resetMs / 86400000)
  return <span className="text-[10px] text-gray-400 dark:text-gray-500">Resets in {days}d {h % 24}h</span>
}

export function MissionsCard({ entries }: Props) {
  const { completedKeys, addEvent } = useXPEvents()
  const { dailyMissions, weeklyMissions } = useMissions(entries, completedKeys, addEvent)
  const allMissions = [...dailyMissions, ...weeklyMissions]
  const completedCount = allMissions.filter(m => m.completed).length

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-white dark:border-gray-800 shadow-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Missions</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {completedCount}/{allMissions.length} completed today
          </p>
        </div>
        <div className="flex gap-1">
          {allMissions.map((m, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                m.completed ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Daily */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Daily
          </p>
          <ResetCountdown type="daily" />
        </div>
        <div className="flex flex-col gap-2">
          {dailyMissions.map((m, i) => (
            <MissionRow key={`${m.id}_${m.periodKey}`} m={m} i={i} />
          ))}
        </div>
      </div>

      {/* Weekly */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Weekly
          </p>
          <ResetCountdown type="weekly" />
        </div>
        <div className="flex flex-col gap-2">
          {weeklyMissions.map((m, i) => (
            <MissionRow key={`${m.id}_${m.periodKey}`} m={m} i={i + 3} />
          ))}
        </div>
      </div>
    </div>
  )
}
