import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X, Heart, ChevronDown, Phone, MapPin, ShieldCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const NAV_LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'About',       to: '/about' },
  { label: 'Programs',    to: '/programs' },
  { label: 'Impact',      to: '/impact' },
  {
    label: 'Get Involved',
    to: '/get-involved',
    children: [
      { label: 'Volunteer With Us', to: '/get-involved/volunteer' },
      { label: 'Student Internship', to: '/get-involved/internship' },
      { label: 'CSR & Partnerships', to: '/get-involved/partner' },
    ],
  },
  { label: 'Gallery',     to: '/gallery' },
  { label: 'Stories',     to: '/stories' },
  { label: 'Contact',     to: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false)
    setDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility & Trust Bar - Visible on desktop */}
      <div className="hidden lg:block bg-[#051b14] text-slate-300 text-xs py-1.5 border-b border-[#0f4737]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#55d5b3]" />
              <span className="font-medium">Section 8 Registered NGO</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">80G Tax Exemption Certified</span>
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-[#55d5b3]" />
              <span>Bhubaneswar, Odisha</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+919437000000"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#55d5b3]" />
              <span>Helpline: <strong className="text-white">+91 674 235 0100</strong></span>
            </a>
            <span className="text-slate-600">|</span>
            <Badge variant="dark" size="sm" pulse>
              Healthcare for All
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_4px_20px_rgba(5,27,20,0.08)] border-b border-[#e3eae4]'
            : 'bg-white/90 backdrop-blur-sm border-b border-[#e3eae4]/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-18 md:h-20" aria-label="Main navigation">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group select-none">
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

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-1 xl:gap-1.5" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.to} className="relative">
                  {link.children ? (
                    <div
                      onMouseEnter={() => setDropdown(link.label)}
                      onMouseLeave={() => setDropdown(null)}
                      className="relative py-2"
                    >
                      <button
                        type="button"
                        aria-expanded={dropdown === link.label}
                        className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          dropdown === link.label
                            ? 'text-[#105e49] bg-[#f0fbf7]'
                            : 'text-slate-700 hover:text-[#105e49] hover:bg-[#f0fbf7]'
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            dropdown === link.label ? 'rotate-180 text-[#105e49]' : 'text-slate-400'
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {dropdown === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 w-56 bg-white rounded-2xl shadow-xl border border-[#e3eae4] py-2 z-50 overflow-hidden"
                          >
                            <div className="px-3 py-1.5 mb-1 border-b border-slate-100">
                              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Community & Support
                              </span>
                            </div>
                            {link.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                className={({ isActive }) =>
                                  `block px-4 py-2 text-sm font-medium transition-colors ${
                                    isActive
                                      ? 'text-[#105e49] bg-[#f0fbf7] font-semibold'
                                      : 'text-slate-700 hover:bg-[#f8faf7] hover:text-[#105e49]'
                                  }`
                                }
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 block ${
                          isActive
                            ? 'text-[#105e49] bg-[#f0fbf7]'
                            : 'text-slate-700 hover:text-[#105e49] hover:bg-[#f0fbf7]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            {/* Desktop CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Button
                variant="primary"
                size="md"
                to="/donate"
                leftIcon={<Heart className="w-4 h-4 fill-white" />}
              >
                Donate Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <Button
                variant="primary"
                size="sm"
                to="/donate"
                leftIcon={<Heart className="w-3.5 h-3.5 fill-white" />}
              >
                Donate
              </Button>

              <button
                type="button"
                className="p-2 rounded-xl text-slate-700 hover:text-[#105e49] hover:bg-[#f0fbf7] transition-colors cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={open}
              >
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white border-b border-[#e3eae4] shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-1.5">
              {/* Trust Tag */}
              <div className="pb-3 mb-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-[#105e49]">
                  <ShieldCheck className="w-4 h-4" /> Section 8 NGO (Odisha)
                </span>
                <span>80G Tax Exempt</span>
              </div>

              {NAV_LINKS.map((link) => (
                <div key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                        isActive
                          ? 'bg-[#f0fbf7] text-[#105e49]'
                          : 'text-slate-800 hover:bg-[#f8faf7]'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                  {link.children && (
                    <div className="ml-4 pl-3 border-l-2 border-[#d1f4eb] flex flex-col gap-1 my-1">
                      {link.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive
                                ? 'text-[#105e49] font-semibold bg-[#f0fbf7]'
                                : 'text-slate-600 hover:text-[#105e49] hover:bg-[#f8faf7]'
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 mt-2 border-t border-slate-100 flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  to="/donate"
                  fullWidth
                  leftIcon={<Heart className="w-4 h-4 fill-white" />}
                >
                  Donate to Support Odisha
                </Button>
                <a
                  href="tel:+916742350100"
                  className="text-center text-xs font-medium text-slate-500 hover:text-[#105e49] py-1"
                >
                  Emergency Medical Helpline: +91 674 235 0100
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
