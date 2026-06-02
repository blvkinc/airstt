import {
  getDemoEventDetail,
  getDemoEventPackages,
  getDemoEvents,
  getDemoOccurrenceDetail,
} from './demoCatalogData'

export async function listCatalogEvents({ searchTerm, signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoEvents({ searchTerm })
}

export async function getCatalogEventDetail({ eventId, signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoEventDetail({ eventId })
}

export async function getCatalogEventPackages({ eventId, signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoEventPackages({ eventId })
}

export async function getCatalogOccurrenceDetail({ event, eventId, slotKey, filters = {}, signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoOccurrenceDetail({ eventId: eventId || event?.id, slotKey, filters })
}

