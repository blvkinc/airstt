import React from 'react'
import { Check } from 'lucide-react'

const steps = [
  { num: 1, label: 'Guest Details' },
  { num: 2, label: 'Payment' },
  { num: 3, label: 'Confirmation' }
]

const BookingProgressSteps = ({ step }) => (
  <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
    {steps.map((item) => (
      <div key={item.num} className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= item.num ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
          {step > item.num ? <Check strokeWidth={1.5} className="w-4 h-4" /> : item.num}
        </div>
        <span className={`text-sm font-medium ${step >= item.num ? 'text-gray-900' : 'text-gray-400'} hidden md:block`}>{item.label}</span>
        {item.num < 3 && <div className="w-12 h-[1px] bg-gray-200 mx-2 hidden md:block"></div>}
      </div>
    ))}
  </div>
)

export default BookingProgressSteps
