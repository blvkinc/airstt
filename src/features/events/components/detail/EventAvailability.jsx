import { Button } from '../../../../shared/ui/button'
import { cn } from '../../../../shared/lib/utils'
import {
  DAY_STATUS_CONFIG,
  formatOccurrenceFullDate,
  getDayStatusKey,
  getOccurrenceDateParts,
  getOccurrenceValue,
  getPackageAvailabilitySummary,
  isOccurrenceSelectable,
} from './eventAvailabilityView'

function AvailabilitySnapshotCard({ occurrence, isSelected, onSelectOccurrence }) {
  const statusKey = getDayStatusKey(occurrence)
  const statusConfig = DAY_STATUS_CONFIG[statusKey]
  const dateParts = getOccurrenceDateParts(occurrence)
  const isSelectable = isOccurrenceSelectable(occurrence)
  const packageSummary = getPackageAvailabilitySummary(occurrence)
  const ctaLabel = isSelectable ? 'View packages' : statusConfig.label

  return (
    <article className={cn(
      'rounded-[1.5rem] border px-4 py-3 shadow-sm transition-colors',
      statusConfig.cardClassName,
      isSelected && 'border-brand-purple ring-2 ring-brand-purple/15'
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">{dateParts.weekday}</p>
            <span className="text-sm text-gray-300">|</span>
            <p className="text-sm text-gray-600">{dateParts.fullDate}</p>
            {occurrence?.time && (
              <>
                <span className="text-sm text-gray-300">|</span>
                <p className="text-sm font-medium text-gray-700">{occurrence.time}</p>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]', statusConfig.badgeClassName)}>
              {statusConfig.label}
            </span>
            <p className="text-sm text-gray-700">{packageSummary}</p>
            {isSelected && <span className="rounded-full bg-brand-purple/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-purple">Selected</span>}
          </div>

          {!isSelectable && <p className="text-xs text-gray-500">Packages remain available to review on published bookable dates.</p>}
        </div>

        <Button
          type="button"
          size="sm"
          className={cn('shrink-0 rounded-full px-4', statusConfig.buttonClassName)}
          disabled={!isSelectable}
          onClick={() => isSelectable && onSelectOccurrence(occurrence)}
          aria-label={`${ctaLabel} for ${formatOccurrenceFullDate(occurrence)}`}
        >
          {ctaLabel}
        </Button>
      </div>
    </article>
  )
}

export function EventAvailability({ event, selectedOccurrenceDate, onSelectOccurrence, onViewPackages = onSelectOccurrence }) {
  const occurrences = event?.occurrences || []
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Availability by day</h2>
        <p className="max-w-2xl text-sm text-gray-600">Start with the day that works best for your plans, then jump into Packages to choose from the options published for that date.</p>
      </div>

      <div className="space-y-3">
        {occurrences.length > 0 ? (
          <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1 sm:max-h-[32rem]">
            {occurrences.map((occurrence) => {
              const occurrenceValue = getOccurrenceValue(occurrence)

              return (
                <AvailabilitySnapshotCard
                  key={occurrenceValue || occurrence.id}
                  occurrence={occurrence}
                  isSelected={occurrenceValue === String(selectedOccurrenceDate)}
                  onSelectOccurrence={onViewPackages}
                />
              )
            })}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-sm text-gray-600 shadow-sm">
            No public availability has been published for this event yet.
          </div>
        )}
      </div>
    </div>
  )
}
