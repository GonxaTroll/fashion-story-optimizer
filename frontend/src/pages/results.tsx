import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Sparkles, LogOut, Home, Calendar, Settings, BarChart2,
  Star, Gem, DollarSign, LayoutGrid, List, Lightbulb,
  Shield, Glasses, Zap, CircleDot, Headphones, User, Clock, Download, Coins,
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
  hourCounts: Record<number, number>
  item: string
  price: number
  experience: number
  units: number
  revenue: number
  duration: number
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
    const titleMap = new Map<string, ApiResultItem & { hours: number[]; totalCount: number; hourCounts: Record<number, number> }>()
    apiItems.forEach((r) => {
      if (!titleMap.has(r.title)) {
        titleMap.set(r.title, { ...r, hours: [r.hour], totalCount: 1, hourCounts: { [r.hour]: 1 } })
      } else {
        const entry = titleMap.get(r.title)!
        entry.totalCount++
        if (!entry.hours.includes(r.hour)) entry.hours.push(r.hour)
        entry.hourCounts[r.hour] = (entry.hourCounts[r.hour] ?? 0) + 1
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
          hourCounts: r.hourCounts,
          item: r.title,
          price: r.cost,
          experience: r.xp,
          units: r.units,
          revenue: r.revenue,
          duration: r.duration,
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

function flatHourToDatetime(flatHour: number, optimizedAt: string | null): string {
  const base = optimizedAt ? new Date(optimizedAt) : new Date()
  base.setHours(0, 0, 0, 0)
  base.setDate(base.getDate() + Math.floor(flatHour / 24))
  const hour = flatHour % 24
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${base.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(base.getDate())} ${pad(hour)}:00`
}

function exportCsv(results: ApiResultItem[], optimizedAt: string | null) {
  const headers = ['Datetime', 'Slot', 'Collection', 'Title', 'Duration (h)', 'Cost', 'Revenue', 'XP', 'Units', 'Order Position']
  const rows = [...results]
    .sort((a, b) => a.slot - b.slot || a.hour - b.hour)
    .map((r) => [
      `"${flatHourToDatetime(r.hour, optimizedAt)}"`,
      r.slot,
      `"${r.collection.replace(/"/g, '""')}"`,
      `"${r.title.replace(/"/g, '""')}"`,
      r.duration,
      r.cost,
      r.revenue,
      r.xp,
      r.units,
      r.order_position ?? '',
    ])

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  const date = optimizedAt ? new Date(optimizedAt).toISOString().slice(0, 10) : 'export'
  a.href     = url
  a.download = `fashstopt-results-${date}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ─── Timeline Item Card (compact) ─── */
function TimelineCard({ item, hourCount, delay, shouldReduce }: {
  item: Item & { collection: string; collectionColor: string }
  hourCount: number
  delay: number
  shouldReduce: boolean
}) {
  const Icon = item.icon
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ delay, duration: 0.25 }}
      whileHover={shouldReduce ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-xl px-3 py-2 flex items-center gap-2.5 min-w-0
                 shadow-[0_2px_8px_rgba(176,46,122,0.07)]
                 hover:shadow-[0_6px_20px_rgba(176,46,122,0.13)]
                 transition-shadow duration-200 cursor-default"
    >
      {/* Icon + position badge */}
      <div className="relative shrink-0">
        <div className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-[#B02E7A]" aria-hidden="true" />
        </div>
        {item.orderPosition != null && (
          <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bubblegum-gradient
                           text-white text-[8px] font-black flex items-center justify-center shadow-sm">
            {item.orderPosition}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${item.tagColor}`}>
            {item.item.split(' ').slice(-1)[0]}
          </span>
          {hourCount > 1 && (
            <span className="text-[9px] font-black bg-[#9720ab] text-white px-1.5 py-0.5 rounded-full shrink-0">
              x{hourCount}
            </span>
          )}
        </div>
        <p className="font-black text-xs text-[#46223e] truncate leading-tight mt-0.5"
           style={{ fontFamily: 'var(--font-headline)' }}>
          {item.item}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#784e6c]">
            <Coins className="w-2.5 h-2.5" aria-hidden="true" />
            {item.price.toLocaleString()}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#00675f]">
            <Coins className="w-2.5 h-2.5" aria-hidden="true" />
            {item.revenue.toLocaleString()}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#B02E7A]">
            <Star className="w-2.5 h-2.5" aria-hidden="true" />
            {item.experience.toLocaleString()}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#966988]">
            <Clock className="w-2.5 h-2.5" aria-hidden="true" />
            {item.duration}h
          </span>
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
  const [rawResults, setRawResults]   = useState<ApiResultItem[]>([])
  const shouldReduce = useReducedMotion() ?? false

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    fetch(`${API_BASE}/optimize/latest`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() as Promise<ApiResponse> : Promise.reject(r.status))
      .then((data) => {
        setOptimizedAt(data.optimization_date)
        setRawResults(data.results)
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
  const totalCost    = allItems.reduce((s, i) => s + i.price * i.count, 0)
  const totalItems   = allItems.reduce((s, i) => s + i.count, 0)

  // Day 0 = the date optimization was run (horizon starts that day)
  function horizonBase(): Date {
    const base = optimizedAt ? new Date(optimizedAt) : new Date()
    base.setHours(0, 0, 0, 0)
    return base
  }

  // Format a flat hour (0-167) as an actual calendar time (opt date = hour 0)
  function formatFlatHour(flatHour: number): string {
    const base = horizonBase()
    const d = new Date(base)
    d.setDate(d.getDate() + Math.floor(flatHour / 24))
    const hour = flatHour % 24
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      + ` ${String(hour).padStart(2, '0')}:00`
  }

  const summaryChips = [
    { label: 'Total XP',        value: `+${totalXP.toLocaleString()}`,      icon: Star,       color: 'text-[#B02E7A]' },
    { label: 'Total Cost',      value: totalCost.toLocaleString(),           icon: Coins,      color: 'text-[#784e6c]' },
    { label: 'Total Revenue',   value: `${totalRevenue.toLocaleString()} G`, icon: Coins,      color: 'text-[#00675f]' },
    { label: 'Items Scheduled', value: totalItems.toLocaleString(),          icon: Gem,        color: 'text-[#9720ab]' },
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

          {/* View toggle + CSV download — only when there are results */}
          {!loading && allItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap justify-center items-center gap-3 mb-8"
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

              <motion.button
                whileHover={shouldReduce ? {} : { scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                onClick={() => exportCsv(rawResults, optimizedAt)}
                className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm
                           bg-white border-2 border-[#B02E7A]/20 text-[#B02E7A]
                           hover:bg-[#ffdff2] hover:border-[#B02E7A]/40
                           transition-colors duration-200 cursor-pointer shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40"
                aria-label="Download results as CSV"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                Export CSV
              </motion.button>
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
          // Day 0 = optimization date (horizon starts the day optimization was run)
          const baseDate = horizonBase()

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

          // Group by day, then by hour within each day
          const byDay = new Map<number, Map<number, typeof entries>>()
          entries.forEach((e) => {
            const day  = Math.floor(e.flatHour / 24)
            const hour = e.flatHour % 24
            if (!byDay.has(day)) byDay.set(day, new Map())
            const hourMap = byDay.get(day)!
            if (!hourMap.has(hour)) hourMap.set(hour, [])
            hourMap.get(hour)!.push(e)
          })

          return (
            <motion.div
              key="visual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8 mb-16"
            >
              {Array.from(byDay.entries()).map(([day, hourMap]) => {
                const totalItems = Array.from(hourMap.values()).reduce((s, g) => s + g.length, 0)
                return (
                <div key={day}>
                  {/* Day header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-base font-black text-[#B02E7A]"
                          style={{ fontFamily: 'var(--font-headline)' }}>
                      {dayHeader(day)}
                    </span>
                    <div className="flex-1 h-px bg-[#d09ec0]/30" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#966988]">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Timeline entries — one row per hour */}
                  <div className="relative pl-2">
                    {/* Vertical line */}
                    <div className="absolute left-[3.25rem] top-0 bottom-0 w-px bg-[#d09ec0]/40" aria-hidden="true" />

                    <div className="flex flex-col">
                      {Array.from(hourMap.entries()).map(([hour, hourEntries], hi) => (
                        <motion.div
                          key={hour}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-24px' }}
                          transition={{ delay: hi * 0.05, duration: 0.25 }}
                          className="flex items-start gap-3 py-2.5
                                     border-b border-dashed border-[#d09ec0]/40
                                     last:border-b-0 last:pb-0 first:pt-0"
                        >
                          {/* Time bubble */}
                          <div className="shrink-0 flex flex-col items-center w-14">
                            <div className="w-14 bg-[#ffd7f0] rounded-lg px-1 py-1
                                            flex flex-col items-center shadow-sm
                                            border border-[#d09ec0]/20">
                              <span className="text-[9px] font-black uppercase tracking-wide text-[#966988]">
                                {dayShort(day)}
                              </span>
                              <span className="text-sm font-black text-[#B02E7A] leading-none"
                                    style={{ fontFamily: 'var(--font-headline)' }}>
                                {String(hour).padStart(2, '0')}:00
                              </span>
                            </div>
                            <div className="w-2 h-2 rounded-full bubblegum-gradient mt-1 shadow-sm" />
                          </div>

                          {/* Cards for this hour — wrap if many */}
                          <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                            {hourEntries.map((entry, ci) => (
                              <div key={`${entry.flatHour}-${entry.item.item}`}
                                   className="flex-1 min-w-[200px] max-w-xs">
                                <TimelineCard
                                  item={entry.item}
                                  hourCount={entry.item.hourCounts[entry.flatHour] ?? 1}
                                  delay={ci * 0.04}
                                  shouldReduce={shouldReduce}
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )})}
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
                    {['Pos', 'Scheduled', 'Collection', 'Item', 'Duration', 'Cost', 'Revenue', 'XP', 'Units'].map((label) => (
                      <th key={label}
                          className={`px-5 py-4 text-xs font-black uppercase tracking-wider text-[#784e6c]
                                     ${['Duration', 'Cost', 'Revenue', 'XP', 'Units'].includes(label) ? 'text-right' : ''}`}>
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
                        <span className="inline-flex items-center gap-1 font-bold text-[#966988] text-sm">
                          <Clock className="w-3 h-3" aria-hidden="true" />
                          {row.duration}h
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#784e6c] text-sm">
                          <Coins className="w-3 h-3" aria-hidden="true" />
                          {(row.price * row.count).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-[#00675f] text-sm">
                          <Coins className="w-3 h-3 text-[#00675f]" aria-hidden="true" />
                          {(row.revenue * row.count).toLocaleString()}
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
                    </motion.tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#ffd7f0]/50 border-t-2 border-[#d09ec0]/30">
                    <td colSpan={4}
                        className="px-5 py-3 text-xs font-black uppercase tracking-wider text-[#784e6c]">
                      Totals
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#966988]">—</td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#784e6c]">
                      {totalCost.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#00675f]">
                      {totalRevenue.toLocaleString()} G
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#B02E7A]">
                      +{totalXP.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-black text-[#784e6c]">—</td>
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
