import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck, Calendar, Award } from 'lucide-react'

interface NotificationItem {
  id: string
  title: string
  time: string
  read: boolean
  type: 'event' | 'award' | 'general'
}

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Free Health Check-up Camp scheduled for Nov 25 in Bhubaneswar',
      time: '1 hour ago',
      read: false,
      type: 'event',
    },
    {
      id: '2',
      title: 'Your volunteer hours for previous medical drive verified',
      time: 'Yesterday',
      read: false,
      type: 'award',
    },
    {
      id: '3',
      title: 'Welcome to Suresh Chandra Nayak Social Welfare Foundation!',
      time: '3 days ago',
      read: true,
      type: 'general',
    },
  ])

  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-fadeIn">
          <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-sm text-slate-800">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#edf7f0] text-[#14533d]">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs text-[#14533d] hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 flex items-start gap-3 transition-colors hover:bg-slate-50 ${
                  !item.read ? 'bg-[#f7faf8]' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#edf7f0] text-[#14533d] flex items-center justify-center shrink-0 mt-0.5">
                  {item.type === 'event' ? (
                    <Calendar className="w-4 h-4" />
                  ) : item.type === 'award' ? (
                    <Award className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-800 font-medium leading-snug">{item.title}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
