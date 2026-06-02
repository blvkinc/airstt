import { bookingFixtures } from '../../features/profile/profileFixtures'
import { buildDemoCartSummary, readDemoCartItems, writeDemoCartItems } from './customerCartApi'

const DEMO_ORDERS_KEY = 'stt_demo_orders'

const readOrders = () => {
  const raw = localStorage.getItem(DEMO_ORDERS_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeOrders = (orders) => {
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders))
}

const buildBookingFromCartItem = (item, orderId, index) => ({
  id: `${orderId}-booking-${index + 1}`,
  bookingReference: `DEMO-${orderId}-${index + 1}`,
  status: 'confirmed',
  orderId,
  orderNumber: `STT-DEMO-${orderId}`,
  venue: item.venue,
  event: item.eventTitle,
  date: item.date || item.occurrenceDate,
  time: item.time || '',
  occurrenceDate: item.occurrenceDate || item.date,
  packageName: item.packageName,
  packageVariantLabel: item.packageVariantLabel,
  guests: item.guests || item.quantity || 1,
  price: item.lineTotal || 0,
  image: item.image || null,
  receiptArtifact: {
    file_name: `receipt-${orderId}-${index + 1}.pdf`,
    download_url: '',
  },
  items: [{
    id: item.id,
    status: 'confirmed',
    eventId: item.eventId,
    event: item.eventTitle,
    venue: item.venue,
    slotKey: item.slotKey,
    occurrenceDate: item.occurrenceDate,
    date: item.date || item.occurrenceDate,
    time: item.time || '',
    packageId: item.packageId,
    packageFamilyKey: item.packageFamilyKey,
    packageVariantKey: item.packageVariantKey,
    packageVariantLabel: item.packageVariantLabel,
    packageType: item.packageTypeLabel,
    packageName: item.packageName,
    guests: item.guests || item.quantity || 1,
    quantity: item.quantity || 1,
    lineTotal: item.lineTotal || 0,
    onlineDueAmount: item.onlineDueAmount || 0,
    offlineDueAmount: item.offlineDueAmount || 0,
    paymentMode: item.paymentMode || 'full',
    selectedVariant: item.selectedVariant || null,
    eTicket: null,
  }],
})

const buildOrderFromCart = (items) => {
  const summary = buildDemoCartSummary(items)
  const id = Date.now()
  const bookings = items.map((item, index) => buildBookingFromCartItem(item, id, index))

  return {
    id,
    orderNumber: `STT-DEMO-${id}`,
    status: 'confirmed',
    currency: 'AED',
    placedAt: new Date().toISOString(),
    grossTotal: summary.lineTotal,
    onlineDueTotal: summary.onlineDueAmount,
    offlineDueTotal: summary.offlineDueAmount,
    payment: {
      id: `demo-payment-${id}`,
      status: summary.onlineDueAmount > 0 ? 'paid' : 'not_required',
    },
    bookings,
    items: bookings.flatMap((booking) => booking.items),
  }
}

const getSeedBookings = () => bookingFixtures.map((booking) => ({
  ...booking,
  bookingReference: `DEMO-SEED-${booking.id}`,
  packageName: booking.package,
  occurrenceDate: booking.date,
  receiptArtifact: null,
  items: [],
}))

export const submitCustomerCheckout = async () => {
  const cartItems = readDemoCartItems()
  if (cartItems.length === 0) {
    throw new Error('Your demo cart is empty.')
  }

  const order = buildOrderFromCart(cartItems)
  writeOrders([order, ...readOrders()])
  writeDemoCartItems([])

  return {
    order,
    payment: order.payment,
    checkoutSession: null,
  }
}

export const createCustomerPaymentSession = async () => ({
  url: '',
})

export const fetchCustomerPaymentStatus = async ({ orderId } = {}) => ({
  state: 'confirmed',
  payment_status: 'paid',
  order_number: `STT-DEMO-${orderId}`,
  retry_eligible: false,
  ui: {
    title: 'Demo payment confirmed',
    message: 'This prototype confirms payment locally.',
  },
})

export const fetchCustomerOrder = async ({ orderId } = {}) => {
  const order = readOrders().find((entry) => String(entry.id) === String(orderId))
  if (!order) throw new Error('Demo order not found.')
  return order
}

export const fetchCustomerOrders = async () => readOrders()

export const fetchCustomerBookings = async () => {
  const orderBookings = readOrders().flatMap((order) => order.bookings || [])
  return [...orderBookings, ...getSeedBookings()]
}
