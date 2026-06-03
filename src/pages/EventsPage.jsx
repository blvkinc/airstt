import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, SlidersHorizontal } from 'lucide-react'
import { useEventCategoriesCatalog, useEventsCatalog } from '../features/catalog'
import { matchesSelectedEventCategory, normalizeSelectedEventCategory } from '../features/catalog/utils/eventCategorySelection'
import { SttEventTile, SttPageHeader, SttRail, SttRailItem } from '../components/SttDiscovery'

const getCategoryLabel = (category) => category?.displayName || category?.name || category?.label || String(category || '')

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

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { data: events = [], loading, error, retry } = useEventsCatalog(searchTerm)
  const { data: eventCategories = [] } = useEventCategoriesCatalog()

  const filteredEvents = useMemo(() => events.filter((event) => matchesSelectedEventCategory(event, selectedCategory, {
    primaryText: event.category,
    fallbackText: [event.title, event.location, event.venue, ...(event.tags || [])],
  })), [events, selectedCategory])

  const brunchEvents = useMemo(() => filteredEvents.filter((event) => eventMatchesTerms(event, ['brunch', 'day', 'lunch'])), [filteredEvents])
  const nightlifeEvents = useMemo(() => filteredEvents.filter((event) => eventMatchesTerms(event, ['night', 'evening', 'party', 'dj'])), [filteredEvents])
  const poolEvents = useMemo(() => filteredEvents.filter((event) => eventMatchesTerms(event, ['pool', 'beach', 'club'])), [filteredEvents])
  const hasActiveFilter = Boolean(searchTerm || selectedCategory)
  const headerRecentSearches = useMemo(() => uniqueText([
    ...events.map((event) => event.title),
    ...events.map((event) => event.venue),
  ], 3), [events])
  const headerSuggestedLocations = useMemo(() => uniqueText(events.map((event) => event.venueDetails?.area || event.location || event.venue), 4), [events])
  const headerCategoryTiles = useMemo(() => eventCategories
    .map(getCategoryLabel)
    .filter(Boolean)
    .slice(0, 4)
    .map((label) => ({ label, tab: 'events', icon: CalendarDays })), [eventCategories])

  const renderEventRail = (items, badge = 'Featured') => items.map((event) => (
    <SttRailItem key={event.id}>
      <SttEventTile event={event} badge={badge} />
    </SttRailItem>
  ))

  const handleApplySearch = ({ keyword = '', location = '', category = '' } = {}) => {
    const nextTerm = (keyword || category || location || '').trim()
    setSearchTerm(nextTerm)

    if (category) {
      const match = eventCategories.find((item) => getCategoryLabel(item).toLowerCase() === category.toLowerCase())
      setSelectedCategory(match ? normalizeSelectedEventCategory(match) : null)
    }
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory((current) => current?.id === category.id ? null : normalizeSelectedEventCategory(category))
  }

  return (
    <div className="min-h-screen bg-white pb-20 text-gray-950 md:pb-0">
      <SttPageHeader
        mode="events"
        searchTerm={searchTerm}
        recentSearches={headerRecentSearches}
        suggestedLocations={headerSuggestedLocations}
        categoryTiles={headerCategoryTiles}
        onApplySearch={handleApplySearch}
      />

      <main className="mx-auto mt-8 w-full max-w-6xl px-5 md:mt-11 md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand-purple">Events</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">Featured Events</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Brunches, nightlife, day parties, and hosted moments across Dubai.
            </p>
          </div>
          <Link to="/?search=open" className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-extrabold text-gray-700 shadow-sm">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
            Advanced Filters
          </Link>
        </div>

        {eventCategories.length > 0 && (
          <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
            {eventCategories.map((category) => {
              const isSelected = selectedCategory?.id === category.id

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold shadow-sm ring-1 transition-colors ${isSelected ? 'bg-brand-purple text-white ring-brand-purple' : 'bg-white text-gray-700 ring-gray-200 hover:text-brand-purple'}`}
                >
                  {getCategoryLabel(category)}
                </button>
              )
            })}
          </div>
        )}

        {loading && <div className="rounded-[18px] bg-gray-50 p-10 text-center text-sm font-semibold text-gray-500 ring-1 ring-black/5">Loading event catalog...</div>}
        {error && !loading && (
          <div className="rounded-[18px] bg-gray-50 p-10 text-center ring-1 ring-black/5">
            <h2 className="text-xl font-extrabold text-gray-950">Couldn't load events</h2>
            <p className="mt-2 text-sm text-gray-500">{error.message}</p>
            <button type="button" onClick={retry} className="mt-5 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Try again</button>
          </div>
        )}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="space-y-10">
            <SttRail title={hasActiveFilter ? 'Search Results' : 'Events in Dubai'} actionTo="/events">
              {renderEventRail(filteredEvents, hasActiveFilter ? 'Match' : 'Featured')}
            </SttRail>

            {!hasActiveFilter && brunchEvents.length > 0 && (
              <SttRail title="Brunches This Week" actionTo="/events">
                {renderEventRail(brunchEvents, 'Brunch')}
              </SttRail>
            )}

            {!hasActiveFilter && nightlifeEvents.length > 0 && (
              <SttRail title="Nightlife Events" actionTo="/events">
                {renderEventRail(nightlifeEvents, 'Night')}
              </SttRail>
            )}

            {!hasActiveFilter && poolEvents.length > 0 && (
              <SttRail title="Pool and Beach Events" actionTo="/events">
                {renderEventRail(poolEvents, 'Popular')}
              </SttRail>
            )}
          </div>
        )}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="rounded-[18px] bg-gray-50 p-10 text-center ring-1 ring-black/5">
            <h2 className="text-xl font-extrabold text-gray-950">No events found</h2>
            <p className="mt-2 text-sm text-gray-500">Try a different keyword, location, or category.</p>
            <button type="button" onClick={() => { setSearchTerm(''); setSelectedCategory(null) }} className="mt-5 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Clear Filters</button>
          </div>
        )}
      </main>
    </div>
  )
}

export default EventsPage
