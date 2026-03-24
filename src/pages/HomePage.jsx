import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ChevronRight, Coffee, Building2, Umbrella, Utensils, Calendar, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../shared/ui/button'
import { Card, CardContent } from '../shared/ui/card'
import EventCard from '../components/EventCard'
import SaianaImage from '../assets/demo/BEBEACH1.webp'

const smoothScrollTo = (element, offset = 80) => {
  if (!element) return
  const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
  const offsetPosition = elementPosition - offset
  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const resultsRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if ((activeSearchTerm || selectedCategory) && resultsRef.current) {
      setTimeout(() => {
        smoothScrollTo(resultsRef.current, 100)
      }, 150)
    }
  }, [activeSearchTerm, selectedCategory])

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setActiveSearchTerm(searchTerm.trim())
    }
  }

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? '' : categoryName)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const featuredEvents = [
    {
      id: 99,
      title: "Saiana Brunch",
      venue: "BeBeach Dubai",
      image: SaianaImage,
      rating: 4.9,
      reviews: 842,
      price: 320,
      location: "Dubai Harbour",
      category: "Brunch",
      time: "2:00 PM - 6:00 PM"
    },
    {
      id: 1,
      title: "Luxury Brunch at Burj Al Arab",
      venue: "Al Muntaha Restaurant",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
      rating: 4.8,
      reviews: 124,
      price: 299,
      location: "Burj Al Arab",
      category: "Brunch",
      time: "11:00 AM - 3:00 PM"
    },
    {
      id: 2,
      title: "Rooftop Party Experience",
      venue: "Sky Lounge Dubai",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop", // Updated image
      rating: 4.6,
      reviews: 89,
      price: 199,
      location: "Downtown Dubai",
      category: "Party",
      time: "7:00 PM - 12:00 AM"
    },
    {
      id: 3,
      title: "Beach Club Brunch",
      venue: "Azure Beach Club",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      rating: 4.7,
      reviews: 156,
      price: 249,
      location: "Palm Jumeirah",
      category: "Beach",
      time: "12:00 PM - 4:00 PM"
    },
    {
      id: 4,
      title: "Fine Dining Experience",
      venue: "Michelin Star Restaurant",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      rating: 4.9,
      reviews: 203,
      price: 399,
      location: "DIFC",
      category: "Dining",
      time: "7:00 PM - 11:00 PM"
    }
  ]

  const categories = [
    { name: "Brunch", icon: Coffee },
    { name: "Rooftop", icon: Building2 },
    { name: "Beach", icon: Umbrella },
    { name: "Dining", icon: Utensils },
    { name: "Events", icon: Calendar },
    { name: "Nightlife", icon: Moon }
  ]

  const topVenues = [
    {
      id: 99,
      name: "BeBeach Dubai",
      image: SaianaImage,
      rating: 4.9,
      reviews: 1205,
      location: "Dubai Harbour"
    },
    {
      id: 1,
      name: "Azure Beach Club",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      rating: 4.7,
      reviews: 156,
      location: "Palm Jumeirah"
    },
    {
      id: 2,
      name: "Sky Lounge Dubai",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
      rating: 4.6,
      reviews: 89,
      location: "Downtown Dubai"
    },
    {
      id: 3,
      name: "Grand Ballroom",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
      rating: 4.8,
      reviews: 124,
      location: "Business Bay"
    },
    {
      id: 4,
      name: "Marina Yacht Club",
      image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&h=600&fit=crop",
      rating: 4.9,
      reviews: 156,
      location: "Dubai Marina"
    }
  ]

  const filteredEvents = featuredEvents.filter(event => {
    const matchesSearch = !activeSearchTerm ||
      event.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(activeSearchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || event.category.toLowerCase().includes(selectedCategory.toLowerCase())
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean Airbnb Style */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image with optimized overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1920&h=1080&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay for readability, not overwhelming */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-4xl px-4 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-sm tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Unforgettable experiences <br className="hidden md:block" /> in Dubai
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-white/95 mb-10 font-medium max-w-2xl mx-auto drop-shadow-sm px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            Discover the city's best events, dining, and venues.
          </motion.p>

          {/* Floating Pill Search Bar */}
          <motion.div
            className="max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white p-2 rounded-full shadow-2xl flex items-center pl-4 sm:pl-6 pr-2 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 shrink-0" />
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-base sm:text-lg w-full min-w-0"
              />
              <Button
                className="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold bg-brand-purple text-white hover:bg-brand-purple/90 transition-opacity shadow-lg shrink-0 ml-2"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </motion.div>

          {/* Quick Category Pills - Scrollable on mobile */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-8 overflow-x-auto pb-2 -mx-4 px-4 mask-gradient-x md:overflow-visible md:pb-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={`flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-medium backdrop-blur-md transition-all duration-300 border whitespace-nowrap ${selectedCategory === category.name
                  ? 'bg-white text-gray-900 border-white shadow-lg'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
              >
                <category.icon strokeWidth={1.5} className="w-4 h-4 mr-2" />
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Experiences - Clean Grid */}
      <section ref={resultsRef} className="py-20 px-4 sm:px-6 lg:px-16 max-w-[1440px] mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {searchTerm || selectedCategory ? 'Search Results' : 'Trending this week'}
            </h2>
            <p className="text-gray-500 text-lg">Curated experiences just for you</p>
          </div>
          <Link to="/events" className="text-gray-900 font-semibold hover:underline flex items-center">
            Show all <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Venues Section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-16">
        <div className="max-w-[1440px] mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Venues</h2>
          <p className="text-gray-500 text-lg mb-10">Explore the city's finest locations</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topVenues.map((venue) => (
              <Link to={`/venues/${venue.id}`} key={venue.id} className="group block">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                    {venue.rating} ★
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">{venue.name}</h3>
                <p className="text-gray-500">{venue.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

