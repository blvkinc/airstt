import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      event: "Luxury Brunch at Burj Al Arab",
      venue: "Al Muntaha Restaurant",
      date: "2024-12-15",
      time: "11:00 AM - 3:00 PM",
      status: "Confirmed",
      price: 549,
      guests: 2,
      package: "Couple Package",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=150&fit=crop"
    },
    {
      id: 2,
      event: "Rooftop Party Experience",
      venue: "Sky Lounge Dubai",
      date: "2024-11-28",
      time: "7:00 PM - 12:00 AM",
      status: "Completed",
      price: 199,
      guests: 4,
      package: "Group Package",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=150&fit=crop"
    }
  ])

  const [favorites, setFavorites] = useState([
    {
      id: 1,
      name: "Beach Club Brunch",
      venue: "Azure Beach Club",
      rating: 4.7,
      price: 249,
      image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=200&h=150&fit=crop"
    },
    {
      id: 2,
      name: "Business Lunch Meeting",
      venue: "Four Seasons Resort",
      rating: 4.4,
      price: 149,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=150&fit=crop"
    }
  ])

  const addBooking = (bookingData) => {
    const newBooking = {
      id: Date.now(),
      ...bookingData,
      status: 'Confirmed',
      date: new Date(bookingData.date).toLocaleDateString(),
    }
    setBookings(prev => [newBooking, ...prev])
    return newBooking
  }

  const addToFavorites = (item) => {
    setFavorites(prev => {
      if (prev.find(fav => fav.id === item.id)) {
        return prev // Already in favorites
      }
      return [...prev, item]
    })
  }

  const removeFromFavorites = (itemId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== itemId))
  }

  const value = {
    bookings,
    favorites,
    addBooking,
    addToFavorites,
    removeFromFavorites
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}