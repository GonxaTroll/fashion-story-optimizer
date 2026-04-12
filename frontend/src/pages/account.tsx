import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, LogOut, Home, Calendar, Settings } from 'lucide-react'
import AccountTab from '@/components/AccountTab'
import AppFooter from '@/components/AppFooter'
import { SPRING } from '@/components/glimmer/optimizer-ui'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface Props {
  onSignOut: () => void
  onNavigate: (page: string) => void
}

const navLinks       = ['Home', 'Schedule', 'Optimizer', 'Account']
const mobileNavIcons = [Home, Calendar, Settings, User]

export default function AccountPage({ onSignOut, onNavigate }: Props) {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.name) setUserName(data.name) })
      .catch(() => {})
  }, [])

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
                    link === 'Home'      ? (e) => { e.preventDefault(); onNavigate('dashboard') } :
                    link === 'Schedule'  ? (e) => { e.preventDefault(); onNavigate('scheduler') } :
                    link === 'Optimizer' ? (e) => { e.preventDefault(); onNavigate('optimizer') } :
                    (e) => e.preventDefault()
                  }
                  className={`text-sm font-bold tracking-tight transition-all duration-150 focus:outline-none
                    focus:ring-2 focus:ring-[#B02E7A]/40 rounded px-1 py-0.5
                    ${i === 3
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={SPRING}
                aria-label="Account settings"
                className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#784e6c]
                           bg-[#B02E7A]/10 border border-[#B02E7A]/20 rounded-xl px-3 py-1.5
                           cursor-default focus:outline-none"
              >
                <User className="w-3.5 h-3.5 text-[#B02E7A]" aria-hidden="true" />
                {userName || '…'}
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

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-28">

        {/* ── HERO HEADER ── */}
        <div className="relative mb-14 overflow-visible">
          <div aria-hidden="true" className="absolute -top-6 -left-6 w-28 h-28 bg-[#56f1e0]/30 rounded-full blur-2xl pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#fcbcff]/30 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.05 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            <div
              className="flex items-center gap-2 bg-[#ffdff2] text-[#B02E7A] px-4 py-1.5
                          rounded-full text-xs font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              <User className="w-3 h-3" aria-hidden="true" />
              Account
            </div>

            <h1
              className="text-4xl md:text-5xl font-black text-[#46223e] leading-tight
                         tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Your Profile
            </h1>
            <p className="text-[#784e6c] max-w-md font-medium text-sm leading-relaxed">
              Manage your boutique identity, preferences, and account security.
            </p>
          </motion.div>
        </div>

        <AccountTab onSignOut={onSignOut} />

      </main>

      <AppFooter />

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
