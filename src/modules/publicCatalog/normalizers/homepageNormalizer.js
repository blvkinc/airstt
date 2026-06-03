import { normalizePaginatedCollectionEnvelope } from '../../../shared/api/normalizeResponse'
import { normalizePublicEvent } from './eventNormalizer'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

export const normalizePublicHomepagePlacementEvent = (event) => normalizePublicEvent(event)

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
