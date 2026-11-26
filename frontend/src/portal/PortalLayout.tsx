import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { portalApi, type PortalDashboardData, type PortalEvent, type PortalUser } from './api/portalApi'
import { passwordlessAuthApi } from '../lib/api/auth'
import { PortalSidebar } from './components/PortalSidebar'
import { PortalTopbar } from './components/PortalTopbar'
import { EventDetailsModal } from './components/EventDetailsModal'

// Views
import { DashboardView } from './pages/DashboardView'
import { ActivitiesView } from './pages/ActivitiesView'
import { EventsView } from './pages/EventsView'
import { ProgramsView } from './pages/ProgramsView'
import { CommunityView } from './pages/CommunityView'
import { ResourcesView } from './pages/ResourcesView'
import { ProfileSettingsView } from './pages/ProfileSettingsView'
import { HelpSupportView } from './pages/HelpSupportView'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function PortalLayout() {
  const navigate = useNavigate()
  const [data, setData] = useState<PortalDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<string>('dashboard')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Event modal state
  const [selectedEvent, setSelectedEvent] = useState<PortalEvent | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isJoining, setIsJoining] = useState(false)

  // Toast notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  // Load dashboard data
  const loadDashboard = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await portalApi.getDashboard()
      setData(res)
    } catch (err: any) {
      console.error('Failed to load portal data:', err)
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load your dashboard. Please make sure you are logged in.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  // Logout handler
  const handleLogout = async () => {
    try {
      await passwordlessAuthApi.logout()
    } finally {
      navigate('/login', { replace: true })
    }
  }

  // Event selection & joining
  const handleSelectEvent = (event: PortalEvent) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleJoinEvent = async (eventId: string) => {
    setIsJoining(true)
    try {
      const res = await portalApi.joinEvent(eventId)
      if (data) {
        setData({
          ...data,
          stats: res.stats,
          joinedEventIds: res.joinedEventIds,
          recentActivities: res.recentActivities,
        })
      }
      showToast('success', res.message || 'You have successfully joined the event!')
      // Brief delay before closing modal
      setTimeout(() => {
        setIsEventModalOpen(false)
      }, 900)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to join event. Please try again.'
      showToast('error', msg)
    } finally {
      setIsJoining(false)
    }
  }

  // Profile update handler
  const handleProfileUpdated = (updatedUser: PortalUser) => {
    if (data) {
      setData({
        ...data,
        user: { ...data.user, ...updatedUser },
      })
    }
  }

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#14533d]/20 border-t-[#14533d] animate-spin mb-4" />
        <p className="text-xs font-semibold text-[#14533d] tracking-wide">
          Loading your healthcare dashboard…
        </p>
      </div>
    )
  }

  // Error Screen
  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 mb-2">Failed to load dashboard</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-6">{error}</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadDashboard}
            className="px-5 py-2.5 rounded-xl bg-[#124734] text-white text-xs font-bold hover:bg-[#0c3325] transition-colors cursor-pointer"
          >
            Retry Loading
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  const { user, stats, upcomingEvents, recentActivities, joinedEventIds } = data

  return (
    <div className="min-h-screen bg-[#f8faf7] text-slate-800 flex">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-60 animate-fadeIn">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold border ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
                : 'bg-red-900 text-red-100 border-red-700'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Left Sidebar */}
      <PortalSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 transition-all">
        {/* Topbar */}
        <PortalTopbar
          user={user}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
        />

        {/* View Page */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              stats={stats}
              upcomingEvents={upcomingEvents}
              recentActivities={recentActivities}
              joinedEventIds={joinedEventIds}
              onSelectEvent={handleSelectEvent}
              onNavigateTab={(tab) => {
                setActiveTab(tab)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}

          {activeTab === 'activities' && (
            <ActivitiesView stats={stats} activities={recentActivities} />
          )}

          {activeTab === 'events' && (
            <EventsView
              events={upcomingEvents}
              joinedEventIds={joinedEventIds}
              onSelectEvent={handleSelectEvent}
            />
          )}

          {activeTab === 'programs' && <ProgramsView />}

          {activeTab === 'community' && <CommunityView />}

          {activeTab === 'resources' && <ResourcesView />}

          {activeTab === 'settings' && (
            <ProfileSettingsView user={user} onProfileUpdated={handleProfileUpdated} />
          )}

          {activeTab === 'help' && (
            <HelpSupportView
              onNavigateTab={(tab) => {
                setActiveTab(tab)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}
        </main>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        isJoined={selectedEvent ? joinedEventIds.includes(selectedEvent.id) : false}
        onJoin={handleJoinEvent}
        isJoining={isJoining}
      />
    </div>
  )
}
