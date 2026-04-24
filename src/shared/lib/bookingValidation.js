const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d][\d\s()-]{7,}$/

export const sanitizeCardNumber = (value = '') => value.replace(/\D/g, '').slice(0, 16)
export const formatCardNumber = (value = '') => sanitizeCardNumber(value).replace(/(\d{4})(?=\d)/g, '$1 ').trim()

export const sanitizeExpiryDate = (value = '') => value.replace(/\D/g, '').slice(0, 4)
export const formatExpiryDate = (value = '') => {
  const digits = sanitizeExpiryDate(value)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export const sanitizeCvv = (value = '') => value.replace(/\D/g, '').slice(0, 4)
export const normalizeGuestCount = (value, fallback = 1) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export const validateGuestDetails = (formData) => {
  const errors = {}

  if (!formData.firstName?.trim()) errors.firstName = 'Enter a first name.'
  if (!formData.lastName?.trim()) errors.lastName = 'Enter a last name.'
  if (!emailPattern.test(formData.email?.trim() || '')) errors.email = 'Enter a valid email address.'
  if (!phonePattern.test(formData.phone?.trim() || '')) errors.phone = 'Enter a valid phone number.'

  return errors
}

export const validatePaymentDetails = (formData) => {
  const errors = {}
  const cardNumber = sanitizeCardNumber(formData.cardNumber)
  const expiryDigits = sanitizeExpiryDate(formData.expiryDate)
  const cvv = sanitizeCvv(formData.cvv)
  const cardName = formData.cardName?.trim() || ''

  if (cardNumber.length !== 16) errors.cardNumber = 'Enter a valid 16-digit card number.'

  if (expiryDigits.length !== 4) {
    errors.expiryDate = 'Enter a valid expiry date.'
  } else {
    const month = Number.parseInt(expiryDigits.slice(0, 2), 10)
    const year = Number.parseInt(expiryDigits.slice(2), 10)
    const fullYear = 2000 + year
    const expiryDate = new Date(fullYear, month, 0, 23, 59, 59, 999)

    if (month < 1 || month > 12 || Number.isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
      errors.expiryDate = 'Use a current expiry date in MM/YY format.'
    }
  }

  if (cvv.length < 3) errors.cvv = 'Enter a valid CVV.'
  if (!cardName) errors.cardName = 'Enter the cardholder name.'

  return errors
}
