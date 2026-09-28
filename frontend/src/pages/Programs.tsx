import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Heart, MapPin, ArrowRight, Activity,
  Baby, GraduationCap, Megaphone, Droplets, HandHeart,
  Stethoscope, CheckCircle2
} from "lucide-react"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"

/* ── Program data (Honest and qualitative) ── */
const PROGRAMS = [
  {
    slug: "mobile-health-units",
    icon: Activity,
    tag: "Primary Healthcare",
    title: "Mobile Health Units",
    summary: "Bringing routine medical consultations, basic point-of-care diagnostics, and free essential medicines directly to rural hamlets lacking health centers.",
    description: "Our mobile health units operate on regular monthly schedules across designated village blocks. Staffed with visiting doctors, nurses, and community health volunteers, services include general outpatient consultations, blood pressure & diabetes screening, maternal health checkups, and tertiary hospital referral linkages.",
    coverage: "High-need rural blocks in Khurda, Nayagarh & adjacent districts",
    focus: "Doorstep Doctor Consultations & Diagnostic Screenings",
    services: [
      "Outpatient Doctor Consultations",
      "Blood Pressure & Blood Sugar Screenings",
      "Essential Medicine Dispensation",
      "Maternal & Child Health Check-ups",
      "Specialist Hospital Referral Linkage",
      "Preventive Health Education"
    ],
    color: "#1b6b68",
    bg: "#edfafa",
    image: "/images/events/free-skin-health-camp-balashram.jpg",
    placeholderLabel: "Free Medical Camp & Check-up",
  },
  {
    slug: "maternal-child-health",
    icon: Baby,
    tag: "Maternal Wellness",
    title: "Maternal & Child Health",
    summary: "Supporting expectant mothers and newborns through regular prenatal check-ups, institutional delivery counseling, and childhood nutrition awareness.",
    description: "Working collaboratively with grassroots ASHA and Anganwadi workers, our team conducts village antenatal awareness sessions, iron & folate tracking, safe delivery planning, and home visits for new mothers to promote exclusive breastfeeding and immunization adherence.",
    coverage: "Tribal and underserved rural areas of Odisha",
    focus: "Antenatal Support & Safe Institutional Delivery Counseling",
    services: [
      "Antenatal Screening Coordination",
      "Nutrition & Anemia Education",
      "Institutional Delivery Facilitation",
      "Postnatal Newborn Care Guidance",
      "Infant Immunization Tracking",
      "Caregiver Health Counseling"
    ],
    color: "#c94a2e",
    bg: "#fde8e0",
    image: "/images/healthcare/womens-health-hygiene-centurion-auditorium.jpg",
    placeholderLabel: "Women's Health & Hygiene Education",
  },
  {
    slug: "skill-development",
    icon: GraduationCap,
    tag: "Livelihood & Skills",
    title: "Skill Development & Livelihood",
    summary: "Empowering rural youth and women self-help groups with vocational training, tailoring, and market-linked digital skills to build sustainable incomes.",
    description: "Vocational workshops and short-term certificate modules designed to cultivate self-employment and micro-entrepreneurship. Focus areas include sewing, craft production, computer literacy, and basic business record-keeping.",
    coverage: "Rural clusters and peri-urban hubs in Odisha",
    focus: "Vocational Training & Micro-Entrepreneurship Modules",
    services: [
      "Tailoring & Garment Making Courses",
      "Basic Computer & Digital Skills",
      "Women Self-Help Group (SHG) Support",
      "Financial Literacy & Banking Guidance",
      "Market Linkage & Exhibition Assistance",
      "Youth Career Counseling"
    ],
    color: "#d97706",
    bg: "#fffbeb",
    image: "/images/healthcare/saukhyam-pads-campus-outreach.jpg",
    placeholderLabel: "Sustainable Hygiene & Skill Enterprise",
  },
  {
    slug: "health-awareness",
    icon: Megaphone,
    tag: "Preventive Awareness",
    title: "Health & Hygiene Awareness Campaigns",
    summary: "Community-level behavior change campaigns on sanitation, menstrual hygiene, seasonal fever prevention, and healthy lifestyle choices.",
    description: "Through village meetings, street awareness sessions, and peer-to-peer dialogues, we address knowledge gaps in personal hygiene, adolescent health, and vector-borne disease prevention like dengue and malaria.",
    coverage: "Targeted rural communities and local schools",
    focus: "Village-level Sanitation & Preventative Education",
    services: [
      "Menstrual Hygiene Awareness for Adolescents",
      "Sanitation & Handwashing Demonstrations",
      "Malaria & Dengue Prevention Drives",
      "Tobacco & Substance Abuse Sensitization",
      "School Health & Nutrition Camps",
      "Community Health Volunteer Training"
    ],
    color: "#1b6b68",
    bg: "#edfafa",
    image: "/images/education/child-health-handwashing.jpg",
    placeholderLabel: "Community Health & Hygiene Awareness Camp",
  },
  {
    slug: "clean-water-sanitation",
    icon: Droplets,
    tag: "WASH Initiatives",
    title: "Clean Water & Sanitation",
    summary: "Promoting access to potable drinking water and clean sanitation practices in vulnerable rural hamlets.",
    description: "Collaborating with local community leadership to evaluate water contamination risks, demonstrate household filtration methods, and assist in maintaining clean water points and school sanitation blocks.",
    coverage: "Selected rural settlements and flood-prone blocks",
    focus: "Safe Drinking Water Access & Sanitation Maintenance",
    services: [
      "Potable Water Testing & Risk Identification",
      "Household Filtration Guidance",
      "Sanitation Facility Promotion",
      "Flood Resilience Hygiene Education",
      "School WASH Infrastructure Support",
      "Village Water Committee Guidance"
    ],
    color: "#279490",
    bg: "#edfafa",
    image: "/images/education/global-handwashing-day.jpg",
    placeholderLabel: "WASH & Hygiene Education Campaign",
  },
  {
    slug: "disability-inclusion",
    icon: HandHeart,
    tag: "Community Inclusion",
    title: "Disability Support & Inclusion",
    summary: "Assisting persons with disabilities with rehabilitation guidance, mobility device facilitation, and government scheme linkages.",
    description: "Identifying persons with physical disabilities in rural areas, coordinating with medical boards for disability certificates, and connecting beneficiaries to government welfare programs and assistive aids.",
    coverage: "Rural blocks with limited rehabilitation access",
    focus: "Assistive Aid Linkage & Welfare Rights Facilitation",
    services: [
      "Community Identification & Functional Needs Review",
      "Assistive Device Facilitation (Crutches, Wheelchairs)",
      "Disability Certificate Application Assistance",
      "Government Welfare Pension Linkage",
      "Inclusive Education Counseling",
      "Caregiver Support & Sensitization"
    ],
    color: "#134a48",
    bg: "#edfafa",
    image: "/images/healthcare/body-pain-causes-cures.jpg",
    placeholderLabel: "Physical Care & Mobility Guidance",
  },
]

export default function Programs() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden"
        style={{
          background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 50%, #1b6b68 90%)",
        }}
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
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <span
              className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-4 px-3.5 py-1.5 rounded-full border"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.18)",
                color: "#9de4e3",
                backdropFilter: "blur(8px)",
              }}
            >
              <Heart size={14} className="text-amber-300" fill="currentColor" />
              <span>Ground-Level Health & Social Interventions · Odisha</span>
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
              Our <span className="text-gradient">Programs</span>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-2xl mb-6 font-normal" style={{ color: "rgba(255,255,255,0.85)" }}>
              Each program addresses documented gaps in primary healthcare, maternal health, and livelihood resilience — shaped by active dialogue with local communities.
            </p>

            {/* Quick anchors */}
            <div className="flex flex-wrap gap-2 pt-2">
              {PROGRAMS.map(p => (
                <a
                  key={p.slug}
                  href={`#${p.slug}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {p.title}
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Programs List ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom space-y-16">
          {PROGRAMS.map(({ slug, icon: Icon, tag, title, summary, description, coverage, focus, services, color, bg, image, placeholderLabel }) => (
            <motion.div
              key={slug}
              id={slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5 }}
              className="scroll-mt-24 p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Text & Services */}
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ background: bg, color }}
                    >
                      {tag}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-slate-900">
                    {title}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed mb-4 text-slate-700">
                    {summary}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed mb-6 text-slate-500">
                    {description}
                  </p>

                  {/* Coverage & Focus info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Coverage:</span>
                        <div className="text-slate-600">{coverage}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Stethoscope size={16} className="text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Operational Focus:</span>
                        <div className="text-slate-600">{focus}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Link to={`/programs/${slug}`} className="btn btn-secondary text-xs sm:text-sm">
                      Detailed Program Scope <ArrowRight size={16} />
                    </Link>
                    <Link to="/donate" className="btn btn-accent text-xs sm:text-sm">
                      <Heart size={14} fill="currentColor" /> Support this Program
                    </Link>
                  </div>
                </div>

                {/* Right: Visual Area with Image Placeholder & Key Services */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                    <ImagePlaceholder
                      src={image}
                      label={placeholderLabel}
                      aspect="16/10"
                      className="w-full"
                      objectFit="cover"
                    />
                  </div>

                  <div className="p-5 rounded-2xl border" style={{ background: bg, borderColor: `${color}25` }}>
                    <h3 className="font-display font-bold text-xs uppercase tracking-wider mb-3 text-slate-900">
                      Core Field Services
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                      {services.map(s => (
                        <li key={s} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 size={14} style={{ color }} className="shrink-0" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-slate-900 mb-3">
            Want to Collaborate on a Program?
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            We welcome collaboration with medical institutions, CSR partners, and local organizations to widen grassroots coverage.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-involved/partner" className="btn btn-primary">
              Partner with Us <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contact Program Team
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
