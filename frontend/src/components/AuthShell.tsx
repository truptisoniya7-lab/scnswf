import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

interface AuthShellProps {
  children: React.ReactNode
  footerLink?: React.ReactNode
}

export function AuthShell({ children, footerLink }: AuthShellProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans"
      style={{
        backgroundColor: 'var(--bg-deep, #04140c)',
      }}
    >
      {/* Responsive full-screen background image without side borders or white bars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <img
          src="/images/auth-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
        />

        {/* Brand scrim overlay: keeps the real event photo visible while providing strong contrast for the auth card */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(4, 20, 12, 0.76) 0%, rgba(4, 20, 12, 0.88) 100%), linear-gradient(135deg, rgba(4, 20, 12, 0.8), rgba(10, 42, 26, 0.86))',
          }}
        />

        {/* 3 Slow-drifting blurred green background blobs */}
        <div
          className="auth-blob-1 absolute -top-24 -left-24 w-80 sm:w-96 h-80 sm:h-96 rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(31, 157, 98, 0.5) 0%, rgba(10, 42, 26, 0) 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="auth-blob-2 absolute -bottom-28 -right-20 w-88 sm:w-[420px] h-88 sm:h-[420px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.45) 0%, rgba(10, 42, 26, 0) 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="auth-blob-3 absolute top-1/2 left-1/4 -translate-y-1/2 w-72 sm:w-80 h-72 sm:h-80 rounded-full opacity-50"
          style={{
            background: 'radial-gradient(circle, rgba(110, 231, 183, 0.35) 0%, rgba(4, 20, 12, 0) 70%)',
            filter: 'blur(85px)',
          }}
        />

        {/* Faint noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Brand Header */}
      <header className="relative z-10 mb-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-[var(--glass-border)] hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md group"
          aria-label="SCNSWF Home"
        >
          <img
            src="/images/scnswf-lotus-flower.png"
            alt="SCNSWF Lotus Flower"
            className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col text-left">
            <span className="font-heading font-extrabold text-base tracking-wide leading-none text-[var(--text,#e8fff3)]">
              SCNSWF
            </span>
            <span className="text-[10px] text-[var(--text-muted,#9bc9b0)] tracking-wide font-medium">
              Healthcare for All
            </span>
          </div>
        </Link>
      </header>

      {/* Glass Card */}
      <motion.main
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[440px] rounded-[var(--radius,20px)] border border-[var(--glass-border,rgba(110,231,183,0.18))] shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-6 sm:p-8 flex flex-col"
        style={{
          background: 'var(--glass-bg, rgba(10, 42, 26, 0.45))',
          backdropFilter: 'blur(18px) saturate(140%)',
          WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        }}
      >
        {children}

        {/* Footer Link inside the card */}
        {footerLink && (
          <div className="mt-6 pt-5 border-t border-[var(--glass-border,rgba(110,231,183,0.15))] text-center text-xs text-[var(--text-muted,#9bc9b0)]">
            {footerLink}
          </div>
        )}
      </motion.main>
    </div>
  )
}
