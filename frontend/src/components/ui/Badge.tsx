import React from 'react'

export type BadgeVariant = 'medical' | 'accent' | 'neutral' | 'dark' | 'success' | 'outline'
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  pulse?: boolean
  className?: string
}

const variantStyles: Record<BadgeVariant, { badge: string; dot: string }> = {
  medical: {
    badge: 'bg-[#f0fbf7] text-[#105e49] border border-[#d1f4eb]',
    dot: 'bg-[#105e49]',
  },
  accent: {
    badge: 'bg-[#fff7f3] text-[#b44512] border border-[#fad0ba]',
    dot: 'bg-[#db6424]',
  },
  neutral: {
    badge: 'bg-[#f4f6f3] text-[#334155] border border-[#e3eae4]',
    dot: 'bg-[#64748b]',
  },
  dark: {
    badge: 'bg-white/10 text-white border border-white/20 backdrop-blur-sm',
    dot: 'bg-[#55d5b3]',
  },
  success: {
    badge: 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]',
    dot: 'bg-[#10b981]',
  },
  outline: {
    badge: 'bg-transparent text-[#105e49] border border-[#105e49]/30',
    dot: 'bg-[#105e49]',
  },
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-xs font-semibold px-2.5 py-0.5 rounded-full gap-1.5',
  md: 'text-xs md:text-sm font-semibold px-3 py-1 rounded-full gap-2',
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'medical',
  size = 'sm',
  icon,
  pulse = false,
  className = '',
  ...props
}) => {
  const currentVariant = variantStyles[variant]

  return (
    <span
      className={`inline-flex items-center font-sans tracking-wide uppercase select-none transition-colors ${currentVariant.badge} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentVariant.dot}`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${currentVariant.dot}`}
          />
        </span>
      )}
      {icon && <span className="shrink-0 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

export default Badge
