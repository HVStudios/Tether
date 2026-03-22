import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth/LoginForm'
import { SignupForm } from '../components/auth/SignupForm'
import { useAuthContext } from '../context/AuthContext'

type Tab = 'login' | 'signup'

export function AuthPage() {
  const [tab, setTab] = useState<Tab>('login')
  const { continueAsGuest } = useAuthContext()
  const navigate = useNavigate()

  function handleGuest() {
    continueAsGuest()
    navigate('/log')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-300/60 via-violet-200/40 to-purple-200/30 dark:from-[#0a0a0f] dark:via-violet-950/30 dark:to-[#0a0a0f] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/15 dark:bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/15 dark:bg-purple-700/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-fuchsia-500/10 dark:bg-fuchsia-800/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30 mb-4">
            <span className="text-3xl font-black text-white">T</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            Tether
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Track how you feel, day by day</p>
        </div>

        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-violet-500/10 border border-white dark:border-gray-800 p-6">
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all ${
                tab === 'login'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-all ${
                tab === 'signup'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              Sign up
            </button>
          </div>

          {tab === 'login' ? <LoginForm /> : <SignupForm />}
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={handleGuest}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors underline underline-offset-2"
          >
            Continue as guest
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Your entries are saved locally. Sign up later to sync across devices.
          </p>
        </div>
      </div>
    </div>
  )
}
