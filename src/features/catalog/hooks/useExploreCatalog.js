import { getCatalogExploreResults } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useExploreCatalog(searchTerm, filters) {
  return useCatalogRequest(
    (signal) => getCatalogExploreResults({ searchTerm, filters, signal }),
    [searchTerm, filters.location, filters.servicePeriod, filters.environmentType, filters.familyFriendly, filters.animalFriendly, filters.rating],
    { events: [], venues: [], total: 0 }
  )
}
