import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Building2, CalendarDays, ChevronLeft, ChevronRight, Clock, Heart, MapPin, Minus, Navigation, Plus, Search, Sparkles, Utensils, User, X } from 'lucide-react'
import sttLogo from '../shared/assets/sttmainlogo.svg'

const discoveryLinks = [
  { id: 'events', label: 'Events', icon: CalendarDays, to: '/events' },
  { id: 'experiences', label: 'Experiences', icon: Sparkles, to: '/experiences' },
  { id: 'venues', label: 'Venues', icon: MapPin, to: '/venues' },
]

const eventCategoryTiles = [
  { label: 'Day Brunch', tab: 'events', icon: CalendarDays },
  { label: 'Evening Brunch', tab: 'events', icon: CalendarDays },
  { label: 'Pool Party', tab: 'events', icon: Sparkles },
  { label: 'Ladies Night', tab: 'experiences', icon: Sparkles },
]

const venueCategoryTiles = [
  { label: 'Beach Club', tab: 'venues', icon: MapPin },
  { label: 'Restaurant', tab: 'venues', icon: CalendarDays },
  { label: 'Rooftop', tab: 'venues', icon: Sparkles },
  { label: 'Fine Dining', tab: 'venues', icon: CalendarDays },
]

const recentSearches = ['Secret Jungle Brunch', 'Dubai Harbour', 'Ladies Night']
const suggestedLocations = ['Dubai Harbour', 'Palm Jumeirah', 'Downtown Dubai', 'DIFC']
const dateTimeOptions = ['Today', 'This Weekend', 'Evening']
const desktopDestinationSuggestions = [
  { title: 'Nearby', subtitle: "Find what's around you", icon: Navigation, tone: 'text-blue-500 bg-blue-50' },
  { title: 'Dubai Harbour', subtitle: 'Beach clubs, yachts, and waterfront brunches', icon: Building2, tone: 'text-brand-purple bg-brand-purple/10' },
  { title: 'Palm Jumeirah', subtitle: 'Because guests keep saving beach venues', icon: MapPin, tone: 'text-amber-700 bg-amber-50' },
  { title: 'Downtown Dubai', subtitle: 'For rooftops, restaurants, and late nights', icon: Building2, tone: 'text-rose-500 bg-rose-50' },
  { title: 'DIFC', subtitle: 'Dining rooms, lounges, and private tables', icon: Utensils, tone: 'text-slate-700 bg-slate-100' },
  { title: 'Jumeirah', subtitle: 'Casual lunches, garden venues, and cafes', icon: Sparkles, tone: 'text-brand-purple bg-brand-purple/10' },
]
const desktopTypeSuggestions = [
  { label: 'Events', value: 'Events', icon: CalendarDays },
  { label: 'Experiences', value: 'Experiences', icon: Sparkles },
  { label: 'Venues', value: 'Venues', icon: MapPin },
  { label: 'Brunch', value: 'Brunch', icon: Utensils },
  { label: 'Nightlife', value: 'Nightlife', icon: Sparkles },
]
const calendarWeekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const brandLogoFilter = {
  filter: 'brightness(0) saturate(100%) invert(59%) sepia(19%) saturate(761%) hue-rotate(238deg) brightness(88%) contrast(87%)',
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

const getDesktopSearchSegments = (mode, searchTerm) => {
  const searchValue = searchTerm?.trim()

  if (mode === 'condensed') {
    return [
      { id: 'where', label: 'Anywhere', value: searchValue || 'Anywhere', panel: 'where' },
      { id: 'when', label: 'Anytime', value: 'Anytime', panel: 'when' },
      { id: 'guests', label: 'Add guests', value: 'Add guests', panel: 'guests' },
    ]
  }

  if (mode === 'venues') {
    return [
      { id: 'where', label: 'Where', value: searchValue || 'Search locations', panel: 'where' },
      { id: 'type', label: 'Venue type', value: 'Add venue type', panel: 'type' },
      { id: 'guests', label: 'Occasion', value: 'Add occasion', panel: 'guests' },
    ]
  }

  if (mode === 'experiences') {
    return [
      { id: 'where', label: 'Where', value: searchValue || 'Search destinations', panel: 'where' },
      { id: 'when', label: 'When', value: 'Add dates', panel: 'when' },
      { id: 'type', label: 'Experience type', value: 'Add experience', panel: 'type' },
    ]
  }

  if (mode === 'home') {
    return [
      { id: 'where', label: 'Where', value: searchValue || 'Search destinations', panel: 'where' },
      { id: 'when', label: 'When', value: 'Add dates', panel: 'when' },
      { id: 'type', label: 'Type', value: 'Events, experiences, venues', panel: 'type' },
    ]
  }

  return [
    { id: 'where', label: 'Where', value: searchValue || 'Search destinations', panel: 'where' },
    { id: 'when', label: 'When', value: 'Add dates', panel: 'when' },
    { id: 'type', label: 'Type of event', value: 'Add category', panel: 'type' },
  ]
}

const buildCalendarDays = (year, monthIndex) => {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const mondayOffset = (firstDay + 6) % 7

  return [
    ...Array.from({ length: mondayOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
}

function SearchField({ icon: Icon, placeholder, value, onChange }) {
  return (
    <label className="flex h-12 w-full items-center gap-3 rounded-full bg-white px-4 text-gray-500 shadow-[0_2px_12px_rgba(15,23,42,0.12)] ring-1 ring-black/5">
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

function DesktopWherePanel({ onSelect }) {
  return (
    <div className="w-[520px] max-w-[calc(100vw-48px)] rounded-[28px] bg-white p-7 shadow-[0_18px_54px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06]">
      <p className="mb-4 text-sm font-semibold text-gray-950">Suggested destinations</p>
      <div className="max-h-[520px] space-y-4 overflow-y-auto pr-2">
        {desktopDestinationSuggestions.map((item) => {
          const Icon = item.icon

          return (
            <button key={item.title} type="button" onClick={() => onSelect(item.title === 'Nearby' ? 'Dubai' : item.title)} className="flex w-full items-center gap-4 rounded-2xl text-left transition-colors hover:bg-gray-50">
              <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                <Icon className="h-8 w-8" strokeWidth={1.65} />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-extrabold leading-tight text-gray-950">{item.title}</span>
                <span className="mt-1 block truncate text-base font-medium text-gray-500">{item.subtitle}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MonthCalendar({ year, monthIndex, onSelect }) {
  const days = buildCalendarDays(year, monthIndex)
  const monthName = new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="min-w-0 flex-1">
      <h3 className="mb-6 text-center text-xl font-extrabold text-gray-950">{monthName}</h3>
      <div className="mb-4 grid grid-cols-7 text-center text-sm font-extrabold text-gray-500">
        {calendarWeekdays.map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-y-3 text-center">
        {days.map((day, index) => (
          <button
            key={`${monthIndex}-${index}`}
            type="button"
            disabled={!day}
            onClick={() => day && onSelect(`${monthName.split(' ')[0]} ${day}, ${year}`)}
            className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-base font-bold ${day ? 'text-gray-950 hover:bg-gray-100' : 'cursor-default text-transparent'}`}
          >
            {day || 0}
          </button>
        ))}
      </div>
    </div>
  )
}

function DesktopDatePanel({ onSelect }) {
  return (
    <div className="w-[920px] max-w-[calc(100vw-48px)] rounded-[30px] bg-white p-8 shadow-[0_18px_54px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06]">
      <div className="mx-auto mb-8 flex h-12 w-[360px] rounded-full bg-gray-100 p-1">
        <button type="button" className="flex-1 rounded-full bg-white text-sm font-extrabold text-gray-950 shadow-sm">Dates</button>
        <button type="button" className="flex-1 rounded-full text-sm font-extrabold text-gray-700">Flexible</button>
      </div>
      <div className="flex items-start gap-8">
        <button type="button" aria-label="Previous month" className="mt-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-300">
          <ChevronLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <MonthCalendar year={2026} monthIndex={5} onSelect={onSelect} />
        <MonthCalendar year={2026} monthIndex={6} onSelect={onSelect} />
        <button type="button" aria-label="Next month" className="mt-20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-950 hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {['Exact dates', '+ 1 day', '+ 2 days', '+ 3 days', '+ 7 days', '+ 14 days'].map((option) => (
          <button key={option} type="button" onClick={() => onSelect(option)} className={`rounded-full px-5 py-3 text-sm font-bold ring-1 ${option === 'Exact dates' ? 'ring-gray-950 text-gray-950' : 'ring-gray-200 text-gray-700'}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function DesktopTypePanel({ mode, onSelect }) {
  const options = mode === 'venues'
    ? desktopTypeSuggestions.filter((item) => ['Venues', 'Brunch', 'Nightlife'].includes(item.value))
    : desktopTypeSuggestions

  return (
    <div className="w-[430px] max-w-[calc(100vw-48px)] rounded-[28px] bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06]">
      <p className="mb-4 text-sm font-semibold text-gray-950">{mode === 'venues' ? 'Choose a venue type' : 'Choose a category'}</p>
      <div className="grid gap-3">
        {options.map((item) => {
          const Icon = item.icon

          return (
            <button key={item.value} type="button" onClick={() => onSelect(item.value)} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-sm transition-colors hover:bg-gray-50">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="text-sm font-extrabold text-gray-950">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DesktopGuestsPanel({ guests, onChange, onApply }) {
  return (
    <div className="w-[390px] max-w-[calc(100vw-48px)] rounded-[28px] bg-white p-6 shadow-[0_18px_54px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06]">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-base font-extrabold text-gray-950">Guests</p>
          <p className="mt-1 text-sm font-medium text-gray-500">Add the expected party size</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => onChange(Math.max(0, guests - 1))} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 disabled:opacity-40" disabled={guests === 0}>
            <Minus className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="w-6 text-center text-base font-extrabold text-gray-950">{guests}</span>
          <button type="button" onClick={() => onChange(guests + 1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-900">
            <Plus className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      <button type="button" onClick={() => onApply(guests)} className="mt-6 h-11 w-full rounded-full bg-brand-purple text-sm font-extrabold text-white shadow-[0_4px_12px_rgba(171,131,187,0.28)]">
        Apply
      </button>
    </div>
  )
}

export function SttDesktopSearchBar({ mode = 'events', searchTerm = '', onApplySearch, onOpenSearch, compact = false, className = '' }) {
  const segments = getDesktopSearchSegments(mode, searchTerm)
  const [activePanel, setActivePanel] = useState(null)
  const [guests, setGuests] = useState(0)
  const searchRef = useRef(null)
  const isCondensed = compact || mode === 'condensed'

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!searchRef.current?.contains(event.target)) setActivePanel(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const applyDesktopSearch = (payload = {}) => {
    onApplySearch?.(payload)
    setActivePanel(null)
  }

  if (onOpenSearch) {
    const label = searchTerm?.trim() || (mode === 'venues' ? 'Search venues or locations' : 'Search venues, events, experiences')

    return (
      <button
        type="button"
        onClick={onOpenSearch}
        className={`relative mx-auto flex items-center rounded-full bg-white p-2 text-left shadow-[0_6px_24px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.08] transition hover:shadow-[0_8px_28px_rgba(15,23,42,0.14)] ${isCondensed ? 'h-[52px] w-[520px] max-w-full' : 'mt-7 h-[60px] w-full max-w-[680px]'} ${className}`}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50 text-gray-600">
          <Search className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <span className="ml-3 min-w-0 flex-1 truncate text-sm font-semibold text-gray-700">{label}</span>
        <span className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-purple text-white shadow-[0_4px_12px_rgba(171,131,187,0.34)]">
          <Search className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </button>
    )
  }

  return (
    <form
      ref={searchRef}
      onSubmit={(event) => {
        event.preventDefault()
        if (activePanel) {
          applyDesktopSearch()
        } else {
          setActivePanel('where')
        }
      }}
      className={`relative mx-auto flex items-center rounded-full bg-white p-2 shadow-[0_6px_24px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.08] ${isCondensed ? 'h-[52px] w-[520px] max-w-full' : 'mt-7 h-[64px] max-w-[900px]'} ${className}`}
    >
      {segments.map((segment, index) => (
        <div key={segment.label} className="flex min-w-0 flex-1 items-center">
          <button
            type="button"
            onClick={() => setActivePanel((current) => (current === segment.panel ? null : segment.panel))}
            className={`flex min-w-0 flex-1 justify-center rounded-full px-5 text-left transition-all ${isCondensed ? 'h-10 flex-row items-center gap-2' : 'h-12 flex-col'} ${activePanel === segment.panel ? 'bg-white shadow-[0_3px_16px_rgba(15,23,42,0.13)]' : 'hover:bg-gray-50'}`}
          >
            {isCondensed && index === 0 && <Building2 className="h-5 w-5 shrink-0 text-brand-purple" strokeWidth={1.8} />}
            <span className={`${isCondensed ? 'truncate text-sm font-extrabold text-gray-950' : 'text-[11px] font-extrabold leading-none text-gray-950'}`}>{isCondensed ? segment.value : segment.label}</span>
            {!isCondensed && (
              <span className={`mt-1 truncate text-sm leading-none ${index === 0 && searchTerm ? 'font-semibold text-gray-950' : 'font-medium text-gray-500'}`}>
                {segment.value}
              </span>
            )}
          </button>
          {index < segments.length - 1 && <span className="h-8 w-px shrink-0 bg-gray-200" />}
        </div>
      ))}
      <button type="submit" aria-label="Search" className={`ml-1 flex shrink-0 items-center justify-center rounded-full bg-brand-purple text-white shadow-[0_4px_12px_rgba(171,131,187,0.34)] transition-transform hover:scale-[1.02] ${isCondensed ? 'h-10 w-10' : 'h-12 w-12'}`}>
        <Search className={isCondensed ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2.2} />
      </button>

      {activePanel && (
        <div className={`absolute z-[75] animate-in fade-in slide-in-from-top-2 duration-200 ${isCondensed ? 'left-1/2 top-[64px] -translate-x-1/2' : activePanel === 'where' ? 'left-0 top-[76px]' : activePanel === 'when' ? 'left-1/2 top-[76px] -translate-x-1/2' : 'right-0 top-[76px]'}`}>
          {activePanel === 'where' && <DesktopWherePanel onSelect={(location) => applyDesktopSearch({ location, keyword: location })} />}
          {activePanel === 'when' && <DesktopDatePanel onSelect={(dateTime) => applyDesktopSearch({ dateTime, keyword: dateTime })} />}
          {activePanel === 'type' && <DesktopTypePanel mode={mode} onSelect={(category) => applyDesktopSearch({ category, keyword: category })} />}
          {activePanel === 'guests' && <DesktopGuestsPanel guests={guests} onChange={setGuests} onApply={(guestCount) => applyDesktopSearch({ guests: guestCount, keyword: guestCount ? `${guestCount} guests` : '' })} />}
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

export function SttSearchOverlay({ open, mode = 'events', initialKeyword = '', onClose, onApplySearch }) {
  const [keyword, setKeyword] = useState(initialKeyword)
  const [location, setLocation] = useState('')
  const [dateTime, setDateTime] = useState('')
  const isVenuesMode = mode === 'venues'
  const categoryTiles = isVenuesMode ? venueCategoryTiles : eventCategoryTiles

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
      <div className="min-h-full w-full max-w-full overflow-x-hidden bg-white px-7 pb-10 pt-16 md:mx-auto md:min-h-0 md:max-w-[440px] md:rounded-[28px] md:px-8 md:shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-950">Search</h2>
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
          <SearchField icon={Search} placeholder={isVenuesMode ? 'Any venues or locations' : 'Any venues, experiences or events'} value={keyword} onChange={setKeyword} />
          <SearchField icon={MapPin} placeholder="Location" value={location} onChange={setLocation} />
          {!isVenuesMode && <SearchField icon={Clock} placeholder="Date & Time" value={dateTime} onChange={setDateTime} />}
          <button type="submit" className="mt-2 h-11 w-full rounded-full bg-brand-purple text-sm font-extrabold text-white shadow-[0_4px_14px_rgba(15,23,42,0.14)]">
            Search
          </button>
        </form>

        <section className="mt-8">
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

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-gray-950">Suggested Locations</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestedLocations.map((item) => (
              <button key={item} type="button" onClick={() => applySearch({ location: item })} className="rounded-full border border-brand-purple/15 bg-brand-purple/5 px-3 py-2 text-xs font-bold text-gray-800 shadow-sm">
                {item}
              </button>
            ))}
          </div>
        </section>

        {!isVenuesMode && (
          <section className="mt-8">
            <h3 className="text-xl font-extrabold text-gray-950">Date & Time</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {dateTimeOptions.map((item) => (
                <button key={item} type="button" onClick={() => setDateTime(item)} className={`rounded-full px-3 py-2 text-xs font-bold shadow-sm ${dateTime === item ? 'bg-brand-purple text-white' : 'border border-gray-200 bg-white text-gray-700'}`}>
                  {item}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h3 className="text-xl font-extrabold text-gray-950">{isVenuesMode ? 'Venue Categories' : 'Top Categories'}</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {categoryTiles.map((tile) => {
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

export function SttPageHeader({ mode = 'events', searchTerm = '', onApplySearch }) {
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
    <section className="mx-auto w-full max-w-[100vw] px-5 pt-5 md:max-w-6xl md:px-8 md:pt-7">
      <SttSearchOverlay open={searchOpen} mode={mode} initialKeyword={searchTerm} onClose={closeSearch} onApplySearch={handleApplySearch} />

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

        <SttDesktopSearchBar mode={mode} searchTerm={searchTerm} onApplySearch={handleApplySearch} onOpenSearch={() => setSearchOpen(true)} />
      </div>
    </section>
  )
}

export function SttSectionHeader({ title, actionTo }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-[20px] font-extrabold tracking-tight text-gray-950 md:text-[22px]">{title}</h2>
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
    <Link to={`/events/${event.id}`} className="block min-w-0">
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
            <h3 className="line-clamp-2 min-h-[32px] text-[12px] font-semibold leading-tight text-gray-950 md:min-h-[38px] md:text-[13px]">{event.title}</h3>
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

export function SttVenueTile({ venue, badge = 'Featured' }) {
  const categoryLabel = venue.category || venue.type || 'Venue'

  return (
    <Link to={`/venues/${venue.id}`} className="block min-w-0">
      <article className="group">
        <div className="relative aspect-[1.22] overflow-hidden rounded-[14px] bg-gray-100 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04] transition-shadow group-hover:shadow-[0_5px_18px_rgba(15,23,42,0.10)]">
          <img src={venue.image} alt={venue.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <span className="absolute left-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] font-semibold leading-none text-gray-950 shadow-sm">{badge}</span>
          <button type="button" aria-label="Save venue" className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/25 text-white shadow-sm backdrop-blur-md">
            <Heart className="h-4 w-4 text-white" strokeWidth={2} />
          </button>
        </div>
        <div className="flex min-h-[82px] flex-col pt-2">
          <h3 className="line-clamp-2 min-h-[30px] text-[12px] font-semibold leading-tight text-gray-950 md:min-h-[34px] md:text-[13px]">{venue.name}</h3>
          <div className="mt-1.5 flex min-h-[18px] items-center gap-1 truncate text-[9px] text-gray-500 md:text-xs">
            <MapPin className="h-3 w-3 shrink-0 text-gray-400" strokeWidth={1.8} />
            <span className="truncate">{venue.location || venue.address}</span>
          </div>
          <div className="mt-auto flex pt-2">
            <span className={`w-fit rounded-full px-2 py-1 text-[8px] font-semibold uppercase leading-none ring-1 md:text-[9px] ${getCategoryPillClassName(categoryLabel)}`}>{categoryLabel}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
