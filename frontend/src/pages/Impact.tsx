import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from "recharts"
import {
  Heart, Users, MapPin, ArrowRight,
  TrendingUp, FileText, ChevronRight,
  Stethoscope, ShieldCheck, CheckCircle2, Eye
} from "lucide-react"
import { ImagePlaceholder, PlaceholderBanner } from "../components/ui/ImagePlaceholder"

/* ── Programmatic Focus Distribution ── */
const PROGRAM_BREAKDOWN = [
  { name: "Mobile Primary Healthcare", value: 38, color: "#1b6b68" },
  { name: "Maternal & Child Health", value: 24, color: "#c94a2e" },
  { name: "Youth & Women Livelihoods", value: 16, color: "#d97706" },
  { name: "Preventative Awareness", value: 12, color: "#279490" },
  { name: "WASH & Sanitation", value: 10, color: "#134a48" },
]

/* ── Targeted Focus Districts ── */
const DISTRICT_FOCUS = [
  { name: "Khurda", focus: "Mobile Health Unit Routes & Specialist Screenings" },
  { name: "Nayagarh", focus: "Rural Primary Care & Fluoride Risk Awareness" },
  { name: "Rayagada", focus: "Maternal & Child Health Village Counseling" },
  { name: "Koraput", focus: "Grassroots Nutrition & Safe Delivery Facilitation" },
  { name: "Kandhamal", focus: "Tribal Health Outreach & Disability Aid Linkage" },
  { name: "Ganjam", focus: "Preventative Screening Camps & School Health" },
  { name: "Cuttack", focus: "Peri-urban Health Camps & Livelihood Workshops" },
  { name: "Puri", focus: "Community Sanitation & Water Safety Sessions" },
]

const STORIES = [
  {
    title: "Timely Hypertension Detection in Nayagarh",
    summary: "During a routine mobile medical camp visit, early diagnostic screening helped detect asymptomatic hypertension, enabling immediate treatment and continuous community follow-up.",
    program: "Mobile Health Units",
    district: "Nayagarh",
    slug: "sunita-story",
  },
  {
    title: "Maternal Health Support in Tribal Hamlets",
    summary: "Dedicated counseling by village health coordinators encouraged institutional delivery planning and proper iron supplementation for expecting mothers.",
    program: "Maternal & Child Health",
    district: "Koraput",
    slug: "phulmati-story",
  },
  {
    title: "Vocational Independence for Rural Youth",
    summary: "Market-oriented tailoring and practical skills training provided local self-employment opportunities for rural women and youth in peri-urban clusters.",
    program: "Skill Development",
    district: "Cuttack",
    slug: "ramesh-story",
  },
]

export default function Impact() {
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
                <span
                  className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-4 px-3.5 py-1.5 rounded-full border"
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
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
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

      {/* ── Programmatic Focus Distribution Chart ── */}
      <section className="py-14 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-2">
              Resource Distribution
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
              Where Our Efforts Are Directed
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Relative programmatic focus across healthcare delivery, maternal care, and community empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
            {/* Chart */}
            <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-display font-bold text-sm text-slate-800 mb-4 text-center">
                Program Resource Allocation (%)
              </h3>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PROGRAM_BREAKDOWN}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {PROGRAM_BREAKDOWN.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, "Resource Share"]} />
                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Program Breakdown List */}
            <div className="lg:col-span-6 space-y-3">
              {PROGRAM_BREAKDOWN.map((p) => (
                <div
                  key={p.name}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-xs sm:text-sm font-bold text-slate-800">{p.name}</span>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {p.value}% Share
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Ground Documentation (Images) ── */}
      <section className="py-14 md:py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
              Visual Documentation
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
              Field Work in Reality
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Photographic proof of community camps, village meetings, and healthcare worker interactions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex flex-col">
              <ImagePlaceholder
                src="/images/hero/together-rising-womens-health.jpg"
                alt="SCNSWF Together Rising - Sustainable menstrual health and women empowerment initiative"
                label="Together Rising Initiative"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-teal-700">Community Health</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">Together Rising Campaign</div>
                  <p className="text-xs text-slate-600 mt-1">Student volunteer engagement & eco-friendly menstrual hygiene distribution.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex flex-col">
              <ImagePlaceholder
                src="/images/healthcare/womens-health-hygiene-centurion-auditorium.jpg"
                alt="Women's Health, Hygiene and Sustainable Living seminar in Centurion University"
                label="Women's Health Seminar"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-700">Campus Education</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">Hygiene & Sustainable Living</div>
                  <p className="text-xs text-slate-600 mt-1">Large-scale educational session for female university students and peer educators.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex flex-col">
              <ImagePlaceholder
                src="/images/healthcare/polio-free-india-awareness.jpg"
                alt="SCNSWF Polio Eradication and Childhood Immunization Drive"
                label="Routine Immunization"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-teal-700">Preventive Healthcare</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">Polio Eradication Drives</div>
                  <p className="text-xs text-slate-600 mt-1">Sustaining routine polio vaccination awareness and child healthcare drops.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex flex-col">
              <ImagePlaceholder
                src="/images/education/child-health-handwashing.jpg"
                alt="SCNSWF Child Health & Hygiene Education Guide"
                label="Child Health Education"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 bg-white flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-coral-700" style={{ color: "#c94a2e" }}>Child Hygiene</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">Handwashing & Sanitation</div>
                  <p className="text-xs text-slate-600 mt-1">School-level demonstrations on hand hygiene to prevent disease transmission.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/gallery" className="btn btn-secondary inline-flex items-center gap-2 text-xs sm:text-sm">
              <Eye size={16} /> View Foundation Photo Gallery
            </Link>
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

      {/* ── Stories of Change Preview ── */}
      <section className="py-14 md:py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
                Field Narratives
              </span>
              <h2 className="font-display text-3xl font-bold text-slate-900">Stories of Impact</h2>
            </div>
            <Link to="/stories" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900">
              All Stories of Change <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STORIES.map((s) => (
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
                <Link to={`/stories/${s.slug}`} className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                  Read narrative <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
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
