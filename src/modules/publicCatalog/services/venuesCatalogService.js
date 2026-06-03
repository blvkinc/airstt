import { getPublicVenueById, getPublicVenueFilterSchema, listPublicVenues } from '../api'
import { listPublicVenueTypes } from '../api/taxonomyApi'
import { mapVenueCard, mapVenueDetail, mapVenueType } from '../mappers/venueMappers'

const DEFAULT_PUBLIC_VENUE_PAGE_SIZE = 100
const DEFAULT_PUBLIC_VENUE_TYPE_PAGE_SIZE = 100
const ALLOWED_SERVICE_PERIODS = new Set(['day', 'night'])
const ALLOWED_ENVIRONMENT_TYPES = new Set(['indoor', 'outdoor'])

const uniqueNonEmpty = (values) => [...new Set((values ?? []).map((value) => String(value ?? '').trim()).filter(Boolean))]
const normalizeAllowedArray = (values, allowedValues) => uniqueNonEmpty(Array.isArray(values) ? values : [values]).filter((value) => allowedValues.has(value))

const normalizeVenueCatalogFilters = (filters = {}, searchTerm, venueTypeIds = []) => {
  const q = typeof filters.q === 'string' ? filters.q.trim() : String(searchTerm ?? '').trim()
  const areaIds = uniqueNonEmpty(filters.areaIds)
  const normalizedVenueTypeIds = uniqueNonEmpty(filters.venueTypeIds ?? venueTypeIds)
  const servicePeriods = normalizeAllowedArray(filters.servicePeriods, ALLOWED_SERVICE_PERIODS)
  const environmentTypes = normalizeAllowedArray(filters.environmentTypes, ALLOWED_ENVIRONMENT_TYPES)
  const minRating = Number(filters.minRating)

  return {
    ...(q ? { q } : {}),
    ...(areaIds.length ? { area_ids: areaIds } : {}),
    ...(normalizedVenueTypeIds.length ? { venue_type_ids: normalizedVenueTypeIds } : {}),
    ...(servicePeriods.length ? { service_periods: servicePeriods } : {}),
    ...(environmentTypes.length ? { environment_types: environmentTypes } : {}),
    ...(filters.isFamilyFriendly === true ? { is_family_friendly: true } : {}),
    ...(filters.isAnimalFriendly === true ? { is_animal_friendly: true } : {}),
    ...([4, 4.5].includes(minRating) ? { min_rating: minRating } : {}),
    per_page: DEFAULT_PUBLIC_VENUE_PAGE_SIZE,
  }
}

export async function listCatalogVenues({ searchTerm, venueTypeIds = [], filters = {}, signal } = {}) {
  const { items } = await listPublicVenues({
    filters: normalizeVenueCatalogFilters(filters, searchTerm, venueTypeIds),
    signal,
  })

  return items.map(mapVenueCard).filter(Boolean)
}

export async function getCatalogVenueDetail({ venueId, signal } = {}) {
  const venue = await getPublicVenueById({ venueId, signal })
  return mapVenueDetail(venue)
}

export async function getCatalogVenueFilterSchema({ signal } = {}) {
  return getPublicVenueFilterSchema({ signal })
}

export async function listCatalogVenueTypes({ signal } = {}) {
  const { items } = await listPublicVenueTypes({ signal, per_page: DEFAULT_PUBLIC_VENUE_TYPE_PAGE_SIZE })
  return items.map(mapVenueType).filter(Boolean)
}

export { normalizeVenueCatalogFilters }
