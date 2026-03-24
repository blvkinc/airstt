import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('stt_cart')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('stt_cart', JSON.stringify(items))
  }, [items])

  const addToCart = (item) => {
    setItems(prev => {
      const matchIndex = prev.findIndex(existing =>
        existing.eventId === item.eventId &&
        existing.packageId === item.packageId &&
        existing.date === item.date
      )
      if (matchIndex >= 0) {
        const updated = [...prev]
        updated[matchIndex] = {
          ...updated[matchIndex],
          guests: (updated[matchIndex].guests || 1) + (item.guests || 1)
        }
        return updated
      }
      return [...prev, { ...item, id: Date.now() }]
    })
  }

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateGuests = (id, guests) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, guests } : item))
  }

  const clearCart = () => setItems([])

  const itemCount = useMemo(() => items.length, [items])
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0) * (item.guests || 1), 0), [items])

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateGuests,
      clearCart,
      itemCount,
      total
    }}>
      {children}
    </CartContext.Provider>
  )
}
