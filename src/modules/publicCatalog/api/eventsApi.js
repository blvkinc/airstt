import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import {
  normalizePublicEventListResponse,
  normalizePublicEventResponse,
} from '../normalizers/eventNormalizer'

const PUBLIC_EVENT_FILTER_KEYS = Object.freeze([
  'q',
  'venue_id',
  'venue_ids',
  'city_ids',
  'area_id',
  'area_ids',
  'brand_id',
  'brand_ids',
  'event_category_ids',
  'event_tag_ids',
  'offering_value_ids',
  'event_type_ids',
  'cuisine_ids',
  'service_periods',
  'environment_types',
  'is_family_friendly',
  'is_animal_friendly',
  'starts_on',
  'ends_on',
  'min_rating',
  'sort',
  'per_page',
  'page',
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

export const listPublicEvents = async ({ filters = {}, signal } = {}) => {
  const payload = await get(publicApi.events.list(), {
    query: pickFilters(filters, PUBLIC_EVENT_FILTER_KEYS),
    signal,
    credentials: 'omit',
  })

  return normalizePublicEventListResponse(payload)
}

export const getPublicEventFilterSchema = async ({ signal } = {}) => {
  const payload = await get(publicApi.events.filterSchema(), { signal, credentials: 'omit' })
  return payload?.data ?? payload ?? null
}

export const getPublicEventById = async ({ eventId, signal } = {}) => {
  const payload = await get(publicApi.events.detail(eventId), { signal, credentials: 'omit' })
  return normalizePublicEventResponse(payload)
}
