import { useEffect, useState } from 'react'
import { Filter, MapPin, Calendar, Grid, List, Building2, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Card, CardContent } from '../shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../shared/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select'
import EventCard from '../features/events/components/EventCard'
import DiscoverySearchHero from '../features/explore/components/DiscoverySearchHero'
import VenueCard from '../features/venues/components/VenueCard'
import { useSearchParams } from 'react-router-dom'
import { useExploreCatalog } from '../features/catalog'

const defaultFilters = { location: '', servicePeriod: 'all', environmentType: 'all', rating: 'all', familyFriendly: 'all', animalFriendly: 'all' }

function ExploreFilters({ filters, updateFilter, clearFilters, activeResultsLength }) {
  const fieldClassName = 'rounded-2xl border-gray-200'
  const renderSelect = (label, value, options, key) => <div className="space-y-3"><label className="block text-sm font-semibold text-gray-700">{label}</label><Select value={value} onValueChange={(nextValue) => updateFilter(key, nextValue)}><SelectTrigger className={fieldClassName}><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent></Select></div>
  return <Card className="mb-8 border-0 shadow-lg rounded-3xl overflow-hidden"><CardContent className="p-8"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-gray-900 flex items-center"><SlidersHorizontal className="w-5 h-5 mr-3" />Refine Your Search</h3><Button variant="ghost" onClick={clearFilters} className="rounded-2xl">Clear All</Button></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">{renderSelect('Service', filters.servicePeriod, [{ value: 'all', label: 'All' }, { value: 'day', label: 'Day' }, { value: 'night', label: 'Night' }], 'servicePeriod')}{renderSelect('Environment', filters.environmentType, [{ value: 'all', label: 'All' }, { value: 'indoor', label: 'Indoor' }, { value: 'outdoor', label: 'Outdoor' }], 'environmentType')}{renderSelect('Rating', filters.rating, [{ value: 'all', label: 'All' }, { value: '4', label: '4+ Stars' }, { value: '4.5', label: '4.5+ Stars' }], 'rating')}{renderSelect('Family Friendly', filters.familyFriendly, [{ value: 'all', label: 'All' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], 'familyFriendly')}{renderSelect('Animal Friendly', filters.animalFriendly, [{ value: 'all', label: 'All' }, { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }], 'animalFriendly')}</div><div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200"><p className="text-gray-600 flex items-center"><Sparkles className="w-4 h-4 mr-2 text-purple-600" /><span className="font-semibold text-purple-600">{activeResultsLength}</span><span className="ml-1">results found</span></p><Button variant="outline" onClick={clearFilters} className="rounded-2xl">Reset</Button></div></CardContent></Card>
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'all')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [filters, setFilters] = useState({ ...defaultFilters, location: searchParams.get('location') || '' })
  const { data: results = { events: [], venues: [], total: 0 }, loading, error, retry } = useExploreCatalog(searchTerm, filters)

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '')
    setActiveTab(searchParams.get('tab') || 'all')
    setFilters((current) => ({ ...current, location: searchParams.get('location') || '' }))
  }, [searchParams])

  const syncParams = (nextFilters = filters, nextTab = activeTab, nextSearchTerm = searchTerm) => {
    const params = new URLSearchParams()
    if (nextSearchTerm) params.set('q', nextSearchTerm)
    if (nextTab) params.set('tab', nextTab)
    if (nextFilters.location) params.set('location', nextFilters.location)
    setSearchParams(params)
    setFilters(nextFilters)
  }

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value }
    syncParams(next, activeTab, searchTerm)
  }

  const clearFilters = () => syncParams(defaultFilters, activeTab, searchTerm)
  const activeResults = activeTab === 'events' ? results.events : activeTab === 'venues' ? results.venues : [...results.events, ...results.venues]
  const renderItem = (item) => item.title ? <EventCard key={`event-${item.id}`} event={item} viewMode={viewMode} /> : <VenueCard key={`venue-${item.id}`} venue={item} viewMode={viewMode} />

  return <div className="min-h-screen bg-white"><DiscoverySearchHero backgroundImage="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1920&h=1080&fit=crop" backgroundAlt="Dubai Experience" title="Explore Dubai" description="Discover events and venues" searchPlaceholder="Search experiences..." searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => syncParams(filters, activeTab, searchTerm)} onSearchKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); syncParams(filters, activeTab, searchTerm) } }} searchButtonClassName="rounded-full px-4 sm:px-8 h-10 sm:h-12 text-sm sm:text-base font-semibold bg-emerald-600 text-white shadow-lg shrink-0 ml-2 hover:bg-emerald-700 transition-colors" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-8 sm:py-12"><Card className="mb-8 border-0 shadow-lg rounded-3xl overflow-hidden"><CardContent className="p-4 sm:p-8"><div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"><Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); syncParams(filters, value, searchTerm) }} className="w-full lg:w-auto overflow-hidden"><TabsList className="flex w-full overflow-x-auto no-scrollbar lg:w-auto bg-gray-100 rounded-2xl p-1 gap-1"><TabsTrigger value="all" className="flex-1 lg:flex-none rounded-xl"><Sparkles className="w-4 h-4 mr-2" />All ({results.total})</TabsTrigger><TabsTrigger value="events" className="flex-1 lg:flex-none rounded-xl"><Calendar className="w-4 h-4 mr-2" />Events ({results.events.length})</TabsTrigger><TabsTrigger value="venues" className="flex-1 lg:flex-none rounded-xl"><Building2 className="w-4 h-4 mr-2" />Venues ({results.venues.length})</TabsTrigger></TabsList></Tabs><div className="flex items-center justify-between w-full lg:w-auto gap-4"><Button variant={showFilters ? 'default' : 'outline'} onClick={() => setShowFilters((value) => !value)} className="flex-1 lg:flex-none rounded-2xl px-6"><Filter className="w-4 h-4 mr-2" />Filters</Button><Button variant={showMap ? 'default' : 'outline'} onClick={() => setShowMap((value) => !value)} className="flex-1 lg:flex-none rounded-2xl px-6"><MapPin className="w-4 h-4 mr-2" />Map View</Button><div className="flex bg-gray-100 rounded-2xl p-1 shrink-0"><Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('grid')} className="rounded-xl"><Grid className="w-4 h-4" /></Button><Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-xl"><List className="w-4 h-4" /></Button></div></div></div></CardContent></Card>
      {filters.location && <div className="mb-6 flex items-center justify-between rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-900"><div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>Filtered by location: <span className="font-semibold">{filters.location}</span></span></div><Button variant="ghost" className="rounded-2xl" onClick={() => updateFilter('location', '')}>Clear location</Button></div>}
      {showFilters && <ExploreFilters filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} activeResultsLength={activeResults.length} />}
      {showMap && <Card className="mb-8 border-0 shadow-lg rounded-3xl overflow-hidden"><CardContent className="p-0"><div className="relative"><img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&h=500&fit=crop" alt="Map preview" className="w-full h-64 object-cover" /><div className="absolute inset-0 bg-black/20 flex items-center justify-center"><div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-gray-700">Interactive map preview (demo)</div></div></div></CardContent></Card>}
      {loading && <Card><CardContent className="py-16 text-center text-gray-600">Loading live catalog...</CardContent></Card>}
      {error && !loading && <Card><CardContent className="py-16 text-center"><p className="text-gray-600 mb-4">{error.message}</p><Button onClick={retry}>Try again</Button></CardContent></Card>}
      {!loading && !error && <Tabs value={activeTab} className="w-full">{['all', 'events', 'venues'].map((tab) => <TabsContent key={tab} value={tab} className="mt-0">{activeResults.length === 0 ? <Card className="text-center py-16"><CardContent><div className="text-6xl mb-4">🔍</div><h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3><p className="text-gray-600 mb-6">Try adjusting your search or filters</p><Button onClick={clearFilters}>Clear Filters</Button></CardContent></Card> : <div className={`grid gap-6 ${viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>{activeResults.map(renderItem)}</div>}</TabsContent>)}</Tabs>}
    </div></div>
}
