import React, { useState, useRef, useEffect } from 'react'
import { useCountdown } from '../../../hooks/useCountdown'
import { Loader2, AlertCircle } from 'lucide-react'

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
  if (local.length <= 2) return `${local[0]}*@${domain}`
  return `${local[0]}***${local.slice(-1)}@${domain}`
}

interface LightOtpProps {
  value: string
  onChange: (v: string) => void
  onComplete?: (v: string) => void
  isError?: boolean
  disabled?: boolean
}

function LightOtpInput({ value, onChange, onComplete, isError = false, disabled = false }: LightOtpProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '')

  useEffect(() => {
    if (inputRefs.current[0] && !disabled) inputRefs.current[0].focus()
  }, [disabled])

  useEffect(() => {
    if (isError && inputRefs.current[0]) inputRefs.current[0].focus()
  }, [isError])

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else {
        const nd = [...digits]
        nd[index] = ''
        onChange(nd.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const nd = [...digits]
    nd[index] = char
    const newOtp = nd.join('')
    onChange(newOtp)
    if (char && index < 5) inputRefs.current[index + 1]?.focus()
    if (newOtp.length === 6 && onComplete) onComplete(newOtp)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    onChange(pasted)
    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()
    if (pasted.length === 6 && onComplete) onComplete(pasted)
  }

  return (
    <div
      role="group"
      aria-label="6-digit verification code"
      className={`flex items-center justify-between gap-2 sm:gap-3 ${isError ? 'auth-shake' : ''}`}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el }}
          id={`otp-light-digit-${i}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i]}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${i + 1} of 6`}
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl transition-all outline-none bg-[#f0f7f4] text-[#1a2e1e] border ${
            isError
              ? 'border-red-400 shadow-[0_0_0_3px_rgba(248,113,113,0.15)]'
              : 'border-[#c8e6d8] focus:border-[#1a5c3c] focus:shadow-[0_0_0_3px_rgba(26,92,60,0.12)]'
          } ${digits[i] ? 'border-[#2d7a56] bg-[#e8f5ed]' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      ))}
    </div>
  )
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

  useEffect(() => {
    start(30)
  }, [])

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
      {/* Heading */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a2e1e] tracking-tight">
          Check your email
        </h2>
        <p className="text-xs sm:text-sm text-[#5a7a6a] mt-1.5 leading-relaxed">
          Enter the 6-digit code sent to{' '}
          <strong className="text-[#1a2e1e] font-semibold">{maskEmail(email)}</strong>
        </p>
      </div>

      {/* Error */}
      {errorMsg && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1 leading-snug">{errorMsg}</span>
          <button
            type="button"
            onClick={onClearError}
            className="text-red-400 hover:text-red-600 text-xs px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* OTP input boxes */}
      <div className="py-2">
        <LightOtpInput
          value={otp}
          onChange={handleOtpChange}
          onComplete={handleAutoSubmit}
          isError={Boolean(errorMsg)}
          disabled={isLoading}
        />
      </div>

      {/* Submit button */}
      <button
        type="button"
        disabled={otp.length !== 6 || isLoading}
        onClick={() => handleAutoSubmit(otp)}
        className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(26,92,60,0.35)] hover:shadow-[0_6px_20px_rgba(26,92,60,0.5)] hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: 'linear-gradient(135deg, #1a5c3c, #2d7a56)' }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying...</span>
          </div>
        ) : (
          <span>Log in →</span>
        )}
      </button>

      {/* Resend & back */}
      <div className="flex items-center justify-between text-xs pt-1 text-[#5a7a6a]">
        <button
          type="button"
          onClick={onBackToEmail}
          disabled={isLoading}
          className="inline-flex items-center gap-1 hover:text-[#1a5c3c] transition-colors cursor-pointer py-1"
        >
          Use a different email
        </button>

        <div>
          {resendCount >= 5 ? (
            <span className="text-red-500">Max resends reached</span>
          ) : isActive ? (
            <span>
              Resend in <strong className="text-[#1a2e1e]">{secondsLeft}s</strong>
            </span>
          ) : (
            <button
              type="button"
              disabled={isResending || isLoading}
              onClick={handleResendClick}
              className="font-bold underline text-[#1a5c3c] hover:text-[#2d7a56] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isResending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
