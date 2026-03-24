import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CreditCard, Lock, Shield } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'
import { useBooking } from '../shared/context/BookingContext'
import { useCart } from '../shared/context/CartContext'

const CartCheckoutPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addBooking } = useBooking()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoError, setPromoError] = useState('')

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const handleInputChange = (e) => {
    let value = e.target.value
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19)
    }
    if (e.target.name === 'expiryDate') {
      value = value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4)
      }
      value = value.slice(0, 5)
    }
    setFormData({
      ...formData,
      [e.target.name]: value
    })
  }

  const serviceFee = 45
  const computeLineTotal = (item) => (item.price || 0) * (item.guests || 1)
  const computeDueNow = (item) => {
    const lineTotal = computeLineTotal(item)
    if (item.paymentMode === 'deposit') {
      return item.depositAmount || Math.round(lineTotal * 0.3)
    }
    if (item.paymentMode === 'no_upfront') {
      return 0
    }
    return lineTotal
  }
  const dueNowTotal = items.reduce((sum, item) => sum + computeDueNow(item), 0)
  const discountAmount = promoApplied
    ? promoApplied.type === 'percent'
      ? Math.round(dueNowTotal * promoApplied.value / 100)
      : promoApplied.value
    : 0
  const totalDueNow = Math.max(0, dueNowTotal - discountAmount) + serviceFee

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase()
    if (!code) {
      setPromoApplied(null)
      setPromoError('')
      return
    }
    if (code === 'WELCOME50') {
      setPromoApplied({ code, type: 'fixed', value: 50 })
      setPromoError('')
      return
    }
    if (code === 'STT10') {
      setPromoApplied({ code, type: 'percent', value: 10 })
      setPromoError('')
      return
    }
    setPromoApplied(null)
    setPromoError('Invalid promo code')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    items.forEach((item) => {
      addBooking({
        event: item.eventTitle,
        venue: item.venue,
        date: item.date,
        time: item.time,
        price: item.price,
        guests: item.guests,
        package: item.packageName,
        image: item.image,
        paymentMode: item.paymentMode || 'full',
        depositAmount: item.depositAmount || 0,
        promoCode: promoApplied?.code || '',
        discountAmount
      })
    })

    clearCart()
    setTimeout(() => {
      navigate('/profile')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout All</h1>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex items-start gap-3">
                    <Shield strokeWidth={1.5} className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Secure SSL Connection</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Your payment data is encrypted and secure.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="0000 0000 0000 0000"
                          className="w-full h-11 pl-12 pr-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none font-mono"
                        />
                        <CreditCard strokeWidth={1.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          required
                          placeholder="MM/YY"
                          className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none font-mono text-center"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">CVV</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            required
                            placeholder="123"
                            maxLength={4}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none font-mono text-center"
                          />
                          <Lock strokeWidth={1.5} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        </div>
                      </div>
                    </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      placeholder="JOHN DOE"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="text-sm font-semibold text-gray-700">Promo Code</label>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className="flex-1 h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="h-11 px-5 rounded-xl border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-xs text-green-600 mt-2">Applied {promoApplied.code}</p>
                  )}
                  {promoError && (
                    <p className="text-xs text-red-500 mt-2">{promoError}</p>
                  )}
                </div>

                  <div className="flex justify-end mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-70"
                    >
                      {loading ? 'Processing...' : `Pay AED ${totalDueNow}`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
  {items.map((item) => (
    <div key={item.id} className="text-sm">
      <div className="font-semibold text-gray-900">{item.eventTitle}</div>
      <div className="text-gray-500">{item.packageName} - {item.guests} guests</div>
      <div className="text-gray-500 capitalize">Payment: {(item.paymentMode || 'full').replace('_', ' ')}</div>
      <div className="text-gray-700 mt-1">Due now: AED {computeDueNow(item)}</div>
    </div>
  ))}
  <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-600">Due Now Subtotal</span>
      <span className="font-medium">AED {dueNowTotal}</span>
    </div>
    {promoApplied && (
      <div className="flex justify-between text-green-600">
        <span>Promo Discount</span>
        <span>- AED {discountAmount}</span>
      </div>
    )}
    <div className="flex justify-between">
      <span className="text-gray-600">Service Fee</span>
      <span className="font-medium">AED {serviceFee}</span>
    </div>
    <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
      <span>Total Due Now</span>
      <span>AED {totalDueNow}</span>
    </div>
  </div>
</div>
<div className="bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">Payment covers all items in your cart.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartCheckoutPage



