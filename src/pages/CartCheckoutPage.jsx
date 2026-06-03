import React, { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'
import { useCart } from '../shared/context/CartContext'
import { submitCustomerCheckout } from '../shared/api/customerCheckoutApi'

const getQuantityLabel = (quantity) => `${quantity} package${quantity !== 1 ? 's' : ''}`

const CartCheckoutPage = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { items, reloadCart, summary } = useCart()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const profile = user?.profile || {}
  const accountContact = {
    name: user?.name || [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Not provided',
    email: user?.email || profile.email || 'Not provided',
    phone: user?.phone || profile.phone || 'Not provided',
  }

  const dueNowTotal = useMemo(() => summary.onlineDueAmount || 0, [summary.onlineDueAmount])

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitError('')
    setLoading(true)

    try {
      const payload = await submitCustomerCheckout()
      await reloadCart()

      if (payload?.checkoutSession?.url) {
        window.location.assign(payload.checkoutSession.url)
        return
      }

      navigate(`/orders/${payload.order.id}/confirmation`, {
        replace: true,
        state: {
          order: payload.order,
        },
      })
    } catch (error) {
      setSubmitError(error?.message || 'Unable to complete checkout right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout All</h1>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="mb-4">
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Account contact</h2>
                      <p className="mt-1 text-sm text-gray-600">Checkout uses the contact details already saved on your account. This flow does not submit contact edits yet.</p>
                    </div>

                    <dl className="grid grid-cols-1 gap-4 text-sm text-gray-700 md:grid-cols-2">
                      <div>
                        <dt className="font-semibold text-gray-500">Name</dt>
                        <dd className="mt-1 text-gray-900">{accountContact.name}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-500">Email</dt>
                        <dd className="mt-1 text-gray-900">{accountContact.email}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-gray-500">Phone</dt>
                        <dd className="mt-1 text-gray-900">{accountContact.phone}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex items-start gap-3">
                    <Shield strokeWidth={1.5} className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">Secure checkout</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Submitting creates an order from your current cart and opens payment when online payment is required.</p>
                    </div>
                  </div>

                  {submitError && <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>}

                  <div className="flex justify-end mt-8">
                    <button type="submit" disabled={loading} className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-70">
                      {loading ? 'Submitting order...' : dueNowTotal > 0 ? 'Place Order' : 'Confirm Reservation'}
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
                      <div className="text-gray-500">{[item.packageName, item.packageVariantLabel].filter(Boolean).join(' • ')} - {getQuantityLabel(item.quantity || 1)}</div>
                      <div className="text-gray-500">{item.date || item.occurrenceDate || 'Date pending'}</div>
                      <div className="text-gray-500 capitalize">Payment: {(item.paymentMode || 'full').replace('_', ' ')}</div>
                      {(item.packageTypeLabel || item.inventoryLabel) && (
                        <div className="text-gray-500">{[item.packageTypeLabel, item.inventoryLabel].filter(Boolean).join(' • ')}</div>
                      )}
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full amount</span>
                      <span className="font-medium">AED {summary.lineTotal || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due now</span>
                      <span className="font-medium">AED {dueNowTotal}</span>
                    </div>
                    {(summary.offlineDueAmount || 0) > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining amount</span>
                        <span className="font-medium">AED {summary.offlineDueAmount || 0}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">Totals are calculated from your current cart.</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">Checkout covers all items in your authenticated cart.</p>
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
