import { useState } from 'react'
import { Calendar, ChevronDown, Sparkles, Star } from 'lucide-react'
import { Button } from '../../../../shared/ui/button'
import { Card, CardContent } from '../../../../shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../shared/ui/select'
import { EventAvailabilityCompactCalendar } from './EventAvailabilityCalendar'

export function EventSidebar({
  event,
  occurrences,
  selectedOccurrenceDate,
  setSelectedOccurrenceDate,
  selectedPackage,
  selectedPackageId,
  setSelectedPackageId,
  guestCount,
  setGuestCount,
  addToCart,
  navigate,
  cartAdded,
}) {
  const selectedOccurrence = occurrences.find((occurrence) => String(occurrence.occurrenceDate || occurrence.date) === String(selectedOccurrenceDate)) || null
  const availablePackages = selectedOccurrence?.packages || []
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(!selectedOccurrenceDate)

  return (
    <div className="sticky top-28">
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
                  <label className="mb-1 block text-sm font-semibold text-gray-700">Select Date</label>
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
                    onSelectOccurrence={(occurrence) => setSelectedOccurrenceDate(String(occurrence.occurrenceDate || occurrence.date))}
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
                <label className="mb-2 block text-sm font-semibold text-gray-700">Select Package</label>
                <Select value={selectedPackageId} onValueChange={setSelectedPackageId}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-gray-200">
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePackages.map((pkg) => {
                      const packageSelectionValue = String(pkg.selectionKey ?? pkg.occurrencePackageId ?? pkg.id)

                      return (
                        <SelectItem key={packageSelectionValue} value={packageSelectionValue} disabled={!pkg.isBookable}>
                          {[pkg.displayName || pkg.name, pkg.variantLabel, pkg.packageTypeLabel].filter(Boolean).join(' • ')} {!pkg.isBookable ? `(${pkg.statusLabel})` : ''}
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
                  <div className="mb-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    <div>
                      Status: <span className="font-semibold text-gray-900">{selectedPackage.statusLabel}</span>
                    </div>
                    {(selectedPackage.variantLabel || selectedPackage.packageTypeLabel || selectedPackage.inventoryLabel) && (
                      <div className="mt-1 text-xs text-gray-500">
                        {[selectedPackage.variantLabel, selectedPackage.packageTypeLabel, selectedPackage.inventoryLabel].filter(Boolean).join(' • ')}
                      </div>
                    )}
                  </div>

                  <div className="mb-6 flex items-end justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">AED {selectedPackage?.price}</span>
                      <span className="text-sm text-gray-500"> / person</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-current text-gray-900" />
                      <span className="font-semibold">{event.rating}</span>
                      <span className="text-gray-500 underline">({event.reviews || 0})</span>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl border border-gray-200 p-3">
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-800">Guests</label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{guestCount} guests</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="h-6 w-6 rounded-full border">
                          -
                        </button>
                        <button type="button" onClick={() => setGuestCount(guestCount + 1)} className="h-6 w-6 rounded-full border">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    disabled={!selectedPackage.isBookable}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-brand-purple to-brand-orange text-lg font-semibold shadow-lg hover:opacity-90 disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-600"
                    onClick={() => {
                      const bookingSearch = new URLSearchParams({
                        occurrence_date: String(selectedOccurrence?.occurrenceDate || selectedOccurrence?.date || ''),
                        occurrence: String(selectedOccurrence?.eventOccurrenceId || ''),
                        package: String(selectedPackage?.eventPackageId || selectedPackage?.id || ''),
                        package_selection: String(selectedPackage?.selectionKey || selectedPackage?.occurrencePackageId || selectedPackage?.id || ''),
                        guests: String(guestCount),
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
                    disabled={!selectedPackage.isBookable}
                    onClick={async () =>
                      addToCart({
                        eventId: event.id,
                        eventOccurrenceId: selectedOccurrence?.eventOccurrenceId,
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
                        guests: guestCount,
                        price: selectedPackage?.price,
                        image: event.images[0],
                        paymentMode: selectedPackage?.paymentMode || 'full',
                        depositAmount: selectedPackage?.depositAmount || 0,
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
    </div>
  )
}
