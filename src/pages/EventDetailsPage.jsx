import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useCart } from '../shared/context/CartContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/ui/tabs'
import { EventAvailability, EventGallery, EventHeader, EventOverview, EventPackages, EventSidebar, EventVenue } from '../features/events/EventDetailsSections'
import { useEventDetailCatalog } from '../features/catalog'
import { getCatalogOccurrenceDetail } from '../modules/publicCatalog/services'

const DEFAULT_BOOKING_INTENT = {
  occurrenceKey: '',
  packageStableKey: '',
  activeTab: 'overview',
}

const DETAIL_TABS = ['overview', 'availability', 'venue', 'packages']

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

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addToCart } = useCart()
  const { data: eventDetail, loading, error, retry } = useEventDetailCatalog(id)
  const eventIdentity = eventDetail?.id ?? null
  const [bookingIntent, setBookingIntent] = useState(DEFAULT_BOOKING_INTENT)
  const [quantity, setQuantity] = useState(1)
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
      eventId: id,
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading event...</div>
  if (error?.status === 404) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Event not found</h1><Link to="/events" className="text-brand-purple">Back to Events</Link></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Couldn't load event</h1><p className="text-gray-600 mb-4">{error.message}</p><button onClick={retry} className="text-brand-purple">Try again</button></div></div>
  if (!eventDetail) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-6">
        <Link to="/events" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeft className="w-5 h-5" /><span className="font-medium">Back to Events</span></Link>
      </div>
      <EventGallery event={eventDetail} />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <EventHeader event={eventDetail} />
            <Tabs value={bookingIntent.activeTab} onValueChange={setActiveTab} className="pb-10">
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-2xl bg-gray-50 p-2">
                <TabsTrigger value="overview" className="rounded-xl px-4 py-2 data-[state=active]:bg-white">Overview</TabsTrigger>
                <TabsTrigger value="availability" className="rounded-xl px-4 py-2 data-[state=active]:bg-white">Availability</TabsTrigger>
                <TabsTrigger value="venue" className="rounded-xl px-4 py-2 data-[state=active]:bg-white">Venue</TabsTrigger>
                <TabsTrigger value="packages" className="rounded-xl px-4 py-2 data-[state=active]:bg-white">Packages</TabsTrigger>
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
  )
}

export default EventDetailsPage
