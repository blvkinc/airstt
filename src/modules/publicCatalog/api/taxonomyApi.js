import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import {
  normalizePublicEventCategoriesResponse,
  normalizePublicEventTagsResponse,
  normalizePublicVenueTypesResponse,
} from '../normalizers/taxonomyNormalizer'

export const listPublicEventCategories = async ({ signal } = {}) => {
  const payload = await get(publicApi.taxonomy.categories(), { signal, credentials: 'omit' })
  return normalizePublicEventCategoriesResponse(payload)
}

export const listPublicEventTags = async ({ signal } = {}) => {
  const payload = await get(publicApi.taxonomy.tags(), { signal, credentials: 'omit' })
  return normalizePublicEventTagsResponse(payload)
}

export const listPublicVenueTypes = async ({ signal, per_page } = {}) => {
  const payload = await get(publicApi.taxonomy.venueTypes(), {
    query: { per_page },
    signal,
    credentials: 'omit',
  })

  return normalizePublicVenueTypesResponse(payload)
}
