import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import { normalizePublicEventOfferingsResponse } from '../normalizers/eventOfferingsNormalizer'

export const getPublicEventOfferings = async ({ eventId, signal } = {}) => {
  const payload = await get(publicApi.events.offerings(eventId), { signal, credentials: 'omit' })
  return normalizePublicEventOfferingsResponse(payload)
}
