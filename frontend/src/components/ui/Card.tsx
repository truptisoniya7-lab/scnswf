import React from 'react'

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'subtle' | 'medical' | 'dark'
export type CardPadding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: CardVariant
  padding?: CardPadding
  hover?: boolean
  clickable?: boolean
  className?: string
}

const variantStyles: Record<CardVariant, string> = {
  default:
    'bg-white border border-[#e3eae4] shadow-[0_2px_12px_rgba(16,94,73,0.04)]',
  elevated:
    'bg-white border border-[#e3eae4] shadow-[0_8px_28px_rgba(16,94,73,0.08)]',
  bordered:
    'bg-white border border-[#d1ded2] shadow-none',
  subtle:
    'bg-[#f8faf7] border border-[#e3eae4] shadow-none',
  medical:
    'bg-[#f0fbf7] border border-[#d1f4eb] shadow-[0_2px_12px_rgba(16,94,73,0.04)]',
  dark:
    'bg-[#082e23] border border-[#0f4737] text-white shadow-[0_8px_24px_rgba(5,27,20,0.3)]',
}

const paddingStyles: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-8 sm:p-10',
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  clickable = false,
  className = '',
  ...props
}) => {
  const hoverStyles = hover
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(16,94,73,0.1)] hover:border-[#cbd8cf]'
    : ''
  const clickableStyles = clickable ? 'cursor-pointer active:translate-y-0 active:scale-[0.99]' : ''

  return (
    <div
      className={`rounded-2xl overflow-hidden ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
