import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { AlertCircle } from 'lucide-react'

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id: string
  error?: string
  helperText?: string
  icon?: LucideIcon
  rightElement?: React.ReactNode
  required?: boolean
  containerClassName?: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      id,
      error,
      helperText,
      icon: Icon,
      rightElement,
      required,
      className = '',
      containerClassName = '',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-[#db6424] ml-1">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400 flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={`w-full rounded-xl border bg-white text-slate-900 text-sm transition-all duration-200 placeholder:text-slate-400 py-2.5 outline-none ${
              Icon ? 'pl-10' : 'pl-3.5'
            } ${rightElement ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : 'border-[#cbd8cf] hover:border-[#105e49]/50 focus:border-[#105e49] focus:ring-2 focus:ring-[#105e49]/20'
            } ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : ''} ${className}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3.5 flex items-center justify-center text-slate-500">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p id={`${id}-error`} className="text-xs text-red-600 flex items-center gap-1.5 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}

        {!error && helperText && (
          <p id={`${id}-helper`} className="text-xs text-slate-500 mt-0.5">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
export default FormInput
