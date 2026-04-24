import { Badge } from '../../../shared/ui/badge'
import { Button } from '../../../shared/ui/button'
import { Card, CardContent } from '../../../shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/ui/select'
import { Textarea } from '../../../shared/ui/textarea'

export function CancellationSection({ bookings, cancelForm, setCancelForm, handleCancellationSubmit, cancelRequests }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">Request Cancellation</h2>
          <form onSubmit={handleCancellationSubmit} className="space-y-4">
            <Select value={cancelForm.bookingId} onValueChange={(value) => setCancelForm((prev) => ({ ...prev, bookingId: value }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Choose booking" />
              </SelectTrigger>
              <SelectContent>
                {bookings.map((booking) => (
                  <SelectItem key={booking.id} value={String(booking.id)}>
                    {booking.event} - {booking.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={cancelForm.reason} onValueChange={(value) => setCancelForm((prev) => ({ ...prev, reason: value }))}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="schedule_conflict">Schedule conflict</SelectItem>
                <SelectItem value="illness">Illness or emergency</SelectItem>
                <SelectItem value="travel_change">Travel change</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={cancelForm.notes}
              onChange={(e) => setCancelForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Share more details to help review your request."
            />
            <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-500">Submit Request</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">Cancellation Requests</h2>
          <div className="space-y-4">
            {cancelRequests.map((request) => (
              <div key={request.id} className="rounded-2xl border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900">{request.event}</div>
                    <div className="text-sm text-gray-500">{request.date}</div>
                    <div className="text-xs text-gray-400">Request ID: {request.id}</div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{request.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
