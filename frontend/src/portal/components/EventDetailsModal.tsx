import { Calendar, MapPin, Clock, X, Check, Loader2 } from 'lucide-react'
import type { PortalEvent } from '../api/portalApi'

interface EventDetailsModalProps {
  event: PortalEvent | null
  isOpen: boolean
  onClose: () => void
  isJoined: boolean
  onJoin: (eventId: string) => Promise<void>
  isJoining: boolean
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
  isJoined,
  onJoin,
  isJoining,
}: EventDetailsModalProps) {
  if (!isOpen || !event) return null

  const startDate = new Date(event.start_datetime)
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Cover Image */}
        {event.cover_image_url && (
          <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
            <img
              src={event.cover_image_url}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white hover:bg-black/60 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-6">
          {!event.cover_image_url && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <h3 className="text-xl font-bold font-heading text-slate-900 leading-snug mb-3">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#14533d] shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#14533d] shrink-0" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#14533d] shrink-0" />
              <span>{event.location}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 border-t border-slate-100 pt-3">
            {event.description}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>

            {isJoined ? (
              <div className="flex-1 py-2.5 rounded-xl bg-[#edf7f0] text-[#14533d] text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs">
                <Check className="w-4 h-4" />
                <span>You're Attending</span>
              </div>
            ) : (
              <button
                type="button"
                disabled={isJoining}
                onClick={() => onJoin(event.id)}
                className="flex-1 py-2.5 rounded-xl bg-[#124734] hover:bg-[#0c3325] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>Join Event &rarr;</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
