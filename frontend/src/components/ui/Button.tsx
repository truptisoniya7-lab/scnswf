import React from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 
  | 'primary'       // Controlled warm secondary CTA (Donate, Volunteer, High Priority)
  | 'secondary'     // Outlined deep medical green
  | 'medical'       // Solid deep medical green (Primary NGO brand action)
  | 'white'         // Crisp white on dark medical backgrounds
  | 'ghost'         // Borderless subtle hover
  | 'outline-white' // Border-white on dark hero backgrounds

export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  to?: string
  href?: string
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#db6424] hover:bg-[#c8541c] active:bg-[#b44512] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-transparent',
  secondary:
    'bg-transparent text-[#105e49] border-2 border-[#105e49] hover:bg-[#f0fbf7] active:bg-[#d1f4eb]',
  medical:
    'bg-[#105e49] hover:bg-[#0c4737] active:bg-[#082e23] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-transparent',
  white:
    'bg-white text-[#0c4737] hover:bg-[#f0fbf7] active:bg-[#d1f4eb] shadow-sm hover:shadow border border-slate-200/80',
  ghost:
    'bg-transparent text-[#105e49] hover:bg-[#f0fbf7] active:bg-[#d1f4eb]',
  'outline-white':
    'bg-transparent text-white border-2 border-white/80 hover:bg-white/10 active:bg-white/20',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'text-xs font-semibold px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm font-semibold px-4.5 py-2.5 rounded-xl gap-2',
  lg: 'text-base font-semibold px-6 py-3 rounded-xl gap-2.5',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled = false,
      fullWidth = false,
      to,
      href,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans tracking-tight transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#105e49]'
    const widthStyle = fullWidth ? 'w-full' : 'w-auto'
    const disabledStyle = disabled || isLoading ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''
    const combinedClassName = `${baseStyles} ${variantClasses[variant]} ${sizeClasses[size]} ${widthStyle} ${disabledStyle} ${className}`

    const content = (
      <>
        {isLoading ? (
          <Loader2 className="animate-spin w-4 h-4 shrink-0" aria-hidden="true" />
        ) : (
          leftIcon && <span className="shrink-0 inline-flex items-center">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 inline-flex items-center">{rightIcon}</span>
        )}
      </>
    )

    if (to) {
      return (
        <Link to={to} className={combinedClassName} aria-disabled={disabled || isLoading}>
          {content}
        </Link>
      )
    }

    if (href) {
      return (
        <a
          href={href}
          className={combinedClassName}
          aria-disabled={disabled || isLoading}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      )
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
