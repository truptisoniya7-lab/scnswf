import React from 'react'
import type { LucideIcon } from 'lucide-react'

export type StatCardVariant = 'default' | 'medical' | 'accent' | 'glass'

export interface StatCardProps {
  value: string | number
  label: string
  description?: string
  icon?: LucideIcon
  badge?: string
  variant?: StatCardVariant
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  description,
  icon: Icon,
  badge,
  variant = 'default',
  className = '',
}) => {
  const variantStyles: Record<StatCardVariant, { card: string; iconBg: string; iconColor: string; valueColor: string; labelColor: string; descColor: string }> = {
    default: {
      card: 'bg-white border border-[#e3eae4] shadow-[0_2px_12px_rgba(16,94,73,0.04)]',
      iconBg: 'bg-[#f0fbf7]',
      iconColor: 'text-[#105e49]',
      valueColor: 'text-[#082e23]',
      labelColor: 'text-slate-800',
      descColor: 'text-slate-500',
    },
    medical: {
      card: 'bg-[#f0fbf7] border border-[#d1f4eb] shadow-sm',
      iconBg: 'bg-white',
      iconColor: 'text-[#105e49]',
      valueColor: 'text-[#082e23]',
      labelColor: 'text-[#105e49]',
      descColor: 'text-slate-600',
    },
    accent: {
      card: 'bg-[#fff7f3] border border-[#fad0ba] shadow-sm',
      iconBg: 'bg-white',
      iconColor: 'text-[#db6424]',
      valueColor: 'text-[#94350d]',
      labelColor: 'text-[#b44512]',
      descColor: 'text-slate-600',
    },
    glass: {
      card: 'bg-white/10 backdrop-blur-md border border-white/20 text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      valueColor: 'text-white',
      labelColor: 'text-white/90',
      descColor: 'text-white/70',
    },
  }

  const current = variantStyles[variant]

  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${current.card} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${current.iconBg} ${current.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        {badge && (
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200 text-slate-700 shadow-2xs">
            {badge}
          </span>
        )}
      </div>

      <div className={`font-heading text-3xl sm:text-4xl font-extrabold tracking-tight mb-1.5 ${current.valueColor}`}>
        {value}
      </div>

      <div className={`font-heading text-base font-semibold ${current.labelColor}`}>
        {label}
      </div>

      {description && (
        <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${current.descColor}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export default StatCard
