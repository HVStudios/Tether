import { NavLink } from 'react-router-dom'
import { NAV_TABS } from '../../lib/navTabs'
import { useTheme } from '../../context/ThemeContext'

export function BottomNav() {
  const { theme, toggle } = useTheme()

  return (
    <div className="md:hidden safe-bottom fixed bottom-0 left-0 right-0 z-30 flex justify-center px-6 pb-4 pointer-events-none">
      <nav
        className="pointer-events-auto flex items-center gap-1 rounded-full p-1.5 border bg-card/85 dark:bg-d-bg2/85 backdrop-blur-xl border-rule dark:border-d-rule shadow-[0_8px_30px_rgba(31,36,51,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      >
        {NAV_TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-ink text-bg dark:bg-d-ink dark:text-d-bg'
                  : 'text-ink2 dark:text-d-ink2 hover:text-ink dark:hover:text-d-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon active={isActive} />
                {isActive && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        <div className="mx-1 h-5 w-px bg-rule dark:bg-d-rule" />

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-full p-2 text-ink2 dark:text-d-ink2 hover:text-ink dark:hover:text-d-ink transition-colors"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </nav>
    </div>
  )
}
