import { Clock, Heart, Share2, Star, Users } from 'lucide-react'
import { Badge } from '../../../../shared/ui/badge'

export function PackageDetailHeader({ packageData }) {
  return (
    <div className="mb-8 border-b border-gray-100 pb-8">
      <div className="flex items-center justify-between mb-4">
        <Badge variant="secondary" className="px-3 py-1 text-sm bg-gray-100 text-gray-700">
          {packageData.category}
        </Badge>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Save</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{packageData.name}</h1>
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <span className="font-medium text-gray-900">{packageData.venue}</span>
        <span>•</span>
        <span className="underline">{packageData.location}</span>
      </div>

      <div className="flex items-center space-x-6 mt-4">
        <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-lg px-2">
          <Star className="w-4 h-4 text-gray-900 fill-current" />
          <span className="font-semibold text-gray-900">{packageData.rating}</span>
          <span className="text-gray-500 underline ml-1">{packageData.reviews} reviews</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{packageData.duration}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Users className="w-4 h-4" />
          <span>Up to {packageData.maxGuests} guests</span>
        </div>
      </div>
    </div>
  )
}
