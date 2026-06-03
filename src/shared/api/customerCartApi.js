import { del, get, patch, post } from './apiClient'
import { customerApi } from './apiEndpoints'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg']
const NON_SPECIFIC_AUDIENCE_CODES = new Set(['', 'all', 'any', 'default', 'general', 'mixed', 'standard'])

const normalizeAudienceSelectorCode = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase().replace(/\s+/g, '_')
  if (!normalizedValue || NON_SPECIFIC_AUDIENCE_CODES.has(normalizedValue)) return null
  return normalizedValue
}

const looksLikeImageUrl = (value) => {
  if (typeof value !== 'string') return false

  const trimmedValue = value.trim()
  if (!trimmedValue || /^data:/i.test(trimmedValue)) return false

  try {
    const url = new URL(trimmedValue)
    const pathname = url.pathname.toLowerCase()
    return IMAGE_EXTENSIONS.some((extension) => pathname.endsWith(`.${extension}`))
  } catch {
    const normalizedValue = trimmedValue.toLowerCase().split('?')[0].split('#')[0]
    return IMAGE_EXTENSIONS.some((extension) => normalizedValue.endsWith(`.${extension}`))
  }
}

const isMediaImageObject = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false

  const kind = String(value.kind || value.type || value.media_type || value.mime_type || '').toLowerCase()
  if (kind.includes('video')) return false
  if (kind.includes('image')) return true

  return [value.asset_url, value.url, value.src, value.image, value.image_url].some((entry) => looksLikeImageUrl(entry))
}

const extractImageCandidates = (value) => {
  if (!value) return []
  if (typeof value === 'string') return looksLikeImageUrl(value) ? [value.trim()] : []
  if (Array.isArray(value)) {
    const prioritizedEntries = [
      ...value.filter((entry) => isMediaImageObject(entry)),
      ...value.filter((entry) => !isMediaImageObject(entry)),
    ]

    return prioritizedEntries.flatMap((entry) => extractImageCandidates(entry))
  }
  if (typeof value === 'object') {
    return [
      value.asset_url,
      value.url,
      value.src,
      value.image,
      value.image_url,
      value.hero_image,
      value.cover_image,
    ].flatMap((entry) => extractImageCandidates(entry))
  }
  return []
}

const pickFirstImage = (...values) => {
  for (const value of values) {
    const candidate = extractImageCandidates(value)[0]
    if (candidate) return candidate
  }
  return null
}

const normalizeCartItem = (item, fallback = {}) => {
  if (!item || typeof item !== 'object') return null

  const eventPackage = item.eventPackage || item.event_package || {}
  const event = eventPackage.event || {}
  const venue = event.venue || {}
  const eventOccurrence = item.eventOccurrence || item.event_occurrence || {}
  const pricingSummary = item.pricing_summary || fallback.pricingSummary || {}
  const eventImage = pickFirstImage(
    item.eventImage,
    item.event_image,
    item.eventMedia,
    item.event_media,
    event.image,
    event.hero_image,
    event.cover_image,
    event.media,
    event.images,
    fallback.eventImage,
  )
  const venueImage = pickFirstImage(
    item.venueImage,
    item.venue_image,
    item.venueMedia,
    item.venue_media,
    venue.image,
    venue.hero_image,
    venue.cover_image,
    venue.media,
    venue.images,
    fallback.venueImage,
  )

  const entitlementAdjustments = Array.isArray(item.cart_entitlement_adjustments || pricingSummary.cart_entitlement_adjustments)
    ? (item.cart_entitlement_adjustments || pricingSummary.cart_entitlement_adjustments)
    : []

  return {
    id: item.id ?? fallback.id ?? null,
    cartItemId: item.id ?? fallback.cartItemId ?? null,
    eventId: event.id ?? eventPackage.event_id ?? fallback.eventId ?? null,
    eventOccurrenceId: eventOccurrence.id ?? fallback.eventOccurrenceId ?? null,
    slotKey: eventOccurrence.slot_key ?? item.slot_key ?? fallback.slotKey ?? eventOccurrence.occurrence_date ?? fallback.occurrenceDate ?? null,
    occurrenceDate: eventOccurrence.occurrence_date ?? fallback.occurrenceDate ?? null,
    eventTitle: event.title ?? fallback.eventTitle ?? 'Event',
    venue: venue.name ?? fallback.venue ?? '',
    date: eventOccurrence.occurrence_date ?? fallback.date ?? '',
    time: fallback.time ?? '',
    packageId: eventPackage.id ?? fallback.packageId ?? null,
    packageFamilyKey: eventPackage.family_key ?? fallback.packageFamilyKey ?? null,
    packageVariantKey: item.audience_pricing_code ?? fallback.packageVariantKey ?? null,
    packageVariantLabel: eventPackage.audience_label ?? fallback.packageVariantLabel ?? null,
    packageTypeLabel: eventPackage.package_type ?? fallback.packageTypeLabel ?? null,
    inventoryLabel: fallback.inventoryLabel ?? null,
    packageName: eventPackage.display_name ?? eventPackage.name ?? fallback.packageName ?? 'Package',
    guests: item.guest_count ?? fallback.guests ?? 1,
    quantity: item.quantity ?? fallback.quantity ?? 1,
    unitPrice: toNumber(item.unit_price ?? pricingSummary.unit_price),
    grossUnitPrice: toNumber(item.gross_unit_price ?? pricingSummary.gross_unit_price ?? item.unit_price ?? pricingSummary.unit_price),
    grossLineTotal: toNumber(item.gross_line_total ?? pricingSummary.gross_line_total ?? item.line_total ?? pricingSummary.line_total),
    cartEntitlementAdjustmentAmount: toNumber(item.cart_entitlement_adjustment_amount ?? pricingSummary.cart_entitlement_adjustment_amount),
    cartEntitlementAdjustments: entitlementAdjustments,
    lineTotal: toNumber(item.line_total ?? pricingSummary.line_total),
    onlineDueAmount: toNumber(item.online_due_amount ?? pricingSummary.due_now),
    offlineDueAmount: toNumber(item.offline_due_amount ?? pricingSummary.due_later),
    remainingBalanceAmount: toNumber(item.remaining_balance_amount ?? pricingSummary.remaining_balance_amount),
    currency: pricingSummary.currency ?? eventPackage.currency ?? fallback.currency ?? 'AED',
    eventImage,
    venueImage,
    image: pickFirstImage(eventImage, venueImage, fallback.image),
    paymentMode: item.payment_mode ?? eventPackage.payment_mode ?? fallback.paymentMode ?? 'full',
    pricingSummary,
    inventoryHold: Array.isArray(item.inventoryHolds || item.inventory_holds) ? (item.inventoryHolds || item.inventory_holds)[0] || null : null,
  }
}

export const fetchCustomerCart = async ({ signal } = {}) => {
  const payload = await get(customerApi.cart.show(), { signal })
  const items = Array.isArray(payload?.items) ? payload.items.map((item) => normalizeCartItem(item)).filter(Boolean) : []
  const summary = payload?.summary || {}

  return {
    ...payload,
    items,
    summary: {
      ...summary,
      grossLineTotal: toNumber(summary.gross_line_total ?? summary.line_total),
      cartEntitlementAdjustmentAmount: toNumber(summary.cart_entitlement_adjustment_amount),
      cartEntitlementAdjustments: Array.isArray(summary.cart_entitlement_adjustments) ? summary.cart_entitlement_adjustments : [],
      lineTotal: toNumber(summary.line_total),
      onlineDueAmount: toNumber(summary.online_due_amount),
      offlineDueAmount: toNumber(summary.offline_due_amount),
      remainingBalanceAmount: toNumber(summary.remaining_balance_amount),
      itemCount: Number(summary.item_count) || items.reduce((count, item) => count + Math.max(1, toNumber(item?.quantity)), 0),
      currency: summary.currency || payload?.currency || 'AED',
    },
  }
}

export const addCustomerCartItem = async ({ item, signal } = {}) => {
  const payload = await post(customerApi.cart.addItem(), {
    body: {
      event_id: item.eventId,
      event_occurrence_id: item.eventOccurrenceId,
      event_package_id: item.packageId,
      slot_key: item.slotKey ?? item.occurrenceDate ?? null,
      package_selection: item.packageStableKey ?? item.packageSelection ?? null,
      package_stable_key: item.packageStableKey ?? item.packageSelection ?? null,
      audience_pricing_code: normalizeAudienceSelectorCode(item.packageVariantKey)
        ?? normalizeAudienceSelectorCode(item.selectedVariant?.code),
      quantity: Math.max(1, Number(item.quantity || item.packageQuantity || item.guests || 1)),
      guest_count: Math.max(1, Number(item.guestCount || item.packageGuestCount || item.guests || 1)),
    },
    signal,
  })

  return normalizeCartItem(payload, item)
}

export const updateCustomerCartItem = async ({ cartItemId, quantity, signal } = {}) => {
  const payload = await patch(customerApi.cart.updateItem(cartItemId), {
    body: {
      quantity: Math.max(1, Number(quantity || 1)),
    },
    signal,
  })

  return normalizeCartItem(payload)
}

export const removeCustomerCartItem = async ({ cartItemId, signal } = {}) => del(customerApi.cart.removeItem(cartItemId), { signal })
export const clearCustomerCart = async ({ signal } = {}) => del(customerApi.cart.clear(), { signal })
