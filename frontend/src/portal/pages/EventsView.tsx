import { useState } from 'react'
import { Calendar, MapPin, Search, Check } from 'lucide-react'
import type { PortalEvent } from '../api/portalApi'

interface EventsViewProps {
  events: PortalEvent[]
  joinedEventIds: string[]
  onSelectEvent: (event: PortalEvent) => void
}

export function EventsView({ events, joinedEventIds, onSelectEvent }: EventsViewProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatEventDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#143d2e]">Events & Medical Camps</h2>
          <p className="text-xs text-[#526058] mt-1">
            Browse upcoming health check-up camps, blood donation drives, and community rallies.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search events or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-hidden focus:border-[#14533d]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt) => {
          const isJoined = joinedEventIds.includes(evt.id)
          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#edf3ee] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="h-44 bg-slate-100 overflow-hidden relative">
                  <img
                    src={
                      evt.cover_image_url ||
                      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  {isJoined && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md">
                      <Check className="w-3.5 h-3.5" />
                      <span>Attending</span>
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                    {evt.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-[#14533d]" />
                    <span>{formatEventDate(evt.start_datetime)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-[#14533d]" />
                    <span>{evt.location}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed">
                    {evt.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={() => onSelectEvent(evt)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isJoined
                      ? 'bg-[#edf7f0] text-[#14533d] hover:bg-[#d8eedf]'
                      : 'bg-[#124734] hover:bg-[#0c3325] text-white shadow-xs'
                  }`}
                >
                  {isJoined ? 'View Registration Details' : 'View Details & Join \u2192'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
