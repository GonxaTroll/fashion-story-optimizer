import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { User, Eye, EyeOff, ChevronDown } from 'lucide-react'
import {
  SPRING,
  useSaved,
  SavedBadge,
  BouncyToggle,
  PlayfulInput,
  ShimmerButton,
  SectionCard,
  SettingRow,
  Bell, Moon, Heart, Lock, LogOut,
} from '@/components/glimmer/optimizer-ui'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function authHeaders() {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface AccountTabProps {
  onSignOut: () => void
}

export default function AccountTab({ onSignOut }: AccountTabProps) {
  const shouldReduce = useReducedMotion() ?? false

  /* Profile */
  const [name, setName]               = useState('')
  const [boutiqueName, setBoutiqueName] = useState('')
  const [bio, setBio]                  = useState('')
  const [saving, setSaving]            = useState(false)
  const [loadError, setLoadError]      = useState('')
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
  const [pwError, setPwError]         = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew]         = useState(false)
  const [pwSaving, setPwSaving]       = useState(false)
  const pwSaved = useSaved()

  /* ── Fetch user on mount ── */
  useEffect(() => {
    fetch(`${API_BASE}/auth/me`, { headers: authHeaders() })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load profile')
        return r.json()
      })
      .then((data) => {
        setName(data.name ?? '')
        setBoutiqueName(data.boutique_name ?? '')
        setBio(data.bio ?? '')
        setNotifications(data.notifications ?? true)
        setDarkMode(data.dark_mode ?? false)
        setStayPlayful(data.stay_playful ?? true)
      })
      .catch(() => setLoadError('Could not load your profile. Please refresh.'))
  }, [])

  /* ── Patch helper ── */
  async function patchMe(fields: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(fields),
    })
    if (!res.ok) throw new Error('Save failed')
    return res.json()
  }

  const handleUpdateProfile = async () => {
    if (saving) return
    setSaving(true)
    try {
      await patchMe({ name, boutique_name: boutiqueName, bio })
      profileSaved.trigger()
    } catch {
      // surface nothing — user can retry
    } finally {
      setSaving(false)
    }
  }

  const handleSavePw = async () => {
    if (!currentPw || !newPw || pwSaving) return
    setPwError('')
    setPwSaving(true)
    try {
      const res = await fetch(`${API_BASE}/auth/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setPwError(data?.detail ?? 'Could not update password.')
        return
      }
      setCurrentPw('')
      setNewPw('')
      setPwOpen(false)
      pwSaved.trigger()
    } catch {
      setPwError('Could not reach the server.')
    } finally {
      setPwSaving(false)
    }
  }

  const handleToggle = (
    setter: (v: boolean) => void,
    field: string,
    savedHook: ReturnType<typeof useSaved>,
  ) => (v: boolean) => {
    setter(v)
    patchMe({ [field]: v }).catch(() => {})
    savedHook.trigger()
  }

  if (loadError) {
    return (
      <p className="text-sm font-semibold text-[#b41340] bg-[#fff0f4] border border-[#f74b6d]/20 rounded-xl px-4 py-3">
        {loadError}
      </p>
    )
  }

  return (
    <div className="space-y-8">

      {/* ── PROFILE SECTION ── */}
      <SectionCard title="Profile" icon={User} iconColor="#B02E7A" delay={0.1} shouldReduce={shouldReduce}>
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
              {name.charAt(0).toUpperCase() || '?'}
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
              {name || '—'}
            </p>
            <p className="text-xs text-[#966988] font-medium">{boutiqueName || 'Boutique Owner'}</p>
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
      <SectionCard title="Preferences" icon={Bell} iconColor="#9720ab" delay={0.15} shouldReduce={shouldReduce}>
        <SettingRow
          icon={Bell} iconColor="#9720ab" iconBg="#f3e8ff"
          title="Notifications" subtitle="Game updates, tips & weekly recaps"
          saved={notifSaved.saved}
          control={
            <BouncyToggle id="toggle-notif" label="Toggle notifications"
              checked={notifications} onChange={handleToggle(setNotifications, 'notifications', notifSaved)} />
          }
        />
        <SettingRow
          icon={Moon} iconColor="#784e6c" iconBg="#ffdff2"
          title="Light Mode" subtitle="Currently using Blush theme"
          saved={darkSaved.saved}
          control={
            <BouncyToggle id="toggle-dark" label="Toggle light mode"
              checked={!darkMode} onChange={(v) => handleToggle(setDarkMode, 'dark_mode', darkSaved)(!v)} />
          }
        />
        <SettingRow
          icon={Heart} iconColor="#B02E7A" iconBg="#ffdff2"
          title="Stay Playful" subtitle="Remember your session automatically"
          saved={playSaved.saved}
          last
          control={
            <BouncyToggle id="toggle-play" label="Toggle stay playful"
              checked={stayPlayful} onChange={handleToggle(setStayPlayful, 'stay_playful', playSaved)} />
          }
        />
      </SectionCard>

      {/* ── ACCOUNT SECTION ── */}
      <SectionCard title="Account" icon={Lock} iconColor="#46223e" delay={0.2} shouldReduce={shouldReduce}>
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
                  {pwError && (
                    <p className="text-xs font-semibold text-[#b41340] bg-[#fff0f4] border border-[#f74b6d]/20 rounded-xl px-4 py-2.5">
                      {pwError}
                    </p>
                  )}
                  <div className="flex items-center gap-3 pt-1">
                    <ShimmerButton onClick={handleSavePw} disabled={!currentPw || !newPw || pwSaving}>
                      {pwSaving ? 'Saving…' : 'Save Password'}
                    </ShimmerButton>
                    <button type="button"
                      onClick={() => { setPwOpen(false); setCurrentPw(''); setNewPw(''); setPwError('') }}
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

    </div>
  )
}
