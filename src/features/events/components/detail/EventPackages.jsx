import { Alert, AlertDescription, AlertTitle } from '../../../../shared/ui/alert'
import { Badge } from '../../../../shared/ui/badge'
import { Button } from '../../../../shared/ui/button'
import { Card } from '../../../../shared/ui/card'

const getGuestCountLabel = (pkg) => {
  const guestCount = Number(pkg?.guestCount ?? pkg?.maxGuests)
  if (Number.isNaN(guestCount) || guestCount <= 0) return null
  return guestCount === 1 ? '1' : `Up to ${guestCount}`
}

const getAvailabilityMetadataValue = (pkg) => {
  if (pkg.availabilityLabel) return pkg.availabilityLabel
  if (String(pkg.cardStatusLabel || '').trim().toLowerCase() === 'sold out') return 'Sold out'
  return null
}

const getPackageMetadata = (pkg) => ([
  getGuestCountLabel(pkg) ? { label: 'Guests', value: getGuestCountLabel(pkg) } : null,
  pkg.variantLabel ? { label: 'Audience', value: pkg.variantLabel } : null,
  pkg.packageTypeLabel ? { label: 'Type', value: pkg.packageTypeLabel } : null,
  getAvailabilityMetadataValue(pkg) ? { label: 'Availability', value: getAvailabilityMetadataValue(pkg) } : null,
].filter(Boolean))

const getFeaturePillClassName = (index) => {
  const styles = [
    'border border-stone-200/80 bg-stone-50 text-stone-700',
    'border border-amber-200/80 bg-amber-50 text-amber-700',
    'border border-rose-200/80 bg-rose-50 text-rose-700',
  ]

  return styles[index % styles.length]
}

const getUnavailableButtonClassName = (statusLabel) => {
  if (String(statusLabel || '').trim().toLowerCase() === 'sold out') {
    return 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50 disabled:border-rose-200 disabled:bg-rose-50 disabled:text-rose-700'
  }

  return 'border border-stone-200 bg-stone-100 text-stone-600 hover:bg-stone-100 disabled:border-stone-200 disabled:bg-stone-100 disabled:text-stone-600'
}

export function EventPackages({ occurrence, showDatePrompt, selectedPackageId, onSelectPackage }) {
  const packages = occurrence?.packages || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Choose your package</h2>
        <p className="text-gray-600">{occurrence ? `${occurrence.date}${occurrence.time ? ` - ${occurrence.time}` : ''}` : 'Select a date to see package availability.'}</p>
      </div>

      {showDatePrompt && (
        <Alert variant="warning" className="mb-4">
          <AlertTitle>Select a date first</AlertTitle>
          <AlertDescription>Choose a published, bookable date before selecting a package.</AlertDescription>
        </Alert>
      )}

      {occurrence && packages.length === 0 && (
        <Alert>
          <AlertTitle>No packages published</AlertTitle>
          <AlertDescription>This occurrence does not currently expose any packages on the public booking flow.</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6">
        {packages.map((pkg) => {
          const packageSelectionValue = String(pkg.selectionKey ?? pkg.occurrencePackageId ?? pkg.id)
          const isSelected = packageSelectionValue === String(selectedPackageId)
          const packageMetadata = getPackageMetadata(pkg)

          return (
            <Card
              key={packageSelectionValue}
              className={`overflow-hidden rounded-2xl border transition-all ${isSelected ? 'border-brand-purple shadow-lg shadow-brand-purple/10' : pkg.popular ? 'border-brand-purple/40 shadow-md shadow-brand-purple/5' : 'border-stone-200 shadow-sm'} ${!pkg.isBookable ? 'bg-stone-50/80' : 'bg-white'}`}
            >
              {pkg.popular && <div className="border-b border-brand-purple/10 bg-brand-purple/[0.06] px-4 py-2 text-center text-[11px] font-semibold tracking-[0.24em] text-brand-purple">MOST POPULAR</div>}
              <div className="gap-6 p-6 md:flex md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2.5">
                      <h3 className="text-lg font-semibold tracking-[-0.01em] text-stone-950">{pkg.displayName || pkg.name}</h3>
                      {pkg.description && <p className="max-w-2xl text-sm leading-6 text-stone-600">{pkg.description}</p>}
                    </div>
                  </div>

                  {packageMetadata.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-x-5 gap-y-3 border-t border-stone-100 pt-4 md:flex-nowrap md:gap-x-4">
                      {packageMetadata.map((item) => (
                        <div key={`${packageSelectionValue}-${item.label}`} className="min-w-0 md:flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">{item.label}</p>
                          <p className="mt-1 text-sm font-medium text-stone-800 md:truncate md:whitespace-nowrap">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {pkg.features.slice(0, 3).map((feature, index) => (
                      <Badge key={feature} variant="secondary" className={`rounded-full px-3 py-1 text-xs font-medium ${getFeaturePillClassName(index)}`}>
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-stone-100 pt-5 text-left md:mt-0 md:min-w-56 md:border-t-0 md:pt-0 md:pl-6 md:text-right">
                  <div className="flex items-center gap-2 md:justify-end">
                    <span className="text-2xl font-semibold tracking-[-0.02em] text-stone-950">AED {pkg.price}</span>
                    {pkg.originalPrice && pkg.originalPrice !== pkg.price && <span className="text-sm text-stone-400 line-through">AED {pkg.originalPrice}</span>}
                  </div>
                  <Button
                    className={`mt-4 w-full rounded-full ${pkg.isBookable ? 'bg-stone-950 text-white hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-500' : getUnavailableButtonClassName(pkg.cardStatusLabel)}`}
                    disabled={!pkg.isBookable}
                    onClick={() => onSelectPackage(pkg)}
                  >
                    {pkg.isBookable ? (isSelected ? 'Selected' : 'Select') : (pkg.cardStatusLabel || 'Unavailable')}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
