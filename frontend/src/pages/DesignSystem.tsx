import { useState } from 'react'
import {
  Heart,
  ShieldCheck,
  Activity,
  Users,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Building,
} from 'lucide-react'
import {
  Container,
  Button,
  Badge,
  SectionHeading,
  Card,
  StatCard,
  ImageCard,
  CTASection,
  Modal,
  FormInput,
  FormSelect,
} from '../components'

export default function DesignSystem() {
  const [modalOpen, setModalOpen] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testDistrict, setTestDistrict] = useState('')
  const [showError, setShowError] = useState(false)

  const odishaDistricts = [
    { label: 'Khordha (Bhubaneswar)', value: 'khordha' },
    { label: 'Cuttack', value: 'cuttack' },
    { label: 'Mayurbhanj', value: 'mayurbhanj' },
    { label: 'Kalahandi', value: 'kalahandi' },
    { label: 'Ganjam', value: 'ganjam' },
    { label: 'Sundargarh', value: 'sundargarh' },
    { label: 'Puri', value: 'puri' },
    { label: 'Koraput', value: 'koraput' },
  ]

  return (
    <div className="bg-[#fbfbf9] min-h-screen pt-32 sm:pt-36 pb-20">
      <Container size="xl">
        {/* System Header */}
        <div className="border-b border-[#e3eae4] pb-8 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="medical" size="md" pulse>
                  Phase 1 Living Design System
                </Badge>
                <Badge variant="neutral" size="sm">
                  SCNSWF • Odisha NGO
                </Badge>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#082e23]">
                Design System & Component Foundation
              </h1>
              <p className="mt-2 text-slate-600 text-base max-w-3xl">
                Standardized visual language: Medical Green + Warm Neutral Surfaces + Controlled
                Terracotta CTA Accent + Plus Jakarta Sans &amp; Inter Typography + 9-Step Spacing Scale.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Test Interactive Modal
            </Button>
          </div>
        </div>

        {/* 1. Design Tokens & Palette */}
        <section className="mb-16">
          <SectionHeading
            align="left"
            badge="Foundation"
            title="1. Core Color System & Typography"
            description="Strictly limited palette to convey healthcare credibility, human empathy, and Odisha community trust."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="default">
              <div className="h-20 rounded-xl bg-[#105e49] flex items-center justify-center text-white font-bold text-sm mb-3">
                #105e49
              </div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">Primary: Medical Green</h4>
              <p className="text-xs text-slate-500 mt-1">
                Deep clinical &amp; nature green for headers, primary badges, navigation, and brand trust.
              </p>
            </Card>

            <Card variant="default">
              <div className="h-20 rounded-xl bg-[#082e23] flex items-center justify-center text-white font-bold text-sm mb-3">
                #082e23
              </div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">Primary Dark: Deep Pine</h4>
              <p className="text-xs text-slate-500 mt-1">
                Used for high-contrast headers, footer background, and strong visual weight.
              </p>
            </Card>

            <Card variant="default">
              <div className="h-20 rounded-xl bg-[#db6424] flex items-center justify-center text-white font-bold text-sm mb-3">
                #db6424
              </div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">Accent: Controlled Warm CTA</h4>
              <p className="text-xs text-slate-500 mt-1">
                Controlled warm terracotta / amber for high-converting buttons (Donate, Volunteer).
              </p>
            </Card>

            <Card variant="default">
              <div className="h-20 rounded-xl bg-[#fbfbf9] border border-[#e3eae4] flex items-center justify-center text-slate-700 font-bold text-sm mb-3">
                #fbfbf9
              </div>
              <h4 className="font-heading font-bold text-slate-900 text-sm">Surface: Warm Light Neutral</h4>
              <p className="text-xs text-slate-500 mt-1">
                Warm ivory background that avoids harsh clinical starkness and adds human warmth.
              </p>
            </Card>
          </div>

          {/* Spacing Tokens Display */}
          <div className="mt-8 p-6 bg-white rounded-2xl border border-[#e3eae4]">
            <h4 className="font-heading font-bold text-slate-900 text-sm mb-3">
              Standard 9-Step Spacing Scale
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { label: '8px', val: 'h-2 w-2' },
                { label: '12px', val: 'h-3 w-3' },
                { label: '16px', val: 'h-4 w-4' },
                { label: '24px', val: 'h-6 w-6' },
                { label: '32px', val: 'h-8 w-8' },
                { label: '48px', val: 'h-12 w-12' },
                { label: '64px', val: 'h-16 w-16' },
                { label: '80px', val: 'h-20 w-20' },
                { label: '120px', val: 'h-24 w-24' },
              ].map((sp) => (
                <div key={sp.label} className="flex flex-col items-center bg-[#f8faf7] p-3 rounded-xl border border-[#e3eae4]">
                  <div className={`bg-[#105e49] rounded-md ${sp.val}`} />
                  <span className="text-xs font-mono font-bold text-slate-700 mt-2">{sp.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Button Component */}
        <section className="mb-16">
          <SectionHeading
            align="left"
            badge="Component: Button"
            title="2. Buttons & Actions"
            description="Polished interaction states with controlled CTA accent and medical green variants."
          />

          <Card variant="default" className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Button Variants
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon={<Heart className="w-4 h-4 fill-white" />}>
                  Primary (Controlled CTA)
                </Button>
                <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Secondary Outlined
                </Button>
                <Button variant="medical" leftIcon={<ShieldCheck className="w-4 h-4" />}>
                  Medical Green
                </Button>
                <Button variant="white" leftIcon={<Users className="w-4 h-4" />}>
                  White Button
                </Button>
                <Button variant="ghost">
                  Ghost Action
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Sizes &amp; Loading States
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">
                  Small Button
                </Button>
                <Button variant="primary" size="md">
                  Medium Button
                </Button>
                <Button variant="primary" size="lg">
                  Large Button
                </Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 3. Badges */}
        <section className="mb-16">
          <SectionHeading
            align="left"
            badge="Component: Badge"
            title="3. Trust & Status Badges"
            description="Clear indicators for statutory certifications, health camp tags, and operational statuses."
          />

          <Card variant="default">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="medical" pulse icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                Active Mobile Unit
              </Badge>
              <Badge variant="accent" pulse icon={<Heart className="w-3.5 h-3.5" />}>
                Immediate Medical Relief
              </Badge>
              <Badge variant="neutral" icon={<MapPin className="w-3.5 h-3.5" />}>
                Mayurbhanj District
              </Badge>
              <Badge variant="success" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                80G Verified Non-Profit
              </Badge>
              <Badge variant="outline">
                Section 8 NGO
              </Badge>
            </div>
          </Card>
        </section>

        {/* 4. StatCards */}
        <section className="mb-16">
          <SectionHeading
            align="left"
            badge="Component: StatCard"
            title="4. Impact & Trust Metrics"
            description="Communicating real, verifiable social impact across rural and tribal Odisha."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Activity}
              value="45,000+"
              label="Patients Treated"
              description="Free primary healthcare consultations delivered by mobile health units."
              variant="default"
              badge="Verified"
            />
            <StatCard
              icon={MapPin}
              value="28"
              label="Districts in Odisha"
              description="Reaching remote villages across coastal, tribal, and western Odisha."
              variant="medical"
              badge="Statewide"
            />
            <StatCard
              icon={Heart}
              value="100%"
              label="Tax Deductible"
              description="Eligible for Section 80G deductions under Indian Income Tax Act."
              variant="accent"
              badge="80G / 12A"
            />
            <StatCard
              icon={Building}
              value="12+"
              label="Community Centers"
              description="Dedicated hubs for maternal care, nutrition, and livelihood training."
              variant="default"
            />
          </div>
        </section>

        {/* 5. Cards & ImageCards */}
        <section className="mb-16">
          <SectionHeading
            align="left"
            badge="Component: ImageCard & Card"
            title="5. Story & Program Visual Cards"
            description="Authentic imagery from the field in Odisha with metadata, location tags, and smooth hover."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ImageCard
              src="/images/about/project-care-health-hygiene-team.jpg"
              alt="Medical Team in Odisha"
              badge="Mobile Clinic"
              badgeVariant="medical"
              title="Project Care: Health & Hygiene in Rural Odisha"
              description="Deploying doctors, nurses, and vital diagnostics directly to remote village panchayats."
              location="Kalahandi, Odisha"
              date="March 2026"
              aspectRatio="video"
            />

            <ImageCard
              src="/images/about/geriatric-care-parents.jpg"
              alt="Geriatric Care"
              badge="Elderly Health"
              badgeVariant="accent"
              title="Compassionate Geriatric Health & Palliative Support"
              description="Providing regular vital screenings, chronic illness management, and medications for senior citizens."
              location="Bhubaneswar, Odisha"
              date="Weekly Clinic"
              aspectRatio="video"
            />

            <ImageCard
              src="/images/about/raja-parba-homso.jpg"
              alt="Community Festival Support"
              badge="Community Outreach"
              badgeVariant="neutral"
              title="Community Festive Outreach & Maternal Nutrition"
              description="Empowering mothers and children with nutrition kits during traditional Odisha celebrations."
              location="Khordha, Odisha"
              date="Community Day"
              aspectRatio="video"
              overlay
            />
          </div>
        </section>

        {/* 6. Form Inputs & Selects */}
        <section className="mb-16">
          <SectionHeading
            align="left"
            badge="Component: FormInput & FormSelect"
            title="6. Accessible NGO Forms"
            description="Designed for volunteer onboarding, donor receipts, and CSR partnership inquiries."
          />

          <Card variant="default">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-800">
                Interactive Form Validation Demonstration
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowError((prev) => !prev)}
              >
                {showError ? 'Clear Error State' : 'Toggle Error State'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormInput
                id="name"
                label="Full Name"
                placeholder="e.g. Satyajit Mishra"
                icon={Users}
                required
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                error={showError ? 'Please enter your official legal name for the 80G receipt' : undefined}
                helperText={!showError ? 'Required for issuing statutory tax deduction receipt' : undefined}
              />

              <FormInput
                id="email"
                type="email"
                label="Email Address"
                placeholder="satyajit@example.com"
                icon={Mail}
                required
              />

              <FormInput
                id="phone"
                type="tel"
                label="Mobile Number (WhatsApp)"
                placeholder="+91 94370 00000"
                icon={Phone}
                required
              />

              <FormSelect
                id="district"
                label="Select Odisha District"
                placeholder="Choose District..."
                options={odishaDistricts}
                value={testDistrict}
                onChange={(e) => setTestDistrict(e.target.value)}
                icon={MapPin}
                required
                error={showError ? 'Please select your preferred district in Odisha' : undefined}
              />

              <FormInput
                id="donationAmount"
                label="Contribution Amount"
                placeholder="2,500"
                icon={Heart}
                rightElement={<span className="text-xs font-bold text-slate-500">INR (₹)</span>}
                required
              />

              <FormSelect
                id="program"
                label="Program Designation"
                placeholder="Where needed most..."
                options={[
                  { label: 'Mobile Health Units (General Fund)', value: 'mhu' },
                  { label: 'Maternal & Child Health Care', value: 'maternal' },
                  { label: 'Safe Drinking Water & Sanitation', value: 'wash' },
                  { label: 'Skill Training for Rural Women', value: 'skill' },
                ]}
              />
            </div>
          </Card>
        </section>

        {/* 7. CTA Section Showcase */}
        <section className="mb-16">
          <SectionHeading
            align="left"
            badge="Component: CTASection"
            title="7. Standardized Conversion & Action Block"
            description="Consistent trust section used across donation, volunteer, and campaign pages."
          />

          <CTASection
            variant="brand"
            badge="Support Odisha Healthcare"
            title="Help Us Bring Doctors and Medicine to Remote Villages"
            description="Every contribution directly powers our Mobile Health Units, prenatal screenings, and life-saving community healthcare interventions across Odisha."
            primaryAction={{
              label: 'Make a Tax-Deductible Donation',
              to: '/donate',
              icon: <Heart className="w-4 h-4 fill-white" />,
            }}
            secondaryAction={{
              label: 'Join as a Healthcare Volunteer',
              to: '/get-involved/volunteer',
              icon: <ArrowRight className="w-4 h-4" />,
            }}
          />
        </section>

        {/* Interactive Modal Component Demo */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Interactive Modal — Volunteer or Donate"
          description="Accessible dialog with keyboard Escape support, background backdrop, and focus trap."
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  alert('Thank you for taking action with SCNSWF!')
                  setModalOpen(false)
                }}
              >
                Confirm &amp; Proceed
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-slate-600">
              The Suresh Chandra Nayak Social Welfare Foundation operates across Odisha with strict
              statutory compliance, financial transparency, and community-first healthcare delivery.
            </p>
            <FormInput
              id="modal-email"
              label="Your Contact Email"
              placeholder="volunteer@example.com"
              icon={Mail}
              required
            />
            <div className="p-3 bg-[#f0fbf7] border border-[#d1f4eb] rounded-xl text-xs text-[#105e49]">
              <span className="font-semibold">Note:</span> All donations are exempt under Section 80G
              of the Income Tax Act.
            </div>
          </div>
        </Modal>
      </Container>
    </div>
  )
}
