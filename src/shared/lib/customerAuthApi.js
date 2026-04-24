import { get, post, put } from '../api/apiClient'

const CUSTOMER_TOKEN_KEY = 'stt_customer_token'
const CUSTOMER_USER_KEY = 'stt_user'

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

const unwrapPayload = (payload) => payload?.data || payload || {}

const buildProfile = (profile = {}) => ({
  firstName: profile.first_name || '',
  lastName: profile.last_name || '',
  phone: profile.phone_number || profile.whatsapp_number || '',
  residenceCity: '',
  residenceArea: '',
})

const mapCustomer = (payload) => {
  const resolvedPayload = unwrapPayload(payload)
  const customer = resolvedPayload?.customer || resolvedPayload || {}
  const user = customer.user || {}
  const profile = customer.profile || {}
  const verification = customer.verification?.email || {}

  return {
    id: user.id ?? null,
    email: user.email ?? '',
    name: user.name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || user.email || '',
    phone: profile.phone_number || profile.whatsapp_number || '',
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    status: user.status || '',
    emailVerifiedAt: verification.verified_at || user.email_verified_at || null,
    emailVerificationStatus: verification.status || (user.email_verified_at ? 'verified' : 'pending'),
    isEmailVerified: verification.is_verified ?? !!user.email_verified_at,
    lastLoginAt: user.last_login_at || null,
    profile: {
      email: user.email ?? '',
      ...buildProfile(profile),
    },
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

const finalizeSession = (payload) => {
  const resolvedPayload = unwrapPayload(payload)
  const session = {
    token: resolvedPayload?.token || null,
    user: mapCustomer(resolvedPayload),
  }

  persistCustomerSession(session)

  return { success: true, ...session }
}

export const loginCustomerWithApi = async ({ email, password }) => finalizeSession(await post('/customer/auth/login', {
  body: { email, password },
}))

export const registerCustomerWithApi = async ({ email, password }) => finalizeSession(await post('/customer/auth/register', {
  body: {
    email,
    password,
    password_confirmation: password,
  },
}))

export const fetchCurrentCustomerWithApi = async () => {
  const payload = await get('/customer/auth/me')
  const user = mapCustomer(payload)
  persistCustomerSession({ token: getStoredCustomerToken(), user })
  return user
}

export const updateCustomerProfileWithApi = async ({ firstName, lastName, phone }) => {
  const payload = await put('/me/profile', {
    body: {
      first_name: firstName || null,
      last_name: lastName || null,
      phone_number: phone || null,
    },
  })

  const user = mapCustomer(payload)
  persistCustomerSession({ token: getStoredCustomerToken(), user })
  return user
}

export const logoutCustomerWithApi = async () => {
  try {
    await post('/customer/auth/logout')
  } finally {
    clearStoredCustomerSession()
  }
}

export const requestCustomerPasswordResetWithApi = async ({ email }) => {
  return post('/customer/auth/forgot-password', {
    body: { email },
  })
}

export const resetCustomerPasswordWithApi = async ({ email, token, password, passwordConfirmation }) => {
  return post('/customer/auth/reset-password', {
    body: {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    },
  })
}

export const verifyCustomerEmailWithApi = async ({ token }) => {
  const payload = await post('/customer/auth/verify-email/confirm', {
    body: { token },
  })

  return {
    outcome: payload?.data?.outcome || 'invalid_or_expired',
    user: payload?.data?.customer ? mapCustomer(payload.data.customer) : null,
    verification: payload?.data?.verification?.email || null,
    message: payload?.message || 'Unable to verify your email.',
  }
}

export const resendCustomerVerificationWithApi = async () => post('/customer/auth/verify-email/resend')
