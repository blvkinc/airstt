import { createHttpError, normalizeApiError } from './apiError'

const DEFAULT_API_BASE_URL = 'http://localhost:8000'
const DEFAULT_API_BASE_PATH = '/api'
const JSON_CONTENT_TYPE = 'application/json'
const EMPTY_BODY_STATUSES = new Set([204, 205, 304])

const isDate = (value) => value instanceof Date
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const resolveApiBaseUrl = () => {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (typeof configuredBaseUrl === 'string' && configuredBaseUrl.trim() !== '') {
    return configuredBaseUrl.trim().replace(/\/+$/, '')
  }

  return DEFAULT_API_BASE_URL
}

const resolveApiBasePath = () => {
  const configuredBasePath = import.meta.env.VITE_API_BASE_PATH

  if (typeof configuredBasePath === 'string' && configuredBasePath.trim() !== '') {
    const trimmedPath = configuredBasePath.trim()
    return trimmedPath.startsWith('/') ? trimmedPath.replace(/\/+$/, '') : `/${trimmedPath.replace(/\/+$/, '')}`
  }

  return DEFAULT_API_BASE_PATH
}

const normalizeQueryValue = (value) => {
  if (value === undefined || value === null || value === '') return null
  if (isDate(value)) return value.toISOString()
  if (typeof value === 'boolean') return value ? '1' : '0'
  return String(value)
}

export const serializeQueryParams = (query = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null || rawValue === '') return

    if (Array.isArray(rawValue)) {
      rawValue.forEach((item) => {
        const normalizedItem = normalizeQueryValue(item)
        if (normalizedItem !== null) {
          searchParams.append(`${key}[]`, normalizedItem)
        }
      })
      return
    }

    const normalizedValue = normalizeQueryValue(rawValue)
    if (normalizedValue !== null) {
      searchParams.set(key, normalizedValue)
    }
  })

  return searchParams
}

export const buildApiUrl = (path, query) => {
  const normalizedPath = String(path ?? '').trim().replace(/^\/+/, '')
  const apiRoot = new URL(`${resolveApiBasePath().replace(/^\//, '')}/`, `${resolveApiBaseUrl()}/`)
  const url = new URL(normalizedPath, apiRoot)
  const searchParams = serializeQueryParams(query)
  const search = searchParams.toString()

  if (search) {
    url.search = search
  }

  return url.toString()
}

const CUSTOMER_TOKEN_STORAGE_KEY = 'stt_customer_token'

const hasRequestBody = (body) => body !== undefined && body !== null

const shouldSendJsonContentType = (body, headers) => {
  if (!hasRequestBody(body)) return false
  if (typeof FormData !== 'undefined' && body instanceof FormData) return false
  return !Object.keys(headers).some((headerName) => headerName.toLowerCase() === 'content-type')
}

const parseJsonResponse = async (response) => {
  if (EMPTY_BODY_STATUSES.has(response.status)) return null

  const text = await response.text()
  if (text.trim() === '') return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const request = async (path, options = {}) => {
  const method = options.method ?? 'GET'
  const token = typeof window !== 'undefined' ? window.localStorage.getItem(CUSTOMER_TOKEN_STORAGE_KEY) : null
  const headers = {
    Accept: JSON_CONTENT_TYPE,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  }
  const body = options.body

  if (shouldSendJsonContentType(body, headers)) {
    headers['Content-Type'] = JSON_CONTENT_TYPE
  }

  const init = {
    method,
    headers,
    signal: options.signal,
    credentials: options.credentials ?? 'include',
  }

  if (hasRequestBody(body)) {
    init.body = isPlainObject(body) || Array.isArray(body) ? JSON.stringify(body) : body
  }

  try {
    const response = await fetch(buildApiUrl(path, options.query), init)
    const payload = await parseJsonResponse(response)

    if (!response.ok) {
      throw createHttpError({
        status: response.status,
        payload,
        statusText: response.statusText,
      })
    }

    return payload
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export const get = (path, options = {}) => request(path, { ...options, method: 'GET' })
export const post = (path, options = {}) => request(path, { ...options, method: 'POST' })
export const put = (path, options = {}) => request(path, { ...options, method: 'PUT' })
export const patch = (path, options = {}) => request(path, { ...options, method: 'PATCH' })
export const del = (path, options = {}) => request(path, { ...options, method: 'DELETE' })

export { resolveApiBasePath, resolveApiBaseUrl }
