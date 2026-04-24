import { Link } from 'react-router-dom'
import { Heart, Share2, Star } from 'lucide-react'
import { Badge } from '../../../../shared/ui/badge'

export function EventHeader({ event }) {
  return (
    <div className="mb-8 border-b border-gray-100 pb-8">
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="secondary" className="bg-gray-100 px-3 py-1 text-sm text-gray-700">
          {event.category || 'Event'}
        </Badge>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-red-500 hover:underline">
            <Heart className="h-5 w-5" />
            <span className="text-sm font-medium">Save</span>
          </button>
          <button className="flex items-center space-x-1 text-gray-600 transition-colors hover:text-gray-900 hover:underline">
            <Share2 className="h-5 w-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900">{event.title}</h1>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <Link to={`/venues/${event.venueId || event.id}`} className="font-medium text-gray-900 hover:text-brand-purple hover:underline">
          {event.venue}
        </Link>
        <span>-</span>
        <span className="underline">{event.location}</span>
      </div>

      <div className="mt-4 flex items-center space-x-6">
        <div className="flex items-center space-x-1 rounded-lg bg-gray-50 p-1 px-2">
          <Star className="h-4 w-4 fill-current text-gray-900" />
          <span className="font-semibold text-gray-900">{event.rating}</span>
          <span className="ml-1 text-gray-500 underline">{event.reviews || 0} reviews</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {event.tags?.map((tag) => (
          <Badge key={tag} variant="outline" className="border-gray-200 text-xs text-gray-600">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
