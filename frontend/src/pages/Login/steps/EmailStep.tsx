import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { emailStepSchema, type EmailStepForm } from '../../../lib/validation'
import { Loader2, AlertCircle } from 'lucide-react'

interface EmailStepProps {
  initialEmail: string
  onSubmit: (values: EmailStepForm) => Promise<void>
  isLoading: boolean
  serverError: string | null
  onClearServerError: () => void
}

export function EmailStep({
  initialEmail,
  onSubmit,
  isLoading,
  serverError,
  onClearServerError,
}: EmailStepProps) {
  const [isFocused, setIsFocused] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EmailStepForm>({
    resolver: zodResolver(emailStepSchema),
    mode: 'onBlur',
    defaultValues: { email: initialEmail },
  })

  const emailValue = watch('email')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text,#e8fff3)] tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted,#9bc9b0)] mt-1.5">
          Enter your email address to receive a secure login code
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
          <span className="flex-1 leading-snug">{serverError}</span>
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

      {/* Floating label Email Input */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
            errors.email
              ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
              : isFocused
              ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
              : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
          }`}
        >
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            spellCheck="false"
            disabled={isLoading}
            {...register('email')}
            onFocus={() => {
              setIsFocused(true)
              if (serverError) onClearServerError()
            }}
            onBlur={(e) => {
              register('email').onBlur(e)
              setIsFocused(false)
            }}
            placeholder=" "
            className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 placeholder-transparent disabled:opacity-50"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
          <label
            htmlFor="login-email"
            className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
              isFocused || emailValue
                ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
            }`}
          >
            Email Address
          </label>
        </div>
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
            {errors.email.message}
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
            <span>Sending verification code...</span>
          </div>
        ) : (
          <span>Send OTP &rarr;</span>
        )}
      </button>
    </form>
  )
}
