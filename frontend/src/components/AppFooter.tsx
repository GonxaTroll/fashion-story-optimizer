import { ExternalLink } from 'lucide-react'

const APPSTORE_URL  = 'https://apps.apple.com/co/app/fashion-story/id420590864'
const PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=com.teamlava.fashionstory&hl=es'

export default function AppFooter() {
  return (
    <footer className="bg-[#ffd7f0] rounded-t-[2rem] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <span
          className="text-base font-black text-[#46223e] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          FashStOpt
        </span>

        {/* Store links */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-[#784e6c] uppercase tracking-widest">Play the original game</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={APPSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-[#46223e]
                         bg-white/70 hover:bg-white rounded-xl px-4 py-2
                         transition-colors duration-150 cursor-pointer
                         focus:outline-none focus:ring-1 focus:ring-[#B02E7A]"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#46223e] shrink-0" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
              <ExternalLink className="w-3 h-3 text-[#966988] shrink-0" aria-hidden="true" />
            </a>
            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-[#46223e]
                         bg-white/70 hover:bg-white rounded-xl px-4 py-2
                         transition-colors duration-150 cursor-pointer
                         focus:outline-none focus:ring-1 focus:ring-[#B02E7A]"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
                <path d="M3.18 23.76c.3.17.64.24.99.2l13.12-11.75L13.65 8.6 3.18 23.76z" fill="#EA4335"/>
                <path d="M20.6 10.27L17.3 8.4l-3.65 3.81 3.65 3.58 3.33-1.89a1.75 1.75 0 0 0 0-3.63z" fill="#FBBC04"/>
                <path d="M3.18.24A1.74 1.74 0 0 0 2.4 1.7v20.6c0 .6.28 1.12.78 1.46L13.65 12 3.18.24z" fill="#4285F4"/>
                <path d="M4.17.04 13.65 8.6l3.65-3.58L4.17.05A1.73 1.73 0 0 0 3.18.24c-.01 0 .99-.2.99-.2z" fill="#34A853"/>
              </svg>
              Google Play
              <ExternalLink className="w-3 h-3 text-[#966988] shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="w-full max-w-sm h-px bg-[#ffbfe8]" />

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

        <p className="text-xs font-bold text-[#966988] uppercase tracking-widest text-center">
          © 2025 FashStOpt · Stay Playful. · Not affiliated with Storm8 Studios.
        </p>
      </div>
    </footer>
  )
}
