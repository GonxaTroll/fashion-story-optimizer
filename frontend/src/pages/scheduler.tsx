import { useEffect, useCallback, useRef, Fragment } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Sparkles, LogOut, Home, Calendar, Settings, BarChart2,
  User, Save, RotateCcw, Zap, Bell, Coffee,
} from 'lucide-react'
import { useScheduler } from '@/hooks/use-scheduler'

/* ─── Shared spring configs ─── */
const SPRING      = { type: 'spring', stiffness: 400, damping: 15 } as const
const CELL_SPRING = { type: 'spring', stiffness: 450, damping: 14 } as const

/* ─── Static data (module scope — no re-creation on render) ─── */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

const INFO_CARDS = [
  {
    icon: Zap,
    title: 'Smart Fill',
    desc: 'Drag across multiple slots to mark a block as available in one go.',
    bg: 'bg-[#56f1e0]',
    text: 'text-[#00574f]',
    desc2: 'text-[#005a52]',
    border: '',
  },
  {
    icon: Bell,
    title: 'Alert Clients',
    desc: "We'll notify your regular shoppers when you update your hours.",
    bg: 'bg-[#fcbcff]',
    text: 'text-[#7c0091]',
    desc2: 'text-[#7c0091]/80',
    border: '',
  },
  {
    icon: Coffee,
    title: 'Break Times',
    desc: "Don't forget to schedule your lunch breaks to keep that energy up!",
    bg: 'bg-[#ffd7f0]',
    text: 'text-[#B02E7A]',
    desc2: 'text-[#784e6c]',
    border: 'border-2 border-[#B02E7A]/10',
  },
]

/* ════════════════════════════════════════════
   Scheduler Page
   ════════════════════════════════════════════ */
interface Props { onSignOut: () => void; onNavigate: (page: string) => void }

export default function SchedulerPage({ onSignOut, onNavigate }: Props) {
  const { grid, saving, toggleCell, setCells, resetGrid, saveGrid, loadGrid } = useScheduler()
  const shouldReduce = useReducedMotion() ?? false

  /* ─── Drag-to-select (refs avoid re-renders during drag) ─── */
  const isDragging = useRef(false)
  const dragValue  = useRef(false)

  useEffect(() => {
    loadGrid()
    const stop = () => { isDragging.current = false }
    window.addEventListener('pointerup', stop)
    return () => window.removeEventListener('pointerup', stop)
  }, [])

  const handleCellPointerDown = useCallback((hour: number, day: number) => {
    isDragging.current = true
    dragValue.current  = !grid[hour][day]
    toggleCell(hour, day)
  }, [grid, toggleCell])

  const handleCellPointerEnter = useCallback((hour: number, day: number) => {
    if (!isDragging.current) return
    setCells([{ hour, day }], dragValue.current)
  }, [setCells])

  /* ─── Nav data ─── */
  const navLinks      = ['Home', 'Schedule', 'Optimizer', 'Results']
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
                    link === 'Home'      ? (e) => { e.preventDefault(); onNavigate('dashboard') } :
                    link === 'Optimizer' ? (e) => { e.preventDefault(); onNavigate('optimizer') }  :
                    link === 'Results'   ? (e) => { e.preventDefault(); onNavigate('results') }    :
                    (e) => e.preventDefault()
                  }
                  className={`text-sm font-bold tracking-tight transition-all duration-150 focus:outline-none
                    focus:ring-2 focus:ring-[#B02E7A]/40 rounded px-1 py-0.5
                    ${i === 1
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

      {/* ══════════════════════════════
          MAIN CONTENT
          ══════════════════════════════ */}
      <main className="pt-32 pb-28 px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── HERO ── */}
          <section className="mb-10" aria-label="Hero">
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1
                className="text-4xl md:text-6xl font-black text-[#46223e] tracking-tight mb-4"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                Set Your Shop{' '}
                <span className="text-[#B02E7A] italic">Hours!</span>
              </h1>
              <p className="text-lg md:text-xl text-[#784e6c] max-w-2xl font-medium">
                Click on the slots to toggle your availability. Let's get your boutique open for business!
              </p>
            </motion.div>
          </section>

          {/* ── SCHEDULER GRID ── */}
          <section aria-label="Availability grid">
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-[#ffecf5] rounded-2xl p-4 md:p-8 shadow-sm overflow-x-auto"
            >
              <div
                className="grid gap-1.5 min-w-[480px]"
                style={{ gridTemplateColumns: 'auto repeat(7, 1fr)', touchAction: 'none' }}
              >
                {/* ── Header row ── */}
                <div className="h-10 flex items-center justify-center text-xs font-bold text-[#966988] uppercase tracking-widest">
                  Time
                </div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="h-10 flex items-center justify-center font-black text-sm text-[#46223e]"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    {day}
                  </div>
                ))}

                {/* ── 24 time rows ── */}
                {HOURS.map((timeLabel, hour) => (
                  <Fragment key={hour}>
                    {/* Time label */}
                    <div className="flex items-center justify-end pr-3 text-xs font-bold text-[#784e6c] h-10 tabular-nums">
                      {timeLabel}
                    </div>
                    {/* 7 day cells */}
                    {Array.from({ length: 7 }, (_, day) => {
                      const isAvailable = grid[hour][day]
                      return (
                        <motion.div
                          key={day}
                          whileTap={shouldReduce ? undefined : { scale: 0.88 }}
                          transition={CELL_SPRING}
                          onPointerDown={() => handleCellPointerDown(hour, day)}
                          onPointerEnter={() => handleCellPointerEnter(hour, day)}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault()
                              toggleCell(hour, day)
                            }
                          }}
                          role="button"
                          aria-pressed={isAvailable}
                          aria-label={`${timeLabel} ${DAYS[day]}: ${isAvailable ? 'Available' : 'Busy'}`}
                          tabIndex={0}
                          className={`h-10 rounded-lg cursor-pointer select-none transition-colors duration-150
                            focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40
                            ${isAvailable
                              ? 'bg-[#B02E7A] hover:bg-[#9e2870] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]'
                              : 'bg-[#FFF0F5] hover:bg-[#FFD6E7]'}`}
                        />
                      )
                    })}
                  </Fragment>
                ))}
              </div>
            </motion.div>

            {/* ── LEGEND + ACTIONS ── */}
            <div className="flex flex-col md:flex-row items-center justify-between
                            bg-[#ffcfee] rounded-2xl p-6 mt-3 gap-6">
              {/* Legend */}
              <div className="flex gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#B02E7A] rounded-md" aria-hidden="true" />
                  <span
                    className="text-sm font-black text-[#46223e]"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    Available
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#FFF0F5] rounded-md border border-[#d09ec0]" aria-hidden="true" />
                  <span
                    className="text-sm font-bold text-[#784e6c]"
                    style={{ fontFamily: 'var(--font-headline)' }}
                  >
                    Busy / Closed
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                  onClick={saveGrid}
                  disabled={saving}
                  className="bubblegum-gradient text-white px-8 py-3.5 rounded-full font-black
                             text-base shadow-[0_15px_30px_rgba(168,33,110,0.30)] cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/50
                             flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" aria-hidden="true" />
                      Save Changes
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                  onClick={resetGrid}
                  className="bg-white text-[#B02E7A] px-8 py-3.5 rounded-full font-black text-base
                             cursor-pointer hover:bg-[#ffecf5] transition-colors duration-150
                             focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40
                             flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  Reset
                </motion.button>
              </div>
            </div>
          </section>

          {/* ── INFO CARDS ── */}
          <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6" aria-label="Tips">
            {INFO_CARDS.map(({ icon: Icon, title, desc, bg, text, desc2, border }, i) => (
              <motion.div
                key={title}
                initial={shouldReduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: 0.06 * i, duration: 0.45 }}
                whileHover={shouldReduce ? {} : { y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`p-8 ${bg} ${border} rounded-2xl flex flex-col gap-4 relative
                            overflow-hidden group cursor-default`}
              >
                <Icon className={`w-8 h-8 ${text}`} aria-hidden="true" />
                <h3
                  className={`text-xl font-black ${text}`}
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  {title}
                </h3>
                <p className={`font-medium text-sm leading-relaxed ${desc2}`}>{desc}</p>
                {/* Decorative background icon */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-200"
                >
                  <Icon className="w-24 h-24" />
                </div>
              </motion.div>
            ))}
          </section>
        </div>
      </main>

      {/* ══════════════════════════════
          FOOTER
          ══════════════════════════════ */}
      <footer className="bg-[#ffd7f0] rounded-t-[2rem] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
          <span
            className="text-base font-black text-[#46223e] uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            FashStOpt
          </span>
          <div className="flex flex-wrap justify-center gap-8">
            {['About', 'Support', 'Privacy', 'Terms'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium text-[#B02E7A] hover:underline underline-offset-4
                           decoration-2 transition-all duration-150 focus:outline-none
                           focus:ring-1 focus:ring-[#B02E7A] rounded"
              >
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
                navLinks[i] === 'Home'      ? () => onNavigate('dashboard') :
                navLinks[i] === 'Optimizer' ? () => onNavigate('optimizer')  :
                navLinks[i] === 'Results'   ? () => onNavigate('results')    :
                undefined
              }
              className={`p-1 cursor-pointer focus:outline-none focus:ring-2
                          focus:ring-[#B02E7A]/40 rounded-full transition-colors duration-150
                          ${i === 1 ? 'text-[#B02E7A]' : 'text-[#d09ec0] hover:text-[#B02E7A]'}`}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
