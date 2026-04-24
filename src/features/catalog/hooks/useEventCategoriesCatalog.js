import { listCatalogEventCategories } from '../../../modules/publicCatalog/services'
import { useCatalogRequest } from './useCatalogRequest'

export function useEventCategoriesCatalog() {
  return useCatalogRequest((signal) => listCatalogEventCategories({ signal }), [], [])
}
