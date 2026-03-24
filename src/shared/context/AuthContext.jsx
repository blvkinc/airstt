import React, { createContext, useContext, useState, useEffect } from 'react'

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

  // Check for existing user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('stt_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Simple validation - in real app this would be API call
    if (email && password.length >= 6) {
      const userData = {
        id: Date.now(),
        email,
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        phone: '+971 50 123 4567',
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        accountType: 'Standard',
        rewardPoints: 250,
        totalBookings: 0,
        favoriteVenues: 0,
        nextRewardTier: 'Premium',
        pointsToNextTier: 750
      }
      
      setUser(userData)
      localStorage.setItem('stt_user', JSON.stringify(userData))
      return { success: true }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const register = async (userData) => {
    // Simple validation - in real app this would be API call
    const { firstName, lastName, email, phone, password } = userData
    
    if (firstName && lastName && email && phone && password.length >= 6) {
      const newUser = {
        id: Date.now(),
        email,
        name: `${firstName} ${lastName}`,
        phone,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        accountType: 'Standard',
        rewardPoints: 100, // Welcome bonus
        totalBookings: 0,
        favoriteVenues: 0,
        nextRewardTier: 'Premium',
        pointsToNextTier: 900
      }
      
      setUser(newUser)
      localStorage.setItem('stt_user', JSON.stringify(newUser))
      return { success: true }
    }
    
    return { success: false, error: 'Please fill all required fields' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('stt_user')
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('stt_user', JSON.stringify(updatedUser))
  }

  const upgradeToPremium = () => {
    const premiumUser = {
      ...user,
      accountType: 'Premium',
      rewardPoints: user.rewardPoints + 200, // Upgrade bonus
      nextRewardTier: 'Platinum',
      pointsToNextTier: 500
    }
    setUser(premiumUser)
    localStorage.setItem('stt_user', JSON.stringify(premiumUser))
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    upgradeToPremium,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}