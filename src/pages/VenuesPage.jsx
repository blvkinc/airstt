import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Building, MapPin, SlidersHorizontal } from 'lucide-react'
import { useVenueTypesCatalog, useVenuesCatalog } from '../features/catalog'
import { topVenueLocations } from '../features/experiences/data'
import { SttPageHeader, SttRail, SttRailItem, SttSectionHeader, SttVenueTile } from '../components/SttDiscovery'

const getVenueTypeLabel = (venueType) => venueType?.displayName || venueType?.name || venueType?.label || String(venueType || '')

const venueMatchesTerms = (venue, terms) => {
  const text = [
    venue.name,
    venue.category,
    venue.type,
    venue.location,
    venue.address,
    venue.area,
    ...(venue.highlights || []),
  ].join(' ').toLowerCase()

  return terms.some((term) => text.includes(term))
}

const VenuesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedVenueTypeIds, setSelectedVenueTypeIds] = useState([])
  const [showTags, setShowTags] = useState(false)
  const { data: venueTypesResponse, loading: venueTypesLoading } = useVenueTypesCatalog()
  const { data: venues = [], loading, error, retry } = useVenuesCatalog(searchTerm, selectedVenueTypeIds)
  const venueTypes = useMemo(() => Array.isArray(venueTypesResponse) ? venueTypesResponse : [], [venueTypesResponse])

  const selectedCategoryLabel = useMemo(() => venueTypes
    .filter((venueType) => selectedVenueTypeIds.includes(venueType.id))
    .map((venueType) => venueType.name)
    .join(', '), [selectedVenueTypeIds, venueTypes])
  const hasActiveFilter = Boolean(searchTerm || selectedVenueTypeIds.length)
  const beachVenues = useMemo(() => venues.filter((venue) => venueMatchesTerms(venue, ['beach', 'pool', 'club'])), [venues])
  const rooftopVenues = useMemo(() => venues.filter((venue) => venueMatchesTerms(venue, ['roof', 'lounge', 'sky'])), [venues])
  const restaurantVenues = useMemo(() => venues.filter((venue) => venueMatchesTerms(venue, ['restaurant', 'dining', 'fine'])), [venues])

  const renderVenueRail = (items, badge = 'Featured') => items.map((venue) => (
    <SttRailItem key={venue.id} variant="venue">
      <SttVenueTile venue={venue} badge={badge} />
    </SttRailItem>
  ))

  const handleCategorySelect = (category) => {
    setSelectedVenueTypeIds((current) => current.includes(category.id)
      ? current.filter((id) => id !== category.id)
      : [...current, category.id])
  }

  const handleApplySearch = ({ keyword = '', location = '', category = '' } = {}) => {
    const nextTerm = (keyword || category || location || '').trim()
    setSearchTerm(nextTerm)

    if (category) {
      const match = venueTypes.find((item) => getVenueTypeLabel(item).toLowerCase() === category.toLowerCase())
      if (match) setSelectedVenueTypeIds([match.id])
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20 text-gray-950 md:pb-0">
      <SttPageHeader mode="venues" searchTerm={searchTerm} onApplySearch={handleApplySearch} />

      <main className="mx-auto mt-8 w-full max-w-6xl px-5 md:mt-11 md:px-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand-purple">Venues</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">Popular Venues</h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">
              Restaurants, beach clubs, rooftops, and private spaces ready for your next plan.
            </p>
          </div>
          <button type="button" onClick={() => setShowTags((value) => !value)} className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-extrabold text-gray-700 shadow-sm">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
            Venue Tags
          </button>
        </div>

        {(showTags || selectedVenueTypeIds.length > 0) && venueTypes.length > 0 && (
          <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-2">
            {venueTypes.map((venueType) => {
              const isSelected = selectedVenueTypeIds.includes(venueType.id)

              return (
                <button
                  key={venueType.id}
                  type="button"
                  onClick={() => handleCategorySelect(venueType)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold shadow-sm ring-1 transition-colors ${isSelected ? 'bg-brand-purple text-white ring-brand-purple' : 'bg-white text-gray-700 ring-gray-200 hover:text-brand-purple'}`}
                >
                  {getVenueTypeLabel(venueType)}
                </button>
              )
            })}
          </div>
        )}

        {selectedCategoryLabel && (
          <div className="mb-6 rounded-[18px] bg-brand-purple/5 px-4 py-3 text-sm font-semibold text-gray-700 ring-1 ring-brand-purple/10">
            Showing venues tagged: <span className="font-extrabold text-brand-purple">{selectedCategoryLabel}</span>
          </div>
        )}

        {(loading || venueTypesLoading) && <div className="rounded-[18px] bg-gray-50 p-10 text-center text-sm font-semibold text-gray-500 ring-1 ring-black/5">Loading demo venue catalog...</div>}
        {error && !loading && !venueTypesLoading && (
          <div className="rounded-[18px] bg-gray-50 p-10 text-center ring-1 ring-black/5">
            <h2 className="text-xl font-extrabold text-gray-950">Couldn't load venues</h2>
            <p className="mt-2 text-sm text-gray-500">{error.message}</p>
            <button type="button" onClick={retry} className="mt-5 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Try again</button>
          </div>
        )}
        {!loading && !venueTypesLoading && !error && venues.length > 0 && (
          <div className="space-y-10">
            <SttRail title={hasActiveFilter ? 'Search Results' : 'Popular Venues in Dubai'} actionTo="/venues">
              {renderVenueRail(venues, hasActiveFilter ? 'Match' : 'Featured')}
            </SttRail>

            {!hasActiveFilter && beachVenues.length > 0 && (
              <SttRail title="Beach Clubs" actionTo="/venues">
                {renderVenueRail(beachVenues, 'Beach')}
              </SttRail>
            )}

            {!hasActiveFilter && rooftopVenues.length > 0 && (
              <SttRail title="Rooftops and Lounges" actionTo="/venues">
                {renderVenueRail(rooftopVenues, 'Rooftop')}
              </SttRail>
            )}

            {!hasActiveFilter && restaurantVenues.length > 0 && (
              <SttRail title="Restaurants and Dining" actionTo="/venues">
                {renderVenueRail(restaurantVenues, 'Dining')}
              </SttRail>
            )}
          </div>
        )}
        {!loading && !venueTypesLoading && !error && venues.length === 0 && (
          <div className="rounded-[18px] bg-gray-50 p-10 text-center ring-1 ring-black/5">
            <h2 className="text-xl font-extrabold text-gray-950">No venues found</h2>
            <p className="mt-2 text-sm text-gray-500">Try a different location or venue category.</p>
            <button type="button" onClick={() => { setSearchTerm(''); setSelectedVenueTypeIds([]) }} className="mt-5 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">Clear Filters</button>
          </div>
        )}

        <section className="mt-12">
          <SttSectionHeader title="Popular Locations" />
          <div className="no-scrollbar -mx-5 flex w-screen max-w-[100vw] snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 pb-4 scroll-px-5 md:mx-0 md:grid md:w-full md:max-w-full md:grid-cols-5 md:gap-5 md:overflow-visible md:px-0 md:pb-0 md:scroll-px-0">
            {topVenueLocations.map((location) => (
              <Link key={location.name} to={`/explore?tab=venues&location=${encodeURIComponent(location.name)}`} className="block w-[154px] shrink-0 snap-start md:w-full md:min-w-0">
                <div className="aspect-[1.22] overflow-hidden rounded-[14px] bg-gray-100 shadow-[0_2px_10px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]">
                  <img src={location.image} alt={location.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex min-h-[82px] flex-col pt-2">
                  <h3 className="text-sm font-semibold text-gray-950">{location.name}</h3>
                  <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" strokeWidth={1.8} />
                    {location.venues} venues
                  </p>
                  <div className="mt-auto flex pt-2">
                    <span className="w-fit rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold uppercase leading-none text-emerald-700 ring-1 ring-emerald-100">Location</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[18px] bg-gray-50 p-5 ring-1 ring-black/[0.04] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-purple">List With STT</p>
              <h2 className="mt-2 text-2xl font-extrabold text-gray-950">Have a venue to list?</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-gray-500">Keep the homepage separate while giving venues their own focused search and tag experience.</p>
            </div>
            <Link to="/venues" className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-purple px-4 py-2 text-xs font-extrabold text-white">
              <Building className="h-4 w-4" strokeWidth={1.8} />
              List a Venue
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export default VenuesPage
