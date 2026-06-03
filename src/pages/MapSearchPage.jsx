import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ChevronDown, Heart, LocateFixed, MapPin, Minus, Plus, Search, Settings2, SlidersHorizontal, Sparkles, Star, X } from 'lucide-react'
import { useEventsCatalog, useVenuesCatalog } from '../features/catalog'

const categoryConfig = {
  venues: {
    label: 'Venues',
    icon: MapPin,
    accent: '#16A085',
    chip: 'border-emerald-500 text-emerald-700 bg-emerald-50',
    marker: 'bg-emerald-600',
    count: '1.3K+ venues in map area',
  },
  events: {
    label: 'Events',
    icon: CalendarDays,
    accent: '#AB83BB',
    chip: 'border-brand-purple text-brand-purple bg-brand-purple/10',
    marker: 'bg-brand-purple',
    count: '420+ events in map area',
  },
  experiences: {
    label: 'Experiences',
    icon: Sparkles,
    accent: '#4F7DD9',
    chip: 'border-blue-500 text-blue-700 bg-blue-50',
    marker: 'bg-blue-600',
    count: '260+ experiences in map area',
  },
}

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID
const DUBAI_MAP_CENTER = { lat: 25.2048, lng: 55.2708 }
const DEFAULT_MAP_ZOOM = 11

let googleMapsLoaderPromise = null

const sortOptions = [
  { id: 'best', label: 'Best match', icon: Heart },
  { id: 'nearest', label: 'Nearest', icon: MapPin },
  { id: 'top', label: 'Top rated', icon: Star },
]

const experienceTerms = ['experience', 'brunch', 'pool', 'night', 'party', 'dining']

function loadGoogleMaps() {
  if (!GOOGLE_MAPS_API_KEY) return Promise.reject(new Error('Missing VITE_GOOGLE_MAPS_API_KEY.'))
  if (typeof window === 'undefined') return Promise.reject(new Error('Google Maps can only load in the browser.'))
  if (window.google?.maps) return Promise.resolve(window.google.maps)
  if (googleMapsLoaderPromise) return googleMapsLoaderPromise

  googleMapsLoaderPromise = new Promise((resolve, reject) => {
    const callbackName = '__sttGoogleMapsReady'
    const existingScript = document.querySelector('script[data-stt-google-maps="true"]')

    window[callbackName] = () => {
      if (window.google?.maps) resolve(window.google.maps)
      else reject(new Error('Google Maps loaded without the maps namespace.'))
    }

    if (existingScript) {
      existingScript.addEventListener('load', () => window[callbackName](), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Google Maps.')), { once: true })
      return
    }

    const params = new URLSearchParams({
      key: GOOGLE_MAPS_API_KEY,
      v: 'weekly',
      libraries: 'places,marker',
      callback: callbackName,
    })

    if (GOOGLE_MAPS_MAP_ID) params.set('map_ids', GOOGLE_MAPS_MAP_ID)

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`
    script.async = true
    script.defer = true
    script.dataset.sttGoogleMaps = 'true'
    script.onerror = () => reject(new Error('Unable to load Google Maps.'))
    document.head.appendChild(script)
  })

  return googleMapsLoaderPromise
}

function normalizeCoordinates(coordinates) {
  if (!coordinates) return null

  const lat = Number(coordinates.lat ?? coordinates.latitude)
  const lng = Number(coordinates.lng ?? coordinates.longitude)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  return { lat, lng }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getDistanceKm(from, to) {
  if (!from || !to) return null

  const earthRadiusKm = 6371
  const degreesToRadians = (value) => value * (Math.PI / 180)
  const deltaLat = degreesToRadians(to.lat - from.lat)
  const deltaLng = degreesToRadians(to.lng - from.lng)
  const lat1 = degreesToRadians(from.lat)
  const lat2 = degreesToRadians(to.lat)
  const haversine = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2

  return Number((earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))).toFixed(1))
}

function eventMatchesTerms(event, terms) {
  const text = [
    event.title,
    event.category,
    event.venue,
    event.location,
    event.servicePeriod,
    event.environmentType,
    ...(event.tags || []),
  ].join(' ').toLowerCase()

  return terms.some((term) => text.includes(term))
}

function formatPrice(value, fallback = 'On request') {
  if (value === null || value === undefined || value === '') return fallback
  return typeof value === 'number' ? `AED ${value}` : String(value)
}

function getPriceValue(item) {
  return typeof item.priceValue === 'number' && Number.isFinite(item.priceValue) ? item.priceValue : null
}

function sortItems(items, sortBy) {
  const sorted = [...items]

  if (sortBy === 'top') {
    return sorted.sort((left, right) => Number(right.rating || 0) - Number(left.rating || 0))
  }

  if (sortBy === 'price') {
    return sorted.sort((left, right) => (getPriceValue(left) ?? Number.POSITIVE_INFINITY) - (getPriceValue(right) ?? Number.POSITIVE_INFINITY))
  }

  return sorted.sort((left, right) => (left.distanceKm ?? Number.POSITIVE_INFINITY) - (right.distanceKm ?? Number.POSITIVE_INFINITY))
}

function getItems(activeCategory, events = [], venues = []) {
  if (activeCategory === 'venues') {
    return venues.slice(0, 100).map((venue) => {
      const coordinates = normalizeCoordinates(venue.coordinates)
      const location = venue.location || venue.address || venue.area || 'Dubai'

      return {
        id: `venue-${venue.id}`,
        rawId: venue.id,
        type: 'venue',
        title: venue.name,
        image: venue.image,
        rating: venue.rating || 4.8,
        price: venue.priceRange || 'View details',
        priceValue: null,
        distanceKm: getDistanceKm(DUBAI_MAP_CENTER, coordinates),
        coordinates,
        category: venue.category || venue.type || 'Venue',
        location,
        meta: `${location} - ${venue.category || venue.type || 'Venue'}`,
        submeta: venue.address || venue.description || 'Curated venue',
        searchAddress: `${venue.name || ''} ${venue.address || venue.location || venue.area || ''} Dubai UAE`,
        to: `/venues/${venue.id}`,
      }
    })
  }

  const experienceEvents = events.filter((event) => eventMatchesTerms(event, experienceTerms))
  const source = activeCategory === 'experiences' ? (experienceEvents.length ? experienceEvents : events) : events

  return source.slice(0, 100).map((event) => {
    const coordinates = normalizeCoordinates(event.coordinates)
    const location = event.location || event.venue || event.venueDetails?.address || 'Dubai'

    return {
      id: `${activeCategory}-${event.id}`,
      rawId: event.id,
      type: activeCategory === 'experiences' ? 'experience' : 'event',
      title: event.title,
      image: event.image,
      rating: event.rating || 4.8,
      price: formatPrice(event.price),
      priceValue: typeof event.price === 'number' ? event.price : null,
      distanceKm: getDistanceKm(DUBAI_MAP_CENTER, coordinates),
      coordinates,
      category: event.category || (activeCategory === 'experiences' ? 'Experience' : 'Event'),
      location,
      meta: `${event.venue || location} - ${event.category || 'Experience'}`,
      submeta: `${event.date || 'Upcoming'}${event.time ? ` - ${event.time}` : ''}`,
      searchAddress: `${event.venue || event.title || ''} ${event.location || event.venueDetails?.address || ''} Dubai UAE`,
      to: `/events/${event.id}`,
    }
  })
}

function itemMatchesSearch(item, query) {
  const search = query.trim().toLowerCase()
  if (!search) return true

  return [item.title, item.meta, item.submeta, item.category, item.location, item.price]
    .join(' ')
    .toLowerCase()
    .includes(search)
}

function MapBackdrop({ activeCategory, items, selectedItemId, onSelectItem }) {
  const config = categoryConfig[activeCategory]
  const mapNodeRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const infoWindowRef = useRef(null)
  const geocoderRef = useRef(null)
  const geocodeCacheRef = useRef(new Map())
  const [mapStatus, setMapStatus] = useState(GOOGLE_MAPS_API_KEY ? 'loading' : 'missing-key')

  useEffect(() => {
    let cancelled = false

    loadGoogleMaps()
      .then((maps) => {
        if (cancelled || !mapNodeRef.current) return

        const map = new maps.Map(mapNodeRef.current, {
          center: DUBAI_MAP_CENTER,
          zoom: DEFAULT_MAP_ZOOM,
          mapId: GOOGLE_MAPS_MAP_ID || undefined,
          disableDefaultUI: true,
          clickableIcons: false,
          gestureHandling: 'greedy',
          keyboardShortcuts: true,
        })

        mapRef.current = map
        geocoderRef.current = new maps.Geocoder()
        infoWindowRef.current = new maps.InfoWindow({ disableAutoPan: false })
        setMapStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setMapStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (mapStatus !== 'ready' || !window.google?.maps || !mapRef.current) return undefined

    let cancelled = false
    const maps = window.google.maps
    const map = mapRef.current

    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
    infoWindowRef.current?.close()

    const resolveCoordinates = async (item) => {
      if (item.coordinates) return item.coordinates
      if (!item.searchAddress) return null
      if (geocodeCacheRef.current.has(item.id)) return geocodeCacheRef.current.get(item.id)

      const geocoder = geocoderRef.current
      if (!geocoder) return null

      const coordinates = await new Promise((resolve) => {
        geocoder.geocode({ address: item.searchAddress, region: 'ae' }, (results, status) => {
          if (status !== 'OK' || !results?.[0]?.geometry?.location) {
            resolve(null)
            return
          }

          const location = results[0].geometry.location
          resolve({ lat: location.lat(), lng: location.lng() })
        })
      })

      geocodeCacheRef.current.set(item.id, coordinates)
      return coordinates
    }

    const drawMarkers = async () => {
      const resolvedItems = await Promise.all(items.map(async (item) => ({
        item,
        coordinates: await resolveCoordinates(item),
      })))

      if (cancelled) return

      const bounds = new maps.LatLngBounds()
      let hasBounds = false

      resolvedItems.forEach(({ item, coordinates }, index) => {
        if (!coordinates) return

        const selected = selectedItemId === item.id
        const marker = new maps.Marker({
          map,
          position: coordinates,
          title: item.title,
          label: {
            text: item.rating ? Number(item.rating).toFixed(1) : String(index + 1),
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: '800',
          },
          icon: {
            path: maps.SymbolPath.CIRCLE,
            fillColor: config.accent,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: selected ? 4 : 2,
            scale: selected ? 17 : 14,
          },
          zIndex: selected ? 20 : 10,
        })

        marker.addListener('click', () => {
          onSelectItem(item.id)
          infoWindowRef.current?.setContent(`<div style="max-width:180px"><strong>${escapeHtml(item.title)}</strong><br/><span>${escapeHtml(item.price)}</span></div>`)
          infoWindowRef.current?.open({ anchor: marker, map })
        })

        if (selected) {
          infoWindowRef.current?.setContent(`<div style="max-width:180px"><strong>${escapeHtml(item.title)}</strong><br/><span>${escapeHtml(item.price)}</span></div>`)
          infoWindowRef.current?.open({ anchor: marker, map })
          map.panTo(coordinates)
        }

        bounds.extend(coordinates)
        hasBounds = true
        markersRef.current.push(marker)
      })

      if (hasBounds && !selectedItemId) {
        map.fitBounds(bounds, 72)
      } else if (!hasBounds) {
        map.setCenter(DUBAI_MAP_CENTER)
        map.setZoom(DEFAULT_MAP_ZOOM)
      }
    }

    drawMarkers()

    return () => {
      cancelled = true
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []
    }
  }, [activeCategory, config.accent, items, mapStatus, onSelectItem, selectedItemId])

  const handleRecenter = () => {
    const map = mapRef.current
    if (!map) return

    if (markersRef.current.length > 0 && window.google?.maps) {
      const bounds = new window.google.maps.LatLngBounds()
      markersRef.current.forEach((marker) => {
        const position = marker.getPosition()
        if (position) bounds.extend(position)
      })
      map.fitBounds(bounds, 72)
      return
    }

    map.setCenter(DUBAI_MAP_CENTER)
    map.setZoom(DEFAULT_MAP_ZOOM)
  }

  const changeZoom = (delta) => {
    const map = mapRef.current
    if (!map) return
    map.setZoom(Math.max(4, Math.min(19, (map.getZoom() || DEFAULT_MAP_ZOOM) + delta)))
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-100">
      <div ref={mapNodeRef} className="absolute inset-0" aria-label={`${config.label} map`} />

      {mapStatus !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 px-8 text-center">
          <div>
            <MapPin className="mx-auto h-8 w-8 text-brand-purple" strokeWidth={1.8} />
            <p className="mt-3 text-sm font-extrabold text-gray-950">
              {mapStatus === 'missing-key' ? 'Google Maps key is missing' : mapStatus === 'error' ? 'Unable to load Google Maps' : 'Loading Google Maps...'}
            </p>
            <p className="mt-1 text-xs font-medium leading-5 text-gray-500">
              {mapStatus === 'missing-key' ? 'Set VITE_GOOGLE_MAPS_API_KEY in the environment.' : 'Live catalog results are still available below.'}
            </p>
          </div>
        </div>
      )}

      <div className="absolute bottom-20 right-4 z-10 flex flex-col overflow-hidden rounded-full bg-white shadow-[0_3px_14px_rgba(15,23,42,0.14)]">
        <button type="button" onClick={() => changeZoom(1)} aria-label="Zoom in" className="flex h-9 w-9 items-center justify-center text-gray-800">
          <Plus className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <span className="mx-auto h-px w-5 bg-gray-200" />
        <button type="button" onClick={() => changeZoom(-1)} aria-label="Zoom out" className="flex h-9 w-9 items-center justify-center text-gray-800">
          <Minus className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
      <button type="button" onClick={handleRecenter} aria-label="Recenter map" className="absolute bottom-20 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 shadow-[0_3px_14px_rgba(15,23,42,0.14)]">
        <LocateFixed className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  )
}

function FilterSheet({ open, activeCategory, filters, onFiltersChange, onClear, onClose }) {
  if (!open) return null

  const config = categoryConfig[activeCategory]
  const sortBy = filters.sortBy
  const maxPrice = filters.maxPrice

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/20 md:items-center">
      <button type="button" aria-label="Close filters" className="absolute inset-0" onClick={onClose} />
      <section className="relative max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[24px] bg-white px-6 pb-6 pt-5 shadow-[0_-18px_46px_rgba(15,23,42,0.18)] md:rounded-lg">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-950">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-950">
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        <div className="mb-7 rounded-lg bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-600 ring-1 ring-black/[0.04]">
          Showing {config.label.toLowerCase()} in the current map area.
        </div>

        <section>
          <h3 className="mb-3 text-sm font-extrabold text-gray-950">Sort by</h3>
          <div className="grid grid-cols-3 gap-3">
            {sortOptions.map((option) => {
              const Icon = option.icon
              const selected = sortBy === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onFiltersChange({ sortBy: option.id })}
                  className={`flex h-24 flex-col items-center justify-center gap-2 rounded-[14px] border text-center text-sm font-extrabold shadow-sm ${selected ? 'border-brand-purple bg-brand-purple/10 text-brand-purple ring-1 ring-brand-purple' : 'border-gray-200 bg-white text-gray-950'}`}
                >
                  <Icon className="h-6 w-6" strokeWidth={selected ? 2.2 : 1.8} />
                  {option.label}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-7 border-t border-gray-100 pt-6">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-gray-950">Max price</h3>
            <span className="text-sm font-bold text-gray-700">{maxPrice >= 6000 ? 'Any price' : `AED ${maxPrice.toLocaleString()}`}</span>
          </div>
          <input
            type="range"
            min="250"
            max="6000"
            step="25"
            value={maxPrice}
            onChange={(event) => onFiltersChange({ maxPrice: Number(event.target.value) })}
            className="h-1.5 w-full cursor-pointer accent-brand-purple"
            style={{ accentColor: config.accent }}
          />
        </section>

        <div className="sticky bottom-0 -mx-6 mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 bg-white px-6 pt-4">
          <button type="button" onClick={onClear} className="h-12 rounded-full border border-gray-200 text-sm font-extrabold text-gray-950">Clear all</button>
          <button type="button" onClick={onClose} className="h-12 rounded-full bg-gray-950 text-sm font-extrabold text-white">Apply</button>
        </div>
      </section>
    </div>
  )
}

const MapSearchPage = () => {
  const [activeCategory, setActiveCategory] = useState('venues')
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [sortBy, setSortBy] = useState('nearest')
  const [maxPrice, setMaxPrice] = useState(6000)
  const { data: events = [], loading: eventsLoading, error: eventsError, retry: retryEvents } = useEventsCatalog('')
  const { data: venues = [], loading: venuesLoading, error: venuesError, retry: retryVenues } = useVenuesCatalog('', [])
  const dataLoading = activeCategory === 'venues' ? venuesLoading : eventsLoading
  const dataError = activeCategory === 'venues' ? venuesError : eventsError
  const retryData = activeCategory === 'venues' ? retryVenues : retryEvents
  const allItems = useMemo(() => getItems(activeCategory, events, venues), [activeCategory, events, venues])
  const items = useMemo(() => {
    const searched = allItems
      .filter((item) => itemMatchesSearch(item, searchQuery))
      .filter((item) => {
        const priceValue = getPriceValue(item)
        return maxPrice >= 6000 || priceValue === null || priceValue <= maxPrice
      })

    return sortItems(searched, sortBy)
  }, [allItems, maxPrice, searchQuery, sortBy])
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedItemId) || items[0] || null, [items, selectedItemId])
  const config = categoryConfig[activeCategory]

  useEffect(() => {
    setSelectedItemId('')
  }, [activeCategory])

  useEffect(() => {
    if (items.length === 0 && selectedItemId) {
      setSelectedItemId('')
      return
    }

    if (items.length > 0 && !items.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(items[0].id)
    }
  }, [items, selectedItemId])

  const handleCategorySelect = (id) => {
    setActiveCategory(id)
    setSearchQuery('')
  }

  const handleFiltersChange = (updates) => {
    if (updates.sortBy) setSortBy(updates.sortBy)
    if (updates.maxPrice !== undefined) setMaxPrice(updates.maxPrice)
  }

  const clearFilters = () => {
    setSortBy('nearest')
    setMaxPrice(6000)
    setSearchQuery('')
  }

  return (
    <div className="min-h-[100dvh] bg-gray-100 pb-20 text-gray-950 md:flex md:justify-center md:py-8">
      <main className="relative min-h-[100dvh] w-full overflow-x-hidden bg-white md:min-h-[850px] md:max-w-[430px] md:overflow-hidden md:rounded-[30px] md:shadow-2xl">
        <section className="relative h-[44dvh] min-h-[360px] max-h-[470px] overflow-hidden">
          <MapBackdrop
            activeCategory={activeCategory}
            items={items}
            selectedItemId={selectedItem?.id}
            onSelectItem={setSelectedItemId}
          />
          <form
            className="absolute inset-x-5 top-5 z-10 flex h-14 items-center gap-3 rounded-full bg-white px-4 shadow-[0_5px_18px_rgba(15,23,42,0.16)]"
            onSubmit={(event) => {
              event.preventDefault()
              event.currentTarget.querySelector('input')?.blur()
            }}
          >
            <Search className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
            <label className="min-w-0 flex-1">
              <span className="sr-only">Search map</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search ${config.label.toLowerCase()}`}
                className="w-full bg-transparent text-sm font-extrabold text-gray-950 outline-none placeholder:text-gray-950"
              />
              <span className="block truncate text-xs font-medium text-gray-500">Map area</span>
            </label>
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
            <button type="button" onClick={() => setFilterOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-800" aria-label="Open filters">
              <SlidersHorizontal className="h-5 w-5" strokeWidth={1.9} />
            </button>
          </form>
        </section>

        <section className="relative z-10 -mt-16 rounded-t-[28px] bg-white pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-gray-300" />
          <div className="relative px-5 pb-2">
            <div className="no-scrollbar mr-14 flex gap-2 overflow-x-auto pr-2">
              {Object.entries(categoryConfig).map(([id, item]) => {
                const Icon = item.icon
                const selected = activeCategory === id

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleCategorySelect(id)}
                    className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-extrabold shadow-sm ${selected ? item.chip : 'border-gray-200 bg-white text-gray-800'}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={2} />
                    {item.label}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setSortBy('nearest')}
                className={`inline-flex h-10 shrink-0 items-center gap-1 rounded-full border px-4 text-sm font-extrabold shadow-sm ${sortBy === 'nearest' ? config.chip : 'border-gray-200 bg-white text-gray-800'}`}
              >
                Nearest
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setSortBy('price')}
                className={`inline-flex h-10 shrink-0 items-center gap-1 rounded-full border px-4 text-sm font-extrabold shadow-sm ${sortBy === 'price' ? config.chip : 'border-gray-200 bg-white text-gray-800'}`}
              >
                Price
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => setSortBy('top')}
                className={`inline-flex h-10 shrink-0 items-center gap-1 rounded-full border px-4 text-sm font-extrabold shadow-sm ${sortBy === 'top' ? config.chip : 'border-gray-200 bg-white text-gray-800'}`}
              >
                Top rated
              </button>
            </div>
            <button type="button" onClick={() => setFilterOpen(true)} aria-label="Advanced filters" className="absolute right-5 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-brand-purple bg-white text-brand-purple shadow-[0_2px_10px_rgba(15,23,42,0.12)]">
              <Settings2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <p className="px-5 pt-1 text-center text-xs font-semibold text-gray-400">
            {dataLoading
              ? `Loading ${config.label.toLowerCase()}...`
              : dataError
                ? `Couldn't load ${config.label.toLowerCase()}`
                : items.length > 0
                  ? `${items.length} ${config.label.toLowerCase()} in map area`
                  : `No ${config.label.toLowerCase()} match this search`}
          </p>

          <div className="mt-4 space-y-4 px-5">
            {dataLoading && (
              <div className="rounded-[18px] bg-gray-50 p-8 text-center text-sm font-bold text-gray-500">
                Loading live {config.label.toLowerCase()}...
              </div>
            )}
            {!dataLoading && dataError && (
              <div className="rounded-[18px] bg-gray-50 p-8 text-center">
                <h2 className="text-sm font-extrabold text-gray-950">Couldn't load {config.label.toLowerCase()}</h2>
                <p className="mt-2 text-xs font-medium text-gray-500">{dataError.message}</p>
                <button type="button" onClick={retryData} className="mt-4 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Try again</button>
              </div>
            )}
            {!dataLoading && !dataError && items.length === 0 && (
              <div className="rounded-[18px] bg-gray-50 p-8 text-center text-sm font-bold text-gray-500">
                Try another keyword or switch to a different category.
              </div>
            )}
            {!dataLoading && !dataError && items.map((item) => {
              const selected = selectedItem?.id === item.id

              return (
                <article key={item.id} className={`overflow-hidden rounded-[18px] bg-white shadow-[0_3px_18px_rgba(15,23,42,0.10)] ring-1 transition-all ${selected ? 'ring-2 ring-brand-purple' : 'ring-black/[0.04]'}`}>
                  <button type="button" onClick={() => setSelectedItemId(item.id)} className="block w-full text-left">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                    ) : (
                      <div className="flex h-44 w-full items-center justify-center bg-gray-100 text-[11px] font-semibold text-gray-400">No image</div>
                    )}
                  </button>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-3">
                      <button type="button" onClick={() => setSelectedItemId(item.id)} className="min-w-0 text-left">
                        <h2 className="line-clamp-1 text-sm font-extrabold text-gray-950">{item.title}</h2>
                      </button>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-gray-800">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" strokeWidth={1.8} />
                        {item.rating}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs font-medium text-gray-500">{item.distanceKm !== null ? `${item.distanceKm.toFixed(1)} km` : 'Map area'} - {item.meta}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{item.submeta}</p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-extrabold text-gray-700">{item.category}</span>
                      <Link to={item.to} className="rounded-full bg-gray-950 px-3 py-1.5 text-[11px] font-extrabold text-white">
                        View
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <FilterSheet
        open={filterOpen}
        activeCategory={activeCategory}
        filters={{ sortBy, maxPrice }}
        onFiltersChange={handleFiltersChange}
        onClear={clearFilters}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  )
}

export default MapSearchPage
