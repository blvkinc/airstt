import { Card, CardContent } from '../../../shared/ui/card'

export function RewardsSection({ user, rewardHistory }) {
  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Reward Points</h2>
          <div className="rounded-3xl bg-gradient-to-br from-brand-red via-brand-orange to-brand-yellow p-8 text-white shadow-lg">
            <div className="mb-2 text-5xl font-bold">{user.rewardPoints}</div>
            <div className="text-lg text-white/80">Available Points</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-8">
          <h3 className="mb-6 text-2xl font-semibold text-gray-900">Points History</h3>
          <div className="space-y-4">
            {rewardHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-4 last:border-b-0">
                <div>
                  <div className="font-semibold text-gray-900">{item.action}</div>
                  <div className="text-sm text-gray-500">{item.date}</div>
                </div>
                <div className="text-lg font-semibold text-green-600">+{item.points} pts</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
