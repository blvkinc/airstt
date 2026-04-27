import { Globe, MapPin } from 'lucide-react'

const getPrimaryMapLink = (mapLinks) => {
  if (!mapLinks || typeof mapLinks !== 'object') return null

  return mapLinks.google
    || mapLinks.google_maps
    || mapLinks.apple
    || mapLinks.apple_maps
    || mapLinks.website
    || null
}

export function EventVenue({ event }) {
  const venueName = event.venueDetails?.name || event.venue || 'Venue details'
  const locationText = event.venueDetails?.address || event.location || 'Location details will be shared after booking is confirmed.'
  const locationContext = [event.venueDetails?.area, event.location].filter(Boolean)
  const primaryMapLink = getPrimaryMapLink(event.venueDetails?.mapLinks)

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8" aria-labelledby="event-venue-heading">
      <h2 id="event-venue-heading" className="text-2xl font-bold text-gray-900">Where you’ll be</h2>
      <div className="mt-6 space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-gray-900" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{venueName}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{locationText}</p>
              {locationContext.length > 0 && <p className="mt-2 text-sm text-gray-500">{locationContext.join(' • ')}</p>}
            </div>
          </div>
        </div>

        {event.venueDetails?.description && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">About the venue</h3>
            <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">{event.venueDetails.description}</p>
          </div>
        )}

        {primaryMapLink && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Getting there</h3>
            <a
              href={primaryMapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:text-gray-900"
            >
              <Globe className="h-4 w-4" />
              Open location in maps
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
