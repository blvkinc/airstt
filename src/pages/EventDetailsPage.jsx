import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'
import { useCart } from '../shared/context/CartContext'
import { EventAvailability, EventGallery, EventHeader, EventOverview, EventPackages, EventReviews, EventSidebar, EventVenue } from '../features/events/EventDetailsSections'
import { DetailTabNav } from '../shared/components/detail/DetailTabNav'
import { useEventDetailCatalog } from '../features/catalog'

const baseReviews = [
  { id: 1, name: 'Sarah Ahmed', rating: 5, date: '2 weeks ago', comment: 'Absolutely incredible experience.' },
  { id: 2, name: 'Michael Johnson', rating: 4, date: '1 month ago', comment: 'Strong atmosphere and a smooth arrival.' },
]

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'availability', label: 'Availability' },
  { id: 'venue', label: 'Venue' },
  { id: 'packages', label: 'Packages' },
  { id: 'reviews', label: 'Reviews' }
]

const emptySelection = {
  occurrenceDate: '',
  packageStableKey: '',
}

const selectDefaultOccurrence = (event) => event?.occurrences?.find((occurrence) => occurrence.isBookable) || event?.occurrences?.[0] || null
const getPackageSelectionValue = (pkg) => String(pkg?.selectionKey ?? pkg?.occurrencePackageId ?? pkg?.id ?? '')
const getStablePackageValue = (pkg) => String(pkg?.stableKey ?? [pkg?.familyKey ?? 'unknown-family', pkg?.variantKey ?? 'default', pkg?.eventPackageId ?? pkg?.id ?? 'unknown-package'].join(':'))
const selectDefaultPackage = (occurrence) => occurrence?.packages?.find((pkg) => pkg.isBookable) || occurrence?.packages?.[0] || null
const getOccurrenceSelectionValue = (occurrence) => String(occurrence?.occurrenceDate ?? occurrence?.date ?? '')
const findPackageByStableKey = (packages, stableKey) => packages.find((pkg) => getStablePackageValue(pkg) === String(stableKey)) || null
const resolvePreferredPackage = (occurrence, packageStableKey) => {
  const packages = occurrence?.packages || []
  if (packages.length === 0) return null

  const preferredPackage = findPackageByStableKey(packages, packageStableKey)
  if (preferredPackage?.isBookable) return preferredPackage

  return selectDefaultPackage(occurrence)
}

const findOccurrenceFromSearchParams = (occurrences, searchParams) => {
  const requestedOccurrenceDate = searchParams.get('occurrence_date')
  const requestedOccurrenceId = searchParams.get('occurrence')

  if (requestedOccurrenceDate) {
    const matchingOccurrence = occurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(requestedOccurrenceDate))
    if (matchingOccurrence) return matchingOccurrence
  }

  const supportsCanonicalDates = occurrences.some((occurrence) => Boolean(getOccurrenceSelectionValue(occurrence)))

  if (!supportsCanonicalDates && requestedOccurrenceId) {
    const matchingOccurrence = occurrences.find((occurrence) => String(occurrence?.eventOccurrenceId ?? occurrence?.id ?? '') === String(requestedOccurrenceId))
    if (matchingOccurrence) return matchingOccurrence
  }

  return null
}

const findPackageFromSearchParams = (occurrence, searchParams) => {
  const packages = occurrence?.packages || []
  if (packages.length === 0) return null

  const requestedSelection = searchParams.get('package_selection')
  const requestedStableKey = searchParams.get('package_key')
  const requestedPackageId = searchParams.get('package')
  const requestedFamilyKey = searchParams.get('package_family')
  const requestedVariantKey = searchParams.get('package_variant') || searchParams.get('package_variant_key')

  if (requestedSelection) {
    const matchingPackage = packages.find((pkg) => getPackageSelectionValue(pkg) === String(requestedSelection))
    if (matchingPackage) return matchingPackage
  }

  if (requestedStableKey) {
    const matchingPackage = findPackageByStableKey(packages, requestedStableKey)
    if (matchingPackage) return matchingPackage
  }

  if (requestedFamilyKey && requestedVariantKey) {
    const matchingPackage = packages.find((pkg) => String(pkg?.familyKey ?? '') === String(requestedFamilyKey)
      && String(pkg?.variantKey ?? 'default') === String(requestedVariantKey))
    if (matchingPackage) return matchingPackage
  }

  if (requestedPackageId && requestedFamilyKey) {
    const matchingPackage = packages.find((pkg) => String(pkg?.eventPackageId ?? pkg?.id ?? '') === String(requestedPackageId)
      && String(pkg?.familyKey ?? '') === String(requestedFamilyKey))
    if (matchingPackage) return matchingPackage
  }

  if (requestedPackageId) {
    const matchingPackage = packages.find((pkg) => String(pkg?.eventPackageId ?? pkg?.id ?? '') === String(requestedPackageId))
    if (matchingPackage) return matchingPackage
  }

  return null
}

const resolveSelection = (event, searchParams, fallbackSelection = emptySelection) => {
  const occurrences = event?.occurrences || []
  if (occurrences.length === 0) return emptySelection

  const fallbackOccurrence = occurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(fallbackSelection?.occurrenceDate)) || null
  const nextOccurrence = findOccurrenceFromSearchParams(occurrences, searchParams) || fallbackOccurrence || selectDefaultOccurrence(event)

  if (!nextOccurrence) return emptySelection

  const requestedPackage = findPackageFromSearchParams(nextOccurrence, searchParams)
  const nextPackage = requestedPackage
    ? resolvePreferredPackage(nextOccurrence, getStablePackageValue(requestedPackage))
    : resolvePreferredPackage(nextOccurrence, fallbackSelection?.packageStableKey)

  return {
    occurrenceDate: getOccurrenceSelectionValue(nextOccurrence),
    packageStableKey: getStablePackageValue(nextPackage),
  }
}

const EventDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { data: event, loading, error, retry } = useEventDetailCatalog(id)
  const [selection, setSelection] = useState(emptySelection)
  const [guestCount, setGuestCount] = useState(2)
  const searchParamsString = searchParams.toString()
  const requestedTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'overview')
  const [showDatePrompt, setShowDatePrompt] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [reviews, setReviews] = useState(baseReviews)
  const cartTimeoutRef = useRef(null)
  const lastAuthoredSearchRef = useRef(null)
  const [hydratedSearchKey, setHydratedSearchKey] = useState('')

  useEffect(() => {
    setActiveTab(tabs.some((tab) => tab.id === requestedTab) ? requestedTab : 'overview')
  }, [requestedTab])

  useEffect(() => {
    setHydratedSearchKey('')

    if (!event) {
      setSelection(emptySelection)
      return
    }

    if (lastAuthoredSearchRef.current === searchParamsString) {
      setHydratedSearchKey(searchParamsString)
      return
    }

    setSelection((current) => {
      const nextSelection = resolveSelection(event, searchParams, current)
      if (current.occurrenceDate === nextSelection.occurrenceDate && current.packageStableKey === nextSelection.packageStableKey) {
        return current
      }
      return nextSelection
    })

    setReviews((current) => {
      const nextReviews = baseReviews.map((review, index) => ({ ...review, id: `${event.id}-${index + 1}` }))
      return JSON.stringify(current) === JSON.stringify(nextReviews) ? current : nextReviews
    })
    setShowDatePrompt(false)
    setHydratedSearchKey(searchParamsString)
  }, [event, searchParams, searchParamsString])

  const selectedOccurrence = useMemo(
    () => event?.occurrences?.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(selection.occurrenceDate)) || null,
    [event, selection.occurrenceDate]
  )
  const selectedPkg = useMemo(
    () => resolvePreferredPackage(selectedOccurrence, selection.packageStableKey),
    [selectedOccurrence, selection.packageStableKey]
  )

  const selectOccurrence = (occurrence, { nextTab = null } = {}) => {
    const nextOccurrence = occurrence || null

    setSelection((current) => {
      const nextPackage = resolvePreferredPackage(nextOccurrence, current.packageStableKey)

      return {
        occurrenceDate: getOccurrenceSelectionValue(nextOccurrence),
        packageStableKey: getStablePackageValue(nextPackage),
      }
    })
    setShowDatePrompt(false)

    if (nextTab) setActiveTab(nextTab)
  }

  const handlePackageSelectionChange = (packageSelectionValue) => {
    const nextPackage = selectedOccurrence?.packages?.find((pkg) => getPackageSelectionValue(pkg) === String(packageSelectionValue)) || null

    setSelection((current) => ({
      ...current,
      packageStableKey: getStablePackageValue(nextPackage),
    }))
  }

  useEffect(() => {
    if (!event || hydratedSearchKey !== searchParamsString) return

    const currentParams = new URLSearchParams(window.location.search)
    const nextParams = new URLSearchParams(currentParams)

    if (activeTab && activeTab !== 'overview') nextParams.set('tab', activeTab)
    else nextParams.delete('tab')

    if (selectedOccurrence) {
      nextParams.set('occurrence_date', getOccurrenceSelectionValue(selectedOccurrence))
    } else {
      nextParams.delete('occurrence_date')
    }

    nextParams.delete('occurrence')

    if (selectedPkg) {
      nextParams.set('package', String(selectedPkg.eventPackageId ?? selectedPkg.id ?? ''))
      nextParams.set('package_selection', getPackageSelectionValue(selectedPkg))
      nextParams.set('package_key', getStablePackageValue(selectedPkg))
      if (selectedPkg.familyKey) nextParams.set('package_family', String(selectedPkg.familyKey))
      else nextParams.delete('package_family')
      if (selectedPkg.variantKey) nextParams.set('package_variant', String(selectedPkg.variantKey))
      else nextParams.delete('package_variant')
    } else {
      nextParams.delete('package')
      nextParams.delete('package_selection')
      nextParams.delete('package_variant')
      nextParams.delete('package_family')
      nextParams.delete('package_key')
    }

    nextParams.delete('date')
    nextParams.delete('event_package_id')
    nextParams.delete('package_id')
    nextParams.delete('package_variant_key')
    nextParams.delete('package_family_key')
    nextParams.delete('selection')
    nextParams.delete('audience')

    const nextSearchString = nextParams.toString()
    const currentSearchString = currentParams.toString()

    if (nextSearchString !== currentSearchString) {
      lastAuthoredSearchRef.current = nextSearchString
      setSearchParams(nextParams, { replace: true })
      return
    }

    lastAuthoredSearchRef.current = nextSearchString
  }, [activeTab, event, hydratedSearchKey, searchParamsString, selectedOccurrence, selectedPkg, setSearchParams])

  useEffect(() => () => window.clearTimeout(cartTimeoutRef.current), [])

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading event...</div>
  if (error?.status === 404) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Event not found</h1><Link to="/events" className="text-brand-purple">Back to Events</Link></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Couldn't load event</h1><p className="text-gray-600 mb-4">{error.message}</p><button onClick={retry} className="text-brand-purple">Try again</button></div></div>
  if (!event) return null

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-6">
        <Link to="/events" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeft className="w-5 h-5" /><span className="font-medium">Back to Events</span></Link>
      </div>
      <EventGallery event={event} />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <EventHeader event={event} />
            <DetailTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="space-y-8">
              {activeTab === 'overview' && <EventOverview event={event} />}
              {activeTab === 'availability' && (
                <EventAvailability
                  event={event}
                  selectedOccurrenceDate={selection.occurrenceDate}
                  onSelectOccurrence={(occurrence) => selectOccurrence(occurrence, { nextTab: 'packages' })}
                />
              )}
              {activeTab === 'venue' && <EventVenue event={event} />}
              {activeTab === 'packages' && (
                <EventPackages
                  occurrence={selectedOccurrence}
                  selectedPackageId={getPackageSelectionValue(selectedPkg)}
                  showDatePrompt={showDatePrompt}
                  onSelectPackage={(pkg) => {
                    if (!selectedOccurrence?.isBookable) {
                      setShowDatePrompt(true)
                      return
                    }

                    setSelection((current) => ({
                      ...current,
                      packageStableKey: getStablePackageValue(pkg),
                    }))
                    setShowDatePrompt(false)
                  }}
                />
              )}
              {activeTab === 'reviews' && <EventReviews reviews={reviews} userRating={userRating} setUserRating={setUserRating} userComment={userComment} setUserComment={setUserComment} isAuthenticated={isAuthenticated} handleReviewSubmit={() => { if (!userRating || !userComment.trim()) return; setReviews([{ id: Date.now(), name: user?.name || 'Anonymous', rating: userRating, date: 'Just now', comment: userComment.trim() }, ...reviews]); setUserRating(0); setUserComment('') }} />}
            </div>
          </div>
          <div className="lg:col-span-1"><EventSidebar event={event} occurrences={event.occurrences} selectedOccurrenceDate={selection.occurrenceDate} setSelectedOccurrenceDate={(value) => {
            const nextOccurrence = event.occurrences.find((occurrence) => getOccurrenceSelectionValue(occurrence) === String(value)) || null
            selectOccurrence(nextOccurrence)
          }} selectedPackage={selectedPkg} selectedPackageId={getPackageSelectionValue(selectedPkg)} setSelectedPackageId={handlePackageSelectionChange} guestCount={guestCount} setGuestCount={setGuestCount} addToCart={async (payload) => { try { await addToCart(payload); setCartAdded(true); window.clearTimeout(cartTimeoutRef.current); cartTimeoutRef.current = window.setTimeout(() => setCartAdded(false), 2000) } catch (cartError) { if (cartError?.status === 401) { navigate(`/auth?redirect=${encodeURIComponent('/cart')}`); return } throw cartError } }} navigate={navigate} cartAdded={cartAdded} /></div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage
