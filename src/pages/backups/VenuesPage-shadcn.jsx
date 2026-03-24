import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, MapPin, Users, ArrowRight, Building, Trophy, HeadphonesIcon, Calendar, Wifi, Car, Utensils } from 'lucide-react'
import { Button } from '../../shared/ui/button'
import { Input } from '../../shared/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../shared/ui/card'
import { Badge } from '../../shared/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../shared/ui/select'

const VenuesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')

  const venueCategories = [
    { name: "Beach Clubs", icon: "🏖️", count: 28, image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop" },
    { name: "Rooftop Bars", icon: "🌃", count: 32, image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop" },
    { name: "Fine Dining", icon: "🍽️", count: 45, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop" },
    { name: "Conference Centers", icon: "💼", count: 22, image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop" },
    { name: "Banquet Halls", icon: "🎭", count: 35, image: "https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=400&h=300&fit=crop" },
    { name: "Garden Venues", icon: "🌳", count: 18, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=300&fit=crop" }
  ]

  const featuredVenues = [
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
      image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop",
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
      image: "https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?w=400&h=300&fit=crop",
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
    }
  ]

  const topLocations = [
    { name: "Downtown Dubai", venues: 45, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop" },
    { name: "Palm Jumeirah", venues: 32, image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&h=300&fit=crop" },
    { name: "Dubai Marina", venues: 38, image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop" },
    { name: "DIFC", venues: 28, image: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=400&h=300&fit=crop" }
  ]

  const venueFeatures = [
    { icon: Building, title: "150+ Premium Venues", description: "Carefully curated selection of Dubai's finest venues" },
    { icon: Trophy, title: "Quality Verified", description: "All venues are inspected and quality-certified" },
    { icon: HeadphonesIcon, title: "Expert Support", description: "Dedicated team to help you find the perfect venue" }
  ]

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      'WiFi': Wifi,
      'Parking': Car,
      'Valet Parking': Car,
      'Catering': Utensils,
      'AV Equipment': Building,
      'Sound System': Building,
      'Lighting': Building
    }
    return iconMap[amenity] || Building
  }

  const filteredVenues = featuredVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || venue.category.toLowerCase().includes(selectedCategory.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || venue.location.toLowerCase().includes(selectedLocation.toLowerCase())
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
            <Building className="w-4 h-4 mr-2" />
            Discover Premium Venues in Dubai
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Venue Space
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            From beachfront clubs to rooftop bars, discover venues that make your events unforgettable
          </p>
          
          {/* Enhanced Search Bar */}
          <Card className="max-w-4xl mx-auto mb-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search venues by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="beach">Beach Clubs</SelectItem>
                    <SelectItem value="rooftop">Rooftop Bars</SelectItem>
                    <SelectItem value="fine dining">Fine Dining</SelectItem>
                    <SelectItem value="conference">Conference Centers</SelectItem>
                    <SelectItem value="banquet">Banquet Halls</SelectItem>
                    <SelectItem value="garden">Garden Venues</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="lg" className="h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { label: "Premium Venues", value: "150+" },
              { label: "Happy Clients", value: "25K+" },
              { label: "Events Hosted", value: "100K+" },
              { label: "Average Rating", value: "4.9★" }
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

      {/* Venue Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect venue type for your special occasion
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venueCategories.map((category, index) => (
              <Link key={index} to={`/explore?tab=venues&category=${encodeURIComponent(category.name)}`}>
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
                        {category.count} venues
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-4xl mb-2">{category.icon}</div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      Perfect for your special {category.name.toLowerCase()} events
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Venues
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked premium venues for your events
              </p>
            </div>
            <Button variant="outline" size="lg" asChild>
              <Link to="/explore" className="flex items-center gap-2">
                View All Venues
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVenues.map((venue) => (
              <Link key={venue.id} to={`/venues/${venue.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 bg-white">
                  <div className="relative">
                    <img 
                      src={venue.image} 
                      alt={venue.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-gray-900 hover:bg-white">
                      {venue.category}
                    </Badge>
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
                      <div className="flex items-center gap-1 text-white text-sm">
                        <Users className="w-3 h-3" />
                        {venue.capacity}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{venue.rating}</span>
                      </div>
                      <span className="text-gray-500">({venue.reviews} reviews)</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <MapPin className="w-4 h-4" />
                      {venue.location}
                    </div>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {venue.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {venue.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{venue.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-bold text-purple-600">{venue.priceRange}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          {venue.upcomingEvents} upcoming events
                        </div>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredVenues.length === 0 && (
            <Card className="text-center py-16">
              <CardContent>
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No venues found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all venues
                </p>
                <Button asChild>
                  <Link to="/explore">Browse All Venues</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Top Locations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Popular Locations
            </h2>
            <p className="text-xl text-gray-600">
              Explore venues in Dubai's most sought-after areas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {topLocations.map((location, index) => (
              <Link key={index} to={`/explore?tab=venues&location=${encodeURIComponent(location.name)}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-0 bg-white">
                  <div className="relative h-40">
                    <img 
                      src={location.image} 
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-lg font-bold mb-1">{location.name}</h3>
                      <p className="text-sm text-white/80">{location.venues} venues</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose Our Venues?
            </h2>
            <p className="text-xl text-purple-100">
              We ensure every venue meets our high standards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {venueFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-purple-100">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Book Your Perfect Venue?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let our venue experts help you find the ideal space for your next event
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Building className="w-5 h-5 mr-2" />
              Browse All Venues
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <HeadphonesIcon className="w-5 h-5 mr-2" />
              Contact Expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default VenuesPage
