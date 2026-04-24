import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Clock, Phone, ArrowLeft, Heart, Share2, Mail } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select'
import { DetailMediaGallery } from '../shared/components/detail/DetailMediaGallery'
import { DetailTabNav } from '../shared/components/detail/DetailTabNav'
import { useVenueDetailCatalog } from '../features/catalog'

const VenueDetailsPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const { data: venue, loading, error, retry } = useVenueDetailCatalog(id)

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading venue...</div>
  if (error?.status === 404) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Venue not found</h1><Link to="/venues" className="text-brand-purple">Back to Venues</Link></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold mb-3">Couldn't load venue</h1><p className="text-gray-600 mb-4">{error.message}</p><button onClick={retry} className="text-brand-purple">Try again</button></div></div>
  if (!venue) return null

  const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'events', label: 'Events' }, { id: 'reviews', label: 'Reviews' }]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-6"><Link to="/venues" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"><ArrowLeft className="w-5 h-5" /><span className="font-medium">Back to Venues</span></Link></div>
      <DetailMediaGallery title={venue.name} images={venue.images} fallbackImage={venue.image} className="max-w-7xl mx-auto px-4 md:px-6 mb-12" heightClassName="h-[400px] md:h-[500px]" />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex justify-between items-start mb-4"><div><h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{venue.name}</h1><div className="flex items-center space-x-2 text-sm text-gray-600"><span className="font-medium">{venue.address}</span></div></div><div className="flex items-center space-x-2"><button className="p-2"><Heart className="w-5 h-5" /></button><button className="p-2"><Share2 className="w-5 h-5" /></button></div></div>
              <div className="flex flex-wrap items-center gap-6"><div className="flex items-center gap-1"><Star className="w-4 h-4 fill-gray-900 text-gray-900" /><span className="font-semibold text-lg">{venue.rating}</span><span className="text-gray-500 text-sm">(rating only)</span></div><div className="flex items-center gap-1 text-gray-600"><MapPin className="w-4 h-4" /><span className="text-sm">Location available</span></div></div>
              {venue.venueTypes?.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{venue.venueTypes.map((venueType) => <span key={venueType.id || venueType.slug || venueType.name} className="rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-medium text-brand-purple">{venueType.name}</span>)}</div>}
            </div>
            <DetailTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'overview' && <div className="space-y-10"><div><h2 className="text-2xl font-bold text-gray-900 mb-4">About the venue</h2><p className="text-gray-600 leading-relaxed text-lg">{venue.description || 'Additional venue details will appear here as the public catalog expands.'}</p></div>{venue.highlights.length > 0 && <div className="border-t border-gray-100 pt-8"><h3 className="text-xl font-semibold text-gray-900 mb-6">Venue Highlights</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{venue.highlights.map((highlight) => <div key={highlight} className="bg-gray-50 p-4 rounded-xl"><span className="text-gray-800 font-medium">{highlight}</span></div>)}</div></div>}</div>}
            {activeTab === 'events' && <div className="space-y-6"><h2 className="text-2xl font-bold text-gray-900 mb-6">Public Events</h2>{venue.upcomingEvents.length === 0 ? <Card className="p-8 text-center text-gray-600">No public events are attached to this venue yet.</Card> : <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{venue.upcomingEvents.map((event) => <Link to={`/events/${event.id}`} key={event.id}><Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"><div className="relative h-48 overflow-hidden"><img src={event.image} alt={event.title} className="w-full h-full object-cover" /></div><div className="p-5"><div className="text-xs font-bold text-brand-purple mb-1 uppercase tracking-wide">{event.date}</div><h3 className="font-bold text-lg text-gray-900 mb-1">{event.title}</h3><div className="flex items-center text-gray-500 text-sm mb-4"><Clock className="w-4 h-4 mr-1" />{event.time || 'Details on event page'}</div><Button variant="outline" className="w-full rounded-xl border-gray-200 hover:border-gray-900 hover:bg-gray-50">View Details</Button></div></Card></Link>)}</div>}</div>}
            {activeTab === 'reviews' && <Card className="p-8 text-center text-gray-600">Public review counts are not exposed yet for this venue.</Card>}
          </div>
          <div className="lg:col-span-1"><div className="sticky top-28 space-y-6"><Card className="rounded-3xl shadow-xl border-0 overflow-hidden ring-1 ring-black/5 p-6 bg-white"><div className="mb-6"><h3 className="text-xl font-bold text-gray-900">Request a Quote</h3><p className="text-sm text-gray-500 mt-1">Starting from <span className="font-semibold text-gray-900">{venue.priceRange}</span></p></div><div className="space-y-4"><div className="grid grid-cols-2 gap-3"><div className="col-span-2 space-y-1"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Event Type</label><Select><SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50 h-11"><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="wedding">Wedding</SelectItem><SelectItem value="corporate">Corporate Event</SelectItem><SelectItem value="party">Private Party</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div><div className="col-span-1 space-y-1"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date</label><input type="date" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div><div className="col-span-1 space-y-1"><label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Guests</label><input type="number" placeholder="50+" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm" /></div></div><Button className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-purple to-brand-orange text-white shadow-lg hover:opacity-90 transition-opacity mt-4">Check Availability</Button></div><div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3"><a href={`tel:${venue.phone || ''}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-medium"><Phone className="w-4 h-4" /> Call</a><a href={`mailto:${venue.website ? `info@${venue.website}` : ''}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-medium"><Mail className="w-4 h-4" /> Email</a></div></Card></div></div>
        </div>
      </div>
    </div>
  )
}

export default VenueDetailsPage
