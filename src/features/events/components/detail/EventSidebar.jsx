import { useState } from 'react'
import { Calendar, ChevronDown, MapPin, Sparkles, Star } from 'lucide-react'
import { Button } from '../../../../shared/ui/button'
import { Card, CardContent } from '../../../../shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/ui/select'
import { EventAvailabilityCompactCalendar } from './EventAvailabilityCalendar'

const getGuestCountLabel = (pkg) => {
  const guestCount = Number(pkg?.guestCount ?? pkg?.maxGuests)
  if (Number.isNaN(guestCount) || guestCount <= 0) return null
  return guestCount === 1 ? '1' : `Up to ${guestCount}`
}

const getAvailabilityMetadataValue = (pkg) => {
  if (pkg?.availabilityLabel) return pkg.availabilityLabel
  if (String(pkg?.cardStatusLabel || '').trim().toLowerCase() === 'sold out') return 'Sold out'
  if (pkg?.cardStatusLabel) return pkg.cardStatusLabel
  return null
}

const getSelectedPackageMetadata = (pkg) => ([
  getGuestCountLabel(pkg) ? { label: 'Guests', value: getGuestCountLabel(pkg) } : null,
  pkg?.variantLabel ? { label: 'Audience', value: pkg.variantLabel } : null,
  pkg?.packageTypeLabel ? { label: 'Type', value: pkg.packageTypeLabel } : null,
  getAvailabilityMetadataValue(pkg) ? { label: 'Availability', value: getAvailabilityMetadataValue(pkg) } : null,
].filter(Boolean))

const getVenueLocationSummary = (event) => [event?.venueDetails?.address, event?.venueDetails?.area, event?.location].filter(Boolean)

const formatMoney = (value, currency = 'AED') => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null
  return `${currency} ${Number(value).toFixed(2)}`
}

const getPaymentSummaryHelper = (paymentMode) => {
  if (paymentMode === 'deposit') return 'Pay part now and the remaining amount later.'
  if (paymentMode === 'no_upfront') return 'Nothing is charged today.'
  return 'Pay the full amount today.'
}

const getRemainingAmount = (pricingSummary) => pricingSummary?.remaining_balance_amount ?? pricingSummary?.due_later ?? null

export function EventSidebar({
  event,
  occurrences,
  selectedOccurrenceDate,
  setSelectedOccurrenceDate,
  selectedPackage,
  selectedPackageId,
  setSelectedPackageId,
  quantity,
  setQuantity,
  pricingRefreshPending,
  pricingRefreshError,
  pricingRefreshStatus,
  canBookSelectedPackage,
  addToCart,
  navigate,
  cartAdded,
}) {
  const selectedOccurrence = occurrences.find((occurrence) => String(occurrence.slotKey || occurrence.occurrenceDate || occurrence.date) === String(selectedOccurrenceDate)) || null
  const availablePackages = selectedOccurrence?.packages || []
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(!selectedOccurrenceDate)
  const venueLocationSummary = getVenueLocationSummary(event)
  const pricingSummary = selectedPackage?.pricingSummary
  const hasAuthoritativePricing = Boolean(pricingSummary) && !pricingRefreshPending
  const paymentMode = hasAuthoritativePricing ? (pricingSummary?.payment_mode ?? selectedPackage?.paymentMode ?? 'full') : null
  const fullAmount = hasAuthoritativePricing
    ? formatMoney(pricingSummary?.line_total, pricingSummary?.currency ?? selectedPackage?.currency)
    : null
  const dueNow = hasAuthoritativePricing
    ? formatMoney(pricingSummary?.due_now, pricingSummary?.currency ?? selectedPackage?.currency)
    : null
  const remainingAmountValue = hasAuthoritativePricing ? getRemainingAmount(pricingSummary) : null
  const remainingAmount = hasAuthoritativePricing
    ? formatMoney(remainingAmountValue, pricingSummary?.currency ?? selectedPackage?.currency)
    : null
  const actionsDisabled = !canBookSelectedPackage

  return (
    <div className="sticky top-28 space-y-4">
      <Card className="overflow-hidden rounded-2xl border-0 shadow-xl ring-1 ring-black/5">
        <CardContent className="p-6">
          <div className="mb-6 space-y-3" id="date-selection">
            <div className="rounded-2xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white p-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 text-left"
                onClick={() => setIsDatePickerOpen((current) => !current)}
                aria-expanded={isDatePickerOpen}
                aria-controls="sidebar-date-picker"
              >
                <div className="min-w-0">
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Select date</label>
                  <p className="text-sm leading-6 text-gray-500">
                    {selectedOccurrence
                      ? `${selectedOccurrence.date}${selectedOccurrence.time ? ` • ${selectedOccurrence.time}` : ''}`
                      : 'Choose a published date to unlock packages.'}
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-gray-200 bg-white text-gray-500">
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {isDatePickerOpen && (
                <div id="sidebar-date-picker" className="mt-4 border-t border-gray-100 pt-4">
                  <EventAvailabilityCompactCalendar
                    occurrences={occurrences}
                    selectedOccurrenceDate={selectedOccurrenceDate}
                    onSelectOccurrence={(occurrence) => setSelectedOccurrenceDate(String(occurrence.slotKey || occurrence.occurrenceDate || occurrence.date))}
                  />
                </div>
              )}
            </div>
          </div>

          {!selectedOccurrence ? (
            <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-6 text-center">
              <Calendar className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">Please select a published, bookable date to view packages.</p>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-700">Select package</label>
                <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-gray-200">
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePackages.map((pkg) => {
                      const packageSelectionValue = String(pkg.selectionKey ?? pkg.occurrencePackageId ?? pkg.id)
                      const packageLabel = [pkg.displayName || pkg.name, pkg.variantLabel, pkg.packageTypeLabel].filter(Boolean).join(' • ')
                      const packageSuffix = !pkg.isBookable && pkg.cardStatusLabel ? `(${pkg.cardStatusLabel})` : ''

                      return (
                        <SelectItem key={packageSelectionValue} value={packageSelectionValue} disabled={!pkg.isBookable}>
                          {[packageLabel, packageSuffix].filter(Boolean).join(' ')}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {!selectedPackage ? (
                <div className="mb-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-4 text-center">
                  <Sparkles className="mx-auto mb-2 h-6 w-6 text-orange-500" />
                  <p className="text-sm font-medium text-orange-800">Select a bookable package above to continue.</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{selectedPackage.displayName || selectedPackage.name}</p>
                        {selectedPackage.description && <p className="mt-1 text-sm leading-6 text-gray-500">{selectedPackage.description}</p>}
                      </div>
                    </div>
                    {getSelectedPackageMetadata(selectedPackage).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                        {getSelectedPackageMetadata(selectedPackage).map((item) => (
                          <span key={item.label} className="rounded-full border border-gray-200 bg-white px-2.5 py-1">
                            <span className="font-semibold text-gray-700">{item.label}:</span>{' '}
                            <span>{item.value}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-6 flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{fullAmount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-current text-gray-900" />
                      <span className="font-semibold">{event.rating}</span>
                      <span className="text-gray-500 underline">({event.reviews || 0})</span>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-gray-200 p-3">
                    <label className="mb-1 block text-sm font-semibold text-gray-800">Quantity</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{quantity}</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-6 w-6 rounded-full border" aria-label="Decrease quantity">
                          -
                        </button>
                        <button type="button" onClick={() => setQuantity(quantity + 1)} className="h-6 w-6 rounded-full border" aria-label="Increase quantity">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Payment summary</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {pricingRefreshPending
                            ? 'Pricing is refreshing for your current selection.'
                            : getPaymentSummaryHelper(paymentMode)}
                        </p>
                      </div>
                      <span
                        className={`min-w-[92px] text-right text-xs font-medium text-gray-500 ${pricingRefreshPending ? 'visible' : 'invisible'}`}
                        aria-live="polite"
                      >
                        Updating price…
                      </span>
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex items-center justify-between gap-4">
                        <span>Full amount</span>
                        <span className="font-semibold text-gray-900">{fullAmount || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Due now</span>
                        <span className="font-semibold text-gray-900">{dueNow || '—'}</span>
                      </div>
                      {remainingAmount && Number(remainingAmountValue) > 0 && (
                        <div className="flex items-center justify-between gap-4">
                          <span>Remaining amount</span>
                          <span className="font-semibold text-gray-900">{remainingAmount}</span>
                        </div>
                      )}
                    </div>
                    {pricingRefreshError && (
                      <p className="mt-4 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-800">
                        {pricingRefreshStatus === 'stale'
                          ? 'We could not refresh the latest amount, so you are seeing the last available pricing.'
                          : 'We could not refresh the latest amount yet. Please try again.'}
                      </p>
                    )}
                  </div>

                  <Button
                    size="lg"
                    disabled={actionsDisabled}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-brand-purple to-brand-orange text-lg font-semibold shadow-lg hover:opacity-90 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-600"
                    onClick={() => {
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

                      navigate(`/booking/${event.id}?${bookingSearch.toString()}`)
                    }}
                  >
                    Reserve
                  </Button>
                  <Button
                    variant="outline"
                    className="mt-3 h-11 w-full rounded-xl border-gray-200"
                    disabled={actionsDisabled}
                    onClick={async () =>
                      addToCart({
                        eventId: event.id,
                        eventOccurrenceId: selectedOccurrence?.eventOccurrenceId,
                        slotKey: selectedOccurrence?.slotKey || selectedOccurrence?.occurrenceDate || selectedOccurrence?.date,
                        occurrenceDate: selectedOccurrence?.occurrenceDate || selectedOccurrence?.date,
                        eventTitle: event.title,
                        venue: event.venue,
                        date: selectedOccurrence?.date,
                        time: selectedOccurrence?.time,
                        packageId: selectedPackage?.eventPackageId || selectedPackage?.id,
                        packageSelection: selectedPackage?.selectionKey || selectedPackage?.occurrencePackageId || selectedPackage?.id || null,
                        packageName: selectedPackage?.displayName || selectedPackage?.name,
                        packageFamilyKey: selectedPackage?.familyKey || null,
                        packageVariantKey: selectedPackage?.variantKey || null,
                        packageVariantLabel: selectedPackage?.variantLabel || null,
                        packageTypeLabel: selectedPackage?.packageTypeLabel || null,
                        selectedVariant: selectedPackage?.selectedVariant || null,
                        inventoryLabel: selectedPackage?.inventoryLabel || null,
                        guests: quantity,
                        price: selectedPackage?.pricingSummary?.line_total ?? selectedPackage?.price,
                        image: event.images[0],
                        paymentMode: selectedPackage?.pricingSummary?.payment_mode || selectedPackage?.paymentMode || 'full',
                        depositAmount: selectedPackage?.pricingSummary?.deposit?.due_now || selectedPackage?.depositAmount || 0,
                      })
                    }
                  >
                    Add to Cart
                  </Button>
                  {cartAdded && <div className="mt-2 text-center text-xs text-green-600">Added to cart</div>}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <h2 className="text-base font-semibold text-gray-900">Location</h2>
          <div className="mt-3 flex items-start gap-3 text-sm text-gray-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
            <div>
              <p className="font-medium text-gray-900">{event.venueDetails?.name || event.venue}</p>
              <p className="mt-1 leading-6">{venueLocationSummary[0] || 'Location details will be shared once published.'}</p>
              {venueLocationSummary.length > 1 && <p className="mt-1 text-xs text-gray-500">{venueLocationSummary.slice(1).join(' • ')}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {event.dressCode && (
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <CardContent className="p-5">
            <h2 className="text-base font-semibold text-gray-900">Dress code</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{event.dressCode}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
