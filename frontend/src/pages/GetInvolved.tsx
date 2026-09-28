import { Link } from "react-router-dom"
import { Heart, Users, Briefcase, Handshake, ArrowRight, ShieldCheck } from "lucide-react"
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder"

const PATHS = [
  {
    title: "Donate",
    desc: "Fund mobile medical clinics, medicines, and healthcare outreach directly.",
    icon: Heart,
    to: "/donate",
    cta: "Support Our Mission",
    color: "#1b6b68",
    bg: "#edfafa",
  },
  {
    title: "Volunteer",
    desc: "Contribute your skills to village health awareness, education drives, and community events.",
    icon: Users,
    to: "/get-involved/volunteer",
    cta: "Apply to Volunteer",
    color: "#c94a2e",
    bg: "#fde8e0",
  },
  {
    title: "Internship",
    desc: "Gain hands-on grassroots experience in public health, rural development, and non-profit administration.",
    icon: Briefcase,
    to: "/get-involved/internship",
    cta: "Apply for Internship",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    title: "Partner With Us",
    desc: "Collaborate on CSR healthcare initiatives, technical resources, and institutional welfare partnerships.",
    icon: Handshake,
    to: "/get-involved/partner",
    cta: "Explore Partnerships",
    color: "#134a48",
    bg: "#edfafa",
  },
]

export default function GetInvolved() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 50%, #1b6b68 90%)" }}
      >
        <div className="container-custom relative z-10 text-white">
          <span
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-4 px-3.5 py-1.5 rounded-full border"
            style={{
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.18)",
              color: "#9de4e3",
            }}
          >
            <Users size={14} className="text-amber-300" />
            <span>Community Collaboration · Bhubaneswar, Odisha</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Get <span className="text-gradient">Involved</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl text-teal-100 font-normal leading-relaxed">
            Join Suresh Chandra Nayak Social Welfare Foundation in delivering dignity, accessible healthcare, and grassroots support across Odisha.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Participation Options ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {PATHS.map((p) => (
              <div
                key={p.to}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm"
                    style={{ background: p.bg, color: p.color }}
                  >
                    <p.icon size={28} />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-900 mb-3">{p.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{p.desc}</p>
                </div>
                <Link
                  to={p.to}
                  className="btn btn-primary self-start inline-flex items-center gap-2 text-xs font-bold"
                >
                  {p.cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          {/* ── Authentic Community Care Feature ── */}
          <div className="max-w-5xl mx-auto rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-white">
                <ImagePlaceholder
                  src="/images/about/project-care-health-hygiene-team.jpg"
                  alt="SCNSWF Project Care health facilitators, volunteers, and doctors in Odisha"
                  label="Volunteers & Field Facilitators"
                  aspect="4/3"
                  className="w-full"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/70 inline-block mb-3">
                Grassroots Solidarity
              </span>
              <h3 className="font-display text-2xl font-bold text-slate-900 mb-3">
                Action That Uplifts, Empowers, and Transforms Lives
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                At SCNSWF, we believe lasting change happens when compassionate individuals, grassroots health volunteers, and partner organizations join hands. Whether assisting in rural health awareness camps, supporting maternal care follow-ups, or sponsoring essential medical provisions, your involvement creates tangible grassroots impact.
              </p>
              <div className="flex items-center gap-3 text-xs text-teal-900 font-semibold">
                <ShieldCheck size={16} className="text-teal-600 shrink-0" />
                <span>Registered Section 8 Social Welfare Foundation</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
