const BOOKABLE_DAY_STATUSES = new Set(['available', 'limited'])

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const weekdayFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  timeZone: 'UTC',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

const normalizeStatusKey = (value) => {
  const normalizedValue = String(value || '').trim().toLowerCase()
  if (normalizedValue === 'limited') return 'limited'
  if (normalizedValue === 'sold_out' || normalizedValue === 'sold out') return 'sold_out'
  if (normalizedValue === 'available') return 'available'
  return 'unavailable'
}

const parseOccurrenceDate = (value) => {
  if (!value || typeof value !== 'string') return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(Date.UTC(year, month - 1, day))
}

export const getOccurrenceValue = (occurrence) => String(occurrence?.slotKey ?? occurrence?.occurrenceDate ?? occurrence?.date ?? '')

export const getDayStatusKey = (occurrence) => {
  const statusKey = normalizeStatusKey(occurrence?.status)
  if (statusKey === 'available' || statusKey === 'limited' || statusKey === 'sold_out') return statusKey
  if (occurrence?.isBookable) return 'available'
  return 'unavailable'
}

export const isOccurrenceSelectable = (occurrence) => BOOKABLE_DAY_STATUSES.has(getDayStatusKey(occurrence)) && occurrence?.isBookable !== false

export const DAY_STATUS_CONFIG = {
  available: {
    label: 'Available',
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    cardClassName: 'border-emerald-100 bg-emerald-50/40',
    buttonClassName: 'bg-stone-950 text-white hover:bg-stone-800',
  },
  limited: {
    label: 'Limited',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-800',
    cardClassName: 'border-amber-100 bg-amber-50/40',
    buttonClassName: 'bg-stone-950 text-white hover:bg-stone-800',
  },
  sold_out: {
    label: 'Sold out',
    badgeClassName: 'border-rose-200 bg-rose-50 text-rose-700',
    cardClassName: 'border-rose-100 bg-rose-50/40',
    buttonClassName: 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50',
  },
  unavailable: {
    label: 'Unavailable',
    badgeClassName: 'border-slate-200 bg-slate-100 text-slate-700',
    cardClassName: 'border-slate-200 bg-slate-50',
    buttonClassName: 'border border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-100',
  },
}

export const getPackageAvailabilitySummary = (occurrence) => {
  const packages = occurrence?.packages || []
  const totalPackages = packages.length
  const availablePackages = typeof occurrence?.packagesAvailable === 'number'
    ? occurrence.packagesAvailable
    : packages.filter((pkg) => pkg?.isBookable).length

  if (totalPackages <= 0) return 'No packages published'
  if (availablePackages <= 0) return `0 of ${totalPackages} packages available`
  if (availablePackages === totalPackages) return `${totalPackages} of ${totalPackages} packages available`
  return `${availablePackages} of ${totalPackages} packages available`
}

export const formatOccurrenceFullDate = (occurrence) => {
  const parsedDate = parseOccurrenceDate(getOccurrenceValue(occurrence))
  return parsedDate ? dateFormatter.format(parsedDate) : occurrence?.date || occurrence?.occurrenceDate || 'Date unavailable'
}

export const getOccurrenceDateParts = (occurrence) => {
  const parsedDate = parseOccurrenceDate(getOccurrenceValue(occurrence))
  if (!parsedDate) {
    const fallback = occurrence?.date || occurrence?.occurrenceDate || 'Date unavailable'
    return { weekday: fallback, fullDate: fallback }
  }

  return {
    weekday: weekdayFormatter.format(parsedDate),
    fullDate: shortDateFormatter.format(parsedDate),
  }
}

export const getSelectedDaySummary = (occurrence) => {
  if (!occurrence) {
    return {
      title: 'No date selected',
      subtitle: 'Choose a date from the day list to review upcoming availability.',
    }
  }

  const status = DAY_STATUS_CONFIG[getDayStatusKey(occurrence)]
  return {
    title: formatOccurrenceFullDate(occurrence),
    subtitle: [occurrence?.time, status.label, getPackageAvailabilitySummary(occurrence)].filter(Boolean).join(' • '),
  }
}
