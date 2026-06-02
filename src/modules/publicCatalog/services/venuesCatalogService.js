import { demoVenueTypes, getDemoVenueDetail, getDemoVenues } from './demoCatalogData'

export async function listCatalogVenues({ searchTerm, venueTypeIds = [], signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoVenues({ searchTerm, venueTypeIds })
}

export async function getCatalogVenueDetail({ venueId, signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoVenueDetail({ venueId })
}

export async function listCatalogVenueTypes({ signal } = {}) {
  signal?.throwIfAborted?.()
  return demoVenueTypes
}
