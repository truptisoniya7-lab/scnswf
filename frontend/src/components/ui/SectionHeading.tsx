import React from 'react'
import Badge from './Badge'

export interface SectionHeadingProps {
  badge?: React.ReactNode
  badgeIcon?: React.ReactNode
  badgeVariant?: 'medical' | 'accent' | 'neutral' | 'dark'
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  isDark?: boolean
  action?: React.ReactNode
  className?: string
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeIcon,
  badgeVariant,
  title,
  description,
  align = 'center',
  isDark = false,
  action,
  className = '',
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align]

  const computedBadgeVariant = badgeVariant || (isDark ? 'dark' : 'medical')

  return (
    <div
      className={`flex flex-col mb-10 md:mb-14 ${alignClasses} ${
        align === 'center' ? 'max-w-3xl' : 'max-w-4xl'
      } ${className}`}
    >
      {badge && (
        <div className="mb-3.5">
          {typeof badge === 'string' ? (
            <Badge variant={computedBadgeVariant} icon={badgeIcon} size="md">
              {badge}
            </Badge>
          ) : (
            badge
          )}
        </div>
      )}

      <div className={`w-full ${action ? 'flex flex-col md:flex-row md:items-end md:justify-between gap-4' : ''}`}>
        <div>
          <h2
            className={`font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {title}
          </h2>

          {description && (
            <p
              className={`mt-3.5 text-base sm:text-lg leading-relaxed font-sans ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 mt-4 md:mt-0">{action}</div>}
      </div>
    </div>
  )
}

export default SectionHeading
