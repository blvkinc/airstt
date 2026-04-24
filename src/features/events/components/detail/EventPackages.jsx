import { Alert, AlertDescription, AlertTitle } from '../../../../shared/ui/alert'
import { Badge } from '../../../../shared/ui/badge'
import { Button } from '../../../../shared/ui/button'
import { Card } from '../../../../shared/ui/card'

export function EventPackages({ occurrence, showDatePrompt, selectedPackageId, onSelectPackage }) {
  const packages = occurrence?.packages || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Choose your package</h2>
        <p className="text-gray-600">{occurrence ? `${occurrence.date}${occurrence.time ? ` • ${occurrence.time}` : ''}` : 'Select a date to see package availability.'}</p>
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

          return (
            <Card
              key={packageSelectionValue}
              className={`overflow-hidden rounded-2xl transition-all ${isSelected ? 'border-brand-purple shadow-md' : pkg.popular ? 'border-brand-purple shadow-md' : 'border-gray-200'} ${!pkg.isBookable ? 'bg-gray-50/70' : ''}`}
            >
              {pkg.popular && <div className="bg-brand-purple px-3 py-1 text-center text-xs font-bold text-white">MOST POPULAR</div>}
              <div className="items-center gap-6 p-6 md:flex md:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{pkg.displayName || pkg.name}</h3>
                    <Badge className={pkg.isBookable ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-200 text-gray-700 hover:bg-gray-200'}>
                      {pkg.statusLabel}
                    </Badge>
                    {pkg.variantLabel && (
                      <Badge variant="secondary" className="bg-purple-100 text-xs font-normal text-purple-700 hover:bg-purple-100">
                        {pkg.variantLabel}
                      </Badge>
                    )}
                    {pkg.packageTypeLabel && (
                      <Badge variant="secondary" className="bg-blue-100 text-xs font-normal text-blue-700 hover:bg-blue-100">
                        {pkg.packageTypeLabel}
                      </Badge>
                    )}
                  </div>
                  <p className="mb-3 text-sm text-gray-600">{pkg.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="bg-gray-100 text-xs font-normal text-gray-600">
                        {feature}
                      </Badge>
                    ))}
                    {pkg.inventoryLabel && (
                      <Badge variant="secondary" className="bg-gray-100 text-xs font-normal text-gray-600">
                        {pkg.inventoryLabel}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-right md:mt-0 md:min-w-56">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-2xl font-bold">AED {pkg.price}</span>
                    {pkg.originalPrice && pkg.originalPrice !== pkg.price && <span className="text-sm text-gray-400 line-through">AED {pkg.originalPrice}</span>}
                  </div>
                  <span className="text-xs text-gray-500">per person</span>
                  <div className="mt-1 text-xs capitalize text-gray-500">
                    Payment: {pkg.paymentMode?.replace(/_/g, ' ') || 'full'}
                    {pkg.paymentMode === 'deposit' && pkg.depositAmount != null && <span> (Deposit AED {pkg.depositAmount})</span>}
                  </div>
                  <Button
                    className="mt-3 w-full rounded-xl bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-600"
                    disabled={!pkg.isBookable}
                    onClick={() => onSelectPackage(pkg)}
                  >
                    {pkg.isBookable ? (isSelected ? 'Selected' : 'Select') : 'Unavailable'}
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
