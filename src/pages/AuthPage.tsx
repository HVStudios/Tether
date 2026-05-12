import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { SignupForm } from '../components/auth/SignupForm'
import { useAuthContext } from '../context/AuthContext'
import { Mark, Wordmark } from '../components/Mark'
import { skyColors } from '../lib/skies'
import { useTheme } from '../context/ThemeContext'

type Tab = 'login' | 'signup'

export function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const { continueAsGuest } = useAuthContext()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  function handleGuest() {
    continueAsGuest()
    navigate('/log')
  }

  const [a, b] = skyColors(8, isDark)

  return (
    <div className="relative min-h-screen bg-bg dark:bg-d-bg overflow-hidden">
      {/* Atmospheric gradient at top */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[55%] pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${a} 0%, ${b} 50%, transparent 100%)`,
          opacity: isDark ? 0.4 : 0.55,
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col px-6 py-10 max-w-md mx-auto">
        <div className="flex items-center gap-2.5">
          <Mark size={32} />
          <Wordmark size={22} />
        </div>

        <div className="flex-1 flex flex-col justify-center -mt-5">
          <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-ink-mute dark:text-d-ink-mute">
            Welcome back
          </p>
          <h1
            className="text-[34px] font-semibold leading-[1.05] text-ink dark:text-d-ink mt-2 mb-6"
            style={{ letterSpacing: '-0.025em' }}
          >
            Sign in, or<br />begin a new sky.
          </h1>

          <div className="bg-card dark:bg-d-card rounded-3xl p-5 border border-rule dark:border-d-rule shadow-[0_8px_28px_rgba(31,36,51,0.06)] dark:shadow-none">
            <div className="flex bg-bg2 dark:bg-d-bg2 rounded-full p-1 mb-4">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 rounded-full py-1.5 text-[13px] font-medium transition-all ${
                  tab === 'login'
                    ? 'bg-card dark:bg-d-card text-ink dark:text-d-ink shadow-sm'
                    : 'text-ink-mute dark:text-d-ink-mute'
                }`}
              >
                Sign in
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`flex-1 rounded-full py-1.5 text-[13px] font-medium transition-all ${
                  tab === 'signup'
                    ? 'bg-card dark:bg-d-card text-ink dark:text-d-ink shadow-sm'
                    : 'text-ink-mute dark:text-d-ink-mute'
                }`}
              >
                Sign up
              </button>
            </div>

            {tab === 'login' ? <LoginForm /> : <SignupForm />}
          </div>

          <button
            onClick={handleGuest}
            className="mt-4 rounded-xl border border-rule dark:border-d-rule bg-transparent py-2.5 text-[13px] font-medium text-ink2 dark:text-d-ink2 hover:bg-card dark:hover:bg-d-card transition-colors"
          >
            Continue as guest
          </button>
          <p className="mt-2 text-center text-[12px] text-ink-mute dark:text-d-ink-mute">
            Entries stay on this device. Sign up later to sync.
          </p>
        </div>
      </div>
    </div>
  )
}
