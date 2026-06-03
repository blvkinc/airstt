import { formatCatalogDate, formatCatalogTimeRange, formatCatalogTimeRangeWithDayHint, pickFirstDefined, toCoordinatesOrNull, toNumberOrNull } from '../utils/catalogFormatters'

const BOOKABLE_OCCURRENCE_STATUSES = new Set(['available'])
const BOOKABLE_PACKAGE_STATUSES = new Set(['available'])
const MAX_VISIBLE_VARIANT_PILLS_FALLBACK = 3

const hasValidTimestamp = (value) => Boolean(value) && !Number.isNaN(new Date(value).getTime())

const getAfterpartyTiming = (occurrence) => {
  if (!occurrence
    || !occurrence.has_afterparty
    || !hasValidTimestamp(occurrence.afterparty_starts_at)
    || !hasValidTimestamp(occurrence.afterparty_ends_at)) return null

  const time = formatCatalogTimeRangeWithDayHint(occurrence.afterparty_starts_at, occurrence.afterparty_ends_at)
  if (!time) return null

  return {
    time,
    startsAt: occurrence.afterparty_starts_at,
    endsAt: occurrence.afterparty_ends_at,
  }
}

const hasEventTimingValue = (occurrence) => pickFirstDefined(
  occurrence?.starts_at,
  occurrence?.ends_at,
  occurrence?.occurrence_date,
) !== null

const getEventTimingSource = (...occurrences) => occurrences.find(hasEventTimingValue) ?? null

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

const mapVenueType = (venueType) => {
  if (!venueType) return null

  const name = venueType.name ?? venueType.slug ?? null
  if (!name && !venueType.id) return null

  return {
    id: venueType.id ?? null,
    name,
    slug: venueType.slug ?? null,
  }
}

const normalizeMediaType = (value) => String(value || '').toLowerCase() === 'video' ? 'video' : 'image'

const getMediaSortOrder = (item) => toNumberOrNull(item?.gallery_sort_order ?? item?.gallerySortOrder ?? item?.sort_order ?? item?.sortOrder) ?? Number.POSITIVE_INFINITY

const getStaticMediaPreviewUrl = (item) => {
  if (!item) return null

  const type = normalizeMediaType(item.media_type ?? item.mediaType ?? item.type)
  if (type === 'image') return item.asset_url ?? item.assetUrl ?? item.url ?? null

  return item.poster_url
    ?? item.posterUrl
    ?? item.thumbnail_url
    ?? item.thumbnailUrl
    ?? item.preview_url
    ?? item.previewUrl
    ?? item.preview?.asset_url
    ?? item.media_preview?.asset_url
    ?? item.mediaPreview?.assetUrl
    ?? null
}

const sortMediaByOrder = (left, right) => getMediaSortOrder(left) - getMediaSortOrder(right)

const getOrderedEventImageUrls = (event) => {
  const mediaUrls = (event?.media || [])
    .filter((item) => item?.is_visible !== false)
    .sort(sortMediaByOrder)
    .map(getStaticMediaPreviewUrl)

  return [getStaticMediaPreviewUrl(event?.media_preview), ...mediaUrls].filter(Boolean)
}

const mapEventMediaItem = (item, index, title) => {
  const type = normalizeMediaType(item?.media_type ?? item?.mediaType ?? item?.type)
  const url = item?.asset_url ?? item?.assetUrl ?? item?.url ?? null
  if (!url) return null

  const previewUrl = getStaticMediaPreviewUrl(item)

  return {
    id: item?.id ?? item?.media_id ?? item?.mediaId ?? url,
    type,
    url,
    previewUrl: type === 'image' ? url : previewUrl,
    posterUrl: item?.poster_url ?? item?.posterUrl ?? item?.thumbnail_url ?? item?.thumbnailUrl ?? previewUrl ?? null,
    alt: item?.alt ?? item?.alt_text ?? item?.altText ?? item?.caption ?? `${title || 'Event'} ${type === 'video' ? 'video' : 'photo'} ${index + 1}`,
    sortOrder: getMediaSortOrder(item),
    purpose: item?.purpose ?? null,
    isVisible: item?.is_visible !== false && item?.isVisible !== false,
    isInGallery: item?.is_in_gallery !== false && item?.isInGallery !== false,
  }
}

const mapMediaDisplay = (source) => {
  const display = source?.media_display ?? source?.mediaDisplay ?? source?.selected_hero ?? null
  const selectedHeroMedia = source?.selected_hero_media ?? source?.selectedHeroMedia ?? null
  const selectedHeroMediaId = source?.selected_hero_media_id ?? source?.selectedHeroMediaId ?? selectedHeroMedia?.id ?? null
  const selectedHeroMediaUrl = source?.selected_hero_media_url ?? source?.selectedHeroMediaUrl ?? selectedHeroMedia?.asset_url ?? selectedHeroMedia?.url ?? null
  const mode = display?.mode
    ?? display?.display_mode
    ?? display?.displayMode
    ?? source?.detail_media_display_mode
    ?? source?.detailMediaDisplayMode
    ?? (display === 'selected_hero' ? 'selected_hero' : null)

  return {
    ...(display && typeof display === 'object' ? display : {}),
    mode: mode === 'selected_hero' ? 'selected_hero' : 'gallery',
    selectedHeroMediaId,
    selectedHeroMediaUrl,
  }
}

const getOrderedEventMediaItems = (event) => (event?.media || [])
  .filter((item) => item?.asset_url || item?.assetUrl || item?.url)
  .sort(sortMediaByOrder)
  .map((item, index) => mapEventMediaItem(item, index, event?.title))
  .filter(Boolean)


const compactUniqueValues = (values) => {
  const seen = new Set()

  return values
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}

const joinLocationParts = (...parts) => compactUniqueValues(parts).join(', ') || null

const toTitleCaseVariantLabel = (value) => String(value || '')
  .replace(/[-_]/g, ' ')
  .replace(/\b\w/g, (char) => char.toUpperCase())
  .trim()

const getVariantOptionLabel = (option) => {
  const keyLabel = toTitleCaseVariantLabel(option?.key)
  const label = String(option?.label || option?.title || '').trim()

  return keyLabel || label || null
}

const getFirstVariantOptionSource = (...sources) => sources.find((source) => Array.isArray(source) && source.length > 0) ?? []

const mapVariantOptions = (options) => (Array.isArray(options) ? options : [])
  .map((option) => {
    const eventId = option?.event_variant_id ?? option?.eventVariantId ?? option?.id ?? null
    const label = getVariantOptionLabel(option)

    if (!eventId || !label) return null

    return {
      eventId,
      id: option?.id ?? eventId,
      key: option?.key ?? null,
      label,
      href: option?.href ?? `/events/${eventId}`,
      isActive: Boolean(option?.is_active ?? option?.isActive ?? false),
      isDisabled: Boolean(option?.is_disabled ?? option?.isDisabled ?? false),
    }
  })
  .filter(Boolean)

const hasValidPublicId = (value) => String(value ?? '').trim().length > 0

const mapVenueLocationDetails = (venue, fallbackVenueId = null) => {
  const location = venue?.location ?? null
  const venueTypes = (venue?.venue_types || []).map(mapVenueType).filter(Boolean)
  const areaName = venue?.area?.name ?? null
  const cityName = venue?.area?.city?.name ?? location?.locality ?? null
  const formattedAddress = location?.formatted_address ?? null
  const addressLine = location?.address_line_1 ?? null
  const address = formattedAddress ?? addressLine ?? null
  const areaCityLabel = joinLocationParts(areaName, cityName)
  const summary = areaCityLabel ?? address ?? venue?.brand?.name ?? null

  return {
    id: hasValidPublicId(venue?.id) ? venue.id : (hasValidPublicId(fallbackVenueId) ? fallbackVenueId : null),
    name: venue?.name ?? null,
    description: venue?.short_description ?? null,
    address,
    formattedAddress,
    addressLine,
    area: areaName,
    city: cityName,
    areaCityLabel,
    locationLabel: summary,
    phone: null,
    website: null,
    amenities: [],
    venueTypes,
    mapLinks: location?.map_links ?? null,
  }
}

const mapEventBase = (event, { usePublicCardIdentity = false } = {}) => {
  if (!event) return null

  const categories = (event.categories || []).map(mapEventCategory).filter(Boolean)
  const primaryCategory = event.primary_category?.name
    ?? event.primary_category?.slug
    ?? categories.find((entry) => entry.isPrimary)?.displayName
    ?? categories[0]?.displayName
    ?? event.attributes?.service_period
    ?? event.service_period
    ?? null
  const listSummary = event.list_summary ?? null
  const timingSource = getEventTimingSource(
    listSummary?.next_occurrence,
    listSummary?.next_bookable_occurrence,
    event.occurrences?.[0],
    event.availability_summary?.next_occurrence,
    event.availability_summary?.next_bookable_occurrence,
  )
  const startsAt = timingSource?.starts_at ?? null
  const endsAt = timingSource?.ends_at ?? null
  const nextOccurrenceDate = timingSource?.occurrence_date ?? null
  const afterpartyTiming = getAfterpartyTiming(timingSource)
  const packagePrices = (event.packages || []).map((pkg) => toNumberOrNull(pkg?.base_price)).filter((value) => value !== null)
  const nextBookableOccurrence = listSummary?.next_bookable_occurrence ?? event.availability_summary?.next_bookable_occurrence ?? null
  const nextOccurrence = listSummary?.next_occurrence ?? event.availability_summary?.next_occurrence ?? null
  const availabilityStatus = listSummary?.availability_status
    ?? nextBookableOccurrence?.lifecycle?.effective_status
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
  const coordinates = toCoordinatesOrNull(
    event.venue?.latitude ?? event.venue?.location?.latitude,
    event.venue?.longitude ?? event.venue?.location?.longitude,
  )
  const venueDetails = mapVenueLocationDetails(event.venue, event.venue_id)
  const imageUrls = getOrderedEventImageUrls(event)
  const mediaItems = getOrderedEventMediaItems(event)

  const card = event.card ?? {}
  const publicEventId = event.public_event_id ?? card.public_event_id ?? null
  const cardType = event.event_card_type ?? card.event_card_type ?? 'single_variant_event'
  const conceptId = event.concept_id ?? card.concept_id ?? event.event_concept_id ?? event.event_concept?.id ?? null
  const representativeEventVariantId = event.representative_event_variant_id ?? card.representative_event_variant_id ?? null
  const defaultEventVariantId = event.default_event_variant_id ?? card.default_event_variant_id ?? null
  const canonicalEventVariantId = event.canonical_event_variant_id ?? card.canonical_event_variant_id ?? null
  const activeVariantEventId = event.active_event_variant_id
    ?? card.active_event_variant_id
    ?? representativeEventVariantId
    ?? defaultEventVariantId
    ?? canonicalEventVariantId
    ?? null
  const eventId = representativeEventVariantId
    ?? activeVariantEventId
    ?? defaultEventVariantId
    ?? canonicalEventVariantId
    ?? event.id
  const href = event.href ?? card.href ?? `/events/${eventId}`
  const variantOptions = mapVariantOptions(getFirstVariantOptionSource(
    event.event_variants,
    card.event_variants,
  ))
  const optionCount = toNumberOrNull(event.event_variant_count ?? card.event_variant_count) ?? Math.max(variantOptions.length, 1)

  return {
    id: usePublicCardIdentity ? (publicEventId ?? event.id) : event.id,
    publicEventId,
    eventId,
    cardType,
    conceptId,
    representativeEventVariantId,
    defaultEventVariantId,
    canonicalEventVariantId,
    href,
    hasOptions: Boolean(event.has_variants ?? card.has_variants ?? variantOptions.length > 1),
    optionCount,
    variantOptions,
    activeVariantEventId,
    favoriteEventId: activeVariantEventId ?? eventId,
    variantOverflowCount: Math.max(0, optionCount - MAX_VISIBLE_VARIANT_PILLS_FALLBACK),
    title: event.title ?? null,
    image: imageUrls[0] ?? null,
    images: imageUrls,
    mediaItems,
    mediaDisplay: mapMediaDisplay(event),
    rating: toNumberOrNull(event.attributes?.display_rating ?? event.display_rating),
    reviews: null,
    price: toNumberOrNull(listSummary?.price_from ?? event.availability_summary?.starting_price) ?? (packagePrices.length ? Math.min(...packagePrices) : null),
    venue: event.venue?.name ?? null,
    venueId: venueDetails.id,
    venueDetails,
    location: venueDetails.locationLabel
      ?? event.location?.formatted_address
      ?? event.location?.address_line_1
      ?? null,
    coordinates,
    category: primaryCategory,
    categories,
    date: formatCatalogDate(startsAt || nextOccurrenceDate, { month: 'short', day: 'numeric', year: 'numeric' }),
    time: formatCatalogTimeRange(startsAt, endsAt),
    afterpartyTime: afterpartyTiming?.time ?? '',
    afterpartyStartsAt: afterpartyTiming?.startsAt ?? null,
    afterpartyEndsAt: afterpartyTiming?.endsAt ?? null,
    tags: (event.tags || []).map((entry) => entry?.tag?.name).filter(Boolean),
    servicePeriod: event.attributes?.service_period ?? event.service_period ?? null,
    environmentType: event.attributes?.environment_type ?? event.environment_type ?? null,
    familyFriendly: event.attributes?.is_family_friendly ?? event.is_family_friendly ?? null,
    animalFriendly: event.attributes?.is_animal_friendly ?? event.is_animal_friendly ?? null,
    availabilitySummary,
    eventConceptId: event.event_concept_id ?? event.event_concept?.id ?? conceptId,
    eventConcept: event.event_concept ? {
      id: event.event_concept.id ?? event.event_concept_id ?? null,
      title: event.event_concept.title ?? null,
      slug: event.event_concept.slug ?? null,
      defaultEventId: event.event_concept.default_event_id ?? null,
      canonicalEventId: event.event_concept.canonical_event_id ?? null,
      links: event.event_concept.links ?? null,
    } : null,
    conceptVariant: event.event_concept_id || event.event_concept ? {
      key: event.concept_variant_key ?? null,
      label: event.concept_variant_label ?? event.title ?? null,
      subtitle: event.concept_variant_subtitle ?? null,
      description: event.concept_variant_description ?? null,
      sortOrder: event.concept_sort_order ?? null,
      isDefault: Boolean(event.is_default_concept_variant),
    } : null,
    meta: {
      title: event.meta?.title ?? event.meta_title ?? null,
      description: event.meta?.description ?? event.meta_description ?? null,
    },
  }
}

const buildCustomerFacingCardStatusLabel = ({ status, reasonLabel }) => {
  const normalizedStatus = String(status || '').trim().toLowerCase()
  const normalizedReason = String(reasonLabel || '').trim().toLowerCase()
  const source = [normalizedReason, normalizedStatus].filter(Boolean).join(' ')

  if (source.includes('sold out') || normalizedStatus === 'sold_out') return 'Sold out'
  if (source.includes('date') || source.includes('day')) return 'Not available for this date'
  return 'Unavailable'
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

const DEFAULT_AUDIENCE_LABEL = 'All'
const NON_SPECIFIC_AUDIENCE_KEYS = new Set(['', 'all', 'any', 'default', 'general', 'mixed', 'standard'])

const normalizeAudienceLabel = (value) => {
  const normalizedValue = String(value || '').trim()
  if (!normalizedValue) return null

  return NON_SPECIFIC_AUDIENCE_KEYS.has(normalizedValue.toLowerCase())
    ? DEFAULT_AUDIENCE_LABEL
    : formatMetadataLabel(normalizedValue)
}

const normalizeAudienceSelectorCode = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase().replace(/\s+/g, '_')
  if (!normalizedValue || NON_SPECIFIC_AUDIENCE_KEYS.has(normalizedValue)) return null
  return normalizedValue
}

const resolveAudienceSelectorCode = ({ occurrencePackage, eventPackage, selectedVariant, variantKey }) => (
  normalizeAudienceSelectorCode(occurrencePackage?.audience_code)
  ?? normalizeAudienceSelectorCode(eventPackage?.audience_code)
  ?? normalizeAudienceSelectorCode(occurrencePackage?.audience_label)
  ?? normalizeAudienceSelectorCode(eventPackage?.audience_label)
  ?? normalizeAudienceSelectorCode(selectedVariant?.code)
  ?? normalizeAudienceSelectorCode(variantKey)
)

const buildVariantLabel = ({ selectedVariant, variantKey, audienceLabel, compatibilityAliases }) => {
  const normalizedCompatibilityAliases = compatibilityAliases
    .map((alias) => normalizeAudienceLabel(alias))
    .filter(Boolean)

  return normalizeAudienceLabel(selectedVariant?.label)
    ?? normalizeAudienceLabel(audienceLabel)
    ?? normalizedCompatibilityAliases[0]
    ?? normalizeAudienceLabel(variantKey)
    ?? DEFAULT_AUDIENCE_LABEL
}

const buildOccurrencePackageSelectionKey = ({ eventPackageId, occurrencePackageId, occurrenceDate, familyKey }) => {
  const occurrenceIdentity = occurrencePackageId ?? occurrenceDate ?? 'base'

  return [
    eventPackageId ?? 'unknown-package',
    occurrenceIdentity,
    familyKey ?? 'unknown-family',
  ].join(':')
}

const buildStablePackageKey = ({ eventId, venuePackageId, eventPackageId, familyKey, variantKey }) => {
  const [familyEventId = null, familyVenuePackageId = null] = String(familyKey || '').split(':')

  return [
    pickFirstDefined(eventId, familyEventId) || 'unknown-event',
    pickFirstDefined(venuePackageId, familyVenuePackageId) || 'unknown-venue-package',
    variantKey || 'default',
    eventPackageId || 'unknown-package',
  ].join(':')
}

const buildAvailabilityLabel = ({ isBookable, inventoryRemaining }) => {
  if (!isBookable) return null
  if (inventoryRemaining === null || inventoryRemaining === undefined) return 'At checkout'
  if (Number(inventoryRemaining) <= 0) return null
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
  const eventId = eventPackage?.event_id ?? occurrencePackage?.event_id ?? family?.event_id ?? occurrence?.event_id ?? null
  const venuePackageId = eventPackage?.venue_package_id ?? occurrencePackage?.venue_package_id ?? family?.venue_package_id ?? null
  const variantKey = occurrencePackage?.variant_key ?? eventPackage?.variant_key ?? effective?.selected_variant?.code ?? 'default'
  const selectedVariant = effective?.selected_variant ?? null
  const compatibilityAliases = normalizeAliasList(
    occurrencePackage?.compatibility_aliases,
    eventPackage?.compatibility_aliases,
    family?.compatibility_aliases,
  )
  const audienceLabel = occurrencePackage?.audience_label ?? eventPackage?.audience_label ?? null
  const variantLabel = buildVariantLabel({ selectedVariant, variantKey, audienceLabel, compatibilityAliases })
  const audienceCode = resolveAudienceSelectorCode({ occurrencePackage, eventPackage, selectedVariant, variantKey })
  const audienceMode = occurrencePackage?.audience_mode ?? eventPackage?.audience_mode ?? null
  const packageType = occurrencePackage?.package_type ?? eventPackage?.package_type ?? occurrencePackage?.eligibility?.package_type ?? family?.package_type ?? null
  const packageTypeLabel = occurrencePackage?.eligibility?.package_type_label ?? formatMetadataLabel(packageType)
  const familyName = family?.display_name ?? family?.name ?? eventPackage?.display_name ?? eventPackage?.name ?? occurrencePackage?.display_name ?? occurrencePackage?.name ?? null
  const unavailableReasonLabel = occurrencePackage?.eligibility?.reason_label ?? occurrencePackage?.state?.decision_reason_label ?? null
  const cardStatusLabel = !isBookable
    ? buildCustomerFacingCardStatusLabel({
      status: availabilityStatus,
      reasonLabel: unavailableReasonLabel,
    })
    : null
  const inventoryRemaining = effective?.inventory_remaining ?? null
  const availabilityLabel = buildAvailabilityLabel({ isBookable, inventoryRemaining })
  const pricingSummary = occurrencePackage?.pricing_summary ?? effective?.pricing_summary ?? null
  const effectivePrice = toNumberOrNull(pricingSummary?.unit_price ?? effective?.price)
  const basePrice = toNumberOrNull(eventPackage?.base_price)

  return {
    id: eventPackageId,
    eventPackageId,
    occurrencePackageId,
    eventId,
    venuePackageId,
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
    stableKey: buildStablePackageKey({ eventId, venuePackageId, eventPackageId, familyKey, variantKey }),
    name: familyName,
    displayName: familyName,
    description: eventPackage?.description ?? null,
    price: effectivePrice ?? basePrice,
    originalPrice: toNumberOrNull(pricingSummary?.base_unit_price) ?? basePrice,
    maxGuests: eventPackage?.guest_count ?? occurrencePackage?.guest_count ?? null,
    features: [],
    popular: false,
    paymentMode: pricingSummary?.payment_mode ?? occurrencePackage?.payment_mode ?? eventPackage?.payment_mode ?? null,
    depositAmount: toNumberOrNull(pricingSummary?.deposit?.due_now ?? occurrencePackage?.deposit_value ?? eventPackage?.deposit_value),
    pricingSummary: pricingSummary
      ? {
          ...pricingSummary,
          unit_price: toNumberOrNull(pricingSummary.unit_price),
          base_unit_price: toNumberOrNull(pricingSummary.base_unit_price),
          discount_amount: toNumberOrNull(pricingSummary.discount_amount),
          line_total: toNumberOrNull(pricingSummary.line_total),
          due_now: toNumberOrNull(pricingSummary.due_now),
          due_later: toNumberOrNull(pricingSummary.due_later),
          remaining_balance_amount: toNumberOrNull(pricingSummary.remaining_balance_amount),
          deposit: pricingSummary.deposit
            ? {
                ...pricingSummary.deposit,
                value: toNumberOrNull(pricingSummary.deposit.value),
                due_now: toNumberOrNull(pricingSummary.deposit.due_now),
              }
            : null,
        }
      : null,
    availability: availabilityStatus,
    isBookable,
    statusLabel: cardStatusLabel,
    cardStatusLabel,
    inventoryRemaining,
    availabilityLabel,
    inventoryLabel: availabilityLabel,
    excludedFromOccurrenceCapacity: Boolean(effective?.excluded_from_occurrence_capacity ?? occurrencePackage?.excluded_from_occurrence_capacity),
    capacityExemptionMode: effective?.capacity_exemption_mode ?? null,
    currency: occurrencePackage?.currency ?? eventPackage?.currency ?? null,
    guestCount: occurrencePackage?.guest_count ?? eventPackage?.guest_count ?? null,
    audienceCode,
    audienceMode,
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

export const mapOccurrence = (occurrence, eventPackages, eventPackageFamilies) => {
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

  const capacity = occurrence?.capacity ?? occurrence?.lifecycle?.capacity ?? null
  const isCapacityExhausted = Boolean(capacity?.is_exhausted)
  const status = isCapacityExhausted
    ? 'sold_out'
    : occurrence?.effective?.availability_status ?? occurrence?.lifecycle?.effective_status ?? occurrence?.status ?? null
  const isBookable = isCapacityExhausted
    ? false
    : occurrence?.lifecycle?.is_bookable ?? BOOKABLE_OCCURRENCE_STATUSES.has(status)
  const afterpartyTiming = getAfterpartyTiming(occurrence)

  return {
    id: occurrence?.slot_key ?? occurrence?.occurrence_date ?? occurrence?.persisted_occurrence_id ?? occurrence?.id ?? null,
    slotKey: occurrence?.slot_key ?? occurrence?.occurrence_date ?? null,
    occurrenceDate: occurrence?.occurrence_date ?? null,
    eventOccurrenceId: occurrence?.persisted_occurrence_id ?? occurrence?.event_occurrence_id ?? occurrence?.id ?? null,
    persistedOccurrenceId: occurrence?.persisted_occurrence_id ?? occurrence?.event_occurrence_id ?? occurrence?.id ?? null,
    date: occurrence?.occurrence_date ?? null,
    time: formatCatalogTimeRange(occurrence?.starts_at, occurrence?.ends_at),
    startsAt: occurrence?.starts_at ?? null,
    endsAt: occurrence?.ends_at ?? null,
    afterpartyTime: afterpartyTiming?.time ?? '',
    afterpartyStartsAt: afterpartyTiming?.startsAt ?? null,
    afterpartyEndsAt: afterpartyTiming?.endsAt ?? null,
    status,
    isBookable,
    statusLabel: isCapacityExhausted && capacity?.decision_reason_label ? capacity.decision_reason_label : (status ? status.replace(/_/g, ' ') : (isBookable ? 'available' : 'unavailable')),
    capacity,
    capacityLimit: capacity?.effective_capacity_limit ?? capacity?.capacity_limit ?? null,
    capacityLimitMode: capacity?.capacity_limit_mode ?? null,
    capacitySource: capacity?.capacity_source ?? null,
    capacityRemaining: capacity?.remaining_quantity ?? null,
    packagesAvailable: isBookable ? packages.filter((pkg) => pkg.isBookable).length : 0,
    packages,
  }
}

export const mapEventCard = (event) => mapEventBase(event, { usePublicCardIdentity: true })

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

const getSortOrder = (value) => {
  const numericValue = toNumberOrNull(value)
  return numericValue === null ? Number.POSITIVE_INFINITY : numericValue
}

const sortByRenderOrder = (left, right) => {
  const leftOrder = getSortOrder(left?.render_order ?? left?.sort_order)
  const rightOrder = getSortOrder(right?.render_order ?? right?.sort_order)

  if (leftOrder !== rightOrder) return leftOrder - rightOrder

  return String(left?.label ?? left?.name ?? left?.key ?? '').localeCompare(String(right?.label ?? right?.name ?? right?.key ?? ''))
}

const mapEventOffering = (offeringGroup) => {
  const group = offeringGroup?.group ?? null
  const values = Array.isArray(offeringGroup?.values)
    ? offeringGroup.values
      .filter((selection) => {
        const status = String(selection?.status ?? '').toLowerCase()
        const isAssigned = selection?.is_assigned
        const isActive = selection?.is_active
        const isSelectable = selection?.is_selectable

        if (isAssigned === false || isActive === false || isSelectable === false) return false
        if (status && status !== 'active' && status !== 'published') return false
        return Boolean(selection?.value)
      })
      .sort((left, right) => sortByRenderOrder(left?.value, right?.value))
      .map((selection) => ({
        id: selection?.value?.id ?? null,
        key: selection?.value?.key ?? null,
        label: selection?.value?.label ?? selection?.value?.name ?? selection?.value?.slug ?? null,
      }))
      .filter((value) => value.label)
    : []

  if (!group || values.length === 0) return null

  return {
    id: group.id ?? null,
    key: group.key ?? null,
    label: group.label ?? group.name ?? group.slug ?? 'Offering',
    badgeLabel: group.icon_badge?.badge_label ?? group.badge_label ?? null,
    iconUrl: group.platform_asset?.asset_url ?? null,
    iconAlt: group.label ?? group.name ?? group.slug ?? 'Offering icon',
    items: values,
  }
}

const mapEventFaq = (assignment) => {
  const faq = assignment?.faq ?? null
  if (!faq?.question || !faq?.answer) return null

  return {
    id: faq.id ?? assignment?.venue_faq_id ?? null,
    question: faq.question,
    answer: faq.answer,
    sortOrder: getSortOrder(assignment?.sort_order ?? faq?.sort_order),
  }
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
    offerings: (event.offerings || []).map(mapEventOffering).filter(Boolean).sort(sortByRenderOrder),
    faqs: (event.faqs || []).map(mapEventFaq).filter(Boolean).sort((left, right) => left.sortOrder - right.sortOrder),
    contact: null,
    dressCode: null,
    venueDetails: base.venueDetails,
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
