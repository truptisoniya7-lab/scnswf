import { Link } from 'react-router-dom'
import { Heart, Mail, Phone, MapPin, Globe } from 'lucide-react'

const LINKS = {
  organization: [
    { label: 'About Us',    to: '/about' },
    { label: 'Our Programs',to: '/programs' },
    { label: 'Our Impact',  to: '/impact' },
    { label: 'Annual Reports', to: '/impact' },
    { label: 'Gallery',     to: '/gallery' },
    { label: 'Stories',     to: '/stories' },
  ],
  getInvolved: [
    { label: 'Donate',        to: '/donate' },
    { label: 'Volunteer',     to: '/get-involved/volunteer' },
    { label: 'Internship',    to: '/get-involved/internship' },
    { label: 'Partner With Us', to: '/get-involved/partner' },
    { label: 'Contact Us',   to: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Refund Policy',  to: '/refund-policy' },
    { label: 'Disclaimer',     to: '/disclaimer' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(160deg, #0d2e2c 0%, #0a1f1e 100%)', color: '#e5e7eb' }}>
      <div className="container-custom" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-white mb-4">
              <img
                src="/images/about/scnswf-logo.png"
                alt="SCNSWF Logo"
                className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 shadow-sm"
              />
              <span className="tracking-tight">SCNSWF</span>
            </Link>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#9ca3af' }}>
              Suresh Chandra Nayak Social Welfare Foundation — bringing healthcare and social welfare services to those who need them most in Odisha.
            </p>
            <div className="flex gap-3">
              {['Facebook', 'Twitter', 'Instagram', 'YouTube'].map((platform, i) => (
                <a key={i} href="#" aria-label={`${platform} — coming soon`} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.1)', color: '#9ca3af' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#279490'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}>
                  <Globe size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Organization */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Organization</h3>
            <ul className="space-y-2">
              {LINKS.organization.map(l => (
                <li key={l.to}><Link to={l.to} className="text-sm transition-colors hover:text-white" style={{ color: '#9ca3af' }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Get Involved</h3>
            <ul className="space-y-2">
              {LINKS.getInvolved.map(l => (
                <li key={l.to}><Link to={l.to} className="text-sm transition-colors hover:text-white" style={{ color: '#9ca3af' }}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex gap-2.5 text-sm" style={{ color: '#9ca3af' }}>
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: '#34b7b2' }} />
                Bhubaneswar, Odisha, India
              </li>
              <li className="flex gap-2.5 text-sm" style={{ color: '#9ca3af' }}>
                <Mail size={16} className="shrink-0" style={{ color: '#34b7b2' }} />
                <a href="mailto:info@scnswf.org" className="hover:text-white transition-colors">info@scnswf.org</a>
              </li>
              <li className="flex gap-2.5 text-sm" style={{ color: '#9ca3af' }}>
                <Phone size={16} className="shrink-0" style={{ color: '#34b7b2' }} />
                <a href="tel:+91XXXXXXXXXX" className="hover:text-white transition-colors">+91 XXXX XXX XXX</a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-xs uppercase tracking-wider mb-2 font-semibold text-white">Legal</h4>
              <ul className="space-y-1">
                {LINKS.legal.map(l => (
                  <li key={l.to}><Link to={l.to} className="text-xs transition-colors hover:text-white" style={{ color: '#6b7280' }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#6b7280' }}>
          <p>© {new Date().getFullYear()} Suresh Chandra Nayak Social Welfare Foundation. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} fill="#e05a37" color="#e05a37" /> for a better Odisha
          </p>
        </div>
      </div>
    </footer>
  )
}
