import { useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Heart,
  Users,
  ArrowRight,
  CheckCircle2,
  Baby,
  MapPin,
  Stethoscope,
  ShieldCheck,
  Eye,
  Calendar,
  ChevronDown,
  Mail,
  Loader2,
  Check,
  Quote,
} from "lucide-react"
import { Button, Container, SectionHeading } from "../components"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"
import { subscribeNewsletter } from "../api/forms"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
}

const PROBLEMS = [
  {
    num: "01",
    icon: Stethoscope,
    title: "Limited Healthcare Access",
    desc: "Over 70% of rural families must travel over 25 km to the nearest primary health center, causing treatable illnesses to escalate into life-threatening emergencies.",
    link: "/about",
  },
  {
    num: "02",
    icon: MapPin,
    title: "Rural & Tribal Communities",
    desc: "Remote settlements in Kalahandi, Mayurbhanj, and Koraput face seasonal monsoon cut-offs and severe shortages of resident medical practitioners.",
    link: "/about",
  },
  {
    num: "03",
    icon: Users,
    title: "Urban Underserved Settlements",
    desc: "Informal settlements in urban centers suffer from poor sanitation, high infectious disease burdens, and prohibitive private healthcare costs.",
    link: "/about",
  },
  {
    num: "04",
    icon: Baby,
    title: "Maternal & Child Vulnerability",
    desc: "Maternal anemia, infant undernutrition, and limited menstrual hygiene awareness create compounding health crises across generations.",
    link: "/about",
  },
]

const CORE_PROGRAMS = [
  {
    title: "MOBILE HEALTHCARE",
    desc: "Bringing physician consultations, essential medicines, and basic diagnostics directly to remote villages lacking permanent facilities.",
    image: "/images/about/project-care-health-hygiene-team.jpg",
    alt: "SCNSWF Mobile healthcare unit team in Odisha",
    to: "/programs/mobile-health-units",
  },
  {
    title: "HEALTH CAMPS",
    desc: "Periodic multi-specialty screening camps offering free physician consultations, skin and chronic care checks, and medicine distribution.",
    image: "/images/events/free-skin-health-camp-balashram.jpg",
    alt: "Free specialist health camp in Balashram Odisha",
    to: "/programs",
  },
  {
    title: "MATERNAL & CHILD HEALTHCARE",
    desc: "Prenatal monitoring, safe institutional delivery counseling, and hygienic wellness support for mothers and newborns.",
    image: "/images/hero/together-rising-womens-health.jpg",
    alt: "Maternal health and hygiene initiative in Odisha",
    to: "/programs/maternal-child-health",
  },
  {
    title: "URBAN SLUM CLINICS",
    desc: "Doorstep community health checkups, chronic disease screenings, and palliative home care for seniors in informal settlements.",
    image: "/images/about/geriatric-care-parents.jpg",
    alt: "Healthcare support in urban informal settlements",
    to: "/programs",
  },
]

const UPCOMING_CAMPS = [
  {
    title: "Multi-Specialty & Pediatric Screening Camp",
    date: "November 28, 2026",
    location: "Ramakrusna Balashram, Cuttack",
    badge: "Upcoming Camp",
    services: ["Pediatric Wellness", "Skin & Dermatology", "Free Medicine Dispensation"],
  },
  {
    title: "Maternal Nutrition & Prenatal Health Clinic",
    date: "December 05, 2026",
    location: "Rayagada Rural Block, Odisha",
    badge: "Maternal Health",
    services: ["Prenatal Checkups", "Iron Supplementation", "Hygiene Kits"],
  },
  {
    title: "Geriatric & Chronic Disease Screening",
    date: "December 14, 2026",
    location: "Jatni & Khurda District, Odisha",
    badge: "Chronic Care",
    services: ["Hypertension Checks", "Diabetes Screening", "Senior Mobility Support"],
  },
]

const BENEFICIARY_STORIES = [
  {
    quote:
      "The mobile medical team arrived during the monsoon when our village was cut off. The doctor diagnosed my child’s severe respiratory infection and provided medicines that saved her life.",
    author: "Mamata Nayak",
    role: "Mother & Beneficiary",
    location: "Nayagarh District",
    tag: "Mobile Health Unit",
  },
  {
    quote:
      "At age 68, traveling 30 kilometers for regular blood pressure checks was impossible. SCNSWF’s village camp now checks my health every month at no cost.",
    author: "Ramesh Majhi",
    role: "Senior Resident",
    location: "Koraput Block",
    tag: "Geriatric Care",
  },
  {
    quote:
      "SCNSWF’s hygiene awareness sessions and sustainable pad distribution in our college opened doors for young women to learn about reproductive health without stigma.",
    author: "Sunita Sahoo",
    role: "Student & Volunteer",
    location: "Bhubaneswar",
    tag: "Hygiene Outreach",
  },
]

const FAQS = [
  {
    q: "Are donations to SCNSWF tax-exempt in India?",
    a: "Yes. Suresh Chandra Nayak Social Welfare Foundation is registered under Section 80G and 12A of the Income Tax Act. Donors receive an official tax exemption certificate for a 50% deduction on qualifying contributions.",
  },
  {
    q: "How are donor contributions allocated to ground operations?",
    a: "Over 88% of all funds directly support field operations—including mobile medical vans, physician consultations, essential medicines, and maternal care kits. Financial records are audited annually and published in our annual transparency reports.",
  },
  {
    q: "Can non-medical professionals volunteer with SCNSWF?",
    a: "Absolutely! We actively welcome volunteers from all backgrounds for logistics coordination, patient registration, health awareness camps, photography, digital storytelling, and student campus outreach.",
  },
  {
    q: "Which districts in Odisha does SCNSWF currently prioritize?",
    a: "Our core programs operate across Khurda, Cuttack, Nayagarh, Rayagada, Koraput, Kandhamal, and Ganjam, with special emphasis on remote tribal hamlets and underserved urban informal clusters.",
  },
]

export default function Home() {
  // Newsletter Form State
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const [newsletterError, setNewsletterError] = useState("")

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState<number | null>(0)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterError("")
    if (!newsletterEmail.trim()) return

    setNewsletterLoading(true)
    try {
      await subscribeNewsletter(newsletterEmail.trim().toLowerCase())
      setNewsletterSuccess(true)
      setNewsletterEmail("")
    } catch (err: any) {
      setNewsletterError(err?.response?.data?.message || "Failed to subscribe. Please try again.")
    } finally {
      setNewsletterLoading(false)
    }
  }

  return (
    <>
      {/* ── Hero Section ── */}
      <section
        className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden bg-[#051b14] text-white"
        aria-label="SCNSWF Healthcare & Social Welfare Hero"
      >
        {/* Layered authentic background visual with high-contrast gradient overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage: `url('/images/hero/together-rising-womens-health.jpg')`,
          }}
          aria-hidden="true"
        />

        {/* Directional Overlay to ensure 100% WCAG contrast across all devices */}
        <div
          className="absolute inset-0 z-0 bg-gradient-to-r from-[#051b14] via-[#051b14]/95 to-[#082e23]/80"
          aria-hidden="true"
        />

        {/* Subtle organic ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full opacity-25 blur-[120px]"
            style={{ background: "#22b791" }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full opacity-20 blur-[100px]"
            style={{ background: "#db6424" }}
          />
        </div>

        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Text Hierarchy & CTAs */}
            <div className="lg:col-span-7 text-left flex flex-col items-start">
              {/* Badge */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="mb-4"
              >
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-emerald-300 border border-emerald-400/25 backdrop-blur-md text-xs sm:text-sm font-semibold tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>SCNSWF · Suresh Chandra Nayak Social Welfare Foundation</span>
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="font-heading text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.12] mb-5 tracking-tight max-w-2xl"
              >
                Healthcare That Reaches <span className="text-emerald-400">Everyone</span>
              </motion.h1>

              {/* Subheading / Mission Narrative */}
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-xl font-sans"
              >
                Bringing accessible medical consultations, essential medicines, diagnostic health camps, and maternal care directly to underserved communities across Odisha.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-6 w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  size="lg"
                  to="/donate"
                  leftIcon={<Heart className="w-4 h-4 fill-white" />}
                >
                  Donate to Healthcare Fund
                </Button>
                <Button
                  variant="outline-white"
                  size="lg"
                  to="/programs"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Our Work
                </Button>
              </motion.div>

              {/* Involvement Touchpoints */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-300 pt-3 border-t border-white/15 w-full"
              >
                <span className="text-slate-400">Want to get involved?</span>
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/get-involved/volunteer"
                    className="text-emerald-300 hover:text-white font-semibold underline underline-offset-4 transition-colors"
                  >
                    Volunteer with us
                  </Link>
                  <span className="text-slate-500">•</span>
                  <Link
                    to="/get-involved/partner"
                    className="text-emerald-300 hover:text-white font-semibold underline underline-offset-4 transition-colors"
                  >
                    Corporate / CSR Partner
                  </Link>
                </div>
              </motion.div>

              {/* Trust Markers */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={5}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 pt-4 border-t border-white/15 text-xs text-slate-300 font-medium"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Section 8 Non-Profit (Govt. of India)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Tax Deductible (80G &amp; 12A)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct Field Operations in Odisha</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Visual Photo Card with Location & Floating Highlights */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-3xl p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-inner">
                  <img
                    src="/images/about/project-care-health-hygiene-team.jpg"
                    alt="SCNSWF Project Care health and hygiene medical team in Odisha"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />

                  {/* Gradient Overlay for Caption */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#051b14]/95 via-[#051b14]/40 to-transparent pointer-events-none" />

                  {/* Top Location Chip */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#051b14]/85 text-emerald-300 backdrop-blur-sm border border-white/15 shadow-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Odisha Field Camp · Project Care</span>
                    </span>
                  </div>

                  {/* Caption on image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 text-white">
                    <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                      On-Ground Medical &amp; Hygiene Outreach
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                      Doctors and health workers conducting clinics and distributing essential medicines in rural Odisha.
                    </p>
                  </div>
                </div>

                {/* Floating highlight card 1: Free doctor consultations */}
                <div className="absolute -bottom-4 -left-4 p-3 rounded-xl shadow-xl border border-slate-200 bg-white text-slate-900 hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-800 shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">Doctor Consultations</div>
                    <div className="text-[11px] text-slate-500">Free clinical primary care</div>
                  </div>
                </div>

                {/* Floating highlight card 2: Direct Village Delivery */}
                <div className="absolute -top-3.5 -right-3.5 p-3 rounded-xl shadow-xl border border-slate-200 bg-white text-slate-900 hidden sm:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-amber-700 shrink-0">
                    <Heart className="w-4 h-4 fill-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">Odisha Communities</div>
                    <div className="text-[11px] text-slate-500">Boots on the ground</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Under Hero: Compact Impact Strip with Data Verification Path ── */}
      <section className="relative z-20 -mt-8 sm:-mt-10 mb-10 sm:mb-14" aria-label="SCNSWF Impact Metrics">
        <Container size="xl">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#e3eae4] shadow-[0_8px_30px_rgba(5,27,20,0.08)] p-6 sm:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-6 border-b border-slate-100">
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#105e49] tracking-tight">
                  10K+
                </span>
                <span className="font-heading font-bold text-slate-900 text-sm sm:text-base mt-1">
                  Lives Reached
                </span>
                <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Doctor consultations &amp; preventive health screenings
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#105e49] tracking-tight">
                  100+
                </span>
                <span className="font-heading font-bold text-slate-900 text-sm sm:text-base mt-1">
                  Villages
                </span>
                <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Rural &amp; tribal habitations served across Odisha
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#105e49] tracking-tight">
                  50+
                </span>
                <span className="font-heading font-bold text-slate-900 text-sm sm:text-base mt-1">
                  Health Camps
                </span>
                <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Mobile diagnostic camps &amp; medicine dispensations
                </span>
              </div>

              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[#105e49] tracking-tight">
                  500+
                </span>
                <span className="font-heading font-bold text-slate-900 text-sm sm:text-base mt-1">
                  Mothers Supported
                </span>
                <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  Maternal care, wellness kits &amp; nutrition advice
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#105e49] shrink-0" />
                <span>
                  <strong>Ground-Audited Impact:</strong> Figures recorded through field register logs and clinic camps.
                </span>
              </div>

              <Link
                to="/impact"
                className="inline-flex items-center gap-1.5 font-semibold text-[#105e49] hover:text-[#082e23] hover:underline transition-colors shrink-0"
              >
                <span>View Program Impact Reports &amp; Field Data</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Section: The Problem We Solve ── */}
      <section className="py-16 md:py-24 bg-[#f8faf7] border-t border-[#e3eae4]" aria-label="The Problem We Solve">
        <Container size="xl">
          <SectionHeading
            align="center"
            badge="Why SCNSWF Exists"
            badgeVariant="medical"
            title="The Problem We Solve"
            description="Systemic geographic isolation, economic distress, and strained public infrastructure leave vulnerable populations without timely medical care. Here is where we step in."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.num}
                  className="group rounded-2xl border border-[#e3eae4] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#cbd8cf] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-[#f0fbf7] text-[#105e49] border border-[#d1f4eb]">
                        {item.num}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#f4f6f3] text-[#105e49] flex items-center justify-center group-hover:bg-[#f0fbf7] transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#105e49] transition-colors mb-2.5">
                      {item.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6 font-sans">
                      {item.desc}
                    </p>
                  </div>

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#105e49] hover:text-[#082e23] transition-colors mt-auto"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Section: Core Healthcare Programs ── */}
      <section className="py-16 md:py-24 bg-white border-t border-[#e3eae4]" aria-label="Our Work and Core Programs">
        <Container size="xl">
          <SectionHeading
            align="left"
            badge="Our Work"
            badgeVariant="medical"
            title="Core Healthcare Programs"
            description="Direct medical interventions delivering doctors, diagnostics, and maternal wellness to communities that need it most."
            action={
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#105e49] hover:text-[#082e23] transition-colors"
              >
                <span>Explore all programs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_PROGRAMS.map((prog) => (
              <Link
                key={prog.title}
                to={prog.to}
                className="group rounded-2xl overflow-hidden border border-[#e3eae4] bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#cbd8cf] flex flex-col no-underline text-inherit cursor-pointer"
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={prog.image}
                    alt={prog.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm tracking-wider text-slate-900 uppercase group-hover:text-[#105e49] transition-colors mb-2">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 font-sans">
                      {prog.desc}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#105e49] group-hover:text-[#082e23] transition-colors">
                    <span>Explore program</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Section: Founder's Mission Spotlight ── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#082e23] to-[#051b14] text-white overflow-hidden">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 border border-emerald-400/30 text-xs font-semibold mb-4">
                <Quote className="w-3.5 h-3.5" />
                <span>Founder's Grassroots Commitment</span>
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                "Real change begins where the paved road ends."
              </h2>
              <blockquote className="text-base sm:text-lg text-emerald-100/90 leading-relaxed mb-6 font-sans italic border-l-2 border-emerald-400 pl-4">
                "Our foundation was built on one steadfast principle: healthcare is a fundamental human right, not a geographical privilege. When a mother or elder in rural Odisha cannot reach a hospital, our duty is to bring the hospital directly to them."
              </blockquote>
              <div className="flex items-center gap-4 pt-2">
                <div>
                  <h4 className="font-heading font-bold text-lg text-white">Suresh Chandra Nayak</h4>
                  <p className="text-xs text-emerald-300">Founder &amp; Managing Trustee, SCNSWF</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-3xl p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl max-w-sm w-full">
                <img
                  src="/images/about/geriatric-care-parents.jpg"
                  alt="SCNSWF Founder and medical team with rural community members in Odisha"
                  className="rounded-2xl w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                <div className="p-4 text-center">
                  <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Ground Operations</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Grassroots Field Service in Odisha</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Section: Upcoming Health Camps Calendar ── */}
      <section className="py-16 md:py-24 bg-white border-t border-[#e3eae4]">
        <Container size="xl">
          <SectionHeading
            align="center"
            badge="Field Calendar"
            badgeVariant="medical"
            title="Upcoming Community Health Camps"
            description="Our scheduled diagnostic clinics and village medical camps. Local communities and volunteers are invited to participate."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {UPCOMING_CAMPS.map((camp, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-[#fbfdfc] p-6 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {camp.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{camp.date}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 mb-2">
                    {camp.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{camp.location}</span>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    {camp.services.map((svc, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{svc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to="/get-involved/volunteer"
                  className="w-full py-2.5 px-4 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold text-center transition-colors"
                >
                  Volunteer for this Camp
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#105e49] hover:underline"
            >
              <span>Request a health camp in your village / district</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Section: Field Documentation Gallery Showcase ── */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/60">
        <Container size="xl">
          <SectionHeading
            align="center"
            badge="Field Documentation"
            badgeVariant="medical"
            title="Ground-Level Care in Action"
            description="Photographs and documentation from rural clinics, village health camps, and campus hygiene awareness drives in Odisha."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs flex flex-col">
              <ImagePlaceholder
                src="/images/events/free-skin-health-camp-balashram.jpg"
                alt="Free Skin Healthcare camp at Ramakrusna Balashram"
                label="Free Healthcare Camp"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-emerald-800 mb-1">Health Camp Outreach</div>
                  <div className="text-sm font-bold text-slate-900">Free Skin Healthcare Camp</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Free clinical consultations and medicine distribution at Ramakrusna Balashram with IADVL &amp; HOMSO.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs flex flex-col">
              <ImagePlaceholder
                src="/images/healthcare/womens-health-hygiene-centurion-auditorium.jpg"
                alt="Women's Health, Hygiene and Sustainable Living seminar"
                label="Women's Health &amp; Hygiene"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-rose-700 mb-1">Women's Health</div>
                  <div className="text-sm font-bold text-slate-900">Hygiene &amp; Sustainable Living</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Auditorium session on menstrual health, eco-friendly sanitary alternatives, and nutritional counseling.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs flex flex-col">
              <ImagePlaceholder
                src="/images/education/child-health-handwashing.jpg"
                alt="Child Health &amp; Hand Hygiene Education"
                label="Child Health Education"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-amber-700 mb-1">Child Hygiene</div>
                  <div className="text-sm font-bold text-slate-900">Handwashing &amp; Health Habits</div>
                  <p className="text-xs text-slate-500 mt-1">
                    School and village sessions promoting daily soap handwashing to prevent waterborne infections.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs flex flex-col">
              <ImagePlaceholder
                src="/images/healthcare/saukhyam-pads-campus-outreach.jpg"
                alt="Saukhyam reusable pads initiative in Odisha universities"
                label="Sustainable Hygiene Outreach"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-teal-800 mb-1">Eco-Friendly Health</div>
                  <div className="text-sm font-bold text-slate-900">Saukhyam Campus Outreach</div>
                  <p className="text-xs text-slate-500 mt-1">
                    Reusable pad awareness across KIIT, AIIMS Bhubaneswar, Centurion, and Gita College.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 text-sm font-bold shadow-xs transition-all"
            >
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>Explore Complete Field Gallery</span>
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Section: Beneficiary Testimonials / Real Voices ── */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200">
        <Container size="xl">
          <SectionHeading
            align="center"
            badge="Voices from the Ground"
            badgeVariant="medical"
            title="Real Stories of Impact"
            description="Listen to the rural mothers, elders, and youth who receive healthcare and counseling through our programs."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFICIARY_STORIES.map((story, i) => (
              <div
                key={i}
                className="p-6 sm:p-7 rounded-2xl border border-slate-200 bg-[#fcfefd] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {story.tag}
                    </span>
                    <Quote className="w-5 h-5 text-emerald-300" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-sans italic mb-6">
                    "{story.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{story.author}</h4>
                    <p className="text-xs text-slate-500">{story.role}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">{story.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#105e49] hover:underline"
            >
              <span>Read all verified impact case stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Section: Transparency, 80G Tax Exemption & Governance ── */}
      <section className="py-14 md:py-20 bg-slate-50 border-t border-slate-200">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full text-emerald-800 bg-emerald-100/80 inline-block">
                Donor Assurance
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900">
                Ethical Reporting &amp; Verifiable Milestones
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-sans">
                Donor trust is earned through verifiable ground impact rather than inflated numbers. Every mobile clinic route, health camp, and skill batch is tracked with structured field registers.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">100% Tax Deductible (80G &amp; 12A Certified)</div>
                    <div className="text-xs text-slate-500">Donations receive instant 80G tax deduction receipts.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Annual Audited Financial Statements</div>
                    <div className="text-xs text-slate-500">Publicly available statements detailing resource allocations.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Community Health Worker Verification</div>
                    <div className="text-xs text-slate-500">Each village camp coordinates with local accredited health workers.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/impact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 text-sm font-bold shadow-xs transition-colors">
                  <span>View Detailed Impact Overview</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="font-heading font-bold text-xl text-slate-900 mb-2">
                  Odisha Priority Operational Districts
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Targeted rural and tribal districts where medical infrastructure access is most constrained:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Khurda", "Nayagarh", "Rayagada",
                    "Koraput", "Kandhamal", "Ganjam",
                    "Cuttack", "Puri", "Jajpur"
                  ].map((district) => (
                    <div
                      key={district}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{district}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Next Mobile Clinic Deployment:</span>
                    <p className="text-emerald-800 text-[11px] mt-0.5">District dispatch register active</p>
                  </div>
                  <Link to="/contact" className="text-xs font-bold text-emerald-900 underline hover:text-emerald-950 shrink-0">
                    Inquire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Section: Interactive FAQ Accordion ── */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200">
        <Container size="md">
          <SectionHeading
            align="center"
            badge="Common Questions"
            badgeVariant="medical"
            title="Frequently Asked Questions"
            description="Transparent answers regarding our donations, operations, volunteering, and tax certifications."
          />

          <div className="space-y-3.5">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-slate-900">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-700" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-100 bg-[#fafcfb]">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── Section: Community Newsletter Subscription ── */}
      <section className="py-14 md:py-18 bg-[#f0fbf7] border-t border-[#d1f4eb]">
        <Container size="md">
          <div className="text-center max-w-xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>Stay Informed</span>
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#082e23] mb-3">
              Subscribe to Field Updates
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
              Receive monthly impact reports, village health camp calendars, and stories of lives transformed across Odisha.
            </p>

            {newsletterSuccess ? (
              <div className="p-4 rounded-2xl bg-white border border-emerald-300 text-emerald-800 text-sm flex items-center justify-center gap-2 shadow-xs">
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold">Thank you for subscribing to SCNSWF community updates!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
                <label htmlFor="newsletter-email-input" className="sr-only">
                  Email Address
                </label>
                <input
                  id="newsletter-email-input"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-white text-slate-900 rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm min-h-[48px]"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="py-3 px-6 rounded-xl bg-[#082e23] hover:bg-[#105e49] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  {newsletterLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Subscribe</span>}
                </button>
              </form>
            )}

            {newsletterError && (
              <p className="text-xs text-red-600 mt-2 font-medium">{newsletterError}</p>
            )}
          </div>
        </Container>
      </section>

      {/* ── Call to Action / Get Involved ── */}
      <section
        className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-[#051b14] via-[#082e23] to-[#0d3b2f] text-white"
      >
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full text-emerald-300 bg-white/10 inline-block mb-4 backdrop-blur-xs">
            Join the Movement
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Help Expand Grassroots Healthcare to Communities in Need
          </h2>
          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Your support enables mobile medical teams, essential medicines, and maternal care outreach. Every contribution directly powers field delivery in Odisha.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/donate"
              className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-xl flex items-center justify-center gap-2 w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Heart className="w-4 h-4 fill-slate-950" />
              <span>Donate to Healthcare Fund</span>
            </Link>
            <Link
              to="/get-involved/volunteer"
              className="px-8 py-3.5 rounded-full border border-white/50 bg-white/10 hover:bg-white/20 text-white font-bold text-base flex items-center justify-center gap-2 w-full sm:w-auto transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Volunteer with Us</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
