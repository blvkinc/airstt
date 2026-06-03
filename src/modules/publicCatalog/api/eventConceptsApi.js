import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import { normalizePublicEventConceptResponse } from '../normalizers/eventConceptNormalizer'

export const getPublicEventConceptById = async ({ conceptId, signal } = {}) => {
  const payload = await get(publicApi.eventConcepts.detail(conceptId), { signal, credentials: 'omit' })
  return normalizePublicEventConceptResponse(payload)
}

export const getPublicEventConceptOptions = async ({ eventId, signal } = {}) => {
  const payload = await get(publicApi.events.conceptOptions(eventId), { signal, credentials: 'omit' })
  return normalizePublicEventConceptResponse(payload)
}
