import { useState, type FormEvent } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export function SignupForm() {
  const { signUp } = useAuthContext()
  const navigate = useNavigate()
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
    if (error) {
      setError(error.message)
    } else if (data.session) {
      navigate('/log')
    } else {
      setSuccess(true)
    }
  }

  const inputClass = 'rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-gray-400 dark:placeholder:text-gray-500'
  const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-300'

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 px-4 py-4 text-sm text-green-700 dark:text-green-400 text-center">
        Check your email for a confirmation link to complete sign up.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="signup-email">Email</label>
        <input id="signup-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClass} htmlFor="signup-password">
          Password <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">(min 6 characters)</span>
        </label>
        <input id="signup-password" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} />
      </div>
      <button type="submit" disabled={loading} className="mt-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors">
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
