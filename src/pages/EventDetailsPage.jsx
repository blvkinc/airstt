import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Star, Clock, Phone, Globe, Calendar, ArrowRight, ArrowLeft, Heart, Share2, Check, Sparkles } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Card, CardContent } from '../shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select'
import { Badge } from '../shared/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '../shared/ui/alert'
import { motion } from 'framer-motion'

import { useAuth } from '../shared/context/AuthContext'
import { useCart } from '../shared/context/CartContext'
import SaianaImage1 from '../assets/demo/BEBEACH1.webp'
import SaianaImage2 from '../assets/demo/BEBEACH2.webp'
import SaianaImage3 from '../assets/demo/BEBEACH3.webp'
import SaianaImage4 from '../assets/demo/BEBEACH4.webp'

const EventDetailsPage = () => {
  const { id: _id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [guestCount, setGuestCount] = useState(2)
  const [activeTab, setActiveTab] = useState('overview')
  const [showDatePrompt, setShowDatePrompt] = useState(false)
  const [cartAdded, setCartAdded] = useState(false)
  const { addToCart } = useCart()

  // Review Form State
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState('')
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Sarah Ahmed",
      rating: 5,
      date: "2 weeks ago",
      comment: "Absolutely incredible experience! The food was exceptional and the service was impeccable. The views are breathtaking."
    },
    {
      id: 2,
      name: "Michael Johnson",
      rating: 4,
      date: "1 month ago",
      comment: "Great brunch with amazing variety. A bit pricey but worth it for the experience and location."
    },
    {
      id: 3,
      name: "Fatima Al-Zahra",
      rating: 5,
      date: "1 month ago",
      comment: "Perfect for special occasions. The staff went above and beyond to make our anniversary memorable."
    }
  ])

  // Mock event data
  let event = {
    id: 1,
    title: "Luxury Brunch at Burj Al Arab",
    venue: "Al Muntaha Restaurant",
    venueId: 1,
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&h=900&fit=crop",
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviews: 124,
    location: "Burj Al Arab, Dubai",
    time: "11:00 AM - 3:00 PM",
    category: "Luxury Brunch",
    tags: ['Fine Dining', 'Indoor', 'Family Friendly'],
    description: "Experience the ultimate luxury brunch at the iconic Burj Al Arab. Indulge in a world-class culinary journey with breathtaking views of the Arabian Gulf. Our carefully curated menu features international cuisine prepared by award-winning chefs.",
    highlights: [
      "Panoramic views of Dubai coastline",
      "International buffet with live cooking stations",
      "Premium beverages included",
      "Valet parking available",
      "Family-friendly environment",
      "Live entertainment"
    ],
    scheduleType: 'one_time',
    recurrence: {
      pattern: 'one_time',
      startDate: '2026-03-30',
      endDate: ''
    },
    occurrences: [
      { date: '2026-03-30', time: '11:00 AM - 3:00 PM', status: 'available', packagesAvailable: 120 },
      { date: '2026-04-06', time: '11:00 AM - 3:00 PM', status: 'sold_out', packagesAvailable: 0 },
      { date: '2026-04-13', time: '11:00 AM - 3:00 PM', status: 'unavailable', packagesAvailable: 0 }
    ],
    accessibility: [
      'Wheelchair accessible entrance',
      'Accessible restrooms',
      'Elevator access to main dining area'
    ],
    faqs: [
      { question: 'Is valet parking available?', answer: 'Yes, complimentary valet parking is provided for all guests.' },
      { question: 'Are children allowed?', answer: 'Yes, children are welcome and receive a discounted rate.' },
      { question: 'What is the cancellation policy?', answer: 'Free cancellation up to 24 hours before the event.' }
    ],
    seo: {
      metaTitle: 'Luxury Brunch at Burj Al Arab | Set The Table',
      metaDescription: 'Book the iconic luxury brunch at Burj Al Arab with premium dining and panoramic views.',
      slug: 'luxury-brunch-burj-al-arab',
      ogImage: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&h=630&fit=crop'
    },
    mapImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=450&fit=crop',
    venueDetails: {
      id: 1,
      name: "Al Muntaha Restaurant",
      description: "Located 200 meters above the Arabian Gulf at the iconic Burj Al Arab, Al Muntaha offers an unparalleled dining experience with breathtaking panoramic views.",
      address: "Burj Al Arab, Jumeirah Street, Dubai",
      phone: "+971 4 301 7600",
      email: "reservations@burjalarab.com",
      website: "www.burjalarab.com/almuntaha",
      capacity: 200,
      rating: 4.9,
      reviews: 342,
      priceRange: "AED 300-800",
      amenities: [
        "Panoramic Views",
        "Valet Parking",
        "WiFi",
        "Air Conditioning",
        "Private Dining Rooms",
        "Wheelchair Accessible",
        "Live Music",
        "Bar Service"
      ],
      images: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop"
      ],
      openingHours: {
        monday: "12:00 PM - 11:00 PM",
        tuesday: "12:00 PM - 11:00 PM",
        wednesday: "12:00 PM - 11:00 PM",
        thursday: "12:00 PM - 12:00 AM",
        friday: "11:00 AM - 12:00 AM",
        saturday: "11:00 AM - 12:00 AM",
        sunday: "11:00 AM - 11:00 PM"
      },
      dressCode: "Smart casual to formal attire",
      parkingInfo: "Complimentary valet parking available",
      upcomingEvents: 12
    },
    packages: [
      {
        id: 1,
        name: 'Classic Brunch Package',
        price: 299,
        originalPrice: 349,
        description: 'Perfect introduction to our luxury brunch experience',
        maxGuests: 2,
        popular: false,
        paymentMode: 'full',
        depositAmount: 0,
        features: ['Welcome drink on arrival', 'Access to international buffet', 'Soft beverages included', '2-hour dining experience', 'Complimentary valet parking']
      },
      {
        id: 2,
        name: 'Premium Brunch Package',
        price: 449,
        originalPrice: 529,
        description: 'Enhanced experience with premium beverages and extras',
        maxGuests: 4,
        popular: true,
        paymentMode: 'deposit',
        depositAmount: 150,
        features: ['Premium welcome cocktail', 'Access to international buffet', 'Premium beverages included', '3-hour dining experience', 'Complimentary valet parking', 'Priority seating with ocean view', 'Complimentary dessert selection']
      },
      {
        id: 3,
        name: 'VIP Experience Package',
        price: 699,
        originalPrice: 799,
        description: 'Ultimate luxury with exclusive perks and personalized service',
        maxGuests: 6,
        popular: false,
        paymentMode: 'no_upfront',
        depositAmount: 0,
        features: ['Private welcome reception', 'Access to exclusive VIP buffet', 'Premium champagne & beverages', '4-hour dining experience', 'Complimentary valet parking', 'Private dining area with panoramic views', 'Personal sommelier service', 'Complimentary spa access', 'Professional photography session']
      }
    ],
    contact: {
      phone: '+971 4 301 7600',
      email: 'reservations@burjalarab.com'
    },
    policies: [
      'Smart casual dress code required',
      'Children under 12 receive 50% discount',
      'Cancellation allowed up to 24 hours before',
      'No outside food or beverages allowed'
    ]
  }

  if (String(_id) === '99') {
    event = {
      id: 99,
      title: "Saiana Brunch",
      venue: "BeBeach Dubai",
      venueId: 99,
      images: [
        SaianaImage1,
        SaianaImage2,
        SaianaImage3,
        SaianaImage4,
        SaianaImage2
      ],
      rating: 4.9,
      reviews: 842,
      location: "Dubai Harbour",
      time: "2:00 PM - 6:00 PM",
    category: "Day Brunch",
    tags: ['Outdoor', 'Pool Access', 'Live DJ'],
      description: "From 2 PM to 6 PM, indulge in the ultimate Sunday brunch experience at Be Beach Dubai with SAIANA. Enjoy a curated menu featuring delights like Rock Shrimp Tempura and Slow-Cooked Short Rib, alongside live cooking stations and decadent desserts. The boho-chic atmosphere comes alive with high-energy live entertainment, including drummers and dancers, all set against the stunning Dubai skyline.",
      highlights: [
        "Afterparty: 6PM - 2AM",
        "Mediterranean Cuisine & Live Cooking Stations",
        "4 Hours Unlimited Beverages",
        "Pool Access",
        "Live Entertainment: DJ, Drummers, Dancers",
        "Amazing Views of Dubai Skyline"
      ],
      scheduleType: 'recurring',
      recurrence: {
        pattern: 'weekly',
        startDate: '2026-03-23',
        endDate: '2026-05-04',
        days: ['sun']
      },
      occurrences: [
        { date: '2026-03-23', time: '2:00 PM - 6:00 PM', status: 'available', packagesAvailable: 180 },
        { date: '2026-03-30', time: '2:00 PM - 6:00 PM', status: 'available', packagesAvailable: 150 },
        { date: '2026-04-06', time: '2:00 PM - 6:00 PM', status: 'sold_out', packagesAvailable: 0 },
        { date: '2026-04-13', time: '2:00 PM - 6:00 PM', status: 'unavailable', packagesAvailable: 0 }
      ],
      accessibility: [
        'Step-free entry',
        'Accessible restrooms',
        'Outdoor seating with ramp access'
      ],
      faqs: [
        { question: 'Is pool access included?', answer: 'Yes, pool access is included with all packages.' },
        { question: 'Can I upgrade on the day?', answer: 'Upgrades are subject to availability on arrival.' },
        { question: 'Is there a dress code?', answer: 'Smart casual, beach-chic attire is recommended.' }
      ],
      seo: {
        metaTitle: 'Saiana Brunch at BeBeach Dubai | Set The Table',
        metaDescription: 'Book Saiana Brunch at BeBeach Dubai with sunset views, live entertainment, and pool access.',
        slug: 'saiana-brunch-bebeach',
        ogImage: SaianaImage1
      },
      mapImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=450&fit=crop',
      venueDetails: {
        id: 99,
        name: "BeBeach Dubai",
        description: "BeBeach is a luxury day club and restaurant bringing chic Mediterranean vibes to Dubai Harbour.",
        address: "Dubai Harbour, UAE",
        phone: "+971 4 000 0000",
        email: "reservations@bebeach.com",
        website: "www.bebeach.com",
        capacity: 500,
        rating: 4.9,
        reviews: 1205,
        priceRange: "AED 320-600",
        amenities: [
          "Pool",
          "Open Format Music",
          "Valet Parking",
          "Wheelchair Accessible",
          "Outdoor Seating",
          "Entertainment"
        ],
        images: [
          SaianaImage1,
          SaianaImage2,
          SaianaImage3
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
        dressCode: "Beach Chic",
        parkingInfo: "Valet Parking available",
        upcomingEvents: 4
      },
      packages: [
        {
          id: 97,
          name: 'SOFT ESCAPE',
          price: 320,
          originalPrice: 350,
          description: 'Dining with Selection of Mocktails & Soft Drinks',
          maxGuests: 4,
          popular: false,
          paymentMode: 'full',
          depositAmount: 0,
          features: ['Mocktails', 'Soft Drinks', 'Dining', 'Pool Access']
        },
        {
          id: 98,
          name: 'SAIANA BAR',
          price: 420,
          originalPrice: 480,
          description: 'Dining with Selection of House Spirits, House Wine & Beer',
          maxGuests: 4,
          popular: true,
          paymentMode: 'deposit',
          depositAmount: 120,
          features: ['House Spirits', 'House Wine', 'Beer', 'Dining', 'Pool Access']
        },
        {
          id: 99,
          name: 'GOLDEN SAIANA',
          price: 520,
          originalPrice: 600,
          description: 'Dining with Selection of House Spirits, House Wine, Prosecco, Cocktails & Beer',
          maxGuests: 8,
          popular: false,
          paymentMode: 'no_upfront',
          depositAmount: 0,
          features: ['House Spirits', 'House Wine', 'Prosecco', 'Cocktails', 'Beer', 'Dining', 'Pool Access']
        }
      ],
      contact: {
        phone: '+971 4 000 0000',
        email: 'reservations@bebeach.com'
      },
      policies: [
        'Beach Chic dress code required',
        '21+ age policy applies',
        'Valet Parking provided'
      ]
    }
  }

  const handleReviewSubmit = () => {
    if (userRating === 0 || !userComment.trim()) return

    const newReview = {
      id: Date.now(),
      name: user?.name || "Anonymous",
      rating: userRating,
      date: "Just now",
      comment: userComment
    }

    setReviews([newReview, ...reviews])
    setUserRating(0)
    setUserComment('')
  }

  useEffect(() => {
    if (selectedDate && showDatePrompt) {
      setShowDatePrompt(false)
    }
  }, [selectedDate, showDatePrompt])

  const selectedPkg = event.packages.find(p => p.id === parseInt(selectedPackage))

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-6">
        <Link to="/events" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Events</span>
        </Link>
      </div>

      {/* Premium Image Gallery - Airbnb Grid Style */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 relative h-full">
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
            />
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full">
            <div className="h-1/2 relative">
              <img src={event.images[1]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
            <div className="h-1/2 relative">
              <img src={event.images[2]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-2 h-full">
            <div className="h-1/2 relative">
              <img src={event.images[3]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
            </div>
            <div className="h-1/2 relative">
              <img src={event.images[4]} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" alt="Gallery" />
              <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                Show all photos
              </div>
            </div>
          </div>
          {/* Mobile Only: Show count indicator instead of full grid */}
          <div className="md:hidden absolute bottom-4 right-4 z-10">
            <div className="bg-black/60 text-white backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
              1/{event.images.length}
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
                  {event.category}
                </Badge>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors hover:underline">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Save</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors hover:underline">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">{event.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <Link to={`/venues/${event.venueId || event.id}`} className="font-medium text-gray-900 hover:text-brand-purple hover:underline">
                  {event.venue}
                </Link>
                <span>-</span>
                <span className="underline">{event.location}</span>
              </div>

              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-1 p-1 bg-gray-50 rounded-lg px-2">
                  <Star className="w-4 h-4 text-gray-900 fill-current" />
                  <span className="font-semibold text-gray-900">{event.rating}</span>
                  <span className="text-gray-500 underline ml-1">{event.reviews} reviews</span>
                </div>
              </div>
              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs text-gray-600 border-gray-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Overview Tabs */}
            <div className="mb-8">
                <nav className="flex space-x-8 border-b border-gray-100">
                  {[
                    { id: 'overview', name: 'Overview' },
                    { id: 'availability', name: 'Availability' },
                    { id: 'venue', name: 'Venue' },
                    { id: 'packages', name: 'Packages' },
                    { id: 'reviews', name: 'Reviews' }
                  ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 px-1 font-medium text-sm transition-all border-b-2 ${activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About this experience</h2>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">{event.description}</p>

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience Highlights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50">
                        <Check className="w-5 h-5 text-gray-900 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Things to know</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Policies</h4>
                      <ul className="space-y-2">
                        {event.policies.map((policy, index) => (
                          <li key={index} className="flex items-start space-x-2 text-gray-600 text-sm">
                            <span>-</span>
                            <span>{policy}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact Host</h4>
                      <a href="#" className="flex items-center space-x-2 text-gray-600 mb-2 hover:underline">
                        <Phone className="w-4 h-4" />
                        <span>Contact Venue</span>
                      </a>
                    </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accessibility</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.accessibility.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-xl bg-gray-50">
                      <Check className="w-5 h-5 text-gray-900 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">FAQs</h3>
                <div className="space-y-4">
                  {event.faqs.map((faq, index) => (
                    <div key={index} className="p-4 rounded-2xl border border-gray-100 bg-white">
                      <div className="font-semibold text-gray-900 mb-1">{faq.question}</div>
                      <div className="text-sm text-gray-600">{faq.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

              {/* Availability Tab */}
              {activeTab === 'availability' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Dates</h2>
                    <p className="text-gray-600">Availability is shown per occurrence. Sold out and unavailable dates are not bookable.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.occurrences.map((occurrence) => (
                      <div key={occurrence.date} className="border border-gray-200 rounded-2xl p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{occurrence.date}</div>
                            <div className="text-sm text-gray-500">{occurrence.time}</div>
                          </div>
                          <Badge className={occurrence.status === 'available'
                            ? 'bg-green-100 text-green-700 hover:bg-green-100'
                            : occurrence.status === 'sold_out'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-200'
                          }>
                            {occurrence.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="mt-3 text-sm text-gray-600">
                          Packages available: {occurrence.packagesAvailable}
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            className="w-full"
                            disabled={occurrence.status !== 'available'}
                            onClick={() => {
                              if (occurrence.status === 'available') {
                                setSelectedDate(occurrence.date)
                                setActiveTab('packages')
                              }
                            }}
                          >
                            {occurrence.status === 'available' ? 'Select this date' : 'Not bookable'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue Tab */}
              {activeTab === 'venue' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{event.venueDetails?.name || event.venue}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg mb-8">{event.venueDetails?.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span>{event.venueDetails?.address || event.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span>{event.venueDetails?.phone || event.contact?.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700">
                        <Globe className="w-5 h-5 text-gray-400" />
                        <a href={`http://${event.venueDetails?.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{event.venueDetails?.website}</a>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.venueDetails?.amenities?.map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 font-normal">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="font-semibold text-gray-900 mb-3">Location Map</h3>
                      <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                        <img
                          src={event.mapImage}
                          alt="Venue map"
                          className="w-full h-56 object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Map preview for quick reference.</p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <Link to={`/venues/${event.venueId || event.id}`}>
                        <Button className="rounded-full px-8 bg-gray-900 text-white hover:bg-black">
                          View Full Venue Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

                {/* Write Review Section */}
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Review</h3>
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex gap-2 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setUserRating(star)}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 ${star <= userRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`}
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 resize-none outline-none"
                        rows="4"
                        placeholder="Share your experience with us..."
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button
                          onClick={handleReviewSubmit}
                          disabled={userRating === 0 || !userComment.trim()}
                          className="rounded-full px-6 bg-gray-900 hover:bg-black text-white"
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">Please log in to share your experience</p>
                      <Link to="/auth">
                        <Button variant="outline" className="rounded-full px-8">Log In</Button>
                      </Link>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-6 px-2">
                  <span className="text-2xl font-bold text-gray-900">{reviews.length} Reviews</span>
                  <div className="h-1 flex-1 bg-gray-100 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {reviews.map((review) => (
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
                        <div className="flex gap-1 bg-gray-50 px-3 py-1.5 rounded-full">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'fill-gray-900 text-gray-900' : 'text-gray-200'}`}
                            />
                          ))}
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

            {activeTab === 'packages' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose your package</h2>
                {showDatePrompt && (
                  <Alert variant="warning" className="mb-4">
                    <AlertTitle>Select a date first</AlertTitle>
                    <AlertDescription>
                      Choose a date to see availability before selecting a package.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="grid grid-cols-1 gap-6">
                  {event.packages.map((pkg) => (
                    <Card key={pkg.id} className={`rounded-2xl overflow-hidden transition-all ${pkg.popular ? 'border-brand-purple shadow-md' : 'border-gray-200'}`}>
                      {pkg.popular && <div className="bg-brand-purple text-white text-xs font-bold px-3 py-1 text-center">MOST POPULAR</div>}
                      <div className="p-6 md:flex justify-between items-center gap-6">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
                          <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {pkg.features.slice(0, 3).map((f, i) => (
                              <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-600 font-normal">{f}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-2xl font-bold">AED {pkg.price}</span>
                              {pkg.originalPrice && <span className="text-sm text-gray-400 line-through">AED {pkg.originalPrice}</span>}
                            </div>
                            <span className="text-xs text-gray-500">per person</span>
                            <div className="text-xs text-gray-500 mt-1 capitalize">
                              Payment: {pkg.paymentMode?.replace('_', ' ') || 'full'}
                              {pkg.paymentMode === 'deposit' && (
                                <span> (Deposit AED {pkg.depositAmount})</span>
                              )}
                            </div>
                          <Button
                            className="w-full mt-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
                            onClick={() => {
                              if (!selectedDate) {
                                setShowDatePrompt(true)
                                document.getElementById('date-selection')?.scrollIntoView({ behavior: 'smooth' })
                                return
                              }
                              setSelectedPackage(String(pkg.id))
                            }}
                          >
                            Select
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="rounded-2xl shadow-xl border-0 overflow-hidden ring-1 ring-black/5">
                <CardContent className="p-6">
                  {/* Date Selection - Step 1 */}
                  <div className="mb-6" id="date-selection">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
                    <div className="border border-gray-200 rounded-xl p-3 hover:border-black transition-colors cursor-pointer bg-white">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full outline-none text-sm bg-transparent cursor-pointer text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Package Selection - Step 2 (Conditional) */}
                  {!selectedDate ? (
                    <div className="text-center py-6 px-4 bg-gray-50 rounded-xl border border-gray-100 mb-4 animate-in fade-in zoom-in-95 duration-300">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-600">Please select a date to view available packages.</p>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Package</label>
                        <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                          <SelectTrigger className="w-full rounded-xl border-gray-200 h-12">
                            <SelectValue placeholder="Choose a package" />
                          </SelectTrigger>
                          <SelectContent>
                            {event.packages.map((pkg) => (
                              <SelectItem key={pkg.id} value={String(pkg.id)}>
                                <div className="flex justify-between w-full gap-4 items-center">
                                  <span className="font-medium">{pkg.name}</span>
                                  <span className="text-xs text-gray-500 capitalize">{pkg.paymentMode?.replace('_', ' ') || 'full'}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {!selectedPackage ? (
                        <div className="text-center py-4 px-4 bg-orange-50 rounded-xl border border-orange-100 mb-4 animate-in fade-in zoom-in-95 duration-300">
                          <Sparkles className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                          <p className="text-sm font-medium text-orange-800">Please select a package above to view pricing.</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-end mb-6 animate-in fade-in slide-in-from-bottom-2">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">AED {selectedPkg?.price}</span>
                              <span className="text-gray-500 text-sm"> / person</span>
                              <div className="text-xs text-gray-500 mt-1 capitalize">
                                Payment: {selectedPkg?.paymentMode?.replace('_', ' ') || 'full'}
                                {selectedPkg?.paymentMode === 'deposit' && (
                                  <span> (Deposit AED {selectedPkg?.depositAmount})</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="w-4 h-4 fill-current text-gray-900" />
                              <span className="font-semibold">{event.rating}</span>
                              <span className="text-gray-500 underline">({event.reviews})</span>
                            </div>
                          </div>

                          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 delay-100">
                            <div className="grid grid-cols-1 gap-2">
                              {/* Guest Count */}
                              <div className="border border-gray-200 rounded-xl p-3 hover:border-black transition-colors cursor-pointer">
                                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1">Guests</label>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{guestCount} guests</span>
                                  <div className="flex gap-2">
                                    <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-gray-100">-</button>
                                    <button onClick={() => setGuestCount(guestCount + 1)} className="w-6 h-6 rounded-full border flex items-center justify-center hover:bg-gray-100">+</button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="pt-4 pb-2">
                              <Button
                                size="lg"
                                className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-brand-purple to-brand-orange hover:opacity-90 shadow-lg"
                                onClick={() => {
                                  const pkg = event.packages.find(p => p.id === parseInt(selectedPackage))
                                  navigate(`/booking/${event.id}`, {
                                    state: {
                                      event: event.title,
                                      venue: event.venue,
                                      date: selectedDate,
                                      time: event.time,
                                      price: pkg?.price,
                                      guests: guestCount,
                                      package: pkg?.name,
                                      image: event.images[0],
                                      paymentMode: pkg?.paymentMode || 'full',
                                      depositAmount: pkg?.depositAmount || 0
                                    }
                                  })
                                }}
                              >
                                Reserve
                              </Button>
                            </div>

                            <div className="pt-2">
                              <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl border-gray-200"
                                onClick={() => {
                                  const pkg = event.packages.find(p => p.id === parseInt(selectedPackage))
                                  addToCart({
                                    eventId: event.id,
                                    eventTitle: event.title,
                                    venue: event.venue,
                                    date: selectedDate,
                                    time: event.time,
                                    packageId: pkg?.id,
                                    packageName: pkg?.name,
                                    guests: guestCount,
                                    price: pkg?.price,
                                    image: event.images[0],
                                    paymentMode: pkg?.paymentMode || 'full',
                                    depositAmount: pkg?.depositAmount || 0
                                  })
                                  setCartAdded(true)
                                  setTimeout(() => setCartAdded(false), 2000)
                                }}
                              >
                                Add to Cart
                              </Button>
                              {cartAdded && (
                                <div className="mt-2 text-xs text-green-600 text-center">
                                  Added to cart
                                </div>
                              )}
                            </div>

                            <p className="text-center text-xs text-gray-500">You won't be charged yet</p>

                            <div className="space-y-2 pt-4 border-t border-gray-100 text-sm text-gray-600">
                              <div className="flex justify-between">
                                <span className="truncate max-w-[150px]">{event.packages.find(p => p.id === parseInt(selectedPackage))?.name} x {guestCount}</span>
                                <span>AED {(event.packages.find(p => p.id === parseInt(selectedPackage))?.price || 0) * guestCount}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="underline">Service fee</span>
                                <span>AED 45</span>
                              </div>
                              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                <span>Total</span>
                                <span>AED {(event.packages.find(p => p.id === parseInt(selectedPackage))?.price || 0) * guestCount + 45}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6 text-center">
                <button className="flex items-center justify-center space-x-2 text-gray-500 hover:text-gray-900 mx-auto text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  <span>Share this experience</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage




