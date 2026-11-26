import { useState } from 'react'
import { User, Mail, Phone, MapPin, Award, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { portalApi, type PortalUser } from '../api/portalApi'

interface ProfileSettingsViewProps {
  user: PortalUser
  onProfileUpdated: (updatedUser: PortalUser) => void
}

export function ProfileSettingsView({ user, onProfileUpdated }: ProfileSettingsViewProps) {
  const [name, setName] = useState(user.name || '')
  const [phone, setPhone] = useState(user.phone || '+91 ')
  const [location, setLocation] = useState('Bhubaneswar, Odisha')
  const [bio, setBio] = useState('Dedicated community health volunteer committed to rural healthcare access across Odisha.')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const res = await portalApi.updateProfile({ name, phone })
      onProfileUpdated(res.user)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setTimeout(() => setMessage(null), 4000)
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to update profile.'
      setMessage({ type: 'error', text: errMsg })
    } finally {
      setIsSaving(false)
    }
  }

  const skills = [
    'Patient Intake & Registration',
    'BP & Vitals Triage',
    'Community Health Outreach',
    'Emergency First Aid',
    'Logistics & Camp Setup',
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#143d2e]">Profile Settings</h2>
        <p className="text-xs text-[#526058] mt-1">
          Manage your volunteer credentials, contact details, and district assignment.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold ${
            message.type === 'success'
              ? 'bg-[#edf7f0] text-[#14533d] border border-[#d6ecdc]'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edf3ee] shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Card */}
          <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-[#124734] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-xs">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500 font-medium capitalize mt-0.5">
                Official {user.role || 'Volunteer'} • Odisha Chapter
              </p>
              <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-[#edf7f0] text-[#14533d] text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3 text-[#14533d]" />
                <span>Verified Member</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#14533d] outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Email (Read-Only) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Registered Email (Official ID)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  disabled
                  className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#14533d] outline-hidden transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary District
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#14533d] outline-hidden transition-all"
                />
              </div>
            </div>
          </div>

          {/* Volunteer Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Volunteer Bio / Objectives
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#14533d] outline-hidden transition-all resize-none"
            />
          </div>

          {/* Verified Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Recognized Skills & Service Badges
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#edf7f0] text-[#14533d] text-xs font-semibold border border-[#d6ecdc]"
                >
                  <Award className="w-3.5 h-3.5 text-[#14533d]" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#124734] hover:bg-[#0c3325] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
