import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/log',     label: 'Log',     icon: '✏️' },
  { to: '/history', label: 'History', icon: '📋' },
  { to: '/chart',   label: 'Chart',   icon: '📈' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-10">
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium transition-colors ${
              isActive ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'
            }`
          }
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
