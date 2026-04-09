import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Sparkles, LogOut, Home, Calendar, Settings, BarChart2,
  Star, Gem, DollarSign, LayoutGrid, List, Lightbulb,
  Shield, Glasses, Zap, CircleDot, Headphones, User,
} from 'lucide-react'

const SPRING = { type: 'spring', stiffness: 400, damping: 15 } as const

/* ─── Data ─── */
interface Item {
  position: number
  item: string
  price: number      // coins
  experience: number // xp
  units: number
  revenue: number
  // visual helpers
  tagColor: string
  icon: React.ElementType
  iconBg: string
}

interface Collection {
  collection: string
  color: string
  borderColor: string
  items: Item[]
}

const COLLECTIONS: Collection[] = [
  {
    collection: 'Arena',
    color: 'text-[#a8216e]',
    borderColor: 'border-[#a8216e]/20',
    items: [
      {
        position: 1,
        item: 'Arena Gloves',
        price: 250,
        experience: 2400,
        units: 5,
        revenue: 1250,
        tagColor: 'bg-[#56f1e0] text-[#00423c]',
        icon: Shield,
        iconBg: 'bg-[#56f1e0]/40',
      },
      {
        position: 4,
        item: 'Arena Shield',
        price: 420,
        experience: 1800,
        units: 3,
        revenue: 1260,
        tagColor: 'bg-[#56f1e0] text-[#00423c]',
        icon: Shield,
        iconBg: 'bg-[#56f1e0]/30',
      },
    ],
  },
  {
    collection: 'Neon',
    color: 'text-[#9720ab]',
    borderColor: 'border-[#9720ab]/20',
    items: [
      {
        position: 2,
        item: 'Neon Visor',
        price: 320,
        experience: 3100,
        units: 4,
        revenue: 1280,
        tagColor: 'bg-[#ff6cb5] text-[#4a002c]',
        icon: Glasses,
        iconBg: 'bg-[#ff6cb5]/30',
      },
      {
        position: 3,
        item: 'Swift Boots',
        price: 180,
        experience: 4200,
        units: 8,
        revenue: 1440,
        tagColor: 'bg-[#fcbcff] text-[#5d006d]',
        icon: Zap,
        iconBg: 'bg-[#fcbcff]/40',
      },
    ],
  },
  {
    collection: 'Core',
    color: 'text-[#00675f]',
    borderColor: 'border-[#00675f]/20',
    items: [
      {
        position: 5,
        item: 'Aura Belt',
        price: 400,
        experience: 1500,
        units: 2,
        revenue: 800,
        tagColor: 'bg-[#d09ec0]/30 text-[#784e6c]',
        icon: CircleDot,
        iconBg: 'bg-[#d09ec0]/20',
      },
      {
        position: 6,
        item: 'Sonic Headset',
        price: 150,
        experience: 3000,
        units: 6,
        revenue: 900,
        tagColor: 'bg-[#ffcfee] text-[#46223e]',
        icon: Headphones,
        iconBg: 'bg-[#ffcfee]/60',
      },
    ],
  },
]

const ALL_ITEMS = COLLECTIONS
  .flatMap((c) => c.items.map((item) => ({ ...item, collection: c.collection, collectionColor: c.color })))
  .sort((a, b) => a.position - b.position)

/* ─── Item Card ─── */
function ItemCard({ item, delay, shouldReduce }: {
  item: Item
  delay: number
  shouldReduce: boolean
}) {
  const Icon = item.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.35 }}
      whileHover={shouldReduce ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-2xl p-4 flex gap-4
                 shadow-[0_4px_16px_rgba(176,46,122,0.07)]
                 hover:shadow-[0_12px_32px_rgba(176,46,122,0.15)]
                 transition-shadow duration-200 cursor-default"
    >
      {/* Icon + position badge */}
      <div className="relative shrink-0">
        <div className={`w-16 h-16 ${item.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-8 h-8 text-[#B02E7A]" aria-hidden="true" />
        </div>
        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bubblegum-gradient
                         text-white text-[9px] font-black flex items-center justify-center
                         shadow-sm">
          {item.position}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between overflow-hidden flex-1 min-w-0">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5
                            rounded ${item.tagColor}`}>
            Collection
          </span>
          <h3 className="font-black text-sm text-[#46223e] mt-1 truncate"
              style={{ fontFamily: 'var(--font-headline)' }}>
            {item.item}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#9720ab]">
            <Gem className="w-3 h-3" aria-hidden="true" />
            {item.price.toLocaleString()} coins
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#B02E7A]">
            <Star className="w-3 h-3" aria-hidden="true" />
            {item.experience.toLocaleString()} XP
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#784e6c]">
            <LayoutGrid className="w-3 h-3" aria-hidden="true" />
            {item.units} units
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00675f]">
            <DollarSign className="w-3 h-3" aria-hidden="true" />
            {item.revenue.toLocaleString()} rev
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main Page ─── */
interface Props { onSignOut: () => void; onNavigate: (page: string) => void }

export default function ResultsPage({ onSignOut, onNavigate }: Props) {
  const [view, setView] = useState<'visual' | 'table'>('visual')
  const shouldReduce = useReducedMotion() ?? false

  const navLinks = ['Home', 'Schedule', 'Optimizer', 'Results']
  const mobileNavIcons = [Home, Calendar, Settings, BarChart2]

  const totalXP      = ALL_ITEMS.reduce((s, i) => s + i.experience * i.units, 0)
  const totalRevenue = ALL_ITEMS.reduce((s, i) => s + i.revenue, 0)
  const totalUnits   = ALL_ITEMS.reduce((s, i) => s + i.units, 0)

  const summaryChips = [
    { label: 'Total XP',      value: `+${totalXP.toLocaleString()}`,      icon: Star,       color: 'text-[#B02E7A]' },
    { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} G`, icon: DollarSign, color: 'text-[#00675f]' },
    { label: 'Total Units',   value: totalUnits.toLocaleString(),          icon: Gem,        color: 'text-[#9720ab]' },
  ]

  return (
    <div className="min-h-screen bg-[#FFF5F8] overflow-x-hidden">

      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="bg-[#FFF5F8]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(70,34,62,0.06)]
                        rounded-b-[2rem] max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-8 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#ffdff2] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#B02E7A]" aria-hidden="true" />
              </div>
              <span className="text-xl font-black italic text-[#B02E7A] leading-none"
                    style={{ fontFamily: 'var(--font-headline)' }}>
                FashStOpt
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8" role="list">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  role="listitem"
                  onClick={
                    link === 'Home'      ? (e) => { e.preventDefault(); onNavigate('dashboard') } :
                    link === 'Schedule'  ? (e) => { e.preventDefault(); onNavigate('scheduler') } :
                    link === 'Optimizer' ? (e) => { e.preventDefault(); onNavigate('optimizer') } :
                    (e) => e.preventDefault()
                  }
                  className={`text-sm font-bold tracking-tight transition-all duration-150
                    focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40 rounded px-1 py-0.5
                    ${link === 'Results'
                      ? 'text-[#B02E7A] border-b-2 border-[#B02E7A] pb-1'
                      : 'text-[#d09ec0] hover:text-[#B02E7A]'
                    }`}
                >
                  {link}
                </a>
              ))}
            </div>

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
                Admin
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

      {/* ── MAIN ── */}
      <main className="pt-32 pb-28 px-6 max-w-7xl mx-auto">

        {/* ── HERO HEADER ── */}
        <header className="relative text-center mb-12">
          {/* Ambient blobs */}
          <div aria-hidden="true"
               className="absolute -top-10 -left-10 w-40 h-40 bg-[#56f1e0]/20 rounded-full blur-3xl -z-10" />
          <div aria-hidden="true"
               className="absolute -top-10 -right-10 w-40 h-40 bg-[#fcbcff]/20 rounded-full blur-3xl -z-10" />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-5xl md:text-6xl font-black tracking-tighter text-[#46223e] mb-6"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Optimized{' '}
            <span className="text-[#B02E7A] italic">Timeline</span>
          </motion.h1>

          {/* Summary chips */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {summaryChips.map(({ label, value, icon: Icon, color }) => (
              <div key={label}
                   className="bg-[#ffd7f0] px-6 py-3 rounded-full flex items-center gap-3
                              shadow-sm border border-[#d09ec0]/10">
                <Icon className={`w-5 h-5 ${color}`} style={{ fill: 'currentColor' }}
                      aria-hidden="true" />
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#784e6c] leading-none">
                    {label}
                  </p>
                  <p className="text-xl font-black text-[#46223e]"
                     style={{ fontFamily: 'var(--font-headline)' }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* View toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex bg-[#ffd7f0] p-1 rounded-full shadow-inner">
              <motion.button
                whileHover={shouldReduce ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                onClick={() => setView('visual')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm
                            transition-colors duration-200 focus:outline-none focus:ring-2
                            focus:ring-[#B02E7A]/40
                            ${view === 'visual'
                              ? 'bubblegum-gradient text-white shadow-md'
                              : 'text-[#784e6c] hover:bg-[#ffcfee]/60'
                            }`}
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" /> Visual
              </motion.button>
              <motion.button
                whileHover={shouldReduce ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                onClick={() => setView('table')}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm
                            transition-colors duration-200 focus:outline-none focus:ring-2
                            focus:ring-[#B02E7A]/40
                            ${view === 'table'
                              ? 'bubblegum-gradient text-white shadow-md'
                              : 'text-[#784e6c] hover:bg-[#ffcfee]/60'
                            }`}
              >
                <List className="w-4 h-4" aria-hidden="true" /> Table
              </motion.button>
            </div>
          </motion.div>
        </header>

        {/* ── VISUAL VIEW ── */}
        {view === 'visual' && (
          <motion.div
            key="visual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-8 mb-16"
          >
            {COLLECTIONS.map((col, ci) => (
              <div key={col.collection} className="relative flex flex-col md:flex-row gap-6">
                {/* Collection label */}
                <div className="md:w-36 shrink-0 pt-2">
                  <div className="sticky top-24 flex flex-col items-center md:items-end">
                    <span className={`text-2xl font-black ${col.color}`}
                          style={{ fontFamily: 'var(--font-headline)' }}>
                      {col.collection}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-[#784e6c]">
                      Collection
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className={`flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
                                 border-l-4 ${col.borderColor} pl-6 pb-4`}>
                  {col.items.map((item, ii) => (
                    <ItemCard
                      key={item.item}
                      item={item}
                      delay={0.05 * ci + 0.06 * ii}
                      shouldReduce={shouldReduce}
                    />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── TABLE VIEW ── */}
        {view === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden rounded-2xl bg-white
                       shadow-[0_8px_32px_rgba(176,46,122,0.08)]
                       border border-[#d09ec0]/20 mb-16"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#ffd7f0] border-b border-[#d09ec0]/20">
                    {[
                      { label: '#',           align: 'text-center' },
                      { label: 'Collection',  align: '' },
                      { label: 'Item',        align: '' },
                      { label: 'Price (coins)', align: 'text-right' },
                      { label: 'XP',          align: 'text-right' },
                      { label: 'Units',       align: 'text-right' },
                      { label: 'Revenue',     align: 'text-right' },
                    ].map(({ label, align }) => (
                      <th key={label}
                          className={`px-5 py-4 text-xs font-black uppercase tracking-wider
                                      text-[#784e6c] ${align}`}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d09ec0]/10">
                  {ALL_ITEMS.map((row, i) => (
                    <motion.tr
                      key={`${row.collection}-${row.item}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="hover:bg-[#ffecf5]/60 transition-colors duration-150"
                    >
                      {/* Position */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6
                                         bubblegum-gradient text-white text-[10px] font-black
                                         rounded-full shadow-sm">
                          {row.position}
                        </span>
                      </td>
                      {/* Collection */}
                      <td className={`px-5 py-4 font-black text-sm ${row.collectionColor}`}
                          style={{ fontFamily: 'var(--font-headline)' }}>
                        {row.collection}
                      </td>
                      {/* Item */}
                      <td className="px-5 py-4 font-bold text-[#46223e]">{row.item}</td>
                      {/* Price */}
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#9720ab] text-sm">
                          <Gem className="w-3 h-3" aria-hidden="true" />
                          {row.price.toLocaleString()}
                        </span>
                      </td>
                      {/* XP */}
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#B02E7A] text-sm">
                          <Star className="w-3 h-3" aria-hidden="true" />
                          {row.experience.toLocaleString()}
                        </span>
                      </td>
                      {/* Units */}
                      <td className="px-5 py-4 text-right font-bold text-[#784e6c]">
                        {row.units}
                      </td>
                      {/* Revenue */}
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#00675f] text-sm">
                          <DollarSign className="w-3 h-3" aria-hidden="true" />
                          {row.revenue.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>

                {/* Totals footer */}
                <tfoot>
                  <tr className="bg-[#ffd7f0]/50 border-t-2 border-[#d09ec0]/30">
                    <td colSpan={3}
                        className="px-5 py-3 text-xs font-black uppercase tracking-wider text-[#784e6c]">
                      Totals
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#9720ab]">
                      —
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#B02E7A]">
                      +{totalXP.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#784e6c]">
                      {totalUnits}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#00675f]">
                      {totalRevenue.toLocaleString()} G
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        )}

        {/* ── OPTIMAL PLAN CTA ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45 }}
          aria-label="Optimal purchase plan"
          className="bg-[#ffd7f0] rounded-[2rem] p-8 md:p-10
                     flex flex-col md:flex-row items-center gap-6 relative overflow-hidden
                     shadow-sm border border-[#d09ec0]/10"
        >
          <div className="w-16 h-16 bg-[#B02E7A]/10 rounded-2xl flex items-center
                          justify-center shrink-0">
            <Lightbulb className="w-8 h-8 text-[#B02E7A] fill-[#B02E7A]/20"
                        aria-hidden="true" />
          </div>
          <div className="max-w-3xl text-center md:text-left relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-[#46223e] mb-2"
                style={{ fontFamily: 'var(--font-headline)' }}>
              Optimal Purchase Plan
            </h2>
            <p className="text-base font-semibold text-[#784e6c] leading-relaxed opacity-90">
              This strategy is calculated to maximize your goals based on your specific
              availability and settings.
            </p>
          </div>
          {/* Decorative blobs */}
          <div aria-hidden="true"
               className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#B02E7A]/5 rounded-full
                          border border-[#B02E7A]/10" />
          <div aria-hidden="true"
               className="absolute -left-10 -top-10 w-40 h-40 bg-[#9720ab]/5 rounded-full
                          border border-[#9720ab]/10" />
        </motion.section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#ffd7f0] rounded-t-[2rem] py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
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

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
           role="navigation" aria-label="Mobile navigation">
        <div className="bg-[#FFF5F8]/90 backdrop-blur-xl rounded-full shadow-2xl
                        px-6 py-3.5 flex items-center gap-6 border border-[#ffd7f0]">
          {mobileNavIcons.map((Icon, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={SPRING}
              aria-label={navLinks[i]}
              onClick={
                navLinks[i] === 'Home'      ? () => onNavigate('dashboard') :
                navLinks[i] === 'Schedule'  ? () => onNavigate('scheduler') :
                navLinks[i] === 'Optimizer' ? () => onNavigate('optimizer') :
                undefined
              }
              className={`p-1 cursor-pointer focus:outline-none focus:ring-2
                          focus:ring-[#B02E7A]/40 rounded-full transition-colors duration-150
                          ${i === 3 ? 'text-[#B02E7A]' : 'text-[#d09ec0] hover:text-[#B02E7A]'}`}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
