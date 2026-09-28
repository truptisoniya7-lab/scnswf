import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Heart, Target, Eye, Star, Users,
  ArrowRight, CheckCircle2, Shield, FileText, Stethoscope,
  Baby
} from "lucide-react"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"

/* ── Animation ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
}
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

/* ── Authentic Milestone Data ── */
const TIMELINE = [
  {
    year: "2022",
    title: "Foundation Incorporation",
    desc: "Suresh Chandra Nayak Social Welfare Foundation was formally incorporated under Section 8 of the Companies Act in Bhubaneswar, Odisha, dedicated to improving rural health access.",
  },
  {
    year: "2023",
    title: "Grassroots Healthcare Delivery",
    desc: "Structured community medical camps and preventative consultations to bridge the healthcare divide across high-need rural hamlets.",
  },
  {
    year: "2024",
    title: "Maternal & Child Health Guidance",
    desc: "Community health awareness sessions and nutrition counseling coordinated with grassroots village health workers.",
  },
  {
    year: "2025",
    title: "Public Health Awareness Drives",
    desc: "Active public health mobilization including polio eradication vigilance, child handwashing habits, and community festival safety campaigns.",
  },
  {
    year: "Present",
    title: "Clinical Advisory & Community Wellness",
    desc: "Clinical guidance, elder care advisory, and partnership development to strengthen healthcare coverage across underserved blocks of Odisha.",
  },
]

const LEADERSHIP = [
  {
    name: "Suresh Chandra Nayak",
    role: "Founder & President",
    bio: "Longstanding public welfare advocate dedicated to grassroots community mobilization, preventative health access, and social justice across Odisha.",
    initials: "SN",
    color: "#1b6b68",
  },
  {
    name: "Foundation Secretary",
    role: "Secretary & Operations Lead",
    bio: "Oversees program coordination, field logistics, maternal health outreach, and village-level stakeholder management.",
    initials: "FS",
    color: "#279490",
  },
  {
    name: "Program Director",
    role: "Healthcare Programs Lead",
    bio: "Directs mobile clinic routes, diagnostic camp scheduling, referral coordination, and healthcare volunteer training.",
    initials: "PD",
    color: "#134a48",
  },
]

const CERTIFICATIONS = [
  { label: "Section 8 Non-Profit", desc: "Incorporated non-profit under the Companies Act, 2013 (Govt. of India)" },
  { label: "ROC Cuttack Registered", desc: "Registered with Registrar of Companies, Ministry of Corporate Affairs (CIN: U85300OR2022NPL040087)" },
  { label: "Charitable Welfare Mandate", desc: "Dedicated objects in primary healthcare, child hygiene, and social development" },
  { label: "Statutory Reporting", desc: "Committed to regular independent chartered accountant audits and governance filings" },
]

const VALUES = [
  {
    icon: Heart,
    title: "Compassion",
    desc: "Centering human dignity and empathy in every interaction with rural patients and families.",
  },
  {
    icon: Shield,
    title: "Integrity",
    desc: "Transparent fund utilization, ethical healthcare delivery, and verifiable field records.",
  },
  {
    icon: Users,
    title: "Community Partnership",
    desc: "Empowering village elders, ASHA workers, and youth as active participants in local welfare.",
  },
  {
    icon: Star,
    title: "Continuous Quality",
    desc: "Regularly refining mobile clinic practices, diagnostic accuracy, and patient follow-up.",
  },
]

export default function About() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden"
        style={{
          background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 50%, #1b6b68 90%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-4 px-3.5 py-1.5 rounded-full border"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "#9de4e3",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Heart size={14} className="text-amber-300" fill="currentColor" />
                <span>Bhubaneswar, Odisha · Registered Social Welfare Organization</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5"
              >
                About <span className="text-gradient">SCNSWF</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-base sm:text-lg leading-relaxed mb-6 font-normal"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                Suresh Chandra Nayak Social Welfare Foundation is dedicated to delivering grassroots healthcare, maternal wellness, and livelihood development to underserved communities across Odisha.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-wrap gap-3"
              >
                <Link to="/programs" className="btn btn-accent">
                  Our Programs <ArrowRight size={16} />
                </Link>
                <Link
                  to="/impact"
                  className="btn btn-secondary"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.35)",
                    color: "#ffffff",
                    background: "rgba(255, 255, 255, 0.08)",
                  }}
                >
                  Our Impact Overview
                </Link>
              </motion.div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden p-2 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <ImagePlaceholder
                  src="/images/about/project-care-health-hygiene-team.jpg"
                  alt="SCNSWF Project Care team and healthcare coordinators during health and hygiene sessions"
                  label="Project Care · Health & Hygiene Team"
                  aspect="16/10"
                  className="w-full bg-slate-900/40"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Mission / Vision ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-3">
                Who We Are
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-5">
                Bridging the Healthcare Divide in Rural Odisha
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-4">
                SCNSWF was founded on the fundamental principle that basic medical care, health education, and social dignity should be accessible to every person regardless of geographic remoteness or economic condition.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                By operating mobile clinic units and training local community volunteers, we bridge the gap between primary healthcare centres and distant rural hamlets.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl p-6 border border-teal-100 bg-teal-50/50 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-teal-100 text-teal-800">
                  <Target size={20} />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Our Mission</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  To deliver dignified, accessible healthcare and sustainable community support to vulnerable populations across Odisha through grassroots mobile services and partnerships.
                </p>
              </div>

              <div className="rounded-2xl p-6 border border-amber-100 bg-amber-50/50 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-amber-100 text-amber-800">
                  <Eye size={20} />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-2">Our Vision</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  A society where every rural family in Odisha has direct access to primary medical diagnosis, preventative healthcare, and avenues for economic self-reliance.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
              Foundational Values
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">What Guides Our Work</h2>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-teal-200 hover:shadow-md transition-all text-center"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-teal-50 text-teal-700">
                  <Icon size={22} />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900 mb-2">{title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Organization Journey ── */}
      <section className="py-14 md:py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-2">
              Organizational History
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">Our Field Journey</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              A decade and a half of grassroots presence, beginning from small community camps in Khurda to structured healthcare outreach.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-teal-200" />
            <div className="space-y-8">
              {TIMELINE.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="flex gap-6 pl-14 relative items-start"
                >
                  <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-teal-600 shadow-sm" />
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm w-full">
                    <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 mb-2 border border-teal-200">
                      {year}
                    </span>
                    <h3 className="font-display font-bold text-base text-slate-900 mb-1">{title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Leadership & Governance ── */}
      <section className="py-14 md:py-20 bg-white border-t border-slate-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
              Governance
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">Leadership & Advisory</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              Committed to responsible stewardship, ethical community practices, and transparent NGO operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {LEADERSHIP.map(({ name, role, bio, initials, color }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 font-display font-bold text-xl text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
                >
                  {initials}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 mb-1">{name}</h3>
                <p className="text-xs font-semibold text-teal-700 mb-3">{role}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{bio}</p>
              </motion.div>
            ))}
          </div>

          {/* Cultural & Community Roots Spotlight */}
          <div className="mt-12 max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 bg-gradient-to-br from-amber-50/50 to-teal-50/40 p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
              <ImagePlaceholder
                src="/images/about/raja-parba-homso.jpg"
                alt="SCNSWF and HOMSO celebration of Raja Parba festival in Odisha honoring womanhood"
                label="Cultural Heritage & Wellness"
                aspect="16/10"
                className="w-full"
                objectFit="cover"
              />
            </div>
            <div className="md:col-span-6">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-amber-900 bg-amber-100 border border-amber-200 inline-block mb-2">
                Cultural Roots & Community Wellness
              </span>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                Honoring Odisha's Heritage & Traditions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Healthcare and social welfare flourish when grounded in local respect and cultural celebration. Alongside partners like HOMSO, SCNSWF honors traditions such as Raja Parba, celebrating womanhood, community harmony, and seasonal health awareness.
              </p>
              <div className="text-xs font-semibold text-teal-800">
                Community Harmony · Dignified Care · Odisha Traditions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compliance & Legal Framework ── */}
      <section className="py-14 md:py-18 bg-slate-50 border-t border-slate-200">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-2">
              Statutory Transparency
            </span>
            <h2 className="font-display text-3xl font-bold text-slate-900">Compliance & Registrations</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {CERTIFICATIONS.map(({ label, desc }) => (
              <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <CheckCircle2 size={20} className="text-teal-600 mb-3" />
                <h3 className="font-display font-bold text-sm text-slate-900 mb-1">{label}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/60 flex items-start gap-3">
            <FileText size={20} className="text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-teal-900">
              <span className="font-bold">Official Document Disclosure:</span> Full certificate of incorporation, memorandum of association, and statutory filings are maintained in foundation archives and provided upon regulatory filing or formal stakeholder request.
            </div>
          </div>
        </div>
      </section>

      {/* ── Operational Focus Banner (No invented numbers) ── */}
      <section
        className="py-12 text-white"
        style={{ background: "linear-gradient(135deg, #1b6b68 0%, #0d2e2c 100%)" }}
      >
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <Stethoscope size={24} className="mx-auto mb-2 text-teal-300" />
              <div className="font-display font-bold text-lg text-white">Mobile Health</div>
              <div className="text-xs text-teal-200">Doorstep medical consultations</div>
            </div>
            <div>
              <Baby size={24} className="mx-auto mb-2 text-amber-300" />
              <div className="font-display font-bold text-lg text-white">Maternal Care</div>
              <div className="text-xs text-teal-200">Antenatal guidance & nutrition</div>
            </div>
            <div>
              <Users size={24} className="mx-auto mb-2 text-teal-300" />
              <div className="font-display font-bold text-lg text-white">Community Driven</div>
              <div className="text-xs text-teal-200">Local health volunteer network</div>
            </div>
            <div>
              <Shield size={24} className="mx-auto mb-2 text-teal-300" />
              <div className="font-display font-bold text-lg text-white">Section 8 Registered</div>
              <div className="text-xs text-teal-200">Ministry of Corporate Affairs</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Join Our Mission CTA ── */}
      <section className="py-16 bg-white">
        <div className="container-custom text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Partner with SCNSWF
          </h2>
          <p className="text-sm md:text-base text-slate-600 mb-8 leading-relaxed">
            Support rural primary care delivery, volunteer in our health camps, or establish an institutional CSR partnership.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate" className="btn btn-accent">
              <Heart size={16} fill="currentColor" /> Donate Now
            </Link>
            <Link to="/get-involved/volunteer" className="btn btn-secondary">
              <Users size={16} /> Volunteer with Us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
