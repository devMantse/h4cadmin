import { useAuth } from '../lib/auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function Login() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState('admin@hungry4change.local')
  const [password, setPassword] = useState('admin123')
  const nav = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (e: any) {
      // Error is already handled by the auth mutation
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <div className="text-center">
          <div className="text-2xl font-semibold text-brand-600">Hungry4Change Admin</div>
          <div className="text-sm text-slate-500">Sign in to continue</div>
        </div>
        <label className="label">Email</label>
        <input
          className="input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <button
          className="btn btn-primary w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in…' : 'Sign in'}
        </button>
        <div className="text-xs text-slate-500 text-center">
          Default creds are prefilled (from API seed)
        </div>
      </form>
    </div>
  )
}
