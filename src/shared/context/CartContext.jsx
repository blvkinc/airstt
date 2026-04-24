import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  addCustomerCartItem,
  clearCustomerCart as clearCustomerCartApi,
  fetchCustomerCart,
  removeCustomerCartItem,
  updateCustomerCartItem,
} from '../api/customerCartApi'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setError('')
      setLoading(false)
      return
    }

    setLoading(true)

    try {
      const payload = await fetchCustomerCart()
      setItems(payload.items)
      setError('')
    } catch (nextError) {
      setError(nextError?.message || 'Unable to load your cart right now.')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const addToCart = useCallback(async (item) => {
    if (!isAuthenticated) {
      const authError = new Error('Please sign in to add this booking to your cart.')
      authError.status = 401
      throw authError
    }

    const nextItem = await addCustomerCartItem({ item })

    setItems((prev) => {
      const matchIndex = prev.findIndex((existing) => existing.id === nextItem.id)
      if (matchIndex >= 0) {
        const updated = [...prev]
        updated[matchIndex] = { ...updated[matchIndex], ...nextItem }
        return updated
      }

      return [...prev, nextItem]
    })
    setError('')

    return nextItem
  }, [isAuthenticated])

  const removeFromCart = useCallback(async (id) => {
    await removeCustomerCartItem({ cartItemId: id })
    setItems((prev) => prev.filter((item) => item.id !== id))
    setError('')
  }, [])

  const updateGuests = useCallback(async (id, guests) => {
    const normalizedGuests = Math.max(1, Number(guests || 1))
    const updatedItem = await updateCustomerCartItem({ cartItemId: id, guests: normalizedGuests })

    setItems((prev) => prev.map((item) => item.id === id ? { ...item, ...updatedItem, guests: normalizedGuests, quantity: normalizedGuests } : item))
    setError('')
  }, [])

  const clearCart = useCallback(async () => {
    await clearCustomerCartApi()
    setItems([])
    setError('')
  }, [])

  const itemCount = useMemo(() => items.length, [items])
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price || 0) * (item.guests || 1), 0), [items])

  return (
    <CartContext.Provider value={{
      items,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateGuests,
      clearCart,
      reloadCart: loadCart,
      itemCount,
      total,
    }}>
      {children}
    </CartContext.Provider>
  )
}
