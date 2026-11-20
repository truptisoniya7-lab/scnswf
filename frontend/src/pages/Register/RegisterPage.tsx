import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { AuthShell } from '../../components/AuthShell'
import { StepIndicator } from './components/StepIndicator'
import { DetailsStep } from './steps/DetailsStep'
import { OtpStep } from './steps/OtpStep'
import { RoleStep } from './steps/RoleStep'
import { passwordlessAuthApi } from '../../lib/api/auth'
import type { DetailsStepForm } from '../../lib/validation'
import { Check } from 'lucide-react'

export default function RegisterPage() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  // Redirect if already logged in
  useEffect(() => {
    const user = passwordlessAuthApi.getCurrentUser()
    if (user) {
      navigate('/profile', { replace: true })
    }
  }, [navigate])

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [formData, setFormData] = useState<DetailsStepForm>({
    name: '',
    phone: '',
    email: '',
  })
  const [registrationId, setRegistrationId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  // Step 1: Submit Details -> call POST /auth/register/start
  const handleDetailsSubmit = async (values: DetailsStepForm) => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      setFormData(values)
      const res = await passwordlessAuthApi.registerStart(values)
      setRegistrationId(res.registrationId)
      setDirection(1)
      setStep(2)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Something went wrong. Please check your details and try again.'
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Submit OTP -> call POST /auth/register/verify
  const handleOtpSubmit = async (otp: string) => {
    if (!registrationId) return
    setIsLoading(true)
    setErrorMsg(null)
    try {
      await passwordlessAuthApi.registerVerify({
        registrationId,
        otp,
      })
      setDirection(1)
      setStep(3)
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

  // Step 2: Resend OTP -> call POST /auth/register/resend
  const handleResendOtp = async () => {
    if (!registrationId) return
    setIsResending(true)
    setErrorMsg(null)
    try {
      await passwordlessAuthApi.registerResend({ registrationId })
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

  // Step 3: Complete Registration -> call POST /auth/register/complete
  const handleRoleComplete = async (role: 'internship' | 'donor' | 'volunteer') => {
    if (!registrationId) return
    setIsLoading(true)
    setErrorMsg(null)
    try {
      await passwordlessAuthApi.registerComplete({
        registrationId,
        role,
      })
      // Show 600ms green check animation before redirect
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/profile', { replace: true })
      }, 600)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        'Failed to complete registration. Please try again.'
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
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-[var(--green-300,#6ee7b7)] hover:text-[var(--green-400,#34d399)] transition-colors hover:underline"
          >
            Log in
          </Link>
        </p>
      }
    >
      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* Success Overlay */}
      {isSuccess ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[var(--green-400,#34d399)] text-[var(--bg-deep,#04140c)] flex items-center justify-center shadow-[0_0_24px_rgba(52,211,153,0.6)] animate-bounce">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
          <h2 className="text-xl font-bold font-heading text-[var(--text,#e8fff3)]">
            Account created!
          </h2>
          <p className="text-xs text-[var(--text-muted,#9bc9b0)]">
            Redirecting to your profile...
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
              <DetailsStep
                initialValues={formData}
                onSubmit={handleDetailsSubmit}
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
                email={formData.email}
                onSubmitOtp={handleOtpSubmit}
                onResendOtp={handleResendOtp}
                onBackToDetails={() => {
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

          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <RoleStep
                onCompleteRegistration={handleRoleComplete}
                isLoading={isLoading}
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
