import { Link } from 'react-router-dom'
import { Globe, MapPin, Phone } from 'lucide-react'
import { Badge } from '../../../../shared/ui/badge'
import { Button } from '../../../../shared/ui/button'

export function EventVenue({ event }) {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">{event.venueDetails?.name || event.venue}</h2>
        <p className="mb-8 text-lg leading-relaxed text-gray-600">{event.venueDetails?.description || 'Venue details are limited in the current public catalog.'}</p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span>{event.venueDetails?.address || event.location}</span>
            </div>
            {(event.venueDetails?.phone || event.contact?.phone) && <div className="flex items-center gap-3 text-gray-700">
              <Phone className="h-5 w-5 text-gray-400" />
              <span>{event.venueDetails?.phone || event.contact?.phone}</span>
            </div>}
            {event.venueDetails?.website && <div className="flex items-center gap-3 text-gray-700">
              <Globe className="h-5 w-5 text-gray-400" />
              <a href={`http://${event.venueDetails?.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {event.venueDetails?.website}
              </a>
            </div>}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {event.venueDetails?.amenities?.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="bg-gray-100 font-normal text-gray-700">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {event.mapImage && <div className="mt-8">
          <h3 className="mb-3 font-semibold text-gray-900">Location Map</h3>
          <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
            <img src={event.mapImage} alt="Venue map" className="h-56 w-full object-cover" />
          </div>
        </div>}

        <div className="mt-8 border-t border-gray-100 pt-8">
          <Link to={`/venues/${event.venueId || event.id}`}>
            <Button className="rounded-full bg-gray-900 px-8 text-white hover:bg-black">View Full Venue Details</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
