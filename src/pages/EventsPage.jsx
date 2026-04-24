import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEventCategoriesCatalog, useEventsCatalog } from '../features/catalog'
import { matchesSelectedEventCategory, normalizeSelectedEventCategory } from '../features/catalog/utils/eventCategorySelection'
import EventCard from '../features/events/components/EventCard'
import DiscoveryResultsHeader from '../features/explore/components/DiscoveryResultsHeader'
import DiscoverySearchHero from '../features/explore/components/DiscoverySearchHero'
import { trendingEvents as trendingEventFixtures } from '../features/experiences/data'
import { Button } from '../shared/ui/button'
import { Card, CardContent } from '../shared/ui/card'

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const resultsRef = useRef(null)
  const { data: events = [], loading, error, retry } = useEventsCatalog(searchTerm)
  const { data: eventCategories = [] } = useEventCategoriesCatalog()

  const filteredEvents = useMemo(() => events.filter((event) => matchesSelectedEventCategory(event, selectedCategory, {
    primaryText: event.category,
    fallbackText: [event.title, ...(event.tags || [])],
  })), [events, selectedCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <DiscoverySearchHero
        backgroundImage="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&h=1080&fit=crop"
        backgroundAlt="Dubai Events"
        title="Discover Events"
        description="Find amazing experiences and events"
        searchPlaceholder="Search events..."
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        onSearchKeyDown={(e) => e.key === 'Enter' && resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        searchButtonClassName="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold text-white shadow-lg shrink-0 ml-2 hover:opacity-90 transition-opacity"
        searchButtonStyle={{ background: 'linear-gradient(to right, #A76DB7, #6CB5F8)' }}
        categoryItems={eventCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => setSelectedCategory((current) => current?.id === category.id ? null : normalizeSelectedEventCategory(category))}
        selectedCategoryClassName="flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-white text-brand-purple shadow-lg"
        categoryClassName="flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
      />

      <section ref={resultsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 scroll-target">
        <div className="max-w-7xl mx-auto">
          <DiscoveryResultsHeader
            title={selectedCategory || searchTerm ? 'Search Results' : 'Upcoming Events'}
            description={loading ? 'Loading events...' : selectedCategory || searchTerm ? `Found ${filteredEvents.length} events` : "Don't miss these amazing experiences"}
            ctaLabel="View All Events"
            ctaTo="/explore"
          />

          {loading && <Card><CardContent className="py-16 text-center text-gray-600">Loading live event catalog...</CardContent></Card>}
          {error && !loading && <Card><CardContent className="py-16 text-center"><h3 className="text-2xl font-bold text-gray-900 mb-2">Couldn't load events</h3><p className="text-gray-600 mb-6">{error.message}</p><Button onClick={retry}>Try again</Button></CardContent></Card>}
          {!loading && !error && filteredEvents.length > 0 && <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}</motion.div>}
          {!loading && !error && filteredEvents.length === 0 && <Card className="text-center py-16"><CardContent><div className="text-6xl mb-4">🔍</div><h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3><p className="text-gray-600 mb-6">Try adjusting your search criteria.</p><div className="flex gap-4 justify-center"><Button onClick={() => { setSearchTerm(''); setSelectedCategory('') }}>Clear Filters</Button><Button variant="outline" asChild><Link to="/explore">Browse Explore</Link></Button></div></CardContent></Card>}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16"><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending experiences</h2><p className="text-xl text-gray-600">Prototype editorial rail, separate from live search results</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{trendingEventFixtures.map((event) => <EventCard key={event.id} event={event} />)}</div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to book your next experience?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Join thousands of satisfied customers who trust Set The Table for their special moments</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white" asChild><Link to="/explore"><Calendar className="w-5 h-5 mr-2" />Browse All Events</Link></Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventsPage
