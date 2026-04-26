import { get, post } from './apiClient'
import { customerApi } from './apiEndpoints'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

const formatOccurrenceDate = (value) => {
  if (!value) return ''
  const normalized = String(value)
  return normalized.includes('T') ? normalized.slice(0, 10) : normalized
}

const formatOccurrenceTime = (value) => {
  if (!value) return ''
  const normalized = String(value)
  return normalized.includes('T') ? normalized.slice(11, 16) : normalized
}

const normalizeBookingItem = (item) => {
  if (!item || typeof item !== 'object') return null

  const snapshot = item.snapshot_json || {}
  const snapshotEvent = snapshot.event || {}
  const snapshotVenue = snapshot.venue || {}
  const snapshotOccurrence = snapshot.occurrence || {}
  const snapshotPackage = snapshot.package || {}
  const eventOccurrence = item.eventOccurrence || item.event_occurrence || {}
  const eventPackage = item.eventPackage || item.event_package || {}
  const event = eventPackage.event || {}
  const selectedVariant = snapshotPackage.selected_variant || null

  return {
    id: item.id ?? null,
    status: item.status || 'pending',
    eventId: item.event_id ?? snapshotEvent.id ?? event.id ?? null,
    event: snapshotEvent.title || event.title || 'Event',
    venue: snapshotVenue.name || event?.venue?.name || '',
    slotKey: snapshotOccurrence.slot_key || item.slot_key || eventOccurrence.slot_key || formatOccurrenceDate(snapshotOccurrence.occurrence_date || eventOccurrence.occurrence_date || eventOccurrence.starts_at),
    occurrenceDate: formatOccurrenceDate(snapshotOccurrence.occurrence_date || eventOccurrence.occurrence_date || eventOccurrence.starts_at),
    date: formatOccurrenceDate(snapshotOccurrence.occurrence_date || eventOccurrence.occurrence_date || eventOccurrence.starts_at),
    time: formatOccurrenceTime(snapshotOccurrence.starts_at || eventOccurrence.starts_at),
    packageId: item.event_package_id ?? snapshotPackage.id ?? eventPackage.id ?? null,
    packageFamilyKey: snapshotPackage.family_key || eventPackage.family_key || null,
    packageVariantKey: selectedVariant?.code || snapshotPackage.variant_key || eventPackage.variant_key || null,
    packageVariantLabel: selectedVariant?.label || snapshotPackage.audience_label || eventPackage.audience_label || null,
    packageType: snapshotPackage.package_type || eventPackage.package_type || null,
    packageName: snapshotPackage.display_name || snapshotPackage.fallback_name || eventPackage.display_name || eventPackage.name || 'Package',
    guests: item.guest_count ?? snapshotPackage.guest_count ?? 1,
    quantity: item.quantity ?? 1,
    lineTotal: toNumber(item.line_total),
    onlineDueAmount: toNumber(item.online_due_amount),
    offlineDueAmount: toNumber(item.offline_due_amount),
    paymentMode: item.payment_mode || snapshotPackage.payment_mode || 'full',
    selectedVariant,
    eTicket: item.e_ticket_artifact || null,
  }
}

const normalizeBooking = (booking) => {
  if (!booking || typeof booking !== 'object') return null

  const items = Array.isArray(booking.bookingItems || booking.booking_items)
    ? (booking.bookingItems || booking.booking_items).map(normalizeBookingItem).filter(Boolean)
    : []

  const firstItem = items[0] || {}

  return {
    id: booking.id ?? null,
    bookingReference: booking.booking_reference || '',
    status: booking.status || 'pending',
    orderId: booking.order_id ?? booking.order?.id ?? null,
    orderNumber: booking.order?.order_number || '',
    venue: booking.venue?.name || firstItem.venue || '',
    event: firstItem.event || 'Booking',
    date: firstItem.date || '',
    time: firstItem.time || '',
    occurrenceDate: firstItem.occurrenceDate || '',
    packageName: firstItem.packageName || '',
    packageVariantLabel: firstItem.packageVariantLabel || '',
    guests: firstItem.guests || 1,
    price: firstItem.lineTotal || 0,
    image: null,
    receiptArtifact: booking.receipt_artifact || null,
    items,
  }
}

const normalizeOrder = (order) => {
  if (!order || typeof order !== 'object') return null

  const bookings = Array.isArray(order.venueBookings || order.venue_bookings)
    ? (order.venueBookings || order.venue_bookings).map(normalizeBooking).filter(Boolean)
    : []

  const items = bookings.flatMap((booking) => booking.items || [])

  return {
    id: order.id ?? null,
    orderNumber: order.order_number || '',
    status: order.status || 'pending',
    currency: order.currency || 'AED',
    placedAt: order.placed_at || order.created_at || '',
    grossTotal: toNumber(order.gross_total),
    onlineDueTotal: toNumber(order.online_due_total),
    offlineDueTotal: toNumber(order.offline_due_total),
    payment: Array.isArray(order.payments) ? order.payments[0] || null : null,
    bookings,
    items,
  }
}

export const submitCustomerCheckout = async ({ signal } = {}) => {
  const payload = await post(customerApi.checkout.create(), { signal })

  return {
    order: normalizeOrder(payload?.order),
    payment: payload?.payment || null,
    checkoutSession: payload?.checkout_session || null,
  }
}

export const createCustomerPaymentSession = async ({ paymentId, signal } = {}) => {
  const payload = await post(customerApi.checkout.paymentSession(paymentId), { signal })
  return payload?.checkout_session || null
}

export const fetchCustomerPaymentStatus = async ({ orderId, paymentId, sessionId, signal } = {}) => {
  return get(customerApi.orders.paymentStatus(orderId), {
    signal,
    query: {
      payment: paymentId,
      session_id: sessionId,
    },
  })
}

export const fetchCustomerOrder = async ({ orderId, signal } = {}) => {
  const payload = await get(customerApi.orders.show(orderId), { signal })
  return normalizeOrder(payload?.data)
}

export const fetchCustomerOrders = async ({ signal } = {}) => {
  const payload = await get(customerApi.orders.index(), { signal })
  return Array.isArray(payload?.data) ? payload.data.map(normalizeOrder).filter(Boolean) : []
}

export const fetchCustomerBookings = async ({ signal } = {}) => {
  const payload = await get(customerApi.bookings.index(), { signal })
  return Array.isArray(payload?.data) ? payload.data.map(normalizeBooking).filter(Boolean) : []
}
