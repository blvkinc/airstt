import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../../../../shared/ui/button'
import { cn } from '../../../../shared/lib/utils'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const BOOKABLE_STATUSES = new Set(['available', 'limited'])

const STATUS_CONFIG = {
  available: {
    label: 'Available',
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    buttonClassName: 'border-emerald-200 bg-emerald-50 text-emerald-950 hover:border-emerald-300 hover:bg-emerald-100',
  },
  limited: {
    label: 'Limited',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-800',
    buttonClassName: 'border-amber-200 bg-amber-50 text-amber-950 hover:border-amber-300 hover:bg-amber-100',
  },
  sold_out: {
    label: 'Sold out',
    badgeClassName: 'border-rose-200 bg-rose-50 text-rose-700',
    buttonClassName: 'border-rose-200 bg-rose-50 text-rose-700',
  },
  unavailable: {
    label: 'Unavailable',
    badgeClassName: 'border-slate-200 bg-slate-100 text-slate-700',
    buttonClassName: 'border-slate-200 bg-slate-100 text-slate-600',
  },
}

const formatMonthKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
const parseOccurrenceDate = (value) => {
  if (!value || typeof value !== 'string') return null
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(Date.UTC(year, month - 1, day))
}

const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' })
const fullDateFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

const getOccurrenceValue = (occurrence) => String(occurrence?.occurrenceDate ?? occurrence?.date ?? '')
const getOccurrenceStatus = (occurrence) => {
  const status = occurrence?.status ?? null
  if (status === 'limited') return 'limited'
  if (status === 'sold_out') return 'sold_out'
  if (occurrence?.isBookable) return 'available'
  if (status === 'available') return 'available'
  return 'unavailable'
}
const isOccurrenceSelectable = (occurrence) => BOOKABLE_STATUSES.has(getOccurrenceStatus(occurrence)) && occurrence?.isBookable !== false

const buildCalendarWeeks = (monthDate, entriesByDay) => {
  const year = monthDate.getUTCFullYear()
  const month = monthDate.getUTCMonth()
  const firstDay = new Date(Date.UTC(year, month, 1))
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const leadingEmptyDays = firstDay.getUTCDay()
  const cells = []

  for (let index = 0; index < leadingEmptyDays; index += 1) cells.push(null)

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(Date.UTC(year, month, day))
    const key = `${formatMonthKey(date)}-${String(day).padStart(2, '0')}`
    cells.push({ day, date, occurrence: entriesByDay.get(key) ?? null })
  }

  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7))
  return weeks
}

function AvailabilityCalendarBase({
  occurrences,
  selectedOccurrenceDate,
  onSelectOccurrence,
  density = 'default',
  showLegend = true,
  showDetails = true,
  emptyMessage,
  surface = 'card',
  showMonthHint = true,
  showSelectedSummary = true,
}) {
  const occurrenceEntries = useMemo(() => occurrences
    .map((occurrence) => {
      const parsedDate = parseOccurrenceDate(getOccurrenceValue(occurrence))
      if (!parsedDate) return null
      return {
        occurrence,
        parsedDate,
        monthKey: formatMonthKey(parsedDate),
        dayKey: `${formatMonthKey(parsedDate)}-${String(parsedDate.getUTCDate()).padStart(2, '0')}`,
      }
    })
    .filter(Boolean), [occurrences])

  const months = useMemo(() => occurrenceEntries.reduce((list, entry) => {
    if (list.some((month) => month.key === entry.monthKey)) return list
    return [...list, { key: entry.monthKey, date: new Date(Date.UTC(entry.parsedDate.getUTCFullYear(), entry.parsedDate.getUTCMonth(), 1)) }]
  }, []), [occurrenceEntries])

  const entriesByDay = useMemo(() => new Map(occurrenceEntries.map((entry) => [entry.dayKey, entry.occurrence])), [occurrenceEntries])
  const selectedOccurrence = useMemo(() => occurrences.find((occurrence) => getOccurrenceValue(occurrence) === String(selectedOccurrenceDate)) ?? null, [occurrences, selectedOccurrenceDate])
  const initialMonthKey = useMemo(() => {
    const selectedEntry = occurrenceEntries.find((entry) => getOccurrenceValue(entry.occurrence) === String(selectedOccurrenceDate))
    return selectedEntry?.monthKey ?? occurrenceEntries[0]?.monthKey ?? null
  }, [occurrenceEntries, selectedOccurrenceDate])
  const [visibleMonthKey, setVisibleMonthKey] = useState(initialMonthKey)

  useEffect(() => {
    setVisibleMonthKey((currentKey) => (months.some((month) => month.key === currentKey) ? currentKey : initialMonthKey))
  }, [initialMonthKey, months])

  useEffect(() => {
    const selectedEntry = occurrenceEntries.find((entry) => getOccurrenceValue(entry.occurrence) === String(selectedOccurrenceDate))
    if (selectedEntry?.monthKey) setVisibleMonthKey(selectedEntry.monthKey)
  }, [occurrenceEntries, selectedOccurrenceDate])

  if (occurrenceEntries.length === 0) return <div className="text-sm text-gray-600">{emptyMessage}</div>

  const monthIndex = months.findIndex((month) => month.key === visibleMonthKey)
  const visibleMonth = months[monthIndex] ?? months[0]
  const weeks = buildCalendarWeeks(visibleMonth.date, entriesByDay)
  const compact = density === 'compact'
  const useCardSurface = surface === 'card'

  const moveSelection = (currentOccurrence, direction) => {
    const currentIndex = occurrences.findIndex((occurrence) => getOccurrenceValue(occurrence) === getOccurrenceValue(currentOccurrence))
    if (currentIndex < 0) return

    for (let index = currentIndex + direction; index >= 0 && index < occurrences.length; index += direction) {
      const candidate = occurrences[index]
      if (isOccurrenceSelectable(candidate)) {
        onSelectOccurrence(candidate)
        return
      }
    }
  }

  return (
    <div className="min-w-0 space-y-4">
      <div className={cn(
        'min-w-0',
        useCardSurface && 'overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-4',
        !useCardSurface && compact && 'rounded-[1.5rem] bg-transparent'
      )}>
        <div className={cn('flex flex-wrap items-start justify-between gap-3', useCardSurface ? 'mb-3 sm:mb-4' : 'mb-3')}>
          <div className="min-w-0">
            <h3 className={cn('font-semibold text-gray-900', compact ? 'text-base' : 'text-lg')}>{monthFormatter.format(visibleMonth.date)}</h3>
            {showMonthHint && !compact && <p className="mt-1 max-w-xl text-sm text-gray-500">Choose a published date to update your booking context.</p>}
            {showMonthHint && compact && <p className="mt-1 text-xs text-gray-500">Tap an available date to update this booking.</p>}
          </div>
          <div className="flex items-center gap-2 self-start">
            <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-200 bg-white" onClick={() => setVisibleMonthKey(months[Math.max(0, monthIndex - 1)].key)} disabled={monthIndex <= 0} aria-label="Show previous month">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-200 bg-white" onClick={() => setVisibleMonthKey(months[Math.min(months.length - 1, monthIndex + 1)].key)} disabled={monthIndex >= months.length - 1} aria-label="Show next month">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div role="grid" aria-label={`${monthFormatter.format(visibleMonth.date)} availability calendar`} className="min-w-0 space-y-2 overflow-visible">
          <div className="grid grid-cols-7 gap-1.5" role="row">
            {WEEKDAY_LABELS.map((weekday) => (
              <div key={weekday} role="columnheader" className={cn('min-w-0 text-center font-semibold text-gray-500', compact ? 'py-1 text-[11px]' : 'py-2 text-xs uppercase tracking-[0.18em]')}>
                <span className="block whitespace-nowrap">{weekday}</span>
              </div>
            ))}
          </div>

          {weeks.map((week, weekIndex) => (
            <div key={`${visibleMonth.key}-week-${weekIndex}`} role="row" className="grid grid-cols-7 gap-1.5">
              {week.map((cell, cellIndex) => {
                if (!cell) return <div key={`${visibleMonth.key}-empty-${weekIndex}-${cellIndex}`} aria-hidden="true" className={cn('aspect-square', compact ? 'rounded-full' : 'rounded-[1.25rem]')} />

                const occurrence = cell.occurrence
                if (!occurrence) {
                  return (
                    <div
                      key={`${visibleMonth.key}-${cell.day}`}
                      className={cn(
                        'grid aspect-square min-w-0 place-items-center border text-gray-300',
                        compact
                          ? 'rounded-full border-dashed border-gray-200 bg-gray-50 text-sm font-medium'
                          : 'min-h-[4.75rem] rounded-[1.25rem] border-dashed border-gray-200 bg-gray-50/70 text-sm font-semibold sm:min-h-[5.75rem] sm:text-base'
                      )}
                      aria-hidden="true"
                    >
                      <span className="leading-none">{dayFormatter.format(cell.date)}</span>
                    </div>
                  )
                }

                const occurrenceValue = getOccurrenceValue(occurrence)
                const isSelected = occurrenceValue === String(selectedOccurrenceDate)
                const statusKey = getOccurrenceStatus(occurrence)
                const isSelectable = isOccurrenceSelectable(occurrence)
                const statusConfig = STATUS_CONFIG[statusKey]
                const srLabel = `${fullDateFormatter.format(cell.date)}.${occurrence.time ? ` ${occurrence.time}.` : ''} ${statusConfig.label}.${isSelectable ? ' Selectable.' : ' Not selectable.'}${occurrence.packagesAvailable !== undefined ? ` ${occurrence.packagesAvailable} bookable packages.` : ''}`

                return (
                  <button
                    key={occurrenceValue || `${visibleMonth.key}-${cell.day}`}
                    type="button"
                    role="gridcell"
                    aria-selected={isSelected}
                    aria-label={srLabel}
                    disabled={!isSelectable}
                    title={compact ? `${fullDateFormatter.format(cell.date)} • ${statusConfig.label}` : undefined}
                    className={cn(
                      'group relative min-w-0 border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:hover:border-current disabled:hover:bg-current/0',
                      compact
                        ? 'grid aspect-square place-items-center rounded-full text-center'
                        : 'flex aspect-square min-w-0 flex-col justify-between overflow-hidden rounded-[1.25rem] text-left min-h-[4.75rem] p-2 sm:min-h-[5.75rem] sm:p-2.5',
                      statusConfig.buttonClassName,
                      compact && isSelected && 'border-brand-purple bg-brand-purple text-white shadow-md ring-2 ring-brand-purple/20 hover:border-brand-purple hover:bg-brand-purple/95',
                      !compact && isSelected && 'border-brand-purple ring-2 ring-brand-purple/30 shadow-sm',
                      !isSelectable && 'opacity-85'
                    )}
                    onClick={() => isSelectable && onSelectOccurrence(occurrence)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowRight') {
                        event.preventDefault()
                        moveSelection(occurrence, 1)
                      }
                      if (event.key === 'ArrowLeft') {
                        event.preventDefault()
                        moveSelection(occurrence, -1)
                      }
                      if (event.key === 'ArrowDown') {
                        event.preventDefault()
                        moveSelection(occurrence, 1)
                      }
                      if (event.key === 'ArrowUp') {
                        event.preventDefault()
                        moveSelection(occurrence, -1)
                      }
                    }}
                  >
                    {compact ? (
                      <span className="flex h-full w-full items-center justify-center text-sm font-semibold leading-none sm:text-[15px]">
                        {dayFormatter.format(cell.date)}
                      </span>
                    ) : (
                      <>
                        <div className="flex min-w-0 items-start justify-between gap-1.5 sm:gap-2">
                          <span className="truncate text-sm font-semibold leading-none sm:text-base">{dayFormatter.format(cell.date)}</span>
                          {isSelected && <span className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-purple">Selected</span>}
                        </div>
                        <div className="min-w-0 space-y-0.5 text-[11px] leading-tight sm:space-y-1 sm:text-xs">
                          <div className="truncate font-medium text-current">{statusConfig.label}</div>
                          {showDetails && occurrence.time && <div className="truncate text-current/80">{occurrence.time}</div>}
                          {showDetails && occurrence.packagesAvailable !== undefined && <div className="truncate text-current/80">{occurrence.packagesAvailable} packages</div>}
                        </div>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {showLegend && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Calendar legend</p>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-gray-600">
            {['available', 'limited', 'sold_out', 'unavailable'].map((statusKey) => (
              <span key={statusKey} className={cn('inline-flex items-center rounded-full border px-3 py-1.5', STATUS_CONFIG[statusKey].badgeClassName)}>
                {STATUS_CONFIG[statusKey].label}
              </span>
            ))}
          </div>
        </div>
      )}

      {showSelectedSummary && selectedOccurrence && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
          <span className="font-semibold text-gray-900">Selected:</span> {selectedOccurrence.date}
          {selectedOccurrence.time ? ` • ${selectedOccurrence.time}` : ''}
          {' • '}
          {STATUS_CONFIG[getOccurrenceStatus(selectedOccurrence)].label}
        </div>
      )}
    </div>
  )
}

export function EventAvailabilityCalendar(props) {
  return <AvailabilityCalendarBase {...props} density="default" showLegend showDetails emptyMessage="No public availability has been published for this event yet." />
}

export function EventAvailabilityCompactCalendar(props) {
  return <AvailabilityCalendarBase {...props} density="compact" surface="plain" showLegend showMonthHint={false} showSelectedSummary={false} showDetails={false} emptyMessage="No bookable dates are available yet." />
}
