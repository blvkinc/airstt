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

export const toNumberOrNull = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export const pickFirstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '') ?? null
