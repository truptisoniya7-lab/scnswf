import { Calendar, Award, CheckCircle2, Clock } from 'lucide-react'
import type { PortalActivity, PortalStats } from '../api/portalApi'

interface ActivitiesViewProps {
  stats: PortalStats
  activities: PortalActivity[]
}

export function ActivitiesView({ stats, activities }: ActivitiesViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#143d2e]">My Activities</h2>
        <p className="text-xs text-[#526058] mt-1">
          Review your volunteer hours, attended health drives, and certificates.
        </p>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#edf3ee] shadow-xs flex items-center gap-3">
          <Clock className="w-8 h-8 text-[#14533d] p-1.5 bg-[#edf7f0] rounded-xl" />
          <div>
            <span className="block text-xl font-bold text-slate-900">{stats.volunteerHours} Hours</span>
            <span className="text-[11px] text-slate-500 font-medium">Logged & Verified</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#edf3ee] shadow-xs flex items-center gap-3">
          <Calendar className="w-8 h-8 text-[#14533d] p-1.5 bg-[#edf7f0] rounded-xl" />
          <div>
            <span className="block text-xl font-bold text-slate-900">{stats.eventsJoined} Drives</span>
            <span className="text-[11px] text-slate-500 font-medium">Events Participated</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-[#edf3ee] shadow-xs flex items-center gap-3">
          <Award className="w-8 h-8 text-[#14533d] p-1.5 bg-[#edf7f0] rounded-xl" />
          <div>
            <span className="block text-xl font-bold text-slate-900">{stats.certificatesEarned} Certificate</span>
            <span className="text-[11px] text-slate-500 font-medium">Official Recognition</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs">
        <h3 className="font-heading font-bold text-base text-slate-900 mb-6 flex items-center gap-2">
          <span>Activity History</span>
        </h3>

        <div className="relative border-l-2 border-[#edf3ee] ml-3 space-y-6">
          {activities.map((act) => (
            <div key={act.id} className="relative pl-6">
              <span className="absolute -left-2 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#1e825a]" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <p className="text-sm font-semibold text-slate-800">{act.text}</p>
                <span className="text-xs text-slate-400">{act.timestamp}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified by SCNSWF Coordinator</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
