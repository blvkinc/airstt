import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, CheckCircle, ChevronRight, Clock, Heart, Image as ImageIcon, MapPin, Package as PackageIcon, Share2, Sparkles, Star, Tag, X } from 'lucide-react'
import { useCart } from '../shared/context/CartContext'
import { useBooking } from '../shared/context/BookingContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/ui/tabs'
import { EventAvailability, EventGallery, EventHeader, EventOverview, EventPackages, EventSidebar, EventVenue } from '../features/events/EventDetailsSections'
import { useEventDetailCatalog } from '../features/catalog'
import { getCatalogOccurrenceDetail } from '../modules/publicCatalog/services'
import { getEventHref } from '../shared/lib/eventRoutes'

const DEFAULT_BOOKING_INTENT = {
  occurrenceKey: '',
  packageStableKey: '',
  activeTab: 'overview',
}

const DETAIL_TABS = ['overview', 'availability', 'venue', 'packages']
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

const getValidDetailTab = (value) => (DETAIL_TABS.includes(String(value || '').toLowerCase()) ? String(value).toLowerCase() : 'overview')
const getQuantityValue = (value) => {
  const quantity = Number.parseInt(String(value || ''), 10)
  return Number.isNaN(quantity) || quantity < 1 ? 1 : quantity
}
const getOccurrenceSelectionValue = (occurrence) => String(occurrence?.slotKey ?? occurrence?.occurrenceDate ?? occurrence?.date ?? '')
const getPackageSelectionValue = (pkg) => String(pkg?.selectionKey ?? pkg?.occurrencePackageId ?? pkg?.id ?? '')
const getStablePackageValue = (pkg) => String(pkg?.stableKey ?? [pkg?.familyKey ?? 'unknown-family', pkg?.variantKey ?? 'default', pkg?.eventPackageId ?? pkg?.id ?? 'unknown-package'].join(':'))
const selectDefaultOccurrence = (event) => event?.occurrences?.find((occurrence) => occurrence.isBookable) || event?.occurrences?.[0] || null
const selectDefaultPackage = (occurrence) => occurrence?.packages?.find((pkg) => pkg.isBookable) || occurrence?.packages?.[0] || null
const findPackageByStableKey = (packages, stableKey) => packages.find((pkg) => getStablePackageValue(pkg) === String(stableKey)) || null
const resolveCommittedPackage = (occurrence, packageStableKey) => {
  const packages = occurrence?.packages || []
  if (packages.length === 0 || !packageStableKey) return null
  return findPackageByStableKey(packages, packageStableKey)
}
const resolvePreferredPackage = (occurrence, packageStableKey) => {
  const committedPackage = resolveCommittedPackage(occurrence, packageStableKey)
  if (committedPackage?.isBookable) return committedPackage
  return selectDefaultPackage(occurrence)
}

const mergePackagePricingOverride = (basePackage, overridePackage) => {
  if (!overridePackage) return basePackage

  return {
    ...basePackage,
    price: overridePackage.price,
    originalPrice: overridePackage.originalPrice,
    paymentMode: overridePackage.paymentMode,
    depositAmount: overridePackage.depositAmount,
    pricingSummary: overridePackage.pricingSummary,
    availability: overridePackage.availability,
    isBookable: overridePackage.isBookable,
    statusLabel: overridePackage.statusLabel,
    cardStatusLabel: overridePackage.cardStatusLabel,
    inventoryRemaining: overridePackage.inventoryRemaining,
    availabilityLabel: overridePackage.availabilityLabel,
    inventoryLabel: overridePackage.inventoryLabel,
    currency: overridePackage.currency,
    selectedVariant: overridePackage.selectedVariant,
    audienceCode: overridePackage.audienceCode,
  }
}

const mergeOccurrenceOverride = (baseOccurrence, overrideOccurrence) => {
  if (!baseOccurrence) return overrideOccurrence || null
  if (!overrideOccurrence) return baseOccurrence

  const overridePackages = overrideOccurrence?.packages || []

  return {
    ...baseOccurrence,
    ...overrideOccurrence,
    packages: (baseOccurrence.packages || []).map((basePackage) => {
      const matchingOverride = overridePackages.find((overridePackage) => (
        getStablePackageValue(overridePackage) === getStablePackageValue(basePackage)
      )) || overridePackages.find((overridePackage) => (
        String(overridePackage?.eventPackageId ?? overridePackage?.id ?? '') === String(basePackage?.eventPackageId ?? basePackage?.id ?? '')
      ))

      return mergePackagePricingOverride(basePackage, matchingOverride)
    }),
  }
}

const findOccurrenceFromSearchParams = (occurrences, searchParams) => {
  const requestedOccurrenceKey = searchParams.get('occurrence')
  const requestedOccurrenceDate = searchParams.get('occurrence_date')

  if (requestedOccurrenceKey) {
    const matchingOccurrence = occurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(requestedOccurrenceKey))
    if (matchingOccurrence) return matchingOccurrence
  }

  if (requestedOccurrenceDate) {
    const matchingOccurrence = occurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(requestedOccurrenceDate))
    if (matchingOccurrence) return matchingOccurrence
  }

  return null
}

const findPackageFromSearchParams = (occurrence, searchParams) => {
  const packages = occurrence?.packages || []
  if (packages.length === 0) return null

  const requestedStableKey = searchParams.get('package') || searchParams.get('package_key')
  const legacySelection = searchParams.get('package_selection')
  const legacyPackageId = searchParams.get('package_id') || searchParams.get('event_package_id') || searchParams.get('package')
  const legacyFamilyKey = searchParams.get('package_family') || searchParams.get('package_family_key')
  const legacyVariantKey = searchParams.get('package_variant') || searchParams.get('package_variant_key')

  if (requestedStableKey) {
    const matchingPackage = findPackageByStableKey(packages, requestedStableKey)
    if (matchingPackage) return matchingPackage
  }

  if (legacySelection) {
    const matchingPackage = packages.find((pkg) => getPackageSelectionValue(pkg) === String(legacySelection))
    if (matchingPackage) return matchingPackage
  }

  if (legacyFamilyKey && legacyVariantKey) {
    const matchingPackage = packages.find((pkg) => String(pkg?.familyKey ?? '') === String(legacyFamilyKey)
      && String(pkg?.variantKey ?? 'default') === String(legacyVariantKey))
    if (matchingPackage) return matchingPackage
  }

  if (legacyPackageId) {
    const matchingPackage = packages.find((pkg) => String(pkg?.eventPackageId ?? pkg?.id ?? '') === String(legacyPackageId))
    if (matchingPackage) return matchingPackage
  }

  return null
}

const resolveBookingIntent = (event, searchParams, fallbackIntent = DEFAULT_BOOKING_INTENT) => {
  const occurrences = event?.occurrences || []
  if (occurrences.length === 0) return { ...DEFAULT_BOOKING_INTENT, activeTab: getValidDetailTab(searchParams.get('tab')) }

  const fallbackOccurrence = occurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(fallbackIntent?.occurrenceKey)) || null
  const nextOccurrence = findOccurrenceFromSearchParams(occurrences, searchParams) || fallbackOccurrence || selectDefaultOccurrence(event)
  const requestedPackage = findPackageFromSearchParams(nextOccurrence, searchParams)
  const nextPackage = requestedPackage
    ? resolvePreferredPackage(nextOccurrence, getStablePackageValue(requestedPackage))
    : resolvePreferredPackage(nextOccurrence, fallbackIntent?.packageStableKey)

  return {
    occurrenceKey: getOccurrenceSelectionValue(nextOccurrence),
    packageStableKey: getStablePackageValue(nextPackage),
    activeTab: getValidDetailTab(searchParams.get('tab')),
  }
}

const buildOccurrencePricingFilters = ({ quantity, selectedPackage }) => {
  const filters = {
    quantity: Math.max(1, Number(quantity || 1)),
  }

  const guestCount = Number(selectedPackage?.guestCount ?? selectedPackage?.maxGuests)
  if (!Number.isNaN(guestCount) && guestCount > 0) {
    filters.guest_count = guestCount
  }

  const audiencePricingCode = selectedPackage?.audienceCode
    ?? selectedPackage?.selectedVariant?.code
    ?? selectedPackage?.variantKey
    ?? null
  if (audiencePricingCode) {
    filters.audience_pricing_code = audiencePricingCode
  }

  return filters
}

const buildSearchParamsFromIntent = (bookingIntent) => {
  const nextParams = new URLSearchParams()

  if (bookingIntent.occurrenceKey) nextParams.set('occurrence', bookingIntent.occurrenceKey)
  if (bookingIntent.packageStableKey) nextParams.set('package', bookingIntent.packageStableKey)
  if (bookingIntent.activeTab !== 'overview') nextParams.set('tab', bookingIntent.activeTab)

  return nextParams
}

const compactUniqueText = (values, limit = Number.POSITIVE_INFINITY) => {
  const seen = new Set()

  return values
    .flat()
    .map((value) => String(value ?? '').trim())
    .filter(Boolean)
    .filter((value) => {
      const key = value.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, limit)
}

const toFiniteNumber = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

const formatMobileMoney = (value, currency = 'AED') => {
  const number = toFiniteNumber(value)
  if (number === null) return null

  const hasDecimals = Math.abs(number % 1) > 0
  return `${currency || 'AED'} ${number.toLocaleString('en-AE', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: hasDecimals ? 2 : 0,
  })}`
}

const getPrimaryMapLink = (mapLinks) => {
  if (!mapLinks || typeof mapLinks !== 'object') return null

  return mapLinks.google
    || mapLinks.google_maps
    || mapLinks.apple
    || mapLinks.apple_maps
    || mapLinks.website
    || null
}

const getMobileImageList = (event) => compactUniqueText([
  event?.image,
  event?.images || [],
  (event?.mediaItems || [])
    .filter((item) => item?.type === 'image')
    .map((item) => item.url || item.previewUrl),
])

const getMobileHeroMedia = (event) => {
  const mediaItems = (event?.mediaItems || []).filter((item) => item?.isVisible !== false)
  const selectedHeroUrl = event?.mediaDisplay?.selectedHeroMediaUrl
  const selectedHero = selectedHeroUrl
    ? mediaItems.find((item) => item.url === selectedHeroUrl || item.previewUrl === selectedHeroUrl || item.posterUrl === selectedHeroUrl)
    : null
  const heroVideo = selectedHero?.type === 'video'
    ? selectedHero
    : mediaItems.find((item) => item.type === 'video')

  if (heroVideo?.url) {
    return {
      type: 'video',
      url: heroVideo.url,
      posterUrl: heroVideo.posterUrl || heroVideo.previewUrl || event?.image || event?.images?.[0] || '',
      alt: heroVideo.alt || `${event?.title || 'Event'} video`,
    }
  }

  const heroImage = selectedHero?.type === 'image'
    ? selectedHero
    : mediaItems.find((item) => item.type === 'image')
  const imageUrl = heroImage?.url || heroImage?.previewUrl || event?.image || event?.images?.[0] || ''

  return imageUrl
    ? {
        type: 'image',
        url: imageUrl,
        alt: heroImage?.alt || `${event?.title || 'Event'} photo`,
      }
    : null
}

const getMobileHeroSlides = (event) => {
  const heroMedia = getMobileHeroMedia(event)
  const imageSlides = getMobileImageList(event).map((url, index) => ({
    id: `image-${index}-${url}`,
    type: 'image',
    url,
    alt: `${event?.title || 'Event'} photo ${index + 1}`,
  }))

  const slides = heroMedia?.type === 'video' ? [heroMedia] : []
  const heroImageUrl = heroMedia?.type === 'image' ? heroMedia.url : null
  const hasHeroImage = heroImageUrl && imageSlides.some((slide) => slide.url === heroImageUrl)
  const orderedImageSlides = heroImageUrl && !hasHeroImage
    ? [{ ...heroMedia, id: `image-hero-${heroImageUrl}` }, ...imageSlides]
    : imageSlides

  return [...slides, ...orderedImageSlides]
}

const getEventTagLabel = (event) => event?.placementLabel
  || event?.availabilitySummary?.statusLabel
  || event?.category
  || event?.tags?.[0]
  || 'Featured'

const getVenueHref = (event) => {
  const venueId = event?.venueId || event?.venueDetails?.id
  return venueId ? `/venues/${encodeURIComponent(venueId)}` : '/venues'
}

const getVenueTypeLabels = (event) => compactUniqueText([
  (event?.venueDetails?.venueTypes || []).map((type) => type?.name || type?.label),
  (event?.categories || []).map((category) => category?.displayName || category?.label || category?.name),
  event?.category,
  event?.servicePeriod,
  event?.environmentType,
  event?.tags || [],
], 6)

const getOccurrenceTimingLabel = (occurrence, event) => compactUniqueText([
  occurrence?.date || event?.date,
  occurrence?.time || event?.time,
], 2).join(' - ') || 'Published timings coming soon'

const getPackagePriceValue = (pkg) => pkg?.pricingSummary?.line_total ?? pkg?.price ?? null
const getPackageCurrency = (pkg) => pkg?.pricingSummary?.currency ?? pkg?.currency ?? 'AED'
const getPackagePriceLabel = (pkg) => formatMobileMoney(getPackagePriceValue(pkg), getPackageCurrency(pkg))

const getMobileEssentials = (event, occurrence) => {
  const packageCount = occurrence?.packages?.length || event?.packages?.length || 0
  const offeringCount = (event?.offerings || []).reduce((total, offering) => total + (offering?.items?.length || 0), 0)
  const venueType = getVenueTypeLabels(event)[0]

  return [
    { label: getOccurrenceTimingLabel(occurrence, event), detail: 'Event day and timings', icon: CalendarDays },
    event?.venueDetails?.areaCityLabel || event?.location
      ? { label: event.venueDetails?.areaCityLabel || event.location, detail: 'Event location', icon: MapPin }
      : null,
    venueType ? { label: venueType, detail: 'Venue type', icon: Tag } : null,
    packageCount ? { label: `${packageCount} package${packageCount === 1 ? '' : 's'} available`, detail: 'Bookable options', icon: PackageIcon } : null,
    offeringCount ? { label: `${offeringCount} curated inclusion${offeringCount === 1 ? '' : 's'}`, detail: 'What it offers', icon: Sparkles } : null,
  ].filter(Boolean)
}

const getOfferingItems = (event) => (event?.offerings || []).flatMap((offering) => (
  (offering?.items || []).map((item) => ({
    id: item.id || item.key || `${offering.label}-${item.label}`,
    label: item.label,
    group: offering.label,
  }))
)).filter((item) => item.label)

const buildBookingUrl = ({ event, selectedOccurrence, selectedPackage, quantity }) => {
  const bookingSearch = new URLSearchParams({
    occurrence_date: String(selectedOccurrence?.occurrenceDate || selectedOccurrence?.date || ''),
    occurrence: String(selectedOccurrence?.slotKey || selectedOccurrence?.occurrenceDate || selectedOccurrence?.date || ''),
    package: String(selectedPackage?.eventPackageId || selectedPackage?.id || ''),
    package_selection: String(selectedPackage?.selectionKey || selectedPackage?.occurrencePackageId || selectedPackage?.id || ''),
    guests: String(quantity),
  })

  if (selectedPackage?.familyKey) bookingSearch.set('package_family', String(selectedPackage.familyKey))
  if (selectedPackage?.variantKey) bookingSearch.set('package_variant', String(selectedPackage.variantKey))
  if (selectedPackage?.stableKey) bookingSearch.set('package_key', String(selectedPackage.stableKey))

  return `/booking/${event.id}?${bookingSearch.toString()}`
}

const normalizeAssociatedItem = (item, fallbackMeta = 'Same venue') => {
  if (!item) return null

  const title = item.title || item.name || item.label
  if (!title) return null

  return {
    id: item.id || item.eventId || item.href || title,
    title,
    meta: compactUniqueText([item.venue, item.location, item.date, item.time, item.subtitle, fallbackMeta], 2).join(' - '),
    image: item.image || item.previewUrl || item.media?.[0]?.asset_url || null,
    href: item.href || item.id || item.eventId ? getEventHref(item) : null,
  }
}

const getAssociatedEvents = (event) => {
  const sourceItems = [
    event?.associatedEvents,
    event?.relatedEvents,
    event?.sameVenueEvents,
    event?.venueDetails?.events,
    event?.venueDetails?.upcomingEvents,
    (event?.variantOptions || []).filter((option) => !option?.isActive),
  ].flat().filter(Boolean)

  return sourceItems
    .map((item) => normalizeAssociatedItem(item, event?.venueDetails?.name || event?.venue || 'Same venue'))
    .filter(Boolean)
    .filter((item) => String(item.id) !== String(event?.id) && item.href !== getEventHref(event))
    .slice(0, 4)
}

const normalizeArticleItem = (item) => {
  if (!item) return null
  const title = item.title || item.name || item.headline
  if (!title) return null

  return {
    id: item.id || item.slug || item.href || title,
    title,
    meta: item.category || item.author || item.publishedAt || item.readTime || 'STT editorial',
    image: item.image || item.coverImage || item.thumbnail || null,
    href: item.href || item.url || (item.slug ? `/blog/${item.slug}` : null),
  }
}

const getAssociatedArticles = (event) => [
  event?.associatedArticles,
  event?.articles,
  event?.blogPosts,
  event?.editorialArticles,
  event?.venueDetails?.articles,
].flat().filter(Boolean).map(normalizeArticleItem).filter(Boolean).slice(0, 3)

const getReviewCount = (event) => {
  if (Array.isArray(event?.reviews)) return event.reviews.length
  return toFiniteNumber(event?.reviewCount ?? event?.reviews) ?? 0
}

const getReviewEntries = (event) => [
  event?.reviewEntries,
  event?.reviewsList,
  event?.customerReviews,
  Array.isArray(event?.reviews) ? event.reviews : null,
  event?.venueDetails?.reviewEntries,
].find((entries) => Array.isArray(entries) && entries.length > 0) || []

const getThingsToKnow = (event) => [
  ...(event?.policies || []).map((value) => ({ title: value, body: null })),
  ...(event?.accessibility || []).map((value) => ({ title: value, body: null })),
  ...(event?.dressCode ? [{ title: 'Dress code', body: event.dressCode }] : []),
  ...(event?.faqs || []).map((faq) => ({ title: faq.question, body: faq.answer })),
].filter((item) => item.title || item.body)

const getMapEmbedUrl = (event) => {
  if (!GOOGLE_MAPS_API_KEY) return null

  const coordinates = event?.coordinates
  const lat = toFiniteNumber(coordinates?.lat ?? coordinates?.latitude)
  const lng = toFiniteNumber(coordinates?.lng ?? coordinates?.longitude)
  const query = lat !== null && lng !== null
    ? `${lat},${lng}`
    : compactUniqueText([
        event?.venueDetails?.name || event?.venue,
        event?.venueDetails?.address,
        event?.location,
        event?.venueDetails?.city || 'Dubai',
        'UAE',
      ], 5).join(', ')

  if (!query) return null

  const params = new URLSearchParams({
    key: GOOGLE_MAPS_API_KEY,
    q: query,
  })

  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`
}

function MobileDetailSection({ id, title, children, className = '' }) {
  return (
    <section id={id} className={`border-t border-gray-100 px-6 py-7 ${className}`}>
      <h2 className="text-[17px] font-semibold leading-6 text-brand-black">{title}</h2>
      {children}
    </section>
  )
}

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()
  const { toggleEventFavorite, isEventFavorited, isFavoritePending } = useBooking()
  const { data: eventDetail, loading, error, retry } = useEventDetailCatalog(id)
  const eventIdentity = eventDetail?.id ?? null
  const [bookingIntent, setBookingIntent] = useState(DEFAULT_BOOKING_INTENT)
  const [quantity, setQuantity] = useState(1)
  const [mobileExpandedSections, setMobileExpandedSections] = useState({})
  const [isMobileReserveDrawerOpen, setIsMobileReserveDrawerOpen] = useState(false)
  const [pricingResource, setPricingResource] = useState({
    status: 'idle',
    requestKey: '',
    occurrenceKey: '',
    pricedOccurrence: null,
    error: null,
  })
  const searchParamsString = searchParams.toString()
  const [cartAdded, setCartAdded] = useState(false)
  const cartTimeoutRef = useRef(null)
  const lastAuthoredSearchRef = useRef(null)
  const [hydratedSearchKey, setHydratedSearchKey] = useState('')

  useEffect(() => {
    setHydratedSearchKey('')
    setPricingResource({
      status: 'idle',
      requestKey: '',
      occurrenceKey: '',
      pricedOccurrence: null,
      error: null,
    })

    if (!eventIdentity) {
      setBookingIntent(DEFAULT_BOOKING_INTENT)
    }

    setQuantity(1)
  }, [eventIdentity])

  useEffect(() => {
    if (!eventDetail) {
      setBookingIntent(DEFAULT_BOOKING_INTENT)
      return
    }

    if (lastAuthoredSearchRef.current === searchParamsString) {
      setHydratedSearchKey(searchParamsString)
      return
    }

    setBookingIntent((current) => {
      const nextIntent = resolveBookingIntent(eventDetail, searchParams, current)
      return JSON.stringify(current) === JSON.stringify(nextIntent) ? current : nextIntent
    })

    setHydratedSearchKey(searchParamsString)
  }, [eventDetail, searchParams, searchParamsString])

  const baseOccurrences = useMemo(() => eventDetail?.occurrences || [], [eventDetail])
  const selectedBaseOccurrence = useMemo(
    () => baseOccurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(bookingIntent.occurrenceKey)) || null,
    [baseOccurrences, bookingIntent.occurrenceKey]
  )
  const selectedBasePackage = useMemo(
    () => resolveCommittedPackage(selectedBaseOccurrence, bookingIntent.packageStableKey),
    [selectedBaseOccurrence, bookingIntent.packageStableKey]
  )
  const pricingFilters = useMemo(
    () => buildOccurrencePricingFilters({ quantity, selectedPackage: selectedBasePackage }),
    [quantity, selectedBasePackage]
  )
  const selectedBaseOccurrenceKey = getOccurrenceSelectionValue(selectedBaseOccurrence)
  const pricingRequestKey = useMemo(() => JSON.stringify({
    occurrenceKey: selectedBaseOccurrenceKey,
    quantity: pricingFilters.quantity,
    guest_count: pricingFilters.guest_count ?? null,
    audience_pricing_code: pricingFilters.audience_pricing_code ?? null,
  }), [pricingFilters, selectedBaseOccurrenceKey])

  const selectedOccurrence = useMemo(() => {
    const hasSameOccurrencePricing = pricingResource.pricedOccurrence
      && pricingResource.occurrenceKey === selectedBaseOccurrenceKey
    const hasMatchingPricing = hasSameOccurrencePricing
      && pricingResource.requestKey === pricingRequestKey

    return hasMatchingPricing
      ? mergeOccurrenceOverride(selectedBaseOccurrence, pricingResource.pricedOccurrence)
      : selectedBaseOccurrence
  }, [pricingRequestKey, pricingResource, selectedBaseOccurrence, selectedBaseOccurrenceKey])

  const selectedPkg = useMemo(
    () => resolveCommittedPackage(selectedOccurrence, bookingIntent.packageStableKey),
    [selectedOccurrence, bookingIntent.packageStableKey]
  )

  const occurrences = useMemo(
    () => baseOccurrences.map((occurrence) => (getOccurrenceSelectionValue(occurrence) === getOccurrenceSelectionValue(selectedOccurrence) ? selectedOccurrence : occurrence)),
    [baseOccurrences, selectedOccurrence]
  )

  const selectOccurrence = (occurrence) => {
    const nextOccurrence = occurrence || null

    setBookingIntent((current) => {
      const nextPackage = resolvePreferredPackage(nextOccurrence, current.packageStableKey)

      return {
        ...current,
        occurrenceKey: getOccurrenceSelectionValue(nextOccurrence),
        packageStableKey: getStablePackageValue(nextPackage),
      }
    })
  }

  const handlePackageSelectionChange = (packageSelectionValue) => {
    const nextPackage = selectedOccurrence?.packages?.find((pkg) => getPackageSelectionValue(pkg) === String(packageSelectionValue)) || null

    setBookingIntent((current) => ({
      ...current,
      packageStableKey: getStablePackageValue(nextPackage),
    }))
  }

  const handleQuantityChange = (value) => {
    setQuantity(getQuantityValue(value))
  }

  const setActiveTab = (nextTab) => {
    setBookingIntent((current) => ({
      ...current,
      activeTab: getValidDetailTab(nextTab),
    }))
  }

  useEffect(() => {
    if (!eventDetail || hydratedSearchKey !== searchParamsString) return

    const nextSearchString = buildSearchParamsFromIntent(bookingIntent).toString()
    if (nextSearchString !== searchParamsString) {
      lastAuthoredSearchRef.current = nextSearchString
      setSearchParams(nextSearchString, { replace: true })
      return
    }

    lastAuthoredSearchRef.current = nextSearchString
  }, [bookingIntent, eventDetail, hydratedSearchKey, searchParamsString, setSearchParams])

  useEffect(() => () => window.clearTimeout(cartTimeoutRef.current), [])

  useEffect(() => {
    if (!isMobileReserveDrawerOpen || typeof document === 'undefined') return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileReserveDrawerOpen])

  useEffect(() => {
    const occurrenceKey = getOccurrenceSelectionValue(selectedBaseOccurrence)
    const requestKey = pricingRequestKey

    if (!eventDetail || !selectedBaseOccurrence || !selectedBasePackage) {
      setPricingResource((current) => ({
        ...current,
        status: current.pricedOccurrence ? 'stale' : 'idle',
        requestKey: '',
        occurrenceKey,
        error: null,
      }))
      return undefined
    }

    const controller = new AbortController()

    setPricingResource((current) => ({
      status: 'refreshing',
      requestKey,
      occurrenceKey,
      pricedOccurrence: current.occurrenceKey === occurrenceKey && current.requestKey === requestKey ? current.pricedOccurrence : null,
      error: null,
    }))

    getCatalogOccurrenceDetail({
      event: eventDetail,
      eventId: eventDetail.id ?? id,
      slotKey: occurrenceKey,
      filters: pricingFilters,
      signal: controller.signal,
    })
      .then((occurrence) => {
        if (!occurrence) return
        setPricingResource((current) => (current.requestKey === requestKey
          ? {
              status: 'ready',
              requestKey,
              occurrenceKey,
              pricedOccurrence: occurrence,
              error: null,
            }
          : current))
      })
      .catch((refreshError) => {
        if (refreshError?.name === 'AbortError') return
        setPricingResource((current) => (current.requestKey === requestKey
          ? {
              status: current.pricedOccurrence && current.occurrenceKey === occurrenceKey ? 'stale' : 'failed',
              requestKey,
              occurrenceKey,
              pricedOccurrence: current.pricedOccurrence,
              error: refreshError,
            }
          : current))
      })

    return () => controller.abort()
  }, [eventDetail, id, pricingFilters, pricingRequestKey, selectedBaseOccurrence, selectedBasePackage])

  const pricingMatchesActiveSelection = pricingResource.status === 'ready'
    && pricingResource.occurrenceKey === selectedBaseOccurrenceKey
    && pricingResource.requestKey === pricingRequestKey
  const pricingRefreshPending = pricingResource.status === 'refreshing' || !pricingMatchesActiveSelection
  const pricingRefreshError = pricingResource.status === 'failed' || pricingResource.status === 'stale'
  const canBookSelectedPackage = Boolean(selectedPkg?.isBookable) && pricingMatchesActiveSelection
  const mobileHeroSlides = useMemo(() => getMobileHeroSlides(eventDetail), [eventDetail])
  const mobileVenueTypes = useMemo(() => getVenueTypeLabels(eventDetail), [eventDetail])
  const mobileEssentials = useMemo(() => getMobileEssentials(eventDetail, selectedOccurrence), [eventDetail, selectedOccurrence])
  const mobileOfferingItems = useMemo(() => getOfferingItems(eventDetail), [eventDetail])
  const mobileAssociatedEvents = useMemo(() => getAssociatedEvents(eventDetail), [eventDetail])
  const mobileAssociatedArticles = useMemo(() => getAssociatedArticles(eventDetail), [eventDetail])
  const mobileReviewEntries = useMemo(() => getReviewEntries(eventDetail), [eventDetail])
  const mobileThingsToKnow = useMemo(() => getThingsToKnow(eventDetail), [eventDetail])
  const mobileMapEmbedUrl = useMemo(() => getMapEmbedUrl(eventDetail), [eventDetail])
  const mobileMapLink = getPrimaryMapLink(eventDetail?.venueDetails?.mapLinks)
  const mobileAvailablePackages = selectedOccurrence?.packages || []
  const mobileVisibleDates = mobileExpandedSections.dates ? occurrences : occurrences.slice(0, 5)
  const mobileVisiblePackages = mobileExpandedSections.packages ? mobileAvailablePackages : mobileAvailablePackages.slice(0, 3)
  const mobileVisibleOfferings = mobileExpandedSections.offerings ? mobileOfferingItems : mobileOfferingItems.slice(0, 5)
  const mobileVisibleThings = mobileExpandedSections.things ? mobileThingsToKnow : mobileThingsToKnow.slice(0, 3)
  const mobileSelectedPackagePrice = getPackagePriceLabel(selectedPkg)
  const mobileDueNow = formatMobileMoney(selectedPkg?.pricingSummary?.due_now, getPackageCurrency(selectedPkg))
  const mobileStartingPrice = formatMobileMoney(eventDetail?.price)
  const mobileReservePrice = mobileSelectedPackagePrice || (mobileStartingPrice ? `From ${mobileStartingPrice}` : 'Select package')
  const isMobileFavorited = eventDetail?.id ? isEventFavorited(eventDetail.id) : false
  const mobileFavoritePending = eventDetail?.id ? isFavoritePending('event', eventDetail.id) : false
  const mobileReviewCount = getReviewCount(eventDetail)

  const toggleMobileSection = (section) => {
    setMobileExpandedSections((current) => ({
      ...current,
      [section]: !current[section],
    }))
  }

  const handleShareEvent = async () => {
    if (typeof window === 'undefined' || !eventDetail) return

    const sharePayload = {
      title: eventDetail.title || 'Set The Table event',
      url: window.location.href,
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share(sharePayload)
        return
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(sharePayload.url)
      }
    } catch {
      // Sharing is optional browser functionality, so a user cancel should not interrupt booking.
    }
  }

  const handleToggleFavorite = async () => {
    if (!eventDetail || mobileFavoritePending) return

    try {
      await toggleEventFavorite(eventDetail)
    } catch {
      // The favorites context surfaces auth and API errors; keep the detail page stable.
    }
  }

  const openMobileReserveDrawer = () => {
    setIsMobileReserveDrawerOpen(true)
  }

  const handleMobileReserve = () => {
    if (!eventDetail || !selectedOccurrence || !selectedPkg || !canBookSelectedPackage || pricingRefreshPending) return

    navigate(buildBookingUrl({ event: eventDetail, selectedOccurrence, selectedPackage: selectedPkg, quantity }))
  }

  const mobileReserveLabel = !selectedOccurrence
    ? 'Select date'
    : !selectedPkg
      ? 'Select package'
      : pricingRefreshPending
        ? 'Updating'
        : 'Reserve'
  const mobileDrawerReserveDisabled = !selectedOccurrence || !selectedPkg || !canBookSelectedPackage || pricingRefreshPending

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading event...</div>
  if (error?.status === 404) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Event not found</h1><Link to="/events" className="text-brand-purple">Back to Events</Link></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Couldn't load event</h1><p className="text-gray-600 mb-4">{error.message}</p><button onClick={retry} className="text-brand-purple">Try again</button></div></div>
  if (!eventDetail) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="md:hidden">
        <section className="relative h-[58vh] min-h-[360px] max-h-[540px] overflow-hidden bg-gray-950">
          {mobileHeroSlides.length > 0 ? (
            <div className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain" aria-label="Event media gallery">
              {mobileHeroSlides.map((slide, index) => (
                <div key={slide.id || `${slide.type}-${slide.url}`} className="h-full min-w-full snap-center">
                  {slide.type === 'video' ? (
                    <video
                      className="h-full w-full object-cover"
                      src={slide.url}
                      poster={slide.posterUrl}
                      autoPlay={index === 0}
                      muted
                      loop
                      playsInline
                      aria-label={slide.alt}
                    />
                  ) : (
                    <img src={slide.url} alt={slide.alt} className="h-full w-full object-cover" loading={index === 0 ? 'eager' : 'lazy'} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}

          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 to-transparent" />
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="absolute left-5 top-7 flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-brand-black shadow-[0_8px_22px_rgba(0,0,0,0.18)] backdrop-blur"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <div className="absolute right-5 top-7 flex items-center gap-3">
            <button
              type="button"
              onClick={handleShareEvent}
              aria-label="Share event"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-brand-black shadow-[0_8px_22px_rgba(0,0,0,0.18)] backdrop-blur"
            >
              <Share2 className="h-5 w-5" strokeWidth={1.9} />
            </button>
            <button
              type="button"
              onClick={handleToggleFavorite}
              disabled={mobileFavoritePending}
              aria-label={isMobileFavorited ? 'Remove from favorites' : 'Save to favorites'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-brand-black shadow-[0_8px_22px_rgba(0,0,0,0.18)] backdrop-blur disabled:opacity-60"
            >
              <Heart className={`h-5 w-5 ${isMobileFavorited ? 'fill-brand-purple text-brand-purple' : ''}`} strokeWidth={1.9} />
            </button>
          </div>
          <span className="absolute bottom-12 left-5 rounded-full bg-brand-purple px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(171,131,187,0.28)]">
            {getEventTagLabel(eventDetail)}
          </span>
          {mobileHeroSlides.length > 0 && (
            <span className="absolute bottom-12 right-5 inline-flex items-center gap-1.5 rounded-full bg-brand-black/80 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
              <ImageIcon className="h-3.5 w-3.5" />
              {mobileHeroSlides.length}
            </span>
          )}
        </section>

        <article className="relative z-10 -mt-8 rounded-t-[32px] bg-white pb-28 shadow-[0_-18px_38px_rgba(0,0,0,0.08)]">
          <div className="px-6 pb-7 pt-8 text-center">
            <h1 className="mx-auto max-w-[340px] text-[17px] font-semibold leading-6 text-brand-black">
              {eventDetail.title || 'Event details'}
            </h1>

            <Link
              to={getVenueHref(eventDetail)}
              className="mt-3 inline-flex items-center justify-center gap-1 text-[13px] font-semibold text-brand-black underline underline-offset-4"
            >
              {eventDetail.venueDetails?.name || eventDetail.venue || 'Venue'}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <p className="mx-auto mt-2 flex max-w-[310px] items-start justify-center gap-1.5 text-[11px] font-normal leading-4 text-gray-500">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>{eventDetail.venueDetails?.address || eventDetail.location || 'Location details will be shared once published.'}</span>
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-[12px] text-brand-black">
              {eventDetail.rating ? (
                <>
                  <Star className="h-3.5 w-3.5 fill-brand-black" />
                  <span className="font-semibold">{eventDetail.rating}</span>
                  <span className="text-gray-400">-</span>
                </>
              ) : null}
              <span className="font-medium underline underline-offset-4">{mobileReviewCount} reviews</span>
            </div>

            {mobileVenueTypes.length > 0 && (
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {mobileVenueTypes.map((label) => (
                  <span key={label} className="rounded-full bg-brand-green px-3 py-1.5 text-[9px] font-normal uppercase tracking-[0.14em] text-white">
                    {label}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-[20px] bg-gray-50 px-4 py-4 text-left">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand-purple" />
                <div>
                  <p className="text-[13px] font-semibold text-brand-black">Event day and timings</p>
                  <p className="mt-1 text-[13px] font-normal leading-5 text-gray-600">{getOccurrenceTimingLabel(selectedOccurrence, eventDetail)}</p>
                </div>
              </div>
            </div>

          </div>

          <MobileDetailSection title="About this event">
            <p className={`mt-4 text-[13px] font-normal leading-5 text-gray-600 ${mobileExpandedSections.about ? '' : 'line-clamp-6'}`}>
              {eventDetail.description || 'Event details will be published here as soon as they are available.'}
            </p>
            {eventDetail.description && eventDetail.description.length > 220 && (
              <button type="button" onClick={() => toggleMobileSection('about')} className="mt-5 h-11 w-full rounded-2xl bg-gray-100 text-[13px] font-semibold text-brand-black">
                {mobileExpandedSections.about ? 'Show less' : 'Show more'}
              </button>
            )}
          </MobileDetailSection>

          <MobileDetailSection title="Event essentials">
            {mobileEssentials.length > 0 ? (
              <div className="mt-5 space-y-4">
                {mobileEssentials.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={`${item.detail}-${item.label}`} className="flex items-start gap-4">
                      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-black" strokeWidth={1.8} />
                      <div>
                        <p className="text-[13px] font-medium leading-5 text-brand-black">{item.label}</p>
                        <p className="text-[11px] font-normal leading-4 text-gray-500">{item.detail}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">Specific event essentials have not been published in the current catalog.</p>
            )}

            {mobileOfferingItems.length > 0 && (
              <div className="mt-7 border-t border-gray-100 pt-6">
                <h3 className="text-[13px] font-medium text-brand-black">What this event offers</h3>
                <ul className="mt-4 space-y-4">
                  {mobileVisibleOfferings.map((item) => (
                    <li key={item.id} className="flex items-start gap-4">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-brand-black" strokeWidth={1.7} />
                      <div>
                        <p className="text-[13px] font-normal leading-5 text-brand-black">{item.label}</p>
                        {item.group && <p className="text-[11px] font-normal leading-4 text-gray-500">{item.group}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
                {mobileOfferingItems.length > 5 && (
                  <button type="button" onClick={() => toggleMobileSection('offerings')} className="mt-5 h-11 w-full rounded-2xl bg-gray-100 text-[13px] font-semibold text-brand-black">
                    {mobileExpandedSections.offerings ? 'Show fewer inclusions' : `Show all ${mobileOfferingItems.length} inclusions`}
                  </button>
                )}
              </div>
            )}
          </MobileDetailSection>

          <MobileDetailSection title="Book this event">
            <div className="mt-4 rounded-[22px] border border-gray-200 bg-white p-4 shadow-[0_8px_24px_rgba(52,52,52,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium leading-5 text-brand-black">{selectedOccurrence ? getOccurrenceTimingLabel(selectedOccurrence, eventDetail) : 'Choose a date'}</p>
                  <p className="mt-1 line-clamp-2 text-[11px] font-normal leading-4 text-gray-500">
                    {selectedPkg ? (selectedPkg.displayName || selectedPkg.name || 'Selected package') : 'Select a date, then choose a package.'}
                  </p>
                </div>
                <span className="shrink-0 text-[13px] font-semibold text-brand-black">{mobileReservePrice}</span>
              </div>

              <button
                type="button"
                onClick={openMobileReserveDrawer}
                className="mt-4 h-11 w-full rounded-full bg-brand-purple text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(171,131,187,0.22)]"
              >
                {selectedOccurrence && selectedPkg ? 'Edit selection' : 'Choose date and package'}
              </button>
            </div>
          </MobileDetailSection>

          <MobileDetailSection title="Associated events & experiences">
            {mobileAssociatedEvents.length > 0 ? (
              <div className="mt-4 space-y-3">
                {mobileAssociatedEvents.map((item) => {
                  const CardContent = (
                    <div className="flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white p-3">
                      {item.image ? <img src={item.image} alt={item.title} className="h-16 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400"><ImageIcon className="h-5 w-5" /></div>}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[13px] font-medium leading-5 text-brand-black">{item.title}</h3>
                        <p className="mt-1 line-clamp-1 text-[11px] font-normal text-gray-500">{item.meta}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                    </div>
                  )

                  return item.href ? <Link key={item.id} to={item.href}>{CardContent}</Link> : <div key={item.id}>{CardContent}</div>
                })}
              </div>
            ) : (
              <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">Other events and experiences from this venue will appear here once they are published in the catalog.</p>
            )}
          </MobileDetailSection>

          <MobileDetailSection title="Associated articles">
            {mobileAssociatedArticles.length > 0 ? (
              <div className="mt-4 space-y-3">
                {mobileAssociatedArticles.map((article) => {
                  const ArticleContent = (
                    <div className="flex items-center gap-3 rounded-[18px] border border-gray-200 bg-white p-3">
                      {article.image ? <img src={article.image} alt={article.title} className="h-16 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400"><Sparkles className="h-5 w-5" /></div>}
                      <div className="min-w-0 flex-1">
                        <h3 className="line-clamp-2 text-[13px] font-medium leading-5 text-brand-black">{article.title}</h3>
                        <p className="mt-1 line-clamp-1 text-[11px] font-normal text-gray-500">{article.meta}</p>
                      </div>
                    </div>
                  )

                  return article.href ? <Link key={article.id} to={article.href}>{ArticleContent}</Link> : <div key={article.id}>{ArticleContent}</div>
                })}
              </div>
            ) : (
              <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">Editorial articles connected to this event will appear here once the blog catalog is connected.</p>
            )}
          </MobileDetailSection>

          <MobileDetailSection title="Location map">
            <div className="mt-4 overflow-hidden rounded-[22px] border border-gray-200 bg-gray-100">
              {mobileMapEmbedUrl ? (
                <iframe
                  title={`${eventDetail.venueDetails?.name || eventDetail.venue || eventDetail.title} map`}
                  src={mobileMapEmbedUrl}
                  className="h-56 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-56 flex-col items-center justify-center px-5 text-center">
                  <MapPin className="h-7 w-7 text-brand-purple" />
                  <p className="mt-3 text-[13px] font-medium text-brand-black">{eventDetail.venueDetails?.name || eventDetail.venue || 'Venue location'}</p>
                  <p className="mt-1 text-[11px] font-normal leading-4 text-gray-500">{eventDetail.venueDetails?.address || eventDetail.location || 'Location details will be shared once published.'}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {mobileMapLink && (
                <a href={mobileMapLink} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center rounded-full bg-brand-purple px-4 text-[13px] font-semibold text-white">
                  Open in maps
                </a>
              )}
              <Link to="/map" className="inline-flex h-10 items-center rounded-full border border-gray-300 px-4 text-[13px] font-semibold text-brand-black">
                Explore map
              </Link>
            </div>
          </MobileDetailSection>

          <MobileDetailSection title="Reviews">
            <div className="mt-4 flex items-center gap-2 text-[13px] text-brand-black">
              {eventDetail.rating ? (
                <>
                  <Star className="h-4 w-4 fill-brand-black" />
                  <span className="font-semibold">{eventDetail.rating}</span>
                  <span className="text-gray-400">-</span>
                </>
              ) : null}
              <span className="font-medium">{mobileReviewCount} reviews</span>
            </div>
            {mobileReviewEntries.length > 0 ? (
              <div className="mt-4 space-y-3">
                {mobileReviewEntries.slice(0, 2).map((review) => (
                  <article key={review.id || review.author || review.comment || review.body} className="rounded-[18px] border border-gray-200 p-4">
                    <p className="text-[13px] font-medium text-brand-black">{review.author || review.userName || 'Guest'}</p>
                    <p className="mt-2 line-clamp-4 text-[13px] font-normal leading-5 text-gray-600">{review.comment || review.body || review.text}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">Guest reviews will appear here once they are available through the production reviews feed.</p>
            )}
          </MobileDetailSection>

          <MobileDetailSection title="Things to know">
            {mobileVisibleThings.length > 0 ? (
              <div className="mt-4 space-y-4">
                {mobileVisibleThings.map((item) => (
                  <article key={`${item.title}-${item.body || ''}`} className="rounded-[18px] border border-gray-200 p-4">
                    <h3 className="text-[13px] font-medium leading-5 text-brand-black">{item.title}</h3>
                    {item.body && <p className="mt-2 text-[13px] font-normal leading-5 text-gray-600">{item.body}</p>}
                  </article>
                ))}
                {mobileThingsToKnow.length > 3 && (
                  <button type="button" onClick={() => toggleMobileSection('things')} className="h-11 w-full rounded-2xl bg-gray-100 text-[13px] font-semibold text-brand-black">
                    {mobileExpandedSections.things ? 'Show fewer details' : `Show all ${mobileThingsToKnow.length} details`}
                  </button>
                )}
              </div>
            ) : (
              <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">Booking details, arrival guidance, and FAQs will appear here when available.</p>
            )}
          </MobileDetailSection>
        </article>

        {isMobileReserveDrawerOpen && (
          <div className="fixed inset-0 z-[70] flex items-end bg-black/35" role="presentation">
            <button
              type="button"
              aria-label="Close reserve drawer"
              className="absolute inset-0 h-full w-full cursor-default"
              onClick={() => setIsMobileReserveDrawerOpen(false)}
            />
            <section
              id="mobile-reserve-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-reserve-drawer-title"
              className="relative z-10 max-h-[88vh] w-full overflow-hidden rounded-t-[30px] bg-white shadow-[0_-18px_42px_rgba(0,0,0,0.18)]"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 id="mobile-reserve-drawer-title" className="text-[17px] font-semibold text-brand-black">Book this event</h2>
                  <p className="mt-1 text-[11px] font-normal text-gray-500">Select a date, then select a package.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileReserveDrawerOpen(false)}
                  aria-label="Close"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-brand-black"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <div className="max-h-[calc(88vh-150px)] overflow-y-auto px-5 pb-5 pt-4">
                <div>
                  <h3 className="text-[13px] font-medium text-brand-black">Select date</h3>
                  {occurrences.length > 0 ? (
                    <div className="mt-3 space-y-2.5">
                      {mobileVisibleDates.map((occurrence) => {
                        const occurrenceValue = getOccurrenceSelectionValue(occurrence)
                        const isSelected = occurrenceValue === getOccurrenceSelectionValue(selectedOccurrence)

                        return (
                          <button
                            key={occurrenceValue}
                            type="button"
                            disabled={!occurrence.isBookable}
                            onClick={() => selectOccurrence(occurrence)}
                            className={`flex w-full items-center justify-between gap-4 rounded-[18px] border px-4 py-3 text-left transition ${isSelected ? 'border-brand-purple bg-brand-purple text-white shadow-[0_12px_24px_rgba(171,131,187,0.24)]' : 'border-gray-200 bg-white text-brand-black'} ${!occurrence.isBookable ? 'opacity-50' : ''}`}
                          >
                            <span>
                              <span className="block text-[13px] font-semibold leading-5">{occurrence.date || 'Published date'}</span>
                              <span className={`block text-[11px] font-normal leading-4 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>{occurrence.time || eventDetail.time || 'Timing to be confirmed'}</span>
                            </span>
                            <span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {occurrence.isBookable ? 'Available' : 'Unavailable'}
                            </span>
                          </button>
                        )
                      })}
                      {occurrences.length > 5 && (
                        <button type="button" onClick={() => toggleMobileSection('dates')} className="h-11 w-full rounded-2xl bg-gray-100 text-[13px] font-semibold text-brand-black">
                          {mobileExpandedSections.dates ? 'Show fewer dates' : `Show all ${occurrences.length} dates`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-[18px] bg-gray-50 px-4 py-5 text-[13px] font-normal leading-5 text-gray-600">Published dates will appear here when the venue opens booking.</p>
                  )}
                </div>

                <div className="mt-7">
                  <h3 className="text-[13px] font-medium text-brand-black">Select package</h3>
                  {!selectedOccurrence ? (
                    <p className="mt-3 rounded-[18px] bg-gray-50 px-4 py-5 text-[13px] font-normal leading-5 text-gray-600">Choose a date first to see the packages available for that date.</p>
                  ) : mobileAvailablePackages.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {mobileVisiblePackages.map((pkg) => {
                        const packageSelectionValue = getPackageSelectionValue(pkg)
                        const isSelected = packageSelectionValue === getPackageSelectionValue(selectedPkg)
                        const priceLabel = getPackagePriceLabel(pkg)

                        return (
                          <button
                            key={packageSelectionValue}
                            type="button"
                            disabled={!pkg.isBookable}
                            onClick={() => handlePackageSelectionChange(packageSelectionValue)}
                            className={`w-full rounded-[20px] border px-4 py-4 text-left transition ${isSelected ? 'border-brand-purple bg-brand-purple/10' : 'border-gray-200 bg-white'} ${!pkg.isBookable ? 'opacity-50' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-[13px] font-medium leading-5 text-brand-black">{pkg.displayName || pkg.name || 'Package'}</p>
                                <p className="mt-1 text-[11px] font-normal leading-4 text-gray-500">{[pkg.variantLabel, pkg.packageTypeLabel, pkg.availabilityLabel].filter(Boolean).join(' - ') || 'Package details'}</p>
                              </div>
                              <span className="shrink-0 text-[13px] font-semibold text-brand-black">{priceLabel || 'On request'}</span>
                            </div>
                            {pkg.description && <p className="mt-3 line-clamp-2 text-[13px] font-normal leading-5 text-gray-600">{pkg.description}</p>}
                          </button>
                        )
                      })}
                      {mobileAvailablePackages.length > 3 && (
                        <button type="button" onClick={() => toggleMobileSection('packages')} className="h-11 w-full rounded-2xl bg-gray-100 text-[13px] font-semibold text-brand-black">
                          {mobileExpandedSections.packages ? 'Show fewer packages' : `Show all ${mobileAvailablePackages.length} packages`}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="mt-3 rounded-[18px] bg-gray-50 px-4 py-5 text-[13px] font-normal leading-5 text-gray-600">No packages are available for this date yet.</p>
                  )}
                </div>

                {selectedPkg && (
                  <div className="mt-6 rounded-[20px] border border-gray-200 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[13px] font-medium text-brand-black">Payment summary</p>
                        <p className="mt-1 text-[11px] font-normal text-gray-500">{pricingRefreshPending ? 'Refreshing latest production pricing.' : 'Latest price for this selection.'}</p>
                      </div>
                      <span className="text-[13px] font-semibold text-brand-black">{mobileSelectedPackagePrice || 'On request'}</span>
                    </div>
                    {mobileDueNow && (
                      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-[13px]">
                        <span className="font-normal text-gray-500">Due now</span>
                        <span className="font-semibold text-brand-black">{mobileDueNow}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex items-center justify-between rounded-[20px] border border-gray-200 px-4 py-3">
                  <div>
                    <p className="text-[13px] font-medium text-brand-black">Quantity</p>
                    <p className="text-[11px] font-normal text-gray-500">Packages to reserve</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => handleQuantityChange(Math.max(1, quantity - 1))} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-[15px] font-semibold text-brand-black" aria-label="Decrease quantity">
                      -
                    </button>
                    <span className="w-5 text-center text-[13px] font-semibold text-brand-black">{quantity}</span>
                    <button type="button" onClick={() => handleQuantityChange(quantity + 1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-[15px] font-semibold text-brand-black" aria-label="Increase quantity">
                      +
                    </button>
                  </div>
                </div>

                {pricingRefreshError && (
                  <p className="mt-4 rounded-[18px] border border-brand-yellow/35 bg-brand-yellow/10 px-4 py-3 text-[13px] font-normal leading-5 text-brand-black">
                    We could not refresh pricing yet. Try changing the date or package before booking.
                  </p>
                )}
              </div>

              <div className="border-t border-gray-100 bg-white px-5 pb-[max(env(safe-area-inset-bottom),14px)] pt-3">
                <button
                  type="button"
                  onClick={handleMobileReserve}
                  disabled={mobileDrawerReserveDisabled}
                  className="h-12 w-full rounded-full bg-brand-purple text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(171,131,187,0.28)] disabled:bg-gray-300 disabled:text-gray-600 disabled:shadow-none"
                >
                  {mobileReserveLabel}
                </button>
              </div>
            </section>
          </div>
        )}

        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white px-5 pb-[max(env(safe-area-inset-bottom),14px)] pt-3 shadow-[0_-10px_28px_rgba(0,0,0,0.10)]">
          <div className="mx-auto flex max-w-md items-center justify-between gap-4">
            <button type="button" onClick={openMobileReserveDrawer} className="min-w-0 text-left" aria-expanded={isMobileReserveDrawerOpen} aria-controls="mobile-reserve-drawer">
              <p className="truncate text-[17px] font-semibold leading-5 text-brand-black">{mobileReservePrice}</p>
              <p className="mt-1 text-[11px] font-normal text-gray-500">{selectedOccurrence ? getOccurrenceTimingLabel(selectedOccurrence, eventDetail) : 'Choose date and package'}</p>
            </button>
            <button
              type="button"
              onClick={openMobileReserveDrawer}
              aria-expanded={isMobileReserveDrawerOpen}
              aria-controls="mobile-reserve-drawer"
              className="h-12 min-w-[132px] rounded-full bg-brand-purple px-6 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(171,131,187,0.28)]"
            >
              {mobileReserveLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-4 pb-5 pt-24 md:px-8">
          <Link to="/events" className="inline-flex h-10 items-center gap-2 rounded-full px-1 text-sm font-semibold text-gray-700 transition hover:text-gray-950"><ArrowLeft className="h-4 w-4" /><span>Back to events</span></Link>
        </div>
        <EventGallery event={eventDetail} />
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <EventHeader event={eventDetail} />
              <Tabs value={bookingIntent.activeTab} onValueChange={setActiveTab} className="pb-10">
                <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                  <TabsTrigger value="venue">Venue</TabsTrigger>
                  <TabsTrigger value="packages">Packages</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  <EventOverview event={eventDetail} />
                </TabsContent>

                <TabsContent value="availability">
                  <EventAvailability
                    event={eventDetail}
                    selectedOccurrenceDate={bookingIntent.occurrenceKey}
                    onSelectOccurrence={selectOccurrence}
                    onViewPackages={(occurrence) => {
                      selectOccurrence(occurrence)
                      setActiveTab('packages')
                    }}
                  />
                </TabsContent>

                <TabsContent value="venue">
                  <EventVenue event={eventDetail} />
                </TabsContent>

                <TabsContent value="packages">
                  <EventPackages
                    occurrence={selectedOccurrence}
                    showDatePrompt={!selectedOccurrence}
                    selectedPackageId={getPackageSelectionValue(selectedPkg)}
                    onSelectPackage={(pkg) => handlePackageSelectionChange(getPackageSelectionValue(pkg))}
                  />
                </TabsContent>
              </Tabs>
            </div>
            <div className="lg:col-span-1"><EventSidebar event={eventDetail} occurrences={occurrences} selectedOccurrenceDate={bookingIntent.occurrenceKey} setSelectedOccurrenceDate={(value) => {
              const nextOccurrence = occurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(value)) || null
              selectOccurrence(nextOccurrence)
            }} selectedPackage={selectedPkg} selectedPackageId={getPackageSelectionValue(selectedPkg)} setSelectedPackageId={handlePackageSelectionChange} quantity={quantity} setQuantity={handleQuantityChange} pricingRefreshPending={pricingRefreshPending} pricingRefreshError={pricingRefreshError} pricingRefreshStatus={pricingResource.status} canBookSelectedPackage={canBookSelectedPackage} addToCart={async (payload) => { try { await addToCart(payload); setCartAdded(true); window.clearTimeout(cartTimeoutRef.current); cartTimeoutRef.current = window.setTimeout(() => setCartAdded(false), 2000) } catch (cartError) { if (cartError?.status === 401) { navigate(`/auth?redirect=${encodeURIComponent('/cart')}`); return } throw cartError } }} navigate={navigate} cartAdded={cartAdded} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage
