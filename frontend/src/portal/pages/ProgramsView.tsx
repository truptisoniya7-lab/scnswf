import { useEffect, useState } from 'react'
import { apiClient } from '../../api/client'
import { HeartPulse, ArrowRight, Loader2 } from 'lucide-react'

export function ProgramsView() {
  const [programs, setPrograms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        const res = await apiClient.get<any>('/programs')
        setPrograms(res.data?.data ?? res.data ?? [])
      } catch (err) {
        console.error('Failed to load programs:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#143d2e]">Health & Welfare Programs</h2>
        <p className="text-xs text-[#526058] mt-1">
          Explore SCNSWF's grassroots healthcare, education, and social development initiatives.
        </p>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="w-8 h-8 text-[#14533d] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <div
              key={prog.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#edf3ee] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="h-40 bg-slate-100 overflow-hidden relative">
                  <img
                    src={
                      prog.cover_image_url ||
                      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={prog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#14533d] text-[11px] font-bold flex items-center gap-1 shadow-2xs">
                    <HeartPulse className="w-3.5 h-3.5" />
                    <span>Active Initiative</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {prog.summary || prog.description}
                  </p>
                  {prog.geographical_coverage && (
                    <p className="text-[11px] text-[#3e6856] font-medium pt-1">
                      Coverage: {prog.geographical_coverage}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`/programs/${prog.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#eaf5ed] hover:bg-[#d8eedf] text-[#14533d] text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>Learn More on Public Site</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
