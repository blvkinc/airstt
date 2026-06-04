import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, ChevronRight, Clock, Heart, MapPin, Minus, Navigation, Plus, Search, Sparkles, Utensils, User, X } from 'lucide-react'
import sttLogo from '../shared/assets/sttmainlogo.svg'
import { getEventHref } from '../shared/lib/eventRoutes'

const discoveryLinks = [
  { id: 'events', label: 'Events', icon: CalendarDays, to: '/events' },
  { id: 'experiences', label: 'Experiences', icon: Sparkles, to: '/experiences' },
  { id: 'venues', label: 'Venues', icon: MapPin, to: '/venues' },
]

const emptySearchSuggestions = []
const dateTimeOptions = ['Today', 'This Weekend', 'Evening']
const recentSearchStorageKey = 'stt.recentSearches'
const maxRecentSearches = 6
const fallbackLocationSuggestions = ['Dubai Harbour', 'Palm Jumeirah', 'Downtown Dubai', 'DIFC', 'Dubai Marina', 'Jumeirah']
const fallbackEventCategoryTiles = [
  { label: 'Events', tab: 'events', icon: CalendarDays },
  { label: 'Experiences', tab: 'experiences', icon: Sparkles },
  { label: 'Brunch', tab: 'events', icon: Utensils },
  { label: 'Venues', tab: 'venues', icon: MapPin },
]
const fallbackVenueCategoryTiles = [
  { label: 'Beach Club', tab: 'venues', icon: MapPin },
  { label: 'Restaurant', tab: 'venues', icon: Utensils },
  { label: 'Rooftop', tab: 'venues', icon: Sparkles },
  { label: 'Fine Dining', tab: 'venues', icon: CalendarDays },
]
const desktopDestinationSuggestions = [
  { title: 'Nearby', subtitle: "Find what's around you", icon: Navigation, tone: 'text-blue-500 bg-blue-50' },
  { title: 'Dubai Harbour', subtitle: 'Beach clubs, yachts, and waterfront brunches', icon: Building2, tone: 'text-brand-purple bg-brand-purple/10' },
  { title: 'Palm Jumeirah', subtitle: 'Because guests keep saving beach venues', icon: MapPin, tone: 'text-amber-700 bg-amber-50' },
  { title: 'Downtown Dubai', subtitle: 'For rooftops, restaurants, and late nights', icon: Building2, tone: 'text-rose-500 bg-rose-50' },
  { title: 'DIFC', subtitle: 'Dining rooms, lounges, and private tables', icon: Utensils, tone: 'text-slate-700 bg-slate-100' },
  { title: 'Jumeirah', subtitle: 'Casual lunches, garden venues, and cafes', icon: Sparkles, tone: 'text-brand-purple bg-brand-purple/10' },
]
const brandLogoFilter = {
  filter: 'brightness(0) saturate(100%) invert(59%) sepia(19%) saturate(761%) hue-rotate(238deg) brightness(88%) contrast(87%)',
}

const uniqueText = (values = [], limit = values.length) => {
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

const getRecentSearchLabel = (payload = {}) => {
  const primary = payload.keyword || payload.category || payload.location || payload.dateTime || payload.guests
  const secondary = payload.location && payload.location !== primary ? payload.location : ''
  return [primary, secondary].filter(Boolean).join(' in ')
}

const normalizeRecentSearchEntry = (entry) => {
  if (typeof entry === 'string') {
    const label = entry.trim()
    return label ? { id: label.toLowerCase(), label, keyword: label, createdAt: 0 } : null
  }

  if (!entry || typeof entry !== 'object') return null

  const payload = {
    keyword: String(entry.keyword || '').trim(),
    location: String(entry.location || '').trim(),
    dateTime: String(entry.dateTime || '').trim(),
    category: String(entry.category || '').trim(),
    guests: String(entry.guests || '').trim(),
    tab: String(entry.tab || '').trim(),
  }
  const label = String(entry.label || getRecentSearchLabel(payload)).trim()

  if (!label) return null
  return {
    ...payload,
    id: String(entry.id || label).toLowerCase(),
    label,
    createdAt: Number(entry.createdAt) || 0,
  }
}

const readRecentSearches = () => {
  if (typeof window === 'undefined') return []

  try {
    const parsed = JSON.parse(window.localStorage.getItem(recentSearchStorageKey) || '[]')
    return Array.isArray(parsed) ? parsed.map(normalizeRecentSearchEntry).filter(Boolean).slice(0, maxRecentSearches) : []
  } catch {
    return []
  }
}

const writeRecentSearches = (items) => {
  if (typeof window === 'undefined') return items

  try {
    window.localStorage.setItem(recentSearchStorageKey, JSON.stringify(items.slice(0, maxRecentSearches)))
  } catch {
    // Private browsing and storage policies should not block searching.
  }

  return items
}

const rememberRecentSearch = (payload = {}) => {
  const entry = normalizeRecentSearchEntry({
    ...payload,
    label: getRecentSearchLabel(payload),
    createdAt: Date.now(),
  })

  if (!entry) return readRecentSearches()

  const nextItems = [
    entry,
    ...readRecentSearches().filter((item) => item.id !== entry.id && item.label.toLowerCase() !== entry.label.toLowerCase()),
  ].slice(0, maxRecentSearches)

  return writeRecentSearches(nextItems)
}

const filterTextSuggestions = (values, query, limit = 6) => {
  const normalized = uniqueText(values)
  const needle = String(query || '').trim().toLowerCase()
  const matches = needle ? normalized.filter((item) => item.toLowerCase().includes(needle)) : normalized
  return matches.slice(0, limit)
}

const filterSuggestionItems = (items, query, limit = 6) => {
  const needle = String(query || '').trim().toLowerCase()
  const seen = new Set()
  const matches = []

  items.forEach((item) => {
    const label = String(item?.label || '').trim()
    const key = label.toLowerCase()
    if (!label || seen.has(key)) return
    if (needle && !key.includes(needle)) return
    seen.add(key)
    matches.push(item)
  })

  return matches.slice(0, limit)
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
  if (value.includes('beach') || value.includes('pool')) return 'bg-brand-green text-white ring-transparent'
  if (value.includes('night') || value.includes('party')) return 'bg-brand-purple text-white ring-transparent'
  if (value.includes('dining') || value.includes('restaurant')) return 'bg-brand-yellow text-white ring-transparent'
  if (value.includes('brunch')) return 'bg-brand-purple text-white ring-transparent'
  if (value.includes('venue')) return 'bg-brand-green text-white ring-transparent'
  return 'bg-brand-purple text-white ring-transparent'
}

const dayPillClassName = 'bg-brand-green text-white ring-transparent'

function SearchField({ icon: Icon, placeholder, value, onChange, onFocus, expanded = false, children }) {
  return (
    <div className="relative">
      <label className="flex h-12 w-full items-center gap-3 rounded-full bg-white px-4 text-gray-500 shadow-[0_2px_12px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
        <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          autoComplete="off"
          aria-expanded={expanded}
          className="w-0 min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-400"
        />
      </label>
      {expanded && children}
    </div>
  )
}

function SuggestionDropdown({ items, emptyText, icon: Icon = Search, onSelect }) {
  return (
    <div className="absolute left-0 right-0 top-[54px] z-[80] overflow-hidden rounded-[18px] border border-gray-100 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.16)]">
      {items.length > 0 ? (
        <div className="max-h-64 overflow-y-auto py-2">
          {items.map((item) => (
            <button key={item.value || item.label} type="button" onClick={() => onSelect(item)} className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-950">{item.label}</span>
                {item.meta && <span className="mt-0.5 block truncate text-xs font-semibold text-gray-500">{item.meta}</span>}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 text-sm font-semibold text-gray-500">{emptyText}</div>
      )}
    </div>
  )
}

export function SttDesktopSearchBar({ mode = 'events', searchTerm = '', recentSearches = emptySearchSuggestions, suggestedLocations = emptySearchSuggestions, categoryTiles: categoryTileSuggestions, onApplySearch, compact = false, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [keyword, setKeyword] = useState(searchTerm || '')
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [category, setCategory] = useState('')
  const [categoryTab, setCategoryTab] = useState('')
  const [guests, setGuests] = useState(0)
  const [storedRecentSearches, setStoredRecentSearches] = useState([])
  const searchRef = useRef(null)
  const isCondensed = compact || mode === 'condensed'
  const isVenuesMode = mode === 'venues'
  const locationSuggestions = suggestedLocations.length > 0 ? suggestedLocations : fallbackLocationSuggestions
  const categoryTiles = categoryTileSuggestions?.length
    ? categoryTileSuggestions
    : isVenuesMode
      ? fallbackVenueCategoryTiles
      : fallbackEventCategoryTiles

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!searchRef.current?.contains(event.target)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  useEffect(() => {
    setStoredRecentSearches(readRecentSearches())
  }, [])

  useEffect(() => {
    setKeyword(searchTerm || '')
  }, [searchTerm])

  const openDropdown = () => {
    setStoredRecentSearches(readRecentSearches())
    setIsOpen(true)
  }

  const applyDesktopSearch = (overrides = {}) => {
    const payload = {
      keyword: overrides.keyword ?? keyword,
      location: overrides.location ?? location,
      dateTime: overrides.dateTime ?? dateTime,
      category: overrides.category ?? category,
      tab: overrides.tab ?? categoryTab,
      guests: overrides.guests ?? (guests ? String(guests) : ''),
    }

    setStoredRecentSearches(rememberRecentSearch(payload))
    onApplySearch?.(payload)
    setIsOpen(false)
  }
  const clearSelections = () => {
    setKeyword('')
    setLocation('')
    setDateTime('')
    setCategory('')
    setCategoryTab('')
    setGuests(0)
  }
  const clearRecentSearches = () => {
    setStoredRecentSearches(writeRecentSearches([]))
  }
  const displayPlaceholder = isVenuesMode ? 'Search venues or locations' : 'Search venues, events, experiences'
  const selectedFilters = [
    location,
    dateTime,
    category,
    guests ? `${guests} guests` : '',
  ].filter(Boolean)
  const querySuggestionItems = filterSuggestionItems([
    ...storedRecentSearches.map((item) => ({ label: item.label, meta: 'Recent search', payload: item, icon: Search })),
    ...recentSearches.map((item) => ({ label: item, meta: 'Suggested search', payload: { keyword: item }, icon: Search })),
    ...locationSuggestions.map((item) => ({ label: item, meta: 'Location', payload: { keyword: item, location: item }, icon: MapPin })),
    ...categoryTiles.map((tile) => ({ label: tile.label, meta: 'Category', payload: { keyword: tile.label, category: tile.label, tab: tile.tab }, icon: tile.icon || Search })),
  ], keyword, 7)
  const showQuerySuggestions = keyword.trim().length > 0
  const visibleLocations = filterTextSuggestions(locationSuggestions, keyword, 8)

  return (
    <form
      ref={searchRef}
      onSubmit={(event) => {
        event.preventDefault()
        applyDesktopSearch()
      }}
      className={`relative mx-auto ${isCondensed ? 'w-[520px] max-w-full' : 'mt-7 w-full max-w-[720px]'} ${className}`}
    >
      <div className={`flex items-center rounded-full bg-white p-2 shadow-[0_6px_24px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.08] transition-shadow ${isOpen ? 'shadow-[0_10px_30px_rgba(15,23,42,0.14)] ring-brand-purple/25' : ''} ${isCondensed ? 'h-[52px]' : 'h-[62px]'}`}>
        <label className="flex min-w-0 flex-1 items-center gap-3 px-3 text-gray-500">
          <Search className="h-5 w-5 shrink-0 text-brand-purple" strokeWidth={2} />
          <input
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              openDropdown()
            }}
            onFocus={openDropdown}
            placeholder={displayPlaceholder}
            autoComplete="off"
            aria-expanded={isOpen}
            className="w-0 min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-950 outline-none placeholder:text-gray-400"
          />
        </label>
        {selectedFilters.length > 0 && (
          <span className="hidden max-w-[230px] truncate rounded-full bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 lg:inline">
            {selectedFilters.join(' | ')}
          </span>
        )}
        <button type="submit" aria-label="Search" className={`ml-2 flex shrink-0 items-center justify-center rounded-full bg-brand-purple text-white shadow-[0_4px_12px_rgba(171,131,187,0.34)] transition-transform hover:scale-[1.02] ${isCondensed ? 'h-10 w-10' : 'h-12 w-12'}`}>
          <Search className={isCondensed ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2.2} />
        </button>
      </div>

      {isOpen && (
        <div className={`absolute left-1/2 z-[75] max-h-[min(680px,calc(100vh-120px))] w-[min(760px,calc(100vw-48px))] -translate-x-1/2 overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06] animate-in fade-in slide-in-from-top-2 duration-200 ${isCondensed ? 'top-[64px]' : 'top-[76px]'}`}>
          {showQuerySuggestions && (
            <section>
              <p className="mb-3 text-sm font-semibold text-gray-950">Suggestions</p>
              <div className="space-y-1">
                {querySuggestionItems.length > 0 ? querySuggestionItems.map((item) => {
                  const Icon = item.icon || Search

                  return (
                    <button key={`${item.meta}-${item.label}`} type="button" onClick={() => applyDesktopSearch(item.payload || { keyword: item.label })} className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-gray-50">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple">
                        <Icon className="h-4 w-4" strokeWidth={1.85} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold leading-tight text-gray-950">{item.label}</span>
                        <span className="mt-0.5 block truncate text-xs font-semibold text-gray-500">{item.meta}</span>
                      </span>
                    </button>
                  )
                }) : (
                  <button type="button" onClick={() => applyDesktopSearch({ keyword })} className="flex w-full items-center gap-3 rounded-2xl px-2 py-3 text-left transition-colors hover:bg-gray-50">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
                      <Search className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-gray-950">Search for "{keyword}"</span>
                      <span className="mt-0.5 block text-xs font-semibold text-gray-500">Use this keyword</span>
                    </span>
                  </button>
                )}
              </div>
            </section>
          )}

          {!showQuerySuggestions && storedRecentSearches.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-950">Recent searches</p>
                <button type="button" onClick={clearRecentSearches} className="text-xs font-semibold text-brand-purple">Clear</button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {storedRecentSearches.slice(0, 4).map((item) => (
                  <button key={`${item.id}-${item.createdAt}`} type="button" onClick={() => applyDesktopSearch(item)} className="flex min-w-0 items-center gap-3 rounded-2xl border border-gray-100 bg-white px-3 py-3 text-left shadow-sm transition-colors hover:bg-gray-50">
                    <Search className="h-4 w-4 shrink-0 text-brand-purple" strokeWidth={2} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-gray-950">{item.label}</span>
                      {item.location && item.keyword !== item.location && <span className="mt-0.5 block truncate text-xs font-semibold text-gray-500">{item.location}</span>}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <section>
                <p className="mb-3 text-sm font-semibold text-gray-950">Locations</p>
                <div className="flex flex-wrap gap-2">
                  {visibleLocations.map((item) => (
                    <button key={item} type="button" onClick={() => setLocation((current) => current === item ? '' : item)} className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 transition ${location === item ? 'bg-brand-purple text-white ring-brand-purple' : 'bg-white text-gray-800 ring-gray-200 hover:bg-gray-50'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </section>

              {!isVenuesMode && (
                <section>
                  <p className="mb-3 text-sm font-semibold text-gray-950">Date & time</p>
                  <div className="flex flex-wrap gap-2">
                    {dateTimeOptions.map((item) => (
                      <button key={item} type="button" onClick={() => setDateTime((current) => current === item ? '' : item)} className={`rounded-full px-3 py-2 text-xs font-semibold ring-1 transition ${dateTime === item ? 'bg-brand-purple text-white ring-brand-purple' : 'bg-white text-gray-800 ring-gray-200 hover:bg-gray-50'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <p className="mb-3 text-sm font-semibold text-gray-950">{isVenuesMode ? 'Venue categories' : 'Categories'}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {categoryTiles.map((tile) => {
                    const Icon = tile.icon || Search
                    const selected = category === tile.label

                    return (
                      <button
                        key={tile.label}
                        type="button"
                        onClick={() => {
                          setCategory(selected ? '' : tile.label)
                          setCategoryTab(selected ? '' : tile.tab || '')
                        }}
                        className={`flex min-w-0 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${selected ? 'border-brand-purple bg-brand-purple/10' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${selected ? 'bg-brand-purple text-white' : 'bg-brand-purple/10 text-brand-purple'}`}>
                          <Icon className="h-4 w-4" strokeWidth={1.85} />
                        </span>
                        <span className="truncate text-sm font-semibold text-gray-950">{tile.label}</span>
                      </button>
                    )
                  })}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <section>
                <p className="mb-3 text-sm font-semibold text-gray-950">Popular destinations</p>
                <div className="space-y-1">
                  {desktopDestinationSuggestions.slice(0, 4).map((item) => {
                    const Icon = item.icon
                    const value = item.title === 'Nearby' ? 'Dubai' : item.title

                    return (
                      <button key={item.title} type="button" onClick={() => setLocation(value)} className="flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-gray-50">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                          <Icon className="h-5 w-5" strokeWidth={1.65} />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold leading-tight text-gray-950">{item.title}</span>
                          <span className="mt-0.5 block truncate text-xs font-semibold text-gray-500">{item.subtitle}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-950">Guests</p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-500">Optional party size</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setGuests((current) => Math.max(0, current - 1))} disabled={guests === 0} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-40">
                      <Minus className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <span className="w-6 text-center text-base font-semibold text-gray-950">{guests}</span>
                    <button type="button" onClick={() => setGuests((current) => current + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-900">
                      <Plus className="h-4 w-4" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </section>

              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={clearSelections} className="h-10 rounded-full px-4 text-xs font-semibold text-gray-600 transition hover:bg-gray-50">Clear</button>
                <button type="submit" className="h-10 rounded-full bg-brand-purple px-5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(171,131,187,0.28)]">Search</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

export function SttCategoryLinks() {
  return (
    <div className="mx-auto flex w-full max-w-[330px] items-center justify-between gap-2 md:max-w-[360px]">
      {discoveryLinks.map((item) => {
        const Icon = item.icon

        return (
          <Link key={item.id} to={item.to} className="group flex min-w-[82px] flex-col items-center gap-1.5 text-center text-brand-purple">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-purple/10 text-brand-purple transition-shadow group-hover:shadow-[0_2px_8px_rgba(34,34,34,0.10)]">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-[10px] font-bold leading-none text-brand-purple">{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
}

export function SttSearchOverlay({
  open,
  mode = 'events',
  initialKeyword = '',
  recentSearches = emptySearchSuggestions,
  suggestedLocations = emptySearchSuggestions,
  categoryTiles: categoryTileSuggestions,
  onClose,
  onApplySearch,
}) {
  const [keyword, setKeyword] = useState(initialKeyword)
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const [activeField, setActiveField] = useState(null)
  const [storedRecentSearches, setStoredRecentSearches] = useState([])
  const isVenuesMode = mode === 'venues'
  const locationSuggestions = suggestedLocations.length > 0 ? suggestedLocations : fallbackLocationSuggestions
  const categoryTiles = categoryTileSuggestions?.length
    ? categoryTileSuggestions
    : isVenuesMode
      ? fallbackVenueCategoryTiles
      : fallbackEventCategoryTiles

  useEffect(() => {
    if (!open) return
    setKeyword(initialKeyword || '')
    setLocation('')
    setDateTime('')
    setActiveField(null)
    setStoredRecentSearches(readRecentSearches())
  }, [initialKeyword, open])

  if (!open) return null

  const applySearch = (overrides = {}) => {
    const payload = {
      keyword: overrides.keyword ?? keyword,
      location: overrides.location ?? location,
      dateTime: overrides.dateTime ?? dateTime,
      category: overrides.category,
      tab: overrides.tab,
      guests: overrides.guests,
    }

    setActiveField(null)
    setStoredRecentSearches(rememberRecentSearch(payload))
    onApplySearch?.(payload)
  }

  const clearRecentSearches = () => {
    setStoredRecentSearches(writeRecentSearches([]))
  }

  const keywordSuggestionItems = filterSuggestionItems([
    ...storedRecentSearches.map((item) => ({ label: item.label, meta: 'Recent search', payload: item })),
    ...recentSearches.map((item) => ({ label: item, meta: 'Suggested search', payload: { keyword: item } })),
    ...locationSuggestions.map((item) => ({ label: item, meta: 'Location', payload: { keyword: item, location: item } })),
    ...categoryTiles.map((tile) => ({ label: tile.label, meta: 'Category', payload: { keyword: tile.label, category: tile.label, tab: tile.tab } })),
  ], keyword, 6)
  const locationSuggestionItems = filterTextSuggestions(locationSuggestions, location, 6).map((item) => ({ label: item, value: item, meta: 'Dubai' }))
  const showKeywordSuggestions = activeField === 'keyword' && keyword.trim().length > 0
  const showLocationSuggestions = activeField === 'location' && locationSuggestions.length > 0

  return (
    <div className="fixed inset-0 z-[70] overflow-x-hidden bg-white md:hidden" role="dialog" aria-modal="true" aria-label="Search">
      <div className="min-h-full w-full max-w-full overflow-x-hidden bg-white px-7 pb-10 pt-16 md:mx-auto md:min-h-0 md:max-w-[440px] md:rounded-[28px] md:px-8 md:shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-950">Search</h2>
          <button type="button" onClick={onClose} aria-label="Close search" className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600">
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault()
            applySearch()
          }}
        >
          <SearchField
            icon={Search}
            placeholder={isVenuesMode ? 'Any venues or locations' : 'Any venues, experiences or events'}
            value={keyword}
            onChange={(value) => {
              setKeyword(value)
              setActiveField('keyword')
            }}
            onFocus={() => setActiveField('keyword')}
            expanded={showKeywordSuggestions}
          >
            <SuggestionDropdown
              items={keywordSuggestionItems}
              emptyText="No matching suggestions"
              icon={Search}
              onSelect={(item) => applySearch(item.payload || { keyword: item.label })}
            />
          </SearchField>
          <SearchField
            icon={MapPin}
            placeholder="Location"
            value={location}
            onChange={(value) => {
              setLocation(value)
              setActiveField('location')
            }}
            onFocus={() => setActiveField('location')}
            expanded={showLocationSuggestions}
          >
            <SuggestionDropdown
              items={locationSuggestionItems}
              emptyText="No matching locations"
              icon={MapPin}
              onSelect={(item) => {
                setLocation(item.label)
                setActiveField(null)
              }}
            />
          </SearchField>
          {!isVenuesMode && <SearchField icon={Clock} placeholder="Date & Time" value={dateTime} onChange={setDateTime} onFocus={() => setActiveField('dateTime')} />}
          <button type="submit" className="mt-2 h-11 w-full rounded-full bg-brand-purple text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.14)]">
            Search
          </button>
        </form>

        {storedRecentSearches.length > 0 && (
          <section className="mt-8">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-gray-950">Recent Searches</h3>
              <button type="button" onClick={clearRecentSearches} className="text-xs font-semibold text-brand-purple">Clear</button>
            </div>
            <div className="mt-4 space-y-4">
              {storedRecentSearches.map((item) => (
                <button key={`${item.id}-${item.createdAt}`} type="button" onClick={() => applySearch(item)} className="flex w-full items-center gap-5 text-left">
                  <Search className="h-5 w-5 text-brand-purple" strokeWidth={2} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-gray-950">{item.label}</span>
                    {item.location && item.keyword !== item.location && <span className="mt-0.5 block truncate text-xs font-semibold text-gray-500">{item.location}</span>}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {locationSuggestions.length > 0 && (
          <section className="mt-8">
              <h3 className="text-base font-semibold text-gray-950">Suggested Locations</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {locationSuggestions.map((item) => (
                <button key={item} type="button" onClick={() => applySearch({ keyword: item, location: item })} className="rounded-full border border-brand-purple/15 bg-brand-purple/5 px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm">
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        {!isVenuesMode && (
          <section className="mt-8">
            <h3 className="text-base font-semibold text-gray-950">Date & Time</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {dateTimeOptions.map((item) => (
                <button key={item} type="button" onClick={() => setDateTime(item)} className={`rounded-full px-3 py-2 text-xs font-semibold shadow-sm ${dateTime === item ? 'bg-brand-purple text-white' : 'border border-gray-200 bg-white text-gray-700'}`}>
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        {categoryTiles.length > 0 && (
          <section className="mt-8">
            <h3 className="text-base font-semibold text-gray-950">{isVenuesMode ? 'Venue Categories' : 'Top Categories'}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categoryTiles.map((tile) => {
                const Icon = tile.icon

                return (
                  <button key={tile.label} type="button" onClick={() => applySearch({ category: tile.label, keyword: tile.label, tab: tile.tab })} className="flex h-[90px] flex-col items-center justify-center gap-2 rounded-[14px] bg-white text-center shadow-[0_2px_12px_rgba(15,23,42,0.11)] ring-1 ring-black/5">
                    <Icon className="h-8 w-8 text-brand-purple" strokeWidth={1.8} />
                    <span className="text-sm font-semibold text-gray-950">{tile.label}</span>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export function SttPageHeader({
  mode = 'events',
  searchTerm = '',
  recentSearches,
  suggestedLocations,
  categoryTiles,
  onApplySearch,
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const routeLocation = useLocation()
  const navigate = useNavigate()
  const placeholder = mode === 'venues' ? 'Search venues or locations' : 'Any venues, experiences or events'

  useEffect(() => {
    if (new URLSearchParams(routeLocation.search).get('search') === 'open') setSearchOpen(true)
  }, [routeLocation.search])

  const closeSearch = () => {
    setSearchOpen(false)
    if (new URLSearchParams(routeLocation.search).get('search') === 'open') {
      navigate(routeLocation.pathname, { replace: true })
    }
  }

  const handleApplySearch = (payload) => {
    onApplySearch?.(payload)
    closeSearch()
  }

  return (
    <section className="mx-auto w-full max-w-[100vw] px-5 pt-5 md:max-w-none md:bg-[#f8f8f8]/95 md:px-8 md:py-5 md:shadow-[0_4px_22px_rgba(52,52,52,0.10)]">
      <SttSearchOverlay
        open={searchOpen}
        mode={mode}
        initialKeyword={searchTerm}
        recentSearches={recentSearches}
        suggestedLocations={suggestedLocations}
        categoryTiles={categoryTiles}
        onClose={closeSearch}
        onApplySearch={handleApplySearch}
      />

      <div className="md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/" className="block">
            <img src={sttLogo} alt="Set The Table" className="h-9 w-auto" style={brandLogoFilter} />
          </Link>
          <span className="h-8 w-8" aria-hidden="true" />
        </div>

        <button type="button" onClick={() => setSearchOpen(true)} className="mb-4 flex h-12 w-full items-center gap-3 overflow-hidden rounded-full bg-white pl-4 pr-1.5 text-left shadow-[0_2px_14px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
          <Search className="h-5 w-5 shrink-0 text-gray-500" strokeWidth={2} />
          <span className="w-0 min-w-0 flex-1 truncate text-[12px] font-medium text-gray-500">
            {searchTerm || placeholder}
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
          mode={mode}
          searchTerm={searchTerm}
          recentSearches={recentSearches}
          suggestedLocations={suggestedLocations}
          categoryTiles={categoryTiles}
          onApplySearch={handleApplySearch}
        />
      </div>
    </section>
  )
}

export function SttSectionHeader({ title, actionTo }) {
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

export function SttRail({ title, actionTo, children, className = '' }) {
  return (
    <section className={className}>
      <SttSectionHeader title={title} actionTo={actionTo} />
      <div className="no-scrollbar -mx-5 flex w-screen max-w-[100vw] snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-4 scroll-px-5 md:mx-0 md:grid md:w-full md:max-w-full md:grid-cols-5 md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:scroll-px-0">
        {children}
      </div>
    </section>
  )
}

export function SttRailItem({ children, variant = 'event' }) {
  const widthClass = variant === 'venue' ? 'w-[154px] md:w-full md:min-w-0' : 'w-[174px] md:w-full md:min-w-0'

  return (
    <div className={`shrink-0 snap-start ${widthClass}`}>
      {children}
    </div>
  )
}

export function SttEventTile({ event, badge = 'Featured' }) {
  const dayLabel = formatEventDay(event)
  const categoryLabel = event.category || event.type || 'Event'

  return (
    <Link to={getEventHref(event)} className="block min-w-0">
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
            <h3 className="line-clamp-2 pl-1 text-[13px] font-medium leading-tight text-gray-950">{event.title}</h3>
            <div className="shrink-0 text-right">
              {event.price !== null && event.price !== undefined ? (
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

export function SttVenueTile({ venue, badge = 'Featured' }) {
  const categoryLabel = venue.category || venue.type || 'Venue'

  return (
    <Link to={`/venues/${venue.id}`} className="block min-w-0">
      <article className="group">
        <div className="relative aspect-[1.22] overflow-hidden rounded-lg bg-gray-100 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition-shadow group-hover:shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
          {venue.image ? (
            <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-semibold text-gray-400">No image</div>
          )}
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-semibold leading-none text-gray-950 shadow-sm">{badge}</span>
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
