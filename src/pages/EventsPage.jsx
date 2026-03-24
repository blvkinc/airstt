import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Calendar, Gift, Coffee, PartyPopper, Briefcase, Music, Heart, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../shared/ui/button'
import { Input } from '../shared/ui/input'
import { Card, CardContent } from '../shared/ui/card'
import EventCard from '../components/EventCard'

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

const EventsPage = () => {
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

  const eventCategories = [
    { name: "Brunch", icon: Coffee },
    { name: "Party", icon: PartyPopper },
    { name: "Corporate", icon: Briefcase },
    { name: "Live Music", icon: Music },
    { name: "Wedding", icon: Heart },
    { name: "Nightlife", icon: Moon }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Luxury Brunch at Burj Al Arab",
      venue: "Al Muntaha Restaurant",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
      date: "Feb 20, 2024",
      time: "11:00 AM - 3:00 PM",
      price: 299,
      rating: 4.8,
      reviews: 124,
      location: "Burj Al Arab",
      category: "Luxury Brunch",
      attendees: 45
    },
    {
      id: 2,
      title: "Rooftop Party Experience",
      venue: "Sky Lounge Dubai",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
      date: "Feb 22, 2024",
      time: "7:00 PM - 12:00 AM",
      price: 199,
      rating: 4.6,
      reviews: 89,
      location: "Downtown Dubai",
      category: "Party",
      attendees: 120
    },
    {
      id: 3,
      title: "Beach Club Brunch",
      venue: "Azure Beach Club",
      image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop",
      date: "Feb 25, 2024",
      time: "12:00 PM - 4:00 PM",
      price: 249,
      rating: 4.7,
      reviews: 156,
      location: "Palm Jumeirah",
      category: "Beach Brunch",
      attendees: 80
    },
    {
      id: 4,
      title: "Corporate Networking Event",
      venue: "Business Bay Hotel",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      date: "Feb 28, 2024",
      time: "6:00 PM - 10:00 PM",
      price: 149,
      rating: 4.5,
      reviews: 67,
      location: "Business Bay",
      category: "Corporate",
      attendees: 200
    },
    {
      id: 5,
      title: "Live Jazz Night",
      venue: "Blue Note Dubai",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop",
      date: "Mar 2, 2024",
      time: "8:00 PM - 11:00 PM",
      price: 99,
      rating: 4.9,
      reviews: 203,
      location: "DIFC",
      category: "Live Music",
      attendees: 150
    },
    {
      id: 6,
      title: "Wedding Reception Package",
      venue: "Grand Ballroom",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop",
      date: "Mar 5, 2024",
      time: "7:00 PM - 12:00 AM",
      price: 899,
      rating: 4.8,
      reviews: 89,
      location: "Jumeirah",
      category: "Wedding",
      attendees: 300
    }
  ]

  const trendingEvents = [
    {
      id: 7,
      title: "Valentine's Day Special Dinner",
      venue: "Romantic Rooftop Restaurant",
      image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&h=300&fit=crop",
      date: "Feb 14, 2024",
      time: "7:00 PM - 11:00 PM",
      price: 450,
      rating: 4.9,
      reviews: 234,
      location: "Downtown Dubai",
      category: "Fine Dining",
      attendees: 60,
      trending: true
    },
    {
      id: 8,
      title: "Weekend Brunch Series",
      venue: "Garden Terrace",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      date: "Every Saturday",
      time: "11:00 AM - 4:00 PM",
      price: 189,
      rating: 4.7,
      reviews: 189,
      location: "Jumeirah",
      category: "Brunch",
      attendees: 120,
      trending: true
    },
    {
      id: 9,
      title: "Ladies Night Exclusive",
      venue: "Skybar Lounge",
      image: "https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?w=800&h=600&fit=crop",
      date: "Every Thursday",
      time: "8:00 PM - 2:00 AM",
      price: 156,
      rating: 4.6,
      reviews: 156,
      location: "Marina",
      category: "Nightlife",
      attendees: 200,
      trending: true
    },
    {
      id: 10,
      title: "Desert Safari & Dinner",
      venue: "Arabian Dunes Camp",
      image: "https://images.unsplash.com/photo-1451337516015-6b6fcd1c56ab?w=800&h=600&fit=crop",
      date: "Daily",
      time: "3:00 PM - 9:00 PM",
      price: 299,
      rating: 4.9,
      reviews: 450,
      location: "Dubai Desert",
      category: "Adventure",
      attendees: 50,
      trending: true
    }
  ]

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = !searchTerm ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || event.category.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Minimal Elegant Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <motion.img
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&h=1080&fit=crop"
            alt="Dubai Events"
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
            Discover Events
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Find amazing experiences and events
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-base sm:text-lg w-full min-w-0"
                />
                <Button
                  onClick={handleSearch}
                  className="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold text-white shadow-lg shrink-0 ml-2 hover:opacity-90 transition-opacity"
                  style={{
                    background: 'linear-gradient(to right, #A76DB7, #6CB5F8)',
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
              {eventCategories.map((category, index) => (
                <motion.button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.name
                    ? 'bg-white text-brand-purple shadow-lg'
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
                  <category.icon strokeWidth={1.5} className="w-4 h-4 mr-2" />
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
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
                {selectedCategory || searchTerm ? 'Search Results' : 'Upcoming Events'}
              </motion.h2>
              <motion.p
                className="text-xl text-gray-600"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {selectedCategory || searchTerm ? `Found ${filteredEvents.length} events` : "Don't miss these amazing experiences"}
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
                  View All Events
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
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
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
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>

          {filteredEvents.length === 0 && (
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
                    🔍
                  </motion.div>
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    No events found
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Try adjusting your search criteria or browse all events
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
                        <Link to="/explore">Browse All Events</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      {/* Trending Section - Elegant Minimal Style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Trending experiences
            </motion.h2>
            <motion.p
              className="text-xl text-gray-600"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Popular events this week
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {trendingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >

                <EventCard event={event} />
              </motion.div>
            ))}
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
            Ready to book your next experience?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of satisfied customers who trust Set The Table for their special moments
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
                  <Calendar className="w-5 h-5 mr-2" />
                </motion.div>
                Browse All Events
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Gift className="w-5 h-5 mr-2" />
                </motion.div>
                Gift an Experience
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EventsPage
