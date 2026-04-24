import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building, Trophy, HeadphonesIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../shared/ui/button'
import { Card, CardContent } from '../shared/ui/card'
import DiscoveryResultsHeader from '../features/explore/components/DiscoveryResultsHeader'
import DiscoverySearchHero from '../features/explore/components/DiscoverySearchHero'
import VenueCard from '../features/venues/components/VenueCard'
import { useVenueTypesCatalog, useVenuesCatalog } from '../features/catalog'
import { topVenueLocations } from '../features/experiences/data'

const smoothScrollTo = (element, offset = 80) => {
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - offset

  window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
}

const VenuesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVenueTypeIds, setSelectedVenueTypeIds] = useState([])
  const resultsRef = useRef(null)

  useEffect(() => {
    if ((searchTerm || selectedVenueTypeIds.length > 0) && resultsRef.current) {
      setTimeout(() => smoothScrollTo(resultsRef.current, 100), 150)
    }
  }, [searchTerm, selectedVenueTypeIds])

  const handleSearch = () => {
    if (resultsRef.current) {
      setTimeout(() => smoothScrollTo(resultsRef.current, 100), 150)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const { data: venueTypesResponse, loading: venueTypesLoading } = useVenueTypesCatalog()
  const { data: venues = [], loading, error, retry } = useVenuesCatalog(searchTerm, selectedVenueTypeIds)
  const venueTypes = Array.isArray(venueTypesResponse) ? venueTypesResponse : []

  const venueCategories = venueTypes.map((venueType) => ({
    id: venueType.id,
    name: venueType.name,
  }))

  const selectedCategoryLabel = venueTypes
    .filter((venueType) => selectedVenueTypeIds.includes(venueType.id))
    .map((venueType) => venueType.name)
    .join(', ')

  const handleCategorySelect = (category) => {
    setSelectedVenueTypeIds((current) => current.includes(category.id)
      ? current.filter((id) => id !== category.id)
      : [...current, category.id])
  }

  const venueFeatures = [
    { icon: Building, title: '150+ Premium Venues', description: "Carefully curated selection of Dubai's finest venues" },
    { icon: Trophy, title: 'Quality Verified', description: 'All venues are inspected and quality-certified' },
    { icon: HeadphonesIcon, title: 'Expert Support', description: 'Dedicated team to help you find the perfect venue' },
  ]

  const topLocations = topVenueLocations

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple/10 via-white to-brand-blue/10">
      <DiscoverySearchHero
        backgroundImage="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&h=1080&fit=crop"
        backgroundAlt="Dubai Venues"
        title="Find Venues"
        description="Discover perfect spaces for your events"
        searchPlaceholder="Search venues..."
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onSearchKeyDown={handleKeyPress}
        searchButtonClassName="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold text-white shadow-lg shrink-0 ml-2 hover:opacity-90 transition-opacity"
        searchButtonStyle={{ background: 'linear-gradient(to right, #6CB5F8, #A76DB7)' }}
        categoryItems={venueCategories}
        selectedCategory={selectedVenueTypeIds}
        onCategorySelect={handleCategorySelect}
        selectedCategoryClassName="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center bg-white text-brand-blue shadow-lg"
        categoryClassName="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
      />

      <section ref={resultsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 scroll-target">
        <div className="max-w-7xl mx-auto">
          <DiscoveryResultsHeader
            title={selectedCategoryLabel || searchTerm ? 'Search Results' : 'Featured Venues'}
            description={selectedCategoryLabel || searchTerm ? `Found ${venues.length} venues${selectedCategoryLabel ? ` for ${selectedCategoryLabel}` : ''}` : 'Handpicked premium venues for your events'}
            ctaLabel="View All Venues"
            ctaTo="/explore"
          />

          {selectedVenueTypeIds.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {venueTypes.filter((venueType) => selectedVenueTypeIds.includes(venueType.id)).map((venueType) => (
                <button
                  key={venueType.id}
                  type="button"
                  onClick={() => handleCategorySelect(venueType)}
                  className="rounded-full bg-brand-purple/10 px-3 py-1 text-sm font-medium text-brand-purple"
                >
                  {venueType.name} ×
                </button>
              ))}
            </div>
          )}

          {(loading || venueTypesLoading) && <Card><CardContent className="py-16 text-center text-gray-600">Loading live venue catalog...</CardContent></Card>}
          {error && !loading && !venueTypesLoading && <Card><CardContent className="py-16 text-center"><h3 className="text-2xl font-bold text-gray-900 mb-2">Couldn't load venues</h3><p className="text-gray-600 mb-6">{error.message}</p><Button onClick={retry}>Try again</Button></CardContent></Card>}
          {!loading && !venueTypesLoading && !error && venues.length > 0 && <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>{venues.map((venue, index) => <motion.div key={venue.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }} viewport={{ once: true }} whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}><VenueCard venue={venue} /></motion.div>)}</motion.div>}

          {!loading && !venueTypesLoading && !error && venues.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <Card className="text-center py-16"><CardContent><motion.div className="text-6xl mb-4" animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>🏢</motion.div><motion.h3 className="text-2xl font-bold text-gray-900 mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>No venues found</motion.h3><motion.p className="text-gray-600 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>Try adjusting your search criteria or browse all venues</motion.p><motion.div className="flex gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button onClick={() => { setSearchTerm(''); setSelectedVenueTypeIds([]) }}>Clear Filters</Button></motion.div><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button variant="outline" asChild><Link to="/explore">Browse All Venues</Link></Button></motion.div></motion.div></CardContent></Card>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}><motion.h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>Popular Locations</motion.h2><motion.p className="text-xl text-gray-600" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>Explore venues in Dubai's most sought-after areas</motion.p></motion.div>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>{topLocations.map((location, index) => <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }} viewport={{ once: true }} whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}><Link to={`/explore?tab=venues&location=${encodeURIComponent(location.name)}`}><Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white"><div className="relative h-40"><motion.img src={location.image} alt={location.name} className="w-full h-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.6, ease: 'easeOut' }} /><motion.div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" initial={{ opacity: 0.6 }} whileHover={{ opacity: 0.8 }} transition={{ duration: 0.3 }} /><motion.div className="absolute bottom-4 left-4 text-white" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (index * 0.1), duration: 0.4 }}><motion.h3 className="text-lg font-bold mb-1" whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>{location.name}</motion.h3><motion.p className="text-sm text-white/80" whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}>{location.venues} venues</motion.p></motion.div></div></Card></Link></motion.div>)}</motion.div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white"><div className="max-w-7xl mx-auto"><motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}><motion.h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>Why choose our venues</motion.h2><motion.p className="text-xl text-gray-600" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>Every venue meets our high standards</motion.p></motion.div><motion.div className="grid grid-cols-1 md:grid-cols-3 gap-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>{venueFeatures.map((feature, index) => { const IconComponent = feature.icon; return <motion.div key={index} className="text-center group" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 + (index * 0.2), ease: 'easeOut' }} viewport={{ once: true }} whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}><motion.div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors duration-300" whileHover={{ scale: 1.1, rotate: 360 }} transition={{ type: 'spring', stiffness: 260, damping: 20, rotate: { duration: 0.6 } }}><IconComponent className="w-8 h-8 text-gray-700" /></motion.div><motion.h3 className="text-xl font-semibold text-gray-900 mb-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 + (index * 0.2), duration: 0.4 }} viewport={{ once: true }}>{feature.title}</motion.h3><motion.p className="text-gray-600 leading-relaxed" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 + (index * 0.2), duration: 0.4 }} viewport={{ once: true }}>{feature.description}</motion.p></motion.div> })}</motion.div></div></section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50"><div className="max-w-4xl mx-auto text-center"><motion.h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>Ready to book your perfect venue?</motion.h2><motion.p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>Let our venue experts help you find the ideal space for your next event</motion.p><motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white"><motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}><Building className="w-5 h-5 mr-2" /></motion.div>Browse All Venues</Button></motion.div><motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100"><motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}><HeadphonesIcon className="w-5 h-5 mr-2" /></motion.div>Contact Expert</Button></motion.div></motion.div></div></section>
    </div>
  )
}

export default VenuesPage
