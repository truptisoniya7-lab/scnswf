import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AuthShell } from '../../components/AuthShell'
import { EmailStep } from './steps/EmailStep'
import { OtpStep } from './steps/OtpStep'
import { PasswordStep } from './steps/PasswordStep'
import { ForgotPasswordStep } from './steps/ForgotPasswordStep'
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
  const [step, setStep] = useState<1 | 2>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [email, setEmail] = useState(() => localStorage.getItem('scnswf_last_email') || 'adityahota777@gmail.com')
  const [loginId, setLoginId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSuccessfulAuth = (user: any) => {
    setIsSuccess(true)
    const isStaffOrAdmin =
      user.systemRole === 'staff' ||
      user.systemRole === 'superadmin' ||
      user.role === 'super_admin' ||
      user.role === 'admin'

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
        'Failed to request verification code. Please try again.'
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
      handleSuccessfulAuth(res.user)
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

  return (
    <AuthShell
      footerLink={
        <p>
          New here?{' '}
          <Link
            to="/register"
            className="font-bold text-[var(--green-300,#6ee7b7)] hover:text-[var(--green-400,#34d399)] transition-colors hover:underline"
          >
            Create an account
          </Link>
        </p>
      }
    >
      {/* Success Animation */}
      {isSuccess ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[var(--green-400,#34d399)] text-[var(--bg-deep,#04140c)] flex items-center justify-center shadow-[0_0_24px_rgba(52,211,153,0.6)] animate-bounce">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
          <h2 className="text-xl font-bold font-heading text-[var(--text,#e8fff3)]">
            Verified!
          </h2>
          <p className="text-xs text-[var(--text-muted,#9bc9b0)]">
            Redirecting you now...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mode Switcher Tabs (Only shown when not in forgot-password or in step 2 of OTP) */}
          {mode !== 'forgot' && step === 1 && (
            <div className="flex items-center justify-center p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[var(--glass-border,rgba(110,231,183,0.15))] mb-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null)
                  setMode('otp')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === 'otp'
                    ? 'bg-[var(--green-500,#1f9d62)] text-[var(--bg-deep,#04140c)] shadow-sm'
                    : 'text-[var(--text-muted,#9bc9b0)] hover:text-[var(--text,#e8fff3)]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Login with OTP</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null)
                  setMode('password')
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  mode === 'password'
                    ? 'bg-[var(--green-500,#1f9d62)] text-[var(--bg-deep,#04140c)] shadow-sm'
                    : 'text-[var(--text-muted,#9bc9b0)] hover:text-[var(--text,#e8fff3)]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Login with Password</span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            {/* OPTION 1: OTP FLOW */}
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
                      onBackToEmail={() => {
                        setDirection(-1)
                        setErrorMsg(null)
                        setStep(1)
                      }}
                      isLoading={isLoading}
                      isResending={isResending}
                      errorMsg={errorMsg}
                      onClearError={() => setErrorMsg(null)}
                    />
                  </motion.div>
                )}
              </>
            )}

            {/* OPTION 2: PASSWORD LOGIN FLOW */}
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
                  onForgotPassword={() => {
                    setErrorMsg(null)
                    setMode('forgot')
                  }}
                  isLoading={isLoading}
                  serverError={errorMsg}
                  onClearServerError={() => setErrorMsg(null)}
                />
              </motion.div>
            )}

            {/* OPTION 3: FORGOT PASSWORD FLOW */}
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
                  onBack={() => {
                    setErrorMsg(null)
                    setMode('password')
                  }}
                  onSuccess={(updatedEmail) => {
                    setEmail(updatedEmail)
                    setErrorMsg(null)
                    setMode('password')
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AuthShell>
  )
}
