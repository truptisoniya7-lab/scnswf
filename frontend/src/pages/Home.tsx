import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Heart, Users, ArrowRight, CheckCircle2,
  Baby, MapPin, Stethoscope, ShieldCheck,
  Eye
} from "lucide-react"
import { Button, Badge, Container, SectionHeading } from "../components"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
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
    desc: "Over 70% of rural families must travel over 25 km to the nearest facility, causing treatable illnesses to escalate into life-threatening emergencies.",
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
    title: "Urban Underserved Communities",
    desc: "Informal settlements in urban centers suffer from poor sanitation, high infectious disease burdens, and prohibitive private healthcare costs.",
    link: "/about",
  },
  {
    num: "04",
    icon: Baby,
    title: "Women & Child Health",
    desc: "High rates of maternal anemia, infant undernutrition, and limited menstrual hygiene education create compounding health crises across generations.",
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

export default function Home() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section
        className="relative pt-10 pb-20 md:pt-14 md:pb-28 overflow-hidden bg-gradient-to-br from-[#051b14] via-[#082e23] to-[#0c4737] text-white"
        aria-label="SCNSWF Healthcare & Social Welfare"
      >
        {/* Subtle organic ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full opacity-20 blur-[100px]"
            style={{ background: "#22b791" }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full opacity-15 blur-[90px]"
            style={{ background: "#db6424" }}
          />
        </div>

        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Answers 1. Who are you? 2. What do you do? 3. What can I do? */}
            <div className="lg:col-span-7 text-left flex flex-col items-start">
              
              {/* Question 1: Who are you? */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="mb-4"
              >
                <Badge
                  variant="dark"
                  size="md"
                  pulse
                  icon={<ShieldCheck className="w-3.5 h-3.5 text-[#55d5b3]" />}
                >
                  SCNSWF · Suresh Chandra Nayak Social Welfare Foundation
                </Badge>
              </motion.div>

              {/* Question 2: What do you do? */}
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] mb-5 tracking-tight"
              >
                Healthcare That Reaches Everyone
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed mb-8 max-w-2xl font-sans"
              >
                Bringing accessible healthcare, awareness and community support to underserved communities across Odisha.
              </motion.p>

              {/* Question 3: What can I do? — Donate / Volunteer / Partner */}
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
                  Donate Now
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

              {/* Direct tertiary touchpoint for Volunteer & Partner */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-300 pt-3 border-t border-white/10 w-full"
              >
                <span className="text-slate-400">Want to get involved?</span>
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/get-involved/volunteer"
                    className="text-[#55d5b3] hover:text-white font-medium underline underline-offset-4 transition-colors"
                  >
                    Volunteer with us
                  </Link>
                  <span className="text-slate-500">•</span>
                  <Link
                    to="/get-involved/partner"
                    className="text-[#55d5b3] hover:text-white font-medium underline underline-offset-4 transition-colors"
                  >
                    Corporate / CSR Partner
                  </Link>
                </div>
              </motion.div>

              {/* Trust highlights */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={5}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 pt-4 border-t border-white/10 text-xs text-slate-300 font-medium"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#55d5b3]" />
                  <span>Section 8 Non-Profit (Govt. of India)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#55d5b3]" />
                  <span>100% Tax Deductible (80G &amp; 12A)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#55d5b3]" />
                  <span>Direct Field Operations in Odisha</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Large Authentic Healthcare/Community Photograph */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative rounded-3xl p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
              >
                {/* Authentic Field Photography */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-inner">
                  <img
                    src="/images/about/project-care-health-hygiene-team.jpg"
                    alt="SCNSWF Project Care health and hygiene medical team providing direct consultations and medications in Odisha"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  
                  {/* Subtle lower gradient to ensure caption readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#051b14]/90 via-[#051b14]/30 to-transparent pointer-events-none" />

                  {/* Top Location Chip */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#051b14]/80 text-[#55d5b3] backdrop-blur-sm border border-white/15 shadow-sm">
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
                      Doctors and health workers conducting health camps and distributing essential medicines in rural Odisha.
                    </p>
                  </div>
                </div>

                {/* Floating highlight card 1: Free doctor consultations */}
                <div className="absolute -bottom-4 -left-4 p-3.5 rounded-xl shadow-xl border border-slate-200/80 bg-white text-slate-900 hidden sm:flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#f0fbf7] text-[#105e49] shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 leading-tight">Doctor Consultations</div>
                    <div className="text-[11px] text-slate-500">Free clinical primary care</div>
                  </div>
                </div>

                {/* Floating highlight card 2: Direct Village Delivery */}
                <div className="absolute -top-3.5 -right-3.5 p-3 rounded-xl shadow-xl border border-slate-200/80 bg-white text-slate-900 hidden sm:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#fff7f3] text-[#db6424] shrink-0">
                    <Heart className="w-4 h-4 fill-[#db6424]" />
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
      <section className="relative z-20 -mt-10 sm:-mt-12 mb-10 sm:mb-14" aria-label="SCNSWF Impact Metrics">
        <Container size="xl">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#e3eae4] shadow-[0_8px_30px_rgba(5,27,20,0.08)] p-6 sm:p-8">
            {/* The 4 Impact Metrics: 10K+ Lives, 100+ Villages, 50+ Camps, 500+ Mothers */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-6 border-b border-slate-100">
              
              {/* Stat 1 */}
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

              {/* Stat 2 */}
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

              {/* Stat 3 */}
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

              {/* Stat 4 */}
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

            {/* Verification Path Strip — Directly addressing user's instruction:
                "these numbers should eventually be backed by reports/data. Don't simply display impressive numbers without a verification path." */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#105e49] shrink-0" />
                <span>
                  <strong>Ground-Audited Impact:</strong> Figures recorded through field register logs and health unit camps.
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

      {/* ── PHASE 4: The Problem We Solve ── */}
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

      {/* ── PHASE 5: Our Work / Programs ── */}
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
                {/* Real Photo with subtle zoom */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={prog.image}
                    alt={prog.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Card Content */}
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

      {/* ── Visual Photo Showcase / Real Work in Action ── */}
      <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-200/60">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-3">
              Field Documentation
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Ground-Level Care in Action
            </h2>
            <p className="text-sm md:text-base text-slate-600">
              Photographs and records from rural camps, village health sessions, and ongoing outreach in Odisha.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
              <ImagePlaceholder
                src="/images/events/free-skin-health-camp-balashram.jpg"
                alt="Free Skin Healthcare camp at Ramakrusna Balashram in collaboration with IADVL and HOMSO"
                label="Free Healthcare Camp"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-teal-700 mb-1">Health Camp Outreach</div>
                  <div className="text-sm font-bold text-slate-900">Free Skin Healthcare Camp</div>
                  <p className="text-xs text-slate-500 mt-1">Free clinical consultations and medicine distribution at Ramakrusna Balashram with IADVL and HOMSO.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
              <ImagePlaceholder
                src="/images/healthcare/womens-health-hygiene-centurion-auditorium.jpg"
                alt="Promoting Women's Health, Hygiene and Sustainable Living seminar at Centurion University"
                label="Women's Health & Hygiene"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-rose-700 mb-1">Women's Health</div>
                  <div className="text-sm font-bold text-slate-900">Hygiene & Sustainable Living</div>
                  <p className="text-xs text-slate-500 mt-1">Centurion University student auditorium seminar on menstrual hygiene, wellness, and eco-friendly choices.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
              <ImagePlaceholder
                src="/images/education/child-health-handwashing.jpg"
                alt="SCNSWF Child Health & Hand Hygiene Education Guide"
                label="Child Health Education"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-coral-700 mb-1" style={{ color: "#c94a2e" }}>Child Hygiene</div>
                  <div className="text-sm font-bold text-slate-900">Handwashing & Health Habits</div>
                  <p className="text-xs text-slate-500 mt-1">Community and school guidance promoting daily handwashing with soap to prevent infectious illnesses.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm flex flex-col">
              <ImagePlaceholder
                src="/images/healthcare/saukhyam-pads-campus-outreach.jpg"
                alt="SCNSWF Saukhyam reusable pads initiative reaching KIIT, AIIMS Bhubaneswar, Centurion, and Gita College"
                label="Sustainable Hygiene Outreach"
                aspect="4/3"
                className="w-full bg-slate-100"
                objectFit="cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-teal-800 mb-1" style={{ color: "#134a48" }}>Eco-Friendly Health</div>
                  <div className="text-sm font-bold text-slate-900">Saukhyam Campus Outreach</div>
                  <p className="text-xs text-slate-500 mt-1">Sustainable reusable pad distribution across KIIT, AIIMS Bhubaneswar, Centurion, and Gita College.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/gallery" className="btn btn-secondary inline-flex items-center gap-2">
              <Eye size={16} /> Explore Complete Field Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ── Impact & Transparency Section ── */}
      <section className="py-14 md:py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block">
                Our Accountability
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
                Ethical Reporting & Verifiable Milestones
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                We believe donor trust is earned through verifiable ground impact rather than inflated numbers. Every mobile clinic route, health camp, and skill batch is tracked with structured field registers.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Community Health Worker Verification</div>
                    <div className="text-xs text-slate-500">Each village camp coordinates with local accredited health workers.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Annual Audited Financial Statements</div>
                    <div className="text-xs text-slate-500">Publicly available statements detailing resource allocations.</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={15} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Feedback & Grievance Mechanism</div>
                    <div className="text-xs text-slate-500">Direct village feedback channels to improve healthcare quality.</div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/impact" className="btn btn-secondary inline-flex items-center gap-2">
                  View Detailed Impact Overview <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
                <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                  Odisha Geographic Outreach Focus
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Targeted rural districts where health infrastructure access presents critical challenges:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    "Khurda", "Nayagarh", "Rayagada",
                    "Koraput", "Kandhamal", "Ganjam",
                    "Cuttack", "Puri", "Jajpur"
                  ].map((district) => (
                    <div
                      key={district}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      <MapPin size={14} className="text-teal-600 shrink-0" />
                      <span>{district}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">Next Community Camp Schedule:</span>
                    <p className="text-teal-700 text-[11px] mt-0.5">Monthly calendar updated for local village leaders</p>
                  </div>
                  <Link to="/contact" className="text-xs font-bold text-teal-800 underline hover:text-teal-950 shrink-0">
                    Inquire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call to Action / Get Involved ── */}
      <section
        className="py-16 md:py-20 relative overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0d2e2c 0%, #1b6b68 60%, #134a48 100%)",
        }}
      >
        <div className="container-custom relative z-10 text-center">
          <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full text-teal-200 bg-white/10 inline-block mb-4">
            Join the Movement
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 max-w-3xl mx-auto leading-tight">
            Help Expand Grassroots Healthcare to Communities in Need
          </h2>
          <p className="text-base sm:text-lg text-teal-100 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Your support enables mobile medical teams, essential medicines, and maternal care outreach. Every contribution directly powers field delivery in Odisha.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/donate"
              className="btn btn-accent px-8 py-3.5 text-base shadow-xl justify-center w-full sm:w-auto"
            >
              <Heart size={18} fill="currentColor" /> Donate to Healthcare Fund
            </Link>
            <Link
              to="/get-involved/volunteer"
              className="btn btn-secondary px-8 py-3.5 text-base border-white/40 text-white hover:bg-white/10 justify-center w-full sm:w-auto"
            >
              <Users size={18} /> Volunteer with Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
