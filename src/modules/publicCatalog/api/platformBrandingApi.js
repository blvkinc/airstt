import { get } from '../../../shared/api/apiClient'
import { publicApi } from '../../../shared/api/apiEndpoints'
import { normalizePublicPlatformBrandingResponse } from '../normalizers/platformBrandingNormalizer'

export const getPlatformBranding = async ({ signal } = {}) => {
  const payload = await get(publicApi.platform.branding(), { signal, credentials: 'omit' })
  return normalizePublicPlatformBrandingResponse(payload)
}
