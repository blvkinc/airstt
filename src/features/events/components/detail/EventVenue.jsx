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
    <section className="space-y-6" aria-labelledby="event-venue-heading">
      <h2 id="event-venue-heading" className="text-2xl font-bold text-gray-950">Where you'll be</h2>
      <div className="mt-6 space-y-6">
        <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-gray-900" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{venueName}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{locationText}</p>
              {locationContext.length > 0 && <p className="mt-2 text-sm text-gray-500">{locationContext.join(' - ')}</p>}
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
              className="mt-3 inline-flex h-11 items-center gap-2 rounded-full border border-gray-300 px-5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-50"
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
