import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { User, Heart, Menu, LogOut, X, Building, ArrowRight, Check, Calendar, ShoppingBag } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'
import { useAuth } from '../shared/context/AuthContext'
import { useCart } from '../shared/context/CartContext'
import { cn } from '../shared/lib/utils'
import sttLogo from '../shared/assets/sttmainlogo.svg'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [businessPopupOpen, setBusinessPopupOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isOnWhiteBackground, setIsOnWhiteBackground] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()
  const { itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const whiteBackgroundPages = ['/auth', '/profile', '/premium', '/review', '/cart']
    const isWhitePage = whiteBackgroundPages.some(page => location.pathname.startsWith(page)) ||
      location.pathname.includes('/events/') ||
      location.pathname.includes('/venues/') ||
      location.pathname.includes('/packages')
    setIsOnWhiteBackground(isWhitePage)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    navigate('/auth', { replace: true })
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
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full"
        animate={{
          paddingTop: scrolled || isOnWhiteBackground ? "1.5rem" : "1.5rem",
          paddingBottom: scrolled || isOnWhiteBackground ? "1rem" : "1.5rem"
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          layout
          initial={false}
          animate={scrolled || isOnWhiteBackground
            ? {
              width: "90%",
              maxWidth: "56rem", // Desktop: compact pill
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "9999px",
              borderWidth: "1px",
              borderColor: "rgba(255, 255, 255, 0.4)",
              paddingLeft: "1.5rem", // Slightly less padding on mobile
              paddingRight: "1.5rem",
              paddingTop: "0.75rem",
              paddingBottom: "0.75rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)"
            }
            : {
              width: "100%",
              maxWidth: "80rem",
              backgroundColor: "rgba(255, 255, 255, 0)",
              borderRadius: "0px",
              borderWidth: "1px",
              borderColor: "transparent",
              paddingLeft: "1.5rem", // Consistent padding base
              paddingRight: "1.5rem",
              paddingTop: "0rem",
              paddingBottom: "0rem",
              boxShadow: "none"
            }
          }
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 20,
            mass: 1
          }}
          className={cn(
            "flex items-center justify-between relative",
            scrolled || isOnWhiteBackground ? "backdrop-blur-xl" : "",
            // Responsive width fix: Ensure it doesn't get too narrow on very small screens
            scrolled || isOnWhiteBackground ? "w-[95%] md:w-[90%]" : "w-full"
          )}
        >

          {/* Left Side: Logo */}
          <div className="flex items-center shrink-0 z-20">
            <Link to="/" className="block">
              <img
                src={sttLogo}
                alt="STT"
                className={cn(
                  "transition-all duration-500 ease-in-out object-contain",
                  scrolled || isOnWhiteBackground
                    ? "h-9"
                    : "h-12 brightness-0 invert"
                )}
                style={scrolled || isOnWhiteBackground ? {
                  filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(246deg) brightness(104%) contrast(97%)'
                } : {}}
              />
            </Link>
          </div>

          {/* Center: Navigation - Absolute Centered & Glassy */}
          <div className={cn(
            "hidden md:flex items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
            "transition-opacity duration-300"
          )}>
            <div className={cn(
              "flex items-center gap-1 p-1.5 rounded-full transition-all duration-500",
              scrolled || isOnWhiteBackground ? "bg-black/5 border border-white/10" : "bg-white/10 border border-white/20"
            )}>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-5 py-2 rounded-full text-sm font-medium transition-all duration-500",
                    isActive(item.href)
                      ? "bg-white shadow-sm text-brand-purple"
                      : scrolled || isOnWhiteBackground
                        ? "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        : "text-white/90 hover:text-white hover:bg-white/20"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            {/* Business Button - Desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBusinessPopupOpen(true)}
              className={cn(
                "hidden lg:flex items-center gap-2 rounded-full transition-all duration-300",
                scrolled || isOnWhiteBackground
                  ? "hover:bg-brand-purple/10 text-gray-700 hover:text-brand-purple"
                  : "hover:bg-white/20 text-white"
              )}
            >
              <span className="text-sm font-medium">For Business</span>
            </Button>

          {/* Favorites - Mobile & Desktop */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
                "rounded-full transition-all hover:scale-105",
                scrolled || isOnWhiteBackground ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/20 text-white"
              )}
            >
              <Heart strokeWidth={1.5} className={cn("w-5 h-5", scrolled || isOnWhiteBackground ? "" : "text-white")} />
            </Button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full transition-all hover:scale-105",
                  scrolled || isOnWhiteBackground ? "hover:bg-gray-100 text-gray-700" : "hover:bg-white/20 text-white"
                )}
              >
                <ShoppingBag strokeWidth={1.5} className={cn("w-5 h-5", scrolled || isOnWhiteBackground ? "" : "text-white")} />
              </Button>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-purple text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "rounded-full gradient-brand p-0.5",
                    "hover:scale-105 transition-transform"
                  )}
                >
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <span className="text-sm font-bold gradient-brand-text bg-clip-text text-transparent">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </Button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 animate-in fade-in slide-in-from-top-2">
                    <Card className="border border-gray-100 shadow-2xl rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xl">
                      <div className="p-5 bg-gradient-to-br from-brand-purple/5 via-white to-brand-blue/5 border-b border-gray-100/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center p-[2px] shadow-sm">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                              <span className="text-lg font-bold gradient-brand-text bg-clip-text text-transparent">
                                {user?.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-gray-900 truncate tracking-tight">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 space-y-0.5">
                        <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start rounded-xl h-11 font-medium text-gray-700 hover:text-brand-purple hover:bg-brand-purple/5 transition-all">
                            <User strokeWidth={1.75} className="w-4 h-4 mr-3" /> My Profile
                          </Button>
                        </Link>
                        <Link to="/profile?tab=bookings" onClick={() => setUserMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start rounded-xl h-11 font-medium text-gray-700 hover:text-brand-blue hover:bg-brand-blue/5 transition-all">
                            <Calendar strokeWidth={1.75} className="w-4 h-4 mr-3" /> My Bookings
                          </Button>
                        </Link>
                        <Link to="/profile?tab=favorites" onClick={() => setUserMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start rounded-xl h-11 font-medium text-gray-700 hover:text-brand-red hover:bg-brand-red/5 transition-all">
                            <Heart strokeWidth={1.75} className="w-4 h-4 mr-3" /> Favorites
                          </Button>
                        </Link>
                        <div className="h-px bg-gray-100/80 my-2 mx-2" />
                        <Button variant="ghost" className="w-full justify-start rounded-xl h-11 font-medium text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-all" onClick={handleLogout}>
                          <LogOut strokeWidth={1.75} className="w-4 h-4 mr-3" /> Sign Out
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  variant="default"
                  className={cn(
                    "rounded-full px-6 transition-all shadow-lg hover:shadow-xl hover:scale-105 border-0 font-semibold",
                    // Logic: If scrolled, use brand purple bg. If transparent, use white bg with purple text.
                    scrolled || isOnWhiteBackground
                      ? "bg-brand-purple text-white hover:bg-brand-purple/90"
                      : "bg-white text-brand-purple hover:bg-gray-100"
                  )}
                >
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "md:hidden rounded-full",
                scrolled || isOnWhiteBackground ? "text-gray-900" : "text-white"
              )}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu strokeWidth={1.5} className="w-6 h-6" />
            </Button>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6"
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl gradient-brand-text bg-clip-text text-transparent">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X strokeWidth={1.5} className="w-6 h-6" />
              </Button>
            </div>

            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 rounded-2xl text-lg font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-brand-purple/10 text-brand-purple"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t space-y-3">
              <Button
                variant="outline"
                className="w-full rounded-xl justify-start h-12 border-2"
                onClick={() => setBusinessPopupOpen(true)}
              >
                <Building strokeWidth={1.5} className="w-5 h-5 mr-3 text-brand-purple" />
                For Business
              </Button>
              {!isAuthenticated && (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full rounded-xl h-12 gradient-brand text-white shadow-lg">
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Business Popup */}
      {businessPopupOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBusinessPopupOpen(false)} />
          <Card className="w-full max-w-lg relative z-10 overflow-hidden rounded-3xl shadow-2xl border-0 animate-in zoom-in-95">
            <div className="h-40 gradient-brand p-8 flex flex-col justify-end text-white relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full"
                onClick={() => setBusinessPopupOpen(false)}
              >
                <X strokeWidth={1.5} className="w-5 h-5" />
              </Button>
              <h2 className="text-3xl font-bold mb-1">Partner with us</h2>
              <p className="opacity-90 text-lg">Grow your business with Set The Table</p>
            </div>
            <div className="p-8 space-y-6 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 hover:bg-brand-purple/5 transition-colors border border-transparent hover:border-brand-purple/10">
                  <span className="text-3xl mb-3 block">📈</span>
                  <h3 className="font-bold text-gray-900">Boost Revenue</h3>
                  <p className="text-xs text-gray-500 mt-1">Increase your bookings during off-peak hours.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 hover:bg-brand-blue/5 transition-colors border border-transparent hover:border-brand-blue/10">
                  <span className="text-3xl mb-3 block">🎯</span>
                  <h3 className="font-bold text-gray-900">Target Ads</h3>
                  <p className="text-xs text-gray-500 mt-1">Reach the right customers with precision.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check strokeWidth={1.5} className="w-4 h-4 text-green-500" />
                  <span>No hidden fees, pay only for results</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Check strokeWidth={1.5} className="w-4 h-4 text-green-500" />
                  <span>24/7 Support and dedicated account manager</span>
                </div>
              </div>

              <a
                href="mailto:hello@setthetable.ae?subject=Partner%20with%20Set%20The%20Table"
                onClick={() => setBusinessPopupOpen(false)}
              >
                <Button className="w-full h-14 text-lg rounded-full gradient-brand text-white shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                  Get Started <ArrowRight strokeWidth={1.5} className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default Navbar

