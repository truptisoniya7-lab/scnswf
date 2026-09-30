import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'

interface NavItem {
  label: string
  to: string
}

const NAV_LINKS: NavItem[] = [
  { label: 'Home',         to: '/' },
  { label: 'About',        to: '/about' },
  { label: 'Our Work',     to: '/programs' },
  { label: 'Impact',       to: '/impact' },
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Contact',      to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Helper to determine if link is active (including nested sub-routes)
  const isLinkActive = (to: string) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname === to || location.pathname.startsWith(`${to}/`)
  }

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Track scroll position for subtle elevation shadow
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(8,46,35,0.06)] border-b border-[#e3eae4]'
          : 'bg-white/90 backdrop-blur-sm border-b border-[#e3eae4]/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between h-18 md:h-20"
          aria-label="Main navigation"
        >
          {/* SCNSWF Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0"
            aria-label="SCNSWF Home"
          >
            <img
              src="/images/about/scnswf-logo.png"
              alt="SCNSWF Logo"
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-xs border border-[#cbd8cf] group-hover:border-[#105e49] transition-colors"
            />
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#082e23] tracking-tight leading-none group-hover:text-[#105e49] transition-colors">
                SCNSWF
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-slate-500 uppercase leading-tight mt-0.5">
                Odisha Social Welfare Foundation
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items — Clean & uncluttered */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2" role="list">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to)
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 block ${
                      active
                        ? 'text-[#105e49] bg-[#f0fbf7] border border-[#d1f4eb]/70 shadow-2xs'
                        : 'text-slate-600 hover:text-[#105e49] hover:bg-[#f8faf7] border border-transparent'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop Single Standout CTA — Donate */}
          <div className="hidden md:flex items-center">
            <Button
              variant="primary"
              size="md"
              to="/donate"
              leftIcon={<Heart className="w-4 h-4 fill-white" />}
            >
              Donate
            </Button>
          </div>

          {/* Mobile Right: Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="p-2.5 rounded-xl text-slate-700 hover:text-[#105e49] hover:bg-[#f0fbf7] transition-colors cursor-pointer"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-18 bg-[#051b14]/50 backdrop-blur-xs md:hidden z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-50 md:hidden bg-white border-b border-[#e3eae4] shadow-xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col gap-2">
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.to)
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                        active
                          ? 'bg-[#f0fbf7] text-[#105e49] border border-[#d1f4eb]'
                          : 'text-slate-800 hover:bg-[#f8faf7]'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  )
                })}

                {/* Mobile Full-Width CTA Button: [ Donate Now ] */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col">
                  <Button
                    variant="primary"
                    size="lg"
                    to="/donate"
                    fullWidth
                    leftIcon={<Heart className="w-4 h-4 fill-white" />}
                  >
                    Donate Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
