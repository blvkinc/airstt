
import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CreditCard, Shield, Check, Lock, Calendar, Users, Package } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'
import { useBooking } from '../shared/context/BookingContext'

const BookingPage = () => {
  const { id } = useParams()
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const { addBooking } = useBooking()

  // Use passed state or fallback to mock
  const bookingData = location.state || {
    event: "Luxury Brunch at Burj Al Arab",
    venue: "Al Muntaha Restaurant",
    date: "2024-12-15",
    time: "11:00 AM - 3:00 PM",
    package: "Couple Package",
    guests: 2,
    price: 549,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    paymentMode: 'full',
    depositAmount: 0
  }

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialRequests: '',
    hairAndMakeup: '',
    additionalNotes: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  })
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(null)
  const [promoError, setPromoError] = useState('')

  const baseTotal = (bookingData.price || 0) * (bookingData.guests || 2)
  const paymentMode = bookingData.paymentMode || 'full'
  const depositAmount = bookingData.depositAmount || Math.round(baseTotal * 0.3)
  const dueNow = paymentMode === 'full' ? baseTotal : paymentMode === 'deposit' ? depositAmount : 0
  const discountAmount = promoApplied
    ? promoApplied.type === 'percent'
      ? Math.round(dueNow * promoApplied.value / 100)
      : promoApplied.value
    : 0
  const serviceFee = 45
  const totalDueNow = Math.max(0, dueNow - discountAmount) + serviceFee

  // Redirect to auth if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      window.scrollTo(0, 0)
    } else if (step === 2) {
      setStep(3)
      window.scrollTo(0, 0)
      
      // Process booking
      addBooking({
        ...bookingData,
        ...formData,
        paymentMode,
        depositAmount,
        promoCode: promoApplied?.code || '',
        discountAmount
      })

      // Simulate API call
      setTimeout(() => {
        navigate('/profile')
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/events/${id}`} className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft strokeWidth={1.5} className="w-5 h-5" />
            <span className="font-medium">Back to Event Details</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">

            {/* Progress Steps */}
            <div className="mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              {[
                { num: 1, label: 'Guest Details' },
                { num: 2, label: 'Payment' },
                { num: 3, label: 'Confirmation' }
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s.num ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                    {step > s.num ? <Check strokeWidth={1.5} className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-sm font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'} hidden md:block`}>{s.label}</span>
                  {s.num < 3 && <div className="w-12 h-[1px] bg-gray-200 mx-2 hidden md:block"></div>}
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Guest Information</h2>

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
                            placeholder="John"
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
                            placeholder="Doe"
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
                            placeholder="john@example.com"
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
                            placeholder="+971 50 000 0000"
                          />
                        </div>
                      </div>

                      <div className="mb-8">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Special Requests (Optional)</label>
                        <textarea
                          name="specialRequests"
                          value={formData.specialRequests}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none resize-none"
                          placeholder="Allergies, dietary restrictions, or special occasions..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Hair & Makeup</label>
                          <select
                            name="hairAndMakeup"
                            value={formData.hairAndMakeup}
                            onChange={handleInputChange}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none"
                          >
                            <option value="">No preference</option>
                            <option value="none">Not required</option>
                            <option value="basic">Basic touch-up</option>
                            <option value="full">Full service</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                          <input
                            type="text"
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all outline-none"
                            placeholder="Any other notes for the venue"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
                        <div className="flex gap-2">
                          {/* Payment Icons */}
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
                          name="promoCode"
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
                  </div>
                )}

                  {step === 3 && (
                    <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check strokeWidth={2} className="w-10 h-10 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                      <p className="text-gray-500 mb-8">Thank you, {formData.firstName}. Your reservation is set.</p>

                      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto mb-8">
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">Booking Ref</span>
                          <span className="font-mono font-medium text-gray-900">STT-{Math.floor(Math.random() * 100000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 text-sm">Date sent to</span>
                          <span className="font-medium text-gray-900">{formData.email}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-400">Redirecting to profile...</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
                    {step > 1 && step < 3 && (
                      <button
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    {step < 3 && (
                      <button
                        type="submit"
                        className="ml-auto px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                      >
                        {step === 2 ? (
                          <>
                            <Lock strokeWidth={1.5} className="w-4 h-4" /> {paymentMode === 'no_upfront' ? 'Confirm Reservation' : `Pay AED ${totalDueNow}`}
                          </>
                        ) : (
                          <>
                            Continue <ArrowLeft strokeWidth={1.5} className="w-4 h-4 rotate-180" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={bookingData.image}
                    alt={bookingData.event}
                    className="w-full h-full object-cover"
                  />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage



