import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Check, Star, Users, Clock, Calendar, ArrowRight, Gift, MapPin, ArrowLeft, Share2, Heart, Phone, Sparkles } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Card, CardContent } from '../shared/ui/card'
import { Badge } from '../shared/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/ui/tabs'
import SaianaImage1 from '../assets/demo/BEBEACH1.webp'
import SaianaImage2 from '../assets/demo/BEBEACH2.webp'
import SaianaImage3 from '../assets/demo/BEBEACH3.webp'
import SaianaImage4 from '../assets/demo/BEBEACH4.webp'

const PackageDetailPage = () => {
  const { packageId } = useParams()
  const navigate = useNavigate()
  const [packageData, setPackageData] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock package data - replace with actual API call
    let mockPackage = {
      id: parseInt(packageId),
      name: "Premium Brunch Package",
      event: "Luxury Brunch at Burj Al Arab",
      eventId: 1,
      venue: "Al Muntaha Restaurant",
      venueId: 1,
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop"
      ],
      price: 449,
      originalPrice: 529,
      rating: 4.8,
      reviews: 124,
      location: "Burj Al Arab, Dubai",
      category: "Luxury Brunch",
      duration: "3 hours",
      maxGuests: 4,
      minGuests: 1,
      popular: true,
      description: "Indulge in an extraordinary culinary journey with our Premium Brunch Package at the iconic Al Muntaha Restaurant. Located 200 meters above the Arabian Gulf, this exclusive experience combines world-class cuisine with breathtaking panoramic views.",
      highlights: [
        "Panoramic views of Dubai coastline",
        "Award-winning international cuisine",
        "Premium beverage selection",
        "Professional service team",
        "Exclusive dining atmosphere"
      ],
      features: [
        "Premium welcome cocktail on arrival",
        "Access to international buffet with live cooking stations",
        "Premium beverages including champagne and wine",
        "3-hour dining experience with flexible timing",
        "Complimentary valet parking",
        "Priority seating with guaranteed ocean view",
        "Complimentary gourmet dessert selection",
        "Professional photography service available"
      ],
      inclusions: [
        "Welcome drink",
        "International buffet",
        "Premium beverages",
        "Ocean view seating",
        "Valet parking",
        "Service charge"
      ],
      exclusions: [
        "Transportation to venue",
        "Additional beverages beyond package",
        "Photography service (optional)",
        "Spa services"
      ],
      availableDates: [
        "2024-02-20",
        "2024-02-22",
        "2024-02-25",
        "2024-02-27",
        "2024-03-01",
        "2024-03-03"
      ],
      timeSlots: [
        { time: "11:00 AM - 2:00 PM", available: true },
        { time: "12:30 PM - 3:30 PM", available: true },
        { time: "2:00 PM - 5:00 PM", available: false }
      ],
      cancellationPolicy: "Free cancellation up to 24 hours before the event. 50% refund for cancellations within 24 hours.",
      dietaryOptions: ["Vegetarian", "Vegan", "Gluten-free", "Halal"],
      ageRestriction: "All ages welcome. Children under 5 dine free.",
      dressCode: "Smart casual to formal attire recommended"
    }

    if (String(packageId) === '97') {
      mockPackage = {
        id: 97,
        name: "SOFT ESCAPE",
        event: "Saiana Brunch",
        eventId: 99,
        venue: "BeBeach Dubai",
        venueId: 99,
        image: SaianaImage1,
        images: [SaianaImage1, SaianaImage2, SaianaImage3, SaianaImage4, SaianaImage1],
        price: 320,
        originalPrice: 350,
        rating: 4.9,
        reviews: 142,
        location: "Dubai Harbour",
        category: "Beach Brunch",
        duration: "4 hours",
        maxGuests: 4,
        minGuests: 1,
        popular: false,
        description: "Experience the Saiana Brunch with our Soft Escape package. Enjoy a curated Mediterranean menu with unlimited mocktails and soft beverages at BeBeach.",
        highlights: [
           "Mediterranean Cuisine", "Included Pool Access", "Stunning Dubai Skyline Views", "Live Entertainment"
        ],
        features: ["Mocktails", "Soft Drinks", "Dining", "Pool Access"],
        inclusions: ["Mocktails & Soft Drinks", "Mediterranean Menu", "Pool Access", "Live Entertainment"],
        exclusions: ["Alcoholic Beverages", "Afterparty Drinks", "Transportation"],
        availableDates: ["2024-12-22", "2024-12-29"],
        timeSlots: [{ time: "2:00 PM - 6:00 PM", available: true }],
        cancellationPolicy: "Free cancellation up to 48 hours before the event.",
        dietaryOptions: ["Vegetarian", "Vegan Options available"],
        ageRestriction: "21+",
        dressCode: "Beach Chic"
      }
    } else if (String(packageId) === '98') {
      mockPackage = {
        id: 98,
        name: "SAIANA BAR",
        event: "Saiana Brunch",
        eventId: 99,
        venue: "BeBeach Dubai",
        venueId: 99,
        image: SaianaImage1,
        images: [SaianaImage1, SaianaImage2, SaianaImage3, SaianaImage4, SaianaImage1],
        price: 420,
        originalPrice: 480,
        rating: 4.9,
        reviews: 320,
        location: "Dubai Harbour",
        category: "Beach Brunch",
        duration: "4 hours",
        maxGuests: 4,
        minGuests: 1,
        popular: true,
        description: "Experience the Saiana Brunch with our Saiana Bar package. Enjoy a curated Mediterranean menu with unlimited house spirits, wine, and beer at BeBeach.",
        highlights: [
           "Mediterranean Cuisine", "Included Pool Access", "Stunning Dubai Skyline Views", "Live Entertainment"
        ],
        features: ["House Spirits", "House Wine", "Beer", "Dining", "Pool Access"],
        inclusions: ["House Spirits, Wine & Beer", "Mediterranean Menu", "Pool Access", "Live Entertainment"],
        exclusions: ["Premium Spirits", "Champagne", "Afterparty Drinks", "Transportation"],
        availableDates: ["2024-12-22", "2024-12-29"],
        timeSlots: [{ time: "2:00 PM - 6:00 PM", available: true }],
        cancellationPolicy: "Free cancellation up to 48 hours before the event.",
        dietaryOptions: ["Vegetarian", "Vegan Options available"],
        ageRestriction: "21+",
        dressCode: "Beach Chic"
      }
    } else if (String(packageId) === '99') {
      mockPackage = {
        id: 99,
        name: "GOLDEN SAIANA",
        event: "Saiana Brunch",
        eventId: 99,
        venue: "BeBeach Dubai",
        venueId: 99,
        image: SaianaImage1,
        images: [SaianaImage1, SaianaImage2, SaianaImage3, SaianaImage4, SaianaImage1],
        price: 520,
        originalPrice: 600,
        rating: 5.0,
        reviews: 180,
        location: "Dubai Harbour",
        category: "Beach Brunch",
        duration: "4 hours",
        maxGuests: 8,
        minGuests: 1,
        popular: false,
        description: "Experience the Saiana Brunch with our Golden Saiana package. Enjoy a curated Mediterranean menu with unlimited house spirits, wine, prosecco, cocktails, and beer at BeBeach.",
        highlights: [
           "Mediterranean Cuisine", "Included Pool Access", "Stunning Dubai Skyline Views", "Live Entertainment"
        ],
        features: ["House Spirits", "House Wine", "Prosecco", "Cocktails", "Beer", "Dining", "Pool Access"],
        inclusions: ["House Spirits, Wine, Prosecco, Cocktails & Beer", "Mediterranean Menu", "Pool Access", "Live Entertainment"],
        exclusions: ["Premium Champagne", "Afterparty Drinks", "Transportation"],
        availableDates: ["2024-12-22", "2024-12-29"],
        timeSlots: [{ time: "2:00 PM - 6:00 PM", available: true }],
        cancellationPolicy: "Free cancellation up to 48 hours before the event.",
        dietaryOptions: ["Vegetarian", "Vegan Options available"],
        ageRestriction: "21+",
        dressCode: "Beach Chic"
      }
    }

    setTimeout(() => {
      setPackageData(mockPackage)
      setLoading(false)
    }, 1000)
  }, [packageId])

  const handleBooking = () => {
    if (!selectedDate) {
      alert('Please select a date')
      return
    }
    navigate(`/booking/${packageData.eventId}?package=${packageData.id}&date=${selectedDate}&guests=${guestCount}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
          <Link to="/explore" className="btn-primary">
            Browse Packages
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = packageData.price * guestCount
  const savings = (packageData.originalPrice - packageData.price) * guestCount

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Gallery - Stacked Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 relative h-full">
            <img
              src={packageData.images[0]}
              alt={packageData.name}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
            />
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full">
            <div className="h-1/2 relative">
              <img src={packageData.images[1]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
            <div className="h-1/2 relative">
              <img src={packageData.images[2]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full">
            <div className="h-1/2 relative">
              <img src={packageData.images[3]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
            <div className="h-1/2 relative">
              <img src={packageData.images[4]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
              <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                Show all photos
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Header */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="px-3 py-1 text-sm bg-gray-100 text-gray-700">
                  {packageData.category}
                </Badge>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Save</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{packageData.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="font-medium text-gray-900">{packageData.venue}</span>
                <span>•</span>
                <span className="underline">{packageData.location}</span>
              </div>

              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-lg px-2">
                  <Star className="w-4 h-4 text-gray-900 fill-current" />
                  <span className="font-semibold text-gray-900">{packageData.rating}</span>
                  <span className="text-gray-500 underline ml-1">{packageData.reviews} reviews</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{packageData.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Up to {packageData.maxGuests} guests</span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <nav className="flex space-x-8 border-b border-gray-100">
                {['overview', 'details', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-1 font-medium text-sm transition-all border-b-2 capitalize ${activeTab === tab
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this package</h2>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">{packageData.description}</p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {packageData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50">
                        <Check className="w-5 h-5 text-gray-900 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Inclusions</h3>
                  <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {packageData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Policies</h4>
                      <p className="text-gray-600 text-sm mb-1">{packageData.cancellationPolicy}</p>
                      <p className="text-gray-600 text-sm">{packageData.ageRestriction}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dress Code</h4>
                      <p className="text-gray-600 text-sm">{packageData.dressCode}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="rounded-xl border-gray-100 shadow-sm">
                    <CardContent className="p-5">
                      <h3 className="font-bold text-gray-900 mb-4">Inclusions</h3>
                      <ul className="space-y-1.5">
                        {packageData.inclusions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-600" /> {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl border-gray-100 shadow-sm">
                    <CardContent className="p-5">
                      <h3 className="font-bold text-gray-900 mb-4">Exclusions</h3>
                      <ul className="space-y-1.5">
                        {packageData.exclusions.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-red-500">×</span> {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="py-12 text-center text-gray-500">
                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900">Reviews coming soon</h3>
                <p>Calculated from {packageData.reviews} ratings across all platforms.</p>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="rounded-2xl shadow-xl border-0 overflow-hidden ring-1 ring-black/5">
                <CardContent className="p-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">AED {packageData.price}</span>
                        {packageData.originalPrice > packageData.price && (
                          <span className="text-lg text-gray-400 line-through">AED {packageData.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">per person</span>
                    </div>
                    {savings > 0 && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                        Save AED {savings / guestCount}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Date Selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Date</label>
                      <div className="relative">
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full h-12 pl-4 pr-10 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-black focus:border-transparent outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Select a date</option>
                          {packageData.availableDates.map(date => (
                            <option key={date} value={date}>{date}</option>
                          ))}
                        </select>
                        <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase tracking-wide">Guests</label>
                      <div className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-white">
                        <button
                          onClick={() => setGuestCount(Math.max(packageData.minGuests, guestCount - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="font-medium">{guestCount} guests</span>
                        <button
                          onClick={() => setGuestCount(Math.min(packageData.maxGuests, guestCount + 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Summary */}
                    {selectedDate && (
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>AED {packageData.price} x {guestCount}</span>
                          <span>AED {totalPrice}</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
                          <span>Total</span>
                          <span>AED {totalPrice}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      size="lg"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-purple to-brand-orange text-white font-semibold text-lg shadow-lg hover:opacity-90"
                      onClick={handleBooking}
                      disabled={!selectedDate}
                    >
                      Reserve Package
                    </Button>

                    <p className="text-center text-xs text-gray-500 mt-4">
                      You won't be charged yet
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-4 text-center">
                <Link to={`/venues/${packageData.venueId}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 underline">
                  View Venue Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageDetailPage

