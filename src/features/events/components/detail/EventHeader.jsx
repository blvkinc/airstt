import { Link } from 'react-router-dom'
import { Heart, Share2, Star } from 'lucide-react'
import { Badge } from '../../../../shared/ui/badge'

export function EventHeader({ event }) {
  return (
    <div className="mb-8 border-b border-gray-100 pb-8">
      <div className="mb-4 flex items-start justify-between gap-4">
        <Badge variant="secondary" className="rounded-full bg-brand-purple px-3 py-1 text-[9px] font-normal uppercase text-white">
          {event.category || 'Event'}
        </Badge>
        <div className="flex shrink-0 items-center gap-2">
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 hover:text-gray-950">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button className="inline-flex h-10 items-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 hover:text-gray-950">
            <Heart className="h-5 w-5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      <h1 className="mb-2 max-w-3xl text-[17px] font-semibold tracking-tight text-brand-black">{event.title}</h1>

      <div className="flex items-center space-x-4 text-[11px] font-normal text-gray-600">
        <Link to={`/venues/${event.venueId || event.id}`} className="font-normal text-brand-black hover:text-brand-purple hover:underline">
          {event.venue}
        </Link>
        <span className="text-gray-300">|</span>
        <span className="underline">{event.location}</span>
      </div>

      <div className="mt-4 flex items-center space-x-6">
        <div className="flex items-center space-x-1 rounded-full bg-gray-100 px-3 py-1.5">
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
