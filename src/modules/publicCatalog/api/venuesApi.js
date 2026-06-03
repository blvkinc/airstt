import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import {
  normalizePublicVenueListResponse,
  normalizePublicVenueResponse,
} from '../normalizers/venueNormalizer'

const PUBLIC_VENUE_FILTER_KEYS = Object.freeze([
  'q',
  'area_id',
  'area_ids',
  'venue_type_id',
  'venue_type_ids',
  'cuisine_ids',
  'service_periods',
  'environment_types',
  'is_family_friendly',
  'is_animal_friendly',
  'min_rating',
  'per_page',
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

export const listPublicVenues = async ({ filters = {}, signal } = {}) => {
  const payload = await get(publicApi.venues.list(), {
    query: pickFilters(filters, PUBLIC_VENUE_FILTER_KEYS),
    signal,
    credentials: 'omit',
  })

  return normalizePublicVenueListResponse(payload)
}

export const getPublicVenueFilterSchema = async ({ signal } = {}) => {
  const payload = await get(publicApi.venues.filterSchema(), { signal, credentials: 'omit' })
  return payload?.data ?? payload ?? null
}

export const getPublicVenueById = async ({ venueId, signal } = {}) => {
  const payload = await get(publicApi.venues.detail(venueId), { signal, credentials: 'omit' })
  return normalizePublicVenueResponse(payload)
}
