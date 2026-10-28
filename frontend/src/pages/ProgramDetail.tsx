import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Heart, MapPin, ArrowLeft, Activity,
  Baby, GraduationCap, HandHeart,
  Stethoscope, CheckCircle2, ShieldCheck, Wifi
} from "lucide-react"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"
import { useProgramDetail, useProgramServices } from "../hooks/usePrograms"

/* Grounded program fallback definitions */
const FALLBACK_PROGRAMS: Record<string, {
  icon: typeof Activity; tag: string; title: string;
  summary: string; description: string; problem: string;
  coverage: string; focus: string; services: string[];
  color: string; bg: string; placeholderLabel: string;
  image?: string;
}> = {
  "healthcare-medical-relief": {
    icon: Activity, tag: "Primary Healthcare",
    title: "Healthcare & Medical Relief",
    summary: "Providing accessible healthcare, mobile clinics, and preventative medical camps to underserved rural communities.",
    description: "Our flagship healthcare initiative bridges the gap between critical medical services and marginalized populations. We operate regular diagnostic camps, provide free essential medications, and conduct widespread awareness campaigns on polio eradication and child hygiene.",
    problem: "Rural villages lack accessible primary health centers, resulting in untreated chronic illnesses and high maternal and child mortality.",
    coverage: "Odisha, Jharkhand, and border districts across eastern India.",
    focus: "Doorstep Medical Diagnosis, Treatment & Primary Referrals",
    services: [
      "Mobile Health Clinics & Ambulance Outreach",
      "Polio & Preventive Immunization Campaigns",
      "Essential Free Medicine Dispensation",
      "Emergency Hospital Referral Linkages"
    ],
    color: "#1b6b68", bg: "#edfafa",
    image: "/images/events/free-skin-health-camp-balashram.jpg",
    placeholderLabel: "Free Medical Health Camp & Consultations",
  },
  "mobile-health-units": {
    icon: Activity, tag: "Primary Healthcare",
    title: "Mobile Health Units",
    summary: "Bringing comprehensive primary healthcare directly to remote villages that lack a permanent facility.",
    description: "Our mobile health units operate on a fixed monthly schedule across designated villages. Each unit is staffed by a visiting physician, nurse, and community health worker. Services include outpatient consultations, blood pressure and diabetes screening, maternal health check-ups, and basic diagnostic tests.",
    problem: "Many rural villages in Odisha are located far from the nearest primary health center. Monsoon accessibility issues and transport expenses frequently delay treatment for common, manageable illnesses until they escalate into serious emergencies.",
    coverage: "High-need rural blocks in Khurda, Nayagarh & adjacent districts",
    focus: "Doorstep Medical Diagnosis, Treatment & Primary Referrals",
    services: [
      "General Outpatient Consultations",
      "Blood Pressure & Blood Sugar Screenings",
      "Free Essential Medicine Dispensation",
      "Maternal & Child Health Check-ups",
      "Emergency Hospital Referral Linkages",
      "Health Education & Counseling"
    ],
    color: "#1b6b68", bg: "#edfafa",
    image: "/images/events/free-skin-health-camp-balashram.jpg",
    placeholderLabel: "Free Medical Health Camp & Consultations",
  },
  "maternal-child-health": {
    icon: Baby, tag: "Maternal Wellness",
    title: "Maternal & Child Health",
    summary: "Supporting mothers and newborns with prenatal care, safe delivery counseling, and postnatal follow-up.",
    description: "Working alongside village ASHA and Anganwadi workers, our maternal health team provides antenatal registration support, group counselling, iron supplementation follow-ups, and birth preparedness guidance.",
    problem: "Geographic distance, economic constraints, and informational gaps contribute to delayed antenatal care and home deliveries without skilled birth attendants in remote regions.",
    coverage: "Tribal and underserved rural areas of Odisha",
    focus: "Antenatal Guidance & Safe Institutional Delivery Counseling",
    services: [
      "Antenatal Registration & Tracking",
      "Nutritional & Dietary Counseling",
      "Birth Preparedness Planning",
      "Postnatal Home Visits & Infant Care",
      "Immunization Adherence Tracking",
      "Caregiver Counseling"
    ],
    color: "#c94a2e", bg: "#fde8e0",
    image: "/images/healthcare/womens-health-hygiene-centurion-auditorium.jpg",
    placeholderLabel: "Women's Health & Hygiene Education",
  },
  "education-skill-development": {
    icon: GraduationCap, tag: "Livelihood & Skills",
    title: "Quality Education & Skill Development",
    summary: "Empowering children and youth through foundational learning kits, digital literacy, and job-oriented vocational training.",
    description: "Education is the most sustainable antidote to generational poverty. SCNSWF supports government schools, distributes high-quality study materials, runs after-school learning centers, and trains youth in market-relevant vocational skills.",
    problem: "Severe school dropout rates after primary grades and youth unemployability due to lack of practical vocational skills.",
    coverage: "Semi-urban slums and remote tribal educational clusters.",
    focus: "Vocational Training & Micro-Enterprise Mentorship",
    services: [
      "Child Hygiene & Handwashing Education",
      "Basic Computer Literacy Courses",
      "Garment Tailoring & Stitching Modules",
      "Youth Career Counseling"
    ],
    color: "#d97706", bg: "#fffbeb",
    image: "/images/healthcare/saukhyam-pads-campus-outreach.jpg",
    placeholderLabel: "Sustainable Hygiene & Skill Enterprise",
  },
  "women-empowerment-self-reliance": {
    icon: GraduationCap, tag: "Empowerment",
    title: "Women Empowerment & Self-Reliance",
    summary: "Fostering financial independence through micro-enterprise coaching, self-help groups (SHGs), and leadership workshops.",
    description: "We organize rural women into self-help groups, providing seed capital guidance, artisan handicraft training, and financial literacy to foster true autonomy and gender equity.",
    problem: "Women facing financial dependence, lack of credit access, and low economic participation in rural economies.",
    coverage: "Coastal and tribal districts.",
    focus: "Artisan Micro-Finance & Skill Training",
    services: [
      "Artisan Micro-Finance & Skill Training",
      "Market Exhibition & Linkage Support",
      "Women Self-Help Group (SHG) Support"
    ],
    color: "#d97706", bg: "#fffbeb",
    image: "/images/healthcare/saukhyam-pads-campus-outreach.jpg",
    placeholderLabel: "Women Enterprise & Skills",
  },
  "disaster-relief-community-welfare": {
    icon: HandHeart, tag: "Community Inclusion",
    title: "Disaster Relief & Community Welfare",
    summary: "Rapid response emergency supplies, cyclone shelters, winter clothing distribution, and geriatric support.",
    description: "When natural catastrophes strike or severe winter winds arrive, our field volunteers deploy immediately with dry rations, water purification kits, hygiene packs, and temporary shelter rehabilitation.",
    problem: "Vulnerability of coastal and riverine families to cyclones, floods, and seasonal extremes.",
    coverage: "High-risk coastal flood and cyclone belts.",
    focus: "Rapid Emergency Response & Assistive Aid Linkage",
    services: [
      "Emergency Food Rations & Water Relief",
      "Assistive Device Facilitation",
      "Shelter Rehabilitation Guidance"
    ],
    color: "#134a48", bg: "#edfafa",
    image: "/images/healthcare/body-pain-causes-cures.jpg",
    placeholderLabel: "Disaster Relief & Community Care",
  },
}

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>()
  const safeSlug = slug || ""

  // Live API queries
  const { data: apiProgram, isLoading } = useProgramDetail(safeSlug)
  const { data: apiServices } = useProgramServices(safeSlug)

  const fallback = FALLBACK_PROGRAMS[safeSlug] || FALLBACK_PROGRAMS["healthcare-medical-relief"]

  const title = apiProgram?.title || fallback.title
  const summary = apiProgram?.summary || fallback.summary
  const description = apiProgram?.description || fallback.description
  const problem = apiProgram?.problem_addressed || fallback.problem
  const coverage = apiProgram?.geographical_coverage || fallback.coverage
  const focus = fallback.focus
  const color = fallback.color
  const Icon = fallback.icon
  const tag = fallback.tag
  const image = apiProgram?.cover_image_url || fallback.image
  const placeholderLabel = fallback.placeholderLabel

  // Services from live API if present, otherwise fallback
  const servicesList = (apiServices && apiServices.length > 0)
    ? apiServices.map(s => s.title)
    : fallback.services

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 50%, #1b6b68 90%)" }}
      >
        <div className="container-custom relative z-10">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-5 text-teal-200 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to All Programs
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-teal-200 border border-white/15">
              <Icon size={20} />
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.12)", color: "#9de4e3" }}
            >
              {tag}
            </span>

            {apiProgram && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                <Wifi size={12} /> Live API Synced
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            {isLoading ? "Loading program details…" : title}
          </h1>
          <p className="text-base sm:text-lg max-w-3xl leading-relaxed text-teal-50/90 font-normal">
            {summary}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Main Content & Sidebar ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-10">
              {/* Photo Area */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <ImagePlaceholder
                  src={image}
                  alt={title}
                  label={placeholderLabel}
                  aspect="16/9"
                  className="w-full"
                  objectFit="cover"
                />
              </div>

              {/* The Problem */}
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-2xl font-bold mb-3 text-slate-900">
                  The Grassroots Challenge Addressed
                </h2>
                <div
                  className="p-5 rounded-2xl border-l-4 text-sm leading-relaxed"
                  style={{ background: `${color}0d`, borderColor: color, color: "#374151" }}
                >
                  {problem}
                </div>
              </motion.div>

              {/* Implementation Strategy */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-3 text-slate-900">
                  How SCNSWF Implements This Program
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm mb-4">
                  {description}
                </p>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-teal-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Collaborative Delivery Model</span>
                    We collaborate actively with local village panchayats, district health offices, and existing public infrastructure to guarantee continuity and avoid redundant service overlaps.
                  </div>
                </div>
              </div>

              {/* Field Services */}
              <div>
                <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
                  Key Services & Interventions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {servicesList.map(s => (
                    <div key={s} className="flex items-center gap-2.5 p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                      <CheckCircle2 size={16} style={{ color }} className="shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-slate-800">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Operational Summary & Donation Widget */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl border border-slate-200 bg-slate-50 shadow-sm sticky top-24">
                <h3 className="font-display font-bold text-lg text-slate-900 mb-4 pb-2 border-b border-slate-200">
                  Program Snapshot
                </h3>

                <div className="space-y-4 text-xs sm:text-sm mb-6">
                  <div>
                    <span className="text-slate-500 block mb-1 flex items-center gap-1.5 font-medium">
                      <MapPin size={14} className="text-teal-600" /> Geographic Coverage
                    </span>
                    <span className="font-semibold text-slate-800">{coverage}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1 flex items-center gap-1.5 font-medium">
                      <Stethoscope size={14} className="text-teal-600" /> Operational Approach
                    </span>
                    <span className="font-semibold text-slate-800">{focus}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1 flex items-center gap-1.5 font-medium">
                      <Heart size={14} className="text-teal-600" /> Status
                    </span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block">
                      Active Field Operations
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Link
                    to={`/donate?program=${safeSlug}`}
                    className="btn btn-accent w-full justify-center text-sm py-3"
                  >
                    <Heart size={16} fill="currentColor" /> Donate to this Program
                  </Link>

                  <Link
                    to="/get-involved/volunteer"
                    className="btn btn-secondary w-full justify-center text-xs py-2.5"
                  >
                    Volunteer on this Initiative
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
