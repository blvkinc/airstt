const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

export const normalizeDataEnvelope = (payload) => {
  if (isPlainObject(payload) && 'data' in payload) {
    return payload.data
  }

  return payload
}

export const normalizeResourceEnvelope = (payload) => {
  const data = normalizeDataEnvelope(payload)
  return isPlainObject(data) ? data : null
}

export const normalizePaginatedCollectionEnvelope = (payload) => {
  if (Array.isArray(payload)) {
    return { items: payload, meta: null, links: null }
  }

  if (isPlainObject(payload) && Array.isArray(payload.data)) {
    return {
      items: payload.data,
      meta: isPlainObject(payload.meta) ? payload.meta : null,
      links: isPlainObject(payload.links) ? payload.links : null,
    }
  }

  return {
    items: [],
    meta: isPlainObject(payload?.meta) ? payload.meta : null,
    links: isPlainObject(payload?.links) ? payload.links : null,
  }
}
