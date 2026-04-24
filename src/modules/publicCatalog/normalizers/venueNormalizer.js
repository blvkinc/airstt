import {
  normalizePaginatedCollectionEnvelope,
  normalizeResourceEnvelope,
} from '../../../shared/api/normalizeResponse'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizePublicVenueLocation = (location) => {
  if (!isPlainObject(location)) return null

  return {
    ...location,
    label: location.label ?? null,
    address_line_1: location.address_line_1 ?? null,
    address_line_2: location.address_line_2 ?? null,
    locality: location.locality ?? null,
    region: location.region ?? null,
    postal_code: location.postal_code ?? null,
    country_code: location.country_code ?? null,
    latitude: location.latitude ?? null,
    longitude: location.longitude ?? null,
    formatted_address: location.formatted_address ?? null,
    map_links: isPlainObject(location.map_links) ? { ...location.map_links } : null,
  }
}

const normalizePublicVenueBrand = (brand) => {
  if (!isPlainObject(brand)) return null

  return {
    ...brand,
    id: brand.id ?? null,
    name: brand.name ?? null,
  }
}

const normalizePublicVenueArea = (area) => {
  if (!isPlainObject(area)) return null

  return {
    ...area,
    id: area.id ?? null,
    name: area.name ?? null,
    city: isPlainObject(area.city)
      ? {
          ...area.city,
          id: area.city.id ?? null,
          name: area.city.name ?? null,
        }
      : null,
  }
}


const normalizePublicVenueType = (venueType) => {
  if (!isPlainObject(venueType)) return null

  return {
    ...venueType,
    id: venueType.id ?? null,
    name: venueType.name ?? null,
    slug: venueType.slug ?? null,
  }
}

const normalizePublicVenueMedia = (media) => {
  if (!isPlainObject(media)) return null

  return {
    ...media,
    id: media.id ?? null,
    service_provider_asset_id: media.service_provider_asset_id ?? null,
    media_type: media.media_type ?? null,
    purpose: media.purpose ?? null,
    asset_url: media.asset_url ?? null,
    is_visible: media.is_visible ?? null,
    is_in_gallery: media.is_in_gallery ?? null,
    gallery_sort_order: media.gallery_sort_order ?? null,
    sort_order: media.sort_order ?? null,
  }
}

const normalizePublicVenueFaq = (faq) => {
  if (!isPlainObject(faq)) return null

  return {
    ...faq,
    id: faq.id ?? null,
    question: faq.question ?? null,
    answer: faq.answer ?? null,
    sort_order: faq.sort_order ?? null,
    status: faq.status ?? null,
  }
}

const normalizePublicVenueEvent = (event) => {
  if (!isPlainObject(event)) return null

  return {
    ...event,
    id: event.id ?? null,
    title: event.title ?? null,
    slug: event.slug ?? null,
    service_period: event.service_period ?? null,
    environment_type: event.environment_type ?? null,
  }
}

const normalizePublicVenueMeta = (meta) => {
  if (!isPlainObject(meta)) return null

  return {
    ...meta,
    title: meta.title ?? null,
    description: meta.description ?? null,
  }
}

export const normalizePublicVenue = (venue) => {
  if (!isPlainObject(venue)) return null

  return {
    ...venue,
    id: venue.id ?? null,
    name: venue.name ?? null,
    slug: venue.slug ?? null,
    short_description: venue.short_description ?? null,
    accessibility_info: venue.accessibility_info ?? null,
    publication_state: venue.publication_state ?? null,
    status: venue.status ?? null,
    display_rating: venue.display_rating ?? null,
    address_line_1: venue.address_line_1 ?? null,
    address_line_2: venue.address_line_2 ?? null,
    locality: venue.locality ?? null,
    region: venue.region ?? null,
    postal_code: venue.postal_code ?? null,
    country_code: venue.country_code ?? null,
    latitude: venue.latitude ?? null,
    longitude: venue.longitude ?? null,
    location: normalizePublicVenueLocation(venue.location),
    brand: normalizePublicVenueBrand(venue.brand),
    venue_types: Array.isArray(venue.venue_types) ? venue.venue_types.map(normalizePublicVenueType).filter(Boolean) : [],
    area: normalizePublicVenueArea(venue.area),
    media: Array.isArray(venue.media) ? venue.media.map(normalizePublicVenueMedia).filter(Boolean) : [],
    faqs: Array.isArray(venue.faqs) ? venue.faqs.map(normalizePublicVenueFaq).filter(Boolean) : [],
    events: Array.isArray(venue.events) ? venue.events.map(normalizePublicVenueEvent).filter(Boolean) : [],
    meta: normalizePublicVenueMeta(venue.meta),
  }
}

export const normalizePublicVenueResponse = (payload) => normalizePublicVenue(normalizeResourceEnvelope(payload))

export const normalizePublicVenueListResponse = (payload) => {
  const { items, meta, links } = normalizePaginatedCollectionEnvelope(payload)

  return {
    items: items.map(normalizePublicVenue).filter(Boolean),
    meta: meta ? { ...meta } : null,
    links: links ? { ...links } : null,
  }
}
