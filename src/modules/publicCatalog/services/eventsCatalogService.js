import {
  getPublicEventAvailability,
  getPublicEventById,
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

export async function listCatalogEvents({ searchTerm, signal } = {}) {
  const { items } = await listPublicEvents({
    filters: {
      q: searchTerm || undefined,
      per_page: DEFAULT_PUBLIC_EVENT_PAGE_SIZE,
    },
    signal,
  })

  return items.map(mapEventCard).filter(Boolean)
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

