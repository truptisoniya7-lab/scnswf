import { useState } from 'react'
import { HelpCircle, Mail, Phone, MapPin, ChevronDown, Send, CheckCircle2 } from 'lucide-react'

interface HelpSupportViewProps {
  onNavigateTab: (tab: string) => void
}

const faqs = [
  {
    q: 'How are my volunteer hours tracked and verified?',
    a: 'Every time you join and attend a registered SCNSWF medical camp or community rally, our field coordinator checks your attendance. Hours are automatically verified and updated in your portal within 24-48 hours of camp completion.',
  },
  {
    q: 'When do I receive my official Certificate of Participation?',
    a: 'Certificates are issued electronically to volunteers who complete at least 15 verified field hours or assist in 2 complete medical check-up drives. You can view and download issued certificates under "My Activities".',
  },
  {
    q: 'How can I organize a free health check-up camp in my local village?',
    a: 'You can request a medical camp by sending an inquiry through the form below or contacting our community coordinator. We require a local venue (e.g., school or panchayat hall) and minimum 10 days notice for doctor scheduling and medicines dispatch.',
  },
  {
    q: 'What should I wear or bring to a medical camp?',
    a: 'Please wear comfortable clothes and walking shoes. Your SCNSWF volunteer badge and cap will be provided at the camp site registration desk on arrival.',
  },
]

export function HelpSupportView({ onNavigateTab: _onNavigateTab }: HelpSupportViewProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setSubject('')
    setMessage('')
    setTimeout(() => setFormSubmitted(false), 5000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#143d2e]">Help & Volunteer Support</h2>
        <p className="text-xs text-[#526058] mt-1">
          Have questions about field camps, logging hours, or certificates? We are here to help.
        </p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#edf3ee] shadow-xs flex items-center gap-3">
          <Phone className="w-8 h-8 text-[#14533d] p-1.5 bg-[#edf7f0] rounded-xl shrink-0" />
          <div className="min-w-0">
            <span className="block text-xs font-bold text-slate-800">Helpline</span>
            <span className="text-[11px] text-slate-500 font-medium truncate">+91 94370 00000</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#edf3ee] shadow-xs flex items-center gap-3">
          <Mail className="w-8 h-8 text-[#14533d] p-1.5 bg-[#edf7f0] rounded-xl shrink-0" />
          <div className="min-w-0">
            <span className="block text-xs font-bold text-slate-800">Volunteer Desk</span>
            <span className="text-[11px] text-slate-500 font-medium truncate">support@scnswf.org</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#edf3ee] shadow-xs flex items-center gap-3">
          <MapPin className="w-8 h-8 text-[#14533d] p-1.5 bg-[#edf7f0] rounded-xl shrink-0" />
          <div className="min-w-0">
            <span className="block text-xs font-bold text-slate-800">Head Office</span>
            <span className="text-[11px] text-slate-500 font-medium truncate">Bhubaneswar, Odisha</span>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 border border-[#edf3ee] shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-[#14533d]" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#14533d]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 py-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Message Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#edf3ee] shadow-xs">
        <h3 className="font-heading font-bold text-base text-slate-900 mb-1">
          Send a Message to Support
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Our team typically responds within 24 hours during working days.
        </p>

        {formSubmitted && (
          <div className="mb-4 p-4 rounded-xl bg-[#edf7f0] border border-[#d6ecdc] flex items-center gap-3 text-xs font-semibold text-[#14533d]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your message has been sent to our volunteer support desk.</span>
          </div>
        )}

        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question regarding camp certificates or hours"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-[#14533d] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your query or request details here..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:bg-white focus:border-[#14533d] outline-hidden resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#124734] hover:bg-[#0c3325] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
