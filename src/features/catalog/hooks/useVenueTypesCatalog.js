import { listCatalogVenueTypes } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useVenueTypesCatalog() {
  return useCatalogRequest((signal) => listCatalogVenueTypes({ signal }), [])
}
