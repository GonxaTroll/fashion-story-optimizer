import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Sparkles, LogOut, Home, Calendar, Settings, BarChart2,
  TrendingUp, Star, Gem, Shirt, Store, Palette, DollarSign, User,
} from 'lucide-react'
import { useShopStats } from '@/hooks/use-shop-stats'

/* ─── Shared spring configs ─── */
const SPRING = { type: 'spring', stiffness: 400, damping: 15 } as const
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
   Gamified Stat Card — shine-card CSS border +
   Framer shimmer sweep + spring pop-in
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
                 transition-shadow duration-300 cursor-default"
    >
      {/* Override opacity/y with spring entry on animate */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_POP, delay }}
        className="contents"
      >
        {/* Shimmer sweep */}
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

        {/* Colored circle icon (matching Stitch design) */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-lg shrink-0"
          style={{ backgroundColor: circleColor }}
        >
          <Icon className="w-6 h-6 text-white" aria-hidden="true" />
        </div>

        <div>
          <p className="text-xs font-bold text-[#784e6c] uppercase tracking-widest mb-0.5">
            {label}
          </p>
          <p
            className="text-2xl font-black text-[#46223e] leading-none"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {prefix}{value.toLocaleString()}
          </p>
          <p className="text-xs text-[#00675f] font-bold mt-1">{delta}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════
   How It Works Card — pink-tinted, icon glow
   ════════════════════════════════════════════ */
function HowCard({
  title, desc, icon: Icon, iconColor, delay,
}: {
  title: string; desc: string
  icon: React.ElementType; iconColor: string; delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.45 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="bg-[#ffecf5] hover:bg-[#ffdff2] rounded-2xl p-8 transition-colors
                 duration-200 group cursor-default"
    >
      <div
        className="w-14 h-14 bg-white rounded-xl mb-6 flex items-center justify-center
                   shadow-lg group-hover:scale-110 transition-transform duration-200"
        style={{ boxShadow: `0 8px 24px rgba(176,46,122,0.20)` }}
      >
        <Icon className="w-7 h-7" style={{ color: iconColor }} aria-hidden="true" />
      </div>
      <h3
        className="text-xl font-black text-[#46223e] mb-3"
        style={{ fontFamily: 'var(--font-headline)' }}
      >
        {title}
      </h3>
      <p className="text-[#784e6c] font-medium text-sm leading-relaxed">{desc}</p>
    </motion.div>
  )
}

/* ════════════════════════════════════════════
   Dashboard Page
   ════════════════════════════════════════════ */
interface Props { onSignOut: () => void; onNavigate: (page: string) => void }

export default function DashboardPage({ onSignOut, onNavigate }: Props) {
  const { profit, xp, gems, addProfit, addXp, addGems } = useShopStats()
  const seeded = useRef(false)
  const shouldReduce = useReducedMotion() ?? false

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
  const floatT  = { duration: 3.6, repeat: Infinity, ease: 'easeInOut' as const }
  const hangT   = { duration: 2.8, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }
  const starT   = { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const, delay: 1.1 }

  const navLinks = ['Home', 'Schedule', 'Settings', 'Results']
  const mobileNavIcons = [Home, Calendar, Settings, BarChart2]

  const stats = [
    { label: 'Profit',    value: profit, prefix: '$', delta: '+$1,240 today',       icon: TrendingUp, circleColor: '#f59e0b' },
    { label: 'XP Gained', value: xp,     prefix: '',  delta: '+450 this session',    icon: Star,       circleColor: '#60a5fa' },
    { label: 'Gems',      value: gems,   prefix: '',  delta: '+12 collected',         icon: Gem,        circleColor: '#f472b6' },
  ]

  const howCards = [
    {
      icon: Store,
      title: 'Curate Stock',
      desc: 'Choose from thousands of illustrated outfits to stock your shelves. Watch the trends closely!',
      iconColor: '#B02E7A',
    },
    {
      icon: Palette,
      title: 'Decorate',
      desc: 'Customize your floor plan with cute mannequins, racks, and wall art. Create a vibe that attracts icons.',
      iconColor: '#9720ab',
    },
    {
      icon: DollarSign,
      title: 'Grow Profit',
      desc: 'Reinvest your coins and gems into bigger stores and exclusive designer collaborations.',
      iconColor: '#00675f',
    },
  ]

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
                  onClick={link === 'Settings' ? (e) => { e.preventDefault(); onNavigate('settings') } : undefined}
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
                Manage the trendiest boutique in the city. Style icons, design your shop,
                and climb the fashion ladder.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={shouldReduce ? {} : { scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={SPRING}
                  className="bubblegum-gradient text-white px-10 py-4 rounded-full font-black
                             text-lg shadow-[0_20px_40px_rgba(168,33,110,0.30)] cursor-pointer
                             focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/50"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  Open Your Shop
                </motion.button>
                <motion.button
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

            {/* Right: floating boutique room image */}
            <div className="md:w-1/2 relative flex justify-center">

              {/* Main floating circle (animate: y[0,-10,0] per spec) */}
              <motion.div
                animate={floatY}
                transition={floatT}
                className="w-72 h-72 lg:w-96 lg:h-96 relative"
              >
                <div
                  className="w-full h-full rounded-full border-8 border-white shadow-2xl
                             overflow-hidden flex flex-col items-center justify-center gap-3
                             relative"
                  style={{
                    background:
                      'linear-gradient(155deg, #ffdff2 0%, #fcbcff 45%, #56f1e0 100%)',
                  }}
                >
                  {/* Decorative clothes rack art */}
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
                  {/* Rack bar */}
                  <div className="w-40 h-1 bg-white/50 rounded-full" />
                  {/* Second row */}
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

              {/* Floating hanger badge (top-right) */}
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

              {/* Floating star badge (bottom-left) */}
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

        {/* ── LAST RESULTS — Zustand-connected stat cards ── */}
        <section
          className="max-w-7xl mx-auto mb-20"
          aria-label="Last results"
        >
          <div className="bg-[#ffdff2] rounded-[2rem] p-8 md:p-10">

            {/* Header */}
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

            {/* Gamified stat cards */}
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

        {/* ── HOW IT WORKS ── */}
        <section className="max-w-7xl mx-auto mb-20" aria-label="How it works">
          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl font-black text-[#46223e] mb-3"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              How It Works
            </h2>
            <p className="text-[#784e6c] max-w-xl mx-auto text-base font-medium leading-relaxed">
              Build your fashion empire in three simple steps. Every choice shapes the trend.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howCards.map(({ icon, title, desc, iconColor }, i) => (
              <HowCard
                key={title}
                icon={icon}
                title={title}
                desc={desc}
                iconColor={iconColor}
                delay={0.06 * i}
              />
            ))}
          </div>
        </section>

        {/* ── FEATURE CARDS (Iconic Guests + Rare Unlocks) ── */}
        <section className="max-w-7xl mx-auto" aria-label="Features">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Iconic Guests */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#fcbcff] rounded-[2rem] overflow-hidden min-h-72 relative
                         group cursor-pointer"
            >
              {/* Background illustration */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center opacity-15"
              >
                <User className="w-56 h-56 text-[#9720ab]" />
              </div>
              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm
                              px-6 py-5 rounded-2xl border-2 border-[#f9a7ff] shadow-xl">
                <h4
                  className="text-xl font-black text-[#9720ab] mb-1"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  Iconic Guests
                </h4>
                <p className="text-sm font-medium text-[#784e6c]">
                  Unlock 50+ unique characters to shop at your boutique.
                </p>
              </div>
            </motion.div>

            {/* Rare Unlocks */}
            <motion.div
              initial={shouldReduce ? false : { opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#ffd7f0] rounded-[2rem] overflow-hidden min-h-72 relative
                         group cursor-pointer"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center opacity-15"
              >
                <Shirt className="w-56 h-56 text-[#B02E7A]" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm
                              px-6 py-5 rounded-2xl border-2 border-[#ff6cb5] shadow-xl">
                <h4
                  className="text-xl font-black text-[#B02E7A] mb-1"
                  style={{ fontFamily: 'var(--font-headline)' }}
                >
                  Rare Unlocks
                </h4>
                <p className="text-sm font-medium text-[#784e6c]">
                  Collect rare mannequin heads and legendary clothing items.
                </p>
              </div>
            </motion.div>
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
              onClick={navLinks[i] === 'Settings' ? () => onNavigate('settings') : undefined}
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
