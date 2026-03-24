import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, User, Heart, Menu, LogOut, Settings, Crown, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Card, CardContent } from './ui/card'
import { useAuth } from '../../shared/context/AuthContext'
import { cn } from '../../shared/lib/utils'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/explore', label: 'Explore' },
    { href: '/events', label: 'Events' },
    { href: '/venues', label: 'Venues' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl text-gray-900 hidden sm:block">Set The Table</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-orange-600 relative py-2",
                    isActive(item.href) 
                      ? "text-orange-600" 
                      : "text-gray-700"
                  )}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events, venues..."
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button - Mobile */}
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Search className="w-4 h-4" />
              </Button>

              {/* Favorites */}
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-orange-500 hover:bg-orange-600">
                  3
                </Badge>
              </Button>

              {/* Business Link */}
              <Link to="/merchant/auth">
                <Button variant="outline" size="sm" className="hidden sm:flex border-orange-200 text-orange-600 hover:bg-orange-50">
                  For Businesses
                </Button>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user?.name || 'User'}
                    </span>
                  </Button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <Card className="absolute right-0 top-full mt-2 w-56 shadow-lg border-0 bg-white/95 backdrop-blur-sm">
                      <CardContent className="p-2">
                        <div className="space-y-1">
                          <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <User className="w-4 h-4 mr-2" />
                              My Profile
                            </Button>
                          </Link>
                          <Link to="/premium" onClick={() => setUserMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Crown className="w-4 h-4 mr-2" />
                              Upgrade to Premium
                            </Button>
                          </Link>
                          <div className="border-t border-gray-200 my-2" />
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                    Sign In
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <Card className="fixed top-0 right-0 h-full w-80 max-w-[90vw] shadow-xl border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="font-bold text-lg text-gray-900">Set The Table</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events, venues..."
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2 mb-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-base",
                        isActive(item.href) && "bg-orange-50 text-orange-600"
                      )}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-2">
                <Link to="/merchant/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    For Businesses
                  </Button>
                </Link>
                <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-red-600">
                    Super Admin
                  </Button>
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="mt-6">
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Navbar

