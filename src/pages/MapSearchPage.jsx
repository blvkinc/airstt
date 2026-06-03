import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Check, ChevronDown, Heart, LocateFixed, MapPin, Minus, Plus, Search, Settings2, SlidersHorizontal, Sparkles, Star, User, Users, X } from 'lucide-react'
import { eventCatalog, trendingEvents, venueCatalog } from '../features/experiences/data'

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

const locationPins = {
  'Dubai Harbour': { top: 33, left: 43 },
  'Palm Jumeirah': { top: 45, left: 25 },
  'Downtown Dubai': { top: 40, left: 59 },
  DIFC: { top: 52, left: 55 },
  Jumeirah: { top: 60, left: 38 },
  'Business Bay': { top: 50, left: 67 },
  'Burj Al Arab': { top: 58, left: 23 },
  'Dubai Marina': { top: 30, left: 31 },
  'Desert Conservation Reserve': { top: 66, left: 71 },
}

const pinOffsets = [
  { x: 0, y: 0 },
  { x: 4, y: -5 },
  { x: -5, y: 4 },
  { x: 6, y: 5 },
  { x: -3, y: -7 },
  { x: 8, y: -1 },
]

const amenities = [
  { label: 'Pet-friendly', icon: User },
  { label: 'Adults only', icon: Users },
  { label: 'Kid-friendly', icon: Sparkles },
  { label: 'Wheelchair accessible', icon: Check },
  { label: 'Men only', icon: Users },
  { label: 'Women only', icon: Users },
  { label: 'Parking available', icon: MapPin },
  { label: 'Near public transport', icon: MapPin },
]

const sortOptions = [
  { id: 'best', label: 'Best match', icon: Heart },
  { id: 'nearest', label: 'Nearest', icon: MapPin },
  { id: 'top', label: 'Top rated', icon: Star },
]

function getItems(activeCategory) {
  if (activeCategory === 'venues') {
    return venueCatalog.slice(0, 10).map((venue, index) => ({
      id: `venue-${venue.id}`,
      rawId: venue.id,
      type: 'venue',
      title: venue.name,
      image: venue.image,
      rating: venue.rating || 4.8,
      price: venue.priceRange || 'AED 250+',
      category: venue.category || 'Venue',
      location: venue.location || venue.address || 'Dubai',
      meta: `${venue.location || venue.address || 'Dubai'} - ${venue.category || 'Venue'}`,
      submeta: venue.address || venue.description || 'Curated venue',
      to: `/venues/${venue.id}`,
      pin: getPinForLocation(venue.location || venue.address, index),
    }))
  }

  const source = activeCategory === 'experiences' ? trendingEvents.filter(Boolean) : eventCatalog

  return source.slice(0, 10).map((event, index) => ({
    id: `${activeCategory}-${event.id}`,
    rawId: event.id,
    type: activeCategory === 'experiences' ? 'experience' : 'event',
    title: event.title,
    image: event.image,
    rating: event.rating || 4.8,
    price: `AED ${event.price}`,
    category: event.category || (activeCategory === 'experiences' ? 'Experience' : 'Event'),
    location: event.location || event.venue || 'Dubai',
    meta: `${event.venue || 'Dubai'} - ${event.category || 'Experience'}`,
    submeta: `${event.dateLabel || 'Upcoming'}${event.time ? ` - ${event.time}` : ''}`,
    to: `/events/${event.id}`,
    pin: getPinForLocation(event.location || event.venue, index),
  }))
}

function getPinForLocation(location, index) {
  const base = locationPins[location] || Object.entries(locationPins).find(([key]) => String(location || '').includes(key))?.[1] || { top: 42 + (index % 4) * 7, left: 32 + (index % 5) * 9 }
  const offset = pinOffsets[index % pinOffsets.length]

  return {
    top: Math.max(18, Math.min(72, base.top + offset.y)),
    left: Math.max(14, Math.min(78, base.left + offset.x)),
  }
}

function itemMatchesSearch(item, query) {
  const search = query.trim().toLowerCase()
  if (!search) return true

  return [item.title, item.meta, item.submeta, item.category, item.location, item.price]
    .join(' ')
    .toLowerCase()
    .includes(search)
}

function MapBackdrop({ activeCategory, items, selectedItemId, onSelectItem, mapZoom, mapShift, onPointerDown, onRecenter, onZoomIn, onZoomOut }) {
  const config = categoryConfig[activeCategory]

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#dfe9dc]">
      <div
        className="absolute inset-0 cursor-grab select-none transition-transform duration-200 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        style={{ transform: `translate(${mapShift.x}px, ${mapShift.y}px) scale(${mapZoom})`, transformOrigin: 'center' }}
      >
        <div className="absolute -left-20 top-0 h-[120%] w-[48%] rotate-[-16deg] bg-[#97cfe0]" />
        <div className="absolute right-[-60px] top-0 h-[52%] w-[48%] rounded-bl-[120px] bg-[#cbe7a5]" />
        <div className="absolute bottom-0 right-[-28px] h-[36%] w-[44%] rounded-tl-[100px] bg-[#cfe8a9]" />
        {[
          'left-[16%] top-[8%] h-[88%] w-2 rotate-[24deg]',
          'left-[34%] top-[-6%] h-[116%] w-2 rotate-[55deg]',
          'left-[62%] top-[-8%] h-[116%] w-2 rotate-[20deg]',
          'left-[2%] top-[36%] h-2 w-[112%] rotate-[-10deg]',
          'left-[18%] top-[58%] h-2 w-[90%] rotate-[16deg]',
          'left-[42%] top-[20%] h-2 w-[70%] rotate-[-32deg]',
        ].map((classes) => (
          <span key={classes} className={`absolute rounded-full bg-white/80 shadow-[0_0_0_1px_rgba(120,130,140,0.14)] ${classes}`} />
        ))}
        <div className="absolute right-7 top-7 text-3xl font-extrabold text-gray-950/70">Dubai</div>
        <div className="absolute left-36 top-24 text-[9px] font-bold uppercase tracking-wide text-gray-600/70">Business Bay</div>
        <div className="absolute left-5 top-16 rotate-[-55deg] text-[9px] font-bold uppercase tracking-wide text-gray-600/60">Dubai Canal</div>

        {items.map((item, index) => {
          const selected = selectedItemId === item.id
          const markerText = item.rating ? Number(item.rating).toFixed(1) : String(index + 1)

          return (
            <button
              key={item.id}
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onSelectItem(item.id)
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${item.pin.top}%`, left: `${item.pin.left}%` }}
              aria-label={`Select ${item.title}`}
            >
              <span className={`inline-flex h-8 min-w-10 items-center justify-center rounded-full px-2 text-[11px] font-extrabold text-white shadow-lg transition-transform ${config.marker} ${selected ? 'scale-125 ring-4 ring-white' : 'hover:scale-110'}`}>
                {markerText}
              </span>
              {selected && (
                <span className="absolute left-1/2 top-10 w-40 -translate-x-1/2 rounded-2xl bg-white px-3 py-2 text-left text-[11px] font-extrabold leading-tight text-gray-950 shadow-xl ring-1 ring-black/[0.06]">
                  <span className="line-clamp-2">{item.title}</span>
                  <span className="mt-1 block text-[10px] font-bold text-gray-500">{item.price}</span>
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="absolute bottom-20 right-4 z-10 flex flex-col overflow-hidden rounded-full bg-white shadow-[0_3px_14px_rgba(15,23,42,0.14)]">
        <button type="button" onClick={onZoomIn} aria-label="Zoom in" className="flex h-9 w-9 items-center justify-center text-gray-800">
          <Plus className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <span className="mx-auto h-px w-5 bg-gray-200" />
        <button type="button" onClick={onZoomOut} aria-label="Zoom out" className="flex h-9 w-9 items-center justify-center text-gray-800">
          <Minus className="h-4 w-4" strokeWidth={2.2} />
        </button>
      </div>
      <button type="button" onClick={onRecenter} aria-label="Recenter map" className="absolute bottom-20 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 shadow-[0_3px_14px_rgba(15,23,42,0.14)]">
        <LocateFixed className="h-5 w-5" strokeWidth={2} />
      </button>
    </div>
  )
}

function FilterSheet({ open, activeCategory, onClose }) {
  const [sortBy, setSortBy] = useState('nearest')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [price, setPrice] = useState(5645)

  if (!open) return null

  const config = categoryConfig[activeCategory]

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/20 md:items-center">
      <button type="button" aria-label="Close filters" className="absolute inset-0" onClick={onClose} />
      <section className="relative max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[28px] bg-white px-6 pb-6 pt-5 shadow-[0_-18px_46px_rgba(15,23,42,0.18)] md:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-950">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close filters" className="flex h-9 w-9 items-center justify-center rounded-full text-gray-950">
            <X className="h-5 w-5" strokeWidth={2.4} />
          </button>
        </div>

        <div className="mb-7 grid grid-cols-2 rounded-full bg-gray-100 p-1 shadow-inner">
          {['Venues', 'Professionals'].map((label) => (
            <button key={label} type="button" className={`h-10 rounded-full text-sm font-extrabold ${label === 'Venues' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-700'}`}>
              {label}
            </button>
          ))}
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
                  onClick={() => setSortBy(option.id)}
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
            <span className="text-sm font-bold text-gray-700">AED {price.toLocaleString()}+</span>
          </div>
          <input
            type="range"
            min="250"
            max="5645"
            step="25"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            className="h-1.5 w-full cursor-pointer accent-brand-purple"
            style={{ accentColor: config.accent }}
          />
        </section>

        <section className="mt-7 border-t border-gray-100 pt-6">
          <h3 className="mb-4 text-sm font-extrabold text-gray-950">Only show</h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-900">
                <Check className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <div>
                <p className="text-sm font-extrabold text-gray-950">STT verified</p>
                <p className="text-xs font-medium leading-4 text-gray-500">These venues accept Set The Table bookings</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVerifiedOnly((value) => !value)}
              className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${verifiedOnly ? 'bg-brand-purple' : 'bg-gray-300'}`}
              aria-pressed={verifiedOnly}
            >
              <span className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${verifiedOnly ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </section>

        <section className="mt-7 border-t border-gray-100 pt-6">
          <h3 className="mb-4 text-sm font-extrabold text-gray-950">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const Icon = amenity.icon

              return (
                <button key={amenity.label} type="button" className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-extrabold text-gray-800 shadow-sm">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {amenity.label}
                </button>
              )
            })}
          </div>
        </section>

        <div className="sticky bottom-0 -mx-6 mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 bg-white px-6 pt-4">
          <button type="button" className="h-12 rounded-full border border-gray-200 text-sm font-extrabold text-gray-950">Clear all</button>
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
  const [mapZoom, setMapZoom] = useState(1)
  const [mapShift, setMapShift] = useState({ x: 0, y: 0 })
  const allItems = useMemo(() => getItems(activeCategory), [activeCategory])
  const items = useMemo(() => allItems.filter((item) => itemMatchesSearch(item, searchQuery)), [allItems, searchQuery])
  const selectedItem = useMemo(() => items.find((item) => item.id === selectedItemId) || items[0] || null, [items, selectedItemId])
  const config = categoryConfig[activeCategory]

  useEffect(() => {
    setSelectedItemId('')
    setMapShift({ x: 0, y: 0 })
    setMapZoom(1)
  }, [activeCategory])

  useEffect(() => {
    if (items.length > 0 && !items.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(items[0].id)
    }
  }, [items, selectedItemId])

  const handlePointerDown = (event) => {
    if (event.button !== 0) return
    const startX = event.clientX
    const startY = event.clientY
    const initial = mapShift

    const handlePointerMove = (moveEvent) => {
      setMapShift({
        x: Math.max(-70, Math.min(70, initial.x + moveEvent.clientX - startX)),
        y: Math.max(-70, Math.min(70, initial.y + moveEvent.clientY - startY)),
      })
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handleCategorySelect = (id) => {
    setActiveCategory(id)
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20 text-gray-950 md:flex md:justify-center md:py-8">
      <main className="relative min-h-screen w-[100vw] max-w-[390px] overflow-hidden bg-white md:min-h-[850px] md:max-w-[430px] md:rounded-[30px] md:shadow-2xl">
        <section className="relative h-[462px] overflow-hidden">
          <MapBackdrop
            activeCategory={activeCategory}
            items={items}
            selectedItemId={selectedItem?.id}
            onSelectItem={setSelectedItemId}
            mapZoom={mapZoom}
            mapShift={mapShift}
            onPointerDown={handlePointerDown}
            onRecenter={() => {
              setMapShift({ x: 0, y: 0 })
              setMapZoom(1)
            }}
            onZoomIn={() => setMapZoom((value) => Math.min(1.45, Number((value + 0.12).toFixed(2))))}
            onZoomOut={() => setMapZoom((value) => Math.max(0.88, Number((value - 0.12).toFixed(2))))}
          />
          <div className="absolute left-7 top-4 z-10 text-sm font-extrabold text-gray-950">2:45</div>
          <form
            className="absolute inset-x-5 top-12 z-10 flex h-14 items-center gap-3 rounded-full bg-white px-4 shadow-[0_5px_18px_rgba(15,23,42,0.16)]"
            onSubmit={(event) => event.preventDefault()}
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

        <section className="relative z-10 -mt-16 rounded-t-[28px] bg-white pb-6 shadow-[0_-8px_24px_rgba(15,23,42,0.08)]">
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
              <button type="button" className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white px-4 text-sm font-extrabold text-gray-800 shadow-sm">
                Nearest
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
              <button type="button" className="inline-flex h-10 shrink-0 items-center gap-1 rounded-full border border-gray-200 bg-white px-4 text-sm font-extrabold text-gray-800 shadow-sm">
                Price
                <ChevronDown className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <button type="button" onClick={() => setFilterOpen(true)} aria-label="Advanced filters" className="absolute right-5 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-brand-purple bg-white text-brand-purple shadow-[0_2px_10px_rgba(15,23,42,0.12)]">
              <Settings2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <p className="px-5 pt-1 text-center text-xs font-semibold text-gray-400">
            {items.length > 0 ? `${items.length} ${config.label.toLowerCase()} in map area` : `No ${config.label.toLowerCase()} match this search`}
          </p>

          <div className="mt-4 space-y-4 px-5">
            {items.length === 0 && (
              <div className="rounded-[18px] bg-gray-50 p-8 text-center text-sm font-bold text-gray-500">
                Try another keyword or switch to a different category.
              </div>
            )}
            {items.map((item) => {
              const selected = selectedItem?.id === item.id

              return (
                <article key={item.id} className={`overflow-hidden rounded-[18px] bg-white shadow-[0_3px_18px_rgba(15,23,42,0.10)] ring-1 transition-all ${selected ? 'ring-2 ring-brand-purple' : 'ring-black/[0.04]'}`}>
                  <button type="button" onClick={() => setSelectedItemId(item.id)} className="block w-full text-left">
                    <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
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
                    <p className="mt-1 line-clamp-1 text-xs font-medium text-gray-500">12.6 km - {item.meta}</p>
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

      <FilterSheet open={filterOpen} activeCategory={activeCategory} onClose={() => setFilterOpen(false)} />
    </div>
  )
}

export default MapSearchPage
