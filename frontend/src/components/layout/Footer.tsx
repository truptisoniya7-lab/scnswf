import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  FileText,
  Send,
  CheckCircle,
} from 'lucide-react'
import Button from '../ui/Button'

const PROGRAMS_LINKS = [
  { label: 'Mobile Health Units', to: '/programs/mobile-health-units' },
  { label: 'Maternal & Child Health', to: '/programs/maternal-child-health' },
  { label: 'Skill Development & Livelihood', to: '/programs/skill-development' },
  { label: 'Clean Water & Sanitation', to: '/programs/clean-water-sanitation' },
  { label: 'Geriatric & Palliative Care', to: '/programs' },
]

const ORG_LINKS = [
  { label: 'About SCNSWF', to: '/about' },
  { label: 'Our Healthcare Impact', to: '/impact' },
  { label: 'Field Stories & Updates', to: '/stories' },
  { label: 'Media & Photo Gallery', to: '/gallery' },
  { label: 'Annual Reports & Audits', to: '/impact' },
]

const GET_INVOLVED_LINKS = [
  { label: 'Make a Tax-Deductible Donation', to: '/donate' },
  { label: 'Volunteer in Odisha', to: '/get-involved/volunteer' },
  { label: 'Medical & Social Internships', to: '/get-involved/internship' },
  { label: 'CSR Partnerships', to: '/get-involved/partner' },
  { label: 'Contact Our Team', to: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Donation Refund Policy', to: '/refund-policy' },
  { label: 'Statutory Disclaimer', to: '/disclaimer' },
]

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setSubscribed(true)
      setNewsletterEmail('')
    }
  }

  return (
    <footer className="bg-[#051b14] text-slate-300 border-t border-[#0f4737]/60 selection:bg-[#105e49] selection:text-white">
      {/* Upper Trust Strip */}
      <div className="border-b border-[#0f4737]/40 bg-[#082e23]/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-medium">
              <ShieldCheck className="w-5 h-5 text-[#55d5b3]" />
              <span>Section 8 Non-Profit (Govt. of India)</span>
            </span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-medium">
              <Award className="w-5 h-5 text-[#55d5b3]" />
              <span>100% Tax Exemption Eligible (80G & 12A)</span>
            </span>
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-medium">
              <FileText className="w-5 h-5 text-[#55d5b3]" />
              <span>Transparent Public Financials</span>
            </span>
          </div>

          <Link
            to="/donate"
            className="text-xs sm:text-sm font-semibold text-[#55d5b3] hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>Support Healthcare in Odisha</span>
            <Heart className="w-3.5 h-3.5 fill-[#db6424] text-[#db6424]" />
          </Link>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Mission column */}
          <div className="lg:col-span-4 flex flex-col">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img
                src="/images/about/scnswf-logo.png"
                alt="SCNSWF Logo"
                className="w-11 h-11 rounded-xl object-contain bg-white p-1 border border-[#0f4737]"
              />
              <div>
                <span className="font-heading font-extrabold text-2xl text-white tracking-tight leading-none block">
                  SCNSWF
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mt-0.5">
                  Suresh Chandra Nayak Social Welfare Foundation
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-6 font-sans">
              Dedicated to delivering accessible primary healthcare, maternal wellness, clean water,
              and sustainable livelihood to remote and underserved communities across Odisha.
            </p>

            {/* Newsletter Subscription */}
            <div className="bg-[#082e23] border border-[#0f4737] rounded-2xl p-4 mb-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1.5">
                Odisha Impact Dispatch
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Receive quarterly medical camp reports and verified impact summaries.
              </p>

              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-[#55d5b3] font-medium py-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Thank you! You are subscribed to our updates.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-[#051b14] border border-[#0f4737] rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 flex-1 outline-none focus:border-[#55d5b3]"
                  />
                  <Button variant="primary" size="sm" type="submit" rightIcon={<Send className="w-3 h-3" />}>
                    Join
                  </Button>
                </form>
              )}
            </div>

            {/* Head Office Details */}
            <div className="flex flex-col gap-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#55d5b3] shrink-0 mt-0.5" />
                <span>Registered Office: Bhubaneswar, Odisha, 751007, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#55d5b3] shrink-0" />
                <a href="tel:+916742350100" className="hover:text-white transition-colors">
                  +91 674 235 0100 / +91 94370 00000
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#55d5b3] shrink-0" />
                <a href="mailto:info@scnswf.org" className="hover:text-white transition-colors">
                  info@scnswf.org / contact@scnswf.org
                </a>
              </div>
            </div>
          </div>

          {/* Programs Column */}
          <div className="lg:col-span-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#0f4737]/60">
              Healthcare Programs
            </h3>
            <ul className="space-y-2.5">
              {PROGRAMS_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Organization & About Column */}
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#0f4737]/60">
              Organization
            </h3>
            <ul className="space-y-2.5">
              {ORG_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved & Legal Column */}
          <div className="lg:col-span-3">
            <h3 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4 pb-2 border-b border-[#0f4737]/60">
              Get Involved
            </h3>
            <ul className="space-y-2.5 mb-6">
              {GET_INVOLVED_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              Compliance & Legal
            </h4>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-slate-500">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-slate-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#0f4737]/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Suresh Chandra Nayak Social Welfare Foundation. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Rooted with love in Odisha</span>
            <span className="text-[#db6424]">•</span>
            <span>Healthcare Dignity for Every Community</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
