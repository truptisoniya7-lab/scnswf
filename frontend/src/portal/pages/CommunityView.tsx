import { Users, Award, Shield, MessageSquare } from 'lucide-react'

export function CommunityView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#143d2e]">Volunteer Community</h2>
        <p className="text-xs text-[#526058] mt-1">
          Connect with 500+ active healthcare volunteers and ground workers across Odisha.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#edf7f0] text-[#14533d] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">District Volunteer Hubs</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Active chapters in Khordha, Cuttack, Puri, Balasore, and Koraput coordinating weekly rural clinics.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#edf7f0] text-[#14533d] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">Monthly Recognition</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Top volunteers with 50+ hours receive certificates of appreciation and leadership responsibilities.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#edf7f0] text-[#14533d] flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">Volunteer Code</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Strict adherence to patient privacy, compassionate care, and respectful engagement with local elders.
          </p>
        </div>
      </div>

      {/* WhatsApp Community Banner */}
      <div className="bg-[#edf7f0] rounded-3xl p-6 border border-[#d6ecdc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-heading font-bold text-sm text-[#14533d]">Join the Official WhatsApp Volunteer Group</h4>
          <p className="text-xs text-[#44725e] mt-1">
            Get instant camp dispatch alerts, emergency blood requests, and ride-shares directly on WhatsApp.
          </p>
        </div>
        <a
          href="https://chat.whatsapp.com"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-[#14533d] hover:bg-[#0c3929] text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Join WhatsApp Group</span>
        </a>
      </div>
    </div>
  )
}
