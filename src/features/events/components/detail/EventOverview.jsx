import { Check, HelpCircle } from 'lucide-react'

const sectionClassName = 'border-t border-gray-100 pt-8'

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
      <section className="pb-2" aria-labelledby="event-about-heading">
        <h2 id="event-about-heading" className="text-[17px] font-semibold text-brand-black">About this event</h2>
        <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">{event.description || 'Event details will be published here as soon as they are available.'}</p>
      </section>

      <section className={sectionClassName} aria-labelledby="event-offerings-heading">
        <h2 id="event-offerings-heading" className="text-[17px] font-semibold text-brand-black">{formatOfferingsHeading(event.title)}</h2>
        {offerings.length > 0 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {offerings.map((offering) => (
              <article key={offering.id || offering.key || offering.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[13px] font-medium text-brand-black">{offering.label}</h3>
                  {offering.badgeLabel && <span className="rounded-full bg-brand-purple px-3 py-1 text-[9px] font-normal text-white">{offering.badgeLabel}</span>}
                </div>
                <ul className="mt-4 space-y-2.5">
                  {offering.items.map((item) => (
                    <li key={item.id || item.key || item.label} className="flex items-start gap-3 text-[13px] font-normal text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">Specific event inclusions have not been published in the current public catalog.</p>
        )}
      </section>

      <section className={sectionClassName} aria-labelledby="event-know-heading">
        <h2 id="event-know-heading" className="text-[17px] font-semibold text-brand-black">Things to know</h2>

        {(policies.length > 0 || accessibility.length > 0) && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {policies.length > 0 && (
              <div>
                <h3 className="text-[13px] font-medium text-brand-black">Policies</h3>
                <ul className="mt-3 space-y-2">
                  {policies.map((policy) => (
                    <li key={policy} className="flex items-start gap-3 text-[13px] font-normal text-gray-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-900" />
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {accessibility.length > 0 && (
              <div>
                <h3 className="text-[13px] font-medium text-brand-black">Accessibility</h3>
                <ul className="mt-3 space-y-2">
                  {accessibility.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] font-normal text-gray-600">
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
            <h3 className="text-[13px] font-medium text-brand-black">Frequently asked questions</h3>
            {faqs.map((faq) => (
              <article key={faq.id || faq.question} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-900" />
                  <div>
                    <h4 className="text-[13px] font-medium text-brand-black">{faq.question}</h4>
                    <p className="mt-2 text-[13px] font-normal leading-5 text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-[13px] font-normal leading-5 text-gray-600">Booking details, arrival guidance, and other FAQs will appear here when available.</p>
        )}
      </section>
    </div>
  )
}
