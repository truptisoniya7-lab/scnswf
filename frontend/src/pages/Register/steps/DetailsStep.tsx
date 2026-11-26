import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { detailsStepSchema, type DetailsStepForm } from '../../../lib/validation'
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface DetailsStepProps {
  initialValues: DetailsStepForm
  onSubmit: (values: DetailsStepForm) => Promise<void>
  isLoading: boolean
  serverError: string | null
  onClearServerError: () => void
}

export function DetailsStep({
  initialValues,
  onSubmit,
  isLoading,
  serverError,
  onClearServerError,
}: DetailsStepProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DetailsStepForm>({
    resolver: zodResolver(detailsStepSchema),
    mode: 'onBlur',
    defaultValues: initialValues,
  })

  const values = watch()

  const isEmailExists = serverError?.toLowerCase().includes('already registered')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text,#e8fff3)] tracking-tight">
          Your details
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted,#9bc9b0)] mt-1">
          Create your account with email verification
        </p>
      </div>

      {/* Server error banner */}
      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 rounded-xl bg-red-950/60 border border-[var(--danger,#f87171)]/50 text-[var(--text,#e8fff3)] text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[var(--danger,#f87171)] mt-0.5" />
          <div className="flex-1 leading-snug">
            {serverError}
            {isEmailExists && (
              <span className="block mt-1">
                <Link
                  to="/login"
                  className="font-bold underline text-[var(--green-300,#6ee7b7)] hover:text-[var(--green-400,#34d399)] transition-colors"
                >
                  Log in instead &rarr;
                </Link>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClearServerError}
            className="text-[var(--text-muted,#9bc9b0)] hover:text-white text-xs px-1"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Name Field with Floating Label */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
            errors.name
              ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
              : focusedField === 'name'
              ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
              : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
          }`}
        >
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            disabled={isLoading}
            {...register('name')}
            onFocus={() => {
              setFocusedField('name')
              if (serverError) onClearServerError()
            }}
            onBlur={(e) => {
              register('name').onBlur(e)
              setFocusedField(null)
            }}
            placeholder=" "
            className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 placeholder-transparent disabled:opacity-50"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <label
            htmlFor="register-name"
            className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
              focusedField === 'name' || values.name
                ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
            }`}
          >
            Full Name
          </label>
        </div>
        {errors.name && (
          <p id="name-error" role="alert" className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Phone Field with Floating Label + Fixed +91 Chip */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
            errors.phone
              ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
              : focusedField === 'phone'
              ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
              : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
          }`}
        >
          {/* +91 Prefix Chip */}
          <div className="flex items-center gap-1 pr-2 mr-2 border-r border-[var(--glass-border,rgba(110,231,183,0.2))] text-[var(--text,#e8fff3)] text-sm font-semibold select-none shrink-0 pt-2">
            <span className="text-[11px] text-[var(--green-300,#6ee7b7)]">🇮🇳</span>
            <span>+91</span>
          </div>

          <input
            id="register-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            disabled={isLoading}
            {...register('phone')}
            onFocus={() => {
              setFocusedField('phone')
              if (serverError) onClearServerError()
            }}
            onBlur={(e) => {
              register('phone').onBlur(e)
              setFocusedField(null)
            }}
            placeholder=" "
            className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 placeholder-transparent disabled:opacity-50"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          <label
            htmlFor="register-phone"
            className={`absolute transition-all pointer-events-none text-xs ${
              focusedField === 'phone' || values.phone
                ? 'left-3.5 top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                : 'left-19 top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
            }`}
          >
            Mobile Number (10 digits)
          </label>
        </div>
        {errors.phone && (
          <p id="phone-error" role="alert" className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Email Field with Floating Label */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
            errors.email
              ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
              : focusedField === 'email'
              ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
              : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
          }`}
        >
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            spellCheck="false"
            disabled={isLoading}
            {...register('email')}
            onFocus={() => {
              setFocusedField('email')
              if (serverError) onClearServerError()
            }}
            onBlur={(e) => {
              register('email').onBlur(e)
              setFocusedField(null)
            }}
            placeholder=" "
            className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 placeholder-transparent disabled:opacity-50"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <label
            htmlFor="register-email"
            className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
              focusedField === 'email' || values.email
                ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
            }`}
          >
            Email Address
          </label>
        </div>
        {errors.email && (
          <p id="email-error" role="alert" className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
            errors.password
              ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
              : focusedField === 'password'
              ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
              : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
          }`}
        >
          <input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            {...register('password')}
            onFocus={() => {
              setFocusedField('password')
              if (serverError) onClearServerError()
            }}
            onBlur={(e) => {
              register('password').onBlur(e)
              setFocusedField(null)
            }}
            placeholder=" "
            className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 pr-8 placeholder-transparent disabled:opacity-50"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <label
            htmlFor="register-password"
            className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
              focusedField === 'password' || values.password
                ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
            }`}
          >
            Password (min 6 characters)
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 text-[var(--text-muted,#9bc9b0)] hover:text-white transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
            errors.confirmPassword
              ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
              : focusedField === 'confirmPassword'
              ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
              : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
          }`}
        >
          <input
            id="register-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            {...register('confirmPassword')}
            onFocus={() => {
              setFocusedField('confirmPassword')
              if (serverError) onClearServerError()
            }}
            onBlur={(e) => {
              register('confirmPassword').onBlur(e)
              setFocusedField(null)
            }}
            placeholder=" "
            className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 pr-8 placeholder-transparent disabled:opacity-50"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
          />
          <label
            htmlFor="register-confirm-password"
            className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
              focusedField === 'confirmPassword' || values.confirmPassword
                ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
            }`}
          >
            Confirm Password
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
            className="absolute right-3 text-[var(--text-muted,#9bc9b0)] hover:text-white transition-colors"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p id="confirm-password-error" role="alert" className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-xl text-[var(--bg-deep,#04140c)] font-heading font-bold text-sm tracking-wide transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(31,157,98,0.3)] hover:shadow-[0_6px_22px_rgba(52,211,153,0.45)] hover:-translate-y-0.5 active:translate-y-0"
        style={{
          background: 'linear-gradient(135deg, var(--green-500, #1f9d62), var(--green-400, #34d399))',
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--bg-deep,#04140c)]" />
            <span>Sending OTP...</span>
          </div>
        ) : (
          <span>Send OTP &rarr;</span>
        )}
      </button>
    </form>
  )
}
