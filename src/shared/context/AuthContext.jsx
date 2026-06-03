import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  clearStoredCustomerSession,
  createCustomerAddressWithApi,
  deleteCustomerAddressWithApi,
  fetchCurrentCustomerWithApi,
  fetchCustomerProfileWithApi,
  getStoredCustomerToken,
  getStoredCustomerUser,
  loginCustomerWithApi,
  logoutCustomerWithApi,
  registerCustomerWithApi,
  resendCustomerVerificationWithApi,
  updateCustomerAddressWithApi,
  updateCustomerProfileWithApi,
} from '../lib/customerAuthApi'
import { hasRequiredCustomerProfile } from '../lib/customerProfileCompletion'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const bootstrap = async () => {
      const storedUser = getStoredCustomerUser()
      const storedToken = getStoredCustomerToken()

      if (!storedUser || !storedToken) {
        clearStoredCustomerSession()
        setLoading(false)
        return
      }

      setUser(storedUser)

      try {
        const freshUser = await fetchCurrentCustomerWithApi()
        setUser(freshUser)
      } catch {
        clearStoredCustomerSession()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    bootstrap()
  }, [])

  const login = async (email, password) => {
    try {
      const session = await loginCustomerWithApi({ email, password })
      setUser(session.user)
      return {
        success: true,
        user: session.user,
        requiresProfileCompletion: !hasRequiredCustomerProfile(session.user),
      }
    } catch (error) {
      return { success: false, error: error?.message || 'Invalid credentials' }
    }
  }

  const register = async (userData) => {
    try {
      const session = await registerCustomerWithApi(userData)
      setUser(session.user)
      return { success: true, user: session.user }
    } catch (error) {
      return { success: false, error: error?.message || 'Please fill all required fields' }
    }
  }

  const logout = async () => {
    await logoutCustomerWithApi()
    setUser(null)
  }

  const refreshUserProfile = async () => {
    const refreshedUser = await fetchCustomerProfileWithApi()
    setUser(refreshedUser)
    return refreshedUser
  }

  const updateUser = async (profileFields) => {
    const updatedUser = await updateCustomerProfileWithApi(profileFields)
    setUser(updatedUser)
    return updatedUser
  }

  const createAddress = async (addressFields) => {
    await createCustomerAddressWithApi(addressFields)
    return refreshUserProfile()
  }

  const updateAddress = async (addressId, addressFields) => {
    await updateCustomerAddressWithApi(addressId, addressFields)
    return refreshUserProfile()
  }

  const deleteAddress = async (addressId) => {
    await deleteCustomerAddressWithApi(addressId)
    return refreshUserProfile()
  }

  const resendVerification = async () => resendCustomerVerificationWithApi()

  const upgradeToPremium = () => {}

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUserProfile,
    createAddress,
    updateAddress,
    deleteAddress,
    resendVerification,
    upgradeToPremium,
    isAuthenticated: !!user,
    requiresProfileCompletion: !!user && !hasRequiredCustomerProfile(user),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
