import { useState } from "react"
import {
  Building2,
  Handshake,
  ShieldCheck,
  CheckCircle2,
  FileText,
  HeartPulse,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Calendar,
  Send,
  HelpCircle,
  ArrowRight,
  Phone,
  Mail,
  FileCheck,
} from "lucide-react"
import { submitPartnershipRequest } from "../api/forms"
import type { PartnershipFormData } from "../types"

const PARTNERSHIP_MODELS = [
  {
    type: "CSR Sponsorship & Project Funding",
    icon: Building2,
    badge: "Section 135 Compliant",
    desc: "Co-design auditable, high-impact CSR interventions in maternal-child health, clean water, and rural digital education.",
  },
  {
    type: "Medical Equipment & Diagnostics",
    icon: HeartPulse,
    badge: "Healthcare Relief",
    desc: "Equip mobile medical vans with diagnostic kits, ultrasound units, ECG devices, and chronic medicine supplies.",
  },
  {
    type: "Institutional & University MOU",
    icon: GraduationCap,
    badge: "Academic Alliance",
    desc: "Partner on public health field epidemiology, social work internships, and community development research.",
  },
  {
    type: "In-Kind & Resource Contribution",
    icon: Sparkles,
    badge: "Grassroots Support",
    desc: "Donate school learning kits, winter blankets, relief food supplies, or logistics support for emergency drives.",
  },
]

const PARTNERSHIP_TYPES = [
  "CSR Project Sponsorship",
  "Medical Equipment & Pharmaceuticals",
  "Academic & University Research MOU",
  "Technology & Digital Infrastructure",
  "Disaster Emergency Relief Co-Funding",
  "Other Strategic Collaboration",
]

export default function Partnerships() {
  const [formData, setFormData] = useState<PartnershipFormData>({
    organization_name: "",
    contact_person: "",
    email: "",
    phone: "",
    partnership_type: "CSR Project Sponsorship",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  const validate = (): boolean => {
    const errs: Record<string, string[]> = {}
    if (!formData.organization_name.trim() || formData.organization_name.trim().length < 2) {
      errs.organization_name = ["Please provide your organization or company name."]
    }
    if (!formData.contact_person.trim() || formData.contact_person.trim().length < 2) {
      errs.contact_person = ["Please provide the contact person's name."]
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = ["Please enter a valid official email address."]
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errs.phone = ["Please provide a valid contact number (at least 8 digits)."]
    }
    if (!formData.partnership_type.trim()) {
      errs.partnership_type = ["Please select a partnership category."]
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = ["Please outline your proposed collaboration scope (at least 5 characters)."]
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
      const response = await submitPartnershipRequest(formData)
      setSubmittedRef(response.data.id)
    } catch (err: any) {
      if (err.response?.data?.error) {
        const errorData = err.response.data.error
        setServerError(errorData.message || "Failed to submit partnership request. Please review the form.")
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
      organization_name: "",
      contact_person: "",
      email: "",
      phone: "",
      partnership_type: "CSR Project Sponsorship",
      message: "",
    })
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
              <Handshake size={15} className="text-amber-300" />
              <span>Institutional Alliances · CSR Co-Creation</span>
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
              Partner With Us to Scale <br />
              <span className="text-gradient">Measurable Grassroots Impact.</span>
            </h1>

            <p className="text-base sm:text-lg text-teal-100/90 font-normal leading-relaxed mb-8">
              We collaborate with forward-thinking corporations, government health missions, foundations, and universities to deliver scalable, transparent, and audited social welfare programs across Eastern India.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-teal-200/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Section 80G Tax Exemption (50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>Section 135 CSR Audited Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>MCA CSR-1 Registered</span>
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

      {/* ── Compliance Badges Bar ── */}
      <section className="bg-slate-50 border-b border-slate-200/80 py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-slate-900 text-sm">80G & 12A Certified</p>
                <p className="text-[11px] text-slate-500">Income Tax Exemption</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <FileCheck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-slate-900 text-sm">Section 8 Registered</p>
                <p className="text-[11px] text-slate-500">ROC Cuttack, MCA</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-slate-900 text-sm">CSR-1 Compliant</p>
                <p className="text-[11px] text-slate-500">Govt of India Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/70 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-slate-900 text-sm">Audited Financials</p>
                <p className="text-[11px] text-slate-500">Transparent Annual Audits</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partnership Models Grid ── */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/80 inline-block mb-2">
              Collaborative Frameworks
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ways to Partner with the Foundation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              We customize engagement models to match your corporate CSR mandate, institutional goals, or resource strengths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PARTNERSHIP_MODELS.map((model) => {
              const Icon = model.icon
              return (
                <div
                  key={model.type}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900">
                        {model.badge}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-sm text-slate-900 mb-2">
                      {model.type}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {model.desc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, partnership_type: model.type }))}
                    className="mt-4 text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
                  >
                    Select this model <ArrowRight size={12} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Main Section: Form & Direct Contact ── */}
      <section className="py-14 md:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 max-w-6xl mx-auto">
            {/* Left Column: Partnership Assurance & Contacts */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-100/80 inline-block mb-3">
                  Corporate Engagement
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Transparent Reporting & Measurable Metrics
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every partnership is governed by clear milestone agreements, quarterly visual impact documentation, and third-party financial audits to satisfy the strictest corporate compliance standards.
                </p>
              </div>

              {/* Assurances list */}
              <div className="space-y-3.5">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-600/10 text-teal-700 flex items-center justify-center shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Customized CSR Proposals</h3>
                    <p className="text-xs text-slate-600 mt-0.5">We prepare data-backed project proposals aligned with Schedule VII of the Companies Act.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Field Monitoring & Co-Branding</h3>
                    <p className="text-xs text-slate-600 mt-0.5">Corporate employee volunteer days, co-branded mobile vans, and live field visit protocols.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900">Dedicated Relationship Manager</h3>
                    <p className="text-xs text-slate-600 mt-0.5">A single point of contact from our senior leadership team ensures smooth execution and reporting.</p>
                  </div>
                </div>
              </div>

              {/* Direct Secretariat Contact Card */}
              <div className="p-5 rounded-2xl border border-teal-200/80 bg-linear-to-br from-teal-50/70 to-emerald-50/40">
                <h3 className="font-display font-bold text-sm text-teal-950 mb-2">
                  Prefer a Direct Confidential Discussion?
                </h3>
                <p className="text-xs text-teal-900/90 leading-relaxed mb-4">
                  For large-scale CSR allocations, institutional MOUs, or government programs, reach our leadership secretariat directly:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-teal-900">
                    <Mail size={14} className="text-teal-700" />
                    <span>partnerships@scnswf.org</span>
                  </div>
                  <div className="flex items-center gap-2 text-teal-900">
                    <Phone size={14} className="text-teal-700" />
                    <span>+91 7327 094 576 (Ext. Partnerships)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Partnership Request Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm relative">
                {submittedRef ? (
                  /* Success View */
                  <div className="text-center py-8 px-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
                      <ShieldCheck size={36} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-emerald-800 bg-emerald-50 inline-block mb-3">
                      Partnership Proposal Received
                    </span>
                    <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                      Thank You for Reaching Out!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
                      Your partnership inquiry for <strong>{formData.organization_name}</strong> has been forwarded to our Executive Director. A partnership manager will reach out within <strong>24 to 48 hours</strong> with preliminary project details.
                    </p>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-sm mx-auto mb-6 text-left">
                      <p className="text-xs text-slate-500 mb-1">Partnership Inquiry Reference:</p>
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
                        Submit Another Inquiry
                      </button>
                      <a
                        href="/programs"
                        className="btn btn-primary text-xs w-full sm:w-auto inline-flex items-center justify-center gap-1.5"
                      >
                        Review Active CSR Programs <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Form View */
                  <>
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-4">
                        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          Partnership Inquiry Form
                        </h2>
                        <span className="text-xs text-slate-500 hidden sm:inline-block">* Required fields</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        Please provide basic corporate or institutional details. We treat all discussions with strict confidentiality.
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
                      {/* Org Name & Contact Person */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Organization / Corporate Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.organization_name}
                            onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                            placeholder="e.g. Tata Steel Foundation / XYZ Ltd"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                              fieldErrors.organization_name
                                ? "border-rose-400 focus:ring-rose-200"
                                : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                            }`}
                          />
                          {fieldErrors.organization_name && (
                            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.organization_name[0]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Contact Person & Designation *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.contact_person}
                            onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                            placeholder="e.g. Rajesh Mohanty (CSR Head)"
                            className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                              fieldErrors.contact_person
                                ? "border-rose-400 focus:ring-rose-200"
                                : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                            }`}
                          />
                          {fieldErrors.contact_person && (
                            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.contact_person[0]}</p>
                          )}
                        </div>
                      </div>

                      {/* Official Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Official Email *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="csr@organization.com"
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

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Official Phone / Mobile *
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
                      </div>

                      {/* Partnership Type */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Partnership Category *
                        </label>
                        <select
                          value={formData.partnership_type}
                          onChange={(e) => setFormData({ ...formData, partnership_type: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 bg-white"
                        >
                          {PARTNERSHIP_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Message / Proposed Scope */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Proposed Collaboration Scope & Geographic Focus *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder="Please describe your company's CSR priorities, target thematic area (healthcare, education, relief), budget allocation window, or preferred target districts..."
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
                            <span>Transmitting Partnership Proposal...</span>
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            <span>Submit Partnership Inquiry</span>
                          </>
                        )}
                      </button>

                      <p className="text-center text-[11px] text-slate-500">
                        🔒 All inquiries are governed under standard non-disclosure practices and handled by our Senior Executive Committee.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Partner FAQ ── */}
      <section className="py-14 bg-white border-t border-slate-200/80">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
              Partnership FAQs
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Corporate & Institutional Collaboration Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Are donations eligible for CSR credit under Section 135?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Yes. SCNSWF is registered with the Ministry of Corporate Affairs (MCA Form CSR-1) as an eligible implementing agency for Schedule VII CSR activities.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                What tax deduction certificates are issued?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All donations are eligible for a 50% tax deduction under Section 80G of the Indian Income Tax Act. We provide immediate 80G receipts and Form 10BD filings.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                Can our corporate employees participate on-site?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Absolutely. We organize structured Employee Engagement Days where your staff can assist doctors in health camps, plant trees, or mentor village children.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h3 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                <HelpCircle size={16} className="text-teal-700 shrink-0" />
                How frequently are impact progress reports shared?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                For active project partnerships, we provide monthly photographic updates, quarterly quantitative KPI audits, and an annual audited project completion dossier.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
