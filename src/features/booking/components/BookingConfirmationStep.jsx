import React from 'react'
import { Check } from 'lucide-react'

const BookingConfirmationStep = ({ firstName, email }) => (
  <div className="text-center py-8 animate-in zoom-in-95 duration-500">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <Check strokeWidth={2} className="w-10 h-10 text-green-600" />
    </div>
    <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
    <p className="text-gray-500 mb-8">Thank you, {firstName}. Your reservation is set.</p>

    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto mb-8">
      <div className="flex justify-between">
        <span className="text-gray-500 text-sm">Booking Ref</span>
        <span className="font-mono font-medium text-gray-900">STT-{Math.floor(Math.random() * 100000)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500 text-sm">Date sent to</span>
        <span className="font-medium text-gray-900">{email}</span>
      </div>
    </div>

    <p className="text-sm text-gray-400">Redirecting to profile...</p>
  </div>
)

export default BookingConfirmationStep
