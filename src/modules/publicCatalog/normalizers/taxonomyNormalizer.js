import { normalizePaginatedCollectionEnvelope } from '../../../shared/api/normalizeResponse'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

export const normalizePublicEventCategory = (category) => {
  if (!isPlainObject(category)) return null

  return {
    ...category,
    id: category.id ?? null,
    parent_id: category.parent_id ?? null,
    name: category.name ?? null,
    slug: category.slug ?? null,
    sort_order: category.sort_order ?? null,
  }
}

export const normalizePublicEventTag = (tag) => {
  if (!isPlainObject(tag)) return null

  return {
    ...tag,
    id: tag.id ?? null,
    name: tag.name ?? null,
    slug: tag.slug ?? null,
    tag_type: tag.tag_type ?? null,
    sort_order: tag.sort_order ?? null,
  }
}

export const normalizePublicEventCategoriesResponse = (payload) => {
  const { items, meta, links } = normalizePaginatedCollectionEnvelope(payload)

  return {
    items: items.map(normalizePublicEventCategory).filter(Boolean),
    meta: meta ? { ...meta } : null,
    links: links ? { ...links } : null,
  }
}

export const normalizePublicEventTagsResponse = (payload) => {
  const { items, meta, links } = normalizePaginatedCollectionEnvelope(payload)

  return {
    items: items.map(normalizePublicEventTag).filter(Boolean),
    meta: meta ? { ...meta } : null,
    links: links ? { ...links } : null,
  }
}


export const normalizePublicVenueType = (venueType) => {
  if (!isPlainObject(venueType)) return null

  return {
    ...venueType,
    id: venueType.id ?? null,
    name: venueType.name ?? null,
    slug: venueType.slug ?? null,
    sort_order: venueType.sort_order ?? null,
  }
}

export const normalizePublicVenueTypesResponse = (payload) => {
  const { items, meta, links } = normalizePaginatedCollectionEnvelope(payload)

  return {
    items: items.map(normalizePublicVenueType).filter(Boolean),
    meta: meta ? { ...meta } : null,
    links: links ? { ...links } : null,
  }
}
