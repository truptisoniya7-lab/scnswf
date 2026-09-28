import { useParams, Link, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Heart, MapPin, ArrowLeft, ChevronRight, Activity,
  Baby, GraduationCap, Megaphone, Droplets, HandHeart,
  Stethoscope, CheckCircle2, ShieldCheck
} from "lucide-react"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"

/* Grounded program definitions */
const PROGRAMS: Record<string, {
  icon: typeof Activity; tag: string; title: string;
  summary: string; description: string; problem: string;
  coverage: string; focus: string; services: string[];
  color: string; bg: string; placeholderLabel: string;
  image?: string;
}> = {
  "mobile-health-units": {
    icon: Activity, tag: "Primary Healthcare",
    title: "Mobile Health Units",
    summary: "Bringing comprehensive primary healthcare directly to remote villages that lack a permanent facility.",
    description: "Our mobile health units operate on a fixed monthly schedule across designated villages. Each unit is staffed by a visiting physician, nurse, and community health worker. Services include outpatient consultations, blood pressure and diabetes screening, maternal health check-ups, and basic diagnostic tests. Referral pathways to district hospitals are maintained for cases requiring specialized care.",
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
    description: "Working alongside village ASHA and Anganwadi workers, our maternal health team provides antenatal registration support, group counselling, iron supplementation follow-ups, and birth preparedness guidance. We focus on bridging the gap between healthcare facilities and pregnant women.",
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
  "skill-development": {
    icon: GraduationCap, tag: "Livelihood & Skills",
    title: "Skill Development & Livelihood",
    summary: "Empowering rural youth and women with market-relevant vocational skills and entrepreneurship support.",
    description: "Our skill development modules offer practical training in tailoring, basic computer operations, and artisan entrepreneurship. Trainees receive mentorship, market linkages, and guidance on establishing independent home-based or cooperative enterprises.",
    problem: "Limited local vocational training opportunities often leave rural youth with few options besides insecure informal labor or distress migration. Practical skill-building provides a sustainable pathway to dignified local earnings.",
    coverage: "Rural clusters and peri-urban hubs in Odisha",
    focus: "Vocational Training & Micro-Enterprise Mentorship",
    services: [
      "Garment Tailoring & Stitching Modules",
      "Basic Computer Literacy Courses",
      "Women Self-Help Group (SHG) Support",
      "Financial Literacy & Banking Assistance",
      "Market Exhibition & Linkage Support",
      "Youth Career Counseling"
    ],
    color: "#d97706", bg: "#fffbeb",
    image: "/images/healthcare/saukhyam-pads-campus-outreach.jpg",
    placeholderLabel: "Sustainable Hygiene & Skill Enterprise",
  },
  "health-awareness": {
    icon: Megaphone, tag: "Preventive Awareness",
    title: "Health Awareness Campaigns",
    summary: "Community-level behavior change campaigns on hygiene, disease prevention, mental health, and reproductive health.",
    description: "Using village health camps, interactive sessions, and trained peer volunteers, our campaigns address preventable illness driven by knowledge gaps. Flagship initiatives include menstrual hygiene education, seasonal fever awareness, and vector-borne illness prevention.",
    problem: "Preventable waterborne and vector-borne conditions continue to impact rural families, often because early warning signs are missed or basic preventive sanitation measures are not understood.",
    coverage: "Targeted rural communities and local schools",
    focus: "Community Hygiene & Preventative Health Education",
    services: [
      "Menstrual Hygiene Awareness for Adolescents",
      "Handwashing & Sanitation Demonstrations",
      "Malaria & Dengue Prevention Drives",
      "Tobacco & Substance Abuse Sensitization",
      "School Health & Nutrition Camps",
      "Community Volunteer Sensitization"
    ],
    color: "#1b6b68", bg: "#edfafa",
    image: "/images/education/child-health-handwashing.jpg",
    placeholderLabel: "Health & Hygiene Community Session",
  },
  "clean-water-sanitation": {
    icon: Droplets, tag: "WASH Initiatives",
    title: "Clean Water & Sanitation",
    summary: "Facilitating access to safe drinking water, household sanitation, and hygiene infrastructure.",
    description: "In collaboration with village committees, we support awareness on water purification, hygiene infrastructure, and maintenance of clean communal water points.",
    problem: "Contaminated surface water and groundwater issues in flood-prone zones create high seasonal incidences of gastrointestinal illnesses and related child malnutrition.",
    coverage: "Selected rural settlements and flood-prone blocks",
    focus: "Potable Water Safety & Household Sanitation",
    services: [
      "Water Contamination Awareness",
      "Household Filtration Demonstrations",
      "Community Sanitation Advocacy",
      "Flood Resilience Hygiene Guidance",
      "School WASH Facilities Review",
      "Village Water Committee Training"
    ],
    color: "#279490", bg: "#edfafa",
    image: "/images/education/global-handwashing-day.jpg",
    placeholderLabel: "Clean Water & Sanitation Demonstration",
  },
  "disability-inclusion": {
    icon: HandHeart, tag: "Community Inclusion",
    title: "Disability Support & Inclusion",
    summary: "Rehabilitation support, assistive devices, and social inclusion programming for persons with disabilities.",
    description: "Our disability support initiative connects persons with physical challenges to medical screening boards, helps facilitate mobility aids, and assists with enrollment in state welfare pensions.",
    problem: "Persons with physical disabilities in rural communities frequently face multiple barriers — lack of assistive equipment, social exclusion, and difficulty accessing government disability certifications.",
    coverage: "Rural blocks with limited rehabilitation access",
    focus: "Mobility Aid Linkage & Government Scheme Facilitation",
    services: [
      "Community Needs Identification",
      "Assistive Device Facilitation",
      "Disability Certificate Application Support",
      "State Pension & Scheme Linkage",
      "Inclusive Education Counseling",
      "Caregiver Support"
    ],
    color: "#134a48", bg: "#edfafa",
    image: "/images/healthcare/body-pain-causes-cures.jpg",
    placeholderLabel: "Disability Aid & Welfare Camp",
  },
}

export default function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>()
  const program = slug ? PROGRAMS[slug] : undefined

  if (!program) return <Navigate to="/programs" replace />

  const {
    icon: Icon, tag, title, summary, description,
    problem, coverage, focus, services, color, placeholderLabel, image
  } = program

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

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-teal-200 border border-white/15">
              <Icon size={20} />
            </div>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider"
              style={{ background: "rgba(255,255,255,0.12)", color: "#9de4e3" }}
            >
              {tag}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            {title}
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

              {/* How We Work */}
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-2xl font-bold mb-3 text-slate-900">
                  Operational Approach & Delivery
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                  {description}
                </p>
              </motion.div>

              {/* Services List */}
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="font-display text-2xl font-bold mb-4 text-slate-900">
                  Key Interventions & Deliverables
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map(s => (
                    <div
                      key={s}
                      className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm font-medium text-slate-800"
                    >
                      <CheckCircle2 size={16} style={{ color }} className="shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Scope Box */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm" style={{ borderTop: `4px solid ${color}` }}>
                <h3 className="font-display font-bold text-base mb-4 text-slate-900">Program Scope</h3>
                <div className="space-y-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
                      Geographic Region
                    </span>
                    <p className="flex items-start gap-2 text-slate-800 font-medium">
                      <MapPin size={16} className="text-teal-600 mt-0.5 shrink-0" />
                      <span>{coverage}</span>
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
                      Operational Focus
                    </span>
                    <p className="flex items-start gap-2 text-slate-800 font-medium">
                      <Stethoscope size={16} className="text-teal-600 mt-0.5 shrink-0" />
                      <span>{focus}</span>
                    </p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1 text-[11px]">
                      Stewardship
                    </span>
                    <p className="flex items-center gap-2 text-teal-700 font-semibold">
                      <ShieldCheck size={16} /> Section 8 Registered Non-Profit
                    </p>
                  </div>
                </div>
              </div>

              {/* Donate Box */}
              <div
                className="rounded-2xl p-6 text-white shadow-md"
                style={{ background: "linear-gradient(145deg, #0d2e2c 0%, #1b6b68 100%)" }}
              >
                <h3 className="font-display font-bold text-lg mb-2">Fund this Program</h3>
                <p className="text-xs sm:text-sm mb-5 text-teal-100 leading-relaxed">
                  Directly support medical supplies, field doctor visits, and outreach equipment for this initiative.
                </p>
                <Link to="/donate" className="btn btn-accent w-full justify-center text-sm shadow-md">
                  <Heart size={16} fill="currentColor" /> Donate to this Cause
                </Link>
              </div>

              {/* Related Links */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  More Options
                </h3>
                <div className="space-y-2">
                  <Link to="/impact" className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-teal-700 py-1.5 border-b border-slate-100">
                    <span>Our Impact Overview</span>
                    <ChevronRight size={14} />
                  </Link>
                  <Link to="/get-involved/volunteer" className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-teal-700 py-1.5 border-b border-slate-100">
                    <span>Volunteer for Health Camps</span>
                    <ChevronRight size={14} />
                  </Link>
                  <Link to="/get-involved/partner" className="flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-teal-700 py-1.5">
                    <span>CSR Partnership Opportunities</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other Programs ── */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="container-custom">
          <h2 className="font-display text-2xl font-bold mb-6 text-slate-900">Explore Other Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(PROGRAMS)
              .filter(([s]) => s !== slug)
              .slice(0, 3)
              .map(([s, p]) => {
                const OtherIcon = p.icon
                return (
                  <Link
                    key={s}
                    to={`/programs/${s}`}
                    className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-teal-50 text-teal-700">
                        <OtherIcon size={20} />
                      </div>
                      <h3 className="font-display font-bold text-base text-slate-900 mb-1">{p.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">{p.summary}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-700">
                      View details <ChevronRight size={14} />
                    </span>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>
    </>
  )
}
