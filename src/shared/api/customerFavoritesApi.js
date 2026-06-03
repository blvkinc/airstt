import { del, get, post } from './apiClient'

const unwrapCollection = (payload) => {
  const data = payload?.data
  return Array.isArray(data) ? data : []
}

const mapVenueFavorite = (favorite = {}) => ({
  favoriteId: favorite.id ?? null,
  favoritedAt: favorite.favorited_at ?? null,
  venue: favorite.venue
    ? {
        id: favorite.venue.id ?? null,
        name: favorite.venue.name ?? null,
        slug: favorite.venue.slug ?? null,
        shortDescription: favorite.venue.short_description ?? null,
        publicationState: favorite.venue.publication_state ?? null,
        status: favorite.venue.status ?? null,
      }
    : null,
})

const mapEventFavorite = (favorite = {}) => ({
  favoriteId: favorite.id ?? null,
  favoritedAt: favorite.favorited_at ?? null,
  event: favorite.event
    ? {
        id: favorite.event.id ?? null,
        venueId: favorite.event.venue_id ?? null,
        title: favorite.event.title ?? null,
        slug: favorite.event.slug ?? null,
        shortDescription: favorite.event.short_description ?? null,
        publicationState: favorite.event.publication_state ?? null,
        status: favorite.event.status ?? null,
      }
    : null,
})

export const fetchFavoriteVenuesWithApi = async ({ signal } = {}) => {
  const payload = await get('/me/favorites/venues', { signal })
  return unwrapCollection(payload).map(mapVenueFavorite).filter((favorite) => favorite.venue?.id)
}

export const fetchFavoriteEventsWithApi = async ({ signal } = {}) => {
  const payload = await get('/me/favorites/events', { signal })
  return unwrapCollection(payload).map(mapEventFavorite).filter((favorite) => favorite.event?.id)
}

export const saveFavoriteVenueWithApi = async (venueId) => post(`/me/favorites/venues/${venueId}`)
export const removeFavoriteVenueWithApi = async (venueId) => del(`/me/favorites/venues/${venueId}`)
export const saveFavoriteEventWithApi = async (eventId) => post(`/me/favorites/events/${eventId}`)
export const removeFavoriteEventWithApi = async (eventId) => del(`/me/favorites/events/${eventId}`)
