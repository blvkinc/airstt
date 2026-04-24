import { Calendar, FileText, Gift, Heart, Settings, XCircle } from 'lucide-react'
import { TabsList, TabsTrigger } from '../../../shared/ui/tabs'

export function ProfileTabsNav() {
  return (
    <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
      <TabsTrigger value="bookings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
        <Calendar className="mr-2 h-4 w-4" />My Bookings
      </TabsTrigger>
      <TabsTrigger value="favorites" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
        <Heart className="mr-2 h-4 w-4" />Favorites
      </TabsTrigger>
      <TabsTrigger value="rewards" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
        <Gift className="mr-2 h-4 w-4" />Rewards
      </TabsTrigger>
      <TabsTrigger value="receipts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
        <FileText className="mr-2 h-4 w-4" />Receipts
      </TabsTrigger>
      <TabsTrigger value="cancellations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
        <XCircle className="mr-2 h-4 w-4" />Cancellations
      </TabsTrigger>
      <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent">
        <Settings className="mr-2 h-4 w-4" />Settings
      </TabsTrigger>
    </TabsList>
  )
}
