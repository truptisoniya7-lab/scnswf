import { Users, Clock, Heart, Award, Calendar, MapPin, ArrowRight } from 'lucide-react'
import type { PortalUser, PortalStats, PortalEvent, PortalActivity } from '../api/portalApi'

interface DashboardViewProps {
  user: PortalUser
  stats: PortalStats
  upcomingEvents: PortalEvent[]
  recentActivities: PortalActivity[]
  joinedEventIds: string[]
  onSelectEvent: (event: PortalEvent) => void
  onNavigateTab: (tab: string) => void
}

export function DashboardView({
  user,
  stats,
  upcomingEvents,
  recentActivities,
  joinedEventIds,
  onSelectEvent,
  onNavigateTab,
}: DashboardViewProps) {
  const featuredEvent = upcomingEvents[0] || null

  const formatEventDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  const formatEventTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return '9:00 AM'
    }
  }

  const isEventJoined = featuredEvent ? joinedEventIds.includes(featuredEvent.id) : false

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#eaf4ed] via-[#e4f0e7] to-[#ddeadf] border border-[#d8e8dc] p-6 sm:p-8 shadow-xs">
        {/* Soft leaf watermark illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-20 pointer-events-none text-[#124734]">
          <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full object-cover">
            <path d="M40 180 C80 120 140 80 190 20 C180 80 140 140 80 180 Z" />
            <path d="M20 190 C60 140 110 100 160 50 C140 100 110 150 50 190 Z" opacity="0.5" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#11382a] tracking-tight">
              Welcome back, {user.name}!
            </h2>
            <p className="text-xs sm:text-sm text-[#356150] font-medium mt-1.5">
              Together for a healthier and brighter Odisha
            </p>
          </div>

          {/* Cursive "Health for All" with flourish underline */}
          <div className="hidden md:flex flex-col items-end pr-4 select-none">
            <span
              className="font-serif italic text-2xl lg:text-3xl text-[#1e5641] font-semibold tracking-wide drop-shadow-2xs"
              style={{ fontFamily: 'Georgia, Cambria, serif' }}
            >
              Health for All
            </span>
            <svg
              className="w-28 h-3 text-[#1e5641] -mt-1 opacity-80"
              viewBox="0 0 120 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M2 7 C30 1, 80 12, 118 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. FOUR METRIC / STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Events Joined */}
        <div className="bg-white rounded-2xl p-5 border border-[#edf3ee] shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-13 h-13 rounded-full bg-[#eaf5ed] text-[#14533d] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold font-heading text-slate-900 leading-none mb-1">
              {stats.eventsJoined}
            </span>
            <span className="text-xs text-[#526058] font-medium">Events Joined</span>
          </div>
        </div>

        {/* Card 2: Volunteer Hours */}
        <div className="bg-white rounded-2xl p-5 border border-[#edf3ee] shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-13 h-13 rounded-full bg-[#eaf5ed] text-[#14533d] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold font-heading text-slate-900 leading-none mb-1">
              {stats.volunteerHours} hrs
            </span>
            <span className="text-xs text-[#526058] font-medium">Volunteer Hours</span>
          </div>
        </div>

        {/* Card 3: Health Camps Supported */}
        <div className="bg-white rounded-2xl p-5 border border-[#edf3ee] shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-13 h-13 rounded-full bg-[#eaf5ed] text-[#14533d] flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold font-heading text-slate-900 leading-none mb-1">
              {stats.campsSupported}
            </span>
            <span className="text-xs text-[#526058] font-medium">Health Camps Supported</span>
          </div>
        </div>

        {/* Card 4: Certificate Earned */}
        <div className="bg-white rounded-2xl p-5 border border-[#edf3ee] shadow-xs flex items-center gap-4 transition-all hover:shadow-md">
          <div className="w-13 h-13 rounded-full bg-[#eaf5ed] text-[#14533d] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="block text-2xl font-extrabold font-heading text-slate-900 leading-none mb-1">
              {stats.certificatesEarned}
            </span>
            <span className="text-xs text-[#526058] font-medium">Certificate Earned</span>
          </div>
        </div>
      </div>

      {/* 3. TWO-COLUMN GRID: UPCOMING EVENTS & RECENT ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: UPCOMING EVENTS */}
        <div className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#143d2e]">
                Upcoming Events
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('events')}
                className="text-xs font-bold text-[#14533d] hover:text-[#0c3325] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <span>&rarr;</span>
              </button>
            </div>

            {featuredEvent ? (
              <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Event Thumbnail */}
                <div className="w-full sm:w-36 h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-2xs">
                  <img
                    src={
                      featuredEvent.cover_image_url ||
                      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={featuredEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <h4 className="font-heading font-bold text-base text-[#153e30] leading-snug">
                    {featuredEvent.title}
                  </h4>

                  <div className="flex items-center gap-2 text-xs text-[#526058]">
                    <Calendar className="w-3.5 h-3.5 text-[#14533d] shrink-0" />
                    <span>
                      {formatEventDate(featuredEvent.start_datetime)} |{' '}
                      {formatEventTime(featuredEvent.start_datetime)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#526058]">
                    <MapPin className="w-3.5 h-3.5 text-[#14533d] shrink-0" />
                    <span className="truncate">{featuredEvent.location}</span>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onSelectEvent(featuredEvent)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                        isEventJoined
                          ? 'bg-[#d8eedf] text-[#0f3d2c]'
                          : 'bg-[#eaf5ed] hover:bg-[#d8eedf] text-[#14533d]'
                      }`}
                    >
                      <span>{isEventJoined ? 'Attending ✓' : 'View Details →'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No upcoming events right now. Check back soon!
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITIES */}
        <div className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#143d2e]">
                Recent Activities
              </h3>
              <button
                type="button"
                onClick={() => onNavigateTab('activities')}
                className="text-xs font-bold text-[#14533d] hover:text-[#0c3325] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <span>&rarr;</span>
              </button>
            </div>

            <div className="space-y-4">
              {recentActivities.slice(0, 4).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-2 h-2 rounded-full bg-[#1e825a] shrink-0" />
                    <span className="text-[#243c31] font-medium truncate">{activity.text}</span>
                  </div>
                  <span className="text-[#87998e] text-xs shrink-0 whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM BANNER */}
      <div className="rounded-2xl bg-[#eaf4ed] p-4 sm:p-5 border border-[#d8e8dc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white text-[#14533d] flex items-center justify-center shrink-0 shadow-2xs">
            <Heart className="w-5 h-5 text-[#14533d] fill-[#eaf4ed]" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-[#11382a]">
              Thank you for being a part of SCNSWF!
            </h4>
            <p className="text-xs text-[#486b5c] mt-0.5">
              Your contribution helps build a healthier Odisha.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('programs')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#124734] hover:bg-[#0c3325] text-white text-xs font-semibold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span>Explore More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
