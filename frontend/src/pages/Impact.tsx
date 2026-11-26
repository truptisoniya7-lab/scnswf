import { useMemo } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Heart, Users, MapPin, ArrowRight,
  TrendingUp, FileText, ChevronRight,
  Stethoscope, ShieldCheck, CheckCircle2, Wifi
} from "lucide-react"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts"
import { ImagePlaceholder, PlaceholderBanner } from "../components/ui/ImagePlaceholder"
import { useImpactMetrics, useImpactStories } from "../hooks/useImpact"
import type { ImpactMetric, ImpactStory } from "../types"

/* ── Official Targeted Reach ── */
const DISTRICT_FOCUS = [
  { name: "Bhubaneswar", focus: "Urban-focused healthcare services and community health outreach" },
  { name: "Khordha District", focus: "Mobile medical units and rural health camps" },
  { name: "Puri Coastal Areas", focus: "Community healthcare across coastal areas" },
  { name: "Cuttack Region", focus: "Healthcare camps and urban and peri-urban outreach" },
  { name: "Tribal Hamlets", focus: "Remote-community medical outreach and health support" },
]

/* ── Official Stories ── */
const DEFAULT_STORIES = [
  {
    title: "Elderly Diabetes Care",
    summary: "“Before the health camp, I had no access to a doctor. SCNSWF’s free consultation helped me detect and manage my diabetes early. They gave me hope and guidance for elderly diabetes care in India.”",
    program: "Healthcare",
    district: "Bhubaneswar",
    slug: "elderly-diabetes-care",
  },
  {
    title: "Menstrual Health Awareness",
    summary: "A college student shared that the menstrual hygiene session changed how she viewed her health and gave her confidence to discuss and adopt sustainable practices.",
    program: "Health Awareness",
    district: "KIIT University",
    slug: "menstrual-health-awareness",
  },
  {
    title: "Maternal Healthcare",
    summary: "A young mother received prenatal care and nutrition guidance that supported a healthy pregnancy and birth in a rural village.",
    program: "Maternal Care",
    district: "Rural Odisha",
    slug: "maternal-healthcare",
  },
]

const OFFICIAL_RESOURCE_BREAKDOWN = [
  { name: "Mobile Healthcare", value: 5000, color: "#1b6b68", count: "5,000+ patients" },
  { name: "Health Camps", value: 8000, color: "#c94a2e", count: "8,000+ free check-ups" },
  { name: "Maternal Care", value: 1200, color: "#d97706", count: "1,200+ prenatal check-ups" },
  { name: "Urban Clinics", value: 2000, color: "#279490", count: "2,000+ urban beneficiaries" },
  { name: "Women’s Health Awareness", value: 500, color: "#134a48", count: "500+ mothers supported" },
]

export default function Impact() {
  // Live API hooks
  const { data: apiMetrics, isLoading: loadingMetrics } = useImpactMetrics()
  const { data: apiStoriesResponse, isLoading: loadingStories } = useImpactStories()

  // Format metrics
  const displayMetrics = useMemo(() => {
    if (apiMetrics && apiMetrics.length > 0) {
      return apiMetrics.map((m: ImpactMetric) => ({
        id: m.id,
        label: m.label,
        value: m.label === "Districts Reached" ? String(m.value) : `${Number(m.value).toLocaleString("en-IN")}+`,
        unit: m.unit,
      }))
    }
    // Figures published on the official SCNSWF impact page
    return [
      { id: "m1", label: "Women & Children Served", value: "500+", unit: "beneficiaries" },
      { id: "m2", label: "Medical Consultations", value: "1,000+", unit: "consultations" },
      { id: "m3", label: "Elderly Diabetes Care", value: "200+", unit: "patients" },
      { id: "m4", label: "Districts Reached", value: "5", unit: "district areas" },
    ]
  }, [apiMetrics])

  // Format stories
  const displayStories = useMemo(() => {
    if (apiStoriesResponse && apiStoriesResponse.data && apiStoriesResponse.data.length > 0) {
      return apiStoriesResponse.data.map((s: ImpactStory) => ({
        id: s.id,
        title: s.title,
        summary: s.summary,
        program: "Field Program",
        district: "Odisha Block",
        slug: s.slug,
      }))
    }
    return DEFAULT_STORIES
  }, [apiStoriesResponse])

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 50%, #1b6b68 90%)" }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            style={{
              position: "absolute",
              top: "-10%",
              right: "-5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "rgba(39,148,144,0.14)",
              filter: "blur(75px)",
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold px-3.5 py-1.5 rounded-full border"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#9de4e3",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <TrendingUp size={14} className="text-amber-300" />
                    <span>Transparent Grassroots Accountability</span>
                  </span>

                  {apiMetrics && apiMetrics.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                      <Wifi size={12} /> Live API Metrics
                    </span>
                  )}
                </div>

                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
                  Our <span className="text-gradient">Impact</span> & Focus
                </h1>
                <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-6 font-normal" style={{ color: "rgba(255,255,255,0.85)" }}>
                  We assess our work by real, tangible field interventions — medical camps organized, families counseled, and sustainable village partnerships built across Odisha.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/donate" className="btn btn-accent">
                    <Heart size={16} fill="currentColor" /> Support Our Field Work
                  </Link>
                  <Link
                    to="/programs"
                    className="btn btn-secondary"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.35)",
                      color: "#ffffff",
                      background: "rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    View Active Programs
                  </Link>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <ImagePlaceholder
                  src="/images/events/free-skin-health-camp-balashram.jpg"
                  alt="Free Skin Healthcare camp at Ramakrusna Balashram in collaboration with IADVL and HOMSO"
                  label="Health Camp · Balashram Outreach"
                  aspect="16/10"
                  className="w-full"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="00 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Live Impact Metrics Stat Banner ── */}
      <section className="py-8 bg-slate-900 border-b border-slate-800 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {displayMetrics.map((metric) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs"
              >
                <div className="font-display text-3xl sm:text-4xl font-black text-amber-300 mb-1">
                  {loadingMetrics ? "..." : metric.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">{metric.label}</div>
                <div className="text-[11px] text-teal-400 capitalize mt-0.5">{metric.unit}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Honest Framework & Disclaimer ── */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <PlaceholderBanner
            message="Data Transparency Commitment: SCNSWF strictly avoids inflating beneficiary figures. Verified, audited operational metrics and financial disclosures are compiled annually and published openly."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-teal-50 text-teal-700">
                <Stethoscope size={24} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                Direct Primary Care
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Visiting doctors and paramedical teams delivering essential care at village doorstep.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-amber-50 text-amber-700">
                <Users size={24} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                Community Health Ties
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Close coordination with local ASHA workers and Anganwadis to ensure continuity of care.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-sm">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-teal-50 text-teal-700">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                Statutory Compliance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Incorporated Section 8 non-profit with statutory financial reporting and internal audit protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Resource Distribution ── */}
      <section className="py-14 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-2">
              RESOURCE DISTRIBUTION
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">
              Where Our Efforts Are Directed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Relative programmatic focus across healthcare delivery, maternal care, and community empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-4 text-center">
                Program Resource Allocation (%)
              </h3>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={OFFICIAL_RESOURCE_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {OFFICIAL_RESOURCE_BREAKDOWN.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [Number(value).toLocaleString("en-IN"), "Published Beneficiaries"]} />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {OFFICIAL_RESOURCE_BREAKDOWN.map((p) => (
                <div
                  key={p.name}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{p.name}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Geographic Reach (Focus Districts) ── */}
      <section className="py-14 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-2">
              Geographic Focus
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-2">
              Targeted Districts in Odisha
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Operational prioritization based on local healthcare infrastructure deficits and geographic isolation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {DISTRICT_FOCUS.map((d) => (
              <div key={d.name} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-teal-600" />
                    <h3 className="font-display font-bold text-base text-slate-900">{d.name}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{d.focus}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-teal-700">
                  <CheckCircle2 size={12} /> Active Block Reach
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stories of Change Preview (Live API Integrated) ── */}
      <section className="py-14 md:py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block">
                  Field Narratives
                </span>
                {apiStoriesResponse?.data && apiStoriesResponse.data.length > 0 && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                    Live Data
                  </span>
                )}
              </div>
              <h2 className="font-display text-3xl font-bold text-slate-900">Stories of Impact</h2>
            </div>
            <Link to="/stories" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900">
              All Stories of Change <ArrowRight size={14} />
            </Link>
          </div>

          {loadingStories ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 h-48" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayStories.map((s) => (
                <div key={s.slug} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-semibold text-teal-700 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-100">
                        {s.program}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin size={12} /> {s.district}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900 mb-2">{s.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{s.summary}</p>
                  </div>
                  <Link to={`/stories/${s.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900">
                    Read narrative <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Statutory Filings & Annual Reports ── */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="container-custom max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
            Annual Transparency & Disclosures
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
            Financial reports and operational summaries are reviewed independently to ensure total donor trust and statutory adherence.
          </p>
          <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs text-slate-700">
            <FileText size={18} className="text-teal-600" />
            <span>Official audited annual accounts available upon request to donors and regulatory authorities.</span>
          </div>
        </div>
      </section>
    </>
  )
}
