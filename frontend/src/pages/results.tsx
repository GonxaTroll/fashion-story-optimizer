import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Sparkles, LogOut, Home, Calendar, Settings, BarChart2,
  Star, Gem, DollarSign, LayoutGrid, List, Lightbulb,
  Shield, Glasses, Zap, CircleDot, Headphones, User, Clock,
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const SPRING = { type: 'spring', stiffness: 400, damping: 15 } as const

/* ─── Types ─── */
interface ApiResultItem {
  hour: number
  slot: number
  title: string
  collection: string
  cost: number
  xp: number
  units: number
  revenue: number
  duration: number
  order_position: number | null
}

interface ApiResponse {
  optimization_date: string
  results: ApiResultItem[]
}

interface Item {
  orderPosition: number | null
  hours: number[]
  count: number
  item: string
  price: number
  experience: number
  units: number
  revenue: number
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

/* ─── Visual palettes (cycle by position) ─── */
const ITEM_PALETTE = [
  { tagColor: 'bg-[#56f1e0] text-[#00423c]', iconBg: 'bg-[#56f1e0]/40', icon: Shield },
  { tagColor: 'bg-[#ff6cb5] text-[#4a002c]', iconBg: 'bg-[#ff6cb5]/30', icon: Glasses },
  { tagColor: 'bg-[#fcbcff] text-[#5d006d]', iconBg: 'bg-[#fcbcff]/40', icon: Zap },
  { tagColor: 'bg-[#d09ec0]/30 text-[#784e6c]', iconBg: 'bg-[#d09ec0]/20', icon: CircleDot },
  { tagColor: 'bg-[#ffcfee] text-[#46223e]', iconBg: 'bg-[#ffcfee]/60', icon: Headphones },
]

const COLLECTION_PALETTE = [
  { color: 'text-[#a8216e]', borderColor: 'border-[#a8216e]/20' },
  { color: 'text-[#9720ab]', borderColor: 'border-[#9720ab]/20' },
  { color: 'text-[#00675f]', borderColor: 'border-[#00675f]/20' },
  { color: 'text-[#B02E7A]', borderColor: 'border-[#B02E7A]/20' },
  { color: 'text-[#0057a8]', borderColor: 'border-[#0057a8]/20' },
]

/* ─── Helpers ─── */


function toCollections(results: ApiResultItem[]): Collection[] {
  const sorted = [...results].sort((a, b) => a.slot - b.slot || a.hour - b.hour)

  // Group by collection
  const collectionMap = new Map<string, ApiResultItem[]>()
  sorted.forEach((r) => {
    if (!collectionMap.has(r.collection)) collectionMap.set(r.collection, [])
    collectionMap.get(r.collection)!.push(r)
  })

  let paletteIdx = 0
  let colIdx = 0
  const collections: Collection[] = []

  for (const [name, apiItems] of collectionMap) {
    // Deduplicate by title within collection
    const titleMap = new Map<string, ApiResultItem & { hours: number[]; totalCount: number }>()
    apiItems.forEach((r) => {
      if (!titleMap.has(r.title)) {
        titleMap.set(r.title, { ...r, hours: [r.hour], totalCount: 1 })
      } else {
        const entry = titleMap.get(r.title)!
        entry.totalCount++
        if (!entry.hours.includes(r.hour)) entry.hours.push(r.hour)
      }
    })

    const colPalette = COLLECTION_PALETTE[colIdx++ % COLLECTION_PALETTE.length]
    collections.push({
      collection: name,
      color: colPalette.color,
      borderColor: colPalette.borderColor,
      items: Array.from(titleMap.values()).map((r) => {
        const p = ITEM_PALETTE[paletteIdx++ % ITEM_PALETTE.length]
        return {
          orderPosition: r.order_position,
          hours: r.hours,
          count: r.totalCount,
          item: r.title,
          price: r.cost,
          experience: r.xp,
          units: r.units,
          revenue: r.revenue,
          tagColor: p.tagColor,
          icon: p.icon,
          iconBg: p.iconBg,
        }
      }),
    })
  }

  return collections
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

/* ─── Timeline Item Card ─── */
function TimelineCard({ item, collectionColor, delay, shouldReduce }: {
  item: Item & { collection: string; collectionColor: string }
  collectionColor: string
  delay: number
  shouldReduce: boolean
}) {
  const Icon = item.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.32 }}
      whileHover={shouldReduce ? {} : { scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-2xl p-4 flex gap-4 flex-1
                 shadow-[0_4px_16px_rgba(176,46,122,0.07)]
                 hover:shadow-[0_12px_32px_rgba(176,46,122,0.15)]
                 transition-shadow duration-200 cursor-default"
    >
      {/* Icon + badges */}
      <div className="relative shrink-0">
        <div className={`w-14 h-14 ${item.iconBg} rounded-xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-[#B02E7A]" aria-hidden="true" />
        </div>
        {item.orderPosition != null && (
          <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bubblegum-gradient
                           text-white text-[9px] font-black flex items-center justify-center shadow-sm">
            {item.orderPosition}
          </span>
        )}
        {item.count > 1 && (
          <span className="absolute -bottom-1.5 -right-1.5 min-w-[1.25rem] h-5 rounded-full
                           bg-[#9720ab] text-white text-[9px] font-black
                           flex items-center justify-center shadow-sm px-1">
            x{item.count}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col justify-between overflow-hidden flex-1 min-w-0">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${item.tagColor}`}>
              {item.item.split(' ').slice(-1)[0]}
            </span>
            <span className={`text-[10px] font-black ${collectionColor}`}
                  style={{ fontFamily: 'var(--font-headline)' }}>
              {item.collection}
            </span>
          </div>
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
  const [view, setView]               = useState<'visual' | 'table'>('visual')
  const [loading, setLoading]         = useState(true)
  const [optimizedAt, setOptimizedAt] = useState<string | null>(null)
  const [collections, setCollections] = useState<Collection[]>([])
  const shouldReduce = useReducedMotion() ?? false

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch(`${API_BASE}/optimize/latest`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() as Promise<ApiResponse> : Promise.reject(r.status))
      .then((data) => {
        setOptimizedAt(data.optimization_date)
        setCollections(toCollections(data.results))
      })
      .catch(() => {/* no results yet — leave collections empty */})
      .finally(() => setLoading(false))
  }, [])

  const allItems = collections.flatMap((c) =>
    c.items.map((i) => ({ ...i, collection: c.collection, collectionColor: c.color }))
  ).sort((a, b) => (a.orderPosition ?? 9999) - (b.orderPosition ?? 9999))

  const totalXP      = allItems.reduce((s, i) => s + i.experience * i.count, 0)
  const totalRevenue = allItems.reduce((s, i) => s + i.revenue * i.count, 0)
  const totalItems   = allItems.reduce((s, i) => s + i.count, 0)

  // Compute Monday of the week the optimization ran (day 0 = Mon 00:00)
  function weekMonday(): Date {
    const base = optimizedAt ? new Date(optimizedAt) : new Date()
    base.setHours(0, 0, 0, 0)
    const dow = base.getDay() // 0=Sun, 1=Mon, …6=Sat
    base.setDate(base.getDate() + (dow === 0 ? -6 : 1 - dow))
    return base
  }

  // Format a flat hour (0-167) as an actual calendar time (Mon of opt week = hour 0)
  function formatFlatHour(flatHour: number): string {
    const base = weekMonday()
    const d = new Date(base)
    d.setDate(d.getDate() + Math.floor(flatHour / 24))
    const hour = flatHour % 24
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      + ` ${String(hour).padStart(2, '0')}:00`
  }

  const summaryChips = [
    { label: 'Total XP',      value: `+${totalXP.toLocaleString()}`,      icon: Star,       color: 'text-[#B02E7A]' },
    { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} G`, icon: DollarSign, color: 'text-[#00675f]' },
    { label: 'Items Scheduled', value: totalItems.toLocaleString(),        icon: Gem,        color: 'text-[#9720ab]' },
  ]

  const navLinks       = ['Home', 'Schedule', 'Optimizer', 'Results']
  const mobileNavIcons = [Home, Calendar, Settings, BarChart2]

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
                <a key={link} href="#" role="listitem"
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
                      : 'text-[#d09ec0] hover:text-[#B02E7A]'}`}>
                  {link}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => onNavigate('account')}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={SPRING}
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
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={SPRING}
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
          <div aria-hidden="true"
               className="absolute -top-10 -left-10 w-40 h-40 bg-[#56f1e0]/20 rounded-full blur-3xl -z-10" />
          <div aria-hidden="true"
               className="absolute -top-10 -right-10 w-40 h-40 bg-[#fcbcff]/20 rounded-full blur-3xl -z-10" />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-5xl md:text-6xl font-black tracking-tighter text-[#46223e] mb-3"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            Optimized{' '}
            <span className="text-[#B02E7A] italic">Timeline</span>
          </motion.h1>

          {/* Optimization timestamp */}
          {optimizedAt && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-1.5 text-xs font-bold
                         text-[#966988] mb-6"
            >
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Last optimized on {formatDate(optimizedAt)}
            </motion.p>
          )}

          {/* Summary chips */}
          {!loading && allItems.length > 0 && (
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
                  <Icon className={`w-5 h-5 ${color}`} style={{ fill: 'currentColor' }} aria-hidden="true" />
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
          )}

          {/* View toggle — only when there are results */}
          {!loading && allItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex bg-[#ffd7f0] p-1 rounded-full shadow-inner">
                {(['visual', 'table'] as const).map((v) => (
                  <motion.button
                    key={v}
                    whileHover={shouldReduce ? {} : { scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={SPRING}
                    onClick={() => setView(v)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm
                                transition-colors duration-200 focus:outline-none focus:ring-2
                                focus:ring-[#B02E7A]/40 cursor-pointer
                                ${view === v
                                  ? 'bubblegum-gradient text-white shadow-md'
                                  : 'text-[#784e6c] hover:bg-[#ffcfee]/60'}`}
                  >
                    {v === 'visual'
                      ? <><LayoutGrid className="w-4 h-4" aria-hidden="true" /> Visual</>
                      : <><List       className="w-4 h-4" aria-hidden="true" /> Table</>}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </header>

        {/* ── LOADING ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#ffd7f0] border-t-[#B02E7A] animate-spin" />
            <p className="text-sm font-bold text-[#966988]">Loading results…</p>
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && allItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 gap-6 text-center"
          >
            <div className="w-20 h-20 bg-[#ffd7f0] rounded-full flex items-center justify-center">
              <BarChart2 className="w-10 h-10 text-[#d09ec0]" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#46223e] mb-2"
                  style={{ fontFamily: 'var(--font-headline)' }}>
                No results yet
              </h2>
              <p className="text-[#784e6c] font-medium max-w-xs">
                Set your schedule and run the optimizer to see your optimal timeline here.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={SPRING}
              onClick={() => onNavigate('optimizer')}
              className="bubblegum-gradient text-white px-8 py-3.5 rounded-full font-black
                         text-sm shadow-[0_10px_24px_rgba(168,33,110,0.25)] cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/50"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Go to Optimizer
            </motion.button>
          </motion.div>
        )}

        {/* ── VISUAL VIEW — Timeline ── */}
        {!loading && allItems.length > 0 && view === 'visual' && (() => {
          // Day 0 = Monday of the optimization week (matches solver's day_of_week=0 convention)
          const baseDate = weekMonday()

          function actualDate(dayIdx: number): Date {
            const d = new Date(baseDate)
            d.setDate(d.getDate() + dayIdx)
            return d
          }

          function dayHeader(dayIdx: number): string {
            return actualDate(dayIdx).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric',
            })
          }

          function dayShort(dayIdx: number): string {
            return actualDate(dayIdx).toLocaleDateString('en-US', { weekday: 'short' })
          }

          // Expand each item into one entry per unique hour, then sort
          const entries: Array<{ flatHour: number; item: typeof allItems[0] }> = []
          allItems.forEach((item) => {
            item.hours.forEach((h) => entries.push({ flatHour: h, item }))
          })
          entries.sort((a, b) => a.flatHour - b.flatHour)

          // Group by day index
          const byDay = new Map<number, typeof entries>()
          entries.forEach((e) => {
            const day = Math.floor(e.flatHour / 24)
            if (!byDay.has(day)) byDay.set(day, [])
            byDay.get(day)!.push(e)
          })

          return (
            <motion.div
              key="visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-10 mb-16"
            >
              {Array.from(byDay.entries()).map(([day, dayEntries]) => (
                <div key={day}>
                  {/* Day header */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl font-black text-[#B02E7A]"
                          style={{ fontFamily: 'var(--font-headline)' }}>
                      {dayHeader(day)}
                    </span>
                    <div className="flex-1 h-px bg-[#d09ec0]/30" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#966988]">
                      {dayEntries.length} {dayEntries.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Timeline entries */}
                  <div className="relative pl-2">
                    {/* Vertical line */}
                    <div className="absolute left-[2.35rem] top-0 bottom-0 w-px bg-[#d09ec0]/40" aria-hidden="true" />

                    <div className="flex flex-col gap-4">
                      {dayEntries.map((entry, ei) => {
                        const hour = entry.flatHour % 24
                        return (
                          <motion.div
                            key={`${entry.flatHour}-${entry.item.item}`}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-32px' }}
                            transition={{ delay: ei * 0.06, duration: 0.32 }}
                            className="flex items-start gap-4"
                          >
                            {/* Time bubble */}
                            <div className="shrink-0 flex flex-col items-center w-[4.5rem]">
                              <div className="w-[4.5rem] bg-[#ffd7f0] rounded-xl px-1 py-1.5
                                              flex flex-col items-center shadow-sm
                                              border border-[#d09ec0]/20">
                                <span className="text-[10px] font-black uppercase tracking-wider text-[#966988]">
                                  {dayShort(day)}
                                </span>
                                <span className="text-base font-black text-[#B02E7A] leading-none"
                                      style={{ fontFamily: 'var(--font-headline)' }}>
                                  {String(hour).padStart(2, '0')}:00
                                </span>
                              </div>
                              {/* Connector dot */}
                              <div className="w-2.5 h-2.5 rounded-full bubblegum-gradient mt-1 shadow-sm" />
                            </div>

                            {/* Card */}
                            <TimelineCard
                              item={entry.item}
                              collectionColor={entry.item.collectionColor}
                              delay={0}
                              shouldReduce={shouldReduce}
                            />
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )
        })()}

        {/* ── TABLE VIEW ── */}
        {!loading && allItems.length > 0 && view === 'table' && (
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
                    {['Pos', 'Scheduled', 'Collection', 'Item', 'Price (coins)', 'XP', 'Units', 'Revenue'].map((label) => (
                      <th key={label}
                          className={`px-5 py-4 text-xs font-black uppercase tracking-wider text-[#784e6c]
                                     ${['Price (coins)', 'XP', 'Units', 'Revenue'].includes(label) ? 'text-right' : ''}`}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d09ec0]/10">
                  {allItems.map((row, i) => (
                    <motion.tr
                      key={`${row.collection}-${row.item}`}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-[#ffecf5]/60 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 text-center">
                        {row.orderPosition != null ? (
                          <span className="inline-flex items-center justify-center w-6 h-6
                                           bubblegum-gradient text-white text-[10px] font-black
                                           rounded-full shadow-sm">
                            {row.orderPosition}
                          </span>
                        ) : (
                          <span className="text-[#d09ec0] text-xs font-bold">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs font-bold text-[#966988]">
                        <div className="flex flex-col gap-0.5">
                          {row.hours.map((h) => (
                            <span key={h} className="whitespace-nowrap">{formatFlatHour(h)}</span>
                          ))}
                        </div>
                      </td>
                      <td className={`px-5 py-4 font-black text-sm ${row.collectionColor}`}
                          style={{ fontFamily: 'var(--font-headline)' }}>
                        {row.collection}
                      </td>
                      <td className="px-5 py-4 font-bold text-[#46223e]">
                        <span>{row.item}</span>
                        {row.count > 1 && (
                          <span className="ml-2 text-[9px] font-black bg-[#9720ab] text-white
                                           px-1.5 py-0.5 rounded-full">
                            x{row.count}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#9720ab] text-sm">
                          <Gem className="w-3 h-3" aria-hidden="true" />
                          {(row.price * row.count).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#B02E7A] text-sm">
                          <Star className="w-3 h-3" aria-hidden="true" />
                          {(row.experience * row.count).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-[#784e6c]">
                        {(row.units * row.count).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#00675f] text-sm">
                          <DollarSign className="w-3 h-3" aria-hidden="true" />
                          {(row.revenue * row.count).toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#ffd7f0]/50 border-t-2 border-[#d09ec0]/30">
                    <td colSpan={4}
                        className="px-5 py-3 text-xs font-black uppercase tracking-wider text-[#784e6c]">
                      Totals
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#9720ab]">—</td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#B02E7A]">
                      +{totalXP.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#784e6c]">—</td>
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
        {!loading && allItems.length > 0 && (
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
            <div className="w-16 h-16 bg-[#B02E7A]/10 rounded-2xl flex items-center justify-center shrink-0">
              <Lightbulb className="w-8 h-8 text-[#B02E7A] fill-[#B02E7A]/20" aria-hidden="true" />
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
            <div aria-hidden="true"
                 className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#B02E7A]/5 rounded-full border border-[#B02E7A]/10" />
            <div aria-hidden="true"
                 className="absolute -left-10 -top-10 w-40 h-40 bg-[#9720ab]/5 rounded-full border border-[#9720ab]/10" />
          </motion.section>
        )}
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
              whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} transition={SPRING}
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
