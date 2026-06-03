import { del, get, patch, post, put } from '../api/apiClient'
import { buildPhoneNumber, parsePhoneNumber } from './customerProfileMetadata'

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

const mapAddress = (address = {}) => ({
  id: address.id ?? null,
  countryOfResidence: address.country_of_residence || '',
  city: address.city || '',
  area: address.area || '',
  addressLine1: address.address_line_1 || '',
  isPrimary: !!address.is_primary,
  createdAt: address.created_at || null,
  updatedAt: address.updated_at || null,
})

const buildProfile = (profile = {}) => {
  const phoneCountryCode = profile.phone_country_code || ''
  const phoneNumber = profile.phone_number || ''

  return {
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    phoneCountryCode,
    phoneNumber,
    phone: phoneCountryCode && phoneNumber
      ? buildPhoneNumber({ countryCode: phoneCountryCode, number: phoneNumber })
      : phoneNumber || profile.whatsapp_number || '',
    nationality: profile.nationality || '',
    dateOfBirth: profile.date_of_birth || '',
    gender: profile.gender || '',
    stayType: profile.stay_type || '',
    occupation: profile.occupation_segment || '',
  }
}

const mapCustomer = (payload) => {
  const resolvedPayload = unwrapPayload(payload)
  const customer = resolvedPayload?.customer || resolvedPayload || {}
  const user = customer.user || {}
  const profile = customer.profile || {}
  const verification = customer.verification?.email || {}
  const addresses = Array.isArray(customer.addresses) ? customer.addresses.map(mapAddress) : []

  const builtProfile = buildProfile(profile)

  return {
    id: user.id ?? null,
    email: user.email ?? '',
    name: user.name || [profile.first_name, profile.last_name].filter(Boolean).join(' ') || user.email || '',
    phone: builtProfile.phone,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    status: user.status || '',
    createdAt: user.created_at || customer.created_at || null,
    memberSince: user.created_at || customer.created_at || null,
    emailVerifiedAt: verification.verified_at || user.email_verified_at || null,
    emailVerificationStatus: verification.status || (user.email_verified_at ? 'verified' : 'pending'),
    isEmailVerified: verification.is_verified ?? !!user.email_verified_at,
    lastLoginAt: user.last_login_at || null,
    profile: {
      email: user.email ?? '',
      ...builtProfile,
    },
    addresses,
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

export const fetchCustomerProfileWithApi = async () => {
  const payload = await get('/me')
  const user = mapCustomer(payload)
  persistCustomerSession({ token: getStoredCustomerToken(), user })
  return user
}

export const updateCustomerProfileWithApi = async ({ firstName, lastName, phone, phoneCountryCode, phoneNumber, nationality, dateOfBirth, gender, stayType, occupation, completeProfile }) => {
  const body = {}

  if (completeProfile !== undefined) body.complete_profile = !!completeProfile

  if (firstName !== undefined) body.first_name = firstName || null
  if (lastName !== undefined) body.last_name = lastName || null
  if (nationality !== undefined) body.nationality = nationality || null
  if (dateOfBirth !== undefined) body.date_of_birth = dateOfBirth || null
  if (gender !== undefined) body.gender = gender || null
  if (stayType !== undefined) body.stay_type = stayType || null
  if (occupation !== undefined) body.occupation_segment = occupation || null

  if (phone !== undefined || phoneNumber !== undefined || phoneCountryCode !== undefined) {
    const parsedPhone = phoneNumber !== undefined
      ? { countryCode: phoneCountryCode || '', number: phoneNumber }
      : parsePhoneNumber(phone || '')
    const normalizedPhoneNumber = String(parsedPhone.number || '').replace(/\D+/g, '')

    body.phone_country_code = parsedPhone.countryCode || null
    body.phone_number = normalizedPhoneNumber || null
  }

  const payload = await put('/me/profile', { body })

  const user = mapCustomer(payload)
  persistCustomerSession({ token: getStoredCustomerToken(), user })
  return user
}

export const fetchCustomerAddressesWithApi = async () => {
  const payload = await get('/me/addresses')
  const resolvedPayload = unwrapPayload(payload)
  return Array.isArray(resolvedPayload) ? resolvedPayload.map(mapAddress) : []
}

export const createCustomerAddressWithApi = async ({ countryOfResidence, city, area, addressLine1, isPrimary }) => {
  const payload = await post('/me/addresses', {
    body: {
      country_of_residence: countryOfResidence || null,
      city: city || null,
      area: area || null,
      address_line_1: addressLine1 || null,
      is_primary: !!isPrimary,
    },
  })

  return mapAddress(unwrapPayload(payload))
}

export const updateCustomerAddressWithApi = async (addressId, { countryOfResidence, city, area, addressLine1, isPrimary }) => {
  const payload = await patch(`/me/addresses/${addressId}`, {
    body: {
      country_of_residence: countryOfResidence || null,
      city: city || null,
      area: area || null,
      address_line_1: addressLine1 || null,
      is_primary: !!isPrimary,
    },
  })

  return mapAddress(unwrapPayload(payload))
}

export const deleteCustomerAddressWithApi = async (addressId) => del(`/me/addresses/${addressId}`)

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

export const fetchPublicCountriesWithApi = async ({ signal } = {}) => {
  const payload = await get('/public/countries', { signal })
  const resolvedPayload = unwrapPayload(payload)
  return Array.isArray(resolvedPayload) ? resolvedPayload : []
}

export const CUSTOMER_PROFILE_OPTIONS = {
  genders: ['male', 'female', 'unspecified'],
  stayTypes: ['tourist', 'resident'],
  occupationSegments: ['hospitality', 'corporate', 'entrepreneur', 'creative', 'student', 'other'],
}
