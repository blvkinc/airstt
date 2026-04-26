export const mapVenueType = (venueType) => {
  if (!venueType) return null

  return {
    id: venueType.id ?? null,
    name: venueType.name ?? null,
    slug: venueType.slug ?? null,
  }
}

const mediaPurposeRank = {
  cover: 0,
  gallery: 1,
  og: 2,
}

const toSortableNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY
}

const getOrderedVenueImageUrls = (media = []) => media
  .filter((item) => item?.asset_url && item?.media_type !== 'video' && item?.is_visible !== false)
  .sort((left, right) => {
    const leftPurposeRank = mediaPurposeRank[left?.purpose] ?? 99
    const rightPurposeRank = mediaPurposeRank[right?.purpose] ?? 99
    if (leftPurposeRank !== rightPurposeRank) return leftPurposeRank - rightPurposeRank

    const leftGalleryRank = left?.is_in_gallery === false ? 1 : 0
    const rightGalleryRank = right?.is_in_gallery === false ? 1 : 0
    if (leftGalleryRank !== rightGalleryRank) return leftGalleryRank - rightGalleryRank

    const leftGallerySortOrder = toSortableNumber(left?.gallery_sort_order)
    const rightGallerySortOrder = toSortableNumber(right?.gallery_sort_order)
    if (leftGallerySortOrder !== rightGallerySortOrder) return leftGallerySortOrder - rightGallerySortOrder

    const leftSortOrder = toSortableNumber(left?.sort_order)
    const rightSortOrder = toSortableNumber(right?.sort_order)
    if (leftSortOrder !== rightSortOrder) return leftSortOrder - rightSortOrder

    return 0
  })
  .map((item) => item.asset_url)

export const mapVenueCard = (venue) => {
  if (!venue) return null

  const address = [venue.location?.label, venue.locality, venue.region].filter(Boolean).join(', ')
  const venueTypes = (venue.venue_types || []).map(mapVenueType).filter(Boolean)
  const images = getOrderedVenueImageUrls(venue.media || [])

  return {
    id: venue.id,
    name: venue.name ?? null,
    image: images[0] ?? null,
    images,
    category: venue.brand?.name ?? venue.area?.name ?? venueTypes[0]?.name ?? null,
    venueTypes,
    address: address || null,
    location: address || null,
    rating: typeof venue.display_rating === 'number' ? venue.display_rating : Number(venue.display_rating) || null,
    reviews: null,
    description: venue.short_description ?? null,
    amenities: [],
    capacity: null,
    upcomingEvents: venue.events?.length ?? 0,
    familyFriendly: null,
    animalFriendly: null,
    environmentType: null,
  }
}

export const mapVenueDetail = (venue) => {
  const card = mapVenueCard(venue)
  if (!card) return null

  return {
    ...card,
    address: [venue.address_line_1, venue.address_line_2, venue.locality, venue.region].filter(Boolean).join(', ') || card.address,
    highlights: card.venueTypes.map((venueType) => venueType.name),
    reviews: [],
    reviewCount: null,
    priceRange: null,
    phone: null,
    website: null,
    upcomingEvents: (venue.events || []).map((event) => ({
      id: event.id,
      title: event.title ?? null,
      date: event.service_period ? `${event.service_period} service` : null,
      time: event.environment_type ?? null,
      price: null,
      image: event.media?.[0]?.asset_url ?? null,
    })),
  }
}
