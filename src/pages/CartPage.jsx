import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../shared/context/AuthContext'
import { Trash2, ShoppingBag, Calendar, MapPin, Loader2, CreditCard } from 'lucide-react'
import { useCart } from '../shared/context/CartContext'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'

const formatPrice = (amount) => `AED ${Number(amount || 0)}`

const formatPaymentMode = (value) => {
  const normalizedValue = String(value || 'full').replace(/_/g, ' ')
  return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1)
}

const hasGroupingValue = (value) => value !== null && value !== undefined && value !== ''

const getCartGroupKey = (item) => {
  if (hasGroupingValue(item?.eventId) && hasGroupingValue(item?.slotKey || item?.occurrenceDate)) {
    return `slot:${item.eventId}:${item.slotKey || item.occurrenceDate}`
  }
  if (hasGroupingValue(item?.eventOccurrenceId)) return `occurrence:${item.eventOccurrenceId}`
  return null
}

const buildCartRows = (items = []) => {
  const rows = []
  const groupsByKey = new Map()

  items.forEach((item) => {
    const groupKey = getCartGroupKey(item)

    if (!groupKey) {
      rows.push({ type: 'item', key: `item:${item.id}`, item })
      return
    }

    let group = groupsByKey.get(groupKey)

    if (!group) {
      group = {
        type: 'group',
        key: `group:${groupKey}`,
        items: [],
        header: {
          eventTitle: item.eventTitle || 'Event',
          date: item.date || item.occurrenceDate || '',
          venue: item.venue || '',
          image: item.image || null,
        },
      }

      groupsByKey.set(groupKey, group)
      rows.push(group)
    }

    group.items.push(item)

    if (!group.header.eventTitle && item.eventTitle) group.header.eventTitle = item.eventTitle
    if (!group.header.date && (item.date || item.occurrenceDate)) group.header.date = item.date || item.occurrenceDate
    if (!group.header.venue && item.venue) group.header.venue = item.venue
    if (!group.header.image && item.image) group.header.image = item.image
  })

  return rows.flatMap((row) => {
    if (row.type !== 'group' || row.items.length > 1) return [row]
    const [item] = row.items
    return [{ type: 'item', key: `item:${item.id}`, item }]
  })
}

const CartItemCard = ({ item, pendingQuantityByItemId, removeFromCart, updateQuantity }) => {
  const isPending = Boolean(pendingQuantityByItemId?.[item.id])
  const paymentModeLabel = formatPaymentMode(item.paymentMode)
  const detailChips = [item.packageTypeLabel, item.packageVariantLabel, paymentModeLabel].filter(Boolean)
  const venueDetail = item.venue
    ? {
        key: 'venue',
        icon: <MapPin className="h-3.5 w-3.5 text-brand-orange" />,
        value: item.venue,
      }
    : null
  const dateDetail = item.date
    ? {
        key: 'date',
        icon: <Calendar className="h-3.5 w-3.5 text-brand-purple" />,
        value: item.date,
      }
    : null
  const hasImage = Boolean(item.image)

  return (
    <Card
      className={`overflow-hidden rounded-[24px] border-0 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 transition-opacity ${isPending ? 'opacity-80' : ''}`}
    >
      <div className="p-3 md:p-3">
        <div className="flex gap-3">
          {hasImage && (
            <div className="hidden h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[18px] bg-gradient-to-br from-brand-purple/10 via-gray-100 to-brand-orange/10 sm:block">
              <img src={item.image} alt={item.eventTitle} className="h-full w-full object-cover" />
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[15px] font-bold leading-tight text-gray-900 md:text-base">{item.eventTitle}</h3>
                  <p className="mt-0.5 truncate text-sm font-semibold leading-tight text-gray-700">{item.packageName}</p>
                </div>
                {(venueDetail || dateDetail) && (
                  <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-500">
                    {venueDetail && (
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        {venueDetail.icon}
                        <span className="truncate">{venueDetail.value}</span>
                      </span>
                    )}
                    {dateDetail && (
                      <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap">
                        {dateDetail.icon}
                        <span>{dateDetail.value}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                aria-label="Remove item"
                disabled={isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {detailChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-[12px] text-gray-500">
                {detailChips.map((chip, chipIndex) => (
                  <span
                    key={`${chip}-${chipIndex}`}
                    className="inline-flex items-center gap-1 rounded-full bg-[#f6f1fb] px-2 py-1 text-[10px] font-medium leading-none text-gray-600"
                  >
                    {chip === paymentModeLabel && <CreditCard className="h-3 w-3 text-brand-purple" />}
                    {chip}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-gray-100 pt-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-left sm:[grid-template-columns:minmax(0,1fr)_repeat(3,max-content)] sm:justify-between sm:gap-x-3 lg:gap-x-4">
                <div className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Quantity</span>
                </div>
                <div className="min-w-0 sm:text-right">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Full</span>
                </div>
                <div className="min-w-0 sm:text-right">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Due now</span>
                </div>
                {(item.offlineDueAmount || 0) > 0 && (
                  <div className="min-w-0 sm:text-right">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Remaining</span>
                  </div>
                )}
              </div>

              <div className="mt-1 grid grid-cols-2 items-end gap-x-4 gap-y-2 text-left sm:[grid-template-columns:minmax(0,1fr)_repeat(3,max-content)] sm:justify-between sm:gap-x-3 lg:gap-x-4">
                <div className="flex min-w-0 flex-wrap items-end gap-2 sm:flex-nowrap">
                  <div className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-1 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isPending}
                    >
                      -
                    </button>
                    <span className="min-w-[22px] text-center text-sm font-semibold text-gray-900">{item.quantity || 1}</span>
                    <button
                      onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-base text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={isPending}
                    >
                      +
                    </button>
                  </div>
                  {isPending && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500 sm:whitespace-nowrap">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Updating...
                    </span>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-base font-bold leading-tight text-gray-900">{formatPrice(item.lineTotal)}</div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-sm font-semibold leading-tight text-gray-700">{formatPrice(item.onlineDueAmount)}</div>
                </div>
                {(item.offlineDueAmount || 0) > 0 && (
                  <div className="text-left sm:text-right">
                    <div className="text-xs leading-tight text-gray-500">{formatPrice(item.offlineDueAmount)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

const CartPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const {
    items,
    removeFromCart,
    updateQuantity,
    total,
    loading,
    initialLoading,
    pendingQuantityByItemId,
    error,
    summary,
  } = useCart()

  if (authLoading || loading || initialLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading cart...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
            <ShoppingBag className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to view your cart</h1>
          <p className="text-gray-500 mb-8">Sign in to view your saved cart.</p>
          <Link to="/auth?redirect=%2Fcart">
            <Button className="rounded-full px-8">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-28 pb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
            <ShoppingBag className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Browse events and add packages to your cart.</p>
          <Link to="/explore">
            <Button className="rounded-full px-8">Explore Events</Button>
          </Link>
        </div>
      </div>
    )
  }

  const cartRows = buildCartRows(items)

  return (
    <div className="min-h-screen bg-[#fcfaf8]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-purple/70">Cart</p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Your Selections</h1>
            <p className="mt-2 text-gray-500">Review your packages before checkout.</p>
          </div>
          <div className="inline-flex w-fit items-center rounded-full border border-brand-purple/10 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </div>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cartRows.map((row) => {
              if (row.type === 'item') {
                return (
                  <CartItemCard
                    key={row.key}
                    item={row.item}
                    pendingQuantityByItemId={pendingQuantityByItemId}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                  />
                )
              }

              const sharedHeaderImage = row.header.image && row.items.every((item) => !item.image || item.image === row.header.image) ? row.header.image : null

              return (
                <div key={row.key} className="rounded-[28px] border border-brand-purple/10 bg-white/70 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-col gap-2 rounded-[22px] bg-[#fcfaf8] px-4 py-3 ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {sharedHeaderImage && (
                        <div className="hidden h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple/10 via-gray-100 to-brand-orange/10 sm:block">
                          <img src={sharedHeaderImage} alt={row.header.eventTitle} className="h-full w-full object-cover" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-purple/60">Grouped Events</p>
                        </div>
                        <h2 className="mt-1 text-base font-bold leading-tight text-gray-900 md:text-lg">{row.header.eventTitle}</h2>
                        {row.header.venue && (
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-brand-orange" />
                              {row.header.venue}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="inline-flex w-fit shrink-0 self-start rounded-full border border-brand-purple/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-600 sm:self-center">
                      {row.items.length} item{row.items.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="mt-3 space-y-3">
                    {row.items.map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        pendingQuantityByItemId={pendingQuantityByItemId}
                        removeFromCart={removeFromCart}
                        updateQuantity={updateQuantity}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
                <div className="bg-gradient-to-r from-brand-purple to-brand-orange px-6 py-5 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">Order Summary</p>
                      <h2 className="mt-1 text-2xl font-bold">Ready to checkout</h2>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="rounded-2xl bg-[#fcfaf8] p-4 ring-1 ring-black/5">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Items</span>
                      <span>{summary.itemCount || items.length}</span>
                    </div>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Full amount</span>
                        <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Due now</span>
                        <span className="font-semibold text-gray-900">{formatPrice(summary.onlineDueAmount)}</span>
                      </div>
                      {(summary.offlineDueAmount || 0) > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Remaining amount</span>
                          <span className="font-semibold text-gray-900">{formatPrice(summary.offlineDueAmount)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-brand-purple/10 bg-brand-purple/[0.03] px-4 py-3 text-sm text-gray-600">
                    Checkout all items together once your quantities look right.
                  </div>

                  <div className="mt-8 space-y-4">
                    <Link to="/cart/checkout" className="block">
                      <Button className="w-full rounded-full h-12 text-base font-semibold">
                        Checkout All
                      </Button>
                    </Link>
                    <Link to="/explore" className="block pt-2">
                      <Button variant="outline" className="w-full rounded-full h-12 border-gray-200 bg-white">
                        Continue Browsing
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
