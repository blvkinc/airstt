import {
  normalizePaginatedCollectionEnvelope,
  normalizeResourceEnvelope,
} from '../../../shared/api/normalizeResponse'
import { normalizePublicEventOccurrenceAvailability } from './eventAvailabilityNormalizer'
import { normalizePublicEventOfferings } from './eventOfferingsNormalizer'

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const normalizePublicEventCategoryAssignment = (assignment) => {
  if (!isPlainObject(assignment)) return null

  return {
    ...assignment,
    event_category_id: assignment.event_category_id ?? null,
    is_primary: assignment.is_primary ?? null,
    category: isPlainObject(assignment.category)
      ? {
          ...assignment.category,
          id: assignment.category.id ?? null,
          name: assignment.category.name ?? null,
          slug: assignment.category.slug ?? null,
          sort_order: assignment.category.sort_order ?? null,
        }
      : null,
  }
}

const normalizePublicEventTagAssignment = (assignment) => {
  if (!isPlainObject(assignment)) return null

  return {
    ...assignment,
    event_tag_id: assignment.event_tag_id ?? null,
    tag: isPlainObject(assignment.tag)
      ? {
          ...assignment.tag,
          id: assignment.tag.id ?? null,
          name: assignment.tag.name ?? null,
          slug: assignment.tag.slug ?? null,
          tag_type: assignment.tag.tag_type ?? null,
        }
      : null,
  }
}

const normalizePublicEventMedia = (media) => {
  if (!isPlainObject(media)) return null

  return {
    ...media,
    id: media.id ?? null,
    service_provider_asset_id: media.service_provider_asset_id ?? null,
    media_type: media.media_type ?? null,
    purpose: media.purpose ?? null,
    asset_url: media.asset_url ?? null,
    is_visible: media.is_visible ?? null,
    sort_order: media.sort_order ?? null,
  }
}

const normalizePublicEventMediaPreview = (media) => {
  if (!isPlainObject(media)) return null

  return {
    ...media,
    id: media.id ?? null,
    media_type: media.media_type ?? null,
    purpose: media.purpose ?? null,
    asset_url: media.asset_url ?? null,
  }
}

const normalizePublicEventFaqAssignment = (assignment) => {
  if (!isPlainObject(assignment)) return null

  return {
    ...assignment,
    venue_faq_id: assignment.venue_faq_id ?? null,
    sort_order: assignment.sort_order ?? null,
    faq: isPlainObject(assignment.faq)
      ? {
          ...assignment.faq,
          id: assignment.faq.id ?? null,
          question: assignment.faq.question ?? null,
          answer: assignment.faq.answer ?? null,
          status: assignment.faq.status ?? null,
          sort_order: assignment.faq.sort_order ?? null,
        }
      : null,
  }
}

const normalizePublicEventPackage = (pkg) => {
  if (!isPlainObject(pkg)) return null

  return {
    ...pkg,
    id: pkg.id ?? null,
    event_package_id: pkg.event_package_id ?? pkg.id ?? null,
    variant_key: pkg.variant_key ?? null,
    family_key: pkg.family_key ?? null,
    venue_package_id: pkg.venue_package_id ?? null,
    display_name: pkg.display_name ?? null,
    name: pkg.name ?? null,
    audience_label: pkg.audience_label ?? null,
    compatibility_aliases: Array.isArray(pkg.compatibility_aliases) ? pkg.compatibility_aliases.filter(Boolean) : [],
    gender_config: isPlainObject(pkg.gender_config) ? { ...pkg.gender_config } : null,
    guest_count: pkg.guest_count ?? null,
    package_type: pkg.package_type ?? null,
    base_price: pkg.base_price ?? null,
    currency: pkg.currency ?? null,
    payment_mode: pkg.payment_mode ?? null,
    deposit_type: pkg.deposit_type ?? null,
    deposit_value: pkg.deposit_value ?? null,
    sort_order: pkg.sort_order ?? null,
  }
}

const normalizePublicEventPackageFamily = (family) => {
  if (!isPlainObject(family)) return null

  return {
    ...family,
    family_key: family.family_key ?? null,
    event_id: family.event_id ?? null,
    venue_package_id: family.venue_package_id ?? null,
    name: family.name ?? null,
    display_name: family.display_name ?? null,
    package_type: family.package_type ?? null,
    compatibility_aliases: Array.isArray(family.compatibility_aliases) ? family.compatibility_aliases.filter(Boolean) : [],
    variants: Array.isArray(family.variants)
      ? family.variants.map(normalizePublicEventPackage).filter(Boolean)
      : [],
  }
}

const normalizePublicEventOccurrenceShell = (occurrence) => {
  if (!isPlainObject(occurrence)) return null

  return {
    ...occurrence,
    id: occurrence.id ?? null,
    starts_at: occurrence.starts_at ?? null,
    ends_at: occurrence.ends_at ?? null,
    occurrence_date: occurrence.occurrence_date ?? null,
    status: occurrence.status ?? null,
    is_blackout: occurrence.is_blackout ?? null,
  }
}

const normalizePublicEventVenue = (venue) => {
  if (!isPlainObject(venue)) return null

  return {
    ...venue,
    id: venue.id ?? null,
    name: venue.name ?? null,
    slug: venue.slug ?? null,
    brand: isPlainObject(venue.brand)
      ? {
          ...venue.brand,
          id: venue.brand.id ?? null,
          name: venue.brand.name ?? null,
        }
      : null,
    area: isPlainObject(venue.area)
      ? {
          ...venue.area,
          id: venue.area.id ?? null,
          name: venue.area.name ?? null,
        }
      : null,
  }
}

const normalizePublicEventMeta = (meta) => {
  if (!isPlainObject(meta)) return null

  return {
    ...meta,
    title: meta.title ?? null,
    description: meta.description ?? null,
  }
}

const normalizePublicEventPrimaryCategory = (category) => {
  if (!isPlainObject(category)) return null

  return {
    ...category,
    id: category.id ?? null,
    name: category.name ?? null,
    slug: category.slug ?? null,
    sort_order: category.sort_order ?? null,
  }
}

const normalizePublicEventAttributes = (attributes) => {
  if (!isPlainObject(attributes)) return null

  return {
    ...attributes,
    service_period: attributes.service_period ?? null,
    environment_type: attributes.environment_type ?? null,
    display_rating: attributes.display_rating ?? null,
    is_family_friendly: attributes.is_family_friendly ?? null,
    is_animal_friendly: attributes.is_animal_friendly ?? null,
  }
}

const normalizePublicEventListSummary = (summary) => {
  if (!isPlainObject(summary)) return null

  return {
    ...summary,
    price_from: summary.price_from ?? null,
    currency: summary.currency ?? null,
    next_occurrence: normalizePublicEventOccurrenceAvailability(summary.next_occurrence),
    next_bookable_occurrence: normalizePublicEventOccurrenceAvailability(summary.next_bookable_occurrence),
    availability_status: summary.availability_status ?? null,
  }
}

const normalizePublicEventEditorial = (editorial) => {
  if (!isPlainObject(editorial)) return null

  return {
    ...editorial,
    sort_order: editorial.sort_order ?? null,
  }
}

const normalizePublicEventRecurrenceRule = (rule) => {
  if (!isPlainObject(rule)) return null

  return {
    ...rule,
    frequency: rule.frequency ?? null,
    interval_value: rule.interval_value ?? null,
    days_of_week: Array.isArray(rule.days_of_week) ? rule.days_of_week : [],
    day_of_month: rule.day_of_month ?? null,
    starts_on: rule.starts_on ?? null,
    ends_on: rule.ends_on ?? null,
    timezone: rule.timezone ?? null,
    selected_dates: Array.isArray(rule.selected_dates) ? rule.selected_dates.filter(Boolean) : [],
  }
}

const normalizePublicEventAvailabilitySummary = (summary) => {
  if (!isPlainObject(summary)) return null

  const normalizedSummary = {
    ...summary,
    next_bookable_occurrence: normalizePublicEventOccurrenceAvailability(summary.next_bookable_occurrence),
    bookable_occurrence_count: summary.bookable_occurrence_count ?? null,
    starting_price: summary.starting_price ?? null,
    currency: summary.currency ?? null,
  }

  if ('next_occurrence' in summary) {
    normalizedSummary.next_occurrence = normalizePublicEventOccurrenceAvailability(summary.next_occurrence)
  }

  return normalizedSummary
}

export const normalizePublicEvent = (event) => {
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
    publication_state: event.publication_state ?? null,
    editorial_sort_order: event.editorial_sort_order ?? event.editorial?.sort_order ?? null,
    media_preview: normalizePublicEventMediaPreview(event.media_preview),
    primary_category: normalizePublicEventPrimaryCategory(event.primary_category),
    attributes: normalizePublicEventAttributes(event.attributes),
    list_summary: normalizePublicEventListSummary(event.list_summary),
    editorial: normalizePublicEventEditorial(event.editorial),
    categories: Array.isArray(event.categories)
      ? event.categories.map(normalizePublicEventCategoryAssignment).filter(Boolean)
      : [],
    tags: Array.isArray(event.tags)
      ? event.tags.map(normalizePublicEventTagAssignment).filter(Boolean)
      : [],
    offerings: normalizePublicEventOfferings(event.offerings),
    media: Array.isArray(event.media) ? event.media.map(normalizePublicEventMedia).filter(Boolean) : [],
    faqs: Array.isArray(event.faqs) ? event.faqs.map(normalizePublicEventFaqAssignment).filter(Boolean) : [],
    packages: Array.isArray(event.packages) ? event.packages.map(normalizePublicEventPackage).filter(Boolean) : [],
    package_families: Array.isArray(event.package_families)
      ? event.package_families.map(normalizePublicEventPackageFamily).filter(Boolean)
      : [],
    occurrences: Array.isArray(event.occurrences)
      ? event.occurrences.map(normalizePublicEventOccurrenceShell).filter(Boolean)
      : [],
    venue: normalizePublicEventVenue(event.venue),
    availability_summary: normalizePublicEventAvailabilitySummary(event.availability_summary),
    recurrence_rule: normalizePublicEventRecurrenceRule(event.recurrence_rule),
    meta: normalizePublicEventMeta(event.meta),
  }
}

export const normalizePublicEventResponse = (payload) => normalizePublicEvent(normalizeResourceEnvelope(payload))

export const normalizePublicEventListResponse = (payload) => {
  const { items, meta, links } = normalizePaginatedCollectionEnvelope(payload)

  return {
    items: items.map(normalizePublicEvent).filter(Boolean),
    meta: meta ? { ...meta } : null,
    links: links ? { ...links } : null,
  }
}
