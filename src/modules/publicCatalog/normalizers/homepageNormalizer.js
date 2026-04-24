import { normalizePaginatedCollectionEnvelope } from '../../../shared/api/normalizeResponse'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

export const normalizePublicHomepagePlacementEvent = (event) => {
  if (!isPlainObject(event)) return null

  return {
    ...event,
    id: event.id ?? null,
    venue_id: event.venue_id ?? null,
    title: event.title ?? null,
    slug: event.slug ?? null,
    short_description: event.short_description ?? null,
    service_period: event.service_period ?? null,
    environment_type: event.environment_type ?? null,
    display_rating: event.display_rating ?? null,
    is_family_friendly: event.is_family_friendly ?? null,
    is_animal_friendly: event.is_animal_friendly ?? null,
    editorial_sort_order: event.editorial_sort_order ?? null,
    venue: isPlainObject(event.venue)
      ? {
          ...event.venue,
          id: event.venue.id ?? null,
          name: event.venue.name ?? null,
          slug: event.venue.slug ?? null,
          area: isPlainObject(event.venue.area)
            ? {
                ...event.venue.area,
                id: event.venue.area.id ?? null,
                name: event.venue.area.name ?? null,
              }
            : null,
          brand: isPlainObject(event.venue.brand)
            ? {
                ...event.venue.brand,
                id: event.venue.brand.id ?? null,
                name: event.venue.brand.name ?? null,
              }
            : null,
          location: isPlainObject(event.venue.location)
            ? {
                ...event.venue.location,
                formatted_address: event.venue.location.formatted_address ?? null,
                address_line_1: event.venue.location.address_line_1 ?? null,
              }
            : null,
        }
      : null,
    media: Array.isArray(event.media)
      ? event.media
          .map((media) => (isPlainObject(media)
            ? {
                ...media,
                id: media.id ?? null,
                asset_url: media.asset_url ?? null,
                media_type: media.media_type ?? null,
                purpose: media.purpose ?? null,
              }
            : null))
          .filter(Boolean)
      : [],
    categories: Array.isArray(event.categories)
      ? event.categories
          .map((assignment) => (isPlainObject(assignment)
            ? {
                ...assignment,
                event_category_id: assignment.event_category_id ?? null,
                is_primary: assignment.is_primary ?? null,
                category: isPlainObject(assignment.category)
                  ? {
                      ...assignment.category,
                      id: assignment.category.id ?? null,
                      name: assignment.category.name ?? null,
                      slug: assignment.category.slug ?? null,
                    }
                  : null,
              }
            : null))
          .filter(Boolean)
      : [],
    tags: Array.isArray(event.tags)
      ? event.tags
          .map((assignment) => (isPlainObject(assignment)
            ? {
                ...assignment,
                tag: isPlainObject(assignment.tag)
                  ? {
                      ...assignment.tag,
                      id: assignment.tag.id ?? null,
                      name: assignment.tag.name ?? null,
                      slug: assignment.tag.slug ?? null,
                    }
                  : null,
              }
            : null))
          .filter(Boolean)
      : [],
    packages: Array.isArray(event.packages)
      ? event.packages
          .map((pkg) => (isPlainObject(pkg)
            ? {
                ...pkg,
                id: pkg.id ?? null,
                name: pkg.name ?? null,
                guest_count: pkg.guest_count ?? null,
                base_price: pkg.base_price ?? null,
                currency: pkg.currency ?? null,
              }
            : null))
          .filter(Boolean)
      : [],
    occurrences: Array.isArray(event.occurrences)
      ? event.occurrences
          .map((occurrence) => (isPlainObject(occurrence)
            ? {
                ...occurrence,
                id: occurrence.id ?? null,
                starts_at: occurrence.starts_at ?? null,
                ends_at: occurrence.ends_at ?? null,
                occurrence_date: occurrence.occurrence_date ?? null,
                status: occurrence.status ?? null,
              }
            : null))
          .filter(Boolean)
      : [],
    availability_summary: isPlainObject(event.availability_summary)
      ? {
          ...event.availability_summary,
          next_occurrence: isPlainObject(event.availability_summary.next_occurrence)
            ? {
                ...event.availability_summary.next_occurrence,
                starts_at: event.availability_summary.next_occurrence.starts_at ?? null,
                ends_at: event.availability_summary.next_occurrence.ends_at ?? null,
                occurrence_date: event.availability_summary.next_occurrence.occurrence_date ?? null,
              }
            : null,
          next_bookable_occurrence: isPlainObject(event.availability_summary.next_bookable_occurrence)
            ? {
                ...event.availability_summary.next_bookable_occurrence,
                starts_at: event.availability_summary.next_bookable_occurrence.starts_at ?? null,
                ends_at: event.availability_summary.next_bookable_occurrence.ends_at ?? null,
                occurrence_date: event.availability_summary.next_bookable_occurrence.occurrence_date ?? null,
              }
            : null,
        }
      : null,
  }
}

export const normalizePublicHomepagePlacementEntry = (entry) => {
  if (!isPlainObject(entry)) return null

  return {
    ...entry,
    event_id: entry.event_id ?? null,
    sort_order: entry.sort_order ?? null,
    event: normalizePublicHomepagePlacementEvent(entry.event),
  }
}

export const normalizePublicHomepagePlacement = (placement) => {
  if (!isPlainObject(placement)) return null

  return {
    ...placement,
    id: placement.id ?? null,
    name: placement.name ?? null,
    slug: placement.slug ?? null,
    title: placement.title ?? null,
    subtitle: placement.subtitle ?? null,
    placement_type: placement.placement_type ?? null,
    sort_order: placement.sort_order ?? null,
    events: Array.isArray(placement.events)
      ? placement.events.map(normalizePublicHomepagePlacementEntry).filter(Boolean)
      : [],
  }
}

export const normalizePublicHomepagePlacementsResponse = (payload) => {
  const { items, meta, links } = normalizePaginatedCollectionEnvelope(payload)

  return {
    items: items.map(normalizePublicHomepagePlacement).filter(Boolean),
    meta: meta ? { ...meta } : null,
    links: links ? { ...links } : null,
  }
}
