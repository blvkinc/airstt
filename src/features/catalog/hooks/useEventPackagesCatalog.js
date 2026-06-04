import { getCatalogEventPackages } from '../../../modules/publicCatalog/services'
import { normalizeEventRouteId } from '../../../shared/lib/eventRoutes'
import { useCatalogRequest } from './useCatalogRequest'

export function useEventPackagesCatalog(eventId) {
  const normalizedEventId = normalizeEventRouteId(eventId)
  return useCatalogRequest((signal) => getCatalogEventPackages({ eventId: normalizedEventId, signal }), [normalizedEventId])
}
