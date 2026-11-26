import {
  Home,
  Calendar,
  Tent,
  HeartPulse,
  Users,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react'

interface PortalSidebarProps {
  activeTab: string
  onSelectTab: (tab: string) => void
  onLogout: () => void
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'activities', label: 'My Activities', icon: Calendar },
  { id: 'events', label: 'Events & Camps', icon: Tent },
  { id: 'programs', label: 'Health Programs', icon: HeartPulse },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'resources', label: 'Resources', icon: BookOpen },
  { id: 'settings', label: 'Profile Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
]

export function PortalSidebar({
  activeTab,
  onSelectTab,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}: PortalSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-[#edf2ee] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Logo Section */}
        <div>
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              {/* Lotus / Health leaf icon */}
              <div className="w-10 h-10 flex items-center justify-center text-[#124734]">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-9 h-9"
                >
                  <path d="M20 32C20 32 10 26 10 16C10 10.5 14.5 6 20 6C25.5 6 30 10.5 30 16C30 26 20 32 20 32Z" />
                  <path d="M20 12V24" />
                  <path d="M14 18C16 20 18 21 20 21C22 21 24 20 26 18" />
                  <path d="M7 26C11 28 15 28 20 28C25 28 29 28 33 26" />
                </svg>
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-lg tracking-wider text-[#124734]">
                  SCNSWF
                </h1>
                <p className="text-[10px] text-[#4d7262] font-medium tracking-tight">
                  Healthcare for All
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Nav List */}
          <nav className="px-3 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id)
                    if (onCloseMobile) onCloseMobile()
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? 'bg-[#edf7f0] text-[#14533d] shadow-2xs font-bold'
                      : 'text-[#5a6860] hover:text-[#14533d] hover:bg-[#f6faf7]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#14533d]' : 'text-[#728378]'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Section with Leaf Watermark & Logout */}
        <div className="relative p-4 overflow-hidden">
          {/* Subtle floral leaf watermark illustration */}
          <div className="absolute -bottom-8 -left-8 w-36 h-36 opacity-10 pointer-events-none text-[#124734]">
            <svg viewBox="0 0 100 100" fill="currentColor">
              <path d="M10,80 Q30,30 80,20 Q60,60 10,80 Z" />
              <path d="M30,90 Q50,50 90,40 Q70,80 30,90 Z" opacity="0.6" />
            </svg>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#5a6860] hover:text-red-700 hover:bg-red-50/80 transition-all cursor-pointer relative z-10"
          >
            <LogOut className="w-4 h-4 text-[#728378] hover:text-red-700" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
