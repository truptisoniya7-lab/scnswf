import { FileText, Download, ShieldCheck, HeartPulse, FileSpreadsheet, ExternalLink } from 'lucide-react'

const resources = [
  {
    id: 'res-1',
    title: 'Rural Health Check-up Camp SOP & Field Handbook',
    category: 'Operations & Guidelines',
    description: 'Complete operational procedure for setting up camp registration desks, doctor booths, and pharmacy dispensing in rural Odisha.',
    fileType: 'PDF Document',
    fileSize: '2.4 MB',
    icon: FileText,
    badge: 'Essential',
  },
  {
    id: 'res-2',
    title: 'Patient Vitals & Medical Screening Triage Sheet',
    category: 'Templates & Clinical',
    description: 'Standardized intake sheet for documenting Blood Pressure, Blood Sugar, SpO2, BMI, and clinical red-flag referrals.',
    fileType: 'Spreadsheet Template',
    fileSize: '450 KB',
    icon: FileSpreadsheet,
    badge: 'Template',
  },
  {
    id: 'res-3',
    title: 'Emergency Medical First Aid & Golden Hour Protocol',
    category: 'Emergency & Safety',
    description: 'First aid emergency action steps for heat stroke, anaphylaxis, severe hypoglycemia, and emergency 108 ambulance dispatch.',
    fileType: 'PDF Guide',
    fileSize: '1.8 MB',
    icon: HeartPulse,
    badge: 'Safety',
  },
  {
    id: 'res-4',
    title: 'Volunteer Code of Ethics & Patient Confidentiality',
    category: 'Compliance & Ethics',
    description: 'Mandatory ethical code regarding beneficiary privacy, non-discrimination, photograph consent, and respectful communication.',
    fileType: 'PDF Policy',
    fileSize: '820 KB',
    icon: ShieldCheck,
    badge: 'Mandatory',
  },
  {
    id: 'res-5',
    title: 'Community Health Awareness Leaflet (Odia & English)',
    category: 'Public Awareness',
    description: 'Printable double-sided pamphlet on diabetes prevention, maternal nutrition, and seasonal monsoon illness prevention.',
    fileType: 'Printable PDF',
    fileSize: '3.1 MB',
    icon: FileText,
    badge: 'Outreach',
  },
]

export function ResourcesView() {
  const handleDownload = (title: string) => {
    window.alert(`Resource "${title}" is ready. Offline download started.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#143d2e]">Volunteer Knowledge & Resources</h2>
        <p className="text-xs text-[#526058] mt-1">
          Official standard operating guidelines, screening templates, and training materials for grassroots field work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {resources.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#edf7f0] text-[#14533d] text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {item.fileSize}
                  </span>
                </div>

                <div className="flex items-start gap-4 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f0f6f2] text-[#14533d] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.fileType}
                </span>

                <button
                  type="button"
                  onClick={() => handleDownload(item.title)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#edf7f0] hover:bg-[#dceeec] text-[#14533d] text-xs font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Guide</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resource Notice */}
      <div className="rounded-2xl bg-white p-5 border border-dashed border-[#ccd9cf] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <ExternalLink className="w-4 h-4 text-[#14533d] shrink-0" />
          <span>Need custom training materials or physical banner kits for your district camp? Contact your SCNSWF district officer.</span>
        </div>
      </div>
    </div>
  )
}
