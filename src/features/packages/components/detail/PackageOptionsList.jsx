import { Check, Gift, Users } from 'lucide-react'

export function PackageOptionsList({ packages, selectedPackage, onSelectPackage }) {
  return (
    <div className="space-y-6">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className={`bg-white rounded-xl p-8 border transition-all duration-300 cursor-pointer ${
            selectedPackage?.id === pkg.id
              ? 'border-brand-purple shadow-lg ring-1 ring-brand-purple'
              : 'border-gray-100 hover:border-gray-200 hover:shadow-xl shadow-md'
          } ${pkg.popular ? 'relative' : ''}`}
          onClick={() => onSelectPackage(pkg)}
        >
          {pkg.popular && (
            <div className="absolute -top-3 left-8">
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500">Up to {pkg.maxGuests} guests</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-primary-600">AED {pkg.price}</span>
                {Number(pkg.originalPrice) > Number(pkg.price) && (
                  <span className="text-lg text-neutral-500 line-through">AED {pkg.originalPrice}</span>
                )}
              </div>
              <p className="text-sm text-gray-500">per person</p>
              {Number(pkg.originalPrice) > Number(pkg.price) && (
                <div className="inline-flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium mt-2">
                  <Gift className="w-3 h-3" />
                  <span>Save AED {Number(pkg.originalPrice) - Number(pkg.price)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(pkg.features || []).map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
