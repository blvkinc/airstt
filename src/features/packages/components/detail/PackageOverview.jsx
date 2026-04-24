import { Check } from 'lucide-react'

export function PackageOverview({ packageData }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About this package</h2>
        <p className="text-gray-600 leading-relaxed text-lg mb-8">{packageData.description}</p>

        <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {packageData.highlights.map((highlight) => (
            <div key={highlight} className="flex items-start space-x-3 p-2.5 rounded-xl bg-gray-50">
              <Check className="w-5 h-5 text-gray-900 mt-0.5" />
              <span className="text-gray-700">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Features & Inclusions</h3>
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {packageData.features.map((feature) => (
              <div key={feature} className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Policies</h4>
            <p className="text-gray-600 text-sm mb-1">{packageData.cancellationPolicy}</p>
            <p className="text-gray-600 text-sm">{packageData.ageRestriction}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Dress Code</h4>
            <p className="text-gray-600 text-sm">{packageData.dressCode}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
