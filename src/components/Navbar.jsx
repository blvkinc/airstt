import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Calendar, CalendarDays, Heart, Home as HomeIcon, Search as SearchIcon, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../shared/context/AuthContext'
import { cn } from '../shared/lib/utils'
import { SttDesktopSearchBar, SttSearchOverlay } from './SttDiscovery'
import sttLogo from '../shared/assets/sttmainlogo.svg'

const brandLogoFilter = {
  filter: 'brightness(0) saturate(100%) invert(59%) sepia(19%) saturate(761%) hue-rotate(238deg) brightness(88%) contrast(87%)',
}

const discoveryPaths = ['/', '/index.html', '/events', '/experiences', '/venues', '/map']

const buildExploreHref = ({ keyword = '', location = '', category = '', dateTime = '', guests = '' } = {}) => {
  const params = new URLSearchParams()
  const query = keyword || category || location || dateTime || ''

  if (query) params.set('q', query)
  if (location) params.set('location', location)
  if (category) params.set('category', category)
  if (dateTime) params.set('date', dateTime)
  if (guests) params.set('guests', guests)

  const queryString = params.toString()
  return queryString ? `/explore?${queryString}` : '/explore'
}

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const usesDiscoveryHeader = discoveryPaths.includes(location.pathname)
  const hideMobileTopHeader = location.pathname === '/profile'
  const mobileSearchOpen = location.pathname === '/map' || ((location.pathname === '/' || location.pathname === '/index.html') && new URLSearchParams(location.search).get('search') === 'open')
  const profileHref = isAuthenticated ? '/profile' : '/auth?redirect=%2Fprofile'
  const bookingsHref = isAuthenticated ? '/profile?tab=bookings' : '/auth?redirect=%2Fprofile%3Ftab%3Dbookings'
  const profileTab = new URLSearchParams(location.search).get('tab')

  const bottomNavigationItems = [
    { href: '/', label: 'Home', icon: HomeIcon, active: (location.pathname === '/' || location.pathname === '/index.html') && !mobileSearchOpen },
    { href: '/map', label: 'Search', icon: SearchIcon, active: mobileSearchOpen || location.pathname === '/explore' },
    { href: bookingsHref, label: 'My Bookings', icon: Calendar, active: location.pathname === '/profile' && ['bookings', 'activity'].includes(profileTab) },
    { href: profileHref, label: 'Profile', icon: User, active: location.pathname === '/profile' && !['bookings', 'activity'].includes(profileTab) },
  ]

  const mobileBottomNav = (
    <nav className="fixed bottom-3 left-0 z-50 w-[100vw] max-w-[390px] px-3 md:hidden">
      <div className="grid grid-cols-4 gap-1 rounded-[18px] border border-white/80 bg-white/85 p-1.5 shadow-[0_14px_32px_rgba(15,23,42,0.13)] backdrop-blur-xl">
        {bottomNavigationItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                'flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-center text-[10px] font-semibold transition-colors',
                item.active ? 'text-gray-950' : 'text-gray-500 hover:bg-white/55 hover:text-gray-950',
              )}
            >
              <Icon strokeWidth={1.85} className={cn('h-4 w-4', item.active ? 'fill-gray-950/5' : '')} />
              <span className="w-full truncate leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )

  const handleApplySearch = (payload = {}) => {
    setSearchOpen(false)
    navigate(buildExploreHref(payload))
  }

  if (usesDiscoveryHeader) {
    return mobileBottomNav
  }

  return (
    <>
      <SttSearchOverlay open={searchOpen} mode="home" onClose={() => setSearchOpen(false)} onApplySearch={handleApplySearch} />

      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="fixed left-0 top-0 z-50 w-screen max-w-[100vw] overflow-hidden border-b border-gray-100 bg-white/95 shadow-[0_2px_14px_rgba(15,23,42,0.06)] backdrop-blur-xl"
      >
        <div className="mx-auto hidden h-[86px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-8 px-10 md:grid">
          <Link to="/" className="flex items-center">
            <img src={sttLogo} alt="Set The Table" className="h-12 w-auto object-contain" style={brandLogoFilter} />
          </Link>

          <SttDesktopSearchBar mode="condensed" compact onApplySearch={handleApplySearch} onOpenSearch={() => setSearchOpen(true)} />

          <div className="flex items-center justify-end gap-5 text-brand-purple">
            <Link to="/venues" className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-gray-700">List a Venue</Link>
            <Link to="/profile?tab=favorites" aria-label="Favorites">
              <Heart className="h-5 w-5" strokeWidth={1.8} />
            </Link>
            <Link to={bookingsHref} aria-label="My bookings">
              <CalendarDays className="h-5 w-5" strokeWidth={1.8} />
            </Link>
            <Link to={profileHref} aria-label="Profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-purple/45 text-xs font-bold">
              <User className="h-4 w-4" strokeWidth={1.8} />
            </Link>
          </div>
        </div>

        {!hideMobileTopHeader && (
          <div className="flex h-[72px] w-[100vw] max-w-[390px] items-center justify-between px-5 md:hidden">
            <Link to="/" className="block">
              <img src={sttLogo} alt="Set The Table" className="h-9 w-auto" style={brandLogoFilter} />
            </Link>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-[0_2px_12px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
                <SearchIcon className="h-4 w-4" strokeWidth={2} />
              </button>
          </div>
        </div>
      )}
      </motion.header>

      {mobileBottomNav}
    </>
  )
}

export default Navbar
