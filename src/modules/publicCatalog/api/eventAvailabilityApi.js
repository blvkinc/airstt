import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import {
  normalizePublicEventAvailabilityResponse,
  normalizePublicOccurrenceAvailabilityResponse,
} from '../normalizers/eventAvailabilityNormalizer'

const PUBLIC_EVENT_AVAILABILITY_FILTER_KEYS = Object.freeze([
  'starts_on',
  'ends_on',
  'audience_pricing_code',
  'guest_count',
  'unit_age',
  'quantity',
  'booking_at',
])

const pickFilters = (filters, allowedKeys) => {
  if (filters === null || typeof filters !== 'object' || Array.isArray(filters)) {
    return {}
  }

  return allowedKeys.reduce((query, key) => {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      query[key] = filters[key]
    }

    return query
  }, {})
}

export const getPublicEventAvailability = async ({ eventId, filters = {}, signal } = {}) => {
  const payload = await get(publicApi.events.availabilityIndex(eventId), {
    query: pickFilters(filters, PUBLIC_EVENT_AVAILABILITY_FILTER_KEYS),
    signal,
    credentials: 'omit',
  })

  return normalizePublicEventAvailabilityResponse(payload)
}

export const getPublicOccurrenceAvailability = async ({ eventId, slotKey, filters = {}, signal } = {}) => {
  const payload = await get(publicApi.events.availabilityDetail(eventId, slotKey), {
    query: pickFilters(filters, PUBLIC_EVENT_AVAILABILITY_FILTER_KEYS),
    signal,
    credentials: 'omit',
  })

  return normalizePublicOccurrenceAvailabilityResponse(payload)
}
