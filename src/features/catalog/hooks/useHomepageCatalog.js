import { getCatalogHomepagePlacements } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useHomepageCatalog() {
  return useCatalogRequest((signal) => getCatalogHomepagePlacements({ signal }), [], [])
}
