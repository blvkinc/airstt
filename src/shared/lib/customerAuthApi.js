const CUSTOMER_TOKEN_KEY = 'stt_customer_token'
const CUSTOMER_USER_KEY = 'stt_user'

const buildDemoUser = ({ email, firstName = '', lastName = '', phone = '' } = {}) => {
  const fallbackName = email ? email.split('@')[0] : 'Demo Guest'
  const name = [firstName, lastName].filter(Boolean).join(' ') || fallbackName

  return {
    id: 'demo-customer',
    email: email || 'demo@setthetable.ae',
    name,
    phone,
    firstName,
    lastName,
    status: 'demo',
    emailVerifiedAt: new Date().toISOString(),
    emailVerificationStatus: 'verified',
    isEmailVerified: true,
    lastLoginAt: new Date().toISOString(),
    memberSince: '2026',
    accountType: 'Demo',
    rewardPoints: 355,
    pointsToNextTier: 145,
    nextRewardTier: 'Gold',
    profile: {
      email: email || 'demo@setthetable.ae',
      firstName,
      lastName,
      phone,
      residenceCity: 'Dubai',
      residenceArea: 'Dubai Marina',
    },
  }
}

export const getStoredCustomerToken = () => localStorage.getItem(CUSTOMER_TOKEN_KEY)

export const getStoredCustomerUser = () => {
  const raw = localStorage.getItem(CUSTOMER_USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const persistCustomerSession = ({ token, user }) => {
  if (token) localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
  if (user) localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user))
}

export const clearStoredCustomerSession = () => {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY)
  localStorage.removeItem(CUSTOMER_USER_KEY)
}

const finalizeDemoSession = (user) => {
  const session = {
    token: 'demo-customer-token',
    user,
  }

  persistCustomerSession(session)
  return { success: true, ...session }
}

export const loginCustomerWithApi = async ({ email }) => {
  const storedUser = getStoredCustomerUser()
  return finalizeDemoSession(storedUser || buildDemoUser({
    email,
    firstName: 'Demo',
    lastName: 'Guest',
    phone: '+971 50 000 0000',
  }))
}

export const registerCustomerWithApi = async ({ email }) => finalizeDemoSession(buildDemoUser({ email }))

export const fetchCurrentCustomerWithApi = async () => {
  const user = getStoredCustomerUser()
  if (!user) throw new Error('No demo customer session')
  return user
}

export const updateCustomerProfileWithApi = async ({ firstName, lastName, phone }) => {
  const currentUser = getStoredCustomerUser() || buildDemoUser()
  const updatedUser = {
    ...currentUser,
    name: [firstName, lastName].filter(Boolean).join(' ') || currentUser.name,
    phone: phone || '',
    firstName: firstName || '',
    lastName: lastName || '',
    profile: {
      ...(currentUser.profile || {}),
      firstName: firstName || '',
      lastName: lastName || '',
      phone: phone || '',
    },
  }

  persistCustomerSession({ token: getStoredCustomerToken() || 'demo-customer-token', user: updatedUser })
  return updatedUser
}

export const logoutCustomerWithApi = async () => {
  clearStoredCustomerSession()
}

export const requestCustomerPasswordResetWithApi = async ({ email }) => ({
  message: 'Demo password reset queued.',
  debug: {
    password_reset_token: 'demo-reset-token',
    email,
  },
})

export const resetCustomerPasswordWithApi = async () => ({
  message: 'Demo password updated.',
})

export const verifyCustomerEmailWithApi = async () => ({
  outcome: 'already_verified',
  user: getStoredCustomerUser(),
  verification: {
    status: 'verified',
    is_verified: true,
  },
  message: 'Demo account is already verified.',
})

export const resendCustomerVerificationWithApi = async () => ({
  message: 'Demo verification email sent.',
})
