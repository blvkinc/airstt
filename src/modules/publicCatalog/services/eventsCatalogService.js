import {
  getPublicEventAvailability,
  getPublicEventById,
  getPublicEventFilterSchema,
  getPublicOccurrenceAvailability,
  listPublicEvents,
} from '../api'
import {
  mapEventCard,
  mapEventDetail,
  mapOccurrence,
  mapPackageEvent,
} from '../mappers/eventMappers'

const DEFAULT_PUBLIC_EVENT_PAGE_SIZE = 100
const VALID_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const ALLOWED_SERVICE_PERIODS = new Set(['day', 'night'])
const ALLOWED_ENVIRONMENT_TYPES = new Set(['indoor', 'outdoor'])

const uniqueNonEmpty = (values) => [...new Set((values ?? []).map((value) => String(value ?? '').trim()).filter(Boolean))]

const isValidDateString = (value) => {
  if (!VALID_DATE_PATTERN.test(value ?? '')) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const normalizeAllowedArray = (values, allowedValues) => uniqueNonEmpty(Array.isArray(values) ? values : [values]).filter((value) => allowedValues.has(value))

const normalizeEventCatalogFilters = (filters = {}, searchTerm) => {
  const q = typeof filters.q === 'string' ? filters.q.trim() : String(searchTerm ?? '').trim()
  const cityIds = uniqueNonEmpty(filters.cityIds)
  const areaIds = uniqueNonEmpty(filters.areaIds)
  const brandIds = uniqueNonEmpty(filters.brandIds)
  const eventCategoryIds = uniqueNonEmpty(filters.eventCategoryIds)
  const eventTagIds = uniqueNonEmpty(filters.eventTagIds)
  const offeringValueIds = uniqueNonEmpty(filters.offeringValueIds)
  const eventTypeIds = uniqueNonEmpty(filters.eventTypeIds)
  const cuisineIds = uniqueNonEmpty(filters.cuisineIds)
  const servicePeriods = normalizeAllowedArray(filters.servicePeriods, ALLOWED_SERVICE_PERIODS)
  const environmentTypes = normalizeAllowedArray(filters.environmentTypes, ALLOWED_ENVIRONMENT_TYPES)
  const startsOn = isValidDateString(filters.startsOn) ? filters.startsOn : null
  const rawEndsOn = isValidDateString(filters.endsOn) ? filters.endsOn : null
  const endsOn = startsOn && rawEndsOn && rawEndsOn < startsOn ? null : rawEndsOn
  const minRating = Number(filters.minRating)

  return {
    ...(q ? { q } : {}),
    ...(cityIds.length ? { city_ids: cityIds } : {}),
    ...(areaIds.length ? { area_ids: areaIds } : {}),
    ...(brandIds.length ? { brand_ids: brandIds } : {}),
    ...(eventCategoryIds.length ? { event_category_ids: eventCategoryIds } : {}),
    ...(eventTagIds.length ? { event_tag_ids: eventTagIds } : {}),
    ...(offeringValueIds.length ? { offering_value_ids: offeringValueIds } : {}),
    ...(eventTypeIds.length ? { event_type_ids: eventTypeIds } : {}),
    ...(cuisineIds.length ? { cuisine_ids: cuisineIds } : {}),
    ...(servicePeriods.length ? { service_periods: servicePeriods } : {}),
    ...(environmentTypes.length ? { environment_types: environmentTypes } : {}),
    ...(filters.isFamilyFriendly === true ? { is_family_friendly: true } : {}),
    ...(filters.isAnimalFriendly === true ? { is_animal_friendly: true } : {}),
    ...([4, 4.5].includes(minRating) ? { min_rating: minRating } : {}),
    ...(startsOn ? { starts_on: startsOn } : {}),
    ...(endsOn ? { ends_on: endsOn } : {}),
    ...(filters.sort ? { sort: filters.sort } : {}),
    per_page: DEFAULT_PUBLIC_EVENT_PAGE_SIZE,
  }
}

export async function listCatalogEvents({ searchTerm, filters = {}, signal } = {}) {
  const { items } = await listPublicEvents({
    filters: normalizeEventCatalogFilters(filters, searchTerm),
    signal,
  })

  return items.map(mapEventCard).filter(Boolean)
}

export async function getCatalogEventFilterSchema({ signal } = {}) {
  return getPublicEventFilterSchema({ signal })
}

async function getCatalogEventWithAvailability({ eventId, signal } = {}) {
  const [event, availability] = await Promise.all([
    getPublicEventById({ eventId, signal }),
    getPublicEventAvailability({ eventId, signal }),
  ])

  return { event, availability }
}

export async function getCatalogEventDetail({ eventId, signal } = {}) {
  const { event, availability } = await getCatalogEventWithAvailability({ eventId, signal })
  return mapEventDetail(event, availability)
}

export async function getCatalogEventPackages({ eventId, signal } = {}) {
  const { event, availability } = await getCatalogEventWithAvailability({ eventId, signal })
  return mapPackageEvent(event, availability)
}

export async function getCatalogOccurrenceDetail({ event, eventId, slotKey, filters = {}, signal } = {}) {
  if (!event || !slotKey) return null

  const availability = await getPublicOccurrenceAvailability({
    eventId,
    slotKey,
    filters,
    signal,
  })

  const packageFamilies = event.package_families || []

  return mapOccurrence(availability?.occurrence, event.packages || [], packageFamilies)
}

export { normalizeEventCatalogFilters }
