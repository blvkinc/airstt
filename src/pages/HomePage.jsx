import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEventCategoriesCatalog, useHomepageCatalog } from '../features/catalog'
import { matchesSelectedEventCategory, normalizeSelectedEventCategory } from '../features/catalog/utils/eventCategorySelection'
import EventCard from '../features/events/components/EventCard'
import { homeTopVenues } from '../features/experiences/data'
import PublicCategoryPillRow from '../shared/components/PublicCategoryPillRow'
import { Button } from '../shared/ui/button'
import ContentRailSection from '../shared/components/ContentRailSection'

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const resultsRef = useRef(null)
  const { data: placements, loading, error, retry } = useHomepageCatalog()
  const { data: categories = [] } = useEventCategoriesCatalog()

  const visiblePlacements = useMemo(() => (Array.isArray(placements) ? placements : [])
    .map((placement) => ({
      ...placement,
      events: (placement?.events || []).filter(({ event }) => {
        if (!event) return false

        const matchesSearch = !activeSearchTerm || [event.title, event.venue, event.location]
          .some((value) => value?.toLowerCase().includes(activeSearchTerm.toLowerCase()))
        const matchesCategory = matchesSelectedEventCategory(event, selectedCategory, {
          primaryText: event.category,
          fallbackText: [event.title, event.venue],
        })

        return matchesSearch && matchesCategory
      }),
    }))
    .filter((placement) => placement.events.length > 0), [placements, activeSearchTerm, selectedCategory])

  const hasActiveFilters = Boolean(activeSearchTerm || selectedCategory)

  return <div className="min-h-screen bg-white">
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center"><div className="absolute inset-0 z-0"><img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&h=1080&fit=crop" alt="Hero Background" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" /></div><div className="relative z-10 w-full max-w-4xl px-4 text-center"><motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Unforgettable experiences <br className="hidden md:block" /> in Dubai</motion.h1><motion.p className="text-base sm:text-lg md:text-xl text-white/95 mb-10 font-medium max-w-2xl mx-auto px-4">Discover the city's best events, dining, and venues.</motion.p><motion.div className="max-w-3xl mx-auto px-4"><div className="bg-white p-2 rounded-full shadow-2xl flex items-center pl-4 sm:pl-6 pr-2 py-2"><Search className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 shrink-0" /><input type="text" placeholder="What are you looking for?" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (setActiveSearchTerm(searchTerm.trim()), resultsRef.current?.scrollIntoView({ behavior: 'smooth' }))} className="flex-1 bg-transparent border-none outline-none text-gray-800" /><Button className="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold bg-brand-purple text-white" onClick={() => { setActiveSearchTerm(searchTerm.trim()); resultsRef.current?.scrollIntoView({ behavior: 'smooth' }) }}>Search</Button></div></motion.div><PublicCategoryPillRow items={categories} selectedCategory={selectedCategory} onSelect={(category) => setSelectedCategory((current) => current?.id === category.id ? null : normalizeSelectedEventCategory(category))} rowClassName="flex flex-wrap justify-center gap-3 mt-8" selectedItemClassName="flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium backdrop-blur-md border bg-white text-gray-900 border-white shadow-lg" itemClassName="flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium backdrop-blur-md border bg-white/10 text-white border-white/20 hover:bg-white/20" /></div></section>
    <section ref={resultsRef} className="py-20 px-4 sm:px-6 lg:px-16 max-w-[1440px] mx-auto"><div className="flex justify-between items-end mb-10 gap-6"><div><h2 className="text-3xl font-bold text-gray-900 mb-2">{hasActiveFilters ? 'Search Results' : 'Trending this week'}</h2><p className="text-gray-500 text-lg">Live homepage editorial placements</p></div><Link to="/events" className="text-gray-900 font-semibold hover:underline flex items-center shrink-0">Show all <ChevronRight className="w-4 h-4 ml-1" /></Link></div>{loading && <div className="text-center text-gray-600 py-12">Loading homepage placements...</div>}{error && !loading && <div className="text-center py-12"><p className="text-gray-600 mb-4">{error.message}</p><Button onClick={retry}>Try again</Button></div>}{!loading && !error && <div className="space-y-12">{visiblePlacements.length > 0 ? visiblePlacements.map((placement) => <ContentRailSection key={placement.id} title={placement.title} subtitle={placement.subtitle} items={placement.events} getItemKey={({ eventId, event }) => eventId ?? event.id} renderItem={({ event }) => <EventCard event={event} hideRating showVenueLogoPlaceholder />} />) : <div className="text-center text-gray-600 py-12">No events match the current filters.</div>}</div>}</section>
    <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-16"><div className="max-w-[1440px] mx-auto"><h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Venues</h2><p className="text-gray-500 text-lg mb-10">Fixture-backed for this slice</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">{homeTopVenues.map((venue) => <Link to={`/venues/${venue.id}`} key={venue.id} className="group block"><div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4"><img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">{venue.rating} ★</div></div><h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">{venue.name}</h3><p className="text-gray-500">{venue.location}</p></Link>)}</div></div></section>
  </div>
}

export default HomePage
