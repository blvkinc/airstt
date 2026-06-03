import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Heart, MapPin, Search, Sparkles, User, X } from 'lucide-react'
import { SttCategoryLinks, SttDesktopSearchBar } from '../components/SttDiscovery'
import { featuredEvents, homeTopVenues, trendingEvents } from '../features/experiences/data'
import sttLogo from '../shared/assets/sttmainlogo.svg'

const featuredEventItems = featuredEvents.filter(Boolean)
const uniqueById = (items) => {
  const seen = new Set()
  return items.filter((item) => {
    if (!item || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const trendingExperienceItems = uniqueById([...trendingEvents, ...featuredEvents].filter(Boolean)).slice(0, 5)
const popularVenueItems = homeTopVenues.filter(Boolean)

const bannerSlides = [
  {
    id: 'saiana-brunch',
    label: 'Featured Ad',
    title: 'Saiana Brunch',
    venue: 'BeBeach Dubai',
    description: 'Beach club brunch, pool access, live DJ sets, and Mediterranean dining.',
    price: 'From AED 320',
    to: '/events/99',
    image: featuredEventItems[0]?.image,
  },
  {
    id: 'rooftop-party',
    label: 'Weekend Feature',
    title: 'Rooftop Party Experience',
    venue: 'Sky Lounge Dubai',
    description: 'Late-night tables, skyline views, and hosted bottle-service packages.',
    price: 'From AED 199',
    to: '/events/2',
    image: featuredEventItems[2]?.image,
  },
  {
    id: 'desert-dinner',
    label: 'Limited Placement',
    title: 'Desert Safari & Dinner',
    venue: 'Desert Oasis Resort',
    description: 'A sunset destination experience with dinner, activities, and premium hosting.',
    price: 'From AED 299',
    to: '/events/11',
    image: trendingExperienceItems[3]?.image,
  },
]

const recentSearches = ['Secret Jungle Brunch', 'Dubai Harbour', 'Ladies Night']
const suggestedLocations = ['Dubai Harbour', 'Palm Jumeirah', 'Downtown Dubai', 'DIFC']
const dateTimeOptions = ['Today', 'This Weekend', 'Evening']
const searchCategoryTiles = [
  { label: 'Day Brunch', tab: 'events', icon: CalendarDays },
  { label: 'Evening Brunch', tab: 'events', icon: CalendarDays },
  { label: 'Pool Party', tab: 'events', icon: Sparkles },
  { label: 'Ladies Night', tab: 'experiences', icon: Sparkles },
]

const brandLogoFilter = {
  filter: 'brightness(0) saturate(100%) invert(59%) sepia(19%) saturate(761%) hue-rotate(238deg) brightness(88%) contrast(87%)',
}

const normalizeText = (value) => String(value || '').toLowerCase()

const matchesSearch = (item, searchTerm, keys) => {
  const needle = normalizeText(searchTerm).trim()
  if (!needle) return true
  return keys.some((key) => normalizeText(item?.[key]).includes(needle))
}

const scrollToSection = (element) => {
  if (!element) return
  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatEventDay = (event) => {
  if (event?.dateLabel === 'Daily') return 'Daily'
  if (event?.dateLabel?.startsWith('Every ')) return event.dateLabel.replace('Every ', '').slice(0, 3)
  if (event?.date) {
    const parsed = new Date(`${event.date}T12:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', { weekday: 'short' })
    }
  }
  return event?.dayPeriod === 'night' ? 'Night' : 'Day'
}

const getEventAddress = (event) => event?.venueDetails?.address || event?.location || event?.venue || 'Dubai'

const getCategoryPillClassName = (label = '') => {
  const value = label.toLowerCase()
  if (value.includes('beach') || value.includes('pool')) return 'bg-cyan-50 text-cyan-700 ring-cyan-100'
  if (value.includes('night') || value.includes('party')) return 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100'
  if (value.includes('dining') || value.includes('restaurant')) return 'bg-amber-50 text-amber-700 ring-amber-100'
  if (value.includes('brunch')) return 'bg-rose-50 text-rose-700 ring-rose-100'
  if (value.includes('venue')) return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  return 'bg-[#f4edff] text-brand-purple ring-brand-purple/15'
}

const dayPillClassName = 'bg-emerald-50 text-emerald-700 ring-emerald-100'

function SearchField({ icon: Icon, placeholder, value, onChange }) {
  return (
    <label className="flex h-12 w-[calc(100vw-56px)] max-w-full items-center gap-3 rounded-full bg-white px-4 text-gray-500 shadow-[0_2px_12px_rgba(15,23,42,0.12)] ring-1 ring-black/5 md:w-full">
      <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-0 min-w-0 flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
      />
    </label>
  )
}

function SearchOverlay({ open, initialKeyword, onClose, onApplySearch }) {
  const [keyword, setKeyword] = useState(initialKeyword || '')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    if (!open) return
    setKeyword(initialKeyword || '')
  }, [initialKeyword, open])

  if (!open) return null

  const applySearch = (overrides = {}) => {
    onApplySearch({
      keyword: overrides.keyword ?? keyword,
      location: overrides.location ?? location,
      dateTime: overrides.dateTime ?? dateTime,
      category: overrides.category,
      tab: overrides.tab,
    })
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-x-hidden bg-white md:bg-gray-950/25 md:px-5 md:py-10" role="dialog" aria-modal="true" aria-label="Search">
      <div className="min-h-full w-full max-w-full overflow-x-hidden bg-white px-7 pb-10 pt-16 md:mx-auto md:min-h-0 md:max-w-[440px] md:rounded-[28px] md:px-8 md:shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
        <div className="mb-5 flex w-[calc(100vw-56px)] max-w-full items-center justify-between md:w-full">
          <h2 className="text-lg font-extrabold text-gray-950">Search</h2>
          <button type="button" onClick={onClose} aria-label="Close search" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600">
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <form
          className="w-[calc(100vw-56px)] max-w-full space-y-3 md:w-full"
          onSubmit={(event) => {
            event.preventDefault()
            applySearch()
          }}
        >
          <SearchField icon={Search} placeholder="Any venues, experiences or events" value={keyword} onChange={setKeyword} />
          <SearchField icon={MapPin} placeholder="Location" value={location} onChange={setLocation} />
          <SearchField icon={Clock} placeholder="Date & Time" value={dateTime} onChange={setDateTime} />
          <button type="submit" className="mt-2 h-11 w-[calc(100vw-56px)] max-w-full rounded-full bg-brand-purple text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(15,23,42,0.14)] md:w-full">
            Search
          </button>
        </form>

        <section className="mt-8 w-[calc(100vw-56px)] max-w-full md:w-full">
          <h3 className="text-xl font-extrabold text-gray-950">Recent Searches</h3>
          <div className="mt-4 space-y-4">
            {recentSearches.map((item) => (
              <button key={item} type="button" onClick={() => applySearch({ keyword: item })} className="flex w-full items-center gap-5 text-left">
                <Search className="h-5 w-5 text-brand-purple" strokeWidth={2} />
                <span className="text-base font-semibold text-gray-950">{item}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 w-[calc(100vw-56px)] max-w-full md:w-full">
          <h3 className="text-xl font-extrabold text-gray-950">Suggested Locations</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedLocations.map((item) => (
              <button key={item} type="button" onClick={() => applySearch({ location: item })} className="rounded-full border border-brand-purple/15 bg-brand-purple/5 px-3 py-2 text-xs font-bold text-gray-800 shadow-sm">
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 w-[calc(100vw-56px)] max-w-full md:w-full">
          <h3 className="text-xl font-extrabold text-gray-950">Date & Time</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {dateTimeOptions.map((item) => (
              <button key={item} type="button" onClick={() => setDateTime(item)} className={`rounded-full px-3 py-2 text-xs font-bold shadow-sm ${dateTime === item ? 'bg-brand-purple text-white' : 'border border-gray-200 bg-white text-gray-700'}`}>
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 w-[calc(100vw-56px)] max-w-full md:w-full">
          <h3 className="text-xl font-extrabold text-gray-950">Top Categories</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {searchCategoryTiles.map((tile) => {
              const Icon = tile.icon

              return (
                <button key={tile.label} type="button" onClick={() => applySearch({ category: tile.label, keyword: tile.label, tab: tile.tab })} className="flex h-[90px] flex-col items-center justify-center gap-2 rounded-[14px] bg-white text-center shadow-[0_2px_12px_rgba(15,23,42,0.11)] ring-1 ring-black/5">
                  <Icon className="h-8 w-8 text-brand-purple" strokeWidth={1.8} />
                  <span className="text-sm font-bold text-gray-950">{tile.label}</span>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

function FeaturedAdSlider({ slides, activeIndex, onPrevious, onNext, onSelect }) {
  return (
    <div className="mx-auto w-full max-w-[100vw] overflow-hidden px-5 md:max-w-6xl md:px-8">
      <section className="relative mt-5 h-[154px] w-full overflow-hidden rounded-xl bg-[#d7d7d7] shadow-[0_4px_18px_rgba(15,23,42,0.10)] md:mt-9 md:h-[210px] md:rounded-2xl" aria-label="Featured ads">
        {slides.map((slide, index) => (
          <Link
            key={slide.id}
            to={slide.to}
            aria-hidden={index !== activeIndex}
            className={`absolute inset-0 transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950/78 via-gray-950/42 to-gray-950/8" />
            <div className="relative flex h-full max-w-[72%] flex-col justify-end p-4 text-white md:max-w-[58%] md:p-7">
              <span className="mb-2 w-fit rounded-full bg-brand-purple px-2.5 py-1 text-[8px] font-extrabold uppercase leading-none md:text-[10px]">
                {slide.label}
              </span>
              <h2 className="line-clamp-1 text-[19px] font-extrabold leading-tight md:text-4xl">{slide.title}</h2>
              <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-white/85 md:text-sm">{slide.venue}</p>
              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/80 md:mt-2 md:text-sm md:leading-5">{slide.description}</p>
              <div className="mt-2 flex items-center gap-2 md:mt-4">
                <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-extrabold text-gray-950 md:px-3 md:py-1.5 md:text-xs">{slide.price}</span>
                <span className="hidden text-xs font-bold text-white/90 md:inline">Explore</span>
              </div>
            </div>
          </Link>
        ))}

        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-white/88 p-1 shadow-[0_2px_10px_rgba(15,23,42,0.10)] backdrop-blur-md">
          <button type="button" onClick={onPrevious} aria-label="Previous featured ad" className="flex h-6 w-6 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100">
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
          <div className="flex items-center gap-1 px-1">
            {slides.map((slide, index) => (
              <button
                key={`${slide.id}-dot`}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Show ${slide.title}`}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-4 bg-brand-purple' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
          <button type="button" onClick={onNext} aria-label="Next featured ad" className="flex h-6 w-6 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100">
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>

        <div className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-extrabold text-gray-950 shadow-sm md:text-xs">
          {activeIndex + 1}/{slides.length}
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ title, actionTo }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[17px] font-extrabold tracking-tight text-gray-950 md:text-2xl">{title}</h2>
      {actionTo && (
        <Link to={actionTo} aria-label={`See all ${title}`} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-gray-200">
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      )}
    </div>
  )
}

function CompactEventCard({ event, badge = 'Featured' }) {
  const dayLabel = formatEventDay(event)
  const categoryLabel = event.category || event.type || 'Event'

  return (
    <Link to={`/events/${event.id}`} className="block w-[174px] shrink-0 snap-start md:w-full md:min-w-0">
      <article className="group">
        <div className="relative aspect-[1.48] overflow-hidden rounded-[14px] bg-gray-100 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition-shadow group-hover:shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-semibold leading-none text-gray-950 shadow-sm">
            {badge}
          </span>
          <button type="button" aria-label="Save event" className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white shadow-sm backdrop-blur-md">
            <Heart className="h-4 w-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <div className="flex min-h-[104px] flex-col pt-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-tight text-gray-950 md:min-h-[38px] md:text-[13px]">
              {event.title}
            </h3>
            <div className="shrink-0 text-right">
              <p className="text-[9px] font-semibold leading-none text-gray-950 md:text-[11px]">AED {event.price}</p>
              <p className="text-[7px] uppercase leading-none text-gray-400 md:text-[8px]">from</p>
            </div>
          </div>
          <div className="mt-1.5 space-y-0.5">
            <p className="flex items-center gap-1 truncate text-[9px] font-medium text-gray-500 md:text-xs">
              <MapPin className="h-3 w-3 shrink-0 text-gray-400" strokeWidth={1.8} />
              <span className="truncate">{event.venue}</span>
            </p>
            <p className="truncate text-[9px] text-gray-400 md:text-xs">{getEventAddress(event)}</p>
          </div>
          <div className="mt-auto flex min-h-[22px] flex-wrap gap-1.5 pt-2">
            <span className={`rounded-full px-2 py-1 text-[8px] font-semibold uppercase leading-none ring-1 md:text-[9px] ${getCategoryPillClassName(categoryLabel)}`}>{categoryLabel}</span>
            <span className={`rounded-full px-2 py-1 text-[8px] font-semibold uppercase leading-none ring-1 md:text-[9px] ${dayPillClassName}`}>{dayLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function CompactVenueCard({ venue }) {
  const categoryLabel = venue.category || venue.type || 'Venue'

  return (
    <Link to={`/venues/${venue.id}`} className="block w-[142px] shrink-0 snap-start md:w-full md:min-w-0">
      <article className="group">
        <div className="relative aspect-[1.22] overflow-hidden rounded-[14px] bg-gray-100 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition-shadow group-hover:shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
          <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-semibold leading-none text-gray-950 shadow-sm">Featured</span>
          <button type="button" aria-label="Save venue" className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white shadow-sm backdrop-blur-md">
            <Heart className="h-4 w-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <div className="flex min-h-[82px] flex-col pt-2">
          <h3 className="line-clamp-2 min-h-[30px] text-[12px] font-semibold leading-tight text-gray-950 md:min-h-[34px] md:text-[13px]">{venue.name}</h3>
          <div className="mt-1.5 flex min-h-[18px] items-center gap-1 truncate text-[9px] text-gray-500 md:text-xs">
            <MapPin className="h-3 w-3 shrink-0 text-gray-400" strokeWidth={1.8} />
            <span className="truncate">{venue.location}</span>
          </div>
          <div className="mt-auto flex pt-2">
            <span className={`w-fit rounded-full px-2 py-1 text-[8px] font-semibold uppercase leading-none ring-1 md:text-[9px] ${getCategoryPillClassName(categoryLabel)}`}>{categoryLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function HorizontalRail({ children }) {
  return (
    <div className="no-scrollbar -mx-5 flex w-screen max-w-[100vw] min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-4 scroll-px-5 md:mx-0 md:grid md:w-full md:max-w-full md:grid-cols-5 md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:scroll-px-0">
      {children}
    </div>
  )
}

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('events')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSearchTerm, setActiveSearchTerm] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeBannerSlide, setActiveBannerSlide] = useState(0)
  const sectionRefs = useRef({})
  const routeLocation = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBannerSlide((current) => (current + 1) % bannerSlides.length)
    }, 5500)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (new URLSearchParams(routeLocation.search).get('search') === 'open') {
      setSearchOpen(true)
    }
  }, [routeLocation.search])

  const featuredExperienceItems = useMemo(() => trendingExperienceItems.map((event) => ({
    ...event,
    category: event.category || 'Experience',
  })), [])

  const visibleEvents = useMemo(
    () => featuredEventItems.filter((event) => matchesSearch(event, activeSearchTerm, ['title', 'venue', 'location', 'category', 'dateLabel', 'dayPeriod'])),
    [activeSearchTerm],
  )

  const visibleExperiences = useMemo(
    () => featuredExperienceItems.filter((event) => matchesSearch(event, activeSearchTerm, ['title', 'venue', 'location', 'category', 'dateLabel', 'dayPeriod'])),
    [activeSearchTerm, featuredExperienceItems],
  )

  const visibleVenues = useMemo(
    () => popularVenueItems.filter((venue) => matchesSearch(venue, activeSearchTerm, ['name', 'location', 'category', 'type', 'address'])),
    [activeSearchTerm],
  )

  const closeSearch = () => {
    setSearchOpen(false)
    if (new URLSearchParams(routeLocation.search).get('search') === 'open') {
      navigate('/', { replace: true })
    }
  }

  const handleApplySearch = ({ keyword = '', location = '', category = '', tab } = {}) => {
    const nextTerm = (keyword || category || location || '').trim()
    const nextTab = tab || activeTab
    setSearchTerm(nextTerm)
    setActiveSearchTerm(nextTerm)
    setActiveTab(nextTab)
    closeSearch()
    window.setTimeout(() => scrollToSection(sectionRefs.current[nextTab]), 50)
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-20 text-gray-950 md:pb-0">
      <SearchOverlay open={searchOpen} initialKeyword={searchTerm} onClose={closeSearch} onApplySearch={handleApplySearch} />

      <section className="mx-auto w-full max-w-[100vw] overflow-x-hidden px-5 pt-5 md:max-w-6xl md:overflow-visible md:px-8 md:pt-7">
        <div className="md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <Link to="/" className="block">
              <img src={sttLogo} alt="Set The Table" className="h-9 w-auto" style={brandLogoFilter} />
            </Link>
            <span className="h-8 w-8" aria-hidden="true" />
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="mb-4 flex h-12 w-[calc(100vw-40px)] max-w-full items-center gap-3 overflow-hidden rounded-full bg-white pl-4 pr-1.5 text-left shadow-[0_2px_14px_rgba(15,23,42,0.12)] ring-1 ring-black/5"
          >
            <Search className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
            <span className="w-0 min-w-0 flex-1 truncate text-[12px] font-medium text-gray-500">
              {activeSearchTerm || 'Find Your Experience'}
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white shadow-[0_3px_10px_rgba(15,23,42,0.14)]">
              <Search className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
          </button>

          <SttCategoryLinks />
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
            <Link to="/" className="flex items-center">
              <img src={sttLogo} alt="Set The Table" className="h-12 w-auto object-contain" style={brandLogoFilter} />
            </Link>
            <SttCategoryLinks />
            <div className="flex items-center justify-end gap-5 text-brand-purple">
              <Link to="/venues" className="text-[11px] font-extrabold uppercase tracking-[0.32em] text-gray-700">List a Venue</Link>
              <Link to="/profile?tab=favorites" aria-label="Favorites">
                <Heart className="h-5 w-5" strokeWidth={1.8} />
              </Link>
              <Link to="/profile?tab=bookings" aria-label="My bookings">
                <CalendarDays className="h-5 w-5" strokeWidth={1.8} />
              </Link>
              <Link to="/profile" aria-label="Profile" className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-purple/45 text-xs font-bold">
                <User className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </div>
          </div>

          <SttDesktopSearchBar mode="home" searchTerm={activeSearchTerm} onApplySearch={handleApplySearch} onOpenSearch={() => setSearchOpen(true)} />
        </div>
      </section>

      <FeaturedAdSlider
        slides={bannerSlides}
        activeIndex={activeBannerSlide}
        onPrevious={() => setActiveBannerSlide((current) => (current - 1 + bannerSlides.length) % bannerSlides.length)}
        onNext={() => setActiveBannerSlide((current) => (current + 1) % bannerSlides.length)}
        onSelect={setActiveBannerSlide}
      />

      <main className="mx-auto mt-6 w-full max-w-[100vw] px-5 md:mt-9 md:max-w-6xl md:px-8">
        <section ref={(node) => { sectionRefs.current.events = node }} className="scroll-mt-8 md:scroll-mt-10">
          <SectionHeader title="Featured Events" actionTo="/events" />
          {visibleEvents.length > 0 ? (
            <HorizontalRail>
              {visibleEvents.map((event) => <CompactEventCard key={event.id} event={event} />)}
            </HorizontalRail>
          ) : (
            <div className="rounded-lg bg-gray-100 p-8 text-center text-xs text-gray-500">No featured events match your search.</div>
          )}
        </section>

        <section ref={(node) => { sectionRefs.current.experiences = node }} className="mt-7 scroll-mt-8 md:mt-11 md:scroll-mt-10">
          <SectionHeader title="Featured Experiences" actionTo="/experiences" />
          {visibleExperiences.length > 0 ? (
            <HorizontalRail>
              {visibleExperiences.map((event) => <CompactEventCard key={event.id} event={event} badge="Featured" />)}
            </HorizontalRail>
          ) : (
            <div className="rounded-lg bg-gray-100 p-8 text-center text-xs text-gray-500">No featured experiences match your search.</div>
          )}
        </section>

        <section ref={(node) => { sectionRefs.current.venues = node }} className="mt-7 scroll-mt-8 md:mt-11 md:scroll-mt-10">
          <SectionHeader title="Popular Venues" actionTo="/venues" />
          {visibleVenues.length > 0 ? (
            <HorizontalRail>
              {visibleVenues.map((venue) => <CompactVenueCard key={venue.id} venue={venue} />)}
            </HorizontalRail>
          ) : (
            <div className="rounded-lg bg-gray-100 p-8 text-center text-xs text-gray-500">No popular venues match your search.</div>
          )}
        </section>
      </main>
    </div>
  )
}

export default HomePage
