import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CalendarDays, ChevronLeft, ChevronRight, Heart, MapPin, Search, Sparkles, User } from 'lucide-react'
import { SttCategoryLinks, SttDesktopSearchBar, SttSearchOverlay } from '../components/SttDiscovery'
import { useEventCategoriesCatalog, useEventsCatalog, useHomepageCatalog, useVenueTypesCatalog, useVenuesCatalog } from '../features/catalog'
import sttLogo from '../shared/assets/sttmainlogo.svg'
import { getEventHref } from '../shared/lib/eventRoutes'

const brandLogoFilter = {
  filter: 'brightness(0) saturate(100%) invert(59%) sepia(19%) saturate(761%) hue-rotate(238deg) brightness(88%) contrast(87%)',
}

const uniqueById = (items) => {
  const seen = new Set()

  return items.filter((item) => {
    if (!item?.id) return false
    const key = String(item.id)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const uniqueText = (values, limit) => {
  const seen = new Set()
  const output = []

  values.forEach((value) => {
    const text = String(value || '').trim()
    const key = text.toLowerCase()
    if (!text || seen.has(key)) return
    seen.add(key)
    output.push(text)
  })

  return output.slice(0, limit)
}

const normalizeText = (value) => String(value || '').toLowerCase()

const matchesSearch = (item, searchTerm, keys) => {
  const needle = normalizeText(searchTerm).trim()
  if (!needle) return true
  return keys.some((key) => normalizeText(item?.[key]).includes(needle))
}

const eventMatchesTerms = (event, terms) => {
  const text = [
    event.title,
    event.category,
    event.venue,
    event.location,
    event.servicePeriod,
    ...(event.tags || []),
  ].join(' ').toLowerCase()

  return terms.some((term) => text.includes(term))
}

const scrollToSection = (element) => {
  if (!element) return
  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const formatEventDay = (event) => {
  if (event?.date) {
    const parsed = new Date(event.date)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', { weekday: 'short' })
    }
  }

  if (event?.servicePeriod === 'night') return 'Night'
  return 'Day'
}

const getVenueRoute = (venue) => `/venues/${venue?.id}`
const getEventAddress = (event) => event?.venueDetails?.address || event?.location || event?.venue || 'Dubai'

const getCategoryPillClassName = (label = '') => {
  const value = label.toLowerCase()
  if (value.includes('beach') || value.includes('pool')) return 'bg-brand-green text-white ring-transparent'
  if (value.includes('night') || value.includes('party')) return 'bg-brand-purple text-white ring-transparent'
  if (value.includes('dining') || value.includes('restaurant')) return 'bg-brand-yellow text-white ring-transparent'
  if (value.includes('brunch')) return 'bg-brand-purple text-white ring-transparent'
  if (value.includes('venue')) return 'bg-brand-green text-white ring-transparent'
  return 'bg-brand-purple text-white ring-transparent'
}

const dayPillClassName = 'bg-brand-green text-white ring-transparent'

function FeaturedAdSlider({ slides, loading, activeIndex, onPrevious, onNext, onSelect }) {
  if (slides.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[100vw] overflow-hidden px-5 md:max-w-6xl md:px-8">
        <section className="relative mt-5 flex h-[154px] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-100 text-sm font-semibold text-gray-500 ring-1 ring-black/[0.04] md:mt-9 md:h-[210px] md:rounded-2xl">
          {loading ? 'Loading featured events...' : 'No featured events are available yet.'}
        </section>
      </div>
    )
  }

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
            {slide.image ? (
              <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gray-800" />
            )}
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
          <button type="button" onClick={onPrevious} disabled={slides.length < 2} aria-label="Previous featured ad" className="flex h-6 w-6 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-40">
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
          <button type="button" onClick={onNext} disabled={slides.length < 2} aria-label="Next featured ad" className="flex h-6 w-6 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 disabled:opacity-40">
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
      <h2 className="text-[17px] font-semibold tracking-tight text-gray-950">{title}</h2>
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
  const hasPrice = event.price !== null && event.price !== undefined

  return (
    <Link to={getEventHref(event)} className="block w-[174px] shrink-0 snap-start md:w-full md:min-w-0">
      <article className="group">
        <div className="relative aspect-[1.48] overflow-hidden rounded-[14px] bg-gray-100 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition-shadow group-hover:shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
          {event.image ? (
            <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-semibold text-gray-400">No image</div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-semibold leading-none text-gray-950 shadow-sm">
            {badge}
          </span>
          <button type="button" aria-label="Save event" className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white shadow-sm backdrop-blur-md">
            <Heart className="h-4 w-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <div className="flex min-h-[84px] flex-col pt-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 pl-1 text-[13px] font-medium leading-tight text-gray-950">
              {event.title}
            </h3>
            <div className="shrink-0 text-right">
              {hasPrice ? (
                <>
                  <p className="text-[9px] font-semibold leading-none text-gray-950 md:text-[11px]">AED {event.price}</p>
                  <p className="text-[7px] uppercase leading-none text-gray-400 md:text-[8px]">from</p>
                </>
              ) : (
                <p className="max-w-[58px] text-[9px] font-semibold leading-tight text-gray-950 md:text-[11px]">On request</p>
              )}
            </div>
          </div>
          <div className="mt-1 space-y-0.5">
            <p className="flex items-center gap-1 truncate text-[11px] font-normal text-gray-500">
              <MapPin className="h-3 w-3 shrink-0 text-gray-400" strokeWidth={1.8} />
              <span className="truncate">{event.venue}</span>
            </p>
            <p className="truncate pl-1 text-[11px] font-normal text-gray-400">{getEventAddress(event)}</p>
          </div>
          <div className="mt-auto flex min-h-[20px] flex-wrap gap-1.5 pt-1.5">
            <span className={`rounded-full px-2 py-1 text-[9px] font-normal uppercase leading-none ring-1 ${getCategoryPillClassName(categoryLabel)}`}>{categoryLabel}</span>
            <span className={`rounded-full px-2 py-1 text-[9px] font-normal uppercase leading-none ring-1 ${dayPillClassName}`}>{dayLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function CompactVenueCard({ venue }) {
  const categoryLabel = venue.category || venue.type || 'Venue'

  return (
    <Link to={getVenueRoute(venue)} className="block w-[142px] shrink-0 snap-start md:w-full md:min-w-0">
      <article className="group">
        <div className="relative aspect-[1.22] overflow-hidden rounded-lg bg-gray-100 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition-shadow group-hover:shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
          {venue.image ? (
            <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-semibold text-gray-400">No image</div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-semibold leading-none text-gray-950 shadow-sm">Featured</span>
          <button type="button" aria-label="Save venue" className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white shadow-sm backdrop-blur-md">
            <Heart className="h-4 w-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <div className="flex min-h-[70px] flex-col pt-1.5">
          <h3 className="line-clamp-2 pl-1 text-[13px] font-medium leading-tight text-gray-950">{venue.name}</h3>
          <div className="mt-1 flex min-h-[18px] items-center gap-1 truncate text-[11px] font-normal text-gray-500">
            <MapPin className="h-3 w-3 shrink-0 text-gray-400" strokeWidth={1.8} />
            <span className="truncate">{venue.location || venue.address}</span>
          </div>
          <div className="mt-auto flex pt-1.5">
            <span className={`w-fit rounded-full px-2 py-1 text-[9px] font-normal uppercase leading-none ring-1 ${getCategoryPillClassName(categoryLabel)}`}>{categoryLabel}</span>
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

const getHomepagePlacementEvents = (placements = []) => placements
  .flatMap((placement) => (placement.events || []).map((entry) => entry.event).filter(Boolean))

const buildSlides = (events) => {
  const prioritized = [...events.filter((event) => event.image), ...events.filter((event) => !event.image)]

  return prioritized.slice(0, 3).map((event, index) => ({
    id: `featured-${event.id}`,
    label: event.placementLabel || event.category || (index === 0 ? 'Featured' : 'Recommended'),
    title: event.title,
    venue: event.venue || event.location || 'Dubai',
    description: event.description || event.venueDetails?.description || event.category || 'Curated by Set The Table.',
    price: event.price !== null && event.price !== undefined ? `From AED ${event.price}` : 'View details',
    to: getEventHref(event),
    image: event.image,
  }))
}

const buildCategoryTiles = (eventCategories = [], venueTypes = [], events = []) => {
  const eventTiles = eventCategories
    .map((category) => category.displayName || category.name || category.slug)
    .filter(Boolean)
    .slice(0, 3)
    .map((label) => ({ label, tab: 'events', icon: CalendarDays }))
  const venueTiles = venueTypes
    .map((type) => type.name || type.displayName || type.slug)
    .filter(Boolean)
    .slice(0, 2)
    .map((label) => ({ label, tab: 'venues', icon: MapPin }))

  if (eventTiles.length || venueTiles.length) {
    return [...eventTiles, ...venueTiles].slice(0, 4)
  }

  return uniqueText(events.map((event) => event.category), 4)
    .map((label) => ({ label, tab: 'events', icon: Sparkles }))
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

  const { data: placements = [], loading: homepageLoading, error: homepageError, retry: retryHomepage } = useHomepageCatalog()
  const { data: events = [], loading: eventsLoading, error: eventsError, retry: retryEvents } = useEventsCatalog('')
  const { data: venues = [], loading: venuesLoading, error: venuesError, retry: retryVenues } = useVenuesCatalog('', [])
  const { data: eventCategories = [] } = useEventCategoriesCatalog()
  const { data: venueTypesResponse = [] } = useVenueTypesCatalog()

  const venueTypes = useMemo(() => Array.isArray(venueTypesResponse) ? venueTypesResponse : [], [venueTypesResponse])
  const placementEvents = useMemo(() => uniqueById(getHomepagePlacementEvents(placements)), [placements])
  const allEvents = useMemo(() => uniqueById([...placementEvents, ...events]), [events, placementEvents])
  const featuredEventItems = useMemo(() => uniqueById([...placementEvents, ...allEvents]).slice(0, 10), [allEvents, placementEvents])
  const featuredExperienceItems = useMemo(() => {
    const matches = allEvents.filter((event) => eventMatchesTerms(event, ['experience', 'brunch', 'pool', 'night', 'party', 'dining']))
    return uniqueById(matches.length ? matches : allEvents).slice(0, 10)
  }, [allEvents])
  const popularVenueItems = useMemo(() => venues.slice(0, 10), [venues])
  const bannerSlides = useMemo(() => buildSlides(featuredEventItems), [featuredEventItems])
  const isLoading = homepageLoading || eventsLoading || venuesLoading
  const contentError = homepageError || eventsError || venuesError

  const recentSearches = useMemo(() => uniqueText([
    ...allEvents.map((event) => event.title),
    ...venues.map((venue) => venue.name),
  ], 3), [allEvents, venues])
  const suggestedLocations = useMemo(() => uniqueText([
    ...venues.map((venue) => venue.area || venue.location || venue.address),
    ...allEvents.map((event) => event.venueDetails?.area || event.location || event.venue),
  ], 4), [allEvents, venues])
  const searchCategoryTiles = useMemo(() => buildCategoryTiles(eventCategories, venueTypes, allEvents), [allEvents, eventCategories, venueTypes])

  useEffect(() => {
    if (bannerSlides.length < 2) return undefined

    const interval = window.setInterval(() => {
      setActiveBannerSlide((current) => (current + 1) % bannerSlides.length)
    }, 5500)

    return () => window.clearInterval(interval)
  }, [bannerSlides.length])

  useEffect(() => {
    if (activeBannerSlide >= bannerSlides.length) setActiveBannerSlide(0)
  }, [activeBannerSlide, bannerSlides.length])

  useEffect(() => {
    if (new URLSearchParams(routeLocation.search).get('search') === 'open') {
      setSearchOpen(true)
    }
  }, [routeLocation.search])

  const visibleEvents = useMemo(
    () => featuredEventItems.filter((event) => matchesSearch(event, activeSearchTerm, ['title', 'venue', 'location', 'category', 'servicePeriod'])),
    [activeSearchTerm, featuredEventItems],
  )

  const visibleExperiences = useMemo(
    () => featuredExperienceItems.filter((event) => matchesSearch(event, activeSearchTerm, ['title', 'venue', 'location', 'category', 'servicePeriod'])),
    [activeSearchTerm, featuredExperienceItems],
  )

  const visibleVenues = useMemo(
    () => popularVenueItems.filter((venue) => matchesSearch(venue, activeSearchTerm, ['name', 'location', 'category', 'type', 'address', 'area'])),
    [activeSearchTerm, popularVenueItems],
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

  const retryContent = () => {
    retryHomepage()
    retryEvents()
    retryVenues()
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-white pb-20 text-gray-950 md:pb-0">
      <SttSearchOverlay
        open={searchOpen}
        mode="home"
        initialKeyword={searchTerm}
        recentSearches={recentSearches}
        suggestedLocations={suggestedLocations}
        categoryTiles={searchCategoryTiles}
        onClose={closeSearch}
        onApplySearch={handleApplySearch}
      />

      <section className="mx-auto w-full max-w-[100vw] overflow-x-hidden px-5 pt-5 md:max-w-none md:overflow-visible md:bg-[#f8f8f8]/95 md:px-8 md:py-5 md:shadow-[0_4px_22px_rgba(52,52,52,0.10)]">
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
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10">
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

          <SttDesktopSearchBar
            mode="home"
            searchTerm={activeSearchTerm}
            recentSearches={recentSearches}
            suggestedLocations={suggestedLocations}
            categoryTiles={searchCategoryTiles}
            onApplySearch={handleApplySearch}
          />
        </div>
      </section>

      <FeaturedAdSlider
        slides={bannerSlides}
        loading={isLoading}
        activeIndex={Math.min(activeBannerSlide, Math.max(0, bannerSlides.length - 1))}
        onPrevious={() => bannerSlides.length > 0 && setActiveBannerSlide((current) => (current - 1 + bannerSlides.length) % bannerSlides.length)}
        onNext={() => bannerSlides.length > 0 && setActiveBannerSlide((current) => (current + 1) % bannerSlides.length)}
        onSelect={setActiveBannerSlide}
      />

      <main className="mx-auto mt-6 w-full max-w-[100vw] px-5 md:mt-9 md:max-w-6xl md:px-8">
        {contentError && !isLoading && featuredEventItems.length === 0 && popularVenueItems.length === 0 && (
          <div className="mb-6 rounded-[18px] bg-gray-50 p-8 text-center ring-1 ring-black/[0.04]">
            <h2 className="text-xl font-extrabold text-gray-950">Couldn't load the live catalog</h2>
            <p className="mt-2 text-sm text-gray-500">{contentError.message}</p>
            <button type="button" onClick={retryContent} className="mt-5 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Try again</button>
          </div>
        )}

        <section ref={(node) => { sectionRefs.current.events = node }} className="scroll-mt-8 md:scroll-mt-10">
          <SectionHeader title="Featured Events" actionTo="/events" />
          {visibleEvents.length > 0 ? (
            <HorizontalRail>
              {visibleEvents.map((event) => <CompactEventCard key={event.id} event={event} />)}
            </HorizontalRail>
          ) : (
            <div className="rounded-lg bg-gray-100 p-8 text-center text-xs text-gray-500">{isLoading ? 'Loading featured events...' : 'No featured events match your search.'}</div>
          )}
        </section>

        <section ref={(node) => { sectionRefs.current.experiences = node }} className="mt-7 scroll-mt-8 md:mt-11 md:scroll-mt-10">
          <SectionHeader title="Featured Experiences" actionTo="/experiences" />
          {visibleExperiences.length > 0 ? (
            <HorizontalRail>
              {visibleExperiences.map((event) => <CompactEventCard key={event.id} event={event} badge="Featured" />)}
            </HorizontalRail>
          ) : (
            <div className="rounded-lg bg-gray-100 p-8 text-center text-xs text-gray-500">{isLoading ? 'Loading featured experiences...' : 'No featured experiences match your search.'}</div>
          )}
        </section>

        <section ref={(node) => { sectionRefs.current.venues = node }} className="mt-7 scroll-mt-8 md:mt-11 md:scroll-mt-10">
          <SectionHeader title="Popular Venues" actionTo="/venues" />
          {visibleVenues.length > 0 ? (
            <HorizontalRail>
              {visibleVenues.map((venue) => <CompactVenueCard key={venue.id} venue={venue} />)}
            </HorizontalRail>
          ) : (
            <div className="rounded-lg bg-gray-100 p-8 text-center text-xs text-gray-500">{isLoading ? 'Loading venues...' : 'No popular venues match your search.'}</div>
          )}
        </section>
      </main>
    </div>
  )
}

export default HomePage
