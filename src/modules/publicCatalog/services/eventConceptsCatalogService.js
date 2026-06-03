import { getPublicEventConceptById, getPublicEventConceptOptions } from '../api'

const toSortNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : Number.POSITIVE_INFINITY
}

const sortConceptOptions = (options = []) => [...options].sort((left, right) => {
  const sortDelta = toSortNumber(left?.sort_order) - toSortNumber(right?.sort_order)
  if (sortDelta !== 0) return sortDelta
  if (left?.is_default && !right?.is_default) return -1
  if (!left?.is_default && right?.is_default) return 1
  return String(left?.variant_label ?? left?.title ?? '').localeCompare(String(right?.variant_label ?? right?.title ?? ''))
})

const mapConceptOption = (option) => ({
  eventId: option?.event_variant_id ?? null,
  slug: option?.slug ?? null,
  title: option?.title ?? null,
  label: option?.variant_label ?? option?.title ?? 'Option',
  subtitle: option?.variant_subtitle ?? null,
  description: option?.variant_description ?? null,
  sortOrder: option?.sort_order ?? null,
  isDefault: Boolean(option?.is_default),
  publicationState: option?.publication_state ?? null,
  status: option?.status ?? null,
  servicePeriod: option?.service_period ?? null,
  environmentType: option?.environment_type ?? null,
  schedule: option?.schedule ?? null,
  availabilitySummary: option?.availability_summary ?? null,
  links: option?.links ?? null,
})

export const mapEventConcept = (concept) => {
  if (!concept) return null

  const options = sortConceptOptions(concept.event_variants).map(mapConceptOption).filter((option) => option.eventId)

  return {
    id: concept.id,
    title: concept.title ?? null,
    slug: concept.slug ?? null,
    description: concept.short_description ?? concept.full_description ?? null,
    venueId: concept.venue_id ?? concept.venue?.id ?? null,
    venue: concept.venue ?? null,
    defaultEventId: concept.default_event_variant_id ?? null,
    canonicalEventId: concept.canonical_event_variant_id ?? null,
    options,
    meta: {
      title: concept.meta?.title ?? concept.title ?? null,
      description: concept.meta?.description ?? concept.short_description ?? null,
    },
  }
}

export async function getCatalogEventConcept({ conceptId, signal } = {}) {
  if (!conceptId) return null
  const concept = await getPublicEventConceptById({ conceptId, signal })
  return mapEventConcept(concept)
}

export async function getCatalogEventConceptOptions({ eventId, signal } = {}) {
  if (!eventId) return null
  const concept = await getPublicEventConceptOptions({ eventId, signal })
  return mapEventConcept(concept)
}
