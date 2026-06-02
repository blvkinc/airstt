const DEMO_CART_KEY = 'stt_demo_cart'

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

const readCartItems = () => {
  const raw = localStorage.getItem(DEMO_CART_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeCartItems = (items) => {
  localStorage.setItem(DEMO_CART_KEY, JSON.stringify(items))
}

const getDueNow = ({ lineTotal, paymentMode, depositAmount }) => {
  if (paymentMode === 'no_upfront') return 0
  if (paymentMode === 'deposit') return toNumber(depositAmount) || Math.round(lineTotal * 0.3)
  return lineTotal
}

const buildCartSummary = (items = []) => items.reduce((summary, item) => ({
  ...summary,
  lineTotal: summary.lineTotal + toNumber(item.lineTotal),
  onlineDueAmount: summary.onlineDueAmount + toNumber(item.onlineDueAmount),
  offlineDueAmount: summary.offlineDueAmount + toNumber(item.offlineDueAmount),
  remainingBalanceAmount: summary.remainingBalanceAmount + toNumber(item.remainingBalanceAmount),
  itemCount: summary.itemCount + 1,
}), {
  lineTotal: 0,
  onlineDueAmount: 0,
  offlineDueAmount: 0,
  remainingBalanceAmount: 0,
  itemCount: 0,
  currency: 'AED',
})

const normalizeLocalItem = (item, fallback = {}) => {
  const quantity = Math.max(1, Number(item.quantity || item.guests || fallback.quantity || 1))
  const lineTotal = toNumber(item.lineTotal ?? item.price ?? item.unitPrice ?? fallback.lineTotal)
  const unitPrice = toNumber(item.unitPrice) || (quantity > 0 ? lineTotal / quantity : lineTotal)
  const paymentMode = item.paymentMode || fallback.paymentMode || 'full'
  const onlineDueAmount = toNumber(item.onlineDueAmount) || getDueNow({
    lineTotal,
    paymentMode,
    depositAmount: item.depositAmount || fallback.depositAmount,
  })
  const offlineDueAmount = Math.max(0, lineTotal - onlineDueAmount)

  return {
    id: item.id || fallback.id || `cart-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    cartItemId: item.cartItemId || item.id || fallback.cartItemId || null,
    eventId: item.eventId ?? fallback.eventId ?? null,
    eventOccurrenceId: item.eventOccurrenceId ?? fallback.eventOccurrenceId ?? null,
    slotKey: item.slotKey ?? item.occurrenceDate ?? fallback.slotKey ?? null,
    occurrenceDate: item.occurrenceDate ?? fallback.occurrenceDate ?? '',
    eventTitle: item.eventTitle || fallback.eventTitle || 'Demo event',
    venue: item.venue || fallback.venue || '',
    date: item.date || item.occurrenceDate || fallback.date || '',
    time: item.time || fallback.time || '',
    packageId: item.packageId ?? fallback.packageId ?? null,
    packageFamilyKey: item.packageFamilyKey || fallback.packageFamilyKey || null,
    packageVariantKey: item.packageVariantKey || fallback.packageVariantKey || null,
    packageVariantLabel: item.packageVariantLabel || fallback.packageVariantLabel || null,
    packageTypeLabel: item.packageTypeLabel || fallback.packageTypeLabel || null,
    inventoryLabel: item.inventoryLabel || fallback.inventoryLabel || null,
    packageName: item.packageName || fallback.packageName || 'Demo package',
    guests: quantity,
    quantity,
    unitPrice,
    lineTotal,
    onlineDueAmount,
    offlineDueAmount,
    remainingBalanceAmount: offlineDueAmount,
    currency: item.currency || fallback.currency || 'AED',
    eventImage: item.eventImage || item.image || fallback.eventImage || null,
    venueImage: item.venueImage || fallback.venueImage || null,
    image: item.image || item.eventImage || item.venueImage || fallback.image || null,
    paymentMode,
    pricingSummary: item.pricingSummary || fallback.pricingSummary || null,
    inventoryHold: null,
  }
}

const recalculateItem = (item, quantity) => {
  const nextQuantity = Math.max(1, Number(quantity || 1))
  const lineTotal = toNumber(item.unitPrice) * nextQuantity
  const onlineDueAmount = getDueNow({
    lineTotal,
    paymentMode: item.paymentMode,
    depositAmount: item.paymentMode === 'deposit' ? toNumber(item.onlineDueAmount) / Math.max(1, Number(item.quantity || 1)) * nextQuantity : 0,
  })
  const offlineDueAmount = Math.max(0, lineTotal - onlineDueAmount)

  return {
    ...item,
    guests: nextQuantity,
    quantity: nextQuantity,
    lineTotal,
    onlineDueAmount,
    offlineDueAmount,
    remainingBalanceAmount: offlineDueAmount,
  }
}

export const fetchCustomerCart = async () => {
  const items = readCartItems()
  return {
    items,
    summary: buildCartSummary(items),
    currency: 'AED',
  }
}

export const addCustomerCartItem = async ({ item } = {}) => {
  const items = readCartItems()
  const nextItem = normalizeLocalItem(item)
  const nextItems = [...items, nextItem]
  writeCartItems(nextItems)
  return nextItem
}

export const updateCustomerCartItem = async ({ cartItemId, quantity } = {}) => {
  const items = readCartItems()
  let updatedItem = null
  const nextItems = items.map((item) => {
    if (String(item.id) !== String(cartItemId)) return item
    updatedItem = recalculateItem(item, quantity)
    return updatedItem
  })

  writeCartItems(nextItems)
  return updatedItem
}

export const removeCustomerCartItem = async ({ cartItemId } = {}) => {
  writeCartItems(readCartItems().filter((item) => String(item.id) !== String(cartItemId)))
}

export const clearCustomerCart = async () => {
  writeCartItems([])
}

export const readDemoCartItems = readCartItems
export const writeDemoCartItems = writeCartItems
export const buildDemoCartSummary = buildCartSummary
