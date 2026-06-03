import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  fetchFavoriteEventsWithApi,
  fetchFavoriteVenuesWithApi,
  removeFavoriteEventWithApi,
  removeFavoriteVenueWithApi,
  saveFavoriteEventWithApi,
  saveFavoriteVenueWithApi,
} from '../api/customerFavoritesApi'
import { getCatalogEventDetail, getCatalogVenueDetail } from '../../modules/publicCatalog/services'

const BookingContext = createContext()

const hydrateFavorites = async (favorites, resolveDetail, getEntity) => {
  const hydrated = await Promise.all(favorites.map(async (favorite) => {
    const entity = getEntity(favorite)

    try {
      const detail = await resolveDetail(entity.id)
      return detail ? { ...detail, favoriteId: favorite.favoriteId, favoritedAt: favorite.favoritedAt } : null
    } catch {
      return null
    }
  }))

  return hydrated.filter(Boolean)
}

export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) throw new Error('useBooking must be used within a BookingProvider')
  return context
}

export const BookingProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [favoriteEvents, setFavoriteEvents] = useState([])
  const [favoriteVenues, setFavoriteVenues] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)
  const [favoritesError, setFavoritesError] = useState('')
  const [pendingFavoriteKeys, setPendingFavoriteKeys] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteEvents([])
      setFavoriteVenues([])
      setFavoritesError('')
      setFavoritesLoading(false)
      setPendingFavoriteKeys([])
      return
    }

    const controller = new AbortController()

    const loadFavorites = async () => {
      setFavoritesLoading(true)

      try {
        const [eventFavorites, venueFavorites] = await Promise.all([
          fetchFavoriteEventsWithApi({ signal: controller.signal }),
          fetchFavoriteVenuesWithApi({ signal: controller.signal }),
        ])

        const [hydratedEvents, hydratedVenues] = await Promise.all([
          hydrateFavorites(eventFavorites, (eventId) => getCatalogEventDetail({ eventId, signal: controller.signal }), (favorite) => favorite.event),
          hydrateFavorites(venueFavorites, (venueId) => getCatalogVenueDetail({ venueId, signal: controller.signal }), (favorite) => favorite.venue),
        ])

        if (controller.signal.aborted) return

        setFavoriteEvents(hydratedEvents)
        setFavoriteVenues(hydratedVenues)
        setFavoritesError('')
      } catch (error) {
        if (controller.signal.aborted || error?.name === 'AbortError') return
        setFavoriteEvents([])
        setFavoriteVenues([])
        setFavoritesError(error?.message || 'Unable to load favorites right now.')
      } finally {
        if (!controller.signal.aborted) {
          setFavoritesLoading(false)
        }
      }
    }

    loadFavorites()

    return () => controller.abort()
  }, [isAuthenticated])

  const eventIds = useMemo(() => new Set(favoriteEvents.map((event) => String(event.id))), [favoriteEvents])
  const venueIds = useMemo(() => new Set(favoriteVenues.map((venue) => String(venue.id))), [favoriteVenues])

  const setFavoritePending = (key, isPending) => {
    setPendingFavoriteKeys((current) => {
      if (isPending) {
        return current.includes(key) ? current : [...current, key]
      }

      return current.filter((entry) => entry !== key)
    })
  }

  const requireAuth = () => {
    if (isAuthenticated) return true
    if (typeof window !== 'undefined') {
      window.location.assign('/auth')
    }
    return false
  }

  const toggleEventFavorite = async (event) => {
    if (!requireAuth() || !event?.id) return false

    const key = `event:${event.id}`
    const isFavorited = eventIds.has(String(event.id))
    setFavoritePending(key, true)

    try {
      if (isFavorited) {
        await removeFavoriteEventWithApi(event.id)
        setFavoriteEvents((current) => current.filter((entry) => String(entry.id) !== String(event.id)))
      } else {
        await saveFavoriteEventWithApi(event.id)
        setFavoriteEvents((current) => current.some((entry) => String(entry.id) === String(event.id)) ? current : [...current, event])
      }
      setFavoritesError('')
      return !isFavorited
    } catch (error) {
      setFavoritesError(error?.message || 'Unable to update favorites right now.')
      throw error
    } finally {
      setFavoritePending(key, false)
    }
  }

  const toggleVenueFavorite = async (venue) => {
    if (!requireAuth() || !venue?.id) return false

    const key = `venue:${venue.id}`
    const isFavorited = venueIds.has(String(venue.id))
    setFavoritePending(key, true)

    try {
      if (isFavorited) {
        await removeFavoriteVenueWithApi(venue.id)
        setFavoriteVenues((current) => current.filter((entry) => String(entry.id) !== String(venue.id)))
      } else {
        await saveFavoriteVenueWithApi(venue.id)
        setFavoriteVenues((current) => current.some((entry) => String(entry.id) === String(venue.id)) ? current : [...current, venue])
      }
      setFavoritesError('')
      return !isFavorited
    } catch (error) {
      setFavoritesError(error?.message || 'Unable to update favorites right now.')
      throw error
    } finally {
      setFavoritePending(key, false)
    }
  }

  const favorites = useMemo(() => ([
    ...favoriteEvents.map((event) => ({ ...event, type: 'event' })),
    ...favoriteVenues.map((venue) => ({ ...venue, type: 'venue' })),
  ]), [favoriteEvents, favoriteVenues])

  return <BookingContext.Provider value={{
    favorites,
    favoriteEvents,
    favoriteVenues,
    favoritesLoading,
    favoritesError,
    toggleEventFavorite,
    toggleVenueFavorite,
    isEventFavorited: (eventId) => eventIds.has(String(eventId)),
    isVenueFavorited: (venueId) => venueIds.has(String(venueId)),
    isFavoritePending: (type, id) => pendingFavoriteKeys.includes(`${type}:${id}`),
  }}>{children}</BookingContext.Provider>
}
