export const mapVenueType = (venueType) => {
  if (!venueType) return null

  return {
    id: venueType.id ?? null,
    name: venueType.name ?? null,
    slug: venueType.slug ?? null,
  }
}

export const mapVenueCard = (venue) => {
  if (!venue) return null

  const address = [venue.location?.label, venue.locality, venue.region].filter(Boolean).join(', ')
  const venueTypes = (venue.venue_types || []).map(mapVenueType).filter(Boolean)

  return {
    id: venue.id,
    name: venue.name ?? null,
    image: venue.media?.[0]?.asset_url ?? null,
    images: (venue.media || []).map((media) => media?.asset_url).filter(Boolean),
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
