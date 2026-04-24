// API requests always target `${baseUrl}/api/public/...`.
// VITE_API_BASE_URL overrides the project default API host when provided.
const DEFAULT_API_BASE_URL = 'http://localhost:8000'
const CUSTOMER_TOKEN_KEY = 'stt_customer_token'

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (typeof configuredBaseUrl === 'string' && configuredBaseUrl.trim() !== '') {
    return configuredBaseUrl.trim().replace(/\/$/, '')
  }

  return DEFAULT_API_BASE_URL
}

const buildUrl = (path, query) => {
  const url = new URL(path, `${resolveApiBaseUrl().replace(/\/$/, '')}/`)

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || value === false) return

      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null && item !== '') {
            url.searchParams.append(`${key}[]`, String(item))
          }
        })
        return
      }

      url.searchParams.set(key, String(value))
    })
  }

  return url.toString()
}

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export const apiRequest = async (path, options = {}) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(CUSTOMER_TOKEN_KEY) : null

  const response = await fetch(buildUrl(path, options.query), {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(payload?.message || 'Request failed.', {
      status: response.status,
      payload,
    })
  }

  return payload
}
