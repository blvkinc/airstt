import { normalizeResourceEnvelope } from '../../../shared/api/normalizeResponse'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizeConceptOption = (option) => {
  if (!isPlainObject(option)) return null

  return {
    ...option,
    event_variant_id: option.event_variant_id ?? option.id ?? null,
    slug: option.slug ?? null,
    title: option.title ?? null,
    variant_key: option.variant_key ?? null,
    variant_label: option.variant_label ?? option.title ?? null,
    variant_subtitle: option.variant_subtitle ?? null,
    variant_description: option.variant_description ?? null,
    sort_order: option.sort_order ?? null,
    is_default: Boolean(option.is_default),
    publication_state: option.publication_state ?? null,
    status: option.status ?? null,
    service_period: option.service_period ?? null,
    environment_type: option.environment_type ?? null,
    schedule: isPlainObject(option.schedule) ? { ...option.schedule } : null,
    availability_summary: isPlainObject(option.availability_summary) ? { ...option.availability_summary } : null,
    links: isPlainObject(option.links) ? { ...option.links } : null,
  }
}

export const normalizePublicEventConcept = (concept) => {
  if (!isPlainObject(concept)) return null

  return {
    ...concept,
    id: concept.id ?? null,
    venue_id: concept.venue_id ?? null,
    title: concept.title ?? null,
    slug: concept.slug ?? null,
    short_description: concept.short_description ?? null,
    full_description: concept.full_description ?? null,
    service_period: concept.service_period ?? null,
    environment_type: concept.environment_type ?? null,
    timezone: concept.timezone ?? null,
    publication_state: concept.publication_state ?? null,
    status: concept.status ?? null,
    default_event_variant_id: concept.default_event_variant_id ?? null,
    canonical_event_variant_id: concept.canonical_event_variant_id ?? null,
    venue: isPlainObject(concept.venue) ? { ...concept.venue } : null,
    event_variants: Array.isArray(concept.event_variants) ? concept.event_variants.map(normalizeConceptOption).filter(Boolean) : [],
    meta: isPlainObject(concept.meta)
      ? {
          ...concept.meta,
          title: concept.meta.title ?? null,
          description: concept.meta.description ?? null,
        }
      : null,
  }
}

export const normalizePublicEventConceptResponse = (payload) => normalizePublicEventConcept(normalizeResourceEnvelope(payload))
