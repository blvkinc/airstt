import React, { createContext, useContext, useState } from 'react'

const BookingContext = createContext()

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within a BookingProvider')
  return context
}

export const BookingProvider = ({ children, initialFavorites = [] }) => {
  const [favorites, setFavorites] = useState(initialFavorites)

  const toggleFavorite = (item) => {
    setFavorites((current) =>
      current.some((favorite) => favorite.id === item.id)
        ? current.filter((favorite) => favorite.id !== item.id)
        : [...current, item]
    )
  }

  return <BookingContext.Provider value={{ favorites, toggleFavorite }}>{children}</BookingContext.Provider>
}
