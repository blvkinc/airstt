import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User, X } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { Label } from '../shared/ui/label'
import { useAuth } from '../shared/context/AuthContext'
import { hasRequiredCustomerProfile } from '../shared/lib/customerProfileCompletion'
import { cn } from '../shared/lib/utils'
import sttLogo from '../shared/assets/sttmainlogo.svg'
import {
  clearStoredCustomerSession,
  requestCustomerPasswordResetWithApi,
  resetCustomerPasswordWithApi,
  verifyCustomerEmailWithApi,
} from '../shared/lib/customerAuthApi'

const getSanitizedRedirect = (value) => {
  if (!value || typeof value !== 'string') return '/'
  if (!value.startsWith('/') || value.startsWith('//')) return '/'
  return value
}

const brandLogoFilter = {
  filter: 'brightness(0) saturate(100%) invert(59%) sepia(19%) saturate(761%) hue-rotate(238deg) brightness(88%) contrast(87%)',
}

const AuthPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    login,
    register,
    updateUser,
    logout,
    isAuthenticated,
    loading,
    user,
    requiresProfileCompletion,
  } = useAuth()
  const [view, setView] = useState('login')
  const [submitting, setSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState('idle')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [postAuthRedirect, setPostAuthRedirect] = useState(null)
  const verificationAttemptedRef = useRef(new Set())
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
  })

  const redirectTarget = useMemo(
    () => getSanitizedRedirect(searchParams.get('redirect') || location.state?.from?.pathname),
    [location.state?.from?.pathname, searchParams]
  )
  const resetEmail = useMemo(() => (searchParams.get('email') || '').trim(), [searchParams])
  const resetToken = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams])
  const verifyToken = useMemo(() => (searchParams.get('token') || '').trim(), [searchParams])
  const explicitMode = searchParams.get('mode')
  const confirmationEmail = useMemo(
    () => (searchParams.get('email') || user?.email || formData.email || '').trim(),
    [formData.email, searchParams, user?.email]
  )

  useEffect(() => {
    if (location.pathname === '/auth/reset-password' || (explicitMode === 'reset' && resetToken && resetEmail)) {
      setView('reset')
      setFormData((prev) => ({ ...prev, email: resetEmail }))
      return
    }

    if (location.pathname === '/auth/verify-email' || explicitMode === 'verify') {
      setView('verify')
      return
    }

    if (explicitMode === 'check-email') {
      setView('check-email')
      return
    }

    if (explicitMode === 'complete-profile') {
      setView('complete-profile')
      return
    }

    if (explicitMode === 'register') {
      setView('register')
      return
    }

    setView('login')
  }, [explicitMode, location.pathname, resetEmail, resetToken])

  useEffect(() => {
    if (view !== 'verify' || !verifyToken) return
    if (verificationAttemptedRef.current.has(verifyToken)) return

    verificationAttemptedRef.current.add(verifyToken)
    let ignore = false

    setVerificationStatus('verifying')
    setError('')
    setSuccess('')

    ;(async () => {
      try {
        const result = await verifyCustomerEmailWithApi({ token: verifyToken })
        if (ignore) return

        if (result.outcome === 'verified' || result.outcome === 'already_verified') {
          clearStoredCustomerSession()
          setSuccess('Your email is verified. Please sign in to continue.')
          setVerificationStatus('verified')
        } else {
          setError(result.message || 'This verification link is invalid or expired.')
          setVerificationStatus('invalid')
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || 'Unable to verify your email.')
          setVerificationStatus('error')
        }
      }
    })()

    return () => {
      ignore = true
    }
  }, [verifyToken, view])

  useEffect(() => {
    if (view !== 'complete-profile' || !user) return

    const profile = user.profile || {}

    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || profile.firstName || '',
      lastName: prev.lastName || profile.lastName || '',
      phone: prev.phone || profile.phone || '',
      email: prev.email || user.email || '',
    }))
  }, [user, view])

  const isLogin = view === 'login'
  const isRegister = view === 'register'
  const isForgotPassword = view === 'forgot'
  const isResetPassword = view === 'reset'
  const isVerifyEmail = view === 'verify'
  const isCheckEmail = view === 'check-email'
  const isCompleteProfile = view === 'complete-profile'

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = (nextView = 'login') => {
    setView(nextView)
    setFormData((prev) => ({
      ...prev,
      password: '',
      confirmPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (isForgotPassword) {
        await requestCustomerPasswordResetWithApi({ email: formData.email })
        setSuccess('If an account exists for this email, we will send a password reset link.')
      } else if (isResetPassword) {
        if (formData.newPassword !== formData.confirmNewPassword) {
          setError('Passwords do not match')
          setSubmitting(false)
          return
        }

        await resetCustomerPasswordWithApi({
          email: resetEmail || formData.email,
          token: resetToken,
          password: formData.newPassword,
          passwordConfirmation: formData.confirmNewPassword,
        })

        setSuccess('Password updated successfully. You can now sign in.')
        window.setTimeout(() => navigate(`/auth?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true }), 1200)
      } else if (isLogin) {
        if (!formData.email.trim() || !formData.password) {
          setError('Enter your email and password to continue.')
          setSubmitting(false)
          return
        }

        const result = await login(formData.email.trim(), formData.password)
        if (result.success) {
          if (result.requiresProfileCompletion) {
            navigate(`/auth?mode=complete-profile&redirect=${encodeURIComponent(redirectTarget)}`, { replace: true })
          } else {
            setSuccess('Signed in successfully. Redirecting...')
            setPostAuthRedirect(redirectTarget)
          }
        } else {
          setError(result.error || 'Login failed')
        }
      } else if (isRegister) {
        if (!formData.email.trim() || !formData.password) {
          setError('Enter your email and password to continue.')
          setSubmitting(false)
          return
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setSubmitting(false)
          return
        }

        const result = await register({
          email: formData.email.trim(),
          password: formData.password,
        })

        if (result.success) {
          setSuccess('Account created. Check your email to verify your account.')
          navigate(`/auth?mode=check-email&email=${encodeURIComponent(result.user?.email || formData.email.trim())}&redirect=${encodeURIComponent(redirectTarget)}`, { replace: true })
        } else {
          setError(result.error || 'Registration failed')
        }
      } else if (isCompleteProfile) {
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
          setError('First name, last name, and phone number are required.')
          setSubmitting(false)
          return
        }

        await updateUser({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
        })

        setSuccess('Profile completed successfully. Redirecting...')
        setPostAuthRedirect(redirectTarget)
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    }

    setSubmitting(false)
  }

  if (!loading && isAuthenticated && !isVerifyEmail && !isCheckEmail && !isCompleteProfile && !requiresProfileCompletion) {
    return <Navigate to={postAuthRedirect || redirectTarget} replace />
  }

  if (!loading && isCompleteProfile && !isAuthenticated) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(redirectTarget)}`} replace />
  }

  if (!loading && isCompleteProfile && isAuthenticated && !requiresProfileCompletion && hasRequiredCustomerProfile(user)) {
    return <Navigate to={postAuthRedirect || redirectTarget} replace />
  }

  const title = isForgotPassword
    ? 'Reset password'
    : isResetPassword
      ? 'Set new password'
      : isVerifyEmail
        ? 'Verify your email'
        : isCheckEmail
          ? 'Check your email'
          : isCompleteProfile
            ? 'Complete your profile'
            : isRegister
              ? 'Create account'
              : 'Sign in'

  const description = isForgotPassword
    ? 'Enter your email to receive recovery instructions.'
    : isResetPassword
      ? 'Choose a new password for your account.'
      : isVerifyEmail
        ? verificationStatus === 'verifying' ? 'Verifying your account now.' : 'Review the verification status below.'
        : isCheckEmail
          ? 'Open the verification link, then return to sign in.'
          : isCompleteProfile
            ? 'Add the details we need before continuing to your account.'
            : isRegister
              ? 'Use your email and password to start booking.'
              : 'Use your account credentials to continue.'

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-5 text-gray-950 md:grid md:place-items-center md:px-6 md:py-10">
      <section className="mx-auto grid w-full max-w-[920px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.10)] md:grid-cols-[0.92fr_1.08fr]">
        <aside className="hidden min-h-[560px] flex-col justify-between bg-gray-950 p-8 text-white md:flex">
          <Link to="/" className="inline-flex w-fit items-center">
            <img src={sttLogo} alt="Set The Table" className="h-12 w-auto" />
          </Link>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.26em] text-brand-purple">Set The Table</p>
            <h2 className="mt-4 max-w-sm text-3xl font-extrabold leading-tight tracking-tight">Book the right table, venue, or event with confidence.</h2>
            <p className="mt-4 max-w-sm text-sm font-medium leading-6 text-white/70">Sign in to manage bookings, favorites, checkout, and account details from one place.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {['Events', 'Venues', 'Bookings'].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
                <p className="text-xs font-bold text-white/70">{item}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="relative px-5 py-6 sm:px-7 md:px-8 md:py-8">
          <div className="mb-7 flex items-center justify-between md:hidden">
            <Link to="/">
              <img src={sttLogo} alt="Set The Table" className="h-10 w-auto" style={brandLogoFilter} />
            </Link>
          </div>

          <Link to={redirectTarget || '/'} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-950" aria-label="Close">
            <X className="h-4 w-4" />
          </Link>

          <div className="pr-10">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950">{title}</h1>
            <p className="mt-2 text-sm font-medium leading-6 text-gray-500">{description}</p>
          </div>

          {(isLogin || isRegister) && (
            <div className="mt-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
              <button type="button" onClick={() => resetForm('login')} className={`h-10 rounded-md text-sm font-extrabold transition ${isLogin ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-950'}`}>
                Sign in
              </button>
              <button type="button" onClick={() => resetForm('register')} className={`h-10 rounded-md text-sm font-extrabold transition ${isRegister ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-600 hover:text-gray-950'}`}>
                Sign up
              </button>
            </div>
          )}

          {(error || success) && (
            <div className={cn('mt-5 rounded-lg border px-4 py-3 text-sm font-medium', error ? 'border-red-100 bg-red-50 text-red-700' : 'border-green-100 bg-green-50 text-green-700')}>
              {error || success}
            </div>
          )}

          {isVerifyEmail || isCheckEmail ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-600">
                <ShieldCheck className="mx-auto mb-3 h-6 w-6 text-[#6f55f6]" />
                {isCheckEmail && confirmationEmail ? `We sent a verification link to ${confirmationEmail}.` : 'Your verification status is ready.'}
              </div>
              <Button onClick={() => navigate(`/auth?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true })} className="w-full">
                Sign in
              </Button>
            </div>
          ) : isCompleteProfile ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="space-y-2">
                <Label className="text-xs font-bold text-gray-800">First name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input value={formData.firstName} onChange={(event) => handleInputChange('firstName', event.target.value)} className="h-11 rounded-lg border-gray-200 pl-11 shadow-sm focus-visible:ring-brand-purple/40" required />
                </div>
              </label>
              <label className="space-y-2">
                <Label className="text-xs font-bold text-gray-800">Last name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input value={formData.lastName} onChange={(event) => handleInputChange('lastName', event.target.value)} className="h-11 rounded-lg border-gray-200 pl-11 shadow-sm focus-visible:ring-brand-purple/40" required />
                </div>
              </label>
              <label className="space-y-2">
                <Label className="text-xs font-bold text-gray-800">Phone number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input value={formData.phone} onChange={(event) => handleInputChange('phone', event.target.value)} className="h-11 rounded-lg border-gray-200 pl-11 shadow-sm focus-visible:ring-brand-purple/40" required />
                </div>
              </label>
              <Button type="submit" disabled={submitting} className="h-11 w-full">
                {submitting ? 'Saving...' : 'Continue'}
              </Button>
            </form>
          ) : isForgotPassword ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input type="email" value={formData.email} onChange={(event) => handleInputChange('email', event.target.value)} placeholder="Email" className="h-11 rounded-lg border-gray-200 shadow-sm focus-visible:ring-brand-purple/40" required />
              <Button type="submit" disabled={submitting} className="h-11 w-full">
                {submitting ? 'Please wait...' : 'Send reset link'}
              </Button>
              <button type="button" onClick={() => setView('login')} className="block w-full text-center text-xs font-bold text-gray-500 underline">
                Back to sign in
              </button>
            </form>
          ) : isResetPassword ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input type="password" value={formData.newPassword} onChange={(event) => handleInputChange('newPassword', event.target.value)} placeholder="New password" className="h-11 rounded-lg border-gray-200 shadow-sm focus-visible:ring-brand-purple/40" required />
              <Input type="password" value={formData.confirmNewPassword} onChange={(event) => handleInputChange('confirmNewPassword', event.target.value)} placeholder="Confirm new password" className="h-11 rounded-lg border-gray-200 shadow-sm focus-visible:ring-brand-purple/40" required />
              <Button type="submit" disabled={submitting || !resetToken} className="h-11 w-full">
                {submitting ? 'Please wait...' : 'Update password'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-gray-800">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleInputChange('email', event.target.value)}
                    className="h-11 rounded-lg border-gray-200 pl-11 shadow-sm focus-visible:ring-brand-purple/40"
                    required
                  />
                </div>
              </label>
              {(isLogin || isRegister) && (
                <label className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold text-gray-800">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(event) => handleInputChange('password', event.target.value)}
                      className="h-11 rounded-lg border-gray-200 pl-11 pr-11 shadow-sm focus-visible:ring-brand-purple/40"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>
              )}

              {isRegister && (
                <label className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-gray-800">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(event) => handleInputChange('confirmPassword', event.target.value)}
                      className="h-11 rounded-lg border-gray-200 pl-11 pr-11 shadow-sm focus-visible:ring-brand-purple/40"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black"
                      aria-label={showConfirmPassword ? 'Hide confirmation password' : 'Show confirmation password'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </label>
              )}

              <Button type="submit" disabled={submitting} className="h-11 w-full">
                {submitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
              </Button>

              {isLogin && (
                <button type="button" onClick={() => resetForm('forgot')} className="block w-full pt-2 text-center text-xs font-bold text-gray-500 underline">
                  Forgot password?
                </button>
              )}

              <button
                type="button"
                onClick={() => resetForm(isRegister ? 'login' : 'register')}
                className="block w-full text-center text-xs font-bold text-gray-500 underline"
              >
                {isRegister ? 'Already have an account? Sign in' : 'New to Set The Table? Create an account'}
              </button>
            </form>
          )}

          {isCheckEmail && isAuthenticated && !user?.emailVerifiedAt && (
            <button type="button" onClick={async () => { await logout(); navigate(`/auth?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true }) }} className="mt-4 block w-full text-center text-xs font-bold text-gray-500 underline">
              Back to sign in
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default AuthPage
