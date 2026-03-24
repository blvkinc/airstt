import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Check, Star, Users, Clock, Calendar, ArrowRight, Gift } from 'lucide-react'
import SaianaImage1 from '../assets/demo/BEBEACH1.webp'

const PackagesPage = () => {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)

  useEffect(() => {
    // Mock event data with packages - replace with actual API call
    let mockEvent = {
      id: parseInt(eventId),
      title: "Luxury Brunch at Burj Al Arab",
      venue: "Al Muntaha Restaurant",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      date: "2024-01-15",
      time: "11:00 AM - 3:00 PM",
      location: "Burj Al Arab, Dubai",
      rating: 4.8,
      reviews: 124,
      packages: [
        {
          id: 1,
          name: "Classic Brunch",
          price: 299,
          originalPrice: 349,
          description: "Perfect introduction to our luxury brunch experience",
          features: [
            "Welcome drink on arrival",
            "Access to international buffet",
            "Soft beverages included",
            "2-hour dining experience",
            "Complimentary valet parking"
          ],
          popular: false,
          maxGuests: 2
        },
        {
          id: 2,
          name: "Premium Brunch",
          price: 449,
          originalPrice: 529,
          description: "Enhanced experience with premium beverages and extras",
          features: [
            "Premium welcome cocktail",
            "Access to international buffet",
            "Premium beverages included",
            "3-hour dining experience",
            "Complimentary valet parking",
            "Priority seating with ocean view",
            "Complimentary dessert selection"
          ],
          popular: true,
          maxGuests: 4
        },
        {
          id: 3,
          name: "VIP Experience",
          price: 699,
          originalPrice: 799,
          description: "Ultimate luxury with exclusive perks and personalized service",
          features: [
            "Private welcome reception",
            "Access to exclusive VIP buffet",
            "Premium champagne & beverages",
            "4-hour dining experience",
            "Complimentary valet parking",
            "Private dining area with panoramic views",
            "Personal sommelier service",
            "Complimentary spa access",
            "Professional photography session"
          ],
          popular: false,
          maxGuests: 6
        }
      ]
    }

    if (String(eventId) === '99') {
      mockEvent = {
        id: 99,
        title: "Saiana Brunch",
        venue: "BeBeach Dubai",
        image: SaianaImage1,
        date: "2024-12-22",
        time: "2:00 PM - 6:00 PM",
        location: "Dubai Harbour",
        rating: 4.9,
        reviews: 842,
        packages: [
          {
            id: 97,
            name: "SOFT ESCAPE",
            price: 320,
            originalPrice: 350,
            description: "Dining with Selection of Mocktails & Soft Drinks",
            features: ["Mocktails", "Soft Drinks", "Dining", "Pool Access"],
            popular: false,
            maxGuests: 4
          },
          {
            id: 98,
            name: "SAIANA BAR",
            price: 420,
            originalPrice: 480,
            description: "Dining with Selection of House Spirits, House Wine & Beer",
            features: ["House Spirits", "House Wine", "Beer", "Dining", "Pool Access"],
            popular: true,
            maxGuests: 4
          },
          {
            id: 99,
            name: "GOLDEN SAIANA",
            price: 520,
            originalPrice: 600,
            description: "Dining with Selection of House Spirits, House Wine, Prosecco, Cocktails & Beer",
            features: ["House Spirits", "House Wine", "Prosecco", "Cocktails", "Beer", "Dining", "Pool Access"],
            popular: false,
            maxGuests: 8
          }
        ]
      }
    }

    setEvent(mockEvent)
    setSelectedPackage(mockEvent.packages[1]) // Default to popular package
  }, [eventId])

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                <Link to="/" className="hover:text-brand-purple">Home</Link>
                <span>•</span>
                <Link to="/events" className="hover:text-brand-purple">Events</Link>
                <span>•</span>
                <Link to={`/events/${event.id}`} className="hover:text-brand-purple">{event.title}</Link>
                <span>•</span>
                <span>Packages</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
              <div className="flex items-center space-x-6 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-5 h-5" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-5 h-5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span>{event.rating} ({event.reviews} reviews)</span>
                </div>
              </div>
              <p className="text-lg text-gray-600">{event.venue} • {event.location}</p>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-md">
              <img src={event.image} alt={event.title} className="w-full h-80 object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Packages */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-neutral-800 mb-8">Choose Your Package</h2>

            <div className="space-y-6">
              {event.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white rounded-xl p-8 border transition-all duration-300 cursor-pointer ${selectedPackage?.id === pkg.id
                      ? 'border-brand-purple shadow-lg ring-1 ring-brand-purple'
                      : 'border-gray-100 hover:border-gray-200 hover:shadow-xl shadow-md'
                    } ${pkg.popular ? 'relative' : ''}`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-8">
                      <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                      <p className="text-gray-600 mb-4">{pkg.description}</p>
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-500">Up to {pkg.maxGuests} guests</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-3xl font-bold text-primary-600">AED {pkg.price}</span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="text-lg text-neutral-500 line-through">AED {pkg.originalPrice}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">per person</p>
                      {pkg.originalPrice > pkg.price && (
                        <div className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mt-2">
                          <Gift className="w-3 h-3" />
                          <span>Save AED {pkg.originalPrice - pkg.price}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>

              {selectedPackage && (
                <>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Package</span>
                      <span className="font-medium">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Date</span>
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Time</span>
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Venue</span>
                      <span className="font-medium text-gray-900">{event.venue}</span>
                    </div>
                  </div>

                  <hr className="border-gray-200 mb-6" />

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Price per person</span>
                      <span className="font-medium">AED {selectedPackage.price}</span>
                    </div>
                    {selectedPackage.originalPrice > selectedPackage.price && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">-AED {selectedPackage.originalPrice - selectedPackage.price}</span>
                      </div>
                    )}
                  </div>

                  <hr className="border-gray-200 mb-6" />

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">AED {selectedPackage.price}</span>
                  </div>

                  <Link
                    to={`/booking/${event.id}?package=${selectedPackage.id}`}
                    className="w-full btn-primary flex items-center justify-center space-x-2 mb-4"
                  >
                    <span>Continue to Booking</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <p className="text-xs text-neutral-500 text-center">
                    Free cancellation up to 24 hours before the event
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackagesPage
