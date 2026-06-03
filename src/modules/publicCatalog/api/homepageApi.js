import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import { normalizePublicHomepagePlacementsResponse } from '../normalizers/homepageNormalizer'

export const getHomepagePlacements = async ({ signal } = {}) => {
  const payload = await get(publicApi.homepage.placements(), { signal, credentials: 'omit' })
  return normalizePublicHomepagePlacementsResponse(payload)
}
