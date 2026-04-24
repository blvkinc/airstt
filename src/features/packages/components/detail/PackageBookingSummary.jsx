import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PackageBookingSummary({ event, selectedPackage }) {
  if (!selectedPackage) return null

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 sticky top-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-neutral-600">Package</span>
          <span className="font-medium">{selectedPackage.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">Date</span>
          <span className="font-medium">{event.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-600">Time</span>
          <span className="font-medium">{event.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Venue</span>
          <span className="font-medium text-gray-900">{event.venue}</span>
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-neutral-600">Price per person</span>
          <span className="font-medium">AED {selectedPackage.price}</span>
        </div>
        {selectedPackage.originalPrice > selectedPackage.price && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-AED {selectedPackage.originalPrice - selectedPackage.price}</span>
          </div>
        )}
      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-gray-900">Total</span>
        <span className="text-2xl font-bold text-primary-600">AED {selectedPackage.price}</span>
      </div>

      <Link
        to={`/events/${event.id}?tab=packages`}
        className="w-full btn-primary flex items-center justify-center space-x-2 mb-4"
      >
        <span>Choose date to continue</span>
        <ArrowRight className="w-5 h-5" />
      </Link>

      <p className="text-xs text-neutral-500 text-center">
        Free cancellation up to 24 hours before the event
      </p>
    </div>
  )
}
