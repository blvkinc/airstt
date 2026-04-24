import { normalizeResourceEnvelope } from '../../../shared/api/normalizeResponse'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizePublicPlatformBrandingSlot = (slot) => {
  if (!isPlainObject(slot)) return null

  return {
    ...slot,
    slot: slot.slot ?? null,
    label: slot.label ?? null,
    description: slot.description ?? null,
    asset_path: slot.asset_path ?? null,
    asset_url: slot.asset_url ?? null,
    mime_type: slot.mime_type ?? null,
    original_file_name: slot.original_file_name ?? null,
  }
}

export const normalizePublicPlatformBrandingResponse = (payload) => {
  const data = normalizeResourceEnvelope(payload)

  return {
    slots: Array.isArray(data?.slots) ? data.slots.map(normalizePublicPlatformBrandingSlot).filter(Boolean) : [],
  }
}
