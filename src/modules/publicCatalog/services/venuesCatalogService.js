import { getPublicVenueById, listPublicVenues } from '../api'
import { listPublicVenueTypes } from '../api/taxonomyApi'
import { mapVenueCard, mapVenueDetail, mapVenueType } from '../mappers/venueMappers'

const DEFAULT_PUBLIC_VENUE_PAGE_SIZE = 100
const DEFAULT_PUBLIC_VENUE_TYPE_PAGE_SIZE = 100

export async function listCatalogVenues({ searchTerm, venueTypeIds = [], signal } = {}) {
  const { items } = await listPublicVenues({
    filters: {
      q: searchTerm || undefined,
      venue_type_ids: venueTypeIds.length > 0 ? venueTypeIds : undefined,
      per_page: DEFAULT_PUBLIC_VENUE_PAGE_SIZE,
    },
    signal,
  })

  return items.map(mapVenueCard).filter(Boolean)
}

export async function getCatalogVenueDetail({ venueId, signal } = {}) {
  const venue = await getPublicVenueById({ venueId, signal })
  return mapVenueDetail(venue)
}

export async function listCatalogVenueTypes({ signal } = {}) {
  const { items } = await listPublicVenueTypes({ signal, per_page: DEFAULT_PUBLIC_VENUE_TYPE_PAGE_SIZE })
  return items.map(mapVenueType).filter(Boolean)
}
