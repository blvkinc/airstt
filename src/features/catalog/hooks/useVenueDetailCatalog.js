import { getCatalogVenueDetail } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useVenueDetailCatalog(venueId) {
  return useCatalogRequest((signal) => getCatalogVenueDetail({ venueId, signal }), [venueId])
}
