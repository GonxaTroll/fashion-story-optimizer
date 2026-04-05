import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Sparkles, User,
  Bell, Moon, Heart, Lock, LogOut, Check,
  Eye, EyeOff, ChevronDown,
  Layers, RefreshCw, LayoutGrid, Target,
  Zap, TrendingUp, Gem, Star,
  Home, Calendar, Settings, BarChart2,
} from 'lucide-react'

/* ─────────────────────────────────────────────────────
   Spring constants (stiffness: 300, damping: 30 per spec)
   ───────────────────────────────────────────────────── */
const SPRING      = { type: 'spring', stiffness: 300, damping: 30 } as const
const SPRING_FAST = { type: 'spring', stiffness: 400, damping: 28 } as const

/* ─────────────────────────────────────────────────────
   Hook: "Saved ✓" flash
   ───────────────────────────────────────────────────── */
function useSaved(duration = 2000) {
  const [saved, setSaved] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const trigger = useCallback(() => {
    setSaved(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSaved(false), duration)
  }, [duration])
  useEffect(() => () => clearTimeout(timer.current), [])
  return { saved, trigger }
}

/* ════════════════════════════════════════
   SAVED BADGE — fades in/out elegantly
   ════════════════════════════════════════ */
function SavedBadge({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, y: 4, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.85 }}
          transition={SPRING}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#00675f]
                     bg-[#edfff9] rounded-full px-2.5 py-1 shrink-0"
        >
          <Check className="w-3 h-3" aria-hidden="true" />
          Saved
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/* ════════════════════════════════════════
   BOUNCY TOGGLE — spring thumb + soft glow
   ════════════════════════════════════════ */
interface ToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  id: string
  label: string
}
function BouncyToggle({ checked, onChange, id, label }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-14 h-8 rounded-full transition-colors duration-200
                  cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40
                  focus:ring-offset-2 shrink-0
                  ${checked ? 'bg-[#B02E7A]' : 'bg-[#ffd7f0]'}`}
      style={
        checked
          ? { boxShadow: '0 0 16px rgba(176,46,122,0.40), 0 2px 10px rgba(176,46,122,0.22)' }
          : undefined
      }
    >
      <motion.div
        animate={{ x: checked ? 22 : 0 }}
        transition={SPRING}
        className="absolute top-[4px] left-[4px] w-6 h-6 bg-white rounded-full shadow-md"
      />
    </button>
  )
}

/* ════════════════════════════════════════
   PLAYFUL INPUT — soft pink, no border, magenta focus ring
   ════════════════════════════════════════ */
interface InputProps {
  id: string
  label: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  type?: string
  multiline?: boolean
  rightSlot?: React.ReactNode
  onBlur?: () => void
}
function PlayfulInput({
  id, label, placeholder, value, onChange,
  type = 'text', multiline = false, rightSlot, onBlur,
}: InputProps) {
  const shared =
    `w-full bg-[#FFF0F5] border-2 border-transparent rounded-2xl px-5 py-3.5
     text-[#46223e] placeholder:text-[#d09ec0] focus:outline-none
     focus:border-[#B02E7A]/30 transition-all duration-150 text-sm resize-none`
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-[#784e6c] ml-1">
        {label}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea
            id={id} rows={3} placeholder={placeholder} value={value}
            onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
            className={shared}
          />
        ) : (
          <input
            id={id} type={type} placeholder={placeholder} value={value}
            onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
            className={`${shared} ${rightSlot ? 'pr-12' : ''}`}
          />
        )}
        {rightSlot && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   SHIMMER BUTTON — 21st.dev Shiny style
   ════════════════════════════════════════ */
interface ShimmerBtnProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
  className?: string
  size?: 'normal' | 'hero'
}
function ShimmerButton({ children, onClick, disabled = false, danger = false, className = '', size = 'normal' }: ShimmerBtnProps) {
  const sizeClass = size === 'hero'
    ? 'text-2xl py-6 px-12'
    : 'text-sm py-3 px-8'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={SPRING_FAST}
      className={`relative overflow-hidden rounded-full font-black cursor-pointer
                  disabled:opacity-60 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${sizeClass}
                  ${danger
                    ? 'bg-[#fff0f4] text-[#b41340] hover:bg-[#ffe0e8] focus:ring-[#b41340]/40 border border-[#f74b6d]/20'
                    : 'bubblegum-gradient text-white shadow-[0_20px_40px_rgba(168,33,110,0.30)] focus:ring-[#B02E7A]/50'
                  }
                  ${className}`}
      style={{ fontFamily: 'var(--font-headline)' }}
    >
      {/* Shimmer sweep overlay */}
      {!disabled && !danger && (
        <motion.span
          aria-hidden="true"
          initial={{ x: '-110%' }}
          animate={{ x: '110%' }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut', repeatDelay: 1.6 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.40) 50%, transparent 90%)',
            width: '60%',
          }}
        />
      )}
      <span className="relative flex items-center justify-center gap-2.5">{children}</span>
    </motion.button>
  )
}

/* ════════════════════════════════════════
   SEGMENTED CONTROL — Revenue / XP / Gems
   ════════════════════════════════════════ */
type Goal = 'Revenue' | 'XP' | 'Gems'
const GOAL_ICONS: Record<Goal, React.ElementType> = {
  Revenue: TrendingUp,
  XP:      Star,
  Gems:    Gem,
}
function SegmentedControl({ value, onChange }: { value: Goal; onChange: (g: Goal) => void }) {
  const options: Goal[] = ['Revenue', 'XP', 'Gems']
  return (
    <div className="flex p-1.5 bg-[#ffd7f0] rounded-full gap-1">
      {options.map((opt) => {
        const Icon = GOAL_ICONS[opt]
        const active = value === opt
        return (
          <motion.button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
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
              <motion.div layoutId="seg-indicator" transition={SPRING} className="contents">
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              </motion.div>
            )}
            {opt}
          </motion.button>
        )
      })}
    </div>
  )
}

/* ════════════════════════════════════════
   SLOT COUNTER — +/- pill counter
   ════════════════════════════════════════ */
function SlotCounter({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-3 mt-1">
      <motion.button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        transition={SPRING}
        aria-label="Decrease item slots"
        className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#B02E7A] font-black text-xl
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
        className="flex-1 h-12 rounded-full bg-[#FFF0F5] flex items-center justify-center
                   font-black text-2xl text-[#46223e] shadow-inner"
        style={{ fontFamily: 'var(--font-headline)' }}
      >
        {value}
      </motion.div>
      <motion.button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        transition={SPRING}
        aria-label="Increase item slots"
        className="w-12 h-12 rounded-full bg-[#FFF0F5] text-[#B02E7A] font-black text-xl
                   flex items-center justify-center hover:bg-[#B02E7A] hover:text-white
                   transition-colors duration-200 cursor-pointer focus:outline-none
                   focus:ring-2 focus:ring-[#B02E7A]/40 shrink-0"
      >
        +
      </motion.button>
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
  saved?: boolean
  shouldReduce: boolean
}
function OptimizerCard({
  icon: Icon, iconColor, iconBg, title, subtitle, accentColor,
  children, delay = 0, saved = false, shouldReduce,
}: OptimizerCardProps) {
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SPRING, delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-[#ffecf5] rounded-[1.5rem] p-8 relative overflow-hidden group
                 hover:shadow-[0_16px_40px_rgba(176,46,122,0.13)] transition-shadow duration-300"
    >
      {/* Corner accent blob */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-20
                   group-hover:opacity-30 transition-opacity duration-300 group-hover:scale-110"
        style={{ backgroundColor: accentColor, transform: 'scale(1)' }}
      />
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon className="w-5.5 h-5.5" style={{ color: iconColor, width: 22, height: 22 }} aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="font-black text-lg text-[#46223e]"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                {title}
              </h3>
              <SavedBadge visible={saved} />
            </div>
            <p className="text-sm text-[#784e6c] font-medium">{subtitle}</p>
          </div>
        </div>
      </div>
      {/* Control slot */}
      <div className="mt-5 relative z-10">{children}</div>
    </motion.div>
  )
}

/* ════════════════════════════════════════
   SECTION CARD — white card with header
   ════════════════════════════════════════ */
interface SectionProps {
  title: string
  icon: React.ElementType
  iconColor: string
  children: React.ReactNode
  delay?: number
  shouldReduce: boolean
}
function SectionCard({ title, icon: Icon, iconColor, children, delay = 0, shouldReduce }: SectionProps) {
  return (
    <motion.section
      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...SPRING, delay }}
    >
      <div className="bg-white rounded-[1.5rem] shadow-[0_8px_28px_rgba(176,46,122,0.07)] overflow-hidden">
        <div className="flex items-center gap-3 px-8 pt-7 pb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${iconColor}18` }}>
            <Icon className="w-4 h-4" style={{ color: iconColor }} aria-hidden="true" />
          </div>
          <h2
            className="text-xs font-black uppercase tracking-[0.12em] text-[#784e6c]"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {title}
          </h2>
        </div>
        <div className="px-8 pb-6">{children}</div>
      </div>
    </motion.section>
  )
}

/* ════════════════════════════════════════
   SETTING ROW — icon + text + control
   Golden Ratio padding: py-5 = 20px
   ════════════════════════════════════════ */
interface SettingRowProps {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  title: string
  subtitle?: string
  control: React.ReactNode
  saved?: boolean
  last?: boolean
}
function SettingRow({ icon: Icon, iconColor, iconBg, title, subtitle, control, saved = false, last = false }: SettingRowProps) {
  return (
    <div className={`flex items-center justify-between gap-4 py-5 ${last ? '' : 'border-b border-[#ffecf5]'}`}>
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#46223e]" style={{ fontFamily: 'var(--font-headline)' }}>{title}</p>
            <SavedBadge visible={saved} />
          </div>
          {subtitle && <p className="text-xs text-[#966988] font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
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
  /* Optimizer controls */
  const [orderFull, setOrderFull]   = useState(true)
  const [repeatItems, setRepeatItems] = useState(false)
  const [itemSlots, setItemSlots]   = useState(24)
  const [goal, setGoal]             = useState<Goal>('Revenue')
  const orderSaved  = useSaved()
  const repeatSaved = useSaved()
  const slotSaved   = useSaved()
  const goalSaved   = useSaved()
  const [optimizing, setOptimizing] = useState(false)
  const optimizeSaved = useSaved()

  /* Profile */
  const [name, setName]               = useState('Admin')
  const [boutiqueName, setBoutiqueName] = useState('Glimmer HQ')
  const [bio, setBio]                  = useState('')
  const [saving, setSaving]            = useState(false)
  const profileSaved                   = useSaved()

  /* Preferences */
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode]           = useState(false)
  const [stayPlayful, setStayPlayful]     = useState(true)
  const notifSaved = useSaved()
  const darkSaved  = useSaved()
  const playSaved  = useSaved()

  /* Account */
  const [pwOpen, setPwOpen]           = useState(false)
  const [currentPw, setCurrentPw]     = useState('')
  const [newPw, setNewPw]             = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [pwSaving, setPwSaving]       = useState(false)
  const pwSaved = useSaved()

  const shouldReduce = useReducedMotion() ?? false

  const handleOptimize = () => {
    if (optimizing) return
    setOptimizing(true)
    setTimeout(() => { setOptimizing(false); optimizeSaved.trigger() }, 1600)
  }

  const handleUpdateProfile = () => {
    if (saving) return
    setSaving(true)
    setTimeout(() => { setSaving(false); profileSaved.trigger() }, 1300)
  }

  const handleSavePw = () => {
    if (!currentPw || !newPw || pwSaving) return
    setPwSaving(true)
    setTimeout(() => {
      setPwSaving(false); setCurrentPw(''); setNewPw(''); setPwOpen(false); pwSaved.trigger()
    }, 1200)
  }

  const handleToggle = (
    setter: (v: boolean) => void,
    savedHook: ReturnType<typeof useSaved>,
  ) => (v: boolean) => { setter(v); savedHook.trigger() }

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
                    link === 'Home'     ? (e) => { e.preventDefault(); onNavigate('dashboard') } :
                    link === 'Schedule' ? (e) => { e.preventDefault(); onNavigate('scheduler') } :
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
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#784e6c] bg-[#ffecf5] rounded-xl px-3 py-1.5">
                <User className="w-3.5 h-3.5 text-[#B02E7A]" aria-hidden="true" />
                Admin
              </div>
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

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-28">

        {/* ── HERO HEADER (Stitch-matched) ── */}
        <div className="relative mb-14 overflow-visible">
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
        <div className="space-y-8">

          {/* ── SECTION 1: SHOP BEHAVIOR — 2-col toggle grid ── */}
          <div>
            <motion.p
              initial={shouldReduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="text-xs font-black uppercase tracking-[0.14em] text-[#966988] mb-4 ml-1"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Shop Behavior
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Order Full Collection */}
              <OptimizerCard
                icon={Layers}
                iconColor="#B02E7A"
                iconBg="#ffdff2"
                title="Order Full Collection"
                subtitle="Sync all sets together"
                accentColor="#ff6cb5"
                saved={orderSaved.saved}
                delay={0.1}
                shouldReduce={shouldReduce}
              >
                <div className="flex justify-end">
                  <BouncyToggle
                    id="toggle-order-full"
                    label="Toggle order full collection"
                    checked={orderFull}
                    onChange={handleToggle(setOrderFull, orderSaved)}
                  />
                </div>
              </OptimizerCard>

              {/* Repeat Items */}
              <OptimizerCard
                icon={RefreshCw}
                iconColor="#00675f"
                iconBg="#edfff9"
                title="Repeat Items"
                subtitle="Allow multiple copies"
                accentColor="#56f1e0"
                saved={repeatSaved.saved}
                delay={0.15}
                shouldReduce={shouldReduce}
              >
                <div className="flex justify-end">
                  <BouncyToggle
                    id="toggle-repeat"
                    label="Toggle repeat items"
                    checked={repeatItems}
                    onChange={handleToggle(setRepeatItems, repeatSaved)}
                  />
                </div>
              </OptimizerCard>
            </div>
          </div>

          {/* ── SECTION 2: CAPACITY & GOALS — 2-col grid ── */}
          <div>
            <motion.p
              initial={shouldReduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xs font-black uppercase tracking-[0.14em] text-[#966988] mb-4 ml-1"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Capacity &amp; Goals
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Item Slots */}
              <OptimizerCard
                icon={LayoutGrid}
                iconColor="#9720ab"
                iconBg="#f3e8ff"
                title="Item Slots"
                subtitle="Max display capacity"
                accentColor="#fcbcff"
                saved={slotSaved.saved}
                delay={0.18}
                shouldReduce={shouldReduce}
              >
                <SlotCounter
                  value={itemSlots}
                  onChange={(n) => { setItemSlots(n); slotSaved.trigger() }}
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
                saved={goalSaved.saved}
                delay={0.22}
                shouldReduce={shouldReduce}
              >
                <SegmentedControl
                  value={goal}
                  onChange={(g) => { setGoal(g); goalSaved.trigger() }}
                />
              </OptimizerCard>
            </div>
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
              <ShimmerButton onClick={handleOptimize} disabled={optimizing} size="hero">
                {optimizing ? (
                  <>
                    <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Optimizing…
                  </>
                ) : (
                  <>
                    <Zap className="w-7 h-7" aria-hidden="true" />
                    Optimize Now!
                  </>
                )}
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

            <div className="mt-5 flex items-center justify-center gap-3">
              <p className="text-sm text-[#784e6c] italic font-medium">
                Estimated improvement:{' '}
                <span className="text-[#00675f] font-black not-italic">+18% Efficiency</span>
              </p>
              <SavedBadge visible={optimizeSaved.saved} />
            </div>
          </motion.div>

          {/* ── PROFILE SECTION ── */}
          <SectionCard title="Profile" icon={User} iconColor="#B02E7A" delay={0.28} shouldReduce={shouldReduce}>
            {/* Avatar row */}
            <div className="flex items-center gap-5 py-5 border-b border-[#ffecf5]">
              <div className="relative">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center
                             text-white text-xl font-black shadow-[0_6px_18px_rgba(176,46,122,0.20)]"
                  style={{
                    background: 'linear-gradient(135deg, #a8216e 0%, #ff6cb5 100%)',
                    fontFamily: 'var(--font-headline)',
                  }}
                  aria-label={`Avatar for ${name}`}
                >
                  {name.charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  aria-label="Change avatar"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#B02E7A] rounded-full
                             flex items-center justify-center border-2 border-white cursor-pointer
                             hover:bg-[#980f61] transition-colors duration-150 focus:outline-none
                             focus:ring-2 focus:ring-[#B02E7A]/50"
                >
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>
              <div>
                <p className="text-sm font-black text-[#46223e]" style={{ fontFamily: 'var(--font-headline)' }}>
                  {name || 'Admin'}
                </p>
                <p className="text-xs text-[#966988] font-medium">Boutique Owner · Admin</p>
              </div>
            </div>

            <div className="py-5 border-b border-[#ffecf5]">
              <PlayfulInput id="profile-name" label="Display Name" placeholder="Your name" value={name} onChange={setName} />
            </div>
            <div className="py-5 border-b border-[#ffecf5]">
              <PlayfulInput id="boutique-name" label="Boutique Name" placeholder="e.g. Glimmer HQ" value={boutiqueName} onChange={setBoutiqueName} />
            </div>
            <div className="py-5 border-b border-[#ffecf5]">
              <PlayfulInput id="bio" label="Bio" placeholder="Tell the fashion world about you…" value={bio} onChange={setBio} multiline />
            </div>

            <div className="pt-5 flex items-center gap-4">
              <ShimmerButton onClick={handleUpdateProfile} disabled={saving}>
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Saving…
                  </>
                ) : 'Update Profile'}
              </ShimmerButton>
              <SavedBadge visible={profileSaved.saved} />
            </div>
          </SectionCard>

          {/* ── PREFERENCES SECTION ── */}
          <SectionCard title="Preferences" icon={Bell} iconColor="#9720ab" delay={0.32} shouldReduce={shouldReduce}>
            <SettingRow
              icon={Bell} iconColor="#9720ab" iconBg="#f3e8ff"
              title="Notifications" subtitle="Game updates, tips & weekly recaps"
              saved={notifSaved.saved}
              control={
                <BouncyToggle id="toggle-notif" label="Toggle notifications"
                  checked={notifications} onChange={handleToggle(setNotifications, notifSaved)} />
              }
            />
            <SettingRow
              icon={Moon} iconColor="#784e6c" iconBg="#ffdff2"
              title="Light Mode" subtitle="Currently using Blush theme"
              saved={darkSaved.saved}
              control={
                <BouncyToggle id="toggle-dark" label="Toggle light mode"
                  checked={!darkMode} onChange={(v) => handleToggle(setDarkMode, darkSaved)(!v)} />
              }
            />
            <SettingRow
              icon={Heart} iconColor="#B02E7A" iconBg="#ffdff2"
              title="Stay Playful" subtitle="Remember your session automatically"
              saved={playSaved.saved}
              last
              control={
                <BouncyToggle id="toggle-play" label="Toggle stay playful"
                  checked={stayPlayful} onChange={handleToggle(setStayPlayful, playSaved)} />
              }
            />
          </SectionCard>

          {/* ── ACCOUNT SECTION ── */}
          <SectionCard title="Account" icon={Lock} iconColor="#46223e" delay={0.36} shouldReduce={shouldReduce}>
            {/* Change Password — expandable */}
            <div>
              <button
                type="button"
                onClick={() => setPwOpen((v) => !v)}
                className="w-full flex items-center justify-between py-5 border-b border-[#ffecf5]
                           cursor-pointer focus:outline-none group"
                aria-expanded={pwOpen}
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#ffecf5] flex items-center justify-center">
                    <Lock className="w-5 h-5 text-[#46223e]" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-[#46223e]" style={{ fontFamily: 'var(--font-headline)' }}>
                        Change Password
                      </p>
                      <SavedBadge visible={pwSaved.saved} />
                    </div>
                    <p className="text-xs text-[#966988] font-medium">Update your login credentials</p>
                  </div>
                </div>
                <motion.div animate={{ rotate: pwOpen ? 180 : 0 }} transition={SPRING}>
                  <ChevronDown className="w-5 h-5 text-[#966988] group-hover:text-[#B02E7A] transition-colors" aria-hidden="true" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {pwOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={SPRING}
                    className="overflow-hidden"
                  >
                    <div className="pt-5 pb-2 space-y-4">
                      <PlayfulInput
                        id="current-pw" label="Current Password"
                        type={showCurrent ? 'text' : 'password'} placeholder="••••••••"
                        value={currentPw} onChange={setCurrentPw}
                        rightSlot={
                          <button type="button" aria-label={showCurrent ? 'Hide' : 'Show'}
                            onClick={() => setShowCurrent((v) => !v)}
                            className="text-[#966988] hover:text-[#B02E7A] transition-colors cursor-pointer focus:outline-none">
                            {showCurrent ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                          </button>
                        }
                      />
                      <PlayfulInput
                        id="new-pw" label="New Password"
                        type={showNew ? 'text' : 'password'} placeholder="••••••••"
                        value={newPw} onChange={setNewPw}
                        rightSlot={
                          <button type="button" aria-label={showNew ? 'Hide' : 'Show'}
                            onClick={() => setShowNew((v) => !v)}
                            className="text-[#966988] hover:text-[#B02E7A] transition-colors cursor-pointer focus:outline-none">
                            {showNew ? <EyeOff className="w-4 h-4" aria-hidden="true" /> : <Eye className="w-4 h-4" aria-hidden="true" />}
                          </button>
                        }
                      />
                      <div className="flex items-center gap-3 pt-1">
                        <ShimmerButton onClick={handleSavePw} disabled={!currentPw || !newPw || pwSaving}>
                          {pwSaving ? 'Saving…' : 'Save Password'}
                        </ShimmerButton>
                        <button type="button"
                          onClick={() => { setPwOpen(false); setCurrentPw(''); setNewPw('') }}
                          className="text-xs font-bold text-[#966988] hover:text-[#46223e] transition-colors
                                     duration-150 cursor-pointer px-3 py-2 focus:outline-none
                                     focus:ring-1 focus:ring-[#966988] rounded-lg">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <SettingRow
              icon={LogOut} iconColor="#b41340" iconBg="#fff0f4"
              title="Sign Out" subtitle="End your current session"
              last
              control={<ShimmerButton danger onClick={onSignOut}>Sign Out</ShimmerButton>}
            />
          </SectionCard>

          {/* ── VISUAL ANCHOR: Boutique preview cards ── */}
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#966988] mb-4 ml-1"
               style={{ fontFamily: 'var(--font-headline)' }}>
              Your Boutique
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <BoutiquePreviewCard
                gradient="linear-gradient(135deg, #ffdff2 0%, #fcbcff 50%, #B02E7A 100%)"
                icon={Layers}
                label="Racks"
              />
              <BoutiquePreviewCard
                gradient="linear-gradient(135deg, #ffd7f0 0%, #ff6cb5 50%, #9720ab 100%)"
                icon={Star}
                label="Displays"
              />
              <BoutiquePreviewCard
                gradient="linear-gradient(135deg, #edfff9 0%, #56f1e0 50%, #00675f 100%)"
                icon={Gem}
                label="Accessories"
              />
            </div>
          </motion.div>

        </div>

        <div className="h-16" />
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#ffd7f0] rounded-t-[2rem] py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
          <span className="text-base font-black text-[#46223e] uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-headline)' }}>
            FashStOpt
          </span>
          <div className="flex flex-wrap justify-center gap-8">
            {['About', 'Support', 'Privacy', 'Terms'].map((link) => (
              <a key={link} href="#"
                 className="text-sm font-medium text-[#B02E7A] hover:underline underline-offset-4
                            decoration-2 transition-all duration-150 focus:outline-none
                            focus:ring-1 focus:ring-[#B02E7A] rounded">
                {link}
              </a>
            ))}
          </div>
          <p className="text-xs font-bold text-[#966988] uppercase tracking-widest">
            © 2025 FashStOpt · Stay Playful.
          </p>
        </div>
      </footer>

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
