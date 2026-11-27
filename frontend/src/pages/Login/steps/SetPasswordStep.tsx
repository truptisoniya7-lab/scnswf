import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle, Check, Eye, EyeOff, Lock, User, Phone, Briefcase, FileText, ChevronDown } from 'lucide-react'

const setPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters.').optional().or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
    name: z.string().optional(),
    phone: z.string().optional(),
    role: z.enum(['volunteer', 'donor', 'internship']).optional(),
    bio: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      message: 'Passwords do not match.',
      path: ['confirmPassword'],
    }
  )

export type SetPasswordFormValues = z.infer<typeof setPasswordSchema>

interface SetPasswordStepProps {
  email: string
  onSubmit: (values: SetPasswordFormValues) => Promise<void>
  onSkip: () => Promise<void>
  isLoading: boolean
  serverError: string | null
  onClearServerError: () => void
}

export function SetPasswordStep({
  email: _email,
  onSubmit,
  onSkip,
  isLoading,
  serverError,
  onClearServerError,
}: SetPasswordStepProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      role: 'volunteer',
      bio: '',
    },
  })

  const getBorderClass = (field: string, hasError: boolean) => {
    if (hasError) return 'border-red-400 shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
    if (focusedField === field) return 'border-[#1a5c3c] shadow-[0_0_0_3px_rgba(26,92,60,0.1)]'
    return 'border-[#c8e6d8] hover:border-[#2d7a56]/50'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
      {/* Top Success Badge */}
      <div className="text-center pt-1 mb-3">
        <div className="w-12 h-12 rounded-full bg-[#1a5c3c] text-white flex items-center justify-center mx-auto mb-2.5 shadow-[0_4px_16px_rgba(26,92,60,0.3)]">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1a2e1e] tracking-tight">
          OTP Verified!
        </h2>
        <p className="text-xs sm:text-sm text-[#5a7a6a] mt-1">
          Now, set your password to continue
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1 leading-snug">{serverError}</span>
          <button
            type="button"
            onClick={onClearServerError}
            className="text-red-400 hover:text-red-600 text-xs px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Create Password */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-11 flex items-center px-3 bg-[#f8fbf9] ${getBorderClass('password', Boolean(errors.password))}`}
        >
          <Lock className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2.5" />
          <input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            {...register('password')}
            onFocus={() => { setFocusedField('password'); if (serverError) onClearServerError() }}
            onBlur={() => setFocusedField(null)}
            placeholder="Create Password"
            className="w-full bg-transparent text-[#1a2e1e] text-xs sm:text-sm outline-none placeholder-[#8aab98] pr-7 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 text-[#8aab98] hover:text-[#1a5c3c] transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[11px] text-red-500 mt-0.5 ml-1 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <div
          className={`relative rounded-xl border transition-all h-11 flex items-center px-3 bg-[#f8fbf9] ${getBorderClass('confirmPassword', Boolean(errors.confirmPassword))}`}
        >
          <Lock className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2.5" />
          <input
            id="confirm-new-password"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            disabled={isLoading}
            {...register('confirmPassword')}
            onFocus={() => { setFocusedField('confirmPassword'); if (serverError) onClearServerError() }}
            onBlur={() => setFocusedField(null)}
            placeholder="Confirm Password"
            className="w-full bg-transparent text-[#1a2e1e] text-xs sm:text-sm outline-none placeholder-[#8aab98] pr-7 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            tabIndex={-1}
            className="absolute right-3 text-[#8aab98] hover:text-[#1a5c3c] transition-colors cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-[11px] text-red-500 mt-0.5 ml-1 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Optional Divider */}
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#ddeee6]" />
        </div>
        <div className="relative flex justify-center text-[11px]">
          <span className="bg-white px-2.5 text-[#5a7a6a] font-medium">
            Optional: Tell us more about you
          </span>
        </div>
      </div>

      {/* Name and Phone 2-column Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Full Name */}
        <div className={`relative rounded-xl border transition-all h-11 flex items-center px-3 bg-[#f8fbf9] ${getBorderClass('name', false)}`}>
          <User className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2" />
          <input
            type="text"
            autoComplete="name"
            disabled={isLoading}
            {...register('name')}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Full Name"
            className="w-full bg-transparent text-[#1a2e1e] text-xs sm:text-sm outline-none placeholder-[#8aab98] disabled:opacity-50"
          />
        </div>

        {/* Phone */}
        <div className={`relative rounded-xl border transition-all h-11 flex items-center px-3 bg-[#f8fbf9] ${getBorderClass('phone', false)}`}>
          <Phone className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2" />
          <input
            type="tel"
            autoComplete="tel"
            disabled={isLoading}
            {...register('phone')}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            placeholder="Phone Number"
            className="w-full bg-transparent text-[#1a2e1e] text-xs sm:text-sm outline-none placeholder-[#8aab98] disabled:opacity-50"
          />
        </div>
      </div>

      {/* Select Role */}
      <div className={`relative rounded-xl border transition-all h-11 flex items-center px-3 bg-[#f8fbf9] ${getBorderClass('role', false)}`}>
        <Briefcase className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2.5" />
        <select
          disabled={isLoading}
          {...register('role')}
          onFocus={() => setFocusedField('role')}
          onBlur={() => setFocusedField(null)}
          className="w-full bg-transparent text-[#1a2e1e] text-xs sm:text-sm outline-none cursor-pointer appearance-none disabled:opacity-50"
        >
          <option value="volunteer">Volunteer</option>
          <option value="donor">Donor</option>
          <option value="internship">Internship</option>
        </select>
        <ChevronDown className="w-4 h-4 text-[#8aab98] pointer-events-none absolute right-3" />
      </div>

      {/* About Yourself (Optional) */}
      <div className={`relative rounded-xl border transition-all p-2.5 bg-[#f8fbf9] ${getBorderClass('bio', false)}`}>
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-[#2d7a56] shrink-0 mt-0.5" />
          <textarea
            rows={2}
            disabled={isLoading}
            {...register('bio')}
            onFocus={() => setFocusedField('bio')}
            onBlur={() => setFocusedField(null)}
            placeholder="About Yourself (Optional)"
            className="w-full bg-transparent text-[#1a2e1e] text-xs sm:text-sm outline-none placeholder-[#8aab98] resize-none disabled:opacity-50"
          />
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(26,92,60,0.35)] hover:shadow-[0_6px_20px_rgba(26,92,60,0.5)] hover:-translate-y-0.5 active:translate-y-0"
        style={{ background: 'linear-gradient(135deg, #1a5c3c, #2d7a56)' }}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          <span>Continue &gt;</span>
        )}
      </button>

      {/* Skip for now Link */}
      <div className="text-center pt-0.5 pb-1">
        <button
          type="button"
          disabled={isLoading}
          onClick={onSkip}
          className="text-xs font-semibold text-[#1a5c3c] hover:text-[#2d7a56] hover:underline cursor-pointer disabled:opacity-50"
        >
          Skip for now
        </button>
      </div>
    </form>
  )
}
