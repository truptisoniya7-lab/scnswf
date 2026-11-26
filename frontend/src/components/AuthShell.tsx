import React from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'

interface AuthShellProps {
  children: React.ReactNode
  footerLink?: React.ReactNode
  showBack?: boolean
  onBack?: () => void
}

  export function AuthShell({ children, footerLink, showBack, onBack }: AuthShellProps) {
    const shouldReduceMotion = useReducedMotion()

    return (
      <div
        className="relative min-h-[100dvh] w-full flex flex-col items-center justify-start overflow-hidden select-none font-sans"
        style={{ backgroundColor: '#e8f5f0' }}
      >
          {/* ── Light nature-themed SVG background ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {/* Sky gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, #cce8f0 0%, #d9ede8 40%, #e8f5f0 70%)',
              }}
            />

            {/* Decorative floating leaf blobs */}
            <svg
              className="absolute top-0 right-0 w-72 h-72 opacity-30"
              viewBox="0 0 300 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="200" cy="80" r="120" fill="#a8d5c2" />
              <circle cx="260" cy="140" r="80" fill="#7ec8a8" />
            </svg>
            <svg
              className="absolute top-16 left-0 w-56 h-56 opacity-20"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="40" cy="80" r="100" fill="#a8d5c2" />
            </svg>

            {/* Leaf decorations */}
            <svg
              className="absolute top-24 right-16 w-16 h-16 opacity-40"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="30" cy="30" rx="12" ry="28" fill="#2d7a56" transform="rotate(-30 30 30)" />
              <ellipse cx="30" cy="30" rx="12" ry="28" fill="#3a9e6e" transform="rotate(30 30 30)" />
            </svg>
            <svg
              className="absolute top-40 left-10 w-12 h-12 opacity-30"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="30" cy="30" rx="10" ry="24" fill="#2d7a56" transform="rotate(15 30 30)" />
              <ellipse cx="30" cy="30" rx="10" ry="24" fill="#3a9e6e" transform="rotate(-45 30 30)" />
            </svg>
            <svg
              className="absolute top-8 right-40 w-10 h-10 opacity-25"
              viewBox="0 0 60 60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="30" cy="30" r="18" fill="#5bbf8e" />
              <circle cx="30" cy="30" r="10" fill="#3a9e6e" />
            </svg>

            {/* Bottom wave – layered hills */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1440 220"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back hill – lighter */}
              <path
                d="M0,120 C180,60 360,160 540,100 C720,40 900,140 1080,80 C1260,20 1380,100 1440,80 L1440,220 L0,220 Z"
                fill="#5bbf8e"
                opacity="0.5"
              />
              {/* Mid hill */}
              <path
                d="M0,150 C200,80 400,180 600,120 C800,60 1000,160 1200,100 C1350,60 1400,120 1440,100 L1440,220 L0,220 Z"
                fill="#2d7a56"
                opacity="0.7"
              />
              {/* Front hill – darkest */}
              <path
                d="M0,180 C240,110 480,200 720,150 C960,100 1200,190 1440,140 L1440,220 L0,220 Z"
                fill="#1a5c3c"
              />
            </svg>
          </div>

            {/* ── Top bar: Back link (left) + Globe (right) ── */}
            <div className="relative z-10 w-full flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-5">
              <div className="min-w-[80px]">
                {showBack && onBack && (
                  <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1a5c3c] hover:text-[#2d7a56] transition-colors cursor-pointer"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back
                  </button>
                )}
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-[#1a5c3c] hover:text-[#2d7a56] transition-colors cursor-pointer"
                aria-label="Language selector"
              >
                <Globe className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* ── Brand Header ── */}
            <header className="relative z-10 mt-5 mb-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-3 group cursor-pointer"
                aria-label="SCNSWF Home"
              >
                <img
                  src="/images/scnswf-lotus-flower.png"
                  alt="SCNSWF Lotus Flower"
                  className="w-12 h-12 object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
                />
                <div className="flex flex-col text-left">
                    <span className="font-heading font-extrabold text-2xl tracking-wider leading-none text-[#1a5c3c]">
                      SCNSWF
                    </span>
                      <span className="text-xs text-[#2d7a56] tracking-wide font-semibold">
                        Healthcare for All
                      </span>
                    </div>
                  </Link>

                  {/* Together tagline */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="h-px w-16 bg-[#2d7a56]/30" />
                    <span className="text-xs text-[#2d7a56] font-medium flex items-center gap-1.5">
                      Together for a
                      <span className="inline-flex items-center gap-1 font-bold text-[#1a5c3c]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#e05070" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        Better Tomorrow
                      </span>
                    </span>
                    <div className="h-px w-16 bg-[#2d7a56]/30" />
                  </div>
                </header>

                {/* ── White Card ── */}
                <motion.main
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="relative z-10 w-full max-w-[400px] mx-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-6 sm:p-8 flex flex-col mb-28"
                  style={{ background: '#ffffff' }}
                >
                  {children}

                  {/* Footer Link inside the card */}
                  {footerLink && (
                      <div className="mt-5 text-center text-sm text-[#555]">
                        {footerLink}
                      </div>
        )}
                    </motion.main>
    </div>
                )
}
