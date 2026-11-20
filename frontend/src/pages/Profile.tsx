import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { passwordlessAuthApi, type User } from '../lib/api/auth'
import {
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  LogOut,
  Heart,
  ArrowRight,
  Briefcase,
} from 'lucide-react'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const current = passwordlessAuthApi.getCurrentUser()
    if (!current) {
      navigate('/login', { replace: true })
      return
    }
    setUser(current)
  }, [navigate])

  const handleLogout = async () => {
    await passwordlessAuthApi.logout()
    navigate('/login', { replace: true })
  }

  if (!user) {
    return null
  }

  const roleLabels: Record<string, { label: string; color: string; desc: string }> = {
    internship: {
      label: 'Internship Member',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      desc: 'Participating in SCNSWF grassroots and clinical internship initiatives.',
    },
    donor: {
      label: 'Donor & Benefactor',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      desc: 'Supporting critical healthcare and medicine distribution programs.',
    },
    volunteer: {
      label: 'Volunteer Partner',
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      desc: 'Contributing dedicated hours and expertise on the ground across Odisha.',
    },
  }

  const roleInfo = roleLabels[user.role] || {
    label: (user.role || 'Member').toUpperCase(),
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    desc: 'SCNSWF Community Member.',
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top welcome card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0c4737] text-white flex items-center justify-center font-bold text-2xl font-heading shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading font-extrabold text-2xl text-slate-900">
                    {user.name || 'SCNSWF Member'}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.color}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {roleInfo.label}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{roleInfo.desc}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Mail className="w-4 h-4 text-[#105e49]" />
                <span>Email Address</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 break-all">{user.email}</div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified with OTP</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Phone className="w-4 h-4 text-[#105e49]" />
                <span>Phone Number</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {user.phone ? `+91 ${user.phone}` : 'Not provided'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Primary contact</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                <Calendar className="w-4 h-4 text-[#105e49]" />
                <span>Member Since</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Recent'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Active status</div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            to="/programs"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-[#105e49]/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#105e49] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-[#105e49] transition-colors">
                Our Programs & Healthcare
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Explore our ongoing mobile health units, rural medical camps, and community initiatives.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#105e49] mt-4">
              <span>View programs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link
            to="/donate"
            className="group p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-[#105e49]/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                Support SCNSWF
              </h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                Every contribution empowers underprivileged families across Odisha with life-saving healthcare.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-700 mt-4">
              <span>Make a donation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
