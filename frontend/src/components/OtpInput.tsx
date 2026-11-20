import React, { useRef, useEffect } from 'react'

interface OtpInputProps {
  value: string
  onChange: (otp: string) => void
  onComplete?: (otp: string) => void
  isError?: boolean
  disabled?: boolean
  autoFocus?: boolean
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  isError = false,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Ensure digits array has 6 items
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus, disabled])

  // Focus reset when error occurs
  useEffect(() => {
    if (isError && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [isError])

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Move to previous box if current box is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current box
        const newDigits = [...digits]
        newDigits[index] = ''
        onChange(newDigits.join(''))
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
    const rawVal = e.target.value
    // Get last entered character
    const char = rawVal.replace(/\D/g, '').slice(-1)

    const newDigits = [...digits]
    newDigits[index] = char
    const newOtp = newDigits.join('')
    onChange(newOtp)

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.length === 6 && onComplete) {
      onComplete(newOtp)
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    onChange(pasted)
    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()

    if (pasted.length === 6 && onComplete) {
      onComplete(pasted)
    }
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
          ref={(el) => {
            inputRefs.current[i] = el
          }}
          id={`otp-digit-${i}`}
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
          className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl transition-all outline-hidden
            bg-[rgba(255,255,255,0.04)] text-[var(--text,#e8fff3)]
            border ${
              isError
                ? 'border-[var(--danger,#f87171)] shadow-[0_0_0_3px_rgba(248,113,113,0.2)]'
                : 'border-[var(--glass-border,rgba(110,231,183,0.18))] focus:border-[var(--green-400,#34d399)] focus:shadow-[0_0_0_4px_rgba(52,211,153,0.15)]'
            }
            ${digits[i] ? 'scale-[1.02] border-[var(--green-300,#6ee7b7)]/40' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      ))}
    </div>
  )
}
