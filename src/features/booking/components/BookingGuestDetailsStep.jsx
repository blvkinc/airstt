import React from 'react'

const fieldClassName = 'w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none'

const BookingGuestDetailsStep = ({ formData, formErrors, onInputChange }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Guest Information</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">First Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={onInputChange} required className={fieldClassName} placeholder="John" />
        {formErrors.firstName && <p className="text-sm text-red-600">{formErrors.firstName}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={onInputChange} required className={fieldClassName} placeholder="Doe" />
        {formErrors.lastName && <p className="text-sm text-red-600">{formErrors.lastName}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={onInputChange} required className={fieldClassName} placeholder="john@example.com" />
        {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
        <input type="tel" name="phone" value={formData.phone} onChange={onInputChange} required className={fieldClassName} placeholder="+971 50 000 0000" />
        {formErrors.phone && <p className="text-sm text-red-600">{formErrors.phone}</p>}
      </div>
    </div>

    <div className="mb-8">
      <label className="text-sm font-semibold text-gray-700 mb-2 block">Special Requests (Optional)</label>
      <textarea name="specialRequests" value={formData.specialRequests} onChange={onInputChange} rows={3} className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none resize-none" placeholder="Allergies, dietary restrictions, or special occasions..." />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Hair & Makeup</label>
        <select name="hairAndMakeup" value={formData.hairAndMakeup} onChange={onInputChange} className={fieldClassName}>
          <option value="">No preference</option>
          <option value="none">Not required</option>
          <option value="basic">Basic touch-up</option>
          <option value="full">Full service</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
        <input type="text" name="additionalNotes" value={formData.additionalNotes} onChange={onInputChange} className={fieldClassName} placeholder="Any other notes for the venue" />
      </div>
    </div>
  </div>
)

export default BookingGuestDetailsStep
