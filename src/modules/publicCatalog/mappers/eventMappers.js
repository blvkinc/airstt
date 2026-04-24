import { formatCatalogDate, formatCatalogTimeRange, pickFirstDefined, toNumberOrNull } from '../utils/catalogFormatters'

const BOOKABLE_OCCURRENCE_STATUSES = new Set(['available'])
const BOOKABLE_PACKAGE_STATUSES = new Set(['available'])

const mapEventCategory = (assignment) => {
  const category = assignment?.category
  if (!category) return null

  const displayName = category.name ?? category.slug ?? null
  if (!displayName && !category.id) return null

  return {
    id: category.id ?? assignment?.event_category_id ?? null,
    name: category.name ?? null,
    slug: category.slug ?? null,
    displayName,
    isPrimary: assignment?.is_primary ?? false,
  }
}

const mapEventBase = (event) => {
  if (!event) return null

  const categories = (event.categories || []).map(mapEventCategory).filter(Boolean)
  const primaryCategory = categories.find((entry) => entry.isPrimary)?.displayName
    || categories[0]?.displayName
    || event.service_period
    || null
  const startsAt = pickFirstDefined(
    event.occurrences?.[0]?.starts_at,
    event.availability_summary?.next_occurrence?.starts_at,
    event.availability_summary?.next_bookable_occurrence?.starts_at,
  )
  const endsAt = pickFirstDefined(
    event.occurrences?.[0]?.ends_at,
    event.availability_summary?.next_occurrence?.ends_at,
    event.availability_summary?.next_bookable_occurrence?.ends_at,
  )
  const nextOccurrenceDate = pickFirstDefined(
    event.occurrences?.[0]?.occurrence_date,
    event.availability_summary?.next_occurrence?.occurrence_date,
    event.availability_summary?.next_bookable_occurrence?.occurrence_date,
  )
  const packagePrices = (event.packages || []).map((pkg) => toNumberOrNull(pkg?.base_price)).filter((value) => value !== null)
  const nextBookableOccurrence = event.availability_summary?.next_bookable_occurrence ?? null
  const nextOccurrence = event.availability_summary?.next_occurrence ?? null
  const availabilityStatus = nextBookableOccurrence?.lifecycle?.effective_status
    ?? nextOccurrence?.lifecycle?.effective_status
    ?? null
  const availabilitySummary = {
    status: availabilityStatus,
    statusLabel: availabilityStatus
      ? availabilityStatus.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
      : null,
    nextBookableStartsAt: nextBookableOccurrence?.starts_at ?? null,
    nextStartsAt: nextOccurrence?.starts_at ?? null,
  }

  return {
    id: event.id,
    title: event.title ?? null,
    image: event.media?.[0]?.asset_url ?? null,
    images: (event.media || []).map((media) => media?.asset_url).filter(Boolean),
    rating: toNumberOrNull(event.display_rating),
    reviews: null,
    price: toNumberOrNull(event.availability_summary?.starting_price) ?? (packagePrices.length ? Math.min(...packagePrices) : null),
    venue: event.venue?.name ?? null,
    venueId: event.venue?.id ?? event.venue_id ?? null,
    location: event.venue?.area?.name
      ?? event.venue?.location?.formatted_address
      ?? event.venue?.location?.address_line_1
      ?? event.location?.formatted_address
      ?? event.location?.address_line_1
      ?? event.venue?.brand?.name
      ?? null,
    category: primaryCategory,
    categories,
    date: formatCatalogDate(startsAt || nextOccurrenceDate, { month: 'short', day: 'numeric', year: 'numeric' }),
    time: formatCatalogTimeRange(startsAt, endsAt),
    tags: (event.tags || []).map((entry) => entry?.tag?.name).filter(Boolean),
    servicePeriod: event.service_period ?? null,
    environmentType: event.environment_type ?? null,
    familyFriendly: event.is_family_friendly ?? null,
    animalFriendly: event.is_animal_friendly ?? null,
    availabilitySummary,
  }
}

const buildPackageStatusLabel = ({ status, reasonLabel, isBookable }) => {
  if (reasonLabel) return reasonLabel
  if (status) return status.replace(/_/g, ' ')
  return isBookable ? 'Available' : 'Unavailable'
}

const formatMetadataLabel = (value) => {
  if (!value) return null
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const normalizeAliasList = (...lists) => lists
  .flat()
  .filter(Boolean)
  .map((value) => String(value).trim())
  .filter(Boolean)

const isExplicitSellableVariant = (pkg) => {
  const eventPackageId = pkg?.event_package_id ?? pkg?.id

  return Boolean(eventPackageId)
}

const buildVariantLabel = ({ selectedVariant, variantKey, audienceLabel, compatibilityAliases }) => {
  if (selectedVariant?.label) return selectedVariant.label
  if (audienceLabel) return audienceLabel
  if (compatibilityAliases.length > 0) return compatibilityAliases[0]
  if (variantKey && variantKey !== 'default') return formatMetadataLabel(variantKey)
  return null
}

const buildOccurrencePackageSelectionKey = ({ eventPackageId, occurrencePackageId, occurrenceDate, familyKey }) => {
  const occurrenceIdentity = occurrencePackageId ?? occurrenceDate ?? 'base'

  return [
    eventPackageId ?? 'unknown-package',
    occurrenceIdentity,
    familyKey ?? 'unknown-family',
  ].join(':')
}

const buildStablePackageKey = ({ eventPackageId, familyKey, variantKey }) => [
  familyKey ?? 'unknown-family',
  variantKey ?? 'default',
  eventPackageId ?? 'unknown-package',
].join(':')

const buildInventoryLabel = ({ isBookable, inventoryRemaining, statusLabel }) => {
  if (!isBookable) return statusLabel || 'Unavailable'
  if (inventoryRemaining === null || inventoryRemaining === undefined) return 'Availability confirmed at checkout'
  if (Number(inventoryRemaining) <= 0) return 'Sold out'
  if (Number(inventoryRemaining) === 1) return '1 left'
  return `${inventoryRemaining} left`
}

const mapOccurrencePackage = (eventPackage, occurrencePackage, family = null, occurrence = null) => {
  const effective = occurrencePackage?.effective ?? null
  const availabilityStatus = effective?.availability_status ?? occurrencePackage?.availability_status ?? null
  const isBookable = effective?.is_bookable ?? BOOKABLE_PACKAGE_STATUSES.has(availabilityStatus)
  const eventPackageId = eventPackage?.event_package_id ?? eventPackage?.id ?? occurrencePackage?.event_package_id ?? occurrencePackage?.id ?? null
  const occurrencePackageId = occurrencePackage?.id ?? null
  const familyKey = family?.family_key ?? occurrencePackage?.family_key ?? eventPackage?.family_key ?? null
  const variantKey = occurrencePackage?.variant_key ?? eventPackage?.variant_key ?? effective?.selected_variant?.code ?? 'default'
  const selectedVariant = effective?.selected_variant ?? null
  const compatibilityAliases = normalizeAliasList(
    occurrencePackage?.compatibility_aliases,
    eventPackage?.compatibility_aliases,
    family?.compatibility_aliases,
  )
  const audienceLabel = occurrencePackage?.audience_label ?? eventPackage?.audience_label ?? null
  const variantLabel = buildVariantLabel({ selectedVariant, variantKey, audienceLabel, compatibilityAliases })
  const packageType = occurrencePackage?.package_type ?? eventPackage?.package_type ?? occurrencePackage?.eligibility?.package_type ?? family?.package_type ?? null
  const packageTypeLabel = occurrencePackage?.eligibility?.package_type_label ?? formatMetadataLabel(packageType)
  const familyName = family?.display_name ?? family?.name ?? eventPackage?.display_name ?? eventPackage?.name ?? occurrencePackage?.display_name ?? occurrencePackage?.name ?? null
  const statusLabel = buildPackageStatusLabel({
    status: availabilityStatus,
    reasonLabel: occurrencePackage?.eligibility?.reason_label ?? occurrencePackage?.state?.decision_reason_label ?? null,
    isBookable,
  })
  const inventoryRemaining = effective?.inventory_remaining ?? null
  const effectivePrice = toNumberOrNull(effective?.price)
  const basePrice = toNumberOrNull(eventPackage?.base_price)

  return {
    id: eventPackageId,
    eventPackageId,
    occurrencePackageId,
    familyKey,
    familyName,
    variantKey,
    variantLabel,
    selectionKey: buildOccurrencePackageSelectionKey({
      eventPackageId,
      occurrencePackageId,
      occurrenceDate: occurrence?.occurrence_date ?? occurrence?.occurrenceDate ?? occurrence?.date ?? null,
      familyKey,
    }),
    stableKey: buildStablePackageKey({ eventPackageId, familyKey, variantKey }),
    name: familyName,
    displayName: familyName,
    description: eventPackage?.description ?? null,
    price: effectivePrice ?? basePrice,
    originalPrice: basePrice,
    maxGuests: eventPackage?.guest_count ?? occurrencePackage?.guest_count ?? null,
    features: [],
    popular: false,
    paymentMode: occurrencePackage?.payment_mode ?? eventPackage?.payment_mode ?? null,
    depositAmount: toNumberOrNull(occurrencePackage?.deposit_value ?? eventPackage?.deposit_value),
    availability: availabilityStatus,
    isBookable,
    statusLabel,
    inventoryRemaining,
    inventoryLabel: buildInventoryLabel({ isBookable, inventoryRemaining, statusLabel }),
    currency: occurrencePackage?.currency ?? eventPackage?.currency ?? null,
    guestCount: occurrencePackage?.guest_count ?? eventPackage?.guest_count ?? null,
    audienceCode: selectedVariant?.code ?? variantKey,
    audienceLabel: variantLabel,
    packageType,
    packageTypeLabel,
    selectedVariant,
    compatibilityAliases,
    genderConfig: occurrencePackage?.gender_config ?? eventPackage?.gender_config ?? null,
  }
}

const buildFamilyCollection = ({ eventPackages = [], packageFamilies = [] }) => {
  if (packageFamilies.length > 0) {
    return packageFamilies
      .map((family) => ({
        ...family,
        variants: (family?.variants || []).filter(isExplicitSellableVariant),
      }))
      .filter((family) => family.variants.length > 0)
  }

  const families = new Map()

  eventPackages.filter(isExplicitSellableVariant).forEach((pkg) => {
    const familyKey = pkg?.family_key ?? [pkg?.event_id ?? '', pkg?.venue_package_id ?? ''].join(':')
    const nextFamily = families.get(familyKey) ?? {
      family_key: familyKey,
      name: pkg?.display_name ?? pkg?.name ?? null,
      display_name: pkg?.display_name ?? pkg?.name ?? null,
      package_type: pkg?.package_type ?? null,
      compatibility_aliases: normalizeAliasList(pkg?.compatibility_aliases, pkg?.audience_label),
      variants: [],
    }

    nextFamily.variants.push(pkg)
    families.set(familyKey, nextFamily)
  })

  return Array.from(families.values())
}

const mapOccurrence = (occurrence, eventPackages, eventPackageFamilies) => {
  const eventPackagesById = new Map((eventPackages || []).map((eventPackage) => [eventPackage?.event_package_id ?? eventPackage?.id, eventPackage]))
  const families = buildFamilyCollection({
    eventPackages,
    packageFamilies: eventPackageFamilies,
  })

  const packages = families.flatMap((family) => {
    const familyVariants = family?.variants || []
    if (familyVariants.length === 0) return []

    return familyVariants.map((familyVariant) => {
      const occurrencePackage = (occurrence?.packages || []).find((pkg) => {
        const occurrenceEventPackageId = pickFirstDefined(pkg?.event_package_id, pkg?.id)
        const familyEventPackageId = pickFirstDefined(familyVariant?.event_package_id, familyVariant?.id)
        return String(occurrenceEventPackageId) === String(familyEventPackageId)
      })

      const eventPackageId = pickFirstDefined(familyVariant?.event_package_id, familyVariant?.id)
      return mapOccurrencePackage(eventPackagesById.get(eventPackageId) ?? familyVariant ?? null, occurrencePackage ?? familyVariant, family, occurrence)
    })
  })

  const status = occurrence?.effective?.availability_status ?? occurrence?.lifecycle?.effective_status ?? occurrence?.status ?? null
  const isBookable = occurrence?.lifecycle?.is_bookable ?? BOOKABLE_OCCURRENCE_STATUSES.has(status)

  return {
    id: occurrence?.event_occurrence_id ?? occurrence?.id ?? occurrence?.occurrence_date ?? null,
    occurrenceDate: occurrence?.occurrence_date ?? null,
    eventOccurrenceId: occurrence?.event_occurrence_id ?? occurrence?.id ?? null,
    date: occurrence?.occurrence_date ?? null,
    time: formatCatalogTimeRange(occurrence?.starts_at, occurrence?.ends_at),
    startsAt: occurrence?.starts_at ?? null,
    endsAt: occurrence?.ends_at ?? null,
    status,
    isBookable,
    statusLabel: status ? status.replace(/_/g, ' ') : (isBookable ? 'available' : 'unavailable'),
    packagesAvailable: packages.filter((pkg) => pkg.isBookable).length,
    packages,
  }
}

export const mapEventCard = (event) => mapEventBase(event)

const buildFallbackOccurrencesFromEvent = (event, eventPackageFamilies) => {
  const eventOccurrences = Array.isArray(event?.occurrences) ? event.occurrences : []

  return eventOccurrences.map((occurrence) => mapOccurrence({
    ...occurrence,
    event_occurrence_id: occurrence?.id ?? null,
    lifecycle: {
      effective_status: occurrence?.status === 'scheduled' && !occurrence?.is_blackout ? 'available' : occurrence?.status ?? 'unavailable',
      is_bookable: occurrence?.status === 'scheduled' && !occurrence?.is_blackout,
    },
    packages: [],
  }, event?.packages || [], eventPackageFamilies))
}

export const mapEventDetail = (event, availabilityPayload) => {
  const base = mapEventBase(event)
  if (!base) return null

  const eventPackageFamilies = buildFamilyCollection({
    eventPackages: event.packages || [],
    packageFamilies: event.package_families || [],
  })
  const shouldUseLegacyFallback = !availabilityPayload?.occurrences?.length && !event?.recurrence_rule
  const occurrencesSource = availabilityPayload?.occurrences?.length
    ? availabilityPayload.occurrences
    : shouldUseLegacyFallback
      ? buildFallbackOccurrencesFromEvent(event, eventPackageFamilies)
      : []
  const occurrences = occurrencesSource.map((occurrence) => mapOccurrence(occurrence, event.packages || [], eventPackageFamilies))
  const primaryOccurrence = occurrences.find((occurrence) => occurrence.isBookable) || occurrences[0] || null

  return {
    ...base,
    description: event.short_description ?? null,
    highlights: [],
    policies: [],
    accessibility: [],
    faqs: (event.faqs || []).map((entry) => entry?.faq).filter(Boolean),
    contact: null,
    venueDetails: {
      id: event.venue?.id ?? event.venue_id ?? null,
      name: event.venue?.name ?? null,
      description: event.venue?.short_description ?? null,
      address: [
        event.venue?.name,
        event.venue?.area?.name,
        event.venue?.location?.formatted_address,
        event.venue?.location?.address_line_1,
      ].filter(Boolean).join(', ') || null,
      phone: null,
      website: null,
      amenities: [],
    },
    occurrences,
    packages: primaryOccurrence?.packages || [],
  }
}

export const mapPackageEvent = (event, availabilityPayload) => {
  const detail = mapEventDetail(event, availabilityPayload)
  if (!detail) return null

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
