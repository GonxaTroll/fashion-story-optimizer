import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, Zap } from 'lucide-react'

/* ─── Admin credentials (demo) ─── */
const DEMO = { email: 'admin@fashstopt.com', password: 'admin1234' }

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface Props {
  onSignIn: () => void
  onGoToSignUp: () => void
}

export default function SignInPage({ onSignIn, onGoToSignUp }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const shouldReduce = useReducedMotion()

  const springCard = { type: 'spring', stiffness: 260, damping: 22, delay: 0.05 } as const
  const springBtn  = { type: 'spring', stiffness: 400, damping: 15 } as const

  const quickFill = () => {
    setEmail(DEMO.email)
    setPassword(DEMO.password)
    setError('')
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (loading) return
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data?.detail ?? 'Incorrect email or password.')
        return
      }

      const { access_token } = await res.json()
      localStorage.setItem('auth_token', access_token)
      onSignIn()
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-pattern min-h-screen flex flex-col items-center justify-center p-6 pb-16">

      {/* Ambient blobs */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-[#56f1e0] opacity-30 blur-3xl" />
        <div className="absolute -bottom-16 -right-8 w-56 h-56 rounded-full bg-[#fcbcff] opacity-25 blur-3xl" />
      </div>

      {/* Demo credentials badge */}
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="relative z-10 mb-5 w-full max-w-md"
      >
        <div className="bg-[#edfff9] border border-[#56f1e0]/60 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="shrink-0 w-7 h-7 rounded-lg bg-[#56f1e0]/30 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-[#00675f]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#00675f] uppercase tracking-widest leading-none mb-0.5">
                Demo access
              </p>
              <p className="text-xs text-[#46223e]/70 truncate font-mono">
                {DEMO.email} · {DEMO.password}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={quickFill}
            className="shrink-0 text-xs font-bold text-[#00675f] bg-[#56f1e0]/30 hover:bg-[#56f1e0]/50 rounded-xl px-3 py-1.5 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#56f1e0]"
          >
            Quick fill
          </button>
        </div>
      </motion.div>

      {/* Sign-in card */}
      <main className="w-full max-w-md relative z-10">

        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={springCard}
          className="bg-white rounded-[2rem] shadow-[0_20px_48px_rgba(70,34,62,0.10)] overflow-hidden relative border-t-8 border-[#ff6cb5]"
        >

          {/* Branding header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <motion.div
              initial={shouldReduce ? false : { scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 14, delay: 0.25 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#ffdff2] rounded-full mb-5 shadow-[0_6px_18px_rgba(176,46,122,0.12)]"
            >
              <Sparkles className="text-[#B02E7A] w-7 h-7" aria-hidden="true" />
            </motion.div>

            <h1
              className="text-3xl font-black italic tracking-tight text-[#B02E7A] mb-1 leading-none"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              FashStOpt
            </h1>
            <p className="text-[#784e6c] font-medium text-sm mt-1">
              Fashion Story Optimizer
            </p>
            <p className="text-[#966988] text-xs mt-0.5">Welcome back, gorgeous!</p>
          </div>

          {/* Form */}
          <form className="px-8 pb-2 space-y-5" onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="flex items-center gap-1.5 text-xs font-bold text-[#784e6c] ml-1"
              >
                <Mail className="w-3 h-3" aria-hidden="true" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="hello@fashstopt.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                disabled={loading}
                className="w-full bg-[#ffecf5] border-2 border-transparent rounded-2xl px-5 py-3.5 text-[#46223e] placeholder:text-[#d09ec0] focus:outline-none focus:border-[#B02E7A]/30 focus:ring-0 soft-well transition-all duration-150 text-sm disabled:opacity-50 cursor-text"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label
                  htmlFor="password"
                  className="flex items-center gap-1.5 text-xs font-bold text-[#784e6c]"
                >
                  <Lock className="w-3 h-3" aria-hidden="true" />
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-[#9720ab] hover:underline underline-offset-2 focus:outline-none focus:ring-1 focus:ring-[#9720ab] rounded"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  disabled={loading}
                  className="w-full bg-[#ffecf5] border-2 border-transparent rounded-2xl px-5 py-3.5 pr-12 text-[#46223e] placeholder:text-[#d09ec0] focus:outline-none focus:border-[#B02E7A]/30 focus:ring-0 soft-well transition-all duration-150 text-sm disabled:opacity-50 cursor-text"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#966988] hover:text-[#B02E7A] transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#B02E7A] rounded"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                    : <Eye className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={shouldReduce ? false : { opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                role="alert"
                className="text-xs font-semibold text-[#b41340] bg-[#fff0f4] border border-[#f74b6d]/20 rounded-xl px-4 py-2.5"
              >
                {error}
              </motion.p>
            )}

            {/* Remember me */}
            <div className="flex items-center gap-3 px-1">
              <button
                type="button"
                role="switch"
                aria-checked={rememberMe}
                onClick={() => setRememberMe((v) => !v)}
                className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40 focus:ring-offset-1 ${
                  rememberMe ? 'bg-[#9720ab]' : 'bg-[#ffd7f0]'
                }`}
              >
                <span
                  className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    rememberMe ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-[#784e6c] select-none">
                Stay playful (Remember me)
              </span>
            </div>

            {/* CTA button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={shouldReduce || loading ? {} : { scale: 1.03 }}
              whileTap={shouldReduce || loading ? {}  : { scale: 0.96 }}
              transition={springBtn}
              className="bubblegum-gradient w-full py-4 rounded-full text-white font-black text-lg shadow-[0_10px_20px_rgba(168,33,110,0.30)] hover:shadow-[0_14px_28px_rgba(168,33,110,0.40)] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed transition-shadow duration-200"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 text-white/80"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer strip */}
          <div className="bg-[#ffecf5]/50 px-8 py-5 mt-5 text-center">
            <p className="text-sm font-medium text-[#784e6c]">
              New to FashStOpt?{' '}
              <button
                type="button"
                onClick={onGoToSignUp}
                className="text-[#B02E7A] font-bold hover:underline underline-offset-2 ml-0.5 focus:outline-none focus:ring-1 focus:ring-[#B02E7A] rounded cursor-pointer"
              >
                Create an account
              </button>
            </p>
          </div>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          aria-hidden="true"
          className="mt-10 flex justify-center gap-4"
        >
          <div className="w-2 h-2 rounded-full bg-[#ff6cb5]" />
          <div className="w-2 h-2 rounded-full bg-[#fcbcff]" />
          <div className="w-2 h-2 rounded-full bg-[#56f1e0]" />
        </motion.div>
      </main>

      {/* Inline footer */}
      <footer className="relative z-10 mt-10 flex flex-col items-center gap-3">
        <div className="flex gap-6">
          {['About', 'Support', 'Privacy', 'Terms'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs font-medium text-[#966988] hover:text-[#B02E7A] transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[#B02E7A] rounded"
            >
              {link}
            </a>
          ))}
        </div>
        <span
          className="text-xs font-black text-[#784e6c]/50 uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          © 2026 FashStOpt · Stay Playful
        </span>
      </footer>
    </div>
  )
}
