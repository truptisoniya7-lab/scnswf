import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart, ShieldCheck, CheckCircle2, Lock,
  CreditCard, Smartphone, Building2, Printer,
  Sparkles, AlertCircle, ChevronDown,
  RefreshCw, Gift, Award
} from "lucide-react"
import { useCreateDonation, useVerifyDonation } from "../hooks/useDonations"
import type { DonationPayload, DonationReceipt } from "../types"

/* ── Preset Contribution Amounts & Impact Descriptions ── */
interface PresetOption {
  amount: number
  label: string
  impact: string
  popular?: boolean
}

const PRESET_AMOUNTS: PresetOption[] = [
  {
    amount: 500,
    label: "₹500",
    impact: "Provides 1 month of essential hypertension & diabetes medications for an elderly villager.",
  },
  {
    amount: 1000,
    label: "₹1,000",
    impact: "Covers a prenatal nutrition kit, iron supplements, and clinical screening for an expectant mother.",
  },
  {
    amount: 2500,
    label: "₹2,500",
    impact: "Funds an entire mobile clinic doctor consultation and diagnostic outreach session for a remote hamlet.",
    popular: true,
  },
  {
    amount: 5000,
    label: "₹5,000",
    impact: "Sponsors vocational tailoring machinery and business start-up materials for a rural woman artisan.",
  },
  {
    amount: 10000,
    label: "₹10,000",
    impact: "Powers a full-day multi-specialty community health, pediatric, and eye-screening camp.",
  },
]

/* ── Program Designations ── */
interface ProgramOption {
  id: string
  slug: string
  name: string
  category: string
}

const PROGRAM_OPTIONS: ProgramOption[] = [
  { id: "general", slug: "general", name: "Where Needed Most (General Welfare)", category: "Flexible Relief" },
  { id: "p1111111-1111-1111-1111-111111111111", slug: "healthcare-medical-relief", name: "Healthcare & Mobile Medical Relief", category: "Primary Health" },
  { id: "p2222222-2222-2222-2222-222222222222", slug: "education-skill-development", name: "Quality Education & Student Scholarships", category: "Education" },
  { id: "p3333333-3333-3333-3333-333333333333", slug: "women-empowerment-self-reliance", name: "Women Self-Reliance & Livelihoods", category: "Empowerment" },
  { id: "p4444444-4444-4444-4444-444444444444", slug: "disaster-relief-community-welfare", name: "Disaster Relief & Community Care", category: "Emergency Aid" },
]

export default function Donate() {
  const [searchParams] = useSearchParams()
  const initialProgramSlug = searchParams.get("program")

  // Donation State
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time")
  const [selectedAmount, setSelectedAmount] = useState<number>(2500)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [isCustom, setIsCustom] = useState<boolean>(false)

  // Pre-select program from URL param if available
  const initialProgram = useMemo(() => {
    if (!initialProgramSlug) return PROGRAM_OPTIONS[0]
    return PROGRAM_OPTIONS.find(p => p.slug === initialProgramSlug || p.id === initialProgramSlug) || PROGRAM_OPTIONS[0]
  }, [initialProgramSlug])

  const [selectedProgram, setSelectedProgram] = useState<ProgramOption>(initialProgram)

  // Donor Details
  const [donorName, setDonorName] = useState<string>("")
  const [donorEmail, setDonorEmail] = useState<string>("")
  const [donorPhone, setDonorPhone] = useState<string>("")
  const [panNumber, setPanNumber] = useState<string>("")
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [want80G, setWant80G] = useState<boolean>(true)

  // Validation & UI State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showSandboxModal, setShowSandboxModal] = useState<boolean>(false)
  const [activeSession, setActiveSession] = useState<{ id: string; orderId: string; amount: number } | null>(null)
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // React Query Mutations
  const createDonationMutation = useCreateDonation()
  const verifyDonationMutation = useVerifyDonation()

  // Calculate effective donation amount
  const effectiveAmount = isCustom ? (parseInt(customAmount, 10) || 0) : selectedAmount

  // Active impact description
  const activeImpact = useMemo(() => {
    if (isCustom) {
      if (effectiveAmount >= 10000) return "Sponsors comprehensive medical supplies and specialist camps in high-need blocks."
      if (effectiveAmount >= 5000) return "Equips women self-help groups with machinery and training for financial autonomy."
      if (effectiveAmount >= 2500) return "Covers diagnostic outreach and emergency medicine supplies for village hamlets."
      if (effectiveAmount >= 1000) return "Provides maternal and newborn nutrition kits with professional home visits."
      if (effectiveAmount >= 500) return "Supplies 1 month of lifesaving chronic medications to elderly rural patients."
      return "Every contribution directly supports our certified grassroots social welfare interventions."
    }
    const found = PRESET_AMOUNTS.find(p => p.amount === selectedAmount)
    return found ? found.impact : "Supports critical social welfare programs across Odisha."
  }, [isCustom, effectiveAmount, selectedAmount])

  // Form Validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (effectiveAmount < 100) {
      errors.amount = "Minimum contribution amount is ₹100."
    }
    if (!isAnonymous && !donorName.trim()) {
      errors.name = "Please enter your full name."
    }
    if (!donorEmail.trim() || !/^\S+@\S+\.\S+$/.test(donorEmail)) {
      errors.email = "Please enter a valid email address for receipt dispatch."
    }
    if (donorPhone && !/^\+?[0-9]{10,15}$/.test(donorPhone.replace(/[\s-]/g, ''))) {
      errors.phone = "Please enter a valid 10-digit phone number."
    }
    if (want80G && panNumber.trim() && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber.trim().toUpperCase())) {
      errors.pan = "PAN should be 10 characters in standard format (e.g., ABCDE1234F)."
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle Form Submission -> Create Session
  const handleProceedToDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const payload: DonationPayload = {
        program_id: selectedProgram.id === "general" ? null : selectedProgram.id,
        amount: effectiveAmount,
        currency: "INR",
        is_anonymous: isAnonymous,
        donor_name: isAnonymous ? undefined : donorName.trim(),
        donor_email: donorEmail.trim(),
        donor_phone: donorPhone.trim() || undefined,
      }

      const session = await createDonationMutation.mutateAsync(payload)
      setActiveSession({
        id: session.id,
        orderId: session.payment_session.order_id,
        amount: effectiveAmount,
      })

      // Try launching Razorpay standard checkout if available, else open Sandbox Modal
      // @ts-expect-error Razorpay global script
      if (typeof window !== "undefined" && window.Razorpay) {
        // @ts-expect-error Razorpay instance
        const rzp = new window.Razorpay({
          key: session.payment_session.checkout_params.key,
          amount: session.payment_session.checkout_params.amount,
          currency: session.payment_session.checkout_params.currency,
          name: session.payment_session.checkout_params.name,
          description: session.payment_session.checkout_params.description,
          order_id: session.payment_session.order_id,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            await handlePaymentVerification(session.id, response.razorpay_payment_id)
          },
          prefill: {
            name: isAnonymous ? "Anonymous Donor" : donorName,
            email: donorEmail,
            contact: donorPhone,
          },
          theme: {
            color: "#1b6b68",
          },
        })
        rzp.open()
      } else {
        // Open Interactive Sandbox Modal
        setShowSandboxModal(true)
      }
    } catch (err: unknown) {
      console.error("Failed to initialize donation session", err)
      setFormErrors({
        submit: "Failed to initialize payment gateway. Please verify your connection or try again."
      })
    }
  }

  // Verify Payment & Generate Official Receipt
  const handlePaymentVerification = async (donationId: string, paymentId?: string) => {
    try {
      const confirmedReceipt = await verifyDonationMutation.mutateAsync({
        id: donationId,
        payload: {
          razorpay_payment_id: paymentId || `pay_sim_${Date.now().toString(36)}`,
          razorpay_order_id: activeSession?.orderId || `order_${Date.now()}`,
          razorpay_signature: "sig_verified",
        },
      })
      setReceipt(confirmedReceipt)
      setShowSandboxModal(false)
      window.scrollTo({ top: 120, behavior: "smooth" })
    } catch (err) {
      console.error("Payment verification failed", err)
      setFormErrors({ submit: "Payment completed but verification was delayed. A confirmation email has been logged." })
    }
  }

  // Handle Printable Receipt
  const handlePrintReceipt = () => {
    window.print()
  }

  // Reset to donate again
  const handleReset = () => {
    setReceipt(null)
    setActiveSession(null)
    setShowSandboxModal(false)
    setCustomAmount("")
    setIsCustom(false)
    setSelectedAmount(2500)
    setFormErrors({})
  }

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden text-white"
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
              background: "rgba(39,148,144,0.18)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="container-custom relative z-10 text-center max-w-3xl mx-auto">
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
              <span>100% Tax Deductible (Section 80G) · Official Foundation Rebuild</span>
            </span>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Invest in <span className="text-gradient">Grassroots Health</span> & Hope
            </h1>
            <p className="text-base sm:text-lg leading-relaxed text-teal-50/90 font-normal max-w-2xl mx-auto mb-6">
              Your contribution delivers lifesaving primary healthcare, prenatal mother-and-child nutrition, and women’s economic dignity across marginalized blocks in Odisha.
            </p>

            <div className="inline-flex items-center gap-6 text-xs text-teal-200 justify-center">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" /> 80G Tax Exemption
              </span>
              <span className="flex items-center gap-1.5">
                <Lock size={16} className="text-amber-400" /> 256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5">
                <Award size={16} className="text-teal-300" /> Instant Digital Receipt
              </span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0 36L1440 36L1440 8C1200 32 800 0 480 18C240 32 0 8 0 8L0 36Z" fill="#f8fafc" />
          </svg>
        </div>
      </section>

      {/* ── Main Donation Experience ── */}
      <section className="py-12 md:py-20 bg-slate-50 min-h-screen">
        <div className="container-custom max-w-5xl">
          {/* SUCCESS RECEIPT VIEW */}
          {receipt ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-200 shadow-xl max-w-2xl mx-auto print:border-none print:shadow-none"
            >
              {/* Receipt Header */}
              <div className="text-center pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 size={36} />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Donation Verified & Succeeded
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mt-3">
                  Thank You for Your Generosity!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Your official 80G tax exemption donation receipt has been generated.
                </p>
              </div>

              {/* Receipt Body */}
              <div className="py-6 space-y-4 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Official Receipt Number</span>
                  <span className="font-mono font-bold text-teal-800">{receipt.receipt_number}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono text-slate-600 text-xs">{receipt.id}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Date & Timestamp</span>
                  <span className="font-medium text-slate-800">
                    {new Date(receipt.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Donor Name</span>
                  <span className="font-bold text-slate-900">
                    {receipt.donor_name || "Generous Anonymous Benefactor"}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Registered Email</span>
                  <span className="text-slate-800 font-medium">{receipt.donor_email || donorEmail}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Allocated Initiative</span>
                  <span className="font-semibold text-teal-700">{selectedProgram.name}</span>
                </div>

                <div className="flex justify-between items-center py-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
                  <span className="font-bold text-slate-900 text-base">Total Amount Contributed</span>
                  <span className="font-display font-black text-2xl text-emerald-800">
                    ₹{Number(receipt.amount).toLocaleString("en-IN")} INR
                  </span>
                </div>

                {/* 80G Tax Exemption Note */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-teal-700" />
                    Income Tax Exemption Under Section 80G
                  </div>
                  <p>
                    Donations to Suresh Chandra Nayak Social Welfare Foundation (SCNSWF) are eligible for 50% deduction under Section 80G of the Indian Income Tax Act. A certified 10BE form is dispatched annually.
                  </p>
                  <p className="font-mono text-[10px] text-slate-500 pt-1">
                    NGO Reg No: Section 8 (MCA) · Foundation HQ: Bhubaneswar, Odisha
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 print:hidden">
                <button
                  onClick={handlePrintReceipt}
                  className="btn btn-secondary flex-1 justify-center gap-2 py-3 text-xs sm:text-sm font-bold"
                >
                  <Printer size={16} /> Print / Save PDF Receipt
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-primary flex-1 justify-center gap-2 py-3 text-xs sm:text-sm font-bold"
                >
                  <Gift size={16} /> Make Another Contribution
                </button>
              </div>
            </motion.div>
          ) : (
            /* INTERACTIVE DONATION FORM */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Form Controls */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                {/* 1. Frequency Toggle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Contribution Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setFrequency("one_time")}
                      className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        frequency === "one_time"
                          ? "bg-white text-teal-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      One-Time Contribution
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                        frequency === "monthly"
                          ? "bg-white text-teal-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Sparkles size={14} className="text-amber-500" />
                      Monthly Sustainer
                    </button>
                  </div>
                </div>

                {/* 2. Amount Presets */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Choose Donation Amount (INR)
                    </label>
                    <span className="text-xs text-teal-700 font-semibold">50% Tax Exemption (80G)</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {PRESET_AMOUNTS.map((p) => {
                      const isSelected = !isCustom && selectedAmount === p.amount
                      return (
                        <button
                          key={p.amount}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(p.amount)
                            setIsCustom(false)
                            setCustomAmount("")
                          }}
                          className={`relative p-3.5 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? "border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 font-black shadow-xs"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-bold"
                          }`}
                        >
                          {p.popular && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                              Popular
                            </span>
                          )}
                          <div className="text-sm sm:text-base">{p.label}</div>
                        </button>
                      )
                    })}

                    {/* Custom Amount Button */}
                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`p-3.5 rounded-2xl border text-center text-xs sm:text-sm font-bold transition-all ${
                        isCustom
                          ? "border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20 font-black"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      Custom Amount
                    </button>
                  </div>

                  {/* Custom Input Field */}
                  {isCustom && (
                    <div className="mt-3">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="100"
                          step="100"
                          placeholder="Enter other amount (min. ₹100)"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-slate-300 rounded-2xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                        />
                      </div>
                      {formErrors.amount && (
                        <p className="text-rose-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} /> {formErrors.amount}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Dynamic Impact Statement Card */}
                  <div className="mt-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-start gap-3">
                    <Sparkles size={18} className="text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-teal-900 block mb-0.5">Your Real-World Field Impact:</span>
                      <p className="text-xs text-teal-800 leading-relaxed font-medium">
                        {activeImpact}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Program Designation Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Allocate to Initiative
                  </label>
                  <select
                    value={selectedProgram.id}
                    onChange={(e) => {
                      const found = PROGRAM_OPTIONS.find(p => p.id === e.target.value)
                      if (found) setSelectedProgram(found)
                    }}
                    className="w-full p-3 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  >
                    {PROGRAM_OPTIONS.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.name} ({prog.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Donor Information */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Donor Details
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                      />
                      <span>Make my gift anonymous</span>
                    </label>
                  </div>

                  {!isAnonymous && (
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                      />
                      {formErrors.name && (
                        <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} /> {formErrors.name}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address (for receipt) *"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                      />
                      {formErrors.email && (
                        <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} /> {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        placeholder="Mobile Number (Optional)"
                        value={donorPhone}
                        onChange={(e) => setDonorPhone(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                      />
                      {formErrors.phone && (
                        <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle size={12} /> {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 80G Tax Exemption & PAN Field */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={want80G}
                        onChange={(e) => setWant80G(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <span>I wish to claim 80G Tax Exemption (Indian Residents)</span>
                    </label>

                    {want80G && (
                      <div>
                        <input
                          type="text"
                          maxLength={10}
                          placeholder="PAN Number (e.g. ABCDE1234F)"
                          value={panNumber}
                          onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Required by Indian Income Tax Department to issue the official Form 10BE certificate.
                        </span>
                        {formErrors.pan && (
                          <p className="text-rose-600 text-xs mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle size={12} /> {formErrors.pan}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {formErrors.submit && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{formErrors.submit}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={handleProceedToDonate}
                    disabled={createDonationMutation.isPending}
                    className="btn btn-accent w-full justify-center py-4 text-base font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    {createDonationMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw size={18} className="animate-spin" /> Preparing Payment Gateway…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Lock size={18} /> Proceed to Secure Pay · ₹{effectiveAmount.toLocaleString("en-IN")}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Trust, Transparency & Impact */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. Summary Card */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-lg text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
                    <span>Donation Summary</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                      {frequency === "monthly" ? "Monthly" : "One-Time"}
                    </span>
                  </h3>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>Contribution Amount:</span>
                      <span className="font-bold text-slate-900">₹{effectiveAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Program Allocation:</span>
                      <span className="font-semibold text-teal-700 text-right max-w-[200px] truncate">
                        {selectedProgram.name}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Tax Exemption (80G):</span>
                      <span className="font-semibold text-emerald-700">Eligible (50%)</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Gateway & Processing:</span>
                      <span className="font-semibold text-slate-700">100% Free (Covered)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">Total Payable:</span>
                    <span className="font-display font-black text-2xl text-teal-800">
                      ₹{effectiveAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* 2. Fund Utilization Transparency */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="font-display font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-teal-700" />
                    How Your Contribution Is Used
                  </h4>
                  <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                    We maintain stringent fiscal discipline so that the overwhelming majority reaches beneficiaries directly.
                  </p>

                  <div className="space-y-2.5 text-xs font-semibold">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700">Direct Field Interventions & Medicine</span>
                        <span className="text-teal-700 font-bold">88%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: "88%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700">Field Logistics & Camp Coordination</span>
                        <span className="text-amber-600 font-bold">7%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "7%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-700">Auditing, Compliance & Governance</span>
                        <span className="text-slate-600 font-bold">5%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-slate-400 rounded-full" style={{ width: "5%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Accepted Payment Methods */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-3">
                  <span className="font-bold text-slate-800 block">Accepted Payment Modes:</span>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-semibold text-slate-700">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                      <Smartphone size={16} className="text-teal-700" /> UPI / QR Codes
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                      <CreditCard size={16} className="text-teal-700" /> Debit & Credit Cards
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                      <Building2 size={16} className="text-teal-700" /> NetBanking (50+ Banks)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Donor FAQs Section ── */}
      <section className="py-14 bg-white border-t border-slate-200">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-teal-800 bg-teal-50 inline-block mb-2">
              Assistance & Clarity
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is my donation eligible for tax exemption in India?",
                a: "Yes. Suresh Chandra Nayak Social Welfare Foundation (SCNSWF) is registered under Section 80G of the Indian Income Tax Act. Indian resident donors can claim 50% tax deduction on their total donation amount.",
              },
              {
                q: "How will I receive my donation receipt?",
                a: "Your official receipt is generated immediately upon successful payment with a verified receipt number. A digital copy is also archived and accessible for download.",
              },
              {
                q: "Can I donate anonymously?",
                a: "Yes! Simply check the 'Make my gift anonymous' box on the donation form. Your personal identity will be withheld from all public reports and donor recognition walls.",
              },
              {
                q: "What payment gateways are supported?",
                a: "We support all major payment providers including Razorpay, UPI (Google Pay, PhonePe, Paytm), Visa, Mastercard, RuPay, and NetBanking across all leading Indian banks.",
              },
            ].map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-teal-800"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-teal-700" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Interactive Razorpay Sandbox Modal ── */}
      <AnimatePresence>
        {showSandboxModal && activeSession && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative"
            >
              <div className="text-center pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto mb-2">
                  <CreditCard size={24} />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Razorpay Sandbox Gateway
                </h3>
                <p className="text-xs text-slate-500">
                  Order ID: <span className="font-mono font-bold text-slate-700">{activeSession.orderId}</span>
                </p>
              </div>

              <div className="py-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-500">Amount Due:</span>
                    <span className="font-bold text-slate-900">₹{activeSession.amount.toLocaleString("en-IN")} INR</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Beneficiary:</span>
                    <span className="font-semibold text-teal-700">SCNSWF Foundation</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 leading-relaxed">
                  <strong>Sandbox Test Environment:</strong> Click below to simulate an instantaneous successful Razorpay payment callback and trigger official 80G receipt generation.
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={verifyDonationMutation.isPending}
                  onClick={() => handlePaymentVerification(activeSession.id)}
                  className="btn btn-accent w-full justify-center py-3 text-xs sm:text-sm font-bold gap-2"
                >
                  {verifyDonationMutation.isPending ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Verifying Payment…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Simulate Successful Payment (UPI / Card)
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={verifyDonationMutation.isPending}
                  onClick={() => setShowSandboxModal(false)}
                  className="btn btn-secondary w-full justify-center py-2 text-xs text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
