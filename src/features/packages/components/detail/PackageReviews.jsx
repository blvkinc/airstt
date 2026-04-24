import { Star } from 'lucide-react'

export function PackageReviews({ packageData }) {
  return (
    <div className="py-12 text-center text-gray-500">
      <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium text-gray-900">Reviews coming soon</h3>
      <p>Calculated from {packageData.reviews} ratings across all platforms.</p>
    </div>
  )
}
