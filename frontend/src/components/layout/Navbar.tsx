import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, Heart, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'About',       to: '/about' },
  { label: 'Programs',    to: '/programs' },
  { label: 'Impact',      to: '/impact' },
  {
    label: 'Get Involved',
    to: '/get-involved',
    children: [
      { label: 'Volunteer',    to: '/get-involved/volunteer' },
      { label: 'Internship',   to: '/get-involved/internship' },
      { label: 'Partner',      to: '/get-involved/partner' },
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between h-16 md:h-20" aria-label="Main navigation">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl" style={{ color: scrolled ? '#1b6b68' : '#fff' }}>
            <img
              src="/images/about/scnswf-logo.png"
              alt="SCNSWF Logo"
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 shadow-sm border border-slate-200"
            />
            <span className="tracking-tight">SCNSWF</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1" role="list">
            {NAV_LINKS.map(link => (
              <li key={link.to} className="relative">
                {link.children ? (
                  <div
                    onMouseEnter={() => setDropdown(link.label)}
                    onMouseLeave={() => setDropdown(null)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        scrolled ? 'text-gray-700 hover:text-teal-700 hover:bg-teal-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {link.label} <ChevronDown size={14} />
                    </button>
                    <AnimatePresence>
                      {dropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
                        >
                          {link.children.map(child => (
                            <NavLink
                              key={child.to}
                              to={child.to}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
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
                      `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? scrolled ? 'text-teal-700 bg-teal-50' : 'text-white bg-white/20'
                          : scrolled ? 'text-gray-700 hover:text-teal-700 hover:bg-teal-50' : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Donate CTA */}
          <div className="hidden lg:block">
            <Link to="/donate" className="btn btn-primary btn-sm">
              <Heart size={14} /> Donate
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: scrolled ? '#1b6b68' : '#fff' }}
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <div key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                        isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                  {link.children && (
                    <div className="ml-4 border-l-2 border-teal-100 pl-4 flex flex-col gap-1 mt-1">
                      {link.children.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          onClick={() => setOpen(false)}
                          className="block px-3 py-1.5 text-sm text-gray-600 hover:text-teal-700 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link to="/donate" onClick={() => setOpen(false)} className="btn btn-primary mt-3 justify-center">
                <Heart size={16} /> Donate Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
