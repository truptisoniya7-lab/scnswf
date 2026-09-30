import React from 'react'
import { Heart, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from './Button'
import Badge from './Badge'
import Container from './Container'

export type CTASectionVariant = 'brand' | 'warm' | 'accent'

export interface CTAAction {
  label: string
  to?: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
}

export interface CTASectionProps {
  badge?: string
  title: string
  description: string
  primaryAction?: CTAAction
  secondaryAction?: CTAAction
  trustBadges?: string[]
  variant?: CTASectionVariant
  className?: string
}

export const CTASection: React.FC<CTASectionProps> = ({
  badge = 'Take Action Today',
  title,
  description,
  primaryAction = {
    label: 'Donate Now',
    to: '/donate',
    icon: <Heart className="w-4 h-4 fill-white" />,
  },
  secondaryAction = {
    label: 'Become a Volunteer',
    to: '/get-involved/volunteer',
    icon: <ArrowRight className="w-4 h-4" />,
  },
  trustBadges = [
    'Section 8 Non-Profit (Govt. of India)',
    '100% Tax Deductible under 80G',
    'Audited Financial Reports',
    'Serving Odisha Since Inception',
  ],
  variant = 'brand',
  className = '',
}) => {
  const isBrand = variant === 'brand'
  const isWarm = variant === 'warm'

  return (
    <section
      className={`relative overflow-hidden py-16 md:py-20 lg:py-24 ${
        isBrand
          ? 'bg-gradient-to-br from-[#051b14] via-[#082e23] to-[#0c4737] text-white'
          : isWarm
          ? 'bg-[#f8faf7] text-slate-900 border-y border-[#e3eae4]'
          : 'bg-gradient-to-br from-[#70270a] via-[#94350d] to-[#b44512] text-white'
      } ${className}`}
    >
      {/* Subtle organic background ring decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border-[32px] border-white" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border-[24px] border-white" />
      </div>

      <Container size="xl" className="relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {badge && (
            <div className="mb-4 inline-flex justify-center">
              <Badge
                variant={isBrand ? 'dark' : isWarm ? 'medical' : 'dark'}
                size="md"
                pulse
                icon={<ShieldCheck className="w-3.5 h-3.5" />}
              >
                {badge}
              </Badge>
            </div>
          )}

          <h2
            className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
              isWarm ? 'text-slate-900' : 'text-white'
            }`}
          >
            {title}
          </h2>

          <p
            className={`mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-sans ${
              isWarm ? 'text-slate-600' : 'text-slate-200'
            }`}
          >
            {description}
          </p>

          {/* Action buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            {primaryAction && (
              <Button
                variant="primary"
                size="lg"
                to={primaryAction.to}
                href={primaryAction.href}
                onClick={primaryAction.onClick}
                leftIcon={primaryAction.icon}
              >
                {primaryAction.label}
              </Button>
            )}

            {secondaryAction && (
              <Button
                variant={isBrand ? 'outline-white' : isWarm ? 'secondary' : 'white'}
                size="lg"
                to={secondaryAction.to}
                href={secondaryAction.href}
                onClick={secondaryAction.onClick}
                rightIcon={secondaryAction.icon}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>

          {/* Trust badges footer row */}
          {trustBadges && trustBadges.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-y-3 gap-x-6 sm:gap-x-8 text-xs sm:text-sm font-medium">
              {trustBadges.map((item, idx) => (
                <div
                  key={idx}
                  className={`inline-flex items-center gap-2 ${
                    isWarm ? 'text-slate-700' : 'text-slate-200'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      isWarm ? 'text-[#105e49]' : 'text-[#55d5b3]'
                    }`}
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

export default CTASection
