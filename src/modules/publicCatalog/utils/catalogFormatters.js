const toDate = (value) => {
  if (!value) return null

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export const formatCatalogDate = (value, options) => {
  const date = toDate(value)
  if (!date) return ''

  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export const formatCatalogTimeRange = (start, end) => {
  const startLabel = formatCatalogDate(start, { hour: 'numeric', minute: '2-digit' })
  const endLabel = formatCatalogDate(end, { hour: 'numeric', minute: '2-digit' })

  if (!startLabel) return ''
  return endLabel ? `${startLabel} - ${endLabel}` : startLabel
}

export const formatCatalogTimeRangeWithDayHint = (start, end) => {
  const rangeLabel = formatCatalogTimeRange(start, end)
  if (!rangeLabel || !start || !end) return rangeLabel

  const startDate = toDate(start)
  const endDate = toDate(end)
  if (!startDate || !endDate) return rangeLabel

  const startsOn = formatCatalogDate(startDate, { year: 'numeric', month: '2-digit', day: '2-digit' })
  const endsOn = formatCatalogDate(endDate, { year: 'numeric', month: '2-digit', day: '2-digit' })

  return startsOn && endsOn && startsOn !== endsOn ? `${rangeLabel} (next day)` : rangeLabel
}

export const toNumberOrNull = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export const toCoordinatesOrNull = (latitude, longitude) => {
  const lat = toNumberOrNull(latitude)
  const lng = toNumberOrNull(longitude)

  if (lat === null || lng === null) return null
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null

  return { lat, lng }
}

export const pickFirstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '') ?? null
