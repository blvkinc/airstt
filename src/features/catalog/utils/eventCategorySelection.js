const normalizeToken = (value) => String(value ?? '').trim().toLowerCase()

const buildTokenSet = (values = []) => new Set(
  values
    .flat()
    .map(normalizeToken)
    .filter(Boolean),
)

export const normalizeSelectedEventCategory = (category) => {
  if (!category) return null

  if (typeof category === 'string') {
    const displayName = category.trim()
    return displayName ? { id: null, name: displayName, slug: null, displayName } : null
  }

  const displayName = category.displayName ?? category.name ?? category.slug ?? null

  if (!displayName && !category.id) return null

  return {
    id: category.id ?? null,
    name: category.name ?? null,
    slug: category.slug ?? null,
    displayName,
  }
}

export const matchesSelectedEventCategory = (event, selectedCategory, options = {}) => {
  const normalizedSelection = normalizeSelectedEventCategory(selectedCategory)
  if (!normalizedSelection) return true

  const categoryEntries = Array.isArray(event?.categories) ? event.categories : []
  const selectedId = normalizedSelection.id ? String(normalizedSelection.id) : null

  if (selectedId && categoryEntries.some((entry) => String(entry?.id ?? '') === selectedId)) {
    return true
  }

  const selectionTokens = buildTokenSet([
    normalizedSelection.name,
    normalizedSelection.slug,
    normalizedSelection.displayName,
  ])

  if (selectionTokens.size === 0) return false

  const eventCategoryTokens = buildTokenSet(categoryEntries.flatMap((entry) => [
    entry?.name,
    entry?.slug,
    entry?.displayName,
  ]))

  for (const token of selectionTokens) {
    if (eventCategoryTokens.has(token)) {
      return true
    }
  }

  const textValues = [
    options.primaryText,
    ...(Array.isArray(options.fallbackText) ? options.fallbackText : []),
  ]
  const haystack = textValues.map(normalizeToken).filter(Boolean)

  return Array.from(selectionTokens).some((token) => haystack.some((value) => value.includes(token)))
}
