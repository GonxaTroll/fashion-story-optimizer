import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  X, Sparkles, Info, HeadphonesIcon, Shield, FileText,
  Mail, ExternalLink, ChevronRight, AlertCircle,
} from 'lucide-react'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

export type FooterTab = 'about' | 'support' | 'privacy' | 'terms'

const TABS: { id: FooterTab; label: string; icon: React.ElementType }[] = [
  { id: 'about',   label: 'About',   icon: Info           },
  { id: 'support', label: 'Support', icon: HeadphonesIcon },
  { id: 'privacy', label: 'Privacy', icon: Shield         },
  { id: 'terms',   label: 'Terms',   icon: FileText       },
]

/* ── small helper components ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-sm font-black text-[#46223e] uppercase tracking-widest mb-3"
          style={{ fontFamily: 'var(--font-headline)' }}>
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-[#784e6c] font-medium leading-relaxed">{children}</p>
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 bg-[#FFF5F8] border border-[#ffd7f0] rounded-xl px-4 py-3">
      <ChevronRight className="w-3.5 h-3.5 text-[#B02E7A] shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-xs text-[#966988] font-semibold leading-relaxed">{children}</p>
    </div>
  )
}

function Badge({ children, color = '#ffdff2', text = '#B02E7A' }: { children: React.ReactNode; color?: string; text?: string }) {
  return (
    <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color, color: text }}>
      {children}
    </span>
  )
}

/* ════════════════════════════════════════════
   TAB CONTENT
   ════════════════════════════════════════════ */

function AboutContent() {
  return (
    <div>
      {/* Hero blurb */}
      <div className="bg-gradient-to-br from-[#ffdff2] to-[#f3e8ff] rounded-2xl p-6 mb-7 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full shadow-md mb-4">
          <Sparkles className="w-7 h-7 text-[#B02E7A]" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-black text-[#46223e] mb-1"
            style={{ fontFamily: 'var(--font-headline)' }}>
          FashStOpt
        </h2>
        <p className="text-xs font-bold text-[#966988] uppercase tracking-widest mb-3">
          Fashion Story Optimizer
        </p>
        <p className="text-sm text-[#784e6c] font-medium leading-relaxed max-w-sm mx-auto">
          A free, open tool to help you play{' '}
          <span className="font-black text-[#B02E7A]">Fashion Story</span> smarter —
          not longer.
        </p>
      </div>

      <Section title="What it does">
        <P>
          FashStOpt solves a <span className="font-black text-[#46223e]">Mixed Integer Linear Program (MILP)</span> to
          find the optimal item-to-hour schedule for your Fashion Story boutique.
          Given your availability and goals, it maximizes the combination of coins, XP, and gems
          you earn across your play sessions.
        </P>
        <P>
          You set your weekly availability in the Scheduler, pick your optimization goals
          (Revenue, XP, or Gems), and hit Run — the solver does the rest in seconds.
        </P>
      </Section>

      <Section title="How the optimizer works">
        <Tip>Each clothing item has a fixed sale duration and yield. The solver assigns items to hours such that the total reward across the week is maximized.</Tip>
        <Tip>It respects your available hours so you never get a schedule you can't follow.</Tip>
        <Tip>Multiple slots let you run several items simultaneously, the same way the game works.</Tip>
      </Section>

      <Section title="The project">
        <P>
          FashStOpt is an independent fan project, not affiliated with Storm8 Studios in any way.
          It was built to scratch a personal itch: figuring out the most efficient play pattern
          without spending hours with a spreadsheet.
        </P>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge>v0.1.0</Badge>
          <Badge color="#d1faf5" text="#00675f">Open Source</Badge>
          <Badge color="#f3e8ff" text="#9720ab">React + FastAPI</Badge>
          <Badge color="#fef3c7" text="#d97706">DuckDB</Badge>
        </div>
      </Section>

      <Section title="The game">
        <P>
          Fashion Story™ is a boutique simulation game by{' '}
          <span className="font-black text-[#46223e]">Storm8 Studios</span>,
          available on iOS and Android. This tool references in-game item data
          for optimization purposes only.
        </P>
        <div className="flex flex-wrap gap-3 mt-3">
          <a href="https://apps.apple.com/co/app/fashion-story/id420590864"
             target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1.5 text-xs font-bold text-[#46223e]
                        bg-[#ffecf5] hover:bg-[#ffdff2] rounded-xl px-3 py-2
                        transition-colors duration-150 cursor-pointer
                        focus:outline-none focus:ring-1 focus:ring-[#B02E7A]">
            App Store <ExternalLink className="w-3 h-3 text-[#966988]" aria-hidden="true" />
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.teamlava.fashionstory&hl=es"
             target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1.5 text-xs font-bold text-[#46223e]
                        bg-[#ffecf5] hover:bg-[#ffdff2] rounded-xl px-3 py-2
                        transition-colors duration-150 cursor-pointer
                        focus:outline-none focus:ring-1 focus:ring-[#B02E7A]">
            Google Play <ExternalLink className="w-3 h-3 text-[#966988]" aria-hidden="true" />
          </a>
        </div>
      </Section>
    </div>
  )
}

function SupportContent() {
  const faqs = [
    {
      q: 'My results page is empty. What do I do?',
      a: "You need to run the optimizer first. Go to the Optimizer page, configure your goals and slots, then click Run Optimizer. Once it finishes you'll see results here and on the home page.",
    },
    {
      q: "The optimizer doesn't respect my schedule.",
      a: 'Make sure you have saved your schedule on the Scheduler page. The hours you mark green are the only hours the optimizer will assign items to. If nothing is marked, the solver has no valid slots.',
    },
    {
      q: 'How do I maximize revenue vs. XP?',
      a: 'On the Optimizer page, select only Revenue under Optimization Goal for pure coin gains. Select XP for experience. You can select both to get a balanced result.',
    },
    {
      q: 'What does "Full Collection" mode do?',
      a: 'When enabled, the optimizer is forced to include at least one item from every collection you have. This mirrors the game bonus for displaying full collections in your boutique.',
    },
    {
      q: 'Can I export my schedule?',
      a: 'Yes — on the Results page there is a CSV export button. Download it and keep it open on your phone while you play.',
    },
    {
      q: 'I forgot my password.',
      a: 'Go to the Sign In page, click "Forgot?", and follow the instructions. If that does not work, contact support via email below.',
    },
  ]

  return (
    <div>
      <Section title="Frequently Asked Questions">
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details key={q}
              className="group bg-[#FFF5F8] border border-[#ffd7f0] rounded-2xl overflow-hidden cursor-pointer">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 text-sm font-bold
                                  text-[#46223e] list-none select-none
                                  hover:bg-[#ffdff2] transition-colors duration-150">
                {q}
                <ChevronRight className="w-4 h-4 text-[#B02E7A] shrink-0 transition-transform
                                         duration-200 group-open:rotate-90" aria-hidden="true" />
              </summary>
              <div className="px-5 pb-4">
                <p className="text-sm text-[#784e6c] font-medium leading-relaxed">{a}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      <Section title="Known Limitations">
        <Tip>Item data (duration, revenue, XP) is manually curated and may not reflect the latest game updates.</Tip>
        <Tip>The optimizer assumes you open the app exactly on the hour. Real-world timing may cause slight deviations.</Tip>
        <Tip>Gem income from star ratings is not included in the current model.</Tip>
      </Section>

      <Section title="Get in touch">
        <P>Found a bug, have a suggestion, or want to report incorrect item data?</P>
        <a href="mailto:support@fashstopt.com"
           className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-[#B02E7A]
                      bg-[#ffdff2] hover:bg-[#ffbfe8] rounded-xl px-4 py-2.5
                      transition-colors duration-150 cursor-pointer
                      focus:outline-none focus:ring-1 focus:ring-[#B02E7A]">
          <Mail className="w-4 h-4" aria-hidden="true" />
          support@fashstopt.com
        </a>
      </Section>

      <Section title="Source code">
        <P>FashStOpt is open source. Contributions, bug reports, and feature requests are welcome on GitHub.</P>
        <a href="https://github.com/GonxaTroll/fashion-story-optimizer" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-[#46223e]
                      bg-[#ffecf5] hover:bg-[#ffdff2] rounded-xl px-4 py-2.5
                      transition-colors duration-150 cursor-pointer
                      focus:outline-none focus:ring-1 focus:ring-[#B02E7A]">
          <GithubIcon className="w-4 h-4" />
          View on GitHub
          <ExternalLink className="w-3 h-3 text-[#966988]" aria-hidden="true" />
        </a>
      </Section>
    </div>
  )
}

function PrivacyContent() {
  return (
    <div>
      <div className="flex items-start gap-3 bg-[#d1faf5] border border-[#56f1e0]/40 rounded-2xl px-5 py-4 mb-7">
        <Shield className="w-5 h-5 text-[#00675f] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm font-semibold text-[#00675f] leading-relaxed">
          FashStOpt is designed with minimal data collection. We do not sell, rent, or share
          your personal data with any third party.
        </p>
      </div>

      <Section title="What we collect">
        <P><span className="font-black text-[#46223e]">Account data:</span> Your email address and a bcrypt-hashed password, used solely to authenticate you.</P>
        <P><span className="font-black text-[#46223e]">Schedule data:</span> The weekly availability grid you configure in the Scheduler.</P>
        <P><span className="font-black text-[#46223e]">Optimization results:</span> The output of each optimization run, linked to your account so you can retrieve it later.</P>
        <P><span className="font-black text-[#46223e]">Profile preferences:</span> Display name, boutique name, optional bio, and UI toggles (notifications, dark mode, stay playful).</P>
      </Section>

      <Section title="What we do NOT collect">
        <Tip>No tracking pixels, analytics scripts, or third-party cookies.</Tip>
        <Tip>No device identifiers, IP address logs, or location data.</Tip>
        <Tip>No payment information — FashStOpt is completely free.</Tip>
        <Tip>No data from the Fashion Story game app itself.</Tip>
      </Section>

      <Section title="Data storage">
        <P>
          All data is stored in a <span className="font-black text-[#46223e]">DuckDB database</span> on
          the server. Passwords are never stored in plain text — only bcrypt hashes with a
          per-password salt are stored.
        </P>
        <P>
          Authentication tokens (JWT) are stored in your browser's <code className="text-xs bg-[#ffecf5] px-1.5 py-0.5 rounded font-mono text-[#B02E7A]">localStorage</code>.
          They expire after 24 hours. Clearing your browser storage logs you out immediately.
        </P>
      </Section>

      <Section title="Your rights">
        <P>You can delete your account and all associated data at any time by contacting us at{' '}
          <a href="mailto:support@fashstopt.com"
             className="font-bold text-[#B02E7A] hover:underline underline-offset-2">
            support@fashstopt.com
          </a>.
          We will remove your record within 7 days.
        </P>
      </Section>

      <Section title="Changes to this policy">
        <P>
          If we make material changes to this Privacy Policy, we will update the date at the
          bottom of this page. Continued use of FashStOpt after changes constitutes acceptance
          of the updated policy.
        </P>
        <p className="text-xs text-[#966988] font-semibold mt-3">Last updated: April 2026</p>
      </Section>
    </div>
  )
}

function TermsContent() {
  return (
    <div>
      <div className="flex items-start gap-3 bg-[#fff0f4] border border-[#f74b6d]/20 rounded-2xl px-5 py-4 mb-7">
        <AlertCircle className="w-5 h-5 text-[#b41340] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm font-semibold text-[#b41340] leading-relaxed">
          FashStOpt is an independent fan tool and is <span className="font-black">not affiliated with,
          endorsed by, or connected to Storm8 Studios</span> in any way.
          Fashion Story™ is a trademark of Storm8 Studios.
        </p>
      </div>

      <Section title="Acceptance">
        <P>
          By accessing or using FashStOpt ("the Service"), you agree to be bound by these Terms of Use.
          If you do not agree, please do not use the Service.
        </P>
      </Section>

      <Section title="Use of the Service">
        <P>FashStOpt is provided for personal, non-commercial use only. You agree not to:</P>
        <div className="space-y-1.5 mt-2">
          {[
            'Use the Service for any unlawful purpose or in violation of any regulations.',
            'Attempt to reverse-engineer, scrape, or extract data from the Service in bulk.',
            'Share your account credentials with others or create accounts on behalf of third parties.',
            "Interfere with the Service's infrastructure, servers, or security mechanisms.",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B02E7A] shrink-0 mt-1.5" />
              <p className="text-sm text-[#784e6c] font-medium leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Disclaimer of Warranties">
        <P>
          The Service is provided <span className="font-black text-[#46223e]">"as is"</span> without
          warranties of any kind, express or implied. We do not guarantee that:
        </P>
        <div className="space-y-1.5 mt-2">
          {[
            'Optimization results are accurate or will yield the expected in-game rewards.',
            'Item data (prices, durations, XP values) is up to date with the current game version.',
            'The Service will be available uninterrupted or error-free.',
          ].map((item) => (
            <Tip key={item}>{item}</Tip>
          ))}
        </div>
      </Section>

      <Section title="Limitation of Liability">
        <P>
          To the maximum extent permitted by applicable law, FashStOpt and its contributors
          shall not be liable for any indirect, incidental, special, or consequential damages
          arising from your use of — or inability to use — the Service.
        </P>
      </Section>

      <Section title="Intellectual Property">
        <P>
          All original code and design of FashStOpt is the property of its contributors.
          In-game item names, collection names, and any other Fashion Story™ content referenced
          within the Service remain the intellectual property of Storm8 Studios.
        </P>
      </Section>

      <Section title="Changes to these Terms">
        <P>
          We reserve the right to update these Terms at any time. Continued use of the Service
          after changes are posted constitutes your acceptance of the revised Terms.
        </P>
        <p className="text-xs text-[#966988] font-semibold mt-3">Last updated: April 2026</p>
      </Section>
    </div>
  )
}

const TAB_CONTENT: Record<FooterTab, React.ReactNode> = {
  about:   <AboutContent />,
  support: <SupportContent />,
  privacy: <PrivacyContent />,
  terms:   <TermsContent />,
}

/* ════════════════════════════════════════════
   Modal
   ════════════════════════════════════════════ */
interface Props {
  initialTab?: FooterTab
  onClose: () => void
}

export default function FooterInfoModal({ initialTab = 'about', onClose }: Props) {
  const [activeTab, setActiveTab] = useState<FooterTab>(initialTab)
  const shouldReduce = useReducedMotion() ?? false

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  /* Sync initial tab if prop changes */
  useEffect(() => { setActiveTab(initialTab) }, [initialTab])

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
      aria-label="Information"
    >
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, scale: 0.92, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 28 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(70,34,62,0.25)]
                   w-full max-w-2xl max-h-[90vh] flex flex-col border-t-8 border-[#ff6cb5]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-7 pb-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ffdff2] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#B02E7A]" aria-hidden="true" />
            </div>
            <span className="text-lg font-black italic text-[#B02E7A]"
                  style={{ fontFamily: 'var(--font-headline)' }}>
              FashStOpt
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#ffecf5] hover:bg-[#ffdff2]
                       flex items-center justify-center text-[#784e6c] hover:text-[#B02E7A]
                       transition-colors duration-150 cursor-pointer focus:outline-none
                       focus:ring-2 focus:ring-[#B02E7A]/40"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="px-8 pb-4 shrink-0">
          <div className="flex bg-[#ffecf5] rounded-2xl p-1 gap-1" role="tablist">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-black
                            rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer
                            focus:outline-none focus:ring-2 focus:ring-[#B02E7A]/40
                            ${activeTab === id
                              ? 'bg-white text-[#B02E7A] shadow-sm'
                              : 'text-[#966988] hover:text-[#B02E7A]'
                            }`}
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-8 pb-8 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={shouldReduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {TAB_CONTENT[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
