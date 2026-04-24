import { listPublicEvents, listPublicVenues } from '../api'
import { mapEventCard } from '../mappers/eventMappers'
import { mapVenueCard } from '../mappers/venueMappers'

const DEFAULT_PUBLIC_EXPLORE_PAGE_SIZE = 100

const normalizeLocationNeedle = (value) => value?.trim().toLowerCase() ?? ''

const matchesLocationFilter = (item, location) => {
  const needle = normalizeLocationNeedle(location)
  if (!needle) return true

  return [item.location, item.address, item.category]
    .some((value) => value?.toLowerCase().includes(needle))
}

const buildApiFilters = (searchTerm, filters = {}) => {
  const apiFilters = {
    q: searchTerm || undefined,
    per_page: DEFAULT_PUBLIC_EXPLORE_PAGE_SIZE,
  }

  if (filters.servicePeriod !== 'all') apiFilters.service_periods = filters.servicePeriod
  if (filters.environmentType !== 'all') apiFilters.environment_types = filters.environmentType
  if (filters.familyFriendly !== 'all') apiFilters.is_family_friendly = filters.familyFriendly === 'yes'
  if (filters.animalFriendly !== 'all') apiFilters.is_animal_friendly = filters.animalFriendly === 'yes'
  if (filters.rating !== 'all') apiFilters.min_rating = Number(filters.rating)

  return apiFilters
}

export async function getCatalogExploreResults({ searchTerm, filters, signal } = {}) {
  const activeFilters = filters ?? {}
  const apiFilters = buildApiFilters(searchTerm, activeFilters)
  const [{ items: events }, { items: venues }] = await Promise.all([
    listPublicEvents({
      filters: apiFilters,
      signal,
    }),
    listPublicVenues({
      filters: apiFilters,
      signal,
    }),
  ])

  const mappedEvents = events.map(mapEventCard).filter(Boolean).filter((item) => matchesLocationFilter(item, activeFilters.location))
  const mappedVenues = venues.map(mapVenueCard).filter(Boolean).filter((item) => matchesLocationFilter(item, activeFilters.location))

  return {
    events: mappedEvents,
    venues: mappedVenues,
    total: mappedEvents.length + mappedVenues.length,
  }
}
