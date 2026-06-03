import { Badge } from '../../../shared/ui/badge'
import { Button } from '../../../shared/ui/button'
import { Card, CardContent } from '../../../shared/ui/card'
import { formatProfileStatus, getProfileStatusBadgeClassName } from '../profileStatus'

export function ReceiptsSection({ receipts }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-8">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Receipts & E-tickets</h2>
        <div className="space-y-4">
          {receipts.length === 0 && <div className="text-sm text-gray-500">Receipts will appear here when bookings include generated receipt files.</div>}
          {receipts.map((receipt) => (
            <Card key={receipt.id} className="border-0 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{receipt.event}</h3>
                  <p className="text-sm text-gray-500">Date: {receipt.date}</p>
                  <p className="text-sm text-gray-500">Receipt ID: {receipt.id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={getProfileStatusBadgeClassName(receipt.status)}>{formatProfileStatus(receipt.status)}</Badge>
                  <div className="text-lg font-semibold text-gray-900">AED {receipt.amount}</div>
                  {receipt.downloadUrl ? (
                    <a href={receipt.downloadUrl} target="_blank" rel="noreferrer">
                      <Button variant="outline">View Receipt</Button>
                    </a>
                  ) : (
                    <Button variant="outline" disabled>Pending</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
