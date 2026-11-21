import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AuthShell } from '../../components/AuthShell'
import { EmailStep } from './steps/EmailStep'
import { OtpStep } from './steps/OtpStep'
import { passwordlessAuthApi } from '../../lib/api/auth'
import type { EmailStepForm } from '../../lib/validation'
import { Check } from 'lucide-react'

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

  const [step, setStep] = useState<1 | 2>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [email, setEmail] = useState(() => localStorage.getItem('scnswf_last_email') || 'adityahota03@gmail.com')
  const [loginId, setLoginId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Step 1: Submit Email -> calls POST /auth/login/start
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

  // Step 2: Submit OTP -> calls POST /auth/login/verify
  const handleOtpSubmit = async (otp: string) => {
    if (!loginId) return
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await passwordlessAuthApi.loginVerify({
        loginId,
        otp,
      })
      // Show 600ms green check animation before redirect
      setIsSuccess(true)
      const user = res.user
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

  // Step 2: Resend OTP -> calls POST /auth/login/resend
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
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
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
              transition={{ duration: 0.3, ease: 'easeInOut' }}
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
        </AnimatePresence>
      )}
    </AuthShell>
  )
}
