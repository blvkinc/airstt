import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Star, Clock, Phone, Globe, Calendar, ArrowRight, ArrowLeft, Heart, Share2, Check, Mail } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Card, CardContent } from '../shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select'
import SaianaImage1 from '../assets/demo/BEBEACH1.webp'
import SaianaImage2 from '../assets/demo/BEBEACH2.webp'
import SaianaImage3 from '../assets/demo/BEBEACH3.webp'
import SaianaImage4 from '../assets/demo/BEBEACH4.webp'

const VenueDetailsPage = () => {
  const { id } = useParams()
  const [venue, setVenue] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Mock venue data - replace with actual API call
    let mockVenue = {
      id: parseInt(id),
      name: "Azure Beach Club",
      description: "Experience luxury dining with breathtaking ocean views at Dubai's premier beachfront destination. Our award-winning chefs create culinary masterpieces while you enjoy the pristine beach setting. Whether you are looking for a relaxing day by the pool or a vibrant nightlife experience, Azure Beach Club offers it all.",
      address: "Palm Jumeirah, Dubai, UAE",
      phone: "+971 4 123 4567",
      website: "www.azurebeachclub.ae",
      rating: 4.7,
      reviewCount: 156,
      priceRange: "AED 200-500",
      images: [
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1600&h=900&fit=crop",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-68c47e0f5550?w=800&h=600&fit=crop"
      ],
      amenities: [
        "Ocean View Terrace",
        "Private Beach Access",
        "Infinity Pool",
        "Valet Parking",
        "Live Entertainment",
        "Kids Area"
      ],
      dressCode: "Smart Casual",
      highlights: [
        "Award-winning cuisine",
        "Sunset views",
        "Private cabanas available",
        "Live DJ weekends"
      ],
      openingHours: {
        monday: "10:00 AM - 12:00 AM",
        tuesday: "10:00 AM - 12:00 AM",
        wednesday: "10:00 AM - 12:00 AM",
        thursday: "10:00 AM - 1:00 AM",
        friday: "10:00 AM - 2:00 AM",
        saturday: "10:00 AM - 2:00 AM",
        sunday: "10:00 AM - 12:00 AM"
      },
      upcomingEvents: [
        {
          id: 1,
          title: "Beach Club Brunch",
          date: "2024-01-15",
          time: "12:00 PM - 4:00 PM",
          price: 249,
          image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop"
        },
        {
          id: 2,
          title: "Sunset Pool Party",
          date: "2024-01-20",
          time: "6:00 PM - 11:00 PM",
          price: 199,
          image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop"
        }
      ],
      reviews: [
        {
          id: 1,
          name: "John Doe",
          date: "October 2023",
          rating: 5,
          comment: "Beautiful venue with amazing atmosphere. The service was top notch and the food was delicious. Highly recommended for a special occasion.",
          eventName: "Beach Club Brunch"
        },
        {
          id: 2,
          name: "Sarah Smith",
          date: "November 2023",
          rating: 4,
          comment: "Great party vibes! The music was fantastic and the crowd was lively. Drinks were a bit pricey but worth it.",
          eventName: "Sunset Pool Party"
        },
        {
          id: 3,
          name: "Michael Brown",
          date: "December 2023",
          rating: 5,
          comment: "An unforgettable evening. The staff went above and beyond to make sure we were comfortable.",
          eventName: "Private Dining Experience"
        },
        {
          id: 4,
          name: "Emily Davis",
          date: "January 2024",
          rating: 5,
          comment: "Loved the brunch! So many options and everything tasted fresh. Will definitely be back.",
          eventName: "Beach Club Brunch"
        }
      ]
    }

    if (String(id) === '99') {
      mockVenue = {
        id: 99,
        name: "BeBeach Dubai",
        description: "BeBeach is a luxury day club and restaurant bringing chic Mediterranean vibes to Dubai Harbour.",
        address: "Dubai Harbour, UAE",
        phone: "+971 54 300 0000",
        website: "www.bebeach.com",
        rating: 4.9,
        reviewCount: 1205,
        priceRange: "AED 320-600",
        images: [
          SaianaImage1,
          SaianaImage2,
          SaianaImage3,
          SaianaImage4,
          SaianaImage1
        ],
        amenities: [
          "Pool",
          "Open Format Music",
          "Valet Parking",
          "Wheelchair Accessible",
          "Outdoor Seating",
          "Entertainment"
        ],
        dressCode: "Beach Chic",
        highlights: [
          "Mediterranean cuisine",
          "Sunset views",
          "Poolside cabanas",
          "Live DJs"
        ],
        openingHours: {
          monday: "10:00 AM - 2:00 AM",
          tuesday: "10:00 AM - 2:00 AM",
          wednesday: "10:00 AM - 2:00 AM",
          thursday: "10:00 AM - 2:00 AM",
          friday: "10:00 AM - 3:00 AM",
          saturday: "10:00 AM - 3:00 AM",
          sunday: "10:00 AM - 2:00 AM"
        },
        upcomingEvents: [
          {
            id: 99,
            title: "Saiana Brunch",
            date: "2024-12-22",
            time: "2:00 PM - 6:00 PM",
            price: 320,
            image: SaianaImage1
          }
        ],
        reviews: [
          {
            id: 1,
            name: "John D.",
            date: "October 2024",
            rating: 5,
            comment: "Incredible vibe and views! The food and service were perfect.",
            eventName: "Saiana Brunch"
          }
        ]
      }
    }

    setVenue(mockVenue)
  }, [id])

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    )
  }

  const totalReviews = venue.reviewCount ?? venue.reviews?.length ?? 0

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-6">
        <Link to="/venues" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Venues</span>
        </Link>
      </div>

      {/* Premium Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 relative h-full">
            <img
              src={venue.images[0]}
              alt={venue.name}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
            />
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full">
            <div className="h-1/2 relative">
              <img src={venue.images[1]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
            <div className="h-1/2 relative">
              <img src={venue.images[2]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full">
            <div className="h-1/2 relative">
              <img src={venue.images[3]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
            <div className="h-1/2 relative">
              <img src={venue.images[4]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
              <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                Show all photos
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Header */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{venue.name}</h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="font-medium">{venue.address}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors p-2 hover:bg-gray-100 rounded-full">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                  <span className="font-semibold text-lg">{venue.rating}</span>
                  <span className="text-gray-500 text-sm underline">({totalReviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm underline">View on map</span>
                </div>
              </div>
            </div>


            {/* Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8 border-b border-gray-100">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'events', label: 'Events' },
                  { id: 'reviews', label: 'Reviews' },
                  { id: 'gallery', label: 'Gallery' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-1 font-medium text-sm transition-all border-b-2 ${activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About the venue</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{venue.description}</p>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">What this place offers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-gray-900" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Venue Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.highlights.map((highlight, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-xl">
                        <span className="text-gray-800 font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {venue.upcomingEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900">
                          AED {event.price}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="text-xs font-bold text-brand-purple mb-1 uppercase tracking-wide">{event.date}</div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">{event.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <Clock className="w-4 h-4 mr-1" />
                          {event.time}
                        </div>
                        <Button variant="outline" className="w-full rounded-xl border-gray-200 hover:border-gray-900 hover:bg-gray-50">
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <Star className="w-8 h-8 fill-gray-900 text-gray-900" />
                  <span className="text-3xl font-bold text-gray-900">{venue.rating}</span>
                  <span className="text-xl text-gray-500">({totalReviews} reviews)</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {venue.reviews.map((review) => (
                    <div key={review.id} className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue p-[2px]">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-brand-purple font-bold text-lg">
                              {review.name.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                            <div className="text-sm text-gray-500 font-medium">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-200'}`}
                              />
                            ))}
                          </div>
                          {/* Event Tag */}
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-purple/5 text-brand-purple text-xs font-semibold">
                            <Calendar className="w-3 h-3" />
                            <span>{review.eventName}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg pl-[64px]">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {venue.images.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:opacity-95">
                    <img src={img} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" alt="Gallery" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <Card className="rounded-3xl shadow-xl border-0 overflow-hidden ring-1 ring-black/5 p-6 bg-white">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Request a Quote</h3>
                  <p className="text-sm text-gray-500 mt-1">Starting from <span className="font-semibold text-gray-900">{venue.priceRange}</span></p>
                </div>

                <div className="space-y-4">
                  {/* Inputs Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Event Type</label>
                      <Select>
                        <SelectTrigger className="w-full rounded-xl border-gray-200 bg-gray-50 h-11">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="party">Private Party</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-1 space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date</label>
                      <input type="date" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                    </div>
                    <div className="col-span-1 space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Guests</label>
                      <input type="number" placeholder="50+" className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                    </div>
                  </div>

                  <Button className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-purple to-brand-orange text-white shadow-lg hover:opacity-90 transition-opacity mt-4">
                    Check Availability
                  </Button>

                  <p className="text-xs text-center text-gray-400 mt-2">
                    You won't be charged yet
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <a href={`tel:${venue.phone}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                  <a href={`mailto:info@${venue.website}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 transition-colors">
                    <Mail className="w-4 h-4" /> Email
                  </a>
                </div>
              </Card>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-white p-2 rounded-full shadow-sm">
                    <Mail className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="font-semibold text-gray-900">Get in touch</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Have questions about events or bookings? Contact the venue directly.</p>
                <a href={`tel:${venue.phone}`} className="text-sm font-bold text-gray-900 underline block mb-1">{venue.phone}</a>
                <a href={`mailto:info@${venue.website}`} className="text-sm font-bold text-gray-900 underline block">info@azurebeach.com</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueDetailsPage

