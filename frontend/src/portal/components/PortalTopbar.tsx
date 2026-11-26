import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { NotificationsDropdown } from './NotificationsDropdown'
import { ChevronDown, User, Globe, LogOut, Menu } from 'lucide-react'
import type { PortalUser } from '../api/portalApi'

interface PortalTopbarProps {
  user: PortalUser
  onOpenMobileMenu: () => void
  onSelectTab: (tab: string) => void
  onLogout: () => void
}

export function PortalTopbar({
  user,
  onOpenMobileMenu,
  onSelectTab,
  onLogout,
}: PortalTopbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U'
  const displayRole = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : 'Volunteer'

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-[#edf2ee] px-4 sm:px-8 flex items-center justify-between">
      {/* Left side: Mobile menu toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side: Notifications + User Profile */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        {/* Notifications */}
        <NotificationsDropdown />

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            {/* Avatar Circle with initial */}
            <div className="w-9 h-9 rounded-full bg-[#124734] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {initial}
            </div>

            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                {user.name}
              </span>
              <span className="block text-[11px] text-slate-500 font-medium">
                {displayRole}
              </span>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    onSelectTab('settings')
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile Settings</span>
                </button>

                <Link
                  to="/"
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Globe className="w-4 h-4 text-slate-400" />
                  <span>Visit Website</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false)
                    onLogout()
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
