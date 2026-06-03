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

const EMPTY_CART_SUMMARY = {
  grossLineTotal: 0,
  cartEntitlementAdjustmentAmount: 0,
  cartEntitlementAdjustments: [],
  lineTotal: 0,
  onlineDueAmount: 0,
  offlineDueAmount: 0,
  remainingBalanceAmount: 0,
  itemCount: 0,
  currency: 'AED',
}

const toNumber = (value) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : 0
}

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
  const [summary, setSummary] = useState(EMPTY_CART_SUMMARY)
  const [initialLoading, setInitialLoading] = useState(false)
  const [pendingQuantityByItemId, setPendingQuantityByItemId] = useState({})
  const [error, setError] = useState('')

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([])
      setSummary(EMPTY_CART_SUMMARY)
      setError('')
      setInitialLoading(false)
      return
    }

    setInitialLoading(true)

    try {
      const payload = await fetchCustomerCart()
      setItems(payload.items)
      setSummary(payload.summary || EMPTY_CART_SUMMARY)
      setError('')
    } catch (nextError) {
      setError(nextError?.message || 'Unable to load your cart right now.')
    } finally {
      setInitialLoading(false)
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

    setError('')
    await loadCart()

    return nextItem
  }, [isAuthenticated, loadCart])

  const removeFromCart = useCallback(async (id) => {
    await removeCustomerCartItem({ cartItemId: id })
    setError('')
    await loadCart()
  }, [loadCart])

  const updateQuantity = useCallback(async (id, quantity) => {
    const normalizedQuantity = Math.max(1, Number(quantity || 1))

    setPendingQuantityByItemId((current) => ({ ...current, [id]: true }))

    try {
      await updateCustomerCartItem({ cartItemId: id, quantity: normalizedQuantity })
      await loadCart()
      setError('')
    } catch (nextError) {
      setError(nextError?.message || 'Unable to update quantity right now.')
      throw nextError
    } finally {
      setPendingQuantityByItemId((current) => {
        const nextPendingState = { ...current }
        delete nextPendingState[id]
        return nextPendingState
      })
    }
  }, [loadCart])

  const clearCart = useCallback(async () => {
    await clearCustomerCartApi()
    setItems([])
    setSummary(EMPTY_CART_SUMMARY)
    setError('')
  }, [])

  const itemCount = useMemo(
    () => summary.itemCount || items.reduce((count, item) => count + Math.max(1, toNumber(item?.quantity)), 0),
    [items, summary.itemCount]
  )
  const total = useMemo(() => summary.lineTotal || 0, [summary.lineTotal])

  return (
    <CartContext.Provider value={{
      items,
      loading: initialLoading,
      initialLoading,
      pendingQuantityByItemId,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      reloadCart: loadCart,
      itemCount,
      total,
      summary,
    }}>
      {children}
    </CartContext.Provider>
  )
}
