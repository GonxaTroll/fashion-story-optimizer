import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Sparkles, ArrowLeft, User,
  Bell, Moon, Heart, Lock, LogOut, Check,
  Eye, EyeOff, ChevronDown,
} from 'lucide-react'

/* ─── Spring constants (user spec: stiffness 300, damping 30) ─── */
const SPRING = { type: 'spring', stiffness: 300, damping: 30 } as const
const SPRING_FAST = { type: 'spring', stiffness: 400, damping: 28 } as const

/* ─── Hook: "Saved ✓" flash ─── */
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
   SAVED BADGE  — fades in/out elegantly
   ════════════════════════════════════════ */
function SavedBadge({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.9 }}
          transition={SPRING}
          className="inline-flex items-center gap-1 text-xs font-bold text-[#00675f]
                     bg-[#edfff9] rounded-full px-2.5 py-1"
        >
          <Check className="w-3 h-3" aria-hidden="true" />
          Saved
        </motion.span>
      )}
    </AnimatePresence>
  )
}

/* ════════════════════════════════════════
   BOUNCY TOGGLE  — spring thumb + glow
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
          ? { boxShadow: '0 0 14px rgba(176,46,122,0.35), 0 2px 8px rgba(176,46,122,0.20)' }
          : undefined
      }
    >
      <motion.div
        layout
        animate={{ x: checked ? 22 : 0 }}
        transition={SPRING}
        className="absolute top-[4px] left-[4px] w-6 h-6 bg-white rounded-full shadow-md"
      />
    </button>
  )
}

/* ════════════════════════════════════════
   PLAYFUL INPUT  — sign-in style
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
     focus:border-[#B02E7A]/30 soft-well transition-all duration-150 text-sm cursor-text resize-none`
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-bold text-[#784e6c] ml-1 flex items-center gap-1.5">
        {label}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            rows={3}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={shared}
          />
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
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
   SHIMMER BUTTON  — 21st.dev Shiny style
   ════════════════════════════════════════ */
interface ShimmerBtnProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
  className?: string
}
function ShimmerButton({ children, onClick, disabled = false, danger = false, className = '' }: ShimmerBtnProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={SPRING_FAST}
      className={`relative overflow-hidden rounded-full font-black text-sm py-3 px-8
                  cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${danger
                    ? 'bg-[#fff0f4] text-[#b41340] hover:bg-[#ffe0e8] focus:ring-[#b41340]/40 border border-[#f74b6d]/20'
                    : 'bubblegum-gradient text-white shadow-[0_10px_28px_rgba(168,33,110,0.28)] focus:ring-[#B02E7A]/50'
                  }
                  ${className}`}
      style={{ fontFamily: 'var(--font-headline)' }}
    >
      {/* Shimmer sweep overlay */}
      {!disabled && !danger && (
        <span
          aria-hidden="true"
          className="shimmer-sweep absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.38) 50%, transparent 80%)',
            width: '60%',
          }}
        />
      )}
      <span className="relative flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  )
}

/* ════════════════════════════════════════
   SETTING ROW  — icon + text + control
   (Golden Ratio: py-5 = 20px between rows)
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
function SettingRow({
  icon: Icon, iconColor, iconBg, title, subtitle, control, saved = false, last = false,
}: SettingRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 py-5
                  ${last ? '' : 'border-b border-[#ffecf5]'}`}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-[#46223e]" style={{ fontFamily: 'var(--font-headline)' }}>
              {title}
            </p>
            <SavedBadge visible={saved} />
          </div>
          {subtitle && (
            <p className="text-xs text-[#966988] font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

/* ════════════════════════════════════════
   SECTION CARD  — white card with header
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
        {/* Section header */}
        <div className="flex items-center gap-3 px-8 pt-7 pb-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${iconColor}18` }}
          >
            <Icon className="w-4 h-4" style={{ color: iconColor }} aria-hidden="true" />
          </div>
          <h2
            className="text-xs font-black uppercase tracking-[0.12em] text-[#784e6c]"
            style={{ fontFamily: 'var(--font-headline)' }}
          >
            {title}
          </h2>
        </div>
        {/* Section content */}
        <div className="px-8 pb-6">{children}</div>
      </div>
    </motion.section>
  )
}

/* ════════════════════════════════════════
   MAIN SETTINGS PAGE
   ════════════════════════════════════════ */
interface Props {
  onBack: () => void
  onSignOut: () => void
}

export default function SettingsPage({ onBack, onSignOut }: Props) {
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
  const notifSaved  = useSaved()
  const darkSaved   = useSaved()
  const playSaved   = useSaved()

  /* Change password */
  const [pwOpen, setPwOpen]         = useState(false)
  const [currentPw, setCurrentPw]   = useState('')
  const [newPw, setNewPw]           = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [pwSaving, setPwSaving]       = useState(false)
  const pwSaved = useSaved()

  const shouldReduce = useReducedMotion() ?? false

  const handleUpdateProfile = () => {
    if (saving) return
    setSaving(true)
    setTimeout(() => { setSaving(false); profileSaved.trigger() }, 1300)
  }

  const handleSavePw = () => {
    if (!currentPw || !newPw || pwSaving) return
    setPwSaving(true)
    setTimeout(() => {
      setPwSaving(false)
      setCurrentPw('')
      setNewPw('')
      setPwOpen(false)
      pwSaved.trigger()
    }, 1200)
  }

  const handleToggle = (
    setter: (v: boolean) => void,
    savedHook: ReturnType<typeof useSaved>,
  ) => (v: boolean) => {
    setter(v)
    savedHook.trigger()
  }

  return (
    <div className="min-h-screen bg-[#FFF5F8] overflow-x-hidden">

      {/* ── NAVIGATION ── */}
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 bg-[#FFF5F8]/80 backdrop-blur-xl
                   shadow-[0_20px_40px_rgba(70,34,62,0.06)] rounded-b-[2rem]"
      >
        <div className="flex justify-between items-center px-8 py-4 max-w-4xl mx-auto">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={SPRING_FAST}
            aria-label="Back to dashboard"
            className="flex items-center gap-2 text-sm font-bold text-[#784e6c]
                       hover:text-[#B02E7A] hover:bg-[#ffdff2] px-3 py-2 rounded-xl
                       transition-colors duration-150 cursor-pointer focus:outline-none
                       focus:ring-2 focus:ring-[#B02E7A]/40"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Dashboard</span>
          </motion.button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ffdff2] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#B02E7A]" aria-hidden="true" />
            </div>
            <span
              className="text-lg font-black italic text-[#B02E7A]"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              FashStOpt
            </span>
          </div>

          <div className="w-24" aria-hidden="true" /> {/* Balance spacer */}
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* ── HERO HEADER (Stitch-style) ── */}
        <div className="relative mb-12 overflow-visible">
          {/* Decorative blobs */}
          <div
            aria-hidden="true"
            className="absolute -top-6 -left-6 w-28 h-28 bg-[#56f1e0]/30 rounded-full blur-2xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#fcbcff]/30 rounded-full blur-3xl pointer-events-none"
          />

          <motion.div
            initial={shouldReduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.05 }}
            className="relative z-10 flex flex-col items-center text-center"
          >
            {/* FashStOpt badge */}
            <div className="flex items-center gap-2 bg-[#fcbcff] text-[#7c0091] px-4 py-1.5
                            rounded-full text-xs font-black uppercase tracking-widest mb-4"
                 style={{ fontFamily: 'var(--font-headline)' }}>
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              Profile Settings
            </div>

            <h1
              className="text-4xl md:text-5xl font-black text-[#46223e] leading-tight
                         tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Refine Your Boutique
            </h1>
            <p className="text-[#784e6c] max-w-md font-medium text-sm leading-relaxed">
              Personalize your FashStOpt experience — update your profile, tune your preferences,
              and manage your account.
            </p>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════
            SETTINGS LAYOUT
            Golden ratio spacing:
            - Row padding: py-5  (20px)
            - Between cards: mt-8 (32px ≈ 20×1.618)
            - Between sections: space-y-8 (32px)
            ══════════════════════════════════════ */}
        <div className="space-y-8">

          {/* ── PROFILE SECTION ── */}
          <SectionCard
            title="Profile"
            icon={User}
            iconColor="#B02E7A"
            delay={0.1}
            shouldReduce={shouldReduce}
          >
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
                {/* Camera badge */}
                <button
                  type="button"
                  aria-label="Change avatar"
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#B02E7A] rounded-full
                             flex items-center justify-center border-2 border-white cursor-pointer
                             hover:bg-[#980f61] transition-colors duration-150 focus:outline-none
                             focus:ring-2 focus:ring-[#B02E7A]/50"
                >
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
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

            {/* Name */}
            <div className="py-5 border-b border-[#ffecf5]">
              <PlayfulInput
                id="profile-name"
                label="Display Name"
                placeholder="Your name"
                value={name}
                onChange={setName}
              />
            </div>

            {/* Boutique Name */}
            <div className="py-5 border-b border-[#ffecf5]">
              <PlayfulInput
                id="boutique-name"
                label="Boutique Name"
                placeholder="e.g. Glimmer HQ"
                value={boutiqueName}
                onChange={setBoutiqueName}
              />
            </div>

            {/* Bio */}
            <div className="py-5 border-b border-[#ffecf5]">
              <PlayfulInput
                id="bio"
                label="Bio"
                placeholder="Tell the fashion world about you…"
                value={bio}
                onChange={setBio}
                multiline
              />
            </div>

            {/* Update button row */}
            <div className="pt-5 flex items-center gap-4">
              <ShimmerButton onClick={handleUpdateProfile} disabled={saving}>
                {saving ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
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
          <SectionCard
            title="Preferences"
            icon={Bell}
            iconColor="#9720ab"
            delay={0.15}
            shouldReduce={shouldReduce}
          >
            <SettingRow
              icon={Bell}
              iconColor="#9720ab"
              iconBg="#f3e8ff"
              title="Notifications"
              subtitle="Game updates, tips & weekly recaps"
              saved={notifSaved.saved}
              control={
                <BouncyToggle
                  id="toggle-notif"
                  label="Toggle notifications"
                  checked={notifications}
                  onChange={handleToggle(setNotifications, notifSaved)}
                />
              }
            />
            <SettingRow
              icon={Moon}
              iconColor="#784e6c"
              iconBg="#ffdff2"
              title="Light Mode"
              subtitle="Currently using Blush theme"
              saved={darkSaved.saved}
              control={
                <BouncyToggle
                  id="toggle-dark"
                  label="Toggle light mode"
                  checked={!darkMode}
                  onChange={(v) => handleToggle(setDarkMode, darkSaved)(!v)}
                />
              }
            />
            <SettingRow
              icon={Heart}
              iconColor="#B02E7A"
              iconBg="#ffdff2"
              title="Stay Playful"
              subtitle="Remember your session automatically"
              saved={playSaved.saved}
              last
              control={
                <BouncyToggle
                  id="toggle-play"
                  label="Toggle stay playful"
                  checked={stayPlayful}
                  onChange={handleToggle(setStayPlayful, playSaved)}
                />
              }
            />
          </SectionCard>

          {/* ── ACCOUNT SECTION ── */}
          <SectionCard
            title="Account"
            icon={Lock}
            iconColor="#46223e"
            delay={0.2}
            shouldReduce={shouldReduce}
          >
            {/* Change Password row — expandable */}
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
                <motion.div
                  animate={{ rotate: pwOpen ? 180 : 0 }}
                  transition={SPRING}
                >
                  <ChevronDown className="w-5 h-5 text-[#966988] group-hover:text-[#B02E7A] transition-colors" aria-hidden="true" />
                </motion.div>
              </button>

              {/* Expandable password form */}
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
                        id="current-pw"
                        label="Current Password"
                        type={showCurrent ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={currentPw}
                        onChange={setCurrentPw}
                        rightSlot={
                          <button
                            type="button"
                            aria-label={showCurrent ? 'Hide password' : 'Show password'}
                            onClick={() => setShowCurrent((v) => !v)}
                            className="text-[#966988] hover:text-[#B02E7A] transition-colors
                                       cursor-pointer focus:outline-none"
                          >
                            {showCurrent
                              ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                              : <Eye className="w-4 h-4" aria-hidden="true" />}
                          </button>
                        }
                      />
                      <PlayfulInput
                        id="new-pw"
                        label="New Password"
                        type={showNew ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPw}
                        onChange={setNewPw}
                        rightSlot={
                          <button
                            type="button"
                            aria-label={showNew ? 'Hide password' : 'Show password'}
                            onClick={() => setShowNew((v) => !v)}
                            className="text-[#966988] hover:text-[#B02E7A] transition-colors
                                       cursor-pointer focus:outline-none"
                          >
                            {showNew
                              ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                              : <Eye className="w-4 h-4" aria-hidden="true" />}
                          </button>
                        }
                      />
                      <div className="flex items-center gap-3 pt-1">
                        <ShimmerButton
                          onClick={handleSavePw}
                          disabled={!currentPw || !newPw || pwSaving}
                        >
                          {pwSaving ? 'Saving…' : 'Save Password'}
                        </ShimmerButton>
                        <button
                          type="button"
                          onClick={() => { setPwOpen(false); setCurrentPw(''); setNewPw('') }}
                          className="text-xs font-bold text-[#966988] hover:text-[#46223e]
                                     transition-colors duration-150 cursor-pointer px-3 py-2
                                     focus:outline-none focus:ring-1 focus:ring-[#966988] rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sign Out row */}
            <SettingRow
              icon={LogOut}
              iconColor="#b41340"
              iconBg="#fff0f4"
              title="Sign Out"
              subtitle="End your current session"
              last
              control={
                <ShimmerButton danger onClick={onSignOut}>
                  Sign Out
                </ShimmerButton>
              }
            />
          </SectionCard>
        </div>

        {/* Bottom breathing room */}
        <div className="h-16" />
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-[#ffd7f0] rounded-t-[2rem] py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
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
    </div>
  )
}
