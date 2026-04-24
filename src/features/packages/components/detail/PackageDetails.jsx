import { Check } from 'lucide-react'
import { Card, CardContent } from '../../../../shared/ui/card'

export function PackageDetails({ packageData }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-bold text-gray-900 mb-4">Inclusions</h3>
            <ul className="space-y-1.5">
              {packageData.inclusions.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" /> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-bold text-gray-900 mb-4">Exclusions</h3>
            <ul className="space-y-1.5">
              {packageData.exclusions.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-red-500">×</span> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
