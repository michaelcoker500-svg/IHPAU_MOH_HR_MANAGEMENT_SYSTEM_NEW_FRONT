import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, ShieldCheck, Users, Briefcase, UserCog, UserSearch, GraduationCap, Target,
  Landmark, Crown, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle,
} from 'lucide-react'
import { useAuth, DEMO_ACCOUNTS, ORGANIZATION } from '@/app/auth-context'
import type { RoleKey } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const ROLE_ICON: Record<RoleKey, typeof Crown> = {
  SUPER_ADMIN: Crown,
  HR_ADMIN: ShieldCheck,
  HR_OFFICER: Users,
  MANAGER: Briefcase,
  EMPLOYEE: UserCog,
  RECRUITER: UserSearch,
  TRAINING_MANAGER: GraduationCap,
  PERFORMANCE_MANAGER: Target,
  FINANCE: Landmark,
}

const ROLE_DESCRIPTIONS: Record<RoleKey, string> = {
  SUPER_ADMIN: 'Full system access across every module and organization setting.',
  HR_ADMIN: 'Manage employees, attendance, leave, recruitment, performance, training and approvals.',
  HR_OFFICER: 'Day-to-day HR operations: employees, attendance, leave and documents.',
  MANAGER: 'Team dashboard, approvals, and team performance for your department.',
  EMPLOYEE: 'Self-service: attendance, leave, performance, training and documents.',
  RECRUITER: 'Job openings, candidates, applications, interviews and offers.',
  TRAINING_MANAGER: 'Courses, sessions, enrollments and certifications.',
  PERFORMANCE_MANAGER: 'Performance cycles, goals, reviews and assessments.',
  FINANCE: 'Authorized employee data and compensation reporting.',
}

export default function LoginPage() {
  const { loginAsDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSelect(role: RoleKey) {
    setError('')
    loginAsDemo(role)
    navigate('/dashboard')
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.')
      return
    }

    const account = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
    if (!account) {
      setError('No demo account matches that email. Try one of the accounts on the right, or use the exact demo email shown on a role card.')
      return
    }

    setSubmitting(true)
    // Simulate a brief network round-trip so the loading state is visible,
    // matching the pattern used for every other action in this app.
    setTimeout(() => {
      setSubmitting(false)
      loginAsDemo(account.role)
      navigate('/dashboard')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-950 via-brand-900 to-brand-800">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500 text-brand-950 shadow-elevated">
            <Building2 size={28} />
          </div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl">IHPAU HR Cloud</h1>
          <p className="mt-1.5 max-w-md text-sm text-brand-200">{ORGANIZATION.name}</p>
          <Badge tone="warning" className="mt-4 border-accent-500/30 bg-accent-500/15 text-accent-300">DEMO MODE</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr] lg:items-start lg:gap-8">
          {/* Left: credential login form */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:p-6 lg:sticky lg:top-10">
            <h2 className="text-sm font-semibold text-white">Sign in</h2>
            <p className="mt-1 text-xs text-brand-200">
              Enter a demo account's email as the administrator or any other role head. Any password works in this demo.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-brand-100">Email</label>
                <div className="relative">
                  <Mail size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-300" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hr.admin@ihpau.demo"
                    className="h-11 w-full rounded-lg border border-white/15 bg-white/10 pl-9 pr-3.5 text-sm text-white placeholder:text-brand-300/70 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-brand-100">Password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand-300" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-lg border border-white/15 bg-white/10 pl-9 pr-9 text-sm text-white placeholder:text-brand-300/70 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-brand-200">
                  <input type="checkbox" className="h-3.5 w-3.5 rounded border-white/30 bg-white/10" />
                  Remember me
                </label>
                <button type="button" className="text-accent-300 hover:text-accent-200">Forgot password?</button>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-danger-500/30 bg-danger-500/10 px-3 py-2.5 text-xs text-danger-200">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full bg-accent-500 text-brand-950 hover:bg-accent-400" loading={submitting}>
                <LogIn size={15} /> Sign In
              </Button>
            </form>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-brand-300/70">
              This is a fictional development login — no real credentials are checked. Use any of the demo emails shown on the right with any password.
            </p>
          </div>

          {/* Right: role cards */}
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-brand-300/80">Or choose a role to explore instantly</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = ROLE_ICON[account.role]
                return (
                  <button
                    key={account.role}
                    onClick={() => handleSelect(account.role)}
                    className="group flex flex-col items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur transition hover:-translate-y-0.5 hover:border-accent-500/40 hover:bg-white/10 focus-visible:outline-accent-400"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-accent-400 group-hover:bg-accent-500/20">
                      <Icon size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{account.role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                      <p className="mt-1 text-xs leading-relaxed text-brand-200">{ROLE_DESCRIPTIONS[account.role]}</p>
                    </div>
                    <p className="mt-auto text-[11px] text-brand-300/80">{account.email}</p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-brand-300/70">
          These are fictional development accounts for demonstration purposes only — no real credentials are required.
        </p>
      </div>
    </div>
  )
}
