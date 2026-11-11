import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Heart, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import { authApi } from '../../api/auth'

interface NavItem {
  label: string
  to: string
}

const NAV_LINKS: NavItem[] = [
  { label: 'Home',         to: '/' },
  { label: 'About',        to: '/about' },
  { label: 'Our Work',     to: '/programs' },
  { label: 'Impact',       to: '/impact' },
  { label: 'Gallery',      to: '/gallery' },
  { label: 'Get Involved', to: '/get-involved' },
  { label: 'Contact',      to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const [authUser, setAuthUser] = useState<{ name?: string; email?: string } | null>(() => {
    try {
      const rawUser = localStorage.getItem('auth_user')
      const token = localStorage.getItem('access_token')
      return token && rawUser ? JSON.parse(rawUser) : null
    } catch {
      return null
    }
  })

  // Listen to storage and authChange events for immediate session sync
  useEffect(() => {
    const syncAuth = () => {
      try {
        const rawUser = localStorage.getItem('auth_user')
        const token = localStorage.getItem('access_token')
        setAuthUser(token && rawUser ? JSON.parse(rawUser) : null)
      } catch {
        setAuthUser(null)
      }
    }
    syncAuth()
    window.addEventListener('storage', syncAuth)
    window.addEventListener('authChange', syncAuth)
    return () => {
      window.removeEventListener('storage', syncAuth)
      window.removeEventListener('authChange', syncAuth)
    }
  }, [location.pathname])

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

  const handleLogout = async () => {
    await authApi.logout()
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
    setAuthUser(null)
    window.dispatchEvent(new Event('authChange'))
    setOpen(false)
    navigate('/')
  }

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
          className="flex items-center justify-between h-[72px] md:h-20"
          aria-label="Main navigation"
        >
          {/* SCNSWF Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group select-none shrink-0"
            aria-label="SCNSWF Home"
          >
            <div className="w-10 h-10 rounded-xl bg-white p-1.5 shadow-xs border border-[#cbd8cf] group-hover:border-[#105e49] transition-colors flex items-center justify-center">
              <img
                src="/images/scnswf-lotus-flower.png"
                alt="SCNSWF Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#082e23] tracking-tight leading-none group-hover:text-[#105e49] transition-colors">
                SCNSWF
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide text-slate-500 uppercase leading-tight mt-0.5">
                Healthcare for All
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-1.5" role="list">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.to)
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 block ${
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

          {/* Desktop Actions — User Status or Login + Donate */}
          <div className="hidden md:flex items-center gap-2.5">
            {authUser ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="max-w-[120px] truncate">{authUser.name || authUser.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Log out"
                  aria-label="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-[#105e49] hover:bg-[#f0fbf7] transition-all cursor-pointer"
              >
                Log In
              </Link>
            )}

            <Button
              variant="primary"
              size="md"
              to="/donate"
              leftIcon={<Heart className="w-4 h-4 fill-white" />}
            >
              Donate
            </Button>
          </div>

          {/* Mobile Right: Donate + Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/donate"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-600 bg-emerald-600 text-white text-xs font-semibold shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate</span>
            </Link>

            <button
              type="button"
              className="p-2.5 rounded-xl text-slate-700 hover:text-[#105e49] hover:bg-[#f0fbf7] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
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
              className="fixed inset-0 top-[72px] bg-[#051b14]/50 backdrop-blur-xs md:hidden z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-50 md:hidden bg-white border-b border-[#e3eae4] shadow-2xl overflow-y-auto max-h-[calc(100vh-72px)]"
            >
              <div className="max-w-7xl mx-auto px-5 py-5 flex flex-col gap-1.5">
                {NAV_LINKS.map((link) => {
                  const active = isLinkActive(link.to)
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-3.5 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                        active
                          ? 'text-[#105e49] bg-[#f0fbf7] font-bold'
                          : 'text-slate-700 hover:bg-[#f8faf7]'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  )
                })}

                <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    to="/donate"
                    fullWidth
                    leftIcon={<Heart className="w-4 h-4 fill-white" />}
                  >
                    Donate Now
                  </Button>

                  {authUser ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                          {authUser.name ? authUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-slate-900">{authUser.name || 'Member'}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[180px]">{authUser.email}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer p-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Log In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center py-2.5 rounded-xl bg-[#082e23] text-white text-sm font-semibold hover:bg-[#105e49] transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
