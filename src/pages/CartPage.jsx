import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, Calendar, Users, Package, ArrowRight } from 'lucide-react'
import { useCart } from '../shared/context/CartContext'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'

const CartPage = () => {
  const navigate = useNavigate()
  const { items, removeFromCart, updateGuests, total } = useCart()

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-500">Review your packages before checkout.</p>
          </div>
          <div className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <Card key={item.id} className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 md:flex md:items-center md:gap-6">
                  <div className="w-full md:w-40 h-28 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.eventTitle} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 mt-4 md:mt-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.eventTitle}</h3>
                        <p className="text-sm text-gray-500">{item.packageName}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{item.date || 'Date not set'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>{item.packageName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{item.guests} guests</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 capitalize">
                      Payment: {(item.paymentMode || 'full').replace('_', ' ')}
                      {item.paymentMode === 'deposit' && item.depositAmount ? ` (AED ${item.depositAmount})` : ''}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Guests</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateGuests(item.id, Math.max(1, (item.guests || 1) - 1))}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="min-w-[24px] text-center font-semibold">{item.guests || 1}</span>
                          <button
                            onClick={() => updateGuests(item.id, (item.guests || 1) + 1)}
                            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-500">Price</div>
                        <div className="text-lg font-bold text-gray-900">
                          AED {(item.price || 0) * (item.guests || 1)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button
                        className="rounded-full px-6"
                        onClick={() => navigate(`/booking/${item.eventId}`, {
                          state: {
                            event: item.eventTitle,
                            venue: item.venue,
                            date: item.date,
                            time: item.time,
                            price: item.price,
                            guests: item.guests,
                            package: item.packageName,
                            image: item.image,
                            paymentMode: item.paymentMode || 'full',
                            depositAmount: item.depositAmount || 0
                          }
                        })}
                      >
                        Checkout <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="rounded-3xl border border-gray-100 shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>AED {total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service fee</span>
                    <span>AED 45</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>AED {total + 45}</span>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <Link to="/cart/checkout">
                    <Button className="w-full rounded-full">
                      Checkout All
                    </Button>
                  </Link>
                  <Link to="/explore">
                    <Button variant="outline" className="w-full rounded-full">
                      Continue Browsing
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-500 text-center">
                    Checkout all items together or individually from each card.
                  </p>
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


