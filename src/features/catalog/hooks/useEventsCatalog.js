import { listCatalogEvents } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useEventsCatalog(searchTerm) {
  return useCatalogRequest((signal) => listCatalogEvents({ searchTerm, signal }), [searchTerm], [])
}
