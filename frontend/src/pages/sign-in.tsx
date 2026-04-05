import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function SignInPage() {
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="bg-pattern min-h-screen flex flex-col items-center justify-center p-6">
      <main className="w-full max-w-md relative">
        {/* Decorative blobs */}
        <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-[#56f1e0] opacity-40 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-8 w-32 h-32 rounded-full bg-[#fcbcff] opacity-30 blur-3xl pointer-events-none" />

        {/* Magic Card — springs in on mount */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.05 }}
          className="bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(70,34,62,0.08)] overflow-hidden relative border-t-8 border-[#ff6cb5]"
        >
          {/* Branding header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-[#ffdff2] rounded-full mb-6"
            >
              <Sparkles className="text-[#B02E7A] w-7 h-7" />
            </motion.div>

            <h1
              className="text-3xl font-black italic tracking-tight text-[#B02E7A] mb-2"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Glimmer Boutique
            </h1>
            <p className="text-[#784e6c] font-medium text-sm">
              Welcome back, gorgeous!
            </p>
          </div>

          {/* Form */}
          <form className="px-8 pb-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#784e6c] ml-2 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="hello@glimmer.com"
                className="w-full bg-[#ffecf5] border-none rounded-2xl px-5 py-4 text-[#46223e] placeholder:text-[#d09ec0] focus:ring-2 focus:ring-[#B02E7A]/20 soft-well transition-all outline-none text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <label className="text-xs font-bold text-[#784e6c] flex items-center gap-2">
                  <Lock className="w-3 h-3" />
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-[#9720ab] hover:underline">
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#ffecf5] border-none rounded-2xl px-5 py-4 text-[#46223e] placeholder:text-[#d09ec0] focus:ring-2 focus:ring-[#B02E7A]/20 soft-well transition-all outline-none text-sm"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center px-2 gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={rememberMe}
                onClick={() => setRememberMe((v) => !v)}
                className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                  rememberMe ? 'bg-[#9720ab]' : 'bg-[#ffd7f0]'
                }`}
              >
                <span
                  className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                    rememberMe ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-[#784e6c]">
                Stay playful (Remember me)
              </span>
            </div>

            {/* CTA Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="bubblegum-gradient w-full py-4 rounded-full text-white font-black text-lg shadow-[0_10px_20px_rgba(168,33,110,0.3)] flex items-center justify-center gap-3 cursor-pointer"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          {/* Footer link */}
          <div className="bg-[#ffecf5]/50 px-8 py-6 text-center">
            <p className="text-sm font-medium text-[#784e6c]">
              New to the boutique?{' '}
              <a href="#" className="text-[#B02E7A] font-bold hover:underline ml-1">
                Create an account
              </a>
            </p>
          </div>
        </motion.div>

        {/* Decorative dots */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.6, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 flex justify-center gap-4"
        >
          <div className="w-2 h-2 rounded-full bg-[#ff6cb5]" />
          <div className="w-2 h-2 rounded-full bg-[#fcbcff]" />
          <div className="w-2 h-2 rounded-full bg-[#56f1e0]" />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 flex flex-col items-center gap-4 py-8 px-4 bg-[#ffd7f0] rounded-t-[2rem]">
        <div className="flex gap-8">
          {['About', 'Support', 'Privacy', 'Terms'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-[#9720ab] hover:underline underline-offset-4 decoration-2"
            >
              {link}
            </a>
          ))}
        </div>
        <div
          className="text-sm font-black text-[#46223e] uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          © 2024 GLIMMER BOUTIQUE. STAY PLAYFUL.
        </div>
      </footer>
    </div>
  )
}
