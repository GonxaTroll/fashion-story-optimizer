import { useState, useEffect, useRef } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import AppFooter from '@/components/AppFooter'
import { flushSync } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Sparkles, User, LogOut,
  Layers, RefreshCw, LayoutGrid, Target,
  Zap, TrendingUp, Gem, Star,
  Home, Calendar, Settings, BarChart2,
  CheckCircle2, Circle, Loader2, X, Clock,
} from 'lucide-react'
import {
  SPRING,
  BouncyToggle,
  ShimmerButton,
} from '@/components/glimmer/optimizer-ui'


/* ════════════════════════════════════════
   SEGMENTED CONTROL — Revenue / XP / Gems (multi-select)
   ════════════════════════════════════════ */
type Goal = 'Revenue' | 'XP'
const GOAL_ICONS: Record<Goal, React.ElementType> = {
  Revenue: TrendingUp,
  XP:      Star,
}

function GoalWarning({ goals }: { goals: Goal[] }) {
  if (goals.length <= 1) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200
                 rounded-2xl px-3.5 py-2.5"
    >
      <span className="text-amber-500 mt-0.5 shrink-0 text-base leading-none">⚠️</span>
      <p className="text-xs font-semibold text-amber-700 leading-relaxed">
        Multi-goal optimization isn't supported yet — only Revenue or XP alone.
      </p>
    </motion.div>
  )
}

function SegmentedControl({ value, onChange }: { value: Goal[]; onChange: (g: Goal[]) => void }) {
  const options: Goal[] = ['Revenue', 'XP']

  const toggle = (opt: Goal) => {
    if (value.includes(opt)) {
      // Don't allow deselecting the last goal
      if (value.length === 1) return
      onChange(value.filter((g) => g !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  return (
    <div>
      <div className="flex p-1.5 bg-[#ffd7f0] rounded-full gap-1">
        {options.map((opt) => {
          const Icon = GOAL_ICONS[opt]
          const active = value.includes(opt)
          return (
            <motion.button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              whileTap={{ scale: 0.94 }}
              transition={SPRING}
              aria-pressed={active}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-black
                          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/30
                          cursor-pointer
                          ${active
                            ? 'bg-[#B02E7A] text-white shadow-lg'
                            : 'text-[#966988] hover:text-[#B02E7A]'
                          }`}
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              {active && (
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {opt}
            </motion.button>
          )
        })}
      </div>
      <GoalWarning goals={value} />
    </div>
  )
}

/* ════════════════════════════════════════
   SLOT COUNTER — +/- pill counter with keyboard input
   ════════════════════════════════════════ */
function SlotCounter({ value, onChange, max = 99 }: { value: number; onChange: (n: number) => void; max?: number }) {
  const [draft, setDraft] = useState<string | null>(null)
  const [atMax, setAtMax] = useState(false)

  const commit = (raw: string) => {
    const n = parseInt(raw, 10)
    if (!isNaN(n)) {
      const clamped = Math.min(max, Math.max(1, n))
      onChange(clamped)
      if (clamped === max) { setAtMax(true); setTimeout(() => setAtMax(false), 1800) }
    }
    setDraft(null)
  }

  const increment = () => {
    if (value >= max) { setAtMax(true); setTimeout(() => setAtMax(false), 1800); return }
    onChange(Math.min(max, value + 1))
  }

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          transition={SPRING}
          aria-label="Decrease item slots"
          className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#B02E7A] font-black text-base
                     flex items-center justify-center hover:bg-[#B02E7A] hover:text-white
                     transition-colors duration-200 cursor-pointer focus:outline-none
                     focus:ring-2 focus:ring-[#B02E7A]/40 shrink-0"
        >
          −
        </motion.button>
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className="flex-1 h-9 rounded-full bg-[#FFF0F5] flex items-center justify-center shadow-inner"
        >
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={draft ?? value}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
            }}
            aria-label="Item slots"
            className="w-full text-center bg-transparent font-black text-lg text-[#46223e]
                       focus:outline-none caret-[#B02E7A] select-all"
            style={{ fontFamily: 'var(--font-headline)' }}
          />
        </motion.div>
        <motion.button
          type="button"
          onClick={increment}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.88 }}
          transition={SPRING}
          aria-label="Increase item slots"
          className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#B02E7A] font-black text-base
                     flex items-center justify-center hover:bg-[#B02E7A] hover:text-white
                     transition-colors duration-200 cursor-pointer focus:outline-none
                     focus:ring-2 focus:ring-[#B02E7A]/40 shrink-0"
        >
          +
        </motion.button>
      </div>
      {atMax && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={SPRING}
          className="text-center text-[10px] font-bold text-[#B02E7A]"
        >
          Max {max} slots
        </motion.p>
      )}
    </div>
  )
}

/* ════════════════════════════════════════
   MAX COPIES INPUT — draft-state text input inside the Repeat Items card
   ════════════════════════════════════════ */
function MaxCopiesInput({ value, onChange, max }: { value: number | null; onChange: (n: number | null) => void; max: number }) {
  const [draft, setDraft] = useState<string | null>(null)

  const commit = (raw: string) => {
    const n = parseInt(raw, 10)
    if (!isNaN(n) && n >= 1) onChange(Math.min(max, n))
    else if (value !== null) onChange(value) // revert to last valid
    setDraft(null)
  }

  if (value === null) {
    return (
      <div className="w-16 h-8 rounded-full bg-[#FFF0F5] flex items-center justify-center shadow-inner">
        <span className="font-black text-lg text-[#B02E7A]" style={{ fontFamily: 'var(--font-headline)' }}>∞</span>
      </div>
    )
  }

  return (
    <div className="w-16 h-8 rounded-full bg-[#FFF0F5] flex items-center justify-center shadow-inner">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft ?? value}
        onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
        onBlur={(e) => commit(e.target.value)}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
        aria-label="Max copies"
        className="w-full text-center bg-transparent font-black text-base text-[#46223e]
                   focus:outline-none caret-[#B02E7A] select-all"
        style={{ fontFamily: 'var(--font-headline)' }}
      />
    </div>
  )
}

/* ════════════════════════════════════════
   OPTIMIZER CARD — glass boutique card style
   (matches Stitch left/right column cards)
   ════════════════════════════════════════ */
interface OptimizerCardProps {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  title: string
  subtitle: string
  accentColor: string
  children: React.ReactNode
  delay?: number
  shouldReduce: boolean
}
function OptimizerCard({
  icon: Icon, iconColor, iconBg, title, subtitle, accentColor,
  children, delay = 0, shouldReduce,
}: OptimizerCardProps) {
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SPRING, delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-[#ffecf5] rounded-[1.5rem] p-5 relative overflow-hidden group
                 hover:shadow-[0_12px_28px_rgba(176,46,122,0.13)] transition-shadow duration-300"
    >
      {/* Corner accent blob */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-20
                   group-hover:opacity-30 transition-opacity duration-300 group-hover:scale-110"
        style={{ backgroundColor: accentColor, transform: 'scale(1)' }}
      />
      <div className="flex items-center gap-3 relative z-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon style={{ color: iconColor, width: 17, height: 17 }} aria-hidden="true" />
        </div>
        <div>
          <h3
            className="font-black text-base text-[#46223e] leading-tight"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {title}
          </h3>
          <p className="text-xs text-[#784e6c] font-medium">{subtitle}</p>
        </div>
      </div>
      {/* Control slot */}
      <div className="mt-3 relative z-10">{children}</div>
    </motion.div>
  )
}


/* ════════════════════════════════════════
   BOUTIQUE PREVIEW CARD — grayscale → color
   ════════════════════════════════════════ */
function BoutiquePreviewCard({ gradient, icon: Icon, label }: {
  gradient: string; icon: React.ElementType; label: string
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      transition={SPRING}
      className="bg-[#ffd7f0] rounded-[1.25rem] h-40 relative overflow-hidden
                 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer group"
    >
      {/* Gradient bg fill */}
      <div className="absolute inset-0 opacity-60" style={{ background: gradient }} />
      {/* Icon watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25">
        <Icon className="w-20 h-20 text-white" aria-hidden="true" />
      </div>
      {/* Caption pill */}
      <div className="absolute bottom-3 left-3 right-3 bg-white/85 backdrop-blur-md
                      px-4 py-2.5 rounded-xl border border-white/60">
        <div className="h-2 w-10 bg-[#B02E7A]/30 rounded-full mb-1.5" />
        <div className="h-2 w-16 bg-[#fcbcff]/60 rounded-full" />
      </div>
      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-0.5
                      rounded-full text-[10px] font-bold text-[#784e6c] opacity-0
                      group-hover:opacity-100 transition-opacity duration-300">
        {label}
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════
   MAIN OPTIMIZER PAGE
   ════════════════════════════════════════ */
interface Props {
  onSignOut: () => void
  onNavigate: (page: string) => void
}

export default function OptimizerPage({ onSignOut, onNavigate }: Props) {
  const { name: currentUserName } = useCurrentUser()
  /* Optimizer controls */
  const [orderFull, setOrderFull]     = useState(true)
  const [sameHour, setSameHour]       = useState(false)
  const [repeatItems, setRepeatItems] = useState(false)
  const [maxCopies, setMaxCopies]     = useState<number | null>(null) // null = infinite
  const [itemSlots, setItemSlots]     = useState(24)
  const [maxTime, setMaxTime]         = useState(5) // minutes
  const [goals, setGoals]             = useState<Goal[]>(['Revenue'])

  /* ── Optimization progress overlay ── */
  const STEPS = [
    { id: 'load',    label: 'Loading shop data',        detail: 'Fetching inventory & schedule…' },
    { id: 'analyze', label: 'Analyzing your schedule',  detail: 'Mapping available time slots…'  },
    { id: 'run',     label: 'Running optimization',     detail: 'Crunching the numbers…'         },
    { id: 'finalize',label: 'Finalizing results',       detail: 'Building your optimal timeline…'},
  ]
  type OverlayState = 'idle' | 'running' | 'done' | 'error'
  const [overlayState, setOverlayState] = useState<OverlayState>('idle')
  const [overlayError, setOverlayError] = useState('')
  const [stepIdx, setStepIdx] = useState(0)
  const stepTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  /* ── Background-run tracking (dismissed overlay while solver still running) ── */
  const bgRunningRef = useRef(false)  // ref so async closure always sees current value
  const [bgRunning, setBgRunning] = useState(false) // state for button disable / UI

  type Banner = { show: boolean; status: 'success' | 'error'; message: string }
  const [banner, setBanner] = useState<Banner>({ show: false, status: 'success', message: '' })

  const shouldReduce = useReducedMotion() ?? false

  const handleOptimize = async () => {
    if (overlayState !== 'idle' || bgRunning) return

    bgRunningRef.current = false

    // flushSync guarantees the overlay renders before the fetch fires,
    // preventing React 18 from batching the running→idle transition away.
    flushSync(() => {
      setStepIdx(0)
      setOverlayError('')
      setOverlayState('running')
    })

    // Only advance to step 2 ("Running optimization") via timers.
    // Step 3 is set manually once the fetch resolves, so the spinner
    // stays on "Running optimization" for the entire solver duration.
    stepTimers.current.forEach(clearTimeout)
    stepTimers.current = [1, 2].map((i) =>
      setTimeout(() => setStepIdx(i), i * 1100)
    )

    try {
      const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE}/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          order_full_collection: orderFull,
          repeat_items: repeatItems,
          max_copies: repeatItems ? maxCopies : null,
          slots: itemSlots,
          optimization_goal: goals.map((g) => g.toLowerCase()),
          max_time_minutes: maxTime,
        }),
      })

      stepTimers.current.forEach(clearTimeout)

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        const errMsg = body?.detail ?? `Server error (${res.status})`
        if (bgRunningRef.current) {
          bgRunningRef.current = false
          setBgRunning(false)
          setBanner({ show: true, status: 'error', message: errMsg })
        } else {
          setOverlayError(errMsg)
          setOverlayState('error')
        }
        return
      }

      const data = await res.json()
      localStorage.setItem('optimization_results', JSON.stringify(data))
      setStepIdx(3)

      const isEmpty = !data?.results?.length
      stepTimers.current = [setTimeout(() => {
        if (bgRunningRef.current) {
          bgRunningRef.current = false
          setBgRunning(false)
          setBanner({
            show: true,
            status: isEmpty ? 'error' : 'success',
            message: isEmpty
              ? 'Optimization is not feasible — please check your available schedule or input parameters.'
              : 'Optimization complete! Your schedule is ready.',
          })
        } else if (isEmpty) {
          setOverlayState('idle')
          setBanner({
            show: true,
            status: 'error',
            message: 'Optimization is not feasible — please check your available schedule or input parameters.',
          })
        } else {
          setOverlayState('done')
        }
      }, 600)]
    } catch (err) {
      stepTimers.current.forEach(clearTimeout)
      const errMsg = 'Could not reach the server. Is the backend running?'
      if (bgRunningRef.current) {
        bgRunningRef.current = false
        setBgRunning(false)
        setBanner({ show: true, status: 'error', message: errMsg })
      } else {
        setOverlayError(errMsg)
        setOverlayState('error')
      }
    }
  }

  const handleDismissOverlay = () => {
    if (overlayState === 'running') {
      bgRunningRef.current = true
      setBgRunning(true)
    }
    setOverlayState('idle')
  }

  // Clamp maxCopies when itemSlots shrinks below it (∞ is exempt)
  useEffect(() => {
    if (maxCopies !== null && maxCopies > itemSlots) setMaxCopies(itemSlots)
  }, [itemSlots, maxCopies])

  // Cleanup on unmount
  useEffect(() => () => { stepTimers.current.forEach(clearTimeout) }, [])

  const handleToggle = (setter: (v: boolean) => void) => (v: boolean) => setter(v)

  const navLinks       = ['Home', 'Schedule', 'Optimizer', 'Results']
  const mobileNavIcons = [Home, Calendar, Settings, BarChart2]

  return (
    <div className="min-h-screen bg-[#FFF5F8] overflow-x-hidden">

      {/* ══════════════════════════════
          NAVIGATION — backdrop-blur-xl
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
              <img src="/fashstopt_logo.png" alt="FashStOpt" className="w-9 h-9 rounded-xl object-cover" />
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
                    link === 'Home'     ? (e) => { e.preventDefault(); onNavigate('dashboard') } :
                    link === 'Schedule' ? (e) => { e.preventDefault(); onNavigate('scheduler') } :
                    link === 'Results'  ? (e) => { e.preventDefault(); onNavigate('results') }   :
                    (e) => e.preventDefault()
                  }
                  className={`text-sm font-bold tracking-tight transition-all duration-150 focus:outline-none
                    focus:ring-2 focus:ring-[#B02E7A]/40 rounded px-1 py-0.5
                    ${i === 2
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

      {/* ── BACKGROUND-RUN BANNER ── */}
      {banner.show && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] w-full max-w-lg px-4`}
        >
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border
            ${banner.status === 'success'
              ? 'bg-[#edfff9] border-[#56f1e0] text-[#00675f]'
              : 'bg-[#fff0f4] border-[#f74b6d]/30 text-[#b41340]'
            }`}
          >
            {banner.status === 'success'
              ? <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
              : <span className="text-base shrink-0" aria-hidden="true">⚠️</span>
            }
            <p className="flex-1 text-sm font-bold">{banner.message}</p>
            {banner.status === 'success' && (
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={SPRING}
                onClick={() => { setBanner(b => ({ ...b, show: false })); onNavigate('results') }}
                className="text-xs font-black bg-[#00675f] text-white px-3 py-1.5
                           rounded-full shrink-0 cursor-pointer"
              >
                View Results
              </motion.button>
            )}
            <button
              onClick={() => setBanner(b => ({ ...b, show: false }))}
              className="text-current opacity-60 hover:opacity-100 transition-opacity
                         cursor-pointer shrink-0 focus:outline-none"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-20">

        {/* ── HERO HEADER (Stitch-matched) ── */}
        <div className="relative mb-8 overflow-visible">
          {/* Decorative blobs matching Stitch design */}
          <div aria-hidden="true" className="absolute -top-6 -left-6 w-28 h-28 bg-[#56f1e0]/30 rounded-full blur-2xl pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#fcbcff]/30 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.05 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* "Optimization Suite" badge — bubblegum pill */}
            <div
              className="flex items-center gap-2 bg-[#fcbcff] text-[#7c0091] px-4 py-1.5
                          rounded-full text-xs font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              <Zap className="w-3 h-3" aria-hidden="true" />
              Optimization Suite
            </div>

            <h1
              className="text-4xl md:text-5xl font-black text-[#46223e] leading-tight
                         tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Refine Your Shop
            </h1>
            <p className="text-[#784e6c] max-w-md font-medium text-sm leading-relaxed">
              Fine-tune your boutique's performance with precision item sorting
              and goal-driven metrics.
            </p>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════
            OPTIMIZER SECTIONS
            Golden ratio spacing: py-5 rows, space-y-8 cards
            ══════════════════════════════════════ */}
        <div className="space-y-5">

          {/* ── ALL OPTIONS — flat 3-col grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Order Full Collection */}
              <OptimizerCard
                icon={Layers}
                iconColor="#B02E7A"
                iconBg="#ffdff2"
                title="Order Full Collection"
                subtitle="Sync all sets together"
                accentColor="#ff6cb5"
                delay={0.1}
                shouldReduce={shouldReduce}
              >
                <div className="flex justify-end">
                  <BouncyToggle
                    id="toggle-order-full"
                    label="Toggle order full collection"
                    checked={orderFull}
                    onChange={handleToggle(setOrderFull)}
                  />
                </div>

                {orderFull && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-[#784e6c]">Same Hour</span>
                      <span className="text-[10px] font-semibold text-[#b48aaa]">Order all items at the same time slot</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-black uppercase tracking-wide
                                       bg-amber-100 text-amber-600 border border-amber-200
                                       px-2 py-0.5 rounded-full">
                        Coming soon
                      </span>
                      <BouncyToggle
                        id="toggle-same-hour"
                        label="Toggle same hour ordering"
                        checked={sameHour}
                        onChange={(v) => { if (v) setSameHour(false) }}
                      />
                    </div>
                  </motion.div>
                )}
              </OptimizerCard>

              {/* Repeat Items */}
              <OptimizerCard
                icon={RefreshCw}
                iconColor="#00675f"
                iconBg="#edfff9"
                title="Repeat Items"
                subtitle="Allow multiple copies"
                accentColor="#56f1e0"
                delay={0.15}
                shouldReduce={shouldReduce}
              >
                <div className="flex justify-end">
                  <BouncyToggle
                    id="toggle-repeat"
                    label="Toggle repeat items"
                    checked={repeatItems}
                    onChange={(v) => {
                      setRepeatItems(v)
                      if (!v) setMaxCopies(null)
                    }}
                  />
                </div>

                {/* Max copies inline counter — only when repeat is on */}
                {repeatItems && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#784e6c] shrink-0">Max copies</span>
                      <div className="flex items-center gap-2">
                        {/* Decrease / remove limit */}
                        <motion.button
                          type="button"
                          onClick={() => setMaxCopies((c) => c === null ? null : Math.max(1, c - 1))}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          transition={SPRING}
                          disabled={maxCopies === null}
                          className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#B02E7A] font-black text-base
                                     flex items-center justify-center hover:bg-[#B02E7A] hover:text-white
                                     transition-colors duration-150 cursor-pointer focus:outline-none
                                     focus:ring-2 focus:ring-[#B02E7A]/40 disabled:opacity-30 disabled:cursor-default shrink-0"
                        >
                          −
                        </motion.button>

                        {/* Input or ∞ display */}
                        <MaxCopiesInput value={maxCopies} onChange={setMaxCopies} max={itemSlots} />

                        <motion.button
                          type="button"
                          onClick={() => setMaxCopies((c) => c === null ? 2 : Math.min(itemSlots, c + 1))}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.88 }}
                          transition={SPRING}
                          className="w-8 h-8 rounded-full bg-[#FFF0F5] text-[#B02E7A] font-black text-base
                                     flex items-center justify-center hover:bg-[#B02E7A] hover:text-white
                                     transition-colors duration-150 cursor-pointer focus:outline-none
                                     focus:ring-2 focus:ring-[#B02E7A]/40 shrink-0"
                        >
                          +
                        </motion.button>

                        {/* Reset to ∞ */}
                        {maxCopies !== null && (
                          <motion.button
                            type="button"
                            onClick={() => setMaxCopies(null)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={SPRING}
                            title="Set to unlimited"
                            className="text-[10px] font-black text-[#00675f] bg-[#edfff9]
                                       px-2 py-1 rounded-full hover:bg-[#56f1e0]/30
                                       transition-colors duration-150 cursor-pointer shrink-0"
                          >
                            ∞
                          </motion.button>
                        )}
                      </div>
                    </div>
                    {maxCopies !== null && (
                      <p className="text-[10px] font-semibold text-[#b48aaa] text-right">
                        Limited to {itemSlots} item slots if specific number set
                      </p>
                    )}
                  </motion.div>
                )}
              </OptimizerCard>

              {/* Item Slots */}
              <OptimizerCard
                icon={LayoutGrid}
                iconColor="#9720ab"
                iconBg="#f3e8ff"
                title="Item Slots"
                subtitle="Max display capacity"
                accentColor="#fcbcff"
                delay={0.18}
                shouldReduce={shouldReduce}
              >
                <SlotCounter
                  value={itemSlots}
                  onChange={setItemSlots}
                  max={50}
                />
              </OptimizerCard>

              {/* Optimization Goal */}
              <OptimizerCard
                icon={Target}
                iconColor="#B02E7A"
                iconBg="#ffdff2"
                title="Optimization Goal"
                subtitle="What matters most today?"
                accentColor="#ff6cb5"
                delay={0.22}
                shouldReduce={shouldReduce}
              >
                <SegmentedControl
                  value={goals}
                  onChange={setGoals}
                />
              </OptimizerCard>

              {/* Max Solve Time */}
              <OptimizerCard
                icon={Clock}
                iconColor="#9720ab"
                iconBg="#f3e8ff"
                title="Max Solve Time"
                subtitle="Stop solver after this many minutes"
                accentColor="#fcbcff"
                delay={0.26}
                shouldReduce={shouldReduce}
              >
                <SlotCounter
                  value={maxTime}
                  onChange={(n) => setMaxTime(Math.max(1, Math.min(60, n)))}
                />
                <p className="text-center text-xs text-[#966988] font-medium mt-2">minutes</p>
              </OptimizerCard>
            </div>

          {/* ── BIG OPTIMIZE NOW CTA ── */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.25 }}
            className="relative text-center py-4"
          >
            {/* Glow bloom */}
            <div aria-hidden="true"
                 className="absolute inset-0 bg-[#B02E7A]/15 blur-3xl rounded-full scale-y-50 pointer-events-none" />

            <div className="relative inline-block">
              <ShimmerButton onClick={handleOptimize} disabled={overlayState !== 'idle' || bgRunning} size="hero">
                <>
                  <Zap className="w-7 h-7" aria-hidden="true" />
                  Optimize Now!
                </>
              </ShimmerButton>

              {/* Bouncing sparkle badge — top-right, per Stitch design */}
              <motion.div
                animate={shouldReduce ? {} : { y: [0, -6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
                className="absolute -top-2 -right-2 w-8 h-8 bg-[#56f1e0] rounded-full
                           border-4 border-[#FFF5F8] flex items-center justify-center
                           shadow-[0_4px_12px_rgba(86,241,224,0.40)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00675f]" />
              </motion.div>
            </div>

          </motion.div>

        </div>

        <div className="h-16" />
      </main>

      {/* ── FOOTER ── */}
      <AppFooter />

      {/* ══════════════════════════════
          OPTIMIZATION PROGRESS OVERLAY
          ══════════════════════════════ */}
      {overlayState !== 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6
                     bg-[#46223e]/40 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-label="Optimization in progress"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            className="bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 w-full max-w-md
                       border border-[#ffd7f0]"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-8">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0
                ${overlayState === 'error' ? 'bg-[#fff0f4]' : 'bg-[#ffdff2]'}`}>
                {overlayState === 'done'    && <CheckCircle2 className="w-6 h-6 text-[#00675f]" aria-hidden="true" />}
                {overlayState === 'error'   && <span className="text-lg" aria-hidden="true">⚠️</span>}
                {overlayState === 'running' && <Loader2 className="w-6 h-6 text-[#B02E7A] animate-spin" aria-hidden="true" />}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-black text-lg text-[#46223e]"
                    style={{ fontFamily: 'var(--font-headline)' }}>
                  {overlayState === 'done'  ? 'Optimization Complete!' :
                   overlayState === 'error' ? 'Something went wrong' :
                   'Optimizing Your Shop'}
                </h2>
                <p className="text-xs text-[#784e6c] font-medium">
                  {overlayState === 'done'  ? 'Your optimal timeline is ready.' :
                   overlayState === 'error' ? overlayError :
                   STEPS[stepIdx]?.detail}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} transition={SPRING}
                onClick={handleDismissOverlay}
                aria-label="Close"
                className="w-8 h-8 rounded-full bg-[#FFF0F5] flex items-center justify-center
                           text-[#784e6c] hover:bg-[#ffdff2] hover:text-[#B02E7A]
                           transition-colors duration-150 cursor-pointer shrink-0
                           focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/30"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </motion.button>
            </div>

            {/* Progress bar — hidden on error */}
            {overlayState !== 'error' && (
              <div className="h-2.5 bg-[#ffd7f0] rounded-full overflow-hidden mb-6">
                <motion.div
                  className="h-full bubblegum-gradient rounded-full"
                  animate={{
                    width: overlayState === 'done'
                      ? '100%'
                      : `${((stepIdx + 1) / STEPS.length) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            )}

            {/* Steps list — hidden on error */}
            {overlayState !== 'error' && (
              <ol className="space-y-3 mb-8">
                {STEPS.map((step, i) => {
                  const isDone   = overlayState === 'done' || i < stepIdx
                  const isActive = overlayState === 'running' && i === stepIdx
                  return (
                    <li key={step.id} className="flex items-center gap-3">
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#00675f] shrink-0" aria-hidden="true" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-[#B02E7A] animate-spin shrink-0" aria-hidden="true" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#d09ec0] shrink-0" aria-hidden="true" />
                      )}
                      <span className={`text-sm font-bold transition-colors duration-300
                        ${isDone ? 'text-[#00675f]' : isActive ? 'text-[#B02E7A]' : 'text-[#d09ec0]'}`}>
                        {step.label}
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}

            {/* CTA — done state */}
            {overlayState === 'done' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={SPRING}
                  onClick={() => { setOverlayState('idle'); onNavigate('results') }}
                  className="w-full bubblegum-gradient text-white py-4 rounded-full font-black
                             text-base shadow-[0_12px_28px_rgba(168,33,110,0.30)] cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/50 mb-3
                             flex items-center justify-center gap-2"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  <BarChart2 className="w-5 h-5" aria-hidden="true" />
                  View Results
                </motion.button>
                <button
                  onClick={() => setOverlayState('idle')}
                  className="w-full text-sm text-[#784e6c] font-medium py-2 hover:text-[#B02E7A]
                             transition-colors duration-150 cursor-pointer focus:outline-none"
                >
                  Stay here
                </button>
              </motion.div>
            )}

            {/* CTA — error state */}
            {overlayState === 'error' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setOverlayState('idle')}
                className="w-full mt-4 bg-[#fff0f4] text-[#b41340] border border-[#f74b6d]/20
                           py-3.5 rounded-full font-black text-sm cursor-pointer
                           focus:outline-none focus:ring-2 focus:ring-[#b41340]/30"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                Dismiss
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* ══════════════════════════════
          MOBILE BOTTOM NAV — floating pill
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
                navLinks[i] === 'Home'     ? () => onNavigate('dashboard') :
                navLinks[i] === 'Schedule' ? () => onNavigate('scheduler') :
                navLinks[i] === 'Results'  ? () => onNavigate('results')   :
                undefined
              }
              className={`p-1 cursor-pointer focus:outline-none focus:ring-2
                          focus:ring-[#B02E7A]/40 rounded-full transition-colors duration-150
                          ${i === 2 ? 'text-[#B02E7A]' : 'text-[#d09ec0] hover:text-[#B02E7A]'}`}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
