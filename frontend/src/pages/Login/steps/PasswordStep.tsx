import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginPasswordSchema, type LoginPasswordForm } from '../../../lib/validation'
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface PasswordStepProps {
  initialEmail: string
  onSubmit: (values: LoginPasswordForm) => Promise<void>
  onForgotPassword: () => void
  isLoading: boolean
  serverError: string | null
  onClearServerError: () => void
}

export function PasswordStep({
  initialEmail,
  onSubmit,
  onForgotPassword,
  isLoading,
  serverError,
  onClearServerError,
}: PasswordStepProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginPasswordForm>({
    resolver: zodResolver(loginPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: initialEmail,
      password: '',
    },
  })

  const values = watch()

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text,#e8fff3)] tracking-tight">
          Sign In with Password
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted,#9bc9b0)] mt-1.5">
          Enter your registered email and account password
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
            className="text-[var(--text-muted,#9bc9b0)] hover:text-white text-xs px-1 cursor-pointer"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Email Input */}
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
            id="password-login-email"
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
            aria-describedby={errors.email ? 'password-email-error' : undefined}
          />
          <label
            htmlFor="password-login-email"
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
          <p id="password-email-error" role="alert" className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Input */}
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
            id="password-login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
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
            htmlFor="password-login-password"
            className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
              focusedField === 'password' || values.password
                ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
            }`}
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 text-[var(--text-muted,#9bc9b0)] hover:text-white transition-colors cursor-pointer"
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

      {/* Forgot Password Link */}
      <div className="flex justify-end pr-0.5">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-semibold text-[var(--green-300,#6ee7b7)] hover:text-[var(--green-400,#34d399)] transition-colors hover:underline cursor-pointer"
        >
          Forgot password?
        </button>
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
            <span>Signing in...</span>
          </div>
        ) : (
          <span>Sign In &rarr;</span>
        )}
      </button>
    </form>
  )
}
