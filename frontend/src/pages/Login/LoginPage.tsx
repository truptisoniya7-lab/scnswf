import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AuthShell } from '../../components/AuthShell'
import { EmailStep } from './steps/EmailStep'
import { OtpStep } from './steps/OtpStep'
import { PasswordStep } from './steps/PasswordStep'
import { ForgotPasswordStep } from './steps/ForgotPasswordStep'
import { SetPasswordStep, type SetPasswordFormValues } from './steps/SetPasswordStep'
import { passwordlessAuthApi } from '../../lib/api/auth'
import type { EmailStepForm, LoginPasswordForm } from '../../lib/validation'
import { Check, KeyRound, Mail } from 'lucide-react'

type AuthMode = 'otp' | 'password' | 'forgot'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const shouldReduceMotion = useReducedMotion()

  // Safe relative redirect URL
  const nextParam = searchParams.get('next')
  const safeNextUrl =
    nextParam && nextParam.startsWith('/') && !nextParam.startsWith('//')
      ? nextParam
      : '/profile'

  // Redirect if already logged in
  useEffect(() => {
    const user = passwordlessAuthApi.getCurrentUser()
    if (user) {
      navigate('/profile', { replace: true })
    }
  }, [navigate])

  const [mode, setMode] = useState<AuthMode>('otp')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [email, setEmail] = useState('')
  const [loginId, setLoginId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSuccessfulAuth = (user: any) => {
    setIsSuccess(true)
    const isStaffOrAdmin =
      user?.systemRole === 'staff' ||
      user?.systemRole === 'superadmin' ||
      user?.role === 'super_admin' ||
      user?.role === 'admin'

    const destination =
      safeNextUrl && safeNextUrl !== '/profile'
        ? safeNextUrl
        : isStaffOrAdmin
          ? '/admin'
          : '/profile'

    setTimeout(() => {
      navigate(destination, { replace: true })
    }, 600)
  }

  // OTP Login: Step 1 Submit Email
  const handleEmailSubmit = async (values: EmailStepForm) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      setEmail(values.email)
      localStorage.setItem('scnswf_last_email', values.email)
      const res = await passwordlessAuthApi.loginStart(values)
      setLoginId(res.loginId)
      setDirection(1)
      setStep(2)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to request verification code. Please check your connection and try again.'
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // OTP Login: Step 2 Submit OTP
  const handleOtpSubmit = async (otp: string) => {
    if (!loginId) return
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await passwordlessAuthApi.loginVerify({
        loginId,
        otp,
      })
      if (res.isNewUser) {
        // First-time user: transition to Set Password step
        setDirection(1)
        setStep(3)
        return
      }
      if (res.user) {
        handleSuccessfulAuth(res.user)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        "That code isn't right"
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // OTP Login: Step 3 Set Password (New User)
  const handleSetPasswordSubmit = async (values: SetPasswordFormValues) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await passwordlessAuthApi.setupPassword({
        email,
        password: values.password,
        name: values.name,
        phone: values.phone,
        role: values.role,
        bio: values.bio,
      })
      handleSuccessfulAuth(res.user)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to save your details. Please try again.'
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipSetPassword = async () => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await passwordlessAuthApi.setupPassword({
        email,
      })
      handleSuccessfulAuth(res.user)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to continue. Please try again.'
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // OTP Login: Resend OTP
  const handleResendOtp = async () => {
    if (!loginId) return
    setIsResending(true)
    setErrorMsg(null)
    try {
      await passwordlessAuthApi.loginResend({ loginId })
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to resend verification code. Please try again later.'
      setErrorMsg(msg)
      throw err
    } finally {
      setIsResending(false)
    }
  }

  // Password Login: Submit Credentials
  const handlePasswordSubmit = async (values: LoginPasswordForm) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      setEmail(values.email)
      localStorage.setItem('scnswf_last_email', values.email)
      const res = await passwordlessAuthApi.loginWithPassword(values)
      handleSuccessfulAuth(res.user)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Invalid email or password. Please try again.'
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const slideVariants = {
    enter: (dir: number) =>
      shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: dir > 0 ? 30 : -30 },
    center: { opacity: 1, x: 0 },
    exit: (dir: number) =>
      shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: dir > 0 ? -30 : 30 },
  }

  // Show Back button in shell on step 2, step 3, or forgot flow
  const showBack = mode === 'forgot' || (mode === 'otp' && step > 1)
  const handleShellBack = () => {
    if (mode === 'forgot') {
      setErrorMsg(null)
      setMode('password')
    } else if (mode === 'otp' && step === 3) {
      setDirection(-1)
      setErrorMsg(null)
      setStep(2)
    } else if (mode === 'otp' && step === 2) {
      setDirection(-1)
      setErrorMsg(null)
      setStep(1)
    }
  }

  return (
    <AuthShell
      showBack={showBack}
      onBack={handleShellBack}
      footerLink={
        <p>
          New here?{' '}
          <Link
            to="/register"
            className="font-bold text-[#1a5c3c] hover:text-[#2d7a56] transition-colors hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {/* Success Animation */}
      {isSuccess ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1a5c3c] text-white flex items-center justify-center shadow-[0_0_24px_rgba(26,92,60,0.5)] animate-bounce">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
          <h2 className="text-xl font-bold font-heading text-[#1a2e1e]">Verified!</h2>
          <p className="text-xs text-[#5a7a6a]">Redirecting you now...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mode Switcher Tabs */}
          {mode !== 'forgot' && step === 1 && (
            <div className="flex items-center justify-center p-1 rounded-xl bg-[#f0f7f4] border border-[#c8e6d8] mb-2">
              <button
                type="button"
                onClick={() => { setErrorMsg(null); setMode('otp') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === 'otp'
                    ? 'bg-[#1a5c3c] text-white shadow-sm'
                    : 'text-[#5a7a6a] hover:text-[#1a5c3c]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Login with OTP</span>
              </button>
              <button
                type="button"
                onClick={() => { setErrorMsg(null); setMode('password') }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === 'password'
                    ? 'bg-[#1a5c3c] text-white shadow-sm'
                    : 'text-[#5a7a6a] hover:text-[#1a5c3c]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Login with Password</span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            {/* OTP FLOW */}
            {mode === 'otp' && (
              <>
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <EmailStep
                      initialEmail={email}
                      onSubmit={handleEmailSubmit}
                      isLoading={isLoading}
                      serverError={errorMsg}
                      onClearServerError={() => setErrorMsg(null)}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step-2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <OtpStep
                      email={email}
                      onSubmitOtp={handleOtpSubmit}
                      onResendOtp={handleResendOtp}
                      onBackToEmail={() => { setDirection(-1); setErrorMsg(null); setStep(1) }}
                      isLoading={isLoading}
                      isResending={isResending}
                      errorMsg={errorMsg}
                      onClearError={() => setErrorMsg(null)}
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step-3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <SetPasswordStep
                      email={email}
                      onSubmit={handleSetPasswordSubmit}
                      onSkip={handleSkipSetPassword}
                      isLoading={isLoading}
                      serverError={errorMsg}
                      onClearServerError={() => setErrorMsg(null)}
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* PASSWORD LOGIN FLOW */}
            {mode === 'password' && (
              <motion.div
                key="password-login"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <PasswordStep
                  initialEmail={email}
                  onSubmit={handlePasswordSubmit}
                  onForgotPassword={() => { setErrorMsg(null); setMode('forgot') }}
                  isLoading={isLoading}
                  serverError={errorMsg}
                  onClearServerError={() => setErrorMsg(null)}
                />
              </motion.div>
            )}

            {/* FORGOT PASSWORD FLOW */}
            {mode === 'forgot' && (
              <motion.div
                key="forgot-password"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <ForgotPasswordStep
                  initialEmail={email}
                  onBack={() => { setErrorMsg(null); setMode('password') }}
                  onSuccess={(updatedEmail) => { setEmail(updatedEmail); setErrorMsg(null); setMode('password') }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AuthShell>
  )
}
