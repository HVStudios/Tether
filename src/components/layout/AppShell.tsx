import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { OnboardingModal } from '../onboarding/OnboardingModal'
import { NAV_TABS } from '../../lib/navTabs'

export function AppShell() {
  const { user, signOut, isGuest, exitGuest } = useAuthContext()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  function handleSignOut() { signOut(); navigate('/auth') }
  function handleSignUp()  { exitGuest(); navigate('/auth') }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-violet-100/80 via-purple-50 to-indigo-100/60 dark:from-[#0c0817] dark:via-[#130d24] dark:to-[#0c0817]">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 sticky top-0 h-screen border-r border-black/5 dark:border-white/5 bg-white/40 dark:bg-[#130d24]/60 backdrop-blur-md">
        <div className="safe-top" />

        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/30">
            <span className="text-sm font-black text-white">T</span>
          </div>
          <span className="font-black text-lg text-gray-900 dark:text-white tracking-tight">Tether</span>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {NAV_TABS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200'
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

        {/* Bottom: user info + controls */}
        <div className="px-3 pb-4 flex flex-col gap-0.5 border-t border-black/5 dark:border-white/5 pt-3">
          <p className="text-[11px] text-gray-400 dark:text-gray-500 px-3 py-1 truncate">
            {isGuest ? 'Guest mode' : user?.email}
          </p>
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200 transition-all text-left"
          >
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {isGuest ? (
            <button
              onClick={handleSignUp}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all text-left"
            >
              <span>✨</span> Create account
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-800 dark:hover:text-gray-200 transition-all text-left"
            >
              <span>👋</span> Sign out
            </button>
          )}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Mobile-only header */}
        <header className="safe-top md:hidden bg-gradient-to-r from-violet-600 to-purple-700 dark:from-violet-800 dark:to-purple-900 sticky top-0 z-10 shadow-lg shadow-violet-500/20">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-sm font-black text-white">T</span>
              </div>
              <h1 className="text-lg font-bold text-white tracking-tight">Tether</h1>
            </div>
            <div className="flex items-center gap-2">
              {isGuest
                ? <span className="text-xs text-violet-200 hidden sm:block">Guest mode</span>
                : <span className="text-xs text-violet-200 hidden sm:block">{user?.email}</span>
              }
              <button
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="rounded-lg p-1.5 text-white/70 hover:text-white hover:bg-white/15 transition-colors"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              {isGuest ? (
                <button onClick={handleSignUp} className="text-xs text-white font-semibold transition-colors px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30">
                  Sign up
                </button>
              ) : (
                <button onClick={handleSignOut} className="text-xs text-white/70 hover:text-white font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/15">
                  Sign out
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Guest banner */}
        {isGuest && (
          <div className="bg-amber-400/90 dark:bg-amber-500/80 px-4 py-2 flex items-center justify-between gap-2">
            <p className="text-xs text-amber-900 dark:text-amber-950 font-medium">
              Guest mode — entries saved locally only
            </p>
            <button onClick={handleSignUp} className="text-xs font-bold text-amber-900 dark:text-amber-950 underline underline-offset-2 shrink-0">
              Create account →
            </button>
          </div>
        )}

        <main className="flex-1 pb-32 md:pb-10 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav />
      <OnboardingModal />
    </div>
  )
}
