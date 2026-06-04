import { getCatalogEventDetail } from '../../../modules/publicCatalog/services'
import { normalizeEventRouteId } from '../../../shared/lib/eventRoutes'
import { useCatalogRequest } from './useCatalogRequest'

export function useEventDetailCatalog(eventId) {
  const normalizedEventId = normalizeEventRouteId(eventId)
  return useCatalogRequest((signal) => getCatalogEventDetail({ eventId: normalizedEventId, signal }), [normalizedEventId])
}
