import { Link } from 'react-router-dom'
import { Star, Heart, MapPin, Circle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '../../../shared/ui/badge'
import { getEventHref } from '../../../shared/lib/eventRoutes'

const EventCard = ({ event, viewMode = 'grid', hideRating = false, showVenueLogoPlaceholder = false }) => {
  if (viewMode === 'list') {
    return (
      <Link to={getEventHref(event)} className="group block">
        <motion.div
          className="rounded-xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          whileHover={{ y: -4 }}
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 relative aspect-[4/3] md:aspect-auto shrink-0 shadow-md z-10">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {showVenueLogoPlaceholder && <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-gray-400 shadow-sm backdrop-blur-sm"><Circle strokeWidth={1.5} className="h-4 w-4" /></div>}
              <div className="absolute top-3 left-3">
                <Badge className="border-0 bg-brand-purple px-3 py-1 text-[9px] font-normal uppercase text-white shadow-sm">
                  {event.category}
                </Badge>
              </div>
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="pl-1 text-[13px] font-medium leading-tight text-brand-black transition-colors group-hover:text-gray-700">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                    <Star strokeWidth={1.5} className="w-3.5 h-3.5 fill-current text-gray-900" />
                    <span className="text-sm font-semibold">{event.rating}</span>
                    <span className="text-xs text-gray-500">({event.reviews})</span>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-4 text-[11px] font-normal text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin strokeWidth={1.5} className="w-4 h-4 text-brand-purple" />
                    <span>{event.venue}</span>
                  </div>
                  {(event.date || event.time) && (
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-gray-300" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">AED {event.price}</span>
                  <span className="text-gray-500 text-sm">per person</span>
                </div>
                <Badge variant="outline" className="border-gray-200 text-gray-600 group-hover:bg-gray-50">
                  View Details
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link to={getEventHref(event)} className="group block h-full">
      <motion.div
        className="rounded-xl h-full bg-white border border-gray-100 shadow-md overflow-hidden"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative aspect-[4/3] mb-3 shadow-md z-10 rounded-b-xl overflow-hidden">
          <img
            alt={event.title}
            src={event.image}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Heart Button - Clean & Minimal */}
          <button className="absolute bottom-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors group/heart">
            <Heart strokeWidth={1.5} className="w-5 h-5 text-white group-hover/heart:fill-white transition-colors" />
          </button>

          {showVenueLogoPlaceholder && <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-gray-400 shadow-sm backdrop-blur-sm"><Circle strokeWidth={1.5} className="h-4 w-4" /></div>}

          {/* Category Pill */}
          <div className="absolute top-3 left-3">
            <Badge className="border-0 bg-brand-purple px-3 py-1 text-[9px] font-normal uppercase text-white shadow-sm">
              {event.category}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <div className="flex justify-between items-start mb-2 gap-3">
            <h3 className="line-clamp-1 pl-1 text-[13px] font-medium leading-tight text-brand-black transition-colors group-hover:text-gray-700">
              {event.title}
            </h3>
            {!hideRating && event.rating !== null && event.rating !== undefined && <div className="flex items-center gap-1 shrink-0">
              <Star strokeWidth={1.5} className="w-3.5 h-3.5 fill-current text-gray-900" />
              <span className="text-sm font-medium">{event.rating}</span>
            </div>}
          </div>

          <div className="mb-4 space-y-2 text-[11px] font-normal text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin strokeWidth={1.5} className="w-4 h-4 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            {event.location && <div className="truncate pl-1 text-[11px] font-normal text-gray-400">{event.location}</div>}
            {(event.date || event.time) && <div className="text-xs text-gray-400">{[event.date, event.time].filter(Boolean).join(' • ')}</div>}
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 min-w-0">
              <span className="font-bold text-gray-900">{event.price !== null && event.price !== undefined ? `AED ${event.price}` : 'Price on request'}</span>
              {event.price !== null && event.price !== undefined && <span className="text-gray-500 text-xs"> starting from</span>}
            </div>
            <Badge variant="outline" className="border-gray-200 text-gray-600 shrink-0">
              {event?.availabilitySummary?.statusLabel ?? 'See availability'}
            </Badge>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default EventCard
