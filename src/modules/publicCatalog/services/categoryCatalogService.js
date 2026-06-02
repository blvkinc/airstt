import { demoEventCategories } from './demoCatalogData'

export async function listCatalogEventCategories({ signal } = {}) {
  signal?.throwIfAborted?.()
  return demoEventCategories
}
