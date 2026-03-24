import { NavLink } from 'react-router-dom'

function IconLog({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  )
}

function IconHistory({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

function IconStats({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  )
}

const TABS = [
  { to: '/log',     label: 'Log',     Icon: IconLog },
  { to: '/history', label: 'History', Icon: IconHistory },
  { to: '/chart',   label: 'Stats',   Icon: IconStats },
]

export function BottomNav() {
  return (
    <div className="safe-bottom fixed bottom-0 left-0 right-0 z-10 flex justify-center px-6 pb-4">
      <nav className="relative w-full max-w-xs bg-white/95 dark:bg-[#1e1535]/95 backdrop-blur-xl rounded-3xl border border-black/5 dark:border-white/10 flex shadow-2xl shadow-black/15 dark:shadow-violet-950/60 overflow-visible">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3.5 text-[11px] font-semibold tracking-wide transition-all relative ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  <Icon active={isActive} />
                </span>
                <span>{label}</span>
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-500" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
