import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'

const BookingPage = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/cart/checkout" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 md:px-8 pt-24 pb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Checkout now starts from your cart</h1>
        <p className="text-gray-600 mb-6">This direct booking route now points shoppers back to the cart-based checkout flow.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link to={`/events/${id}?tab=packages`} className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to event
          </Link>
          <Link to="/auth?redirect=%2Fcart%2Fcheckout" className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-900">
            Sign in to continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
