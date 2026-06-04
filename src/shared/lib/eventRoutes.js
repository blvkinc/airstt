const EVENT_PUBLIC_ID_PREFIX = 'event:'

export const normalizeEventRouteId = (value) => {
  const text = String(value ?? '').trim()
  if (!text) return ''

  return text.toLowerCase().startsWith(EVENT_PUBLIC_ID_PREFIX)
    ? text.slice(EVENT_PUBLIC_ID_PREFIX.length)
    : text
}

export const getEventDetailId = (event) => normalizeEventRouteId(
  event?.eventId
  ?? event?.representativeEventVariantId
  ?? event?.representative_event_variant_id
  ?? event?.activeVariantEventId
  ?? event?.active_event_variant_id
  ?? event?.defaultEventVariantId
  ?? event?.default_event_variant_id
  ?? event?.canonicalEventVariantId
  ?? event?.canonical_event_variant_id
  ?? event?.favoriteEventId
  ?? event?.rawId
  ?? event?.id
)

export const getEventHref = (event) => {
  const href = String(event?.href || '').trim()

  if (href.startsWith('/events/')) {
    const [path, queryString] = href.split('?')
    const routeId = decodeURIComponent(path.replace(/^\/events\//, ''))
    const normalizedRouteId = normalizeEventRouteId(routeId)
    return normalizedRouteId ? `/events/${encodeURIComponent(normalizedRouteId)}${queryString ? `?${queryString}` : ''}` : '/events'
  }

  if (href) return href

  const eventId = getEventDetailId(event)
  return eventId ? `/events/${encodeURIComponent(eventId)}` : '/events'
}
