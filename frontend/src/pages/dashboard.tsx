import { useEffect, useRef, useState } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import AppFooter from '@/components/AppFooter'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Sparkles, LogOut, Home, Calendar, Settings, BarChart2,
  TrendingUp, Star, Package, Shirt, Store, User, X,
  Clock, Sliders, Zap, CheckCircle2, ChevronRight, ExternalLink,
} from 'lucide-react'

const APPSTORE_URL  = 'https://apps.apple.com/co/app/fashion-story/id420590864'
const PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.teamlava.fashionstory&hl=es'
const API_BASE      = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface ApiResultItem {
  hour: number; slot: number; title: string; collection: string
  cost: number; xp: number; units: number; revenue: number
  duration: number; order_position: number | null
}

/* ─── Shared spring configs ─── */
const SPRING     = { type: 'spring', stiffness: 400, damping: 15 } as const
const SPRING_POP = { type: 'spring', stiffness: 280, damping: 18 } as const

/* ─── Framer variants for shimmer propagation ─── */
const cardVariants = {
  rest:  { scale: 1 },
  hover: { scale: 1.03 },
  tap:   { scale: 0.95 },
}
const shimmerVariants = {
  rest:  { x: '-110%' },
  hover: { x: '110%' },
}

/* ════════════════════════════════════════════
   Gamified Stat Card
   ════════════════════════════════════════════ */
interface StatCardProps {
  label: string
  value: number
  prefix?: string
  decimals?: boolean
  delta: string
  icon: React.ElementType
  circleColor: string
  delay: number
  shouldReduce: boolean
}

function StatCard({
  label, value, prefix = '', decimals = false, delta,
  icon: Icon, circleColor, delay, shouldReduce,
}: StatCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={shouldReduce ? undefined : 'hover'}
      whileTap="tap"
      transition={SPRING}
      style={{ opacity: 0, scale: 0.82, y: 28 }}
      className="shine-card bg-white rounded-2xl p-6 flex items-center gap-5
                 shadow-[0_8px_24px_rgba(176,46,122,0.08)]
                 hover:shadow-[0_16px_40px_rgba(176,46,122,0.18)]
                 transition-shadow duration-300 cursor-default overflow-hidden relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_POP, delay }}
        className="contents"
      >
        {!shouldReduce && (
          <motion.div
            variants={shimmerVariants}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
            }}
          />
        )}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-lg shrink-0"
          style={{ backgroundColor: circleColor }}
        >
          <Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold text-[#784e6c] uppercase tracking-widest mb-0.5">{label}</p>
          <p className="text-2xl font-black text-[#46223e] leading-none" style={{ fontFamily: 'var(--font-headline)' }}>
            {prefix}{decimals ? value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }) : value.toLocaleString()}
          </p>
          <p className="text-xs text-[#00675f] font-bold mt-1">{delta}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════
   Apple / Google Play store badge buttons
   ════════════════════════════════════════════ */
function AppleBadge() {
  return (
    <a
      href={APPSTORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Fashion Story on the App Store"
      className="group flex items-center gap-3 bg-[#46223e] hover:bg-[#5a2d52]
                 text-white rounded-2xl px-5 py-3 transition-all duration-200
                 shadow-[0_8px_20px_rgba(70,34,62,0.25)]
                 hover:shadow-[0_12px_28px_rgba(70,34,62,0.35)]
                 focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/60 cursor-pointer"
    >
      {/* Apple logo SVG */}
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 fill-white" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      <div className="text-left leading-none">
        <p className="text-[9px] font-semibold text-white/70 uppercase tracking-widest mb-0.5">Download on the</p>
        <p className="text-base font-black" style={{ fontFamily: 'var(--font-headline)' }}>App Store</p>
      </div>
    </a>
  )
}

function PlayBadge() {
  return (
    <a
      href={PLAYSTORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get Fashion Story on Google Play"
      className="group flex items-center gap-3 bg-white hover:bg-[#fff5fb]
                 text-[#46223e] rounded-2xl px-5 py-3 transition-all duration-200
                 border-2 border-[#ffd7f0] hover:border-[#ff6cb5]
                 shadow-[0_8px_20px_rgba(176,46,122,0.10)]
                 hover:shadow-[0_12px_28px_rgba(176,46,122,0.20)]
                 focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/60 cursor-pointer"
    >
      {/* Google Play triangle logo */}
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
        <path d="M3.18 23.76c.3.17.64.24.99.2l13.12-11.75L13.65 8.6 3.18 23.76z" fill="#EA4335"/>
        <path d="M20.6 10.27L17.3 8.4l-3.65 3.81 3.65 3.58 3.33-1.89a1.75 1.75 0 0 0 0-3.63z" fill="#FBBC04"/>
        <path d="M3.18.24A1.74 1.74 0 0 0 2.4 1.7v20.6c0 .6.28 1.12.78 1.46L13.65 12 3.18.24z" fill="#4285F4"/>
        <path d="M4.17.04 13.65 8.6l3.65-3.58L4.17.05A1.73 1.73 0 0 0 3.18.24c-.01 0 .99-.2.99-.2z" fill="#34A853"/>
      </svg>
      <div className="text-left leading-none">
        <p className="text-[9px] font-semibold text-[#784e6c] uppercase tracking-widest mb-0.5">Get it on</p>
        <p className="text-base font-black" style={{ fontFamily: 'var(--font-headline)' }}>Google Play</p>
      </div>
    </a>
  )
}

/* ════════════════════════════════════════════
   Tutorial Step Card
   ════════════════════════════════════════════ */
const TUTORIAL_STEPS = [
  {
    number: 1,
    icon: Clock,
    iconColor: '#B02E7A',
    iconBg: '#ffdff2',
    title: 'Set Your Schedule',
    description:
      'Go to the Schedule page and mark the hours you are available to play each day of the week. The optimizer will only schedule items during your active hours.',
    tip: 'Be realistic — only check hours you can actually open the game.',
  },
  {
    number: 2,
    icon: Sliders,
    iconColor: '#9720ab',
    iconBg: '#f3e8ff',
    title: 'Configure the Optimizer',
    description:
      'Open the Optimizer page and choose your goals (Revenue, XP, or Gems), the number of simultaneous slots, and whether to allow item repeats across hours.',
    tip: 'For best profit, select Revenue + XP together and enable full collection mode.',
  },
  {
    number: 3,
    icon: Zap,
    iconColor: '#d97706',
    iconBg: '#fef3c7',
    title: 'Run the Optimization',
    description:
      'Hit Run Optimizer. The solver finds the best item-to-hour assignment that maximizes your selected goals while respecting your availability.',
    tip: 'It runs in seconds. If it takes longer, reduce the number of slots.',
  },
  {
    number: 4,
    icon: CheckCircle2,
    iconColor: '#00675f',
    iconBg: '#d1faf5',
    title: 'Follow the Results',
    description:
      'Check the Results page to see your optimized schedule. Each row tells you which item to put in your boutique at which hour — just follow it in the game!',
    tip: 'Export to CSV and keep it open on your phone while you play.',
  },
]

/* ════════════════════════════════════════════
   Tutorial Modal
   ════════════════════════════════════════════ */
function TutorialModal({ onClose, shouldReduce }: { onClose: () => void; shouldReduce: boolean }) {
  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      style={{ backgroundColor: 'rgba(70,34,62,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Optimization Tutorial"
    >
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, scale: 0.9, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 32 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(70,34,62,0.25)]
                   w-full max-w-2xl max-h-[90vh] overflow-y-auto border-t-8 border-[#ff6cb5]"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <div
              className="inline-flex items-center gap-2 bg-[#ffdff2] text-[#B02E7A]
                          px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-3"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              How to Use
            </div>
            <h2
              className="text-2xl md:text-3xl font-black text-[#46223e] leading-tight"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Optimization Guide
            </h2>
            <p className="text-[#784e6c] text-sm font-medium mt-1">
              Follow these 4 steps to get the best Fashion Story schedule.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tutorial"
            className="ml-4 shrink-0 mt-1 w-9 h-9 rounded-full bg-[#ffecf5] hover:bg-[#ffdff2]
                       flex items-center justify-center text-[#784e6c] hover:text-[#B02E7A]
                       transition-colors duration-150 cursor-pointer focus:outline-none
                       focus:ring-2 focus:ring-[#B02E7A]/40"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-8 h-px bg-[#ffecf5]" />

        {/* Steps */}
        <div className="px-8 py-6 space-y-4">
          {TUTORIAL_STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.number}
                initial={shouldReduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.07, type: 'spring', stiffness: 300, damping: 22 }}
                className="flex gap-4 bg-[#FFF5F8] rounded-2xl p-5 border border-[#ffecf5]"
              >
                {/* Step number + icon */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: step.iconBg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: step.iconColor }} aria-hidden="true" />
                  </div>
                  <span
                    className="text-[10px] font-black text-[#d09ec0] uppercase tracking-widest"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    {String(step.number).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <h3
                    className="text-base font-black text-[#46223e] mb-1.5"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#784e6c] font-medium leading-relaxed mb-2">
                    {step.description}
                  </p>
                  <div className="flex items-start gap-1.5 bg-white rounded-xl px-3 py-2 border border-[#ffecf5]">
                    <ChevronRight className="w-3.5 h-3.5 text-[#B02E7A] shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-xs text-[#966988] font-semibold leading-relaxed">
                      {step.tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Footer CTA */}
        <div className="px-8 pb-8">
          <div className="bg-[#ffdff2] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-bold text-[#784e6c] text-center sm:text-left">
              Ready to start? Set your schedule first.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="bubblegum-gradient text-white px-6 py-2.5 rounded-full font-black
                         text-sm shadow-[0_8px_20px_rgba(168,33,110,0.25)]
                         hover:shadow-[0_12px_28px_rgba(168,33,110,0.35)]
                         transition-shadow duration-200 cursor-pointer shrink-0
                         focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/50"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Got it!
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════
   Dashboard Page
   ════════════════════════════════════════════ */
interface Props { onSignOut: () => void; onNavigate: (page: string) => void }

export default function DashboardPage({ onSignOut, onNavigate }: Props) {
  const { name: currentUserName } = useCurrentUser()
  const shouldReduce = useReducedMotion() ?? false
  const [tutorialOpen, setTutorialOpen] = useState(false)

  /* Latest optimization results */
  const [results, setResults]         = useState<ApiResultItem[]>([])
  const [optimizedAt, setOptimizedAt] = useState<string | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    const token = localStorage.getItem('auth_token')
    fetch(`${API_BASE}/optimize/latest`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => { setResults(data.results ?? []); setOptimizedAt(data.optimization_date ?? null) })
      .catch(() => {})
      .finally(() => setLoadingStats(false))
  }, [])

  const totalRevenue = results.reduce((s, r) => s + r.revenue, 0)
  const totalXP      = results.reduce((s, r) => s + r.xp, 0)
  const totalItems   = results.length

  const optimizedLabel = optimizedAt
    ? `as of ${new Date(optimizedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    : 'no optimization yet'

  const stats = [
    { label: 'Revenue',        value: totalRevenue, prefix: '',  decimals: true,  delta: optimizedLabel, icon: TrendingUp, circleColor: '#f59e0b' },
    { label: 'XP Gained',      value: totalXP,      prefix: '',  decimals: false, delta: optimizedLabel, icon: Star,       circleColor: '#60a5fa' },
    { label: 'Items Scheduled',value: totalItems,   prefix: '',  decimals: false, delta: optimizedLabel, icon: Package,    circleColor: '#f472b6' },
  ]

  /* Floating animation (respects reduced-motion) */
  const floatY = shouldReduce ? {} : { y: [0, -10, 0] as [number, number, number] }
  const floatT = { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const }
  const hangT  = { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }
  const starT  = { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.1 }

  const navLinks       = ['Home', 'Schedule', 'Optimizer', 'Results']
  const mobileNavIcons = [Home, Calendar, Settings, BarChart2]

  return (
    <div className="min-h-screen bg-[#FFF5F8] overflow-x-hidden">

      {/* ══════════════════════════════
          TUTORIAL MODAL
          ══════════════════════════════ */}
      <AnimatePresence>
        {tutorialOpen && (
          <TutorialModal
            onClose={() => setTutorialOpen(false)}
            shouldReduce={shouldReduce}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════
          NAVIGATION
          ══════════════════════════════ */}
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="bg-[#FFF5F8]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(70,34,62,0.06)] rounded-b-[2rem] max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-8 py-4">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ffdff2] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#B02E7A]" aria-hidden="true" />
              </div>
              <span
                className="text-xl font-black italic text-[#B02E7A] leading-none"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                FashStOpt
              </span>
            </div>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8" role="list">
              {navLinks.map((link, i) => (
                <a
                  key={link}
                  href="#"
                  role="listitem"
                  onClick={
                    link === 'Schedule'  ? (e) => { e.preventDefault(); onNavigate('scheduler') } :
                    link === 'Optimizer' ? (e) => { e.preventDefault(); onNavigate('optimizer') }  :
                    link === 'Results'   ? (e) => { e.preventDefault(); onNavigate('results') }    :
                    (e) => e.preventDefault()
                  }
                  className={`text-sm font-bold tracking-tight transition-all duration-150 focus:outline-none
                    focus:ring-2 focus:ring-[#B02E7A]/40 rounded px-1 py-0.5
                    ${i === 0
                      ? 'text-[#B02E7A] border-b-2 border-[#B02E7A] pb-1'
                      : 'text-[#d09ec0] hover:text-[#B02E7A]'
                    }`}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Right: avatar + sign-out */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => onNavigate('account')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                aria-label="Go to account settings"
                className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#784e6c]
                           bg-[#ffecf5] hover:bg-[#ffdff2] rounded-xl px-3 py-1.5
                           transition-colors duration-150 cursor-pointer focus:outline-none
                           focus:ring-2 focus:ring-[#B02E7A]/40"
              >
                <User className="w-3.5 h-3.5 text-[#B02E7A]" aria-hidden="true" />
                {currentUserName || '…'}
              </motion.button>
              <motion.button
                onClick={onSignOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                aria-label="Sign out"
                className="flex items-center gap-1.5 text-xs font-bold text-[#784e6c]
                           hover:text-[#B02E7A] hover:bg-[#ffdff2] px-3 py-2 rounded-xl
                           transition-colors duration-150 cursor-pointer focus:outline-none
                           focus:ring-2 focus:ring-[#B02E7A]/40"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden md:inline">Sign out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════
          MAIN CONTENT
          ══════════════════════════════ */}
      <main className="pt-32 pb-28 px-6">

        {/* ── HERO ── */}
        <section className="max-w-7xl mx-auto mb-20" aria-label="Hero">
          <div className="flex flex-col md:flex-row items-center gap-12">

            {/* Left: text + CTAs */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:w-1/2 z-10"
            >
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-black text-[#46223e]
                           leading-[0.95] mb-6 tracking-tighter"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                Dress Up Your{' '}
                <span className="text-[#B02E7A] italic">Dreams!</span>
              </h1>
              <p className="text-lg text-[#784e6c] font-medium max-w-md mb-4 leading-relaxed">
                A smart scheduler for{' '}
                <span className="font-black text-[#B02E7A]">Fashion Story</span> by Storm8 —
                the mobile boutique game. FashStOpt uses optimization algorithms to find the
                perfect item-to-hour lineup that maximizes your coins, XP &amp; gems every day.
              </p>
              {/* Inline store rating */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex items-center gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" aria-hidden="true" />
                  ))}
                  <Star className="w-4 h-4 text-[#d09ec0]" aria-hidden="true" />
                </div>
                <span className="text-sm font-bold text-[#784e6c]">4.0</span>
                <span className="text-xs text-[#966988] font-medium">· Storm8 Studios · iOS &amp; Android</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  onClick={() => onNavigate('optimizer')}
                  whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                  className="bubblegum-gradient text-white px-10 py-4 rounded-full font-black
                             text-lg shadow-[0_20px_40px_rgba(168,33,110,0.30)] cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/50"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  Open Optimizer
                </motion.button>
                <motion.button
                  onClick={() => setTutorialOpen(true)}
                  whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                  className="bg-[#ffcfee] text-[#B02E7A] px-10 py-4 rounded-full font-black
                             text-lg cursor-pointer hover:bg-[#ffbfe8] transition-colors
                             duration-150 focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  Tutorial
                </motion.button>
              </div>
            </motion.div>

            {/* Right: floating boutique room illustration */}
            <div className="md:w-1/2 relative flex justify-center">
              <motion.div animate={floatY} transition={floatT} className="w-72 h-72 lg:w-96 lg:h-96 relative">
                <div
                  className="w-full h-full rounded-full border-8 border-white shadow-2xl
                             overflow-hidden flex flex-col items-center justify-center gap-3 relative"
                  style={{ background: 'linear-gradient(155deg, #ffdff2 0%, #fcbcff 45%, #56f1e0 100%)' }}
                >
                  {/* Rack bar */}
                  <div className="w-52 h-2 bg-white/60 rounded-full shadow-inner mb-1" />
                  {/* Clothing items on rack — game palette: hot pink, lavender, mint, rose */}
                  <div className="flex gap-2.5 -mt-1">
                    {[
                      { color: '#E87C98', height: '3.8rem' },
                      { color: '#c084fc', height: '3.2rem' },
                      { color: '#56f1e0', height: '3.6rem' },
                      { color: '#B02E7A', height: '4rem'   },
                      { color: '#ff6cb5', height: '3.4rem' },
                    ].map(({ color, height }, i) => (
                      <motion.div
                        key={i}
                        className="rounded-xl border-2 border-white/70 shadow-md relative"
                        style={{ backgroundColor: color, width: '2rem', height }}
                        initial={{ y: 10 + i * 3, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.38 + i * 0.06 }}
                      >
                        {/* Hanger notch */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/80 rounded-full" />
                      </motion.div>
                    ))}
                  </div>
                  {/* Floor rack */}
                  <div className="w-44 h-1 bg-white/40 rounded-full mt-2" />
                  <div className="flex gap-2 mt-1">
                    {['#ffd7f0','#c4b5fd','#99f6e4'].map((c, i) => (
                      <motion.div
                        key={i}
                        className="w-7 h-9 rounded-lg border border-white/50 shadow-sm"
                        style={{ backgroundColor: c }}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.58 + i * 0.05 }}
                      />
                    ))}
                  </div>
                  <Store className="w-8 h-8 text-white/60 mt-1" aria-hidden="true" />
                </div>
              </motion.div>

              {/* Floating hanger badge */}
              <motion.div
                animate={shouldReduce ? {} : { y: [0, -8, 0], rotate: [12, 15, 12] }}
                transition={hangT}
                aria-hidden="true"
                className="absolute -top-4 right-0 lg:-right-4 bg-[#fcbcff] p-4 rounded-2xl
                           rotate-12 shadow-xl border-4 border-white hidden sm:flex
                           items-center justify-center"
              >
                <Shirt className="w-8 h-8 text-[#9720ab]" />
              </motion.div>

              {/* Floating star badge */}
              <motion.div
                animate={shouldReduce ? {} : { y: [0, -12, 0], rotate: [-12, -15, -12] }}
                transition={starT}
                aria-hidden="true"
                className="absolute -bottom-2 left-0 lg:-left-4 bg-[#ffcfee] p-4 rounded-full
                           -rotate-12 shadow-xl border-4 border-white hidden sm:flex
                           items-center justify-center"
              >
                <Star className="w-8 h-8 text-[#B02E7A] fill-[#B02E7A]" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── GET THE GAME BANNER ── */}
        <section className="max-w-7xl mx-auto mb-8" aria-label="Get the game">
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="relative overflow-hidden rounded-[2rem] border-2 border-[#ffd7f0]"
            style={{
              background: 'linear-gradient(120deg, #fff0fb 0%, #ffdff2 40%, #f3e8ff 100%)',
            }}
          >
            {/* Decorative blobs */}
            <div aria-hidden="true" className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[#fcbcff]/40 blur-2xl pointer-events-none" />
            <div aria-hidden="true" className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-[#56f1e0]/30 blur-2xl pointer-events-none" />

            {/* Decorative clothing tags */}
            <div aria-hidden="true" className="absolute top-4 right-32 hidden lg:flex gap-2 opacity-30">
              {['#ff6cb5','#fcbcff','#56f1e0','#B02E7A','#9720ab'].map((c, i) => (
                <div key={i} className="w-5 h-8 rounded-md border border-white/60" style={{ backgroundColor: c, transform: `rotate(${(i - 2) * 8}deg)` }} />
              ))}
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-7">
              {/* Left: branding */}
              <div className="flex items-center gap-4">
                {/* App icon placeholder — boutique storefront */}
                <div
                  className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #B02E7A 0%, #ff6cb5 100%)' }}
                >
                  <Store className="w-8 h-8 text-white" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-black text-[#B02E7A] uppercase tracking-widest mb-0.5"
                     style={{ fontFamily: 'var(--font-headline)' }}>
                    Play the original game
                  </p>
                  <p className="text-xl font-black text-[#46223e]"
                     style={{ fontFamily: 'var(--font-headline)' }}>
                    Fashion Story™
                  </p>
                  <p className="text-xs text-[#784e6c] font-medium">by Storm8 Studios</p>
                </div>
              </div>

              {/* Right: badges */}
              <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
                <AppleBadge />
                <PlayBadge />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ── LAST RESULTS ── */}
        <section className="max-w-7xl mx-auto" aria-label="Last results">
          <div className="bg-[#ffdff2] rounded-[2rem] p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2
                  className="text-3xl font-black text-[#46223e] mb-1"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  Last Results
                </h2>
                {optimizedAt ? (
                  <p className="text-[#784e6c] font-bold text-sm">
                    Optimized on{' '}
                    <span className="text-[#00675f] font-black">
                      {new Date(optimizedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </p>
                ) : (
                  <p className="text-[#784e6c] font-bold text-sm">No optimization run yet</p>
                )}
              </div>
              <motion.button
                onClick={() => onNavigate('results')}
                whileHover={shouldReduce ? {} : { scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={SPRING}
                className="flex items-center gap-2 text-sm font-black text-[#B02E7A]
                           bg-white hover:bg-[#ffecf5] rounded-2xl px-5 py-2.5
                           transition-colors duration-150 cursor-pointer shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                View full results
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            </div>

            {loadingStats ? (
              /* Skeleton */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 flex items-center gap-5 animate-pulse">
                    <div className="w-14 h-14 rounded-full bg-[#ffd7f0] shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-16 bg-[#ffd7f0] rounded-full" />
                      <div className="h-7 w-24 bg-[#ffbfe8] rounded-full" />
                      <div className="h-2.5 w-20 bg-[#ffd7f0] rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#d09ec0]" aria-hidden="true" />
                </div>
                <p className="text-[#784e6c] font-bold text-sm text-center">
                  No results yet — run the optimizer first!
                </p>
                <motion.button
                  onClick={() => onNavigate('optimizer')}
                  whileHover={shouldReduce ? {} : { scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  className="bubblegum-gradient text-white px-6 py-2.5 rounded-full font-black
                             text-sm shadow-[0_8px_20px_rgba(168,33,110,0.25)] cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/50 mt-1"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  Go to Optimizer
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map(({ label, value, prefix, decimals, delta, icon, circleColor }, i) => (
                  <StatCard
                    key={label}
                    label={label}
                    value={value}
                    prefix={prefix}
                    decimals={decimals}
                    delta={delta}
                    icon={icon}
                    circleColor={circleColor}
                    delay={0.08 + i * 0.1}
                    shouldReduce={shouldReduce}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ══════════════════════════════
          FOOTER
          ══════════════════════════════ */}
      <AppFooter />

      {/* ══════════════════════════════
          MOBILE BOTTOM NAV
          ══════════════════════════════ */}
      <div
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div
          className="bg-[#FFF5F8]/90 backdrop-blur-xl rounded-full shadow-2xl
                     px-6 py-3.5 flex items-center gap-6 border border-[#ffd7f0]"
        >
          {mobileNavIcons.map((Icon, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={SPRING}
              aria-label={navLinks[i]}
              onClick={
                navLinks[i] === 'Schedule'  ? () => onNavigate('scheduler') :
                navLinks[i] === 'Optimizer' ? () => onNavigate('optimizer')  :
                navLinks[i] === 'Results'   ? () => onNavigate('results')    :
                undefined
              }
              className={`p-1 cursor-pointer focus:outline-none focus:ring-2
                          focus:ring-[#B02E7A]/40 rounded-full transition-colors duration-150
                          ${i === 0 ? 'text-[#B02E7A]' : 'text-[#d09ec0] hover:text-[#B02E7A]'}`}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
