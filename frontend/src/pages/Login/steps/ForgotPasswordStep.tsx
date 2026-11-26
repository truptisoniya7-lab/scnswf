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
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, Mail, Lock } from 'lucide-react'

interface ForgotPasswordStepProps {
  initialEmail: string
  onBack: () => void
  onSuccess: (email: string) => void
}

export function ForgotPasswordStep({
  initialEmail,
  onBack: _onBack,
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
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: { otp: '', newPassword: '', confirmNewPassword: '' },
  })

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

  // Shared input class helper
  const inputWrap = (field: string, hasError: boolean) =>
    `relative rounded-xl border transition-all h-12 flex items-center px-3.5 bg-[#f8fbf9] ${hasError
      ? 'border-red-400 shadow-[0_0_0_3px_rgba(248,113,113,0.12)]'
      : focusedField === field
        ? 'border-[#1a5c3c] shadow-[0_0_0_3px_rgba(26,92,60,0.1)]'
        : 'border-[#c8e6d8] hover:border-[#2d7a56]/50'
    }`

  return (
    <div className="space-y-4">
      {/* STAGE 1: REQUEST OTP */}
      {stage === 'request' && (
        <form onSubmit={handleSubmitRequest(handleRequestSubmit)} noValidate className="space-y-4">
          <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a2e1e] tracking-tight">
                Reset Password
              </h2>
                <p className="text-xs sm:text-sm text-[#5a7a6a] mt-1.5">
                  Enter your email and we'll send you a 6-digit recovery code.
                </p>
              </div>

              {serverError && (
                  <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-snug">{serverError}</span>
                    <button type="button" onClick={() => setServerError(null)} className="text-red-400 hover:text-red-600 text-xs px-1 cursor-pointer">✕</button>
                  </div>
          )}

                  <div className="relative">
                      <div className={inputWrap('req-email', Boolean(requestErrors.email))}>
                        <Mail className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2.5" />
                        <input
                          id="forgot-email"
                          type="email"
                          autoComplete="email"
                          disabled={isLoading}
                          {...registerRequest('email')}
                          onFocus={() => { setFocusedField('req-email'); setServerError(null) }}
                          onBlur={() => setFocusedField(null)}
                          placeholder="Email Address"
                          className="w-full bg-transparent text-[#1a2e1e] text-sm outline-none placeholder-[#8aab98] disabled:opacity-50"
                        />
                      </div>
                      {requestErrors.email && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{requestErrors.email.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 mt-1 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(26,92,60,0.35)] hover:shadow-[0_6px_20px_rgba(26,92,60,0.5)] hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #1a5c3c, #2d7a56)' }}
                    >
                      {isLoading ? (
              <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Sending Code...</span></div>
                      ) : (
              <span>Send Reset Code →</span>
                      )}
                    </button>
                  </form>
      )}

                  {/* STAGE 2: ENTER OTP & NEW PASSWORD */}
                  {stage === 'reset' && (
                    <form onSubmit={handleSubmitReset(handleResetSubmit)} noValidate className="space-y-4">
                      <div className="text-center mb-5">
                          <h2 className="text-xl sm:text-2xl font-bold text-[#1a2e1e] tracking-tight">
                            Create New Password
                          </h2>
                            <p className="text-xs sm:text-sm text-[#5a7a6a] mt-1.5">
                              Enter the 6-digit code sent to <strong className="text-[#1a2e1e]">{email}</strong> and choose your new password.
                            </p>
                          </div>

                          {serverError && (
                              <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span className="flex-1 leading-snug">{serverError}</span>
                                <button type="button" onClick={() => setServerError(null)} className="text-red-400 hover:text-red-600 text-xs px-1 cursor-pointer">✕</button>
                              </div>
          )}

                              {/* OTP Code */}
                              <div className="relative">
                                  <div className={inputWrap('reset-otp', Boolean(resetErrors.otp))}>
                                    <Lock className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2.5" />
                                    <input
                                      id="reset-otp"
                                      type="text"
                                      inputMode="numeric"
                                      maxLength={6}
                                      disabled={isLoading}
                                      {...registerReset('otp')}
                                      onFocus={() => { setFocusedField('reset-otp'); setServerError(null) }}
                                      onBlur={() => setFocusedField(null)}
                                      placeholder="6-Digit Recovery Code"
                                      className="w-full bg-transparent text-[#1a2e1e] text-sm tracking-widest font-mono outline-none placeholder-[#8aab98] disabled:opacity-50"
                                    />
                                  </div>
                                  {resetErrors.otp && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{resetErrors.otp.message}</p>
                                  )}
                                </div>

                                {/* New Password */}
                                <div className="relative">
                                    <div className={inputWrap('newPassword', Boolean(resetErrors.newPassword))}>
                                      <Lock className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2.5" />
                                      <input
                                        id="reset-new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        {...registerReset('newPassword')}
                                        onFocus={() => { setFocusedField('newPassword'); setServerError(null) }}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="New Password (min 6 chars)"
                                        className="w-full bg-transparent text-[#1a2e1e] text-sm outline-none placeholder-[#8aab98] pr-8 disabled:opacity-50"
                                      />
                                        <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} tabIndex={-1} className="absolute right-3 text-[#8aab98] hover:text-[#1a5c3c] transition-colors cursor-pointer">
                                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {resetErrors.newPassword && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{resetErrors.newPassword.message}</p>
                                    )}
                                  </div>

                                  {/* Confirm Password */}
                                  <div className="relative">
                                      <div className={inputWrap('confirmNewPassword', Boolean(resetErrors.confirmNewPassword))}>
                                        <Lock className="w-4 h-4 text-[#2d7a56] shrink-0 mr-2.5" />
                                        <input
                                          id="reset-confirm-password"
                                          type={showConfirmPassword ? 'text' : 'password'}
                                          autoComplete="new-password"
                                          disabled={isLoading}
                                          {...registerReset('confirmNewPassword')}
                                          onFocus={() => { setFocusedField('confirmNewPassword'); setServerError(null) }}
                                          onBlur={() => setFocusedField(null)}
                                          placeholder="Confirm New Password"
                                          className="w-full bg-transparent text-[#1a2e1e] text-sm outline-none placeholder-[#8aab98] pr-8 disabled:opacity-50"
                                        />
                                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1} className="absolute right-3 text-[#8aab98] hover:text-[#1a5c3c] transition-colors cursor-pointer">
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                          </button>
                                      </div>
                                      {resetErrors.confirmNewPassword && (
              <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{resetErrors.confirmNewPassword.message}</p>
                                      )}
                                    </div>

                                    <button
                                      type="submit"
                                      disabled={isLoading}
                                      className="w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 mt-1 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(26,92,60,0.35)] hover:shadow-[0_6px_20px_rgba(26,92,60,0.5)] hover:-translate-y-0.5"
                                      style={{ background: 'linear-gradient(135deg, #1a5c3c, #2d7a56)' }}
                                    >
                                      {isLoading ? (
              <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Updating Password...</span></div>
                                      ) : (
              <span>Reset Password →</span>
                                      )}
                                    </button>
                                  </form>
      )}

                                  {/* STAGE 3: SUCCESS STATE */}
                                  {stage === 'success' && (
                                        <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                                          <div className="w-14 h-14 rounded-full bg-[#e8f5ed] border border-[#2d7a56]/30 text-[#1a5c3c] flex items-center justify-center shadow-[0_0_20px_rgba(26,92,60,0.2)]">
                                            <CheckCircle2 className="w-8 h-8" />
                                          </div>
                                            <h2 className="text-xl font-bold text-[#1a2e1e]">Password Reset Successful</h2>
                                            <p className="text-xs text-[#5a7a6a] max-w-xs leading-relaxed">
                                              Your password has been updated. You can now sign in with your new credentials.
                                            </p>
                                            <button
                                              type="button"
                                              onClick={() => onSuccess(email)}
                                              className="w-full h-11 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(26,92,60,0.35)] hover:shadow-[0_6px_20px_rgba(26,92,60,0.5)]"
                                              style={{ background: 'linear-gradient(135deg, #1a5c3c, #2d7a56)' }}
                                            >
                                              Proceed to Login →
                                            </button>
                                        </div>
      )}
                                      </div>
                                      )
}
