import { getCatalogEventDetail } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useEventDetailCatalog(eventId) {
  return useCatalogRequest((signal) => getCatalogEventDetail({ eventId, signal }), [eventId])
}
