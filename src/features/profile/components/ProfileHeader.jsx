import { Calendar, Crown, Gift, Heart, Mail, Sparkles, User } from 'lucide-react'
import { Badge } from '../../../shared/ui/badge'
import { Card, CardContent } from '../../../shared/ui/card'

function Stat({ icon, value, label }) {
  return (
    <div className="rounded-2xl p-4 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">{icon}</div>
      <div className="mb-1 text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm font-medium uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  )
}

export function ProfileHeader({ user }) {
  return (
    <Card className="relative mb-8 overflow-hidden border-0 bg-white/80 shadow-lg backdrop-blur-sm">
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-purple via-brand-blue to-brand-orange" />
      <CardContent className="p-8">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="relative">
            <div className="w-28 rounded-full bg-gradient-brand p-1 shadow-xl">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-white">
                <User strokeWidth={1.5} className="h-12 w-12 text-gray-300" />
              </div>
            </div>
            {user.accountType === 'Premium' && (
              <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-purple shadow-md animate-bounce-slow">
                <Crown strokeWidth={1.5} className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent">{user.name}</h1>
                <p className="mb-2 flex items-center gap-2 text-lg text-gray-600">
                  <Mail strokeWidth={1.5} className="h-4 w-4 text-brand-purple" /> {user.email}
                </p>
                <p className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-500">Member since {user.memberSince}</p>
              </div>

              <div className="mt-6 md:mt-0">
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <Badge variant="outline" className="rounded-full border-brand-purple bg-brand-purple/5 px-4 py-1.5 text-sm font-semibold text-brand-purple">
                    {user.accountType} Member
                  </Badge>
                  {user.accountType === 'Premium' && (
                    <div className="flex items-center gap-1.5 text-sm font-medium text-gray-500">
                      <Sparkles strokeWidth={1.5} className="h-3.5 w-3.5 text-brand-yellow" />
                      <span>{user.pointsToNextTier} points to {user.nextRewardTier}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-100 pt-8">
          <Stat icon={<Gift strokeWidth={1.5} className="h-6 w-6 text-brand-purple" />} value={user.rewardPoints} label="Reward Points" />
          <Stat icon={<Calendar strokeWidth={1.5} className="h-6 w-6 text-brand-blue" />} value={user.totalBookings} label="Bookings" />
          <Stat icon={<Heart strokeWidth={1.5} className="h-6 w-6 text-brand-red" />} value={user.favoriteVenues} label="Favorites" />
        </div>
      </CardContent>
    </Card>
  )
}
