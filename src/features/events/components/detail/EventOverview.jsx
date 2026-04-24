import { Check, Phone } from 'lucide-react'

export function EventOverview({ event }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-gray-900">About this experience</h2>
        <p className="mb-8 text-lg leading-relaxed text-gray-600">{event.description}</p>

        {event.highlights.length > 0 && <><h3 className="mb-4 text-lg font-semibold text-gray-900">Experience Highlights</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {event.highlights.map((highlight) => (
            <div key={highlight} className="flex items-start space-x-3 rounded-xl bg-gray-50 p-3">
              <Check className="mt-0.5 h-5 w-5 text-gray-900" />
              <span className="text-gray-700">{highlight}</span>
            </div>
          ))}
        </div></>}
      </div>

      <div className="border-t border-gray-100 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Things to know</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Policies</h4>
            <ul className="space-y-2">
              {event.policies.length > 0 ? event.policies.map((policy) => (
                <li key={policy} className="flex items-start space-x-2 text-sm text-gray-600">
                  <span>-</span>
                  <span>{policy}</span>
                </li>
              )) : <li className="text-sm text-gray-600">Policies will be confirmed during booking.</li>}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Contact Host</h4>
            <a href={`mailto:${event.contact?.email || ''}`} className="mb-2 flex items-center space-x-2 text-gray-600 hover:underline">
              <Phone className="h-4 w-4" />
              <span>Contact Venue</span>
            </a>
          </div>
        </div>
      </div>

      {event.accessibility.length > 0 && <div className="border-t border-gray-100 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Accessibility</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {event.accessibility.map((item) => (
            <div key={item} className="flex items-start space-x-3 rounded-xl bg-gray-50 p-3">
              <Check className="mt-0.5 h-5 w-5 text-gray-900" />
              <span className="text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>}

      {event.faqs.length > 0 && <div className="border-t border-gray-100 pt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">FAQs</h3>
        <div className="space-y-4">
          {event.faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-4">
              <div className="mb-1 font-semibold text-gray-900">{faq.question}</div>
              <div className="text-sm text-gray-600">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  )
}
