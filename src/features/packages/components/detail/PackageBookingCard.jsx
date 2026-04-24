import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../../../../shared/ui/badge'
import { Button } from '../../../../shared/ui/button'
import { Card, CardContent } from '../../../../shared/ui/card'

export function PackageBookingCard({
  packageData,
  selectedDate,
  guestCount,
  onSelectDate,
  onDecrementGuests,
  onIncrementGuests,
  onReserve
}) {
  const totalPrice = packageData.price * guestCount
  const savings = (packageData.originalPrice - packageData.price) * guestCount

  return (
    <>
      <Card className="rounded-2xl shadow-xl border-0 overflow-hidden ring-1 ring-black/5">
        <CardContent className="p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">AED {packageData.price}</span>
                {packageData.originalPrice > packageData.price && (
                  <span className="text-lg text-gray-400 line-through">AED {packageData.originalPrice}</span>
                )}
              </div>
              <span className="text-gray-500 text-sm">per person</span>
            </div>
            {savings > 0 && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                Save AED {savings / guestCount}
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Date</label>
              <div className="relative">
                <select
                  value={selectedDate}
                  onChange={(event) => onSelectDate(event.target.value)}
                  className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select a date</option>
                  {packageData.availableDates.map((date) => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
                <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Guests</label>
              <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-white">
                <button onClick={onDecrementGuests} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  -
                </button>
                <span className="font-medium">{guestCount} guests</span>
                <button onClick={onIncrementGuests} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                  +
                </button>
              </div>
            </div>

            {selectedDate && (
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>AED {packageData.price} x {guestCount}</span>
                  <span>AED {totalPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>AED {totalPrice}</span>
                </div>
              </div>
            )}

            <Button
              size="lg"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-purple to-brand-orange text-white font-semibold text-lg shadow-lg hover:opacity-90"
              onClick={onReserve}
              disabled={!selectedDate}
            >
              Reserve Package
            </Button>

            <p className="text-center text-xs text-gray-500 mt-4">
              You won&apos;t be charged yet
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <Link to={`/venues/${packageData.venueId}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 underline">
          View Venue Details
        </Link>
      </div>
    </>
  )
}
