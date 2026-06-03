import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { CalendarDays, Filter, MapPin, SlidersHorizontal, Sparkles } from 'lucide-react'
import { useExploreCatalog } from '../features/catalog'
import { SttEventTile, SttPageHeader, SttRail, SttRailItem, SttVenueTile } from '../components/SttDiscovery'

const defaultFilters = {
  location: '',
  servicePeriod: 'all',
  environmentType: 'all',
  rating: 'all',
  familyFriendly: 'all',
  animalFriendly: 'all',
}

const filterGroups = [
  { key: 'servicePeriod', label: 'Service', options: ['all', 'day', 'night'] },
  { key: 'environmentType', label: 'Setting', options: ['all', 'indoor', 'outdoor'] },
  { key: 'rating', label: 'Rating', options: ['all', '4', '4.5'] },
]

const formatOption = (value) => {
  if (value === 'all') return 'All'
  if (value === '4') return '4+'
  if (value === '4.5') return '4.5+'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const eventMatchesTerms = (event, terms) => {
  const text = [
    event.title,
    event.category,
    event.type,
    event.location,
    event.venue,
    event.dayPeriod,
    ...(event.tags || []),
  ].join(' ').toLowerCase()

  return terms.some((term) => text.includes(term))
}

export default function ExplorePage() {
  const location = useLocation()
  const isExperiencesPage = location.pathname === '/experiences'
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState(isExperiencesPage ? 'events' : searchParams.get('tab') || 'all')
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [filters, setFilters] = useState({ ...defaultFilters, location: searchParams.get('location') || '' })
  const { data: results = { events: [], venues: [], total: 0 }, loading, error, retry } = useExploreCatalog(searchTerm, filters)

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
    setActiveTab(isExperiencesPage ? 'events' : searchParams.get('tab') || 'all')
    setFilters((current) => ({ ...current, location: searchParams.get('location') || '' }))
  }, [isExperiencesPage, searchParams])

  const syncParams = (nextFilters = filters, nextTab = activeTab, nextSearchTerm = searchTerm) => {
    const params = new URLSearchParams()
    if (nextSearchTerm) params.set('q', nextSearchTerm)
    if (!isExperiencesPage && nextTab) params.set('tab', nextTab)
    if (nextFilters.location) params.set('location', nextFilters.location)
    setSearchParams(params)
    setFilters(nextFilters)
    setActiveTab(isExperiencesPage ? 'events' : nextTab)
  }

  const handleApplySearch = ({ keyword = '', location: selectedLocation = '', category = '' } = {}) => {
    const nextTerm = (keyword || category || selectedLocation || '').trim()
    const nextFilters = { ...filters, location: selectedLocation || filters.location }
    setSearchTerm(nextTerm)
    syncParams(nextFilters, 'events', nextTerm)
  }

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value }
    syncParams(next, activeTab, searchTerm)
  }

  const clearFilters = () => syncParams(defaultFilters, activeTab, searchTerm)

  const activeResults = useMemo(() => {
    if (isExperiencesPage || activeTab === 'events') return results.events
    if (activeTab === 'venues') return results.venues
    return [...results.events, ...results.venues]
  }, [activeTab, isExperiencesPage, results.events, results.venues])

  const brunchExperiences = useMemo(() => results.events.filter((event) => eventMatchesTerms(event, ['brunch', 'day', 'lunch'])), [results.events])
  const nightExperiences = useMemo(() => results.events.filter((event) => eventMatchesTerms(event, ['night', 'evening', 'party', 'dj'])), [results.events])

  const renderEventRail = (items, badge = 'Featured') => items.map((event) => (
    <SttRailItem key={`event-${event.id}`}>
      <SttEventTile event={event} badge={badge} />
    </SttRailItem>
  ))

  const renderVenueRail = (items, badge = 'Featured') => items.map((venue) => (
    <SttRailItem key={`venue-${venue.id}`} variant="venue">
      <SttVenueTile venue={venue} badge={badge} />
    </SttRailItem>
  ))

  return (
    <div className="min-h-screen bg-white pb-20 text-gray-950 md:pb-0">
      <SttPageHeader mode="experiences" searchTerm={searchTerm} onApplySearch={handleApplySearch} />

      <main className="mx-auto mt-8 w-full max-w-6xl px-5 md:mt-11 md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand-purple">{isExperiencesPage ? 'Experiences' : 'Search'}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
              {isExperiencesPage ? 'Featured Experiences' : 'Explore Dubai'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Hosted things to do, social tables, and curated escapes around the city.
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowFilters((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-extrabold text-gray-700 shadow-sm">
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
              Filters
            </button>
            <button type="button" onClick={() => setShowMap((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-extrabold text-gray-700 shadow-sm">
              <MapPin className="h-4 w-4" strokeWidth={1.8} />
              Map
            </button>
          </div>
        </div>

        {!isExperiencesPage && (
          <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: `All (${results.total})`, icon: Sparkles },
              { id: 'events', label: `Events (${results.events.length})`, icon: CalendarDays },
              { id: 'venues', label: `Venues (${results.venues.length})`, icon: MapPin },
            ].map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button key={item.id} type="button" onClick={() => syncParams(filters, item.id, searchTerm)} className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold shadow-sm ring-1 ${isActive ? 'bg-brand-purple text-white ring-brand-purple' : 'bg-white text-gray-700 ring-gray-200'}`}>
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                  {item.label}
                </button>
              )
            })}
          </div>
        )}

        {showFilters && (
          <div className="mb-6 rounded-[18px] bg-white p-4 shadow-[0_2px_14px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.05] md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-950">
                <Filter className="h-4 w-4" strokeWidth={1.8} />
                Refine Search
              </h2>
              <button type="button" onClick={clearFilters} className="text-xs font-extrabold text-brand-purple">Clear all</button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {filterGroups.map((group) => (
                <div key={group.key}>
                  <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gray-400">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isSelected = filters[group.key] === option

                      return (
                        <button key={option} type="button" onClick={() => updateFilter(group.key, option)} className={`rounded-full px-3 py-2 text-xs font-extrabold ring-1 ${isSelected ? 'bg-brand-purple text-white ring-brand-purple' : 'bg-white text-gray-700 ring-gray-200'}`}>
                          {formatOption(option)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showMap && (
          <div className="mb-6 overflow-hidden rounded-[18px] bg-gray-100 shadow-[0_2px_14px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.05]">
            <div className="flex h-56 items-center justify-center bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&h=600&fit=crop')] bg-cover bg-center">
              <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold text-gray-700 shadow-sm backdrop-blur-md">
                Map view: select Events, Experiences, or Venues from the page links above
              </div>
            </div>
          </div>
        )}

        {loading && <div className="rounded-[18px] bg-gray-50 p-10 text-center text-sm font-semibold text-gray-500 ring-1 ring-black/5">Loading catalog...</div>}
        {error && !loading && (
          <div className="rounded-[18px] bg-gray-50 p-10 text-center ring-1 ring-black/5">
            <p className="text-sm text-gray-500">{error.message}</p>
            <button type="button" onClick={retry} className="mt-5 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Try again</button>
          </div>
        )}
        {!loading && !error && activeResults.length > 0 && (
          <div className="space-y-10">
            {isExperiencesPage && (
              <>
                <SttRail title={searchTerm ? 'Search Results' : 'Experiences in Dubai'} actionTo="/experiences">
                  {renderEventRail(results.events, searchTerm ? 'Match' : 'Featured')}
                </SttRail>
                {!searchTerm && brunchExperiences.length > 0 && (
                  <SttRail title="Food and Brunch Experiences" actionTo="/experiences">
                    {renderEventRail(brunchExperiences, 'Brunch')}
                  </SttRail>
                )}
                {!searchTerm && nightExperiences.length > 0 && (
                  <SttRail title="Evening Experiences" actionTo="/experiences">
                    {renderEventRail(nightExperiences, 'Night')}
                  </SttRail>
                )}
              </>
            )}

            {!isExperiencesPage && activeTab !== 'venues' && results.events.length > 0 && (
              <SttRail title={searchTerm ? 'Event Matches' : 'Events in Dubai'} actionTo="/events">
                {renderEventRail(results.events, searchTerm ? 'Match' : 'Featured')}
              </SttRail>
            )}

            {!isExperiencesPage && activeTab !== 'events' && results.venues.length > 0 && (
              <SttRail title={searchTerm ? 'Venue Matches' : 'Venues in Dubai'} actionTo="/venues">
                {renderVenueRail(results.venues, searchTerm ? 'Match' : 'Featured')}
              </SttRail>
            )}
          </div>
        )}
        {!loading && !error && activeResults.length === 0 && (
          <div className="rounded-[18px] bg-gray-50 p-10 text-center ring-1 ring-black/5">
            <h2 className="text-xl font-extrabold text-gray-950">No results found</h2>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filters.</p>
            <button type="button" onClick={clearFilters} className="mt-5 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Clear Filters</button>
          </div>
        )}
      </main>
    </div>
  )
}
