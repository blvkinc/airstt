import { eventCatalog, venueCatalog } from '../../../features/experiences/data'
import { getEventById, getVenueById } from '../../../features/experiences/data/selectors'

const CURRENCY = 'AED'

const slugify = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const normalizeText = (value) => String(value || '').trim().toLowerCase()

const containsText = (value, searchTerm) => normalizeText(value).includes(normalizeText(searchTerm))

const uniqueBy = (items, getKey) => {
  const seen = new Set()
  return items.filter((item) => {
    const key = getKey(item)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const formatCategory = (name) => ({
  id: slugify(name),
  name,
  slug: slugify(name),
  displayName: name,
})

const getVenueTypeName = (venue) => venue.type || venue.category || 'Venue'

const formatVenueType = (name) => ({
  id: slugify(name),
  name,
  slug: slugify(name),
})

const getEventSearchValues = (event) => [
  event.title,
  event.venue,
  event.location,
  event.category,
  event.type,
  event.brand,
  ...(event.tags || []),
]

const getVenueSearchValues = (venue) => [
  venue.name,
  venue.category,
  venue.type,
  venue.location,
  venue.area,
  venue.brand,
  ...(venue.amenities || []),
]

const matchesSearch = (values, searchTerm) => {
  if (!normalizeText(searchTerm)) return true
  return values.some((value) => containsText(value, searchTerm))
}

const matchesExploreFilters = (item, filters = {}) => {
  if (filters.location && !matchesSearch([item.location, item.address, item.area], filters.location)) return false
  if (filters.servicePeriod !== 'all' && item.dayPeriod !== filters.servicePeriod) return false
  if (filters.environmentType !== 'all' && item.indoorOutdoor !== filters.environmentType) return false
  if (filters.familyFriendly !== 'all' && Boolean(item.familyFriendly) !== (filters.familyFriendly === 'yes')) return false
  if (filters.animalFriendly !== 'all' && Boolean(item.animalFriendly) !== (filters.animalFriendly === 'yes')) return false
  if (filters.rating !== 'all' && Number(item.rating || 0) < Number(filters.rating)) return false
  return true
}

const getOccurrenceKey = (occurrence) => String(occurrence?.slotKey || occurrence?.occurrenceDate || occurrence?.date || occurrence?.id || '')

const getOccurrenceDate = (occurrence) => occurrence?.occurrenceDate || occurrence?.date || ''

const normalizeAvailability = (value) => {
  const normalized = normalizeText(value).replace(/\s+/g, '_')
  if (normalized === 'limited') return 'limited'
  if (normalized === 'sold_out') return 'sold_out'
  if (normalized === 'available') return 'available'
  return 'unavailable'
}

const isOccurrenceBookable = (occurrence) => ['available', 'limited'].includes(normalizeAvailability(occurrence?.status))

const getPaymentAmounts = (pkg, quantity = 1) => {
  const count = Math.max(1, Number(quantity || 1))
  const unitPrice = Number(pkg?.price || 0)
  const lineTotal = unitPrice * count
  const paymentMode = pkg?.paymentMode || 'full'
  const depositUnit = Number(pkg?.depositAmount || 0)
  const dueNow = paymentMode === 'no_upfront'
    ? 0
    : paymentMode === 'deposit'
      ? (depositUnit || unitPrice * 0.3) * count
      : lineTotal
  const dueLater = Math.max(0, lineTotal - dueNow)

  return {
    paymentMode,
    unitPrice,
    lineTotal,
    dueNow,
    dueLater,
  }
}

const toDemoEventCategory = (event) => formatCategory(event.category || event.type || 'Event')

const toDemoEventCard = (event) => ({
  ...event,
  date: event.dateLabel || event.date,
  categories: [toDemoEventCategory(event)],
  availabilitySummary: event.availabilitySummary || {
    status: 'available',
    statusLabel: 'Available',
  },
})

const toDemoPackage = (pkg, occurrence, quantity = 1) => {
  const availability = normalizeAvailability(pkg.availability || occurrence?.status)
  const occurrenceBookable = isOccurrenceBookable(occurrence)
  const isBookable = occurrenceBookable && availability !== 'sold_out' && availability !== 'unavailable'
  const familyKey = pkg.packageFamilyKey || `package-${pkg.id}`
  const variantKey = pkg.packageVariantKey || 'default'
  const selectionKey = [pkg.id, getOccurrenceKey(occurrence), familyKey].join(':')
  const stableKey = [familyKey, variantKey, pkg.id].join(':')
  const amounts = getPaymentAmounts(pkg, quantity)

  return {
    ...pkg,
    id: pkg.id,
    eventPackageId: pkg.id,
    occurrencePackageId: selectionKey,
    familyKey,
    familyName: pkg.name,
    variantKey,
    variantLabel: pkg.packageVariantLabel || 'All guests',
    selectionKey,
    stableKey,
    displayName: pkg.name,
    packageTypeLabel: pkg.packageTypeLabel || pkg.type || 'Package',
    price: amounts.unitPrice,
    originalPrice: pkg.originalPrice || null,
    paymentMode: amounts.paymentMode,
    depositAmount: pkg.depositAmount || 0,
    pricingSummary: {
      currency: CURRENCY,
      unit_price: amounts.unitPrice,
      base_unit_price: pkg.originalPrice || amounts.unitPrice,
      line_total: amounts.lineTotal,
      due_now: amounts.dueNow,
      due_later: amounts.dueLater,
      remaining_balance_amount: amounts.dueLater,
      payment_mode: amounts.paymentMode,
      deposit: amounts.paymentMode === 'deposit'
        ? {
            value: pkg.depositAmount || 0,
            due_now: amounts.dueNow,
          }
        : null,
    },
    availability,
    isBookable,
    statusLabel: isBookable ? null : availability === 'sold_out' ? 'Sold out' : 'Unavailable',
    cardStatusLabel: isBookable ? null : availability === 'sold_out' ? 'Sold out' : 'Unavailable',
    inventoryRemaining: isBookable ? occurrence?.packagesAvailable ?? null : 0,
    availabilityLabel: isBookable ? 'Demo availability' : null,
    inventoryLabel: isBookable ? 'Demo availability' : null,
    currency: CURRENCY,
    guestCount: pkg.maxGuests || 1,
    audienceCode: variantKey,
    audienceLabel: pkg.packageVariantLabel || 'All guests',
    selectedVariant: {
      code: variantKey,
      label: pkg.packageVariantLabel || 'All guests',
    },
  }
}

const toDemoOccurrence = (event, occurrence, quantity = 1) => {
  const status = normalizeAvailability(occurrence.status)
  const packages = (event.packages || []).map((pkg) => toDemoPackage(pkg, occurrence, quantity))

  return {
    ...occurrence,
    id: getOccurrenceKey(occurrence),
    slotKey: getOccurrenceKey(occurrence),
    occurrenceDate: getOccurrenceDate(occurrence),
    eventOccurrenceId: occurrence.id || getOccurrenceKey(occurrence),
    persistedOccurrenceId: occurrence.id || getOccurrenceKey(occurrence),
    date: occurrence.date || getOccurrenceDate(occurrence),
    status,
    isBookable: isOccurrenceBookable(occurrence),
    statusLabel: status.replace(/_/g, ' '),
    packagesAvailable: packages.filter((pkg) => pkg.isBookable).length,
    packages,
  }
}

export const demoEventCategories = uniqueBy(
  eventCatalog.map((event) => toDemoEventCategory(event)),
  (category) => category.id,
)

export const demoVenueTypes = uniqueBy(
  venueCatalog.map((venue) => formatVenueType(getVenueTypeName(venue))),
  (venueType) => venueType.id,
)

export const getDemoEvents = ({ searchTerm } = {}) =>
  eventCatalog
    .filter((event) => matchesSearch(getEventSearchValues(event), searchTerm))
    .map(toDemoEventCard)

export const getDemoEventDetail = ({ eventId, quantity = 1 } = {}) => {
  const event = getEventById(eventId)
  if (!event) {
    const error = new Error('Event not found')
    error.status = 404
    throw error
  }

  const occurrences = (event.occurrences || []).map((occurrence) => toDemoOccurrence(event, occurrence, quantity))
  const primaryOccurrence = occurrences.find((occurrence) => occurrence.isBookable) || occurrences[0] || null

  return {
    ...toDemoEventCard(event),
    occurrences,
    packages: primaryOccurrence?.packages || [],
  }
}

export const getDemoOccurrenceDetail = ({ eventId, slotKey, filters = {} } = {}) => {
  const event = getEventById(eventId)
  if (!event || !slotKey) return null

  const quantity = Math.max(1, Number(filters.quantity || 1))
  const occurrence = (event.occurrences || []).find((entry) => getOccurrenceKey(entry) === String(slotKey))
  return occurrence ? toDemoOccurrence(event, occurrence, quantity) : null
}

export const getDemoEventPackages = ({ eventId } = {}) => {
  const detail = getDemoEventDetail({ eventId })
  return {
    id: detail.id,
    title: detail.title,
    venue: detail.venue,
    image: detail.image,
    date: detail.date,
    time: detail.time,
    location: detail.location,
    rating: detail.rating,
    reviews: detail.reviews,
    packages: detail.packages,
  }
}

export const getDemoVenues = ({ searchTerm, venueTypeIds = [] } = {}) =>
  venueCatalog
    .filter((venue) => matchesSearch(getVenueSearchValues(venue), searchTerm))
    .filter((venue) => {
      if (!venueTypeIds.length) return true
      return venueTypeIds.includes(slugify(getVenueTypeName(venue)))
    })
    .map(toDemoVenueCard)

export function toDemoVenueCard(venue) {
  const venueType = formatVenueType(getVenueTypeName(venue))

  return {
    ...venue,
    address: venue.address || venue.location || '',
    venueTypes: [venueType],
    upcomingEvents: eventCatalog.filter((event) => Number(event.venueId) === Number(venue.id)).length,
    familyFriendly: venue.familyFriendly,
    animalFriendly: venue.animalFriendly,
    environmentType: venue.indoorOutdoor,
  }
}

export const getDemoVenueDetail = ({ venueId } = {}) => {
  const venue = getVenueById(venueId)
  if (!venue) {
    const error = new Error('Venue not found')
    error.status = 404
    throw error
  }

  const upcomingEvents = eventCatalog
    .filter((event) => Number(event.venueId) === Number(venue.id))
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: event.dateLabel || event.date,
      time: event.time,
      price: event.price,
      image: event.image,
    }))

  return {
    ...toDemoVenueCard(venue),
    upcomingEvents,
    highlights: venue.highlights || venue.amenities || [],
    reviews: venue.reviewEntries || [],
    reviewCount: venue.reviews || 0,
  }
}

export const getDemoExploreResults = ({ searchTerm, filters = {} } = {}) => {
  const activeFilters = filters || {}
  const events = eventCatalog
    .filter((event) => matchesSearch(getEventSearchValues(event), searchTerm))
    .filter((event) => matchesExploreFilters(event, activeFilters))
    .map(toDemoEventCard)
  const venues = venueCatalog
    .filter((venue) => matchesSearch(getVenueSearchValues(venue), searchTerm))
    .filter((venue) => matchesExploreFilters(venue, activeFilters))
    .map(toDemoVenueCard)

  return {
    events,
    venues,
    total: events.length + venues.length,
  }
}

export const getDemoHomepagePlacements = () => ([
  {
    id: 'featured-events',
    title: 'Featured events',
    subtitle: 'Demo editorial placement',
    events: eventCatalog.slice(0, 6).map((event, index) => ({
      id: `featured-event-${event.id}`,
      eventId: event.id,
      sortOrder: index,
      event: toDemoEventCard(event),
    })),
  },
])
