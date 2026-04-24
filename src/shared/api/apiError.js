const DEFAULT_ERROR_MESSAGE = 'Request failed.'
const DEFAULT_NETWORK_MESSAGE = 'Unable to reach the server.'
const DEFAULT_ABORT_MESSAGE = 'Request was aborted.'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const pickMessage = (payload, fallbackMessage = DEFAULT_ERROR_MESSAGE) => {
  if (typeof payload === 'string' && payload.trim() !== '') return payload
  if (typeof payload?.message === 'string' && payload.message.trim() !== '') return payload.message
  if (typeof payload?.error === 'string' && payload.error.trim() !== '') return payload.error
  return fallbackMessage
}

export class ApiError extends Error {
  constructor({
    message = DEFAULT_ERROR_MESSAGE,
    status = null,
    code,
    errors,
    details,
    cause,
    isNetworkError = false,
    isAbortError = false,
  } = {}) {
    super(message, cause ? { cause } : undefined)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.errors = errors
    this.details = details
    this.isNetworkError = isNetworkError
    this.isAbortError = isAbortError
    this.isNotFoundError = status === 404
    this.isValidationError = status === 422
  }
}

export const createApiError = (overrides = {}) => new ApiError(overrides)

export const normalizeApiError = (error, fallbackMessage) => {
  if (error instanceof ApiError) return error

  if (error?.name === 'AbortError') {
    return createApiError({
      message: fallbackMessage ?? DEFAULT_ABORT_MESSAGE,
      status: null,
      code: 'request_aborted',
      cause: error,
      isAbortError: true,
    })
  }

  return createApiError({
    message: fallbackMessage ?? pickMessage(error, DEFAULT_NETWORK_MESSAGE),
    status: null,
    code: 'network_error',
    details: isPlainObject(error) ? error : undefined,
    cause: error,
    isNetworkError: true,
  })
}

export const createHttpError = ({ status, payload, statusText, message } = {}) => createApiError({
  status,
  code: typeof payload?.code === 'string' && payload.code.trim() !== '' ? payload.code : undefined,
  message: message ?? pickMessage(payload, statusText || DEFAULT_ERROR_MESSAGE),
  errors: isPlainObject(payload?.errors) ? payload.errors : undefined,
  details: isPlainObject(payload) || Array.isArray(payload) ? payload : undefined,
})
