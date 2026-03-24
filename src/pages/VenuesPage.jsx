import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Building, Trophy, HeadphonesIcon, Umbrella, Building2, Briefcase, Flower2, Landmark, Utensils } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { Card, CardContent } from '../shared/ui/card'
import VenueCard from '../components/VenueCard'
import SaianaImage1 from '../assets/demo/BEBEACH1.webp'

// Enhanced smooth scroll utility
const smoothScrollTo = (element, offset = 80) => {
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

const VenuesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const resultsRef = useRef(null)

  // Scroll to results when search or category changes
  useEffect(() => {
    if ((searchTerm || selectedCategory) && resultsRef.current) {
      // Add a small delay to ensure DOM is updated and add smooth animation
      setTimeout(() => {
        smoothScrollTo(resultsRef.current, 100)
      }, 150)
    }
  }, [searchTerm, selectedCategory])

  const handleSearch = () => {
    if (resultsRef.current) {
      setTimeout(() => {
        smoothScrollTo(resultsRef.current, 100)
      }, 150)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? '' : categoryName)
    // Scroll will be triggered by useEffect
  }

  const venueCategories = [
    { name: "Beach Club", icon: Umbrella },
    { name: "Rooftop", icon: Building2 },
    { name: "Conference", icon: Briefcase },
    { name: "Garden", icon: Flower2 },
    { name: "Banquet", icon: Landmark },
    { name: "Fine Dining", icon: Utensils }
  ]

  const featuredVenues = [
    {
      id: 99,
      name: "BeBeach Dubai",
      category: "Beach Club",
      image: SaianaImage1,
      rating: 4.9,
      reviews: 1205,
      location: "Dubai Harbour",
      capacity: 500,
      priceRange: "AED 320-600",
      amenities: ["Beach Access", "Pool", "Valet Parking", "Entertainment"],
      upcomingEvents: 4
    },
    {
      id: 1,
      name: "Azure Beach Club",
      category: "Beach Club",
      image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 156,
      location: "Palm Jumeirah",
      capacity: 300,
      priceRange: "AED 200-400",
      amenities: ["Beach Access", "Pool", "Valet Parking", "WiFi"],
      upcomingEvents: 8
    },
    {
      id: 2,
      name: "Sky Lounge Dubai",
      category: "Rooftop Bar",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 89,
      location: "Downtown Dubai",
      capacity: 200,
      priceRange: "AED 150-300",
      amenities: ["City Views", "Cocktail Bar", "Outdoor Seating", "DJ"],
      upcomingEvents: 12
    },
    {
      id: 3,
      name: "Grand Convention Center",
      category: "Conference Center",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 203,
      location: "DIFC",
      capacity: 500,
      priceRange: "AED 300-600",
      amenities: ["AV Equipment", "WiFi", "Catering", "Parking"],
      upcomingEvents: 15
    },
    {
      id: 4,
      name: "Garden Paradise",
      category: "Garden Venue",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 92,
      location: "Jumeirah",
      capacity: 150,
      priceRange: "AED 180-350",
      amenities: ["Garden Setting", "Natural Light", "Parking", "Catering"],
      upcomingEvents: 6
    },
    {
      id: 5,
      name: "Elite Banquet Hall",
      category: "Banquet Hall",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 178,
      location: "Business Bay",
      capacity: 400,
      priceRange: "AED 250-500",
      amenities: ["Grand Ballroom", "Stage", "Sound System", "Lighting"],
      upcomingEvents: 20
    },
    {
      id: 6,
      name: "Gourmet Restaurant",
      category: "Fine Dining",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 245,
      location: "Burj Al Arab",
      capacity: 80,
      priceRange: "AED 400-800",
      amenities: ["Michelin Star", "Wine Cellar", "Private Dining", "Valet"],
      upcomingEvents: 4
    },
    {
      id: 7,
      name: "Harbor View Terrace",
      category: "Rooftop Bar",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 134,
      location: "Dubai Marina",
      capacity: 150,
      priceRange: "AED 200-450",
      amenities: ["Harbor Views", "Live DJ", "Cocktails", "Outdoor"],
      upcomingEvents: 9
    },
    {
      id: 8,
      name: "Desert Oasis Resort",
      category: "Garden Venue",
      image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 312,
      location: "Desert Conservation Reserve",
      capacity: 1000,
      priceRange: "AED 500-1000",
      amenities: ["Luxury Tents", "Dune Views", "Private Pool", "Spa"],
      upcomingEvents: 2
    }
  ]

  const topLocations = [
    { name: "Downtown Dubai", venues: 45, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop" },
    { name: "Palm Jumeirah", venues: 32, image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&h=300&fit=crop" },
    { name: "Dubai Marina", venues: 38, image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop" },
    { name: "DIFC", venues: 28, image: "https://images.unsplash.com/photo-1582037928769-181f2644ec27?w=400&h=300&fit=crop" }
  ]

  const venueFeatures = [
    { icon: Building, title: "150+ Premium Venues", description: "Carefully curated selection of Dubai's finest venues" },
    { icon: Trophy, title: "Quality Verified", description: "All venues are inspected and quality-certified" },
    { icon: HeadphonesIcon, title: "Expert Support", description: "Dedicated team to help you find the perfect venue" }
  ]

  const filteredVenues = featuredVenues.filter(venue => {
    const matchesSearch = !searchTerm ||
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || venue.category.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-purple/10 via-white to-brand-blue/10">
      {/* Minimal Elegant Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <motion.img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920&h=1080&fit=crop"
            alt="Dubai Venues"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Minimal Typography */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Find Venues
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Discover perfect spaces for your events
          </motion.p>

          {/* Ultra Minimal Search Bar */}
          <motion.div
            className="max-w-lg mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-20"
            >
              <div className="bg-white p-2 rounded-full shadow-2xl flex items-center pl-4 sm:pl-6 pr-2 py-2">
                <Search className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-base sm:text-lg w-full min-w-0"
                />
                <Button
                  onClick={handleSearch}
                  className="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold text-white shadow-lg shrink-0 ml-2 hover:opacity-90 transition-opacity"
                  style={{
                    background: 'linear-gradient(to right, #6CB5F8, #A76DB7)',
                  }}
                >
                  Search
                </Button>
              </div>
            </motion.div>

            {/* Category Filters Under Search Bar */}
            <motion.div
              className="flex flex-wrap justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {venueCategories.map((category, index) => {
                const Icon = category.icon
                return (
                  <motion.button
                    key={category.name}
                    onClick={() => handleCategorySelect(category.name)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center ${selectedCategory === category.name
                      ? 'bg-white text-brand-blue shadow-lg'
                      : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
                      }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.7 + (index * 0.1),
                      ease: "easeOut"
                    }}
                    whileHover={{
                      scale: 1.05,
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </motion.button>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Venues */}
      <section ref={resultsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 scroll-target">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex justify-between items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                {selectedCategory || searchTerm ? 'Search Results' : 'Featured Venues'}
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {selectedCategory || searchTerm ? `Found ${filteredVenues.length} venues` : 'Handpicked premium venues for your events'}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="lg" asChild>
                <Link to="/explore" className="flex items-center gap-2">
                  View All Venues
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {filteredVenues.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <VenueCard venue={venue} />
              </motion.div>
            ))}
          </motion.div>

          {filteredVenues.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="text-center py-16">
                <CardContent>
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    🏢
                  </motion.div>
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    No venues found
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Try adjusting your search criteria or browse all venues
                  </motion.p>
                  <motion.div
                    className="flex gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={() => { setSearchTerm(''); setSelectedCategory('') }}>
                        Clear Filters
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="outline" asChild>
                        <Link to="/explore">Browse All Venues</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Top Locations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Popular Locations
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Explore venues in Dubai's most sought-after areas
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {topLocations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <Link to={`/explore?tab=venues&location=${encodeURIComponent(location.name)}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 bg-white">
                    <div className="relative h-40">
                      <motion.img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                        initial={{ opacity: 0.6 }}
                        whileHover={{ opacity: 0.8 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute bottom-4 left-4 text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1), duration: 0.4 }}
                      >
                        <motion.h3
                          className="text-lg font-bold mb-1"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {location.name}
                        </motion.h3>
                        <motion.p
                          className="text-sm text-white/80"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {location.venues} venues
                        </motion.p>
                      </motion.div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Elegant Minimal Style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Why choose our venues
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Every venue meets our high standards
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {venueFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <motion.div
                  key={index}
                  className="text-center group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + (index * 0.2),
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors duration-300"
                    whileHover={{
                      scale: 1.1,
                      rotate: 360
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      rotate: { duration: 0.6 }
                    }}
                  >
                    <IconComponent className="w-8 h-8 text-gray-700" />
                  </motion.div>
                  <motion.h3
                    className="text-xl font-semibold text-gray-900 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 + (index * 0.2), duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {feature.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.7 + (index * 0.2), duration: 0.4 }}
                    viewport={{ once: true }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Elegant Minimal Style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to book your perfect venue?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Let our venue experts help you find the ideal space for your next event
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Building className="w-5 h-5 mr-2" />
                </motion.div>
                Browse All Venues
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <HeadphonesIcon className="w-5 h-5 mr-2" />
                </motion.div>
                Contact Expert
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default VenuesPage


