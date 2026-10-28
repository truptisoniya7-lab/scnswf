import { useState, useRef } from "react"
import {
  GraduationCap,
  Briefcase,
  FileText,
  UploadCloud,
  CheckCircle2,
  Calendar,
  Award,
  Users,
  AlertCircle,
  Clock,
  Send,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  X,
  FileCheck,
} from "lucide-react"
import { submitInternshipApplication } from "../api/forms"
import type { InternshipFormData } from "../types"

const TRACKS = [
  {
    id: "Public Health & Medical Outreach",
    title: "Public Health & Medical Outreach",
    desc: "Coordinate mobile health clinics, epidemiological screening, and preventative immunization campaigns.",
  },
  {
    id: "Child Education & Remedial Learning",
    title: "Child Education & Remedial Learning",
    desc: "Develop foundational learning kits, hygiene curricula, and tutor children in village learning centers.",
  },
  {
    id: "NGO Management & Social Development",
    title: "NGO Management & Social Development",
    desc: "Gain exposure to non-profit governance, CSR proposal drafting, stakeholder relations, and compliance.",
  },
  {
    id: "Impact Documentation & Media",
    title: "Impact Documentation & Digital Media",
    desc: "Capture beneficiary stories, document medical camp photojournalism, and design social campaigns.",
  },
]

const DURATIONS = [
  { value: "1 Month", label: "1 Month (Summer / Winter Intensive)" },
  { value: "2 Months", label: "2 Months (Recommended for College Credits)" },
  { value: "3 Months", label: "3 Months (In-Depth Project Fellowship)" },
  { value: "6 Months", label: "6 Months (Extended Trainee Fellowship)" },
]

export default function Internship() {
  const [formData, setFormData] = useState<InternshipFormData>({
    name: "",
    email: "",
    phone: "",
    education: "",
    area_of_interest: "Public Health & Medical Outreach",
    duration: "2 Months",
    message: "",
    resume: undefined as unknown as File,
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  const handleFileChange = (file: File | null) => {
    setFileError(null)
    if (!file) {
      setSelectedFile(null)
      return
    }

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setFileError("Please upload a PDF or Word document (.pdf, .doc, .docx).")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit. Please upload a smaller resume file.")
      return
    }

    setSelectedFile(file)
    setFormData((prev) => ({ ...prev, resume: file }))
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
    if (!formData.education.trim()) {
      errs.education = ["Please mention your college, university, or current degree."]
    }
    if (!formData.area_of_interest.trim()) {
      errs.area_of_interest = ["Please select an area of interest."]
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = ["Please share your motivation or statement of purpose (at least 5 characters)."]
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
      // In production, file can be uploaded to cloud storage; for now we attach a filename reference URL
      const resumeUrl = selectedFile
        ? `https://storage.scnswf.org/resumes/${Date.now()}-${selectedFile.name.replace(/\s+/g, "_")}`
        : "https://storage.scnswf.org/resumes/candidate-resume.pdf"

      const response = await submitInternshipApplication({
        ...formData,
        resume_url: resumeUrl,
      })

      setSubmittedRef(response.data.id)
    } catch (err: any) {
      if (err.response?.data?.error) {
        const errorData = err.response.data.error
        setServerError(errorData.message || "Failed to submit application. Please review form fields.")
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
      education: "",
      area_of_interest: "Public Health & Medical Outreach",
      duration: "2 Months",
      message: "",
      resume: undefined as unknown as File,
    })
    setSelectedFile(null)
    setFileError(null)
    setSubmittedRef(null)
    setServerError(null)
    setFieldErrors({})
  }

  return (
    <>
      {/* ── Hero Section ── */}
      <section
        className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #071f1e 0%, #0e3d3a 45%, #18635f 85%, #1b6b68 100%)" }}
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
              <GraduationCap size={15} className="text-amber-300" />
              <span>Student & Graduate Fellowships · Social Impact Internships</span>
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
              Gain Real-World Experience. <br />
              <span className="text-gradient">Lead Social Innovation.</span>
            </h1>

            <p className="text-base sm:text-lg text-teal-100/90 font-normal leading-relaxed mb-8">
              Work alongside senior physicians, social development leaders, and grassroots educators. Gain practical field immersion, publish case studies, and earn an official letter of recommendation.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-teal-200/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Letter of Recommendation (LOR)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>College Academic Credit Eligible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Field & Hybrid Tracks</span>
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

      {/* ── Internship Tracks Overview ── */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-8 md:py-10">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/80 inline-block mb-2">
              Curated Fellowship Tracks
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Select Your Area of Focus
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRACKS.map((t) => (
              <div
                key={t.id}
                onClick={() => setFormData((p) => ({ ...p, area_of_interest: t.id }))}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  formData.area_of_interest === t.id
                    ? "bg-teal-900 text-white border-teal-900 shadow-md ring-2 ring-teal-600/30"
                    : "bg-white text-slate-900 border-slate-200 hover:border-teal-400 hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      formData.area_of_interest === t.id ? "bg-white/15 text-amber-300" : "bg-teal-50 text-teal-700"
                    }`}
                  >
                    <Briefcase size={18} />
                  </div>
                  {formData.area_of_interest === t.id && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      Selected
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-sm mb-1.5">{t.title}</h3>
                <p className={`text-xs leading-relaxed ${formData.area_of_interest === t.id ? "text-teal-100" : "text-slate-600"}`}>
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Section: Form & What You Get ── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto">
            {/* Left Column: Benefits & Testimonial */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/80 inline-block mb-3">
                  Fellowship Perks
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Launch Your Career in Social Leadership
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our internship is not about making photocopies. You are embedded directly into active public health initiatives, community learning hubs, and organizational planning sessions.
                </p>
              </div>

              {/* 4 Benefits list */}
              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Certificate & Letter of Recommendation</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Signed by the Founding Trustees, evaluating your specific field milestones and demonstrated impact.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">1-on-1 Senior Mentorship</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Direct guidance from experienced epidemiologists, medical camp directors, and CSR administrators.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Published Field Reports</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Author community health briefs and case studies eligible for inclusion in our published Annual Impact Report.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Flexible Scheduling</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Options for part-time semester support or full-time immersive summer/winter term internships.</p>
                  </div>
                </div>
              </div>

              {/* Intern Spotlight Card */}
              <div className="p-5 rounded-2xl border border-teal-200/80 bg-linear-to-br from-teal-50/70 to-emerald-50/40">
                <p className="text-xs italic text-teal-900 leading-relaxed mb-3">
                  "Leading the child hygiene baseline survey across 14 rural schools gave me data analysis and leadership skills that helped me secure admission into my Master's in Public Health program."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
                    AB
                  </div>
                  <div>
                    <p className="font-display font-bold text-xs text-slate-900">Ankit Barik</p>
                    <p className="text-[11px] text-teal-700">Former Public Health Intern · Now at AIIMS Bhubaneswar</p>
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
                      Internship Application Received
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                      Thank You for Applying!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                      Your application for the <strong>{formData.area_of_interest}</strong> fellowship has been recorded. Our academic relations team will review your profile and contact you for an interview within <strong>3 business days</strong>.
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
                        href="/about"
                        className="btn btn-primary text-xs w-full sm:w-auto inline-flex items-center justify-center gap-1.5"
                      >
                        Learn About Our Leadership <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          Internship Application Form
                        </h2>
                        <span className="text-xs text-slate-500 hidden sm:inline-block">* Required fields</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Please provide accurate educational background and upload your latest resume.
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
                            placeholder="e.g. Priya Ranjan Das"
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
                            placeholder="priya@university.edu"
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

                      {/* Phone & Education */}
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
                            College / Degree *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.education}
                            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                            placeholder="e.g. MBBS 3rd Year / MSW / B.Sc"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                              fieldErrors.education
                                ? "border-rose-400 focus:ring-rose-200"
                                : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                            }`}
                          />
                          {fieldErrors.education && (
                            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.education[0]}</p>
                          )}
                        </div>
                      </div>

                      {/* Track & Duration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Area of Interest *
                          </label>
                          <select
                            value={formData.area_of_interest}
                            onChange={(e) => setFormData({ ...formData, area_of_interest: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 bg-white"
                          >
                            {TRACKS.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Preferred Duration *
                          </label>
                          <select
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 bg-white"
                          >
                            {DURATIONS.map((d) => (
                              <option key={d.value} value={d.value}>
                                {d.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Resume Upload Box */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Resume / Curriculum Vitae (PDF or DOC, max 5MB)
                        </label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                          className="hidden"
                        />

                        {selectedFile ? (
                          <div className="flex items-center justify-between p-3.5 rounded-xl border border-teal-300 bg-teal-50/70">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0">
                                <FileCheck size={18} />
                              </div>
                              <div className="truncate max-w-xs">
                                <p className="text-xs font-bold text-slate-900 truncate">{selectedFile.name}</p>
                                <p className="text-[11px] text-slate-500">
                                  {(selectedFile.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(null)
                                if (fileInputRef.current) fileInputRef.current.value = ""
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Remove file"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 hover:border-teal-600 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/30"
                          >
                            <UploadCloud size={28} className="mx-auto text-slate-400 mb-2" />
                            <p className="text-xs font-bold text-slate-800">
                              Click to upload or drag & drop your resume
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              PDF, DOC, or DOCX formats accepted up to 5MB
                            </p>
                          </div>
                        )}

                        {fileError && <p className="text-[11px] text-rose-600 mt-1">{fileError}</p>}
                      </div>

                      {/* Statement of Purpose / Message */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Statement of Purpose / Why You Want to Join *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Briefly state your learning goals, career aspirations, and what you hope to contribute to rural communities..."
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
                            <span>Submitting Fellowship Application...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Submit Internship Application</span>
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-slate-500">
                        🔒 Academic and identity credentials are safe and processed according to SCNSWF privacy policy.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Internship FAQ ── */}
      <section className="py-14 bg-white border-t border-slate-200/80">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
              Internship FAQs
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Questions About Our Fellowship Program
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Who is eligible to apply?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Undergraduate, postgraduate, and recent graduates in Medicine, Public Health, Social Work (MSW), Education, Media, Public Policy, and Business Administration are eligible.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Can I earn college credits for this internship?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes. We regularly sign institutional MOUs and provide formal supervisor evaluation reports and attendance logs required by university internship cells.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Are internships full-time or part-time?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Both modes are supported. Summer internships are typically full-time immersion (40 hrs/week), while semester fellowships can be arranged part-time (15–20 hrs/week).
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Is local travel provided during field visits?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes. For all scheduled field medical camps and village research trips, the Foundation arranges group transportation, field logistics, and food provisions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
