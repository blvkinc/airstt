import React from 'react'
import { Calendar, Package, Users } from 'lucide-react'

const BookingOrderSummary = ({ bookingData, pricing, promoApplied }) => {
  const { baseTotal, paymentMode, dueNow, discountAmount, serviceFee, totalDueNow } = pricing

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      <div className="aspect-video relative">
        <img src={bookingData.image} alt={bookingData.event} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-lg shadow-black/50 drop-shadow-md">{bookingData.event}</h3>
          <p className="text-white/90 text-sm flex items-center gap-1 drop-shadow-md"><Users className="w-3 h-3" /> {bookingData.venue}</p>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-3 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Calendar strokeWidth={1.5} className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Date & Time</p>
              <p className="font-semibold text-gray-900">{bookingData.date} • {bookingData.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Users strokeWidth={1.5} className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Guests</p>
              <p className="font-semibold text-gray-900">{bookingData.guests || 2} People</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
              <Package strokeWidth={1.5} className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium uppercase">Package</p>
              <p className="font-semibold text-gray-900">{bookingData.package}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">AED {baseTotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Mode</span>
            <span className="font-medium capitalize">{paymentMode.replace('_', ' ')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Due Now</span>
            <span className="font-medium">AED {dueNow}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Promo Discount</span>
              <span>- AED {discountAmount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Service Fee</span>
            <span className="font-medium">AED {serviceFee}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t border-gray-100">
            <span>Total Due Now</span>
            <span>AED {totalDueNow}</span>
          </div>
          {paymentMode !== 'full' && (
            <div className="flex justify-between text-sm text-gray-500">
              <span>Remaining Balance</span>
              <span>AED {Math.max(0, baseTotal - dueNow)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-50 p-4 text-center">
        <p className="text-xs text-gray-500">Free cancellation up to 24h before event</p>
      </div>
    </div>
  )
}

export default BookingOrderSummary
