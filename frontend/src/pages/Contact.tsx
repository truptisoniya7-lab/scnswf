import { useState } from "react"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ShieldCheck,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { submitContactForm } from "../api/forms"
import type { ContactFormData } from "../types"

export default function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
    newsletter_subscription: true,
  })

  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)

  const validate = (): boolean => {
    const errs: Record<string, string[]> = {}
    if (!formData.first_name.trim()) {
      errs.first_name = ["First name is required."]
    }
    if (!formData.last_name.trim()) {
      errs.last_name = ["Last name is required."]
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = ["Please enter a valid email address."]
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errs.phone = ["Please provide a valid phone number (at least 8 digits)."]
    }
    if (!formData.subject.trim()) {
      errs.subject = ["Please select or enter an inquiry subject."]
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = ["Message must be at least 5 characters long."]
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
      const response = await submitContactForm(formData)
      setSubmittedRef(response.data.id)
    } catch (err: any) {
      if (err.response?.data?.error) {
        const errorData = err.response.data.error
        setServerError(errorData.message || "Failed to submit message. Please check the fields.")
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
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      subject: "General Inquiry",
      message: "",
      newsletter_subscription: true,
    })
    setSubmittedRef(null)
    setServerError(null)
    setFieldErrors({})
  }

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden"
        style={{ background: "linear-gradient(155deg, #0a1f1e 0%, #134a48 50%, #1b6b68 90%)" }}
      >
        <div className="container-custom relative z-10 text-white">
          <span
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold mb-4 px-3.5 py-1.5 rounded-full border shadow-sm"
            style={{
              background: "rgba(255,255,255,0.08)",
              borderColor: "rgba(255,255,255,0.18)",
              color: "#9de4e3",
            }}
          >
            <MapPin size={14} className="text-amber-300" />
            <span>Headquarters · Bhubaneswar, Odisha</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-4">
            Contact <span className="text-gradient">Our Team</span>
          </h1>
          <p className="text-base sm:text-lg max-w-2xl text-teal-100 font-normal leading-relaxed">
            Reach out for program inquiries, volunteer coordination, donor receipts, or partnership discussions. We are here to help.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* ── Main Contact Details & Form ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
            {/* Left Column: Official Contact Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-3">
                  Registered Office
                </span>
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">
                  Suresh Chandra Nayak Social Welfare Foundation
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Incorporated under Section 8 of the Companies Act, 2013 (Non-Profit). Registered with the Registrar of Companies (ROC), Cuttack.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 mb-1">Official Address</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      HIG-161, Kanan Vihar, Phase 1, Chandrasekharpur, Patia, Bhubaneswar, Odisha 751024, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 mb-1">Phone Number</h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      <a href="tel:+917327094576" className="hover:text-teal-700 font-semibold transition-colors">
                        +91 7327 094 576
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 mb-1">Official Email</h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      <a href="mailto:contact@scnswf.org" className="hover:text-teal-700 font-semibold transition-colors">
                        contact@scnswf.org
                      </a>
                      {" · "}
                      <a href="mailto:info@scnswf.org" className="hover:text-teal-700 transition-colors">
                        info@scnswf.org
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-800 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 mb-1">Office Hours</h3>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Monday – Saturday: 9:30 AM – 6:00 PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* LinkedIn Banner */}
              <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-teal-700 shrink-0" />
                  <span className="text-xs font-semibold text-teal-950">Official LinkedIn Organization</span>
                </div>
                <a
                  href="https://www.linkedin.com/company/scnswf/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900"
                >
                  Visit Profile <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
                <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Please fill out the form below. A member of our foundation team will respond within 2 business days.
                </p>

                {serverError && (
                  <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
                    <AlertCircle size={18} className="shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <p className="font-bold">Submission failed</p>
                      <p className="mt-0.5">{serverError}</p>
                    </div>
                  </div>
                )}

                {submittedRef ? (
                  <div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-center animate-fade-in">
                    <ShieldCheck size={36} className="text-teal-700 mx-auto mb-3" />
                    <h4 className="font-display font-bold text-lg text-teal-950 mb-1">
                      Message Received Successfully
                    </h4>
                    <p className="text-xs sm:text-sm text-teal-800 leading-relaxed mb-4">
                      Thank you for contacting Suresh Chandra Nayak Social Welfare Foundation. Your message has been logged in our secure system.
                    </p>

                    <div className="p-3.5 rounded-xl bg-white border border-teal-200/80 max-w-xs mx-auto mb-5 text-left">
                      <p className="text-[11px] text-slate-500">Inquiry Reference ID:</p>
                      <p className="font-mono text-xs font-bold text-teal-900 break-all">{submittedRef}</p>
                    </div>

                    <button
                      onClick={resetForm}
                      className="btn btn-primary text-xs"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          placeholder="First Name"
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.first_name
                              ? "border-rose-400 focus:ring-rose-200"
                              : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                          }`}
                        />
                        {fieldErrors.first_name && (
                          <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.first_name[0]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          placeholder="Last Name"
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                            fieldErrors.last_name
                              ? "border-rose-400 focus:ring-rose-200"
                              : "border-slate-300 focus:ring-teal-600/30 focus:border-teal-700"
                          }`}
                        />
                        {fieldErrors.last_name && (
                          <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.last_name[0]}</p>
                        )}
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@domain.com"
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
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Inquiry Subject *
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-700 bg-white"
                      >
                        <option value="General Inquiry">General Foundation Inquiry</option>
                        <option value="Mobile Medical Units">Mobile Medical Units Information</option>
                        <option value="Volunteer Coordination">Volunteer Coordination</option>
                        <option value="CSR & Partnership">CSR & Institutional Partnership</option>
                        <option value="Donation & 80G Receipt">Donation & Section 80G Receipt</option>
                        <option value="Media & Press">Media & Press Relations</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please write your inquiry or message here..."
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

                    {/* Newsletter Subscription Checkbox */}
                    <div className="flex items-center gap-2 pt-1 pb-2">
                      <input
                        type="checkbox"
                        id="newsletter_sub"
                        checked={formData.newsletter_subscription}
                        onChange={(e) =>
                          setFormData({ ...formData, newsletter_subscription: e.target.checked })
                        }
                        className="rounded border-slate-300 text-teal-700 focus:ring-teal-600 h-4 w-4"
                      />
                      <label htmlFor="newsletter_sub" className="text-xs text-slate-600 cursor-pointer">
                        Subscribe to our quarterly newsletter for health camp schedules and impact reports.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full py-3 inline-flex items-center justify-center gap-2 text-sm font-bold shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
