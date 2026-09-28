import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Heart, Users, ArrowRight, CheckCircle2, ChevronRight,
  Activity, Baby, GraduationCap, Droplets,
  MapPin, Stethoscope, ShieldCheck, HeartHandshake,
  Eye
} from "lucide-react"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const },
  }),
}

const FEATURED_PROGRAMS = [
  {
    slug: "mobile-health-units",
    icon: Activity,
    tag: "Healthcare Access",
    title: "Mobile Health Units",
    desc: "Delivering doctor consultations, basic diagnostics, and essential medications to remote villages lacking permanent healthcare facilities.",
    color: "#1b6b68",
    bg: "#edfafa",
  },
  {
    slug: "maternal-child-health",
    icon: Baby,
    tag: "Maternal Wellness",
    title: "Maternal & Child Health",
    desc: "Prenatal monitoring, nutrition counselling, safe institutional delivery facilitation, and postnatal follow-up care for mothers and newborns.",
    color: "#c94a2e",
    bg: "#fde8e0",
  },
  {
    slug: "skill-development",
    icon: GraduationCap,
    tag: "Livelihood",
    title: "Skill Development",
    desc: "Vocational training, digital skills, and sustainable livelihood support for rural youth, women, and self-help groups.",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    slug: "clean-water-sanitation",
    icon: Droplets,
    tag: "WASH",
    title: "Clean Water & Sanitation",
    desc: "Safe drinking water purification assistance and community hygiene education in vulnerable and flood-prone settlements.",
    color: "#279490",
    bg: "#edfafa",
  },
]

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Section 8 Non-Profit",
    desc: "Incorporated under Section 8 of the Companies Act, 2013 (MCA, Govt. of India), dedicated to charitable healthcare and social welfare.",
  },
  {
    icon: HeartHandshake,
    title: "Community-Led Delivery",
    desc: "We work directly alongside panchayats, ASHA workers, and village elders to ensure health interventions address real local needs.",
  },
  {
    icon: Stethoscope,
    title: "Primary Healthcare Focus",
    desc: "Prioritizing preventative screening, early detection, and timely referral linkages before treatable illnesses become crises.",
  },
  {
    icon: Users,
    title: "Transparent Governance",
    desc: "Committed to open accountability, verifiable program reporting, and responsible stewardship of every rupee donated.",
  },
]

export default function Home() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        style={{
          background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 45%, #1b6b68 85%, #165653 100%)",
        }}
      >
        {/* Subtle background glow & texture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={{
              position: "absolute",
              top: "-15%",
              right: "-10%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "rgba(39, 148, 144, 0.16)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: "rgba(224, 90, 55, 0.08)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 text-left">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-5 px-3.5 py-1.5 rounded-full border"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  borderColor: "rgba(255, 255, 255, 0.18)",
                  color: "#9de4e3",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Heart size={14} className="text-amber-300" fill="currentColor" />
                <span>Grassroots Healthcare & Welfare · Bhubaneswar, Odisha</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] mb-6 tracking-tight"
              >
                Dignity and Accessible Healthcare for{" "}
                <span className="text-gradient">Every Community</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-2xl font-normal"
                style={{ color: "rgba(255, 255, 255, 0.82)" }}
              >
                Suresh Chandra Nayak Social Welfare Foundation (SCNSWF) brings dedicated mobile medical units, maternal and child wellness initiatives, and community empowerment to underserved regions across Odisha.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10"
              >
                <Link
                  to="/donate"
                  className="btn btn-accent text-center shadow-lg hover:shadow-xl justify-center"
                >
                  <Heart size={18} fill="currentColor" />
                  Support Our Mission
                </Link>
                <Link
                  to="/programs"
                  className="btn btn-secondary text-center justify-center"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.35)",
                    color: "#ffffff",
                    background: "rgba(255, 255, 255, 0.06)",
                  }}
                >
                  Explore Our Programs
                  <ArrowRight size={18} />
                </Link>
              </motion.div>

              {/* Trust Signals */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t"
                style={{ borderColor: "rgba(255, 255, 255, 0.12)" }}
              >
                <div className="flex items-center gap-2.5 text-xs text-teal-100/90 font-medium">
                  <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
                  <span>Section 8 Registered Non-Profit</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-teal-100/90 font-medium">
                  <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
                  <span>Direct Field Operations</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-teal-100/90 font-medium">
                  <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
                  <span>Primary Care & Education</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Container */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative rounded-3xl p-3 bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl"
              >
                {/* Main Hero Visual Area */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-[4/3]">
                  <ImagePlaceholder
                    src="/images/hero/together-rising-womens-health.jpg"
                    alt="SCNSWF Together Rising initiative promoting women's health, youth volunteerism, and sustainable hygiene"
                    label="Together Rising · Community Health"
                    aspect="4/3"
                    className="w-full h-full"
                    objectFit="cover"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, rgba(10,31,30,0.92) 0%, rgba(10,31,30,0.25) 50%, transparent 80%)",
                    }}
                  />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-teal-800/90 text-teal-200">
                      Together Rising Initiative
                    </span>
                    <p className="text-sm font-medium mt-1 text-slate-100">
                      Community healthcare, student volunteerism & sustainable women's health in Odisha · SCNSWF
                    </p>
                  </div>
                </div>

                {/* Floating highlight card 1 */}
                <div
                  className="absolute -bottom-5 -left-5 p-4 rounded-xl shadow-xl border hidden sm:flex items-center gap-3"
                  style={{
                    background: "#ffffff",
                    borderColor: "#e2e8f0",
                    maxWidth: "240px",
                  }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-teal-50 text-teal-700 shrink-0">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Doctor Consultations</div>
                    <div className="text-[11px] text-slate-500">Clinical guidance & primary care</div>
                  </div>
                </div>

                {/* Floating highlight card 2 */}
                <div
                  className="absolute -top-4 -right-4 p-3.5 rounded-xl shadow-xl border hidden sm:flex items-center gap-3"
                  style={{
                    background: "#ffffff",
                    borderColor: "#e2e8f0",
                    maxWidth: "230px",
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-teal-50 text-teal-700 shrink-0">
                    <Activity size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Geriatric Care</div>
                    <div className="text-[11px] text-slate-500">HOMSO home medical support</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Crisp Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10 md:h-12">
            <path d="M0 48L1440 48L1440 12C1180 44 760 0 460 24C230 42 0 12 0 12L0 48Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── Operational Focus & Impact Scope (Honest & Grounded) ── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-3">
              Grassroots Foundation
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Committed to High-Need Rural Communities
            </h2>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
              Rather than abstract figures, our focus is grounded in regular, verifiable field activities that provide direct access to medical advice, diagnosis, and preventative interventions.
            </p>
          </div>

          {/* 4 Core Principles / Operational Commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 text-teal-700 mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Programs Section ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-3">
                What We Do
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">
                Our Primary Program Areas
              </h2>
            </div>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              View all programs & coverage <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PROGRAMS.map(({ slug, icon: Icon, tag, title, desc, color, bg }, idx) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="rounded-2xl border p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
                style={{ backgroundColor: bg, borderColor: `${color}25` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}18`, color }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: "#ffffff", color }}
                    >
                      {tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {desc}
                  </p>
                </div>

                <Link
                  to={`/programs/${slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
                  style={{ color }}
                >
                  Learn more <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
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
