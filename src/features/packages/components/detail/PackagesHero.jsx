import { Calendar, Clock, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PackagesHero({ event }) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link to="/" className="hover:text-brand-purple">Home</Link>
              <span>•</span>
              <Link to="/events" className="hover:text-brand-purple">Events</Link>
              <span>•</span>
              <Link to={`/events/${event.id}`} className="hover:text-brand-purple">{event.title}</Link>
              <span>•</span>
              <span>Packages</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <div className="flex items-center space-x-6 text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-5 h-5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-5 h-5" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span>{event.rating} ({event.reviews} reviews)</span>
              </div>
            </div>
            <p className="text-lg text-gray-600">{event.venue} • {event.location}</p>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-md">
            <img src={event.image} alt={event.title} className="w-full h-80 object-cover" />
          </div>
        </div>
      </div>
    </div>
  )
}
