import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { OnboardingModal } from '../onboarding/OnboardingModal'
import { NAV_TABS } from '../../lib/navTabs'
import { Mark, Wordmark } from '../Mark'

export function AppShell() {
  const { user, signOut, isGuest, exitGuest } = useAuthContext()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  function handleSignOut() { signOut(); navigate('/auth') }
  function handleSignUp()  { exitGuest(); navigate('/auth') }

  return (
    <div className="min-h-screen flex bg-bg dark:bg-d-bg text-ink dark:text-d-ink">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen border-r border-rule dark:border-d-rule bg-card/40 dark:bg-d-bg2/50 backdrop-blur-md">
        <div className="safe-top" />

        <div className="px-5 py-6 flex items-center gap-2.5">
          <Mark size={32} />
          <Wordmark size={20} />
        </div>

        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {NAV_TABS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-ink text-bg dark:bg-d-ink dark:text-d-bg'
                    : 'text-ink2 dark:text-d-ink2 hover:bg-card dark:hover:bg-d-card hover:text-ink dark:hover:text-d-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 flex flex-col gap-0.5 border-t border-rule dark:border-d-rule pt-3">
          <p className="font-mono text-[10px] tracking-wider uppercase text-ink-mute dark:text-d-ink-mute px-3 py-1.5 truncate">
            {isGuest ? 'guest mode' : user?.email}
          </p>
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-medium text-ink2 dark:text-d-ink2 hover:bg-card dark:hover:bg-d-card hover:text-ink dark:hover:text-d-ink transition-all text-left"
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
            )}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {isGuest ? (
            <button
              onClick={handleSignUp}
              className="flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-medium text-accent dark:text-d-accent hover:bg-accent-soft dark:hover:bg-d-accent-soft transition-all text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Create account
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-medium text-ink2 dark:text-d-ink2 hover:bg-card dark:hover:bg-d-card hover:text-ink dark:hover:text-d-ink transition-all text-left"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          )}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 relative">

        {/* Guest banner */}
        {isGuest && (
          <div className="safe-top md:safe-top-0 bg-card dark:bg-d-card border-b border-rule dark:border-d-rule px-4 py-2 flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-wider text-ink-mute dark:text-d-ink-mute">
              Guest mode · entries saved locally
            </p>
            <button onClick={handleSignUp} className="text-xs font-medium text-accent dark:text-d-accent hover:underline shrink-0">
              Create account →
            </button>
          </div>
        )}

        <main className="flex-1 pb-28 md:pb-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <OnboardingModal />
    </div>
  )
}
