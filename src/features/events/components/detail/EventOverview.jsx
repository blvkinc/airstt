import { Check, HelpCircle } from 'lucide-react'

const sectionCardClassName = 'rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'

const formatOfferingsHeading = (eventTitle) => {
  if (!eventTitle) return 'What this event offers'
  return `What ${eventTitle} offers`
}

export function EventOverview({ event }) {
  const offerings = event.offerings || []
  const faqs = event.faqs || []
  const policies = event.policies || []
  const accessibility = event.accessibility || []

  return (
    <div className="space-y-6">
      <section className={sectionCardClassName} aria-labelledby="event-about-heading">
        <h2 id="event-about-heading" className="text-2xl font-bold text-gray-900">About this event</h2>
        <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">{event.description || 'Event details will be published here as soon as they are available.'}</p>
      </section>

      <section className={sectionCardClassName} aria-labelledby="event-offerings-heading">
        <h2 id="event-offerings-heading" className="text-2xl font-bold text-gray-900">{formatOfferingsHeading(event.title)}</h2>
        {offerings.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {offerings.map((offering) => (
              <article key={offering.id || offering.key || offering.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">{offering.label}</h3>
                  {offering.badgeLabel && <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 ring-1 ring-gray-200">{offering.badgeLabel}</span>}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {offering.items.map((item) => (
                    <li key={item.id || item.key || item.label} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-gray-600">Specific event inclusions have not been published in the current public catalog.</p>
        )}
      </section>

      <section className={sectionCardClassName} aria-labelledby="event-know-heading">
        <h2 id="event-know-heading" className="text-2xl font-bold text-gray-900">Things to know</h2>

        {(policies.length > 0 || accessibility.length > 0) && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {policies.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Policies</h3>
                <ul className="mt-3 space-y-2">
                  {policies.map((policy) => (
                    <li key={policy} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {accessibility.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Accessibility</h3>
                <ul className="mt-3 space-y-2">
                  {accessibility.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {faqs.length > 0 ? (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Frequently asked questions</h3>
            {faqs.map((faq) => (
              <article key={faq.id || faq.question} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-900" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{faq.question}</h4>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-gray-600">Booking details, arrival guidance, and other FAQs will appear here when available.</p>
        )}
      </section>
    </div>
  )
}
