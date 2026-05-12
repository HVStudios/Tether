import { useState, type FormEvent } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { skyColors } from '../../lib/skies'
import { useTheme } from '../../context/ThemeContext'

export function SignupForm() {
  const { signUp } = useAuthContext()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error, data } = await signUp(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else if (data.session) navigate('/log')
    else setSuccess(true)
  }

  const inputClass =
    'rounded-xl bg-bg2 dark:bg-d-bg2 text-ink dark:text-d-ink px-3 py-2.5 text-[14px] outline-none border border-transparent focus:border-ink/40 dark:focus:border-d-ink/30 placeholder:text-ink-dim dark:placeholder:text-d-ink-dim'
  const labelClass =
    'font-mono text-[10px] tracking-[0.08em] uppercase text-ink-mute dark:text-d-ink-mute mb-1.5'

  const [a, b] = skyColors(8, isDark)
  const [, c] = skyColors(9, isDark)

  if (success) {
    return (
      <div className="rounded-xl border border-rule dark:border-d-rule bg-bg2 dark:bg-d-bg2 px-4 py-4 text-sm text-ink2 dark:text-d-ink2 text-center">
        Check your email for a confirmation link to complete sign up.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="flex flex-col">
        <label htmlFor="signup-email" className={labelClass}>Email</label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="signup-password" className={labelClass}>
          Password <span className="text-ink-dim dark:text-d-ink-dim normal-case tracking-normal">(min 6)</span>
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-xl py-3 text-[14px] font-semibold text-white disabled:opacity-60 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${a}, ${c ?? b})`,
          boxShadow: `0 8px 18px ${a}40`,
        }}
      >
        {loading ? 'Creating account…' : 'Begin →'}
      </button>
    </form>
  )
}
