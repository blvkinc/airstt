import { eventCatalog, packageCatalog, packageMap, venueMap } from './experienceFixtures'

export const getEventById = (id) => eventCatalog.find((event) => String(event.id) === String(id) || event.id === Number(id)) || null

export const getVenueById = (id) => {
  const venue = venueMap[Number(id)] || Object.values(venueMap).find((entry) => String(entry.id) === String(id))
  if (!venue) return null

  const upcomingEvents = eventCatalog
    .filter((event) => event.venueId === venue.id)
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      time: event.time,
      price: event.price,
      image: event.image
    }))

  return {
    ...venue,
    reviewCount: venue.reviews,
    upcomingEvents,
    reviews: venue.reviewEntries
  }
}

export const getPackageById = (id) => packageMap[Number(id)] || packageCatalog.find((pkg) => String(pkg.id) === String(id)) || null

export const getPackagesForEvent = (eventId) => packageCatalog.filter((pkg) => String(pkg.eventId) === String(eventId) || pkg.eventId === Number(eventId))

export const getPackagesPageEvent = (eventId) => {
  const event = getEventById(eventId)
  if (!event) return null

  return {
    id: event.id,
    title: event.title,
    venue: event.venue,
    image: event.image,
    date: event.date,
    time: event.time,
    location: event.location,
    rating: event.rating,
    reviews: event.reviews,
    packages: getPackagesForEvent(event.id)
  }
}
