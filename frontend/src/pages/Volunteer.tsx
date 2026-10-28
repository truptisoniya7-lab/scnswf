import { useState } from "react"
import {
  HeartHandshake,
  CheckCircle2,
  Users,
  MapPin,
  Clock,
  Award,
  Sparkles,
  AlertCircle,
  Calendar,
  Send,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react"
import { submitVolunteerApplication } from "../api/forms"
import type { VolunteerFormData } from "../types"

const PRESET_SKILLS = [
  "General Healthcare / First Aid",
  "Teaching & Child Tutoring",
  "Community Mobilization",
  "Event Organizing & Logistics",
  "Digital Media & Photography",
  "Counseling & Social Work",
  "Disaster Relief Deployment",
]

const AVAILABILITY_OPTIONS = [
  { value: "Weekends Only", label: "Weekends Only (Saturday & Sunday)" },
  { value: "Weekday Evenings", label: "Weekday Evenings (Part-Time)" },
  { value: "Full-Time Field Volunteer", label: "Full-Time (Active Field Deployments)" },
  { value: "On-Call Emergency Relief", label: "On-Call (Disaster & Medical Camp Drives)" },
  { value: "Remote / Digital Support", label: "Remote / Digital Content & Coordination" },
]

export default function Volunteer() {
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    skills: "",
    availability: "Weekends Only",
    experience: "",
    message: "",
  })

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  const toggleSkill = (skill: string) => {
    let next: string[]
    if (selectedSkills.includes(skill)) {
      next = selectedSkills.filter((s) => s !== skill)
    } else {
      next = [...selectedSkills, skill]
    }
    setSelectedSkills(next)
    setFormData((prev) => ({
      ...prev,
      skills: next.join(", "),
    }))
  }

  const validate = (): boolean => {
    const errs: Record<string, string[]> = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = ["Please provide your full name (at least 2 characters)."]
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = ["Please enter a valid email address."]
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errs.phone = ["Please provide a valid phone number (at least 8 digits)."]
    }
    if (!formData.location.trim()) {
      errs.location = ["Please mention your current city or district."]
    }
    if (!formData.skills.trim()) {
      errs.skills = ["Please select or enter at least one skill or area of interest."]
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = ["Please share a brief note on why you would like to volunteer."]
    }

    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)

    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      const response = await submitVolunteerApplication(formData)
      setSubmittedRef(response.data.id)
    } catch (err: any) {
      if (err.response?.data?.error) {
        const errorData = err.response.data.error
        setServerError(errorData.message || "Failed to submit application. Please check the fields.")
        if (errorData.details) {
          setFieldErrors(errorData.details)
        }
      } else {
        setServerError("Could not reach the foundation server. Please check your network and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      skills: "",
      availability: "Weekends Only",
      experience: "",
      message: "",
    })
    setSelectedSkills([])
    setSubmittedRef(null)
    setServerError(null)
    setFieldErrors({})
  }

  return (
    <>
      {/* ── Hero Section ── */}
      <section
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #071f1e 0%, #0d3835 45%, #165b57 85%, #1b6b68 100%)" }}
      >
        <div className="container-custom relative z-10 text-white">
          <div className="max-w-3xl">
            <span
              className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-4 px-3.5 py-1.5 rounded-full border shadow-sm"
              style={{
                background: "rgba(255,255,255,0.08)",
                borderColor: "rgba(255,255,255,0.2)",
                color: "#9de4e3",
              }}
            >
              <HeartHandshake size={15} className="text-amber-300" />
              <span>SCNSWF Community Volunteers · Grassroots Action</span>
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
              Lend Your Hands. <br />
              <span className="text-gradient">Transform Rural Lives.</span>
            </h1>

            <p className="text-base sm:text-lg text-teal-100/90 font-normal leading-relaxed mb-8">
              Join hundreds of compassionate doctors, teachers, professionals, and youth across Odisha who dedicate their time to our mobile medical clinics, child learning centers, and emergency relief operations.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-teal-200/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Flexible Weekend Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Verified Service Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Direct Field Engagement</span>
              </div>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── Impact Highlights Bar ── */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-slate-900 text-lg leading-tight">1,200+</p>
                <p className="text-xs text-slate-500">Active Volunteers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <HeartHandshake size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-slate-900 text-lg leading-tight">145+</p>
                <p className="text-xs text-slate-500">Free Health Camps</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-slate-900 text-lg leading-tight">65,000+</p>
                <p className="text-xs text-slate-500">Lives Touched</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-slate-900 text-lg leading-tight">100%</p>
                <p className="text-xs text-slate-500">Verified Recognition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Section: Form & Info ── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto">
            {/* Left Column: Why Volunteer & Impact Areas */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/80 inline-block mb-3">
                  Why Join SCNSWF
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Meaningful Service, Real Community Bond
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Volunteering with the Suresh Chandra Nayak Social Welfare Foundation puts you directly on the frontlines of rural healthcare and child education. Whether you can spare two hours a weekend or deploy for a mega medical camp, your skills matter.
                </p>
              </div>

              {/* Four pillars of volunteering */}
              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center shrink-0">
                    <HeartHandshake size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Mobile Healthcare Units</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Assist doctors, manage patient registration, distribute hygiene kits, and organize diagnostic queues in remote villages.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Child Hygiene & Education</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Teach proper handwashing habits, guide interactive story sessions, and support after-school remedial learning kits.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Flexible Scheduling</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Participate based on your schedule—weekend health rallies, evening mentoring, or rapid cyclone relief deployments.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Official Certificate of Service</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Receive an official recognition certificate acknowledging your verified service hours and leadership contribution.</p>
                  </div>
                </div>
              </div>

              {/* Quote card */}
              <div className="p-5 rounded-2xl border border-teal-200/80 bg-linear-to-br from-teal-50/70 to-emerald-50/40">
                <p className="text-xs italic text-teal-900 leading-relaxed mb-3">
                  "Serving at the Kalahandi eye and health camp was one of the most grounding experiences of my life. The trust villagers have in the Foundation is inspiring."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                    SS
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs text-slate-900">Subhashree Samal</p>
                    <p className="text-[11px] text-teal-700">Volunteer & Medical Student, Cuttack</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Application Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm relative">
                {submittedRef ? (
                  /* Success View */
                  <div className="text-center py-8 px-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
                      <ShieldCheck size={36} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-emerald-800 bg-emerald-50 inline-block mb-3">
                      Application Submitted Successfully
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                      Welcome to the SCNSWF Family!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                      Thank you for volunteering your time and passion. Our volunteer coordination team will review your application and contact you within <strong>2 business days</strong> via phone and email.
                    </p>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-sm mx-auto mb-6 text-left">
                      <p className="text-xs text-slate-500 mb-1">Application Reference ID:</p>
                      <p className="font-mono text-xs font-bold text-teal-800 break-all">{submittedRef}</p>
                      <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                        <Calendar size={13} className="text-slate-400" />
                        <span>Submitted on {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={resetForm}
                        className="btn btn-outline text-xs w-full sm:w-auto"
                      >
                        Submit Another Application
                      </button>
                      <a
                        href="/programs"
                        className="btn btn-primary text-xs w-full sm:w-auto inline-flex items-center justify-center gap-1.5"
                      >
                        Explore Foundation Programs <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          Volunteer Application Form
                        </h2>
                        <span className="text-xs text-slate-500 hidden sm:inline-block">* Required fields</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Fill in your details below. We match volunteers based on interest, location, and field availability.
                      </p>
                    </div>

                    {serverError && (
                      <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                        <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
                        <div>
                          <p className="font-bold">Submission failed</p>
                          <p className="mt-0.5">{serverError}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      {/* Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Anita Sahoo"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                              fieldErrors.name
                                ? "border-rose-400 focus:ring-rose-200"
                                : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                            }`}
                          />
                          {fieldErrors.name && (
                            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.name[0]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="anita@example.com"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                              fieldErrors.email
                                ? "border-rose-400 focus:ring-rose-200"
                                : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                            }`}
                          />
                          {fieldErrors.email && (
                            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email[0]}</p>
                          )}
                        </div>
                      </div>

                      {/* Phone & Location */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                              fieldErrors.phone
                                ? "border-rose-400 focus:ring-rose-200"
                                : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                            }`}
                          />
                          {fieldErrors.phone && (
                            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone[0]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Current Location / City *
                          </label>
                          <div className="relative">
                            <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                            <input
                              type="text"
                              required
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              placeholder="e.g. Bhubaneswar, Odisha"
                              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                                fieldErrors.location
                                  ? "border-rose-400 focus:ring-rose-200"
                                  : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                              }`}
                            />
                          </div>
                          {fieldErrors.location && (
                            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.location[0]}</p>
                          )}
                        </div>
                      </div>

                      {/* Skills Quick Chips */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Skills & Interests *
                        </label>
                        <p className="text-xs text-slate-500 mb-2">Click all that apply or type your custom skill below:</p>
                        <div className="flex flex-wrap gap-1.5 mb-2.5">
                          {PRESET_SKILLS.map((skill) => {
                            const isSelected = selectedSkills.includes(skill)
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                                  isSelected
                                    ? "bg-teal-700 text-white border-teal-700 font-semibold shadow-xs"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {isSelected ? "✓ " : "+ "}
                                {skill}
                              </button>
                            )
                          })}
                        </div>
                        <input
                          type="text"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                          placeholder="Selected skills or specify other (e.g. Graphic design, Data entry)"
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.skills
                              ? "border-rose-400 focus:ring-rose-200"
                              : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                          }`}
                        />
                        {fieldErrors.skills && (
                          <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.skills[0]}</p>
                        )}
                      </div>

                      {/* Availability */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Availability *
                        </label>
                        <select
                          value={formData.availability}
                          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 bg-white"
                        >
                          {AVAILABILITY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Experience */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Prior Volunteer or Professional Experience <span className="text-slate-400 font-normal lowercase">(optional)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          placeholder="Briefly describe any past NGO, healthcare, NSS, NCC, or community leadership experience..."
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700"
                        />
                      </div>

                      {/* Motivation / Message */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Why do you want to volunteer with SCNSWF? *
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Share your inspiration, what drives you to serve, or any specific initiative you want to support..."
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.message
                              ? "border-rose-400 focus:ring-rose-200"
                              : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                          }`}
                        />
                        {fieldErrors.message && (
                          <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.message[0]}</p>
                        )}
                      </div>

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3 inline-flex items-center justify-center gap-2 text-sm font-bold shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Submitting Application...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Submit Volunteer Application</span>
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-slate-500">
                        🔒 Your personal information is kept strictly confidential and only used for Foundation coordination.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Volunteer FAQ ── */}
      <section className="py-14 bg-white border-t border-slate-200/80">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
              Frequently Asked Questions
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Everything You Need to Know About Volunteering
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Is there an age or qualification requirement?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Volunteers must be 18 years or older. No specific formal degree is required—we welcome college students, medical professionals, retired educators, and corporate employees alike.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Do I receive a certificate?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes. Volunteers who complete at least 25 documented hours of field service or camp assistance receive an official, verified Certificate of Social Service from the Foundation.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                How are field camps organized?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Field camps are scheduled primarily on weekends across designated rural clusters in Odisha. SCNSWF provides group transport from Bhubaneswar headquarters and meals during the drive.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Can I volunteer remotely?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes. We offer remote volunteer roles in curriculum design, translation (Odia/Hindi/English), impact story documentation, social media advocacy, and graphic design.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
