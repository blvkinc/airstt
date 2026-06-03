export const mapVenueType = (venueType) => {
  if (!venueType) return null

  return {
    id: venueType.id ?? null,
    name: venueType.name ?? null,
    slug: venueType.slug ?? null,
  }
}

const mediaPurposeRank = {
  cover: 0,
  gallery: 1,
  og: 2,
}

const toSortableNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : Number.POSITIVE_INFINITY
}

const toNumberOrNull = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const toCoordinatesOrNull = (latitude, longitude) => {
  const lat = toNumberOrNull(latitude)
  const lng = toNumberOrNull(longitude)

  if (lat === null || lng === null) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  return { lat, lng }
}

const normalizeMediaType = (value) => String(value || '').toLowerCase() === 'video' ? 'video' : 'image'

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

const sortVenueMedia = (left, right) => {
  const leftPurposeRank = mediaPurposeRank[left?.purpose] ?? 99
  const rightPurposeRank = mediaPurposeRank[right?.purpose] ?? 99
  if (leftPurposeRank !== rightPurposeRank) return leftPurposeRank - rightPurposeRank

  const leftGalleryRank = left?.is_in_gallery === false ? 1 : 0
  const rightGalleryRank = right?.is_in_gallery === false ? 1 : 0
  if (leftGalleryRank !== rightGalleryRank) return leftGalleryRank - rightGalleryRank

  const leftGallerySortOrder = toSortableNumber(left?.gallery_sort_order ?? left?.gallerySortOrder)
  const rightGallerySortOrder = toSortableNumber(right?.gallery_sort_order ?? right?.gallerySortOrder)
  if (leftGallerySortOrder !== rightGallerySortOrder) return leftGallerySortOrder - rightGallerySortOrder

  const leftSortOrder = toSortableNumber(left?.sort_order ?? left?.sortOrder)
  const rightSortOrder = toSortableNumber(right?.sort_order ?? right?.sortOrder)
  if (leftSortOrder !== rightSortOrder) return leftSortOrder - rightSortOrder

  return 0
}

const getOrderedVenueImageUrls = (media = []) => media
  .filter((item) => item?.is_visible !== false)
  .sort(sortVenueMedia)
  .map(getStaticMediaPreviewUrl)
  .filter(Boolean)

const mapVenueMediaItem = (item, index, name) => {
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
    alt: item?.alt ?? item?.alt_text ?? item?.altText ?? item?.caption ?? `${name || 'Venue'} ${type === 'video' ? 'video' : 'photo'} ${index + 1}`,
    sortOrder: item?.gallery_sort_order ?? item?.gallerySortOrder ?? item?.sort_order ?? item?.sortOrder ?? index,
    purpose: item?.purpose ?? null,
    isVisible: item?.is_visible !== false && item?.isVisible !== false,
    isInGallery: item?.is_in_gallery !== false && item?.isInGallery !== false,
  }
}

const getOrderedVenueMediaItems = (venue) => (venue?.media || [])
  .filter((item) => item?.asset_url || item?.assetUrl || item?.url)
  .sort(sortVenueMedia)
  .map((item, index) => mapVenueMediaItem(item, index, venue?.name))
  .filter(Boolean)

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

export const mapVenueFaq = (faq) => {
  const question = String(faq?.question ?? '').trim()
  const answer = String(faq?.answer ?? '').trim()
  if (!question || !answer) return null

  return {
    id: faq?.id ?? null,
    question,
    answer,
    sortOrder: toSortableNumber(faq?.sort_order ?? faq?.sortOrder),
    status: faq?.status ?? null,
  }
}

const sortVenueFaqs = (left, right) => {
  if (left.sortOrder !== right.sortOrder) return left.sortOrder - right.sortOrder
  return String(left.question).localeCompare(String(right.question))
}

export const mapVenueCard = (venue) => {
  if (!venue) return null

  const address = [venue.location?.label, venue.locality, venue.region].filter(Boolean).join(', ')
  const venueTypes = (venue.venue_types || []).map(mapVenueType).filter(Boolean)
  const images = getOrderedVenueImageUrls(venue.media || [])
  const mediaItems = getOrderedVenueMediaItems(venue)
  const area = venue.area?.name ?? null
  const city = venue.area?.city?.name ?? venue.location?.locality ?? venue.locality ?? null
  const primaryVenueType = venueTypes[0]?.name ?? null
  const coordinates = toCoordinatesOrNull(
    venue.latitude ?? venue.location?.latitude,
    venue.longitude ?? venue.location?.longitude,
  )

  return {
    id: venue.id,
    name: venue.name ?? null,
    image: images[0] ?? null,
    images,
    mediaItems,
    mediaDisplay: mapMediaDisplay(venue),
    category: venue.brand?.name ?? area ?? primaryVenueType,
    type: primaryVenueType,
    placementLabel: venue.placement_label ?? venue.placementLabel ?? venue.placement?.title ?? venue.placement?.name ?? null,
    venueTypes,
    area,
    city,
    address: address || null,
    location: address || null,
    coordinates,
    rating: typeof venue.display_rating === 'number' ? venue.display_rating : Number(venue.display_rating) || null,
    reviews: null,
    description: venue.short_description ?? null,
    amenities: [],
    capacity: null,
    upcomingEvents: venue.events?.length ?? 0,
    familyFriendly: null,
    animalFriendly: null,
    environmentType: null,
    meta: {
      title: venue.meta?.title ?? venue.meta_title ?? null,
      description: venue.meta?.description ?? venue.meta_description ?? null,
    },
  }
}

export const mapVenueDetail = (venue) => {
  const card = mapVenueCard(venue)
  if (!card) return null

  return {
    ...card,
    address: [venue.address_line_1, venue.address_line_2, venue.locality, venue.region].filter(Boolean).join(', ') || card.address,
    highlights: card.venueTypes.map((venueType) => venueType.name),
    faqs: (venue.faqs || []).map(mapVenueFaq).filter(Boolean).sort(sortVenueFaqs),
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
      image: getStaticMediaPreviewUrl(event.media?.[0]) ?? null,
    })),
  }
}
