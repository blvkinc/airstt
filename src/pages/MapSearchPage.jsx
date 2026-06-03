import { useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronDown, Heart, MapPin, Search, Settings2, SlidersHorizontal, Sparkles, Star, User, Users, X } from 'lucide-react'
import { eventCatalog, venueCatalog } from '../features/experiences/data'

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

const mapPins = [
  { top: '26%', left: '40%', rating: '4.9' },
  { top: '35%', left: '54%', rating: '5.0' },
  { top: '48%', left: '46%', rating: '4.8' },
  { top: '54%', left: '20%', rating: '4.9' },
  { top: '42%', left: '29%', rating: '4.6' },
  { top: '62%', left: '68%', rating: '4.9' },
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
    return venueCatalog.slice(0, 4).map((venue) => ({
      id: `venue-${venue.id}`,
      title: venue.name,
      image: venue.image,
      rating: venue.rating || 4.8,
      meta: `${venue.location || venue.address || 'Dubai'} - ${venue.category || 'Venue'}`,
      submeta: venue.address || venue.description || 'Curated venue',
    }))
  }

  return eventCatalog.slice(0, 4).map((event) => ({
    id: `event-${event.id}`,
    title: event.title,
    image: event.image,
    rating: event.rating || 4.8,
    meta: `${event.venue || 'Dubai'} - ${event.category || 'Experience'}`,
    submeta: event.location || event.description || 'Curated event',
  }))
}

function MapBackdrop({ activeCategory }) {
  const config = categoryConfig[activeCategory]

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#dfe9dc]">
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

      {mapPins.map((pin, index) => (
        <div key={`${pin.top}-${pin.left}`} className="absolute" style={{ top: pin.top, left: pin.left }}>
          {index % 2 === 0 ? (
            <span className={`inline-flex h-8 min-w-10 items-center justify-center rounded-full px-2 text-[11px] font-extrabold text-white shadow-lg ${config.marker}`}>
              {pin.rating}
            </span>
          ) : (
            <span className={`block h-3 w-3 rounded-full border-2 border-white shadow-md ${config.marker}`} />
          )}
        </div>
      ))}
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
  const items = useMemo(() => getItems(activeCategory), [activeCategory])
  const config = categoryConfig[activeCategory]

  return (
    <div className="min-h-screen bg-gray-100 pb-20 text-gray-950 md:flex md:justify-center md:py-8">
      <main className="relative min-h-screen w-[100vw] max-w-[390px] overflow-hidden bg-white md:min-h-[850px] md:max-w-[430px] md:rounded-[30px] md:shadow-2xl">
        <section className="relative h-[462px] overflow-hidden">
          <MapBackdrop activeCategory={activeCategory} />
          <div className="absolute left-7 top-4 z-10 text-sm font-extrabold text-gray-950">2:45</div>
          <div className="absolute inset-x-5 top-12 z-10 flex h-14 items-center gap-3 rounded-full bg-white px-4 shadow-[0_5px_18px_rgba(15,23,42,0.16)]">
            <Search className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-gray-950">{config.label}</p>
              <p className="truncate text-xs font-medium text-gray-500">Map area</p>
            </div>
            <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-800">
              <SlidersHorizontal className="h-5 w-5" strokeWidth={1.9} />
            </button>
          </div>
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
                    onClick={() => setActiveCategory(id)}
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

          <p className="px-5 pt-1 text-center text-xs font-semibold text-gray-400">{config.count}</p>

          <div className="mt-4 space-y-4 px-5">
            {items.slice(0, 2).map((item) => (
              <article key={item.id} className="overflow-hidden rounded-[18px] bg-white shadow-[0_3px_18px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.04]">
                <img src={item.image} alt={item.title} className="h-44 w-full object-cover" />
                <div className="p-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="line-clamp-1 text-sm font-extrabold text-gray-950">{item.title}</h2>
                    <span className="inline-flex items-center gap-1 text-xs font-extrabold text-gray-800">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" strokeWidth={1.8} />
                      {item.rating}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs font-medium text-gray-500">12.6 km - {item.meta}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{item.submeta}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <FilterSheet open={filterOpen} activeCategory={activeCategory} onClose={() => setFilterOpen(false)} />
    </div>
  )
}

export default MapSearchPage
