import { getDemoHomepagePlacements } from './demoCatalogData'

export async function getCatalogHomepagePlacements({ signal } = {}) {
  signal?.throwIfAborted?.()
  return getDemoHomepagePlacements()
}
