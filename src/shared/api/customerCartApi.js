import { del, get, patch, post } from './apiClient'
import { customerApi } from './apiEndpoints'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

const normalizeCartItem = (item, fallback = {}) => {
  if (!item || typeof item !== 'object') return null

  const eventPackage = item.eventPackage || item.event_package || {}
  const event = eventPackage.event || {}
  const venue = event.venue || {}
  const eventOccurrence = item.eventOccurrence || item.event_occurrence || {}
  const selectedVariant = fallback.selectedVariant || null

  return {
    id: item.id ?? fallback.id ?? null,
    cartItemId: item.id ?? fallback.cartItemId ?? null,
    eventId: event.id ?? eventPackage.event_id ?? fallback.eventId ?? null,
    eventOccurrenceId: eventOccurrence.id ?? fallback.eventOccurrenceId ?? null,
    occurrenceDate: eventOccurrence.occurrence_date ?? fallback.occurrenceDate ?? null,
    eventTitle: event.title ?? fallback.eventTitle ?? 'Event',
    venue: venue.name ?? fallback.venue ?? '',
    date: eventOccurrence.occurrence_date ?? fallback.date ?? '',
    time: fallback.time ?? '',
    packageId: eventPackage.id ?? fallback.packageId ?? null,
    packageFamilyKey: eventPackage.family_key ?? fallback.packageFamilyKey ?? null,
    packageVariantKey: eventPackage.variant_key ?? fallback.packageVariantKey ?? selectedVariant?.code ?? null,
    packageVariantLabel: eventPackage.audience_label ?? fallback.packageVariantLabel ?? selectedVariant?.label ?? null,
    packageTypeLabel: fallback.packageTypeLabel ?? null,
    inventoryLabel: fallback.inventoryLabel ?? null,
    packageName: eventPackage.display_name ?? eventPackage.name ?? fallback.packageName ?? 'Package',
    guests: item.guest_count ?? fallback.guests ?? 1,
    quantity: item.quantity ?? fallback.quantity ?? 1,
    price: fallback.price ?? toNumber(eventPackage.base_price),
    image: fallback.image ?? null,
    paymentMode: eventPackage.payment_mode ?? fallback.paymentMode ?? 'full',
    depositAmount: fallback.depositAmount ?? toNumber(eventPackage.deposit_value),
    inventoryHold: Array.isArray(item.inventoryHolds || item.inventory_holds) ? (item.inventoryHolds || item.inventory_holds)[0] || null : null,
  }
}

export const fetchCustomerCart = async ({ signal } = {}) => {
  const payload = await get(customerApi.cart.show(), { signal })
  const items = Array.isArray(payload?.items) ? payload.items.map((item) => normalizeCartItem(item)).filter(Boolean) : []

  return {
    ...payload,
    items,
  }
}

export const addCustomerCartItem = async ({ item, signal } = {}) => {
  const payload = await post(customerApi.cart.addItem(), {
    body: {
      event_occurrence_id: item.eventOccurrenceId,
      event_package_id: item.packageId,
      package_selection: item.packageSelection ?? null,
      audience_pricing_code: item.packageVariantKey ?? item.selectedVariant?.code ?? null,
      quantity: Math.max(1, Number(item.guests || 1)),
      guest_count: Math.max(1, Number(item.guests || 1)),
    },
    signal,
  })

  return normalizeCartItem(payload, item)
}

export const updateCustomerCartItem = async ({ cartItemId, guests, signal } = {}) => {
  const payload = await patch(customerApi.cart.updateItem(cartItemId), {
    body: {
      quantity: Math.max(1, Number(guests || 1)),
      guest_count: Math.max(1, Number(guests || 1)),
    },
    signal,
  })

  return normalizeCartItem(payload)
}

export const removeCustomerCartItem = async ({ cartItemId, signal } = {}) => del(customerApi.cart.removeItem(cartItemId), { signal })
export const clearCustomerCart = async ({ signal } = {}) => del(customerApi.cart.clear(), { signal })
