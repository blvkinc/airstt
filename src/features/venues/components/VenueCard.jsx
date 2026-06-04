import { Link } from 'react-router-dom'
import { MapPin, Star, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '../../../shared/ui/badge'

const VenueCard = ({ venue, viewMode = 'grid' }) => {
  const safeVenue = {
    amenities: [],
    description: '',
    address: venue.location || '',
    rating: venue.rating || 4.5,
    reviews: venue.reviews || 0,
    upcomingEvents: venue.upcomingEvents || 0,
    capacity: venue.capacity || 'N/A',
    ...venue
  }

  if (viewMode === 'list') {
    return (
      <Link to={`/venues/${safeVenue.id}`} className="group block">
        <motion.div
          className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
          whileHover={{ y: -4 }}
        >
          <div className="flex flex-col md:flex-row overflow-hidden">
            <div className="md:w-64 relative aspect-[4/3] md:aspect-auto shrink-0 shadow-md z-10">
              <img
                src={safeVenue.image}
                alt={safeVenue.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3">
                <Badge className="border-0 bg-brand-green px-3 py-1 text-[9px] font-normal uppercase text-white shadow-sm">
                  {safeVenue.category}
                </Badge>
              </div>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="pl-1 text-[13px] font-medium leading-tight text-brand-black transition-colors group-hover:text-gray-700">
                    {safeVenue.name}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                    <Star strokeWidth={1.5} className="w-3.5 h-3.5 fill-current text-gray-900" />
                    <span className="text-sm font-semibold">{safeVenue.rating}</span>
                    <span className="text-xs text-gray-500">({safeVenue.reviews})</span>
                  </div>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{safeVenue.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {safeVenue.venueTypes?.slice(0, 3).map((venueType) => (
                    <span key={venueType.id || venueType.slug || venueType.name} className="rounded-full bg-brand-green px-2 py-1 text-[9px] font-normal text-white">
                      {venueType.name}
                    </span>
                  ))}
                  {safeVenue.amenities?.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-4 text-[11px] font-normal text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin strokeWidth={1.5} className="w-4 h-4" />
                  {safeVenue.address}
                </div>
                <div className="flex items-center gap-1">
                  <Users strokeWidth={1.5} className="w-4 h-4" />
                  {safeVenue.capacity}
                </div>
              </div>
            </div>
          </div>
          <div className="h-1 w-full gradient-brand" />
        </motion.div>
      </Link>
    )
  }

  // Grid View
  return (
    <Link to={`/venues/${safeVenue.id}`} className="group block h-full">
      <motion.div
        className="h-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
        whileHover={{ y: -4 }}
      >
        <div className="relative aspect-[4/3] shadow-md z-10 bg-gray-100">
          {safeVenue.image ? (
            <img
              src={safeVenue.image}
              alt={safeVenue.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-400">
              No image available
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="border-0 bg-brand-green px-3 py-1 text-[9px] font-normal uppercase text-white shadow-sm">
              {safeVenue.category}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
            <Users strokeWidth={1.5} className="w-3 h-3" /> {safeVenue.capacity}
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="line-clamp-1 pl-1 text-[13px] font-medium leading-tight text-brand-black transition-colors group-hover:text-gray-700">
              {safeVenue.name}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star strokeWidth={1.5} className="w-3.5 h-3.5 fill-current text-gray-900" />
              <span className="text-sm font-medium">{safeVenue.rating}</span>
            </div>
          </div>

          <div className="mb-3 flex items-center gap-2 text-[11px] font-normal text-gray-500">
            <MapPin strokeWidth={1.5} className="w-4 h-4 shrink-0" />
            <span className="truncate">{safeVenue.address}</span>
          </div>

          {safeVenue.venueTypes?.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {safeVenue.venueTypes.slice(0, 2).map((venueType) => (
                <span key={venueType.id || venueType.slug || venueType.name} className="rounded-full bg-brand-green px-2 py-1 text-[9px] font-normal text-white">
                  {venueType.name}
                </span>
              ))}
              {safeVenue.venueTypes.length > 2 && (
                <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                  +{safeVenue.venueTypes.length - 2}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {safeVenue.amenities?.slice(0, 2).map((amenity, i) => (
              <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                {amenity}
              </span>
            ))}
          </div>
        </div>
        <div className="h-1 w-full gradient-brand" />
      </motion.div>
    </Link>
  )
}

export default VenueCard
