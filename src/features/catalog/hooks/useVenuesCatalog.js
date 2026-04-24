import { listCatalogVenues } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useVenuesCatalog(searchTerm, venueTypeIds = []) {
  const normalizedVenueTypeIds = Array.isArray(venueTypeIds) ? [...venueTypeIds].sort() : []

  return useCatalogRequest(
    (signal) => listCatalogVenues({ searchTerm, venueTypeIds: normalizedVenueTypeIds, signal }),
    [searchTerm, ...normalizedVenueTypeIds],
    [],
  )
}
