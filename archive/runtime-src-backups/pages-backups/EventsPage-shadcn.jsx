import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, MapPin, Clock, Calendar, Users, ArrowRight, Filter, Gift } from 'lucide-react'
import { Button } from '../../shared/ui/button'
import { Input } from '../../shared/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/ui/card'
import { Badge } from '../../shared/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/ui/select'

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  const featuredCategories = [
    { name: "Luxury Brunch", icon: "🥂", count: 45, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
    { name: "Rooftop Parties", icon: "🌃", count: 32, image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop" },
    { name: "Beach Clubs", icon: "🏖️", count: 28, image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop" },
    { name: "Corporate Events", icon: "💼", count: 38, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
    { name: "Weddings", icon: "💒", count: 25, image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=300&fit=crop" },
    { name: "Live Music", icon: "🎵", count: 42, image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop" }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Luxury Brunch at Burj Al Arab",
      venue: "Al Muntaha Restaurant",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
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
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop",
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
    { name: "Valentine's Day Special", growth: "+45%", bookings: 234 },
    { name: "Weekend Brunch Series", growth: "+32%", bookings: 189 },
    { name: "Ladies Night Events", growth: "+28%", bookings: 156 }
  ]

  const filteredEvents = upcomingEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || event.location.toLowerCase().includes(selectedLocation.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Gift className="w-4 h-4 mr-2" />
            Discover Amazing Events in Dubai
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Event Experience
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            From luxury brunches to rooftop parties, discover curated events that match your style
          </p>
          
          {/* Enhanced Search Bar */}
          <Card className="max-w-4xl mx-auto mb-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search events, venues, or experiences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="luxury brunch">Luxury Brunch</SelectItem>
                    <SelectItem value="party">Rooftop Parties</SelectItem>
                    <SelectItem value="beach">Beach Clubs</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="wedding">Weddings</SelectItem>
                    <SelectItem value="music">Live Music</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="h-12 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Active Events", value: "200+" },
              { label: "Happy Guests", value: "50K+" },
              { label: "Partner Venues", value: "150+" },
              { label: "Average Rating", value: "4.8★" }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/20 backdrop-blur-sm border-white/30 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore events tailored to your interests and preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCategories.map((category, index) => (
              <Link key={index} to={`/explore?tab=events&category=${encodeURIComponent(category.name)}`}>
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border-0 bg-white h-80">
                  <div className="relative h-48">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                        {category.count} events
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-4xl mb-2">{category.icon}</div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      Discover amazing {category.name.toLowerCase()} experiences
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Upcoming Events
              </h2>
              <p className="text-xl text-gray-600">
                Don't miss these amazing experiences
              </p>
            </div>
            <Button variant="outline" size="lg" asChild>
              <Link to="/explore" className="flex items-center gap-2">
                View All Events
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <Link key={event.id} to={`/events/${event.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 bg-white">
                  <div className="relative">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900 hover:bg-white">
                      {event.category}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <Users className="w-3 h-3" />
                        {event.attendees}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{event.rating}</span>
                      </div>
                      <span className="text-gray-500">({event.reviews} reviews)</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.venue}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-orange-600">AED {event.price}</span>
                        <span className="text-gray-500 text-sm ml-1">per person</span>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all events
                </p>
                <Button asChild>
                  <Link to="/explore">Browse All Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Trending Now
            </h2>
            <p className="text-xl text-orange-100">
              See what's popular this week
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trendingEvents.map((trend, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">📈</div>
                  <h3 className="text-xl font-bold text-white mb-2">{trend.name}</h3>
                  <div className="text-3xl font-bold text-yellow-300 mb-2">{trend.growth}</div>
                  <p className="text-orange-100">{trend.bookings} bookings this week</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Next Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Set The Table for their special moments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              <Calendar className="w-5 h-5 mr-2" />
              Browse All Events
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Gift className="w-5 h-5 mr-2" />
              Gift an Experience
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EventsPage
