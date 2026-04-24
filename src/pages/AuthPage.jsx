import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, User, Phone } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { Card, CardContent } from '../shared/ui/card'
import { Checkbox } from '../shared/ui/checkbox'
import { Label } from '../shared/ui/label'
import { useAuth } from '../shared/context/AuthContext'
import { hasRequiredCustomerProfile } from '../shared/lib/customerProfileCompletion'
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

const AuthPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const {
    login,
    register,
    resendVerification,
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
  const [verificationResult, setVerificationResult] = useState(null)
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
    rememberMe: false,
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
    setVerificationResult(null)
    setError('')
    setSuccess('')

    ;(async () => {
      try {
        const result = await verifyCustomerEmailWithApi({ token: verifyToken })

        if (!ignore) {
          setVerificationResult(result)

          if (result.outcome === 'verified') {
            setSuccess('Your email has been verified. Please sign in again to continue.')
            setVerificationStatus('verified')
          } else if (result.outcome === 'already_verified') {
            setSuccess('Your email was already verified. Please sign in to continue.')
            setVerificationStatus('already_verified')
          } else {
            setError(result.message || 'This verification link is invalid or expired. Request a fresh email and try again.')
            setVerificationStatus('invalid_or_expired')
          }
        }

        if (result.outcome === 'verified' || result.outcome === 'already_verified') {
          clearStoredCustomerSession()
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

  const navigateToCheckEmail = (email) => {
    const nextParams = new URLSearchParams()
    nextParams.set('mode', 'check-email')
    if (redirectTarget !== '/') {
      nextParams.set('redirect', redirectTarget)
    }
    if (email) {
      nextParams.set('email', email)
    }

    navigate(`/auth?${nextParams.toString()}`, { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (isForgotPassword) {
        const payload = await requestCustomerPasswordResetWithApi({ email: formData.email })
        const debugResetToken = payload?.debug?.password_reset_token
        const debugResetUrl = debugResetToken
          ? `${window.location.origin}/auth/reset-password?email=${encodeURIComponent(formData.email)}&token=${encodeURIComponent(debugResetToken)}`
          : null
        setSuccess(debugResetUrl
          ? `Password reset email queued. Debug reset link: ${debugResetUrl}`
          : 'If an account exists for this email, we’ll send a password reset link.')
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
        const result = await login(formData.email, formData.password)
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
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          setSubmitting(false)
          return
        }

        const result = await register(formData)
        if (result.success) {
          navigateToCheckEmail(result.user?.email || formData.email)
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

  const resetForm = (nextView = 'login') => {
    setView(nextView)
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      newPassword: '',
      confirmNewPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
    })
    setError('')
    setSuccess('')
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
    ? 'Reset Password'
    : isResetPassword
      ? 'Set new password'
      : isVerifyEmail
        ? 'Verify your email'
        : isCheckEmail
          ? 'Check your email'
          : isCompleteProfile
            ? 'Complete your profile'
            : isLogin
              ? 'Welcome back'
              : 'Join the experience'

  const description = isForgotPassword
    ? 'Enter your email to receive recovery instructions'
    : isResetPassword
      ? 'Choose a new password for your account'
      : isVerifyEmail
        ? 'We’ll verify your account from your email link'
        : isCheckEmail
          ? 'We sent a verification link to finish setting up your account'
          : isCompleteProfile
            ? 'Add the details we need before continuing to your account'
            : isLogin
              ? 'Sign in to access your exclusive events'
              : 'Create an account to start booking'

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&h=1080&fit=crop"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-8 group">
            <div className="relative">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">{title}</h1>
          <p className="text-white/70 text-lg">{description}</p>
        </div>

        <Card className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center break-words">
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-200 text-sm text-center break-words">
                {success}
              </div>
            )}

            {isVerifyEmail ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm text-center">
                  {verifyToken
                    ? verificationStatus === 'verifying'
                      ? 'Verifying your email now...'
                      : verificationStatus === 'verified'
                        ? 'Your account is now verified.'
                        : verificationStatus === 'already_verified'
                          ? 'Your account was already verified.'
                          : verificationStatus === 'invalid_or_expired' || verificationStatus === 'error'
                            ? 'This verification link cannot be used. Please review the message above or request a fresh email.'
                            : 'Ready to verify your email.'
                    : 'Open the verification link from your email to complete this step.'}
                </div>

                {verificationResult?.user && (verificationStatus === 'verified' || verificationStatus === 'already_verified') && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm text-center">
                    {verificationResult.user.email}
                    {verificationResult.user.emailVerifiedAt ? ' verified successfully.' : ' verification state loaded.'}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => navigate(`/auth?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true })}
                  className="w-full bg-white text-black hover:bg-white/90 font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Sign in
                </Button>
              </div>
            ) : isCheckEmail ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
                  <div className="flex items-center justify-center gap-2 text-white mb-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="font-semibold">Verification email sent</span>
                  </div>
                  <p className="text-center">
                    {confirmationEmail
                      ? <>We sent a verification link to <span className="font-semibold text-white">{confirmationEmail}</span>. Open it to verify your account, then come back and sign in.</>
                      : 'We sent a verification link to your email address. Open it to verify your account, then come back and sign in.'}
                  </p>
                </div>

                {isAuthenticated && !user?.emailVerifiedAt && (
                  <Button
                    type="button"
                    disabled={submitting}
                    onClick={async () => {
                      setSubmitting(true)
                      setError('')
                      setSuccess('')
                      try {
                        await resendVerification()
                        setSuccess('Verification email sent again. Please check your inbox.')
                      } catch (err) {
                        setError(err?.message || 'Unable to resend verification email.')
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                    className="w-full bg-white text-black hover:bg-white/90 font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Resend verification email
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    if (isAuthenticated) {
                      await logout()
                    }
                    navigate(`/auth?redirect=${encodeURIComponent(redirectTarget)}`, { replace: true })
                  }}
                  className="w-full rounded-xl h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white border"
                >
                  Back to sign in
                </Button>
              </div>
            ) : isCompleteProfile ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white/90">First name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all" placeholder="First name" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white/90">Last name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all" placeholder="Last name" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/90">Phone number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all" placeholder="Phone number" required />
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-white text-black hover:bg-white/90 font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  {submitting ? 'Saving...' : 'Continue'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {(isLogin || isRegister || isForgotPassword || isResetPassword) && (
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={isResetPassword && resetEmail ? resetEmail : formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all"
                        required
                        disabled={isResetPassword && !!resetEmail}
                      />
                    </div>
                  </div>
                )}

                {(isLogin || isRegister) && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="********" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white/90">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                      <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="********" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {isResetPassword && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-white/90">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="********" value={formData.newPassword} onChange={(e) => handleInputChange('newPassword', e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmNewPassword" className="text-white/90">Confirm New Password</Label>
                      <Input id="confirmNewPassword" type="password" placeholder="********" value={formData.confirmNewPassword} onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)} className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/20 transition-all" required />
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rememberMe" checked={formData.rememberMe} onCheckedChange={(checked) => handleInputChange('rememberMe', checked)} className="border-white/30 data-[state=checked]:bg-brand-purple data-[state=checked]:border-brand-purple" />
                      <Label htmlFor="rememberMe" className="text-sm text-white/80 font-normal">Remember me</Label>
                    </div>
                    <button type="button" onClick={() => resetForm('forgot')} className="text-sm text-white hover:text-brand-purple transition-colors font-medium">
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button type="submit" disabled={submitting || (isResetPassword && !resetToken)} className="w-full bg-white text-black hover:bg-white/90 font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  {submitting ? 'Please wait...' : (isForgotPassword ? 'Send reset link' : isResetPassword ? 'Update Password' : isLogin ? 'Sign In' : 'Create Account')}
                </Button>
              </form>
            )}

            {!isForgotPassword && !isResetPassword && !isVerifyEmail && !isCheckEmail && !isCompleteProfile && (
              <div className="mt-6">
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/40">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="rounded-xl h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white border-0" disabled>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="rounded-xl h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white border-0" disabled>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </Button>
                </div>
                <p className="mt-3 text-center text-xs text-white/50">Social sign-in UI is not wired in this slice yet.</p>
              </div>
            )}

            {!isVerifyEmail && !isCheckEmail && !isCompleteProfile && (
              <div className="text-center pt-2">
                <span className="text-white/60">
                  {isForgotPassword || isResetPassword
                    ? 'Remember your password?'
                    : isLogin
                      ? 'Don\'t have an account?'
                      : 'Already have an account?'}
                </span>
                <button
                  type="button"
                  onClick={() => resetForm(isForgotPassword || isResetPassword ? 'login' : (isLogin ? 'register' : 'login'))}
                  className="ml-2 text-white font-bold hover:underline"
                >
                  {isForgotPassword || isResetPassword ? 'Sign in' : isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </div>
            )}

            {isAuthenticated && !isVerifyEmail && !isCheckEmail && !isCompleteProfile && !user?.emailVerifiedAt && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 p-4 text-center text-sm text-amber-100">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-medium">Email verification still pending</span>
                </div>
                <Button type="button" variant="ghost" disabled={submitting} onClick={async () => {
                  setSubmitting(true)
                  setError('')
                  setSuccess('')
                  try {
                    await resendVerification()
                    setSuccess('Verification email sent. Please check your inbox.')
                  } catch (err) {
                    setError(err?.message || 'Unable to resend verification email.')
                  } finally {
                    setSubmitting(false)
                  }
                }} className="text-white hover:bg-white/10">
                  Resend verification email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AuthPage
