import { useState } from 'react'
import { OtpInput } from '../../../components/OtpInput'
import { useCountdown } from '../../../hooks/useCountdown'
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react'

interface OtpStepProps {
  email: string
  onSubmitOtp: (otp: string) => Promise<void>
  onResendOtp: () => Promise<void>
  onBackToEmail: () => void
  isLoading: boolean
  isResending: boolean
  errorMsg: string | null
  onClearError: () => void
}

function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email
  const [local, domain] = email.split('@')
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`
  }
  return `${local[0]}***${local.slice(-1)}@${domain}`
}

export function OtpStep({
  email,
  onSubmitOtp,
  onResendOtp,
  onBackToEmail,
  isLoading,
  isResending,
  errorMsg,
  onClearError,
}: OtpStepProps) {
  const [otp, setOtp] = useState('')
  const [resendCount, setResendCount] = useState(0)
  const { secondsLeft, isActive, start } = useCountdown(30)

  // Start countdown on mount
  useState(() => {
    start(30)
  })

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp)
    if (errorMsg) onClearError()
  }

  const handleAutoSubmit = async (code: string) => {
    if (code.length === 6 && !isLoading) {
      await onSubmitOtp(code)
    }
  }

  const handleResendClick = async () => {
    if (resendCount >= 5 || isActive || isResending) return
    try {
      await onResendOtp()
      setResendCount((prev) => prev + 1)
      start(30)
      setOtp('')
    } catch {
      // Error handled by parent
    }
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold font-heading text-[var(--text,#e8fff3)] tracking-tight">
          Check your email
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted,#9bc9b0)] mt-1.5 leading-relaxed">
          Enter the 6-digit code sent to{' '}
          <strong className="text-[var(--text,#e8fff3)] font-semibold">{maskEmail(email)}</strong>
        </p>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 rounded-xl bg-red-950/60 border border-[var(--danger,#f87171)]/50 text-[var(--text,#e8fff3)] text-xs flex items-start gap-2.5 animate-fadeIn"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-[var(--danger,#f87171)] mt-0.5" />
          <span className="flex-1 leading-snug">{errorMsg}</span>
          <button
            type="button"
            onClick={onClearError}
            className="text-[var(--text-muted,#9bc9b0)] hover:text-white text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 6-digit OTP input */}
      <div className="py-2">
        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          onComplete={handleAutoSubmit}
          isError={Boolean(errorMsg)}
          disabled={isLoading}
          autoFocus={true}
        />
      </div>

      {/* Submit button */}
      <button
        type="button"
        disabled={otp.length !== 6 || isLoading}
        onClick={() => handleAutoSubmit(otp)}
        className="w-full h-12 rounded-xl text-[var(--bg-deep,#04140c)] font-heading font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_16px_rgba(31,157,98,0.3)] hover:shadow-[0_6px_22px_rgba(52,211,153,0.45)] hover:-translate-y-0.5 active:translate-y-0"
        style={{
          background: 'linear-gradient(135deg, var(--green-500, #1f9d62), var(--green-400, #34d399))',
        }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[var(--bg-deep,#04140c)]" />
            <span>Verifying code...</span>
          </div>
        ) : (
          <span>Log in &rarr;</span>
        )}
      </button>

      {/* Resend & Back Actions */}
      <div className="flex items-center justify-between text-xs pt-1 text-[var(--text-muted,#9bc9b0)]">
        <button
          type="button"
          onClick={onBackToEmail}
          disabled={isLoading}
          className="inline-flex items-center gap-1 hover:text-[var(--text,#e8fff3)] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Use a different email</span>
        </button>

        <div>
          {resendCount >= 5 ? (
            <span className="text-[var(--danger,#f87171)]">Max resends reached</span>
          ) : isActive ? (
            <span>
              Resend in <strong className="text-[var(--text,#e8fff3)]">{secondsLeft}s</strong>
            </span>
          ) : (
            <button
              type="button"
              disabled={isResending || isLoading}
              onClick={handleResendClick}
              className="font-bold underline text-[var(--green-300,#6ee7b7)] hover:text-[var(--green-400,#34d399)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
