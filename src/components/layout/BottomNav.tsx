import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/log',     label: 'Log',     icon: '✏️' },
  { to: '/history', label: 'History', icon: '📋' },
  { to: '/chart',   label: 'Stats',   icon: '📊' },
]

export function BottomNav() {
  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800 flex z-10 shadow-lg shadow-black/5">
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-all relative ${
              isActive
                ? 'text-violet-600 dark:text-violet-400'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
              )}
              <span className={`text-xl leading-none transition-transform ${isActive ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              {tab.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
