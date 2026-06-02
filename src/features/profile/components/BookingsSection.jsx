import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Badge } from '../../../shared/ui/badge'
import { Button } from '../../../shared/ui/button'
import { Card, CardContent } from '../../../shared/ui/card'
import { formatProfileStatus, getProfileStatusBadgeClassName, normalizeProfileStatus } from '../profileStatus'

export function BookingsSection({ bookings }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">My Bookings</h2>
        <Link to="/premium">
          <Button variant="outline">Upgrade to Premium</Button>
        </Link>
      </div>

      {bookings.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-gray-600">You do not have any demo bookings yet.</CardContent>
        </Card>
      )}

      {bookings.map((booking) => (
        <Card key={booking.id} className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {booking.image ? <img src={booking.image} alt={booking.event} className="h-32 w-full rounded-xl object-cover md:w-40" /> : <div className="h-32 w-full rounded-xl bg-gray-100 md:w-40" />}
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{booking.event}</h3>
                <p className="mb-3 font-medium text-gray-600">{booking.venue}</p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span>{booking.date}</span>
                  <span>{booking.time}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-2 text-2xl font-semibold text-brand-red">AED {booking.price}</div>
                <Badge className={getProfileStatusBadgeClassName(booking.status)}>
                  {formatProfileStatus(booking.status)}
                </Badge>
                {normalizeProfileStatus(booking.status) === 'completed' && (
                  <div className="mt-3">
                    <button type="button" disabled className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 cursor-not-allowed" title="Reviews are not available yet">
                      <Star className="h-4 w-4" />Leave Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
