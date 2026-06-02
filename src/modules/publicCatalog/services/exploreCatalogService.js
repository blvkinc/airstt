import { getDemoExploreResults } from './demoCatalogData'

export async function getCatalogExploreResults({ searchTerm, filters, signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoExploreResults({ searchTerm, filters })
}
