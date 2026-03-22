import { Outlet, useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuthContext } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { OnboardingModal } from '../onboarding/OnboardingModal'

export function AppShell() {
  const { user, signOut, isGuest, exitGuest } = useAuthContext()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  function handleSignOut() {
    signOut()
    navigate('/auth')
  }

  function handleSignUp() {
    exitGuest()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-300/60 via-violet-200/40 to-purple-200/30 dark:from-[#0a0a0f] dark:via-violet-950/30 dark:to-[#0a0a0f]">
      <header className="safe-top bg-gradient-to-r from-violet-600 to-purple-700 dark:from-violet-800 dark:to-purple-900 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-lg shadow-violet-500/20">
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
            <button
              onClick={handleSignUp}
              className="text-xs text-white font-semibold transition-colors px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30"
            >
              Sign up
            </button>
          ) : (
            <button
              onClick={handleSignOut}
              className="text-xs text-white/70 hover:text-white font-medium transition-colors px-2 py-1 rounded-lg hover:bg-white/15"
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      {isGuest && (
        <div className="bg-amber-400/90 dark:bg-amber-500/80 px-4 py-2 flex items-center justify-between gap-2">
          <p className="text-xs text-amber-900 dark:text-amber-950 font-medium">
            Guest mode — entries saved locally only
          </p>
          <button
            onClick={handleSignUp}
            className="text-xs font-bold text-amber-900 dark:text-amber-950 underline underline-offset-2 shrink-0"
          >
            Create account →
          </button>
        </div>
      )}

      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      <BottomNav />
      <OnboardingModal />
    </div>
  )
}
