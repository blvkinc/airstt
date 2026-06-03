import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckCircle2, Receipt, Ticket } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'
import { fetchCustomerOrder } from '../shared/api/customerCheckoutApi'

const statusLabel = (value) => String(value || 'pending').replace(/_/g, ' ')

const BookingConfirmationPage = () => {
  const { orderId } = useParams()
  const { isAuthenticated } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !orderId) return

    const controller = new AbortController()

    const loadOrder = async () => {
      setLoading(true)
      try {
        const payload = await fetchCustomerOrder({ orderId, signal: controller.signal })
        setOrder(payload)
        setError('')
      } catch (nextError) {
        if (nextError?.name === 'AbortError') return
        setError(nextError?.message || 'Unable to load your confirmation right now.')
      } finally {
        setLoading(false)
      }
    }

    loadOrder()

    return () => controller.abort()
  }, [isAuthenticated, orderId])

  const pendingPayment = useMemo(() => order?.payment?.status === 'pending' || order?.status === 'payment_pending', [order])

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading confirmation...</div>
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 md:px-8 pt-24 pb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Couldn't load your confirmation</h1>
          <p className="text-gray-600 mb-6">{error || 'We could not find that order.'}</p>
          <Link to="/profile" className="inline-flex items-center rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white">
            Go to Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-24 pb-12">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10 mb-8">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-10 h-10 text-green-600 flex-shrink-0" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order received</h1>
              <p className="text-gray-600">Your booking request has been saved to your order.</p>
              <div className="mt-4 text-sm text-gray-500 space-y-1">
                <div>Order ID: <span className="font-medium text-gray-900">{order.id}</span></div>
                <div>Order number: <span className="font-medium text-gray-900">{order.orderNumber || 'Pending assignment'}</span></div>
                <div>Status: <span className="font-medium text-gray-900 capitalize">{statusLabel(order.status)}</span></div>
              </div>
            </div>
          </div>

          {pendingPayment && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Payment is still pending for this order. Continue to payment when prompted.
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {order.bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{booking.event}</h2>
                    <p className="text-sm text-gray-500">{booking.venue}</p>
                  </div>
                  <div className="text-sm text-gray-500 capitalize">{statusLabel(booking.status)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <div className="font-medium text-gray-900">Date</div>
                    <div>{booking.date || 'TBD'}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Package</div>
                    <div>{[booking.packageName, booking.packageVariantLabel].filter(Boolean).join(' • ') || 'Package'}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Guests</div>
                    <div>{booking.guests}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {booking.items.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-gray-100 px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-gray-900">{[item.packageName, item.packageVariantLabel].filter(Boolean).join(' • ')}</div>
                        <div className="text-sm text-gray-500">{item.guests} guests, {statusLabel(item.paymentMode)}</div>
                        {item.packageType && <div className="text-xs text-gray-500">{statusLabel(item.packageType)}</div>}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">AED {item.lineTotal}</div>
                        {item.eTicket?.download_url && (
                          <a href={item.eTicket.download_url} className="text-sm text-gray-600 inline-flex items-center gap-1">
                            <Ticket className="w-4 h-4" /> View e-ticket
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between"><span>Gross total</span><span className="font-medium">AED {order.grossTotal}</span></div>
                <div className="flex justify-between"><span>Due now</span><span className="font-medium">AED {order.onlineDueTotal}</span></div>
                <div className="flex justify-between"><span>Pay at venue</span><span className="font-medium">AED {order.offlineDueTotal}</span></div>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                <Link to="/profile" className="w-full inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white">View my bookings</Link>
                <Link to="/events" className="w-full inline-flex items-center justify-center rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-900">Browse more events</Link>
                {order.bookings.some((booking) => booking.receiptArtifact?.download_url) && (
                  <a href={order.bookings.find((booking) => booking.receiptArtifact?.download_url)?.receiptArtifact?.download_url} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-900">
                    <Receipt className="w-4 h-4" /> View receipt
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationPage
