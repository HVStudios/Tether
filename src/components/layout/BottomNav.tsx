import { NavLink } from 'react-router-dom'
import { NAV_TABS } from '../../lib/navTabs'

export function BottomNav() {
  return (
    <div className="md:hidden safe-bottom fixed bottom-0 left-0 right-0 z-10 flex justify-center px-6 pb-4">
      <nav className="relative w-full max-w-xs bg-white/95 dark:bg-[#1e1535]/95 backdrop-blur-xl rounded-3xl border border-black/5 dark:border-white/10 flex shadow-2xl shadow-black/15 dark:shadow-violet-950/60">
        {NAV_TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3.5 text-[11px] font-semibold tracking-wide transition-all relative ${
                isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'
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
