import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Loader2, RefreshCw, XCircle } from 'lucide-react'
import { useAuth } from '../shared/context/AuthContext'
import { createCustomerPaymentSession, fetchCustomerPaymentStatus } from '../shared/api/customerCheckoutApi'

const STATE_STYLES = {
  confirmed: {
    icon: CheckCircle2,
    iconClass: 'text-green-600',
    panelClass: 'border-green-100 bg-green-50',
  },
  processing: {
    icon: Loader2,
    iconClass: 'text-amber-600',
    panelClass: 'border-amber-100 bg-amber-50',
  },
  cancelled: {
    icon: XCircle,
    iconClass: 'text-gray-600',
    panelClass: 'border-gray-200 bg-gray-50',
  },
  failed: {
    icon: AlertCircle,
    iconClass: 'text-red-600',
    panelClass: 'border-red-100 bg-red-50',
  },
  expired_incomplete: {
    icon: AlertCircle,
    iconClass: 'text-red-600',
    panelClass: 'border-red-100 bg-red-50',
  },
}

const OrderPaymentReturnPage = () => {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const paymentId = searchParams.get('payment_id') || searchParams.get('payment') || ''
  const sessionId = searchParams.get('session_id') || ''
  const [statusPayload, setStatusPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retrying, setRetrying] = useState(false)
  const pollTimeoutRef = useRef(null)
  const pollDeadlineRef = useRef(null)

  const loadStatus = useCallback(async ({ preserveDeadline = true } = {}) => {
    if (!orderId || !paymentId) return

    setLoading(true)

    try {
      const payload = await fetchCustomerPaymentStatus({ orderId, paymentId, sessionId })
      setStatusPayload(payload)
      setError('')

      if (payload?.state === 'confirmed') {
        navigate(`/orders/${orderId}/confirmation`, { replace: true })
        return
      }

      if (payload?.state === 'processing' && payload?.processing?.should_poll) {
        const now = Date.now()
        if (!preserveDeadline || !pollDeadlineRef.current) {
          pollDeadlineRef.current = now + (payload?.processing?.poll_timeout_ms || 25000)
        }

        if (now < pollDeadlineRef.current) {
          clearTimeout(pollTimeoutRef.current)
          pollTimeoutRef.current = window.setTimeout(() => {
            loadStatus({ preserveDeadline: true })
          }, payload?.processing?.poll_interval_ms || 2500)
        }
      }
    } catch (nextError) {
      setError(nextError?.message || 'Unable to load payment status right now.')
    } finally {
      setLoading(false)
    }
  }, [navigate, orderId, paymentId, sessionId])

  useEffect(() => {
    if (!isAuthenticated) return undefined

    pollDeadlineRef.current = null
    loadStatus({ preserveDeadline: false })

    return () => {
      clearTimeout(pollTimeoutRef.current)
    }
  }, [isAuthenticated, loadStatus])

  const handleRetry = async () => {
    if (!paymentId) return

    setRetrying(true)
    try {
      const session = await createCustomerPaymentSession({ paymentId })
      if (session?.url) {
        window.location.assign(session.url)
        return
      }
      setError('Unable to start a new payment session right now.')
    } catch (nextError) {
      setError(nextError?.message || 'Unable to start a new payment session right now.')
    } finally {
      setRetrying(false)
    }
  }

  const resolvedState = statusPayload?.state || 'processing'
  const stateStyle = STATE_STYLES[resolvedState] || STATE_STYLES.processing
  const StateIcon = stateStyle.icon
  const canRetry = statusPayload?.retry_eligible

  const helperText = useMemo(() => {
    if (statusPayload?.state === 'processing') {
      return 'This page checks the local demo payment status for a short window. You can also refresh it manually.'
    }

    return 'Payment redirects are skipped in this demo. This page reflects the local payment record.'
  }, [statusPayload])

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (!orderId || !paymentId) {
    return <Navigate to="/profile" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-3xl px-4 pb-12 pt-24 md:px-8">
        <div className={`rounded-3xl border p-8 shadow-sm ${stateStyle.panelClass}`}>
          <div className="flex items-start gap-4">
            <StateIcon className={`mt-0.5 h-10 w-10 flex-shrink-0 ${stateStyle.iconClass} ${resolvedState === 'processing' ? 'animate-spin' : ''}`} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{statusPayload?.ui?.title || 'Checking payment status'}</h1>
              <p className="mt-2 text-sm text-gray-700">{statusPayload?.ui?.message || 'We are checking your payment status.'}</p>
              <p className="mt-3 text-xs text-gray-500">{helperText}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <div>Order: <span className="font-medium text-gray-900">{statusPayload?.order_number || orderId}</span></div>
            <div>Demo state: <span className="font-medium capitalize text-gray-900">{resolvedState.replace(/_/g, ' ')}</span></div>
            <div>Payment record: <span className="font-medium capitalize text-gray-900">{statusPayload?.payment_status || 'pending'}</span></div>
          </div>

          {error && <div className="mt-6 rounded-2xl border border-red-100 bg-white/80 px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="mt-8 flex flex-wrap gap-3">
            {canRetry && (
              <button type="button" onClick={handleRetry} disabled={retrying} className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white disabled:opacity-70">
                {retrying ? 'Starting payment...' : statusPayload?.ui?.cta?.label || 'Try payment again'}
              </button>
            )}
            <button type="button" onClick={() => loadStatus({ preserveDeadline: false })} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900 disabled:opacity-70">
              <RefreshCw className="h-4 w-4" /> Refresh status
            </button>
            <Link to="/profile" className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-900">
              View my bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderPaymentReturnPage
