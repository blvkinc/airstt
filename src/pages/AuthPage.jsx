import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Phone, ShieldCheck, User, X } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { Label } from '../shared/ui/label'
import { useAuth } from '../shared/context/AuthContext'
import { hasRequiredCustomerProfile } from '../shared/lib/customerProfileCompletion'
import { cn } from '../shared/lib/utils'
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

const providerEmails = {
  apple: 'apple.demo@setthetable.ae',
  facebook: 'facebook.demo@setthetable.ae',
  google: 'google.demo@setthetable.ae',
}

function GoogleMark() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function SocialButton({ provider, label, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(provider)}
      className="relative flex h-12 w-full items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-bold text-black transition hover:border-black hover:bg-gray-50"
    >
      <span className="absolute left-4 flex h-6 w-6 items-center justify-center">
        {provider === 'google' ? <GoogleMark /> : provider === 'facebook' ? <span className="text-xl font-bold text-[#1877f2]">f</span> : <span className="text-lg font-black text-black">A</span>}
      </span>
      {label}
    </button>
  )
}

const AuthPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    login,
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
  const [postAuthRedirect, setPostAuthRedirect] = useState(null)
  const verificationAttemptedRef = useRef(new Set())
  const [formData, setFormData] = useState({
    email: '',
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

  const isForgotPassword = view === 'forgot'
  const isResetPassword = view === 'reset'
  const isVerifyEmail = view === 'verify'
  const isCheckEmail = view === 'check-email'
  const isCompleteProfile = view === 'complete-profile'
  const isSimpleAuth = view === 'login'

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const finishDemoLogin = async (email) => {
    const result = await login(email, 'demo-password')
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
  }

  const handleSocialLogin = async (provider) => {
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await finishDemoLogin(providerEmails[provider] || 'demo@setthetable.ae')
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
      } else {
        if (!formData.email.trim()) {
          setError('Enter an email address to continue.')
          setSubmitting(false)
          return
        }

        await finishDemoLogin(formData.email.trim())
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
            : 'Login or sign up'

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
            : "We'll need to verify it's you"

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-6 text-black md:flex md:items-center md:justify-center">
      <section className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.16)] md:max-w-[430px]">
        <div className="relative h-20 overflow-hidden bg-[#dfe4dc]">
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(126,173,194,0.9)_0%,rgba(245,245,245,0.85)_35%,rgba(176,211,126,0.75)_100%)]" />
          <div className="absolute left-5 top-6 h-2 w-2 rounded-full bg-black" />
          <div className="absolute left-20 top-3 h-2 w-2 rounded-full bg-black" />
          <div className="absolute right-16 top-9 rounded-full bg-black px-2 py-1 text-[10px] font-bold text-white">4.8</div>
          <div className="absolute -bottom-12 left-0 right-0 h-24 rounded-t-[30px] bg-white" />
        </div>

        <div className="relative px-6 pb-7 pt-4">
          <Link to={redirectTarget || '/'} className="absolute right-5 top-3 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-black" aria-label="Close">
            <X className="h-4 w-4" />
          </Link>

          <h1 className="text-xl font-bold text-black">{title}</h1>
          <p className="mt-2 text-xs font-medium text-gray-500">{description}</p>

          {(error || success) && (
            <div className={cn('mt-5 rounded-2xl border px-4 py-3 text-sm', error ? 'border-red-100 bg-red-50 text-red-700' : 'border-green-100 bg-green-50 text-green-700')}>
              {error || success}
            </div>
          )}

          {isVerifyEmail || isCheckEmail ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center text-sm text-gray-600">
                <ShieldCheck className="mx-auto mb-3 h-6 w-6 text-[#6f55f6]" />
                {isCheckEmail && confirmationEmail ? `We sent a verification link to ${confirmationEmail}.` : 'Your demo verification status is ready.'}
              </div>
              <Button onClick={() => navigate(`/auth?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true })} className="w-full">
                Sign in
              </Button>
            </div>
          ) : isCompleteProfile ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="space-y-2">
                <Label className="text-xs font-bold text-black">First name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input value={formData.firstName} onChange={(event) => handleInputChange('firstName', event.target.value)} className="h-12 rounded-2xl border-gray-200 pl-11" required />
                </div>
              </label>
              <label className="space-y-2">
                <Label className="text-xs font-bold text-black">Last name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input value={formData.lastName} onChange={(event) => handleInputChange('lastName', event.target.value)} className="h-12 rounded-2xl border-gray-200 pl-11" required />
                </div>
              </label>
              <label className="space-y-2">
                <Label className="text-xs font-bold text-black">Phone number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input value={formData.phone} onChange={(event) => handleInputChange('phone', event.target.value)} className="h-12 rounded-2xl border-gray-200 pl-11" required />
                </div>
              </label>
              <Button type="submit" disabled={submitting} className="h-12 w-full">
                {submitting ? 'Saving...' : 'Continue'}
              </Button>
            </form>
          ) : isForgotPassword ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input type="email" value={formData.email} onChange={(event) => handleInputChange('email', event.target.value)} placeholder="Email" className="h-12 rounded-2xl border-gray-200" required />
              <Button type="submit" disabled={submitting} className="h-12 w-full">
                {submitting ? 'Please wait...' : 'Send reset link'}
              </Button>
              <button type="button" onClick={() => setView('login')} className="block w-full text-center text-xs font-bold text-gray-500 underline">
                Back to sign in
              </button>
            </form>
          ) : isResetPassword ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input type="password" value={formData.newPassword} onChange={(event) => handleInputChange('newPassword', event.target.value)} placeholder="New password" className="h-12 rounded-2xl border-gray-200" required />
              <Input type="password" value={formData.confirmNewPassword} onChange={(event) => handleInputChange('confirmNewPassword', event.target.value)} placeholder="Confirm new password" className="h-12 rounded-2xl border-gray-200" required />
              <Button type="submit" disabled={submitting || !resetToken} className="h-12 w-full">
                {submitting ? 'Please wait...' : 'Update password'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-black">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleInputChange('email', event.target.value)}
                    className="h-12 rounded-lg border-gray-300 pl-11"
                    required
                  />
                </div>
              </label>
              <p className="-mt-2 text-[11px] font-medium text-gray-500">We'll send you a verification code</p>
              <Button type="submit" disabled={submitting} className="h-12 w-full">
                {submitting ? 'Please wait...' : 'Continue'}
              </Button>

              <div className="flex items-center gap-4 py-2">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-[11px] font-bold text-gray-400">OR</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="space-y-3">
                <SocialButton provider="apple" label="Continue with Apple" onClick={handleSocialLogin} />
                <SocialButton provider="facebook" label="Continue with Facebook" onClick={handleSocialLogin} />
                <SocialButton provider="google" label="Continue with Google" onClick={handleSocialLogin} />
              </div>

              {isSimpleAuth && (
                <button type="button" onClick={() => setView('forgot')} className="block w-full pt-2 text-center text-xs font-bold text-gray-500 underline">
                  Forgot password?
                </button>
              )}
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
