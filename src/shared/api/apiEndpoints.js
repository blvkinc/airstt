const PUBLIC_ROUTE_PREFIX = '/public'

const buildPublicPath = (...segments) => [PUBLIC_ROUTE_PREFIX, ...segments]
  .map((segment, index) => {
    if (index === 0) return segment.replace(/\/+$/, '')
    return String(segment).replace(/^\/+|\/+$/g, '')
  })
  .join('/')

export const publicRouteFamilies = Object.freeze({
  root: PUBLIC_ROUTE_PREFIX,
  events: buildPublicPath('events'),
  venues: buildPublicPath('venues'),
  taxonomy: Object.freeze({
    categories: buildPublicPath('event-categories'),
    tags: buildPublicPath('event-tags'),
    venueTypes: buildPublicPath('venue-types'),
  }),
  homepage: Object.freeze({
    placements: buildPublicPath('homepage-placements'),
  }),
  platform: Object.freeze({
    branding: buildPublicPath('platform-branding'),
  }),
})

export const publicApi = Object.freeze({
  events: Object.freeze({
    list: () => publicRouteFamilies.events,
    detail: (eventId) => buildPublicPath('events', eventId),
    offerings: (eventId) => buildPublicPath('events', eventId, 'offerings'),
    availabilityIndex: (eventId) => buildPublicPath('events', eventId, 'availability'),
    availabilityDetail: (eventId, slotKey) => buildPublicPath('events', eventId, 'availability', slotKey),
  }),
  venues: Object.freeze({
    list: () => publicRouteFamilies.venues,
    detail: (venueId) => buildPublicPath('venues', venueId),
  }),
  taxonomy: Object.freeze({
    categories: () => publicRouteFamilies.taxonomy.categories,
    tags: () => publicRouteFamilies.taxonomy.tags,
    venueTypes: () => publicRouteFamilies.taxonomy.venueTypes,
  }),
  homepage: Object.freeze({
    placements: () => publicRouteFamilies.homepage.placements,
  }),
  platform: Object.freeze({
    branding: () => publicRouteFamilies.platform.branding,
  }),
})

export { PUBLIC_ROUTE_PREFIX, buildPublicPath }

export const customerApi = Object.freeze({
  cart: Object.freeze({
    show: () => '/cart',
    clear: () => '/cart',
    addItem: () => '/cart/items',
    updateItem: (cartItemId) => `/cart/items/${cartItemId}`,
    removeItem: (cartItemId) => `/cart/items/${cartItemId}`,
  }),
  checkout: Object.freeze({
    create: () => '/checkout',
    paymentSession: (paymentId) => `/payments/${paymentId}/checkout-session`,
  }),
  orders: Object.freeze({
    index: () => '/me/orders',
    show: (orderId) => `/me/orders/${orderId}`,
    paymentStatus: (orderId) => `/orders/${orderId}/payment-status`,
  }),
  bookings: Object.freeze({
    index: () => '/me/bookings',
    show: (bookingId) => `/me/bookings/${bookingId}`,
  }),
})
