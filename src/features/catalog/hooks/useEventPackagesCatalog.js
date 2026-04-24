import { getCatalogEventPackages } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useEventPackagesCatalog(eventId) {
  return useCatalogRequest((signal) => getCatalogEventPackages({ eventId, signal }), [eventId])
}
