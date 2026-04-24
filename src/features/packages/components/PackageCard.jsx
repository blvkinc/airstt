import { Link } from 'react-router-dom'
import { Star, Users } from 'lucide-react'
import { Card, CardContent } from '../../../shared/ui/card'
import { Badge } from '../../../shared/ui/badge'

export default function PackageCard({ item, viewMode = 'grid' }) {
  const href = item.eventId ? `/events/${item.eventId}?tab=packages` : `/events`

  if (viewMode === 'list') {
    return (
      <Link to={href} className="group block">
        <Card className="rounded-xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="flex flex-col md:flex-row p-1">
            <div className="md:w-64 relative aspect-[4/3] md:aspect-auto rounded-xl overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              {item.popular && <Badge className="absolute top-3 left-3 bg-yellow-400 text-yellow-900">Popular</Badge>}
            </div>
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-rose-600 transition-colors">{item.name}</h3>
                    <p className="text-gray-600">{item.event}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                    <Star strokeWidth={1.5} className="w-3.5 h-3.5 fill-current text-yellow-400" />
                    <span className="text-sm font-semibold">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="font-medium text-gray-900">{item.venue}</span>
                  <span>•</span>
                  <span>{item.location}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.features?.slice(0, 3).map((feature) => (
                    <span key={feature} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{feature}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Users strokeWidth={1.5} className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Up to {item.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-rose-600">AED {item.price}</span>
                  {item.originalPrice > item.price && <span className="text-sm text-gray-500 line-through">AED {item.originalPrice}</span>}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  return (
    <Link to={href} className="group">
      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl">
        <div className="relative aspect-[4/3]">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          {item.popular && <Badge className="absolute top-3 left-3 bg-yellow-400 text-yellow-900">Popular</Badge>}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span className="text-xs font-medium">{item.rating}</span>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">{item.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{item.event}</p>
          <p className="text-xs text-gray-500 mb-3">{item.venue} • {item.location}</p>
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
            <Users className="w-3 h-3" />Up to {item.maxGuests} guests
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-rose-600">AED {item.price}</span>
              {item.originalPrice > item.price && <span className="text-sm text-gray-500 line-through">AED {item.originalPrice}</span>}
            </div>
            <span className="text-xs text-gray-500">per person</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
