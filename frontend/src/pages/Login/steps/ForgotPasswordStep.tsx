import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordForm,
  type ResetPasswordForm,
} from '../../../lib/validation'
import { passwordlessAuthApi } from '../../../lib/api/auth'
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react'

interface ForgotPasswordStepProps {
  initialEmail: string
  onBack: () => void
  onSuccess: (email: string) => void
}

export function ForgotPasswordStep({
  initialEmail,
  onBack,
  onSuccess,
}: ForgotPasswordStepProps) {
  const [stage, setStage] = useState<'request' | 'reset' | 'success'>('request')
  const [email, setEmail] = useState(initialEmail)
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form 1: Request OTP
  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: { email: initialEmail },
  })

  // Form 2: Reset Password with OTP
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    watch: watchReset,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      otp: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const resetValues = watchReset()

  // Handle Request Reset OTP
  const handleRequestSubmit = async (values: ForgotPasswordForm) => {
    setIsLoading(true)
    setServerError(null)
    try {
      setEmail(values.email)
      await passwordlessAuthApi.forgotPassword(values.email)
      setStage('reset')
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to send password reset code. Please try again.'
      setServerError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Reset Password with OTP
  const handleResetSubmit = async (values: ResetPasswordForm) => {
    setIsLoading(true)
    setServerError(null)
    try {
      await passwordlessAuthApi.resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      })
      setStage('success')
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to reset password. Please check your verification code.'
      setServerError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Back button */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted,#9bc9b0)] hover:text-[var(--text,#e8fff3)] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to login</span>
        </button>
      </div>

      {/* STAGE 1: REQUEST OTP */}
      {stage === 'request' && (
        <form onSubmit={handleSubmitRequest(handleRequestSubmit)} noValidate className="space-y-4">
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text,#e8fff3)] tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted,#9bc9b0)] mt-1.5">
              Enter your email address and we'll send you a 6-digit recovery code.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-950/60 border border-[var(--danger,#f87171)]/50 text-[var(--text,#e8fff3)] text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--danger,#f87171)] mt-0.5" />
              <span className="flex-1 leading-snug">{serverError}</span>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="text-[var(--text-muted,#9bc9b0)] hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
          )}

          <div className="relative">
            <div
              className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
                requestErrors.email
                  ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
                  : focusedField === 'req-email'
                  ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
                  : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
              }`}
            >
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                disabled={isLoading}
                {...registerRequest('email')}
                onFocus={() => {
                  setFocusedField('req-email')
                  setServerError(null)
                }}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 placeholder-transparent disabled:opacity-50"
              />
              <label
                htmlFor="forgot-email"
                className="absolute left-3.5 top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium pointer-events-none"
              >
                Email Address
              </label>
            </div>
            {requestErrors.email && (
              <p className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
                {requestErrors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-[var(--bg-deep,#04140c)] font-heading font-bold text-sm tracking-wide transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(31,157,98,0.3)] hover:shadow-[0_6px_22px_rgba(52,211,153,0.45)] hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, var(--green-500, #1f9d62), var(--green-400, #34d399))',
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--bg-deep,#04140c)]" />
                <span>Sending Code...</span>
              </div>
            ) : (
              <span>Send Reset Code &rarr;</span>
            )}
          </button>
        </form>
      )}

      {/* STAGE 2: ENTER OTP & NEW PASSWORD */}
      {stage === 'reset' && (
        <form onSubmit={handleSubmitReset(handleResetSubmit)} noValidate className="space-y-4">
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text,#e8fff3)] tracking-tight">
              Create New Password
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted,#9bc9b0)] mt-1.5">
              Enter the 6-digit code sent to <strong className="text-white">{email}</strong> and choose your new password.
            </p>
          </div>

          {serverError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-950/60 border border-[var(--danger,#f87171)]/50 text-[var(--text,#e8fff3)] text-xs flex items-start gap-2.5 animate-fadeIn"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-[var(--danger,#f87171)] mt-0.5" />
              <span className="flex-1 leading-snug">{serverError}</span>
              <button
                type="button"
                onClick={() => setServerError(null)}
                className="text-[var(--text-muted,#9bc9b0)] hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* OTP Code */}
          <div className="relative">
            <div
              className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
                resetErrors.otp
                  ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
                  : focusedField === 'reset-otp'
                  ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
                  : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
              }`}
            >
              <input
                id="reset-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                disabled={isLoading}
                {...registerReset('otp')}
                onFocus={() => {
                  setFocusedField('reset-otp')
                  setServerError(null)
                }}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm tracking-widest font-mono outline-hidden pt-3.5 pb-1 placeholder-transparent disabled:opacity-50"
              />
              <label
                htmlFor="reset-otp"
                className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
                  focusedField === 'reset-otp' || resetValues.otp
                    ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                    : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
                }`}
              >
                6-Digit Recovery Code
              </label>
            </div>
            {resetErrors.otp && (
              <p className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
                {resetErrors.otp.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="relative">
            <div
              className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
                resetErrors.newPassword
                  ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
                  : focusedField === 'newPassword'
                  ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
                  : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
              }`}
            >
              <input
                id="reset-new-password"
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={isLoading}
                {...registerReset('newPassword')}
                onFocus={() => {
                  setFocusedField('newPassword')
                  setServerError(null)
                }}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 pr-8 placeholder-transparent disabled:opacity-50"
              />
              <label
                htmlFor="reset-new-password"
                className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
                  focusedField === 'newPassword' || resetValues.newPassword
                    ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                    : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
                }`}
              >
                New Password (min 6 chars)
              </label>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
                className="absolute right-3 text-[var(--text-muted,#9bc9b0)] hover:text-white transition-colors cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {resetErrors.newPassword && (
              <p className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
                {resetErrors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="relative">
            <div
              className={`relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[rgba(255,255,255,0.04)] ${
                resetErrors.confirmNewPassword
                  ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
                  : focusedField === 'confirmNewPassword'
                  ? 'border-[var(--green-400,#34d399)] shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
                  : 'border-[var(--glass-border,rgba(110,231,183,0.18))] hover:border-[var(--green-300,#6ee7b7)]/40'
              }`}
            >
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                disabled={isLoading}
                {...registerReset('confirmNewPassword')}
                onFocus={() => {
                  setFocusedField('confirmNewPassword')
                  setServerError(null)
                }}
                onBlur={() => setFocusedField(null)}
                placeholder=" "
                className="peer w-full bg-transparent text-[var(--text,#e8fff3)] text-sm outline-hidden pt-3.5 pb-1 pr-8 placeholder-transparent disabled:opacity-50"
              />
              <label
                htmlFor="reset-confirm-password"
                className={`absolute left-3.5 transition-all pointer-events-none text-xs ${
                  focusedField === 'confirmNewPassword' || resetValues.confirmNewPassword
                    ? 'top-1.5 text-[10px] text-[var(--green-300,#6ee7b7)] font-medium'
                    : 'top-3.5 text-sm text-[var(--text-muted,#9bc9b0)]'
                }`}
              >
                Confirm New Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                className="absolute right-3 text-[var(--text-muted,#9bc9b0)] hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {resetErrors.confirmNewPassword && (
              <p className="text-[11px] text-[var(--danger,#f87171)] mt-1 ml-1 font-medium">
                {resetErrors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-[var(--bg-deep,#04140c)] font-heading font-bold text-sm tracking-wide transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(31,157,98,0.3)] hover:shadow-[0_6px_22px_rgba(52,211,153,0.45)] hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, var(--green-500, #1f9d62), var(--green-400, #34d399))',
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--bg-deep,#04140c)]" />
                <span>Updating Password...</span>
              </div>
            ) : (
              <span>Reset Password &rarr;</span>
            )}
          </button>
        </form>
      )}

      {/* STAGE 3: SUCCESS STATE */}
      {stage === 'success' && (
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-[var(--green-400,#34d399)]/20 border border-[var(--green-400,#34d399)]/40 text-[var(--green-400,#34d399)] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold font-heading text-[var(--text,#e8fff3)]">
            Password Reset Successful
          </h2>
          <p className="text-xs text-[var(--text-muted,#9bc9b0)] max-w-xs leading-relaxed">
            Your password has been updated successfully. You can now log in using your new credentials.
          </p>
          <button
            type="button"
            onClick={() => onSuccess(email)}
            className="w-full h-11 rounded-xl text-[var(--bg-deep,#04140c)] font-heading font-bold text-sm tracking-wide transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer shadow-[0_4px_16px_rgba(31,157,98,0.3)] hover:shadow-[0_6px_22px_rgba(52,211,153,0.45)]"
            style={{
              background: 'linear-gradient(135deg, var(--green-500, #1f9d62), var(--green-400, #34d399))',
            }}
          >
            Proceed to Login &rarr;
          </button>
        </div>
      )}
    </div>
  )
}
