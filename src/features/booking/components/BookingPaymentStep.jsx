import React from 'react'
import { CreditCard, Lock, Shield } from 'lucide-react'

const BookingPaymentStep = ({ formData, formErrors, promoCode, promoApplied, promoError, onInputChange, onPromoCodeChange, onApplyPromo }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
      <div className="flex gap-2">
        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">VISA</div>
        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">MC</div>
        <div className="h-6 w-10 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold text-gray-500">AMEX</div>
      </div>
    </div>

    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex items-start gap-3">
      <Shield strokeWidth={1.5} className="w-5 h-5 text-green-600 mt-0.5" />
      <div>
        <h4 className="text-sm font-semibold text-gray-900">Secure SSL Connection</h4>
        <p className="text-xs text-gray-500 mt-0.5">Your financial data is encrypted and secure.</p>
      </div>
    </div>

    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Card Number</label>
        <div className="relative">
          <input type="text" name="cardNumber" value={formData.cardNumber} onChange={onInputChange} required placeholder="0000 0000 0000 0000" className="w-full h-11 pl-12 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none font-mono" />
          <CreditCard strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        {formErrors.cardNumber && <p className="text-sm text-red-600">{formErrors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
          <input type="text" name="expiryDate" value={formData.expiryDate} onChange={onInputChange} required placeholder="MM/YY" className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none font-mono text-center" />
          {formErrors.expiryDate && <p className="text-sm text-red-600">{formErrors.expiryDate}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">CVV</label>
          <div className="relative">
            <input type="text" name="cvv" value={formData.cvv} onChange={onInputChange} required placeholder="123" maxLength={4} className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none font-mono text-center" />
            <Lock strokeWidth={1.5} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          {formErrors.cvv && <p className="text-sm text-red-600">{formErrors.cvv}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">Cardholder Name</label>
        <input type="text" name="cardName" value={formData.cardName} onChange={onInputChange} required placeholder="JOHN DOE" className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none uppercase" />
        {formErrors.cardName && <p className="text-sm text-red-600">{formErrors.cardName}</p>}
      </div>
    </div>

    <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <label className="text-sm font-semibold text-gray-700">Promo Code</label>
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <input type="text" name="promoCode" value={promoCode} onChange={onPromoCodeChange} placeholder="Enter code" className="flex-1 h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none uppercase" />
        <button type="button" onClick={onApplyPromo} className="h-11 px-5 rounded-xl border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all">
          Apply
        </button>
      </div>
      {promoApplied && <p className="text-xs text-green-600 mt-2">Applied {promoApplied.code}</p>}
      {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
    </div>
  </div>
)

export default BookingPaymentStep
