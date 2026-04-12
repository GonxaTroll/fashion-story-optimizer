import { useEffect, useRef, useState } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Sparkles, LogOut, Home, Calendar, Settings, BarChart2,
  TrendingUp, Star, Gem, Shirt, Store, User, X,
  Clock, Sliders, Zap, CheckCircle2, ChevronRight,
} from 'lucide-react'
import { useShopStats } from '@/hooks/use-shop-stats'

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
  delta: string
  icon: React.ElementType
  circleColor: string
  delay: number
  shouldReduce: boolean
}

function StatCard({
  label, value, prefix = '', delta,
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
            {prefix}{value.toLocaleString()}
          </p>
          <p className="text-xs text-[#00675f] font-bold mt-1">{delta}</p>
        </div>
      </motion.div>
    </motion.div>
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
  const { profit, xp, gems, addProfit, addXp, addGems } = useShopStats()
  const { name: currentUserName } = useCurrentUser()
  const seeded     = useRef(false)
  const shouldReduce = useReducedMotion() ?? false
  const [tutorialOpen, setTutorialOpen] = useState(false)

  /* Seed store once on first mount */
  useEffect(() => {
    if (seeded.current) return
    seeded.current = true
    addProfit(1240)
    addXp(450)
    addGems(12)
  }, [addProfit, addXp, addGems])

  /* Floating animation (respects reduced-motion) */
  const floatY = shouldReduce ? {} : { y: [0, -10, 0] as [number, number, number] }
  const floatT = { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const }
  const hangT  = { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }
  const starT  = { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.1 }

  const navLinks       = ['Home', 'Schedule', 'Optimizer', 'Results']
  const mobileNavIcons = [Home, Calendar, Settings, BarChart2]

  const stats = [
    { label: 'Profit',    value: profit, prefix: '$', delta: '+$1,240 today',    icon: TrendingUp, circleColor: '#f59e0b' },
    { label: 'XP Gained', value: xp,     prefix: '',  delta: '+450 this session', icon: Star,       circleColor: '#60a5fa' },
    { label: 'Gems',      value: gems,   prefix: '',  delta: '+12 collected',      icon: Gem,        circleColor: '#f472b6' },
  ]

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
              <p className="text-lg text-[#784e6c] font-medium max-w-md mb-10 leading-relaxed">
                FashStOpt is a smart scheduler for the{' '}
                <span className="font-black text-[#B02E7A]">Fashion Story</span> mobile game.
                It uses optimization algorithms to find the best item-to-hour assignment
                that maximizes your revenue, XP, and gems — so you can play smarter, not harder.
              </p>
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
                  <div className="flex gap-3">
                    {['#ff6cb5', '#fcbcff', '#56f1e0', '#B02E7A'].map((c, i) => (
                      <motion.div
                        key={i}
                        className="w-9 h-[3.5rem] rounded-xl border-2 border-white/60 shadow-md"
                        style={{ backgroundColor: c }}
                        initial={{ y: 8 + i * 4, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + i * 0.07 }}
                      />
                    ))}
                  </div>
                  <div className="w-40 h-1 bg-white/50 rounded-full" />
                  <div className="flex gap-2.5">
                    {['#9720ab', '#ff6cb5', '#56f1e0'].map((c, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-11 rounded-lg border-2 border-white/50 shadow"
                        style={{ backgroundColor: c }}
                        initial={{ y: 12, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.55 + i * 0.06 }}
                      />
                    ))}
                  </div>
                  <Store className="w-10 h-10 text-white/70 mt-1" aria-hidden="true" />
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
                <p className="text-[#784e6c] font-bold text-sm">
                  Store Status:{' '}
                  <span className="text-[#00675f] font-black">Trending!</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map(({ label, value, prefix, delta, icon, circleColor }, i) => (
                <StatCard
                  key={label}
                  label={label}
                  value={value}
                  prefix={prefix}
                  delta={delta}
                  icon={icon}
                  circleColor={circleColor}
                  delay={0.08 + i * 0.1}
                  shouldReduce={shouldReduce}
                />
              ))}
            </div>
          </div>
        </section>
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
