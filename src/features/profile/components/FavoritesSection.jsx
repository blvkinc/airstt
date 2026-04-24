import { Star } from 'lucide-react'
import { Card, CardContent } from '../../../shared/ui/card'

export function FavoritesSection({ favorites }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Favorite Venues</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img src={favorite.image} alt={favorite.name} className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{favorite.name}</h3>
                  <p className="text-sm text-gray-600">{favorite.venue}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-yellow-400" />
                      <span className="text-sm font-medium">{favorite.rating}</span>
                    </div>
                    <div className="font-semibold text-brand-red">AED {favorite.price}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
