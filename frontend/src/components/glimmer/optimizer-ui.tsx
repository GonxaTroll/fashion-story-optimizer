import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Bell, Moon, Heart, Lock, LogOut } from 'lucide-react'

/* ─────────────────────────────────────────────────────
   Spring constants (stiffness: 300, damping: 30 per spec)
   ───────────────────────────────────────────────────── */
export const SPRING      = { type: 'spring', stiffness: 300, damping: 30 } as const
export const SPRING_FAST = { type: 'spring', stiffness: 400, damping: 28 } as const

/* ════════════════════════════════════════
   Hook: "Saved ✓" flash
   ════════════════════════════════════════ */
export function useSaved(duration = 2000) {
  const [saved, setSaved] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const trigger = useCallback(() => {
    setSaved(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setSaved(false), duration)
  }, [duration])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  return { saved, trigger }
}

/* ════════════════════════════════════════
   SAVED BADGE — fades in/out elegantly
   ════════════════════════════════════════ */
export function SavedBadge({ visible }: { visible: boolean }) {
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
export function BouncyToggle({ checked, onChange, id, label }: ToggleProps) {
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
export function PlayfulInput({
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
export function ShimmerButton({ children, onClick, disabled = false, danger = false, className = '', size = 'normal' }: ShimmerBtnProps) {
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
export function SectionCard({ title, icon: Icon, iconColor, children, delay = 0, shouldReduce }: SectionProps) {
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
export function SettingRow({ icon: Icon, iconColor, iconBg, title, subtitle, control, saved = false, last = false }: SettingRowProps) {
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

// Re-export lucide icons used by AccountTab so it only needs one import source
export { Bell, Moon, Heart, Lock, LogOut }
