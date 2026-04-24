import {
  exploreEvents as experienceEvents,
  exploreFilterOptions,
  explorePackages as experiencePackages,
  exploreVenues as experienceVenues
} from '../experiences/data'

export const defaultExploreFilters = {
  category: 'all',
  location: 'all',
  priceRange: 'all',
  date: '',
  rating: 'all',
  availability: 'all',
  dayPeriod: 'all',
  cuisine: 'all',
  budget: 'all',
  area: 'all',
  brand: 'all',
  type: 'all',
  offers: 'all',
  birthdayOffers: 'all',
  familyFriendly: 'all',
  animalFriendly: 'all',
  indoorOutdoor: 'all'
}

export const exploreOptions = exploreFilterOptions

export function buildInitialExploreFilters(searchParams) {
  return Object.fromEntries(Object.keys(defaultExploreFilters).map((key) => [key, searchParams.get(key) || defaultExploreFilters[key]]))
}

export function searchExperiences({ searchTerm, filters }) {
  let events = [...experienceEvents]
  let venues = [...experienceVenues]
  let packages = [...experiencePackages]

  if (searchTerm) {
    const needle = searchTerm.toLowerCase()
    events = events.filter((item) => [item.title, item.venue, item.category].some((value) => value?.toLowerCase().includes(needle)))
    venues = venues.filter((item) => [item.name, item.category, item.location].some((value) => value?.toLowerCase().includes(needle)))
    packages = packages.filter((item) => [item.name, item.event, item.venue].some((value) => value?.toLowerCase().includes(needle)))
  }

  const withAttributeFilters = (item) => {
    if (filters.category !== 'all' && item.category !== filters.category) return false
    if (filters.location !== 'all' && item.location !== filters.location) return false
    if (filters.date && item.date && item.date !== filters.date) return false
    if (filters.rating !== 'all' && Number(item.rating) < Number(filters.rating)) return false
    if (filters.availability !== 'all' && item.availability && item.availability !== filters.availability) return false
    for (const key of ['dayPeriod', 'cuisine', 'budget', 'area', 'brand', 'type', 'indoorOutdoor']) {
      if (filters[key] !== 'all' && item[key] && item[key] !== filters[key]) return false
    }
    for (const [filterKey, sourceKey] of [['offers', 'offers'], ['birthdayOffers', 'birthdayOffer'], ['familyFriendly', 'familyFriendly'], ['animalFriendly', 'animalFriendly']]) {
      if (filters[filterKey] !== 'all' && Boolean(item[sourceKey]) !== (filters[filterKey] === 'yes')) return false
    }
    if (filters.priceRange !== 'all' && typeof item.price === 'number') {
      const [minRaw, maxRaw] = filters.priceRange.split('-')
      const min = Number(minRaw)
      const max = maxRaw ? Number(maxRaw.replace('+', '')) : Infinity
      if (item.price < min || item.price > max) return false
    }
    return true
  }

  events = events.filter(withAttributeFilters)
  venues = venues.filter(withAttributeFilters)
  packages = packages.filter(withAttributeFilters)

  return { events, venues, packages, total: events.length + venues.length + packages.length }
}
