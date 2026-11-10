import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Heart,
  Home,
  Menu,
  X,
  User,
  Check,
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound,
} from 'lucide-react'
import { authApi } from '../api/auth'


// Google official 4-color G icon
function GoogleIcon() {
  return (
    <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12c0 2.02.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  )
}

// Microsoft official 4-color square icon
function MicrosoftIcon() {
  return (
    <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 21 21" aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}

interface LoginProps {
  defaultMode?: 'login' | 'register'
}

export default function Login({ defaultMode = 'login' }: LoginProps) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // State
  const [isRegister, setIsRegister] = useState(
    defaultMode === 'register' || searchParams.get('mode') === 'register'
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState(() => localStorage.getItem('scnswf_remember_email') || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(() => Boolean(localStorage.getItem('scnswf_remember_email')))

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successToast, setSuccessToast] = useState<string | null>(null)

  // Multi-Step Password Recovery
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotStep, setForgotStep] = useState<'email' | 'otp' | 'new_password'>('email')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const [cooldown, setCooldown] = useState(0)

  // Google Account Selector simulation modal
  const [showGoogleModal, setShowGoogleModal] = useState(false)
  const [customGoogleEmail, setCustomGoogleEmail] = useState('')
  const [customGoogleName, setCustomGoogleName] = useState('')

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const toggleMode = (targetRegister: boolean) => {
    setIsRegister(targetRegister)
    setErrorMsg('')
  }

  // Handle standard email + password form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.')
      return
    }

    if (!password) {
      setErrorMsg('Please enter your password.')
      return
    }

    if (isRegister) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.')
        return
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.')
        return
      }
    }

    setIsLoading(true)

    try {
      if (isRegister) {
        // Register API call
        const data = await authApi.register({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
        })

        if (data?.access) {
          localStorage.setItem('access_token', data.access)
          localStorage.setItem('auth_user', JSON.stringify(data.user))
        }

        if (rememberMe) {
          localStorage.setItem('scnswf_remember_email', email.trim().toLowerCase())
        } else {
          localStorage.removeItem('scnswf_remember_email')
        }

        setSuccessToast(`Welcome to SCNSWF, ${data.user.name || name}! Your account is ready.`)
        setTimeout(() => {
          navigate('/')
        }, 1300)
      } else {
        // Login API call
        const data = await authApi.login({
          email: email.trim().toLowerCase(),
          password,
        })

        if (data?.access) {
          localStorage.setItem('access_token', data.access)
          localStorage.setItem('auth_user', JSON.stringify(data.user))
        }

        if (rememberMe) {
          localStorage.setItem('scnswf_remember_email', email.trim().toLowerCase())
        } else {
          localStorage.removeItem('scnswf_remember_email')
        }

        setSuccessToast(`Welcome back, ${data.user.name || 'Member'}! Logged in successfully.`)
        setTimeout(() => {
          navigate('/')
        }, 1200)
      }
    } catch (err: any) {
      const apiError =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err?.response?.data?.error
      if (apiError) {
        setErrorMsg(apiError)
      } else {
        setErrorMsg('Unable to connect to authentication server. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google Auth
  const handleGoogleAuth = async (userProfile?: { email: string; name: string; avatar?: string }) => {
    setIsLoading(true)
    setErrorMsg('')
    setShowGoogleModal(false)

    const googleUser = userProfile || {
      email: 'suresh.nayak@gmail.com',
      name: 'Suresh Nayak',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    }

    try {
      const data = await authApi.googleAuth({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
      })

      if (data?.access) {
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
      }

      setSuccessToast(
        isRegister
          ? `Signed up with Google as ${googleUser.name}! Welcome to SCNSWF.`
          : `Signed in with Google as ${googleUser.name}!`
      )

      setTimeout(() => {
        navigate('/')
      }, 1300)
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Google authentication failed. Please try again.'
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Microsoft Auth
  const handleMicrosoftAuth = () => {
    handleGoogleAuth({
      email: 'member.odisha@outlook.com',
      name: 'Odisha Community Member',
    })
  }

  // Step 1: Request Password Reset OTP
  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your registered email address.')
      return
    }

    setForgotLoading(true)
    try {
      const res = await authApi.forgotPassword(forgotEmail.trim().toLowerCase())
      setForgotSuccess(res.message || 'Verification code sent to your email.')
      setCooldown(res.resend_cooldown || 60)
      setForgotStep('otp')
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Failed to dispatch reset code. Please try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')

    if (!forgotOtp.trim() || forgotOtp.length !== 6) {
      setForgotError('Please enter the complete 6-digit verification code.')
      return
    }

    setForgotLoading(true)
    try {
      await authApi.verifyResetOtp(forgotEmail.trim().toLowerCase(), forgotOtp.trim())
      setForgotSuccess('Code verified! Enter your new password.')
      setForgotStep('new_password')
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Invalid or expired verification code.')
    } finally {
      setForgotLoading(false)
    }
  }

  // Step 3: Set New Password
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')

    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters.')
      return
    }

    setForgotLoading(true)
    try {
      const res = await authApi.resetPassword({
        email: forgotEmail.trim().toLowerCase(),
        otp: forgotOtp.trim(),
        newPassword,
      })
      setForgotSuccess(res.message || 'Password reset successfully!')
      setTimeout(() => {
        setShowForgotModal(false)
        setForgotStep('email')
        setForgotEmail('')
        setForgotOtp('')
        setNewPassword('')
        setIsRegister(false)
        setSuccessToast('Password reset successfully! Please sign in with your new password.')
      }, 1500)
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans select-none bg-[#0a2e1f]">
      {/* Background layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-no-repeat bg-[center_left] lg:bg-center"
        style={{
          backgroundImage: `url('/images/login-clean-bg.jpg')`,
        }}
        aria-hidden="true"
      >
        {/* Soft top gradient to ensure navbar text contrast while preserving sunny daylight */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* TOP NAVBAR */}
      <header className="relative z-20 w-full pt-4 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group" aria-label="SCNSWF Home">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/95 p-1.5 flex items-center justify-center shadow-md backdrop-blur-xs group-hover:scale-105 transition-transform border border-white/60 shrink-0">
              <img
                src="/images/scnswf-lotus-flower.png"
                alt="SCNSWF Lotus Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="h-8 w-[1.5px] bg-white/40" />
            <div className="flex flex-col text-white">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-wider leading-none">
                SCNSWF
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-200 tracking-wide font-medium mt-0.5">
                Healthcare for All
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-white font-medium text-sm">
            <Link to="/" className="flex items-center gap-1.5 py-1 text-white hover:text-emerald-200 transition-colors">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link to="/about" className="py-1 hover:text-emerald-200 transition-colors">
              About
            </Link>
            <Link to="/programs" className="py-1 hover:text-emerald-200 transition-colors">
              Our Work
            </Link>
            <Link to="/get-involved" className="py-1 hover:text-emerald-200 transition-colors">
              Get Involved
            </Link>

            <Link
              to="/donate"
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/80 bg-white/10 hover:bg-white hover:text-[#082e23] transition-all text-white font-semibold text-sm shadow-xs backdrop-blur-xs cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white hover:fill-[#082e23]" />
              <span>Donate</span>
            </Link>
          </nav>

          {/* Mobile Right: Donate + Hamburger */}
          <div className="flex items-center gap-2.5 md:hidden">
            <Link
              to="/donate"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/80 bg-white/15 text-white text-xs font-semibold"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-white bg-black/25 backdrop-blur-xs border border-white/20 focus:outline-hidden min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 bg-[#082e23]/95 backdrop-blur-md rounded-2xl border border-white/20 text-white space-y-2.5 shadow-2xl animate-fadeIn">
            <Link
              to="/"
              className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className="block py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/programs"
              className="block py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Work
            </Link>
            <Link
              to="/get-involved"
              className="block py-2.5 px-3 rounded-xl hover:bg-white/10 text-sm font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Involved
            </Link>
            <Link
              to="/donate"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-center mt-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate to SCNSWF</span>
            </Link>
          </div>
        )}
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT COLUMN: Open space allowing the 4 smiling children in the background to shine clearly */}
          <div className="hidden lg:block lg:col-span-7" aria-hidden="true" />

          {/* RIGHT COLUMN: Refined Login & Register Card matching brand design */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[420px] sm:max-w-[440px] bg-white/90 sm:bg-white/92 backdrop-blur-md rounded-[28px] sm:rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-6 sm:p-7 md:p-8 border border-white/80 transition-all duration-300 mx-auto lg:ml-auto lg:mr-0">
              {/* Card Brand Header */}
              <div className="text-center mb-3">
                <img
                  src="/images/scnswf-lotus-flower.png"
                  alt="SCNSWF Lotus Logo"
                  className="h-12 sm:h-14 w-auto mx-auto object-contain drop-shadow-xs"
                />
                <h1 className="font-heading font-extrabold text-2xl sm:text-[26px] text-[#166534] tracking-wider leading-none mt-2">
                  SCNSWF
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-[#166534] tracking-wide mt-1">
                  Healthcare for All
                </p>
              </div>

              {/* Title & Underline */}
              <div className="text-center mb-5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#166534] tracking-tight">
                  {isRegister ? 'Register' : 'Login'}
                </h2>
                <div className="w-12 h-0.5 bg-[#166534] rounded-full mx-auto mt-1.5" />
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2 animate-shake"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="flex-1 font-medium">{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} method="POST" className="space-y-3.5 sm:space-y-4">
                {/* Full Name field (Register mode) */}
                {isRegister && (
                  <div>
                    <label htmlFor="auth-name" className="sr-only">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="auth-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-white/95 text-gray-900 text-sm sm:text-base rounded-2xl border border-gray-200 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 transition-all outline-hidden placeholder-gray-400 min-h-[48px] shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Email or Username */}
                <div>
                  <label htmlFor="auth-email" className="sr-only">
                    Email or Username
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      id="auth-email"
                      name="email"
                      type="text"
                      autoComplete="username"
                      spellCheck="false"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email or Username"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-white/95 text-gray-900 text-sm sm:text-base rounded-2xl border border-gray-200 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 transition-all outline-hidden placeholder-gray-400 min-h-[48px] shadow-xs"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="auth-password" className="sr-only">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                      id="auth-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-11 pr-12 py-3 bg-white/95 text-gray-900 text-sm sm:text-base rounded-2xl border border-gray-200 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 transition-all outline-hidden placeholder-gray-400 min-h-[48px] shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-gray-400 hover:text-gray-700 transition-colors p-1.5 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Register mode) */}
                {isRegister && (
                  <div>
                    <label htmlFor="auth-confirm-password" className="sr-only">
                      Confirm Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                      <input
                        id="auth-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className="w-full pl-11 pr-12 py-3 bg-white/95 text-gray-900 text-sm sm:text-base rounded-2xl border border-gray-200 focus:border-[#166534] focus:ring-2 focus:ring-[#166534]/20 transition-all outline-hidden placeholder-gray-400 min-h-[48px] shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-700 transition-colors p-1.5 cursor-pointer"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me & Forgot Password */}
                {!isRegister && (
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-700 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded-md border-gray-300 text-[#166534] focus:ring-[#166534] cursor-pointer"
                      />
                      <span className="font-medium text-gray-600">Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email)
                        setForgotStep('email')
                        setForgotError('')
                        setForgotSuccess('')
                        setShowForgotModal(true)
                      }}
                      className="font-semibold text-[#166534] hover:underline transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-full bg-[#166534] hover:bg-[#14532d] active:scale-[0.99] text-white font-semibold text-base sm:text-lg flex items-center justify-center gap-2 shadow-md transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer min-h-[48px] mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isRegister ? 'Register' : 'Login'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-4 sm:my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <span className="relative px-3 bg-white/90 text-xs text-gray-400 font-medium uppercase tracking-wider">
                  or continue with
                </span>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-white active:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-700 min-h-[44px] cursor-pointer"
                >
                  <GoogleIcon />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleMicrosoftAuth}
                  disabled={isLoading}
                  className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-white active:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-xs sm:text-[13px] font-semibold text-gray-700 min-h-[44px] cursor-pointer"
                >
                  <MicrosoftIcon />
                  <span>Microsoft</span>
                </button>
              </div>

              {/* Footer Switcher */}
              <div className="text-center mt-5 sm:mt-6 text-xs sm:text-sm text-gray-600 font-medium">
                {isRegister ? (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => toggleMode(false)}
                      className="font-bold text-[#166534] hover:underline cursor-pointer ml-1"
                    >
                      Login
                    </button>
                  </p>
                ) : (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => toggleMode(true)}
                      className="font-bold text-[#166534] hover:underline cursor-pointer ml-1"
                    >
                      Register Now
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM SPACER: allows the background wave ribbon to be visible */}
      <footer className="relative z-10 w-full h-10 sm:h-14 lg:h-16 pointer-events-none select-none" aria-hidden="true" />

      {/* MULTI-STEP PASSWORD RECOVERY MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-gray-200">
            <button
              onClick={() => {
                setShowForgotModal(false)
                setForgotStep('email')
                setForgotError('')
                setForgotSuccess('')
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#105e49] flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {forgotStep === 'email' && 'Reset Password'}
                {forgotStep === 'otp' && 'Verify 6-Digit Code'}
                {forgotStep === 'new_password' && 'Enter New Password'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {forgotStep === 'email' && 'Enter your registered email to receive a verification code.'}
                {forgotStep === 'otp' && `Enter the 6-digit code sent to ${forgotEmail}.`}
                {forgotStep === 'new_password' && 'Create a strong new password for your account.'}
              </p>
            </div>

            {forgotError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {/* Step 1: Email */}
            {forgotStep === 'email' && (
              <form onSubmit={handleRequestResetOtp} className="space-y-4">
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter registered email"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#105e49] focus:ring-2 focus:ring-[#105e49]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-[#082e23] hover:bg-[#105e49] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Code</span>}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {forgotStep === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <p id="otp-hint" className="text-xs text-gray-500 mb-2 text-center">
                    Enter the 6-digit code delivered to your email.
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    aria-describedby="otp-hint"
                    className="w-full py-3 px-4 text-center text-2xl font-mono tracking-[0.35em] bg-gray-50 rounded-xl border border-gray-200 focus:outline-hidden focus:border-[#105e49] focus:ring-2 focus:ring-[#105e49]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-[#082e23] hover:bg-[#105e49] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Verify Code</span>}
                </button>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('email')}
                    className="text-gray-600 hover:underline cursor-pointer"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    disabled={cooldown > 0 || forgotLoading}
                    onClick={handleRequestResetOtp}
                    className="text-[#105e49] font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {forgotStep === 'new_password' && (
              <form onSubmit={handleSetNewPassword} className="space-y-4">
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 chars)"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:border-[#105e49] focus:ring-2 focus:ring-[#105e49]/20"
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl bg-[#082e23] hover:bg-[#105e49] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* GOOGLE SIMULATION / SELECTOR MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-gray-200">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 mb-3 shadow-2xs">
                <GoogleIcon />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {isRegister ? 'Sign up with Google' : 'Sign in with Google'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">to continue to SCNSWF — Suresh Chandra Nayak Foundation</p>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Choose an account
              </p>

              <button
                type="button"
                onClick={() =>
                  handleGoogleAuth({
                    email: 'suresh.nayak@gmail.com',
                    name: 'Suresh Nayak',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                  SN
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-900 truncate">
                    Suresh Nayak
                  </p>
                  <p className="text-xs text-gray-500 truncate">suresh.nayak@gmail.com</p>
                </div>
                <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleGoogleAuth({
                    email: 'volunteer.partner@gmail.com',
                    name: 'Volunteer Advocate',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                  })
                }
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-emerald-50 hover:border-emerald-200 transition-all text-left group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  VA
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-emerald-900 truncate">
                    Volunteer Advocate
                  </p>
                  <p className="text-xs text-gray-500 truncate">volunteer.partner@gmail.com</p>
                </div>
                <Check className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Or enter your own Google account details:</p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Priya Sharma)"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#105e49]"
                />
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 rounded-lg border border-gray-200 focus:outline-hidden focus:border-[#105e49]"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!customGoogleEmail.trim()) return
                    handleGoogleAuth({
                      email: customGoogleEmail.trim(),
                      name: customGoogleName.trim() || customGoogleEmail.split('@')[0],
                    })
                  }}
                  disabled={!customGoogleEmail.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#105e49] hover:bg-[#082e23] disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Continue with this account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS TOAST NOTIFICATION */}
      {successToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md bg-[#082e23] text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-400/30 flex items-center gap-3 animate-slideUp"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold">{successToast}</span>
        </div>
      )}
    </div>
  )
}
