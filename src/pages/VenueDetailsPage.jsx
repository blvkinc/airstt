import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CalendarDays, Check, Clock, Globe2, Heart, Mail, MapPin, Phone, Share2, Star, Users } from 'lucide-react'
import { Button } from '../shared/ui/button'
import { Card } from '../shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../shared/ui/select'
import { DetailMediaGallery } from '../shared/components/detail/DetailMediaGallery'
import { DetailTabNav } from '../shared/components/detail/DetailTabNav'
import { useVenueDetailCatalog } from '../features/catalog'
import { getEventHref } from '../shared/lib/eventRoutes'

const getReviewCount = (venue) => {
  const count = venue?.reviewCount ?? (Array.isArray(venue?.reviews) ? venue.reviews.length : venue?.reviews)
  return Number(count) || 0
}

const getVenueEmail = (venue) => {
  if (venue?.email) return venue.email
  if (!venue?.website) return ''

  const host = String(venue.website)
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0]

  return host ? `info@${host}` : ''
}

const getVenueTypeLabels = (venue) => {
  const types = venue?.venueTypes?.map((type) => type.displayName || type.name).filter(Boolean) || []
  return types.length ? types : [venue?.type || venue?.category || 'Venue']
}

const fieldClassName = 'h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'
const sectionClassName = 'border-t border-gray-100 pt-8'

const VenueDetailsPage = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const { data: venue, loading, error, retry } = useVenueDetailCatalog(id)

  if (loading) return <div className="flex min-h-screen items-center justify-center text-gray-600">Loading venue...</div>
  if (error?.status === 404) return <div className="flex min-h-screen items-center justify-center"><div className="text-center"><h1 className="mb-3 text-3xl font-bold">Venue not found</h1><Link to="/venues" className="font-semibold text-brand-purple">Back to Venues</Link></div></div>
  if (error) return <div className="flex min-h-screen items-center justify-center"><div className="text-center"><h1 className="mb-3 text-3xl font-bold">Couldn't load venue</h1><p className="mb-4 text-gray-600">{error.message}</p><button onClick={retry} className="font-semibold text-brand-purple">Try again</button></div></div>
  if (!venue) return null

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'events', label: 'Events' },
    { id: 'details', label: 'Details' },
  ]

  const venueTypeLabels = getVenueTypeLabels(venue)
  const reviewCount = getReviewCount(venue)
  const highlights = venue.highlights || []
  const amenities = venue.amenities || []
  const upcomingEvents = venue.upcomingEvents || []
  const email = getVenueEmail(venue)

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="mx-auto max-w-7xl px-4 pb-5 pt-24 md:px-8">
        <Link to="/venues" className="inline-flex h-10 items-center gap-2 rounded-full px-1 text-sm font-semibold text-gray-700 transition hover:text-gray-950">
          <ArrowLeft className="h-4 w-4" />
          Back to venues
        </Link>
      </div>

      <DetailMediaGallery
        title={venue.name}
        images={venue.images}
        fallbackImage={venue.image}
        showAllPhotosLabel="Show all photos"
        className="mx-auto mb-10 max-w-7xl px-4 md:mb-12 md:px-8"
        heightClassName="h-[320px] md:h-[500px]"
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <main className="lg:col-span-2">
            <header className="mb-8 border-b border-gray-100 pb-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {venueTypeLabels.map((label) => (
                    <span key={label} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {label}
                    </span>
                  ))}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button className="inline-flex h-10 items-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 hover:text-gray-950">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <button className="inline-flex h-10 items-center gap-2 rounded-full bg-gray-100 px-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 hover:text-gray-950">
                    <Heart className="h-4 w-4" />
                    Save
                  </button>
                </div>
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">{venue.name}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5 font-semibold text-gray-950">
                  <Star className="h-4 w-4 fill-gray-950 text-gray-950" />
                  {venue.rating}
                  <span className="font-medium text-gray-600">({reviewCount} reviews)</span>
                </span>
                <span className="hidden text-gray-300 sm:inline">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {venue.address || venue.location || 'Dubai, UAE'}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  venue.capacity ? `Up to ${venue.capacity} guests` : null,
                  venue.dressCode ? venue.dressCode : null,
                  venue.priceRange ? `From ${venue.priceRange}` : null,
                ].filter(Boolean).map((item) => (
                  <span key={item} className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700">
                    {item}
                  </span>
                ))}
              </div>
            </header>

            <DetailTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'overview' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-950">About this venue</h2>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600 md:text-lg">
                    {venue.description || 'Additional venue details will appear here as the public catalog expands.'}
                  </p>
                </section>

                {highlights.length > 0 && (
                  <section className={sectionClassName}>
                    <h2 className="text-2xl font-bold text-gray-950">What makes it stand out</h2>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {highlights.map((highlight) => (
                        <div key={highlight} className="flex items-start gap-3 rounded-[18px] border border-gray-100 bg-white p-4 shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
                          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                            <Check className="h-4 w-4 text-gray-950" />
                          </span>
                          <span className="text-sm font-semibold leading-6 text-gray-800">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {amenities.length > 0 && (
                  <section className={sectionClassName}>
                    <h2 className="text-2xl font-bold text-gray-950">Amenities</h2>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {amenities.map((amenity) => (
                        <span key={amenity} className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-950">Public events at {venue.name}</h2>
                  <p className="mt-2 text-sm text-gray-600">Events linked to this venue use the same card shape as the homepage and listing pages.</p>
                </div>

                {upcomingEvents.length === 0 ? (
                  <Card className="rounded-[20px] border-gray-200 p-8 text-center text-sm font-medium text-gray-600 shadow-[0_6px_22px_rgba(0,0,0,0.05)]">
                    No public events are attached to this venue yet.
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {upcomingEvents.map((event) => (
                      <Link to={getEventHref(event)} key={event.id} className="group block">
                        <article className="overflow-hidden rounded-[20px] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.04] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(0,0,0,0.12)]">
                          <div className="relative aspect-[1.38] overflow-hidden">
                            <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-900 shadow-sm">
                              {event.date}
                            </span>
                            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm">
                              <Heart className="h-4 w-4" />
                            </span>
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base font-bold leading-snug text-gray-950">{event.title}</h3>
                              {event.price && <span className="shrink-0 text-xs font-bold text-gray-950">AED {event.price}</span>}
                            </div>
                            <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              {event.time || 'Details on event page'}
                            </p>
                            <Button variant="outline" className="mt-4 w-full">
                              View details
                            </Button>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-950">Venue details</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Capacity', value: venue.capacity ? `${venue.capacity} guests` : 'Available on request', icon: Users },
                      { label: 'Area', value: venue.area || venue.location || 'Dubai', icon: MapPin },
                      { label: 'Dress code', value: venue.dressCode || 'Shared after booking', icon: Check },
                      { label: 'Parking', value: venue.parkingInfo || 'Valet or nearby parking available', icon: CalendarDays },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.label} className="rounded-[18px] border border-gray-100 p-5 shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
                          <Icon className="h-5 w-5 text-gray-950" />
                          <p className="mt-4 text-xs font-bold uppercase text-gray-500">{item.label}</p>
                          <p className="mt-1 text-sm font-semibold text-gray-900">{item.value}</p>
                        </div>
                      )
                    })}
                  </div>
                </section>

                {venue.openingHours && (
                  <section className={sectionClassName}>
                    <h2 className="text-2xl font-bold text-gray-950">Opening hours</h2>
                    <div className="mt-5 divide-y divide-gray-100 rounded-[20px] border border-gray-100 px-5">
                      {Object.entries(venue.openingHours).map(([day, hours]) => (
                        <div key={day} className="flex items-center justify-between gap-4 py-3 text-sm">
                          <span className="font-semibold capitalize text-gray-950">{day}</span>
                          <span className="text-right text-gray-600">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              <Card className="rounded-[24px] border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.10)]">
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-600">Starting from</p>
                  <h2 className="mt-1 text-2xl font-bold text-gray-950">{venue.priceRange || 'On request'}</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">Send an enquiry for availability, guest count, and private event options.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">Event type</label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-2xl border-gray-200 bg-white px-4 shadow-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="corporate">Corporate event</SelectItem>
                        <SelectItem value="private">Private party</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Date</label>
                      <input type="date" className={fieldClassName} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase text-gray-500">Guests</label>
                      <input type="number" min="1" placeholder="50+" className={fieldClassName} />
                    </div>
                  </div>

                  <Button className="h-12 w-full text-base">
                    Check availability
                  </Button>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-gray-100 pt-5">
                  <a href={`tel:${venue.phone || ''}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gray-100 text-sm font-semibold text-gray-800 transition hover:bg-gray-200">
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a href={`mailto:${email}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gray-100 text-sm font-semibold text-gray-800 transition hover:bg-gray-200">
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </div>
              </Card>

              {(venue.website || venue.address) && (
                <Card className="rounded-[22px] border-gray-100 p-5 shadow-[0_4px_18px_rgba(0,0,0,0.05)]">
                  <h2 className="text-base font-bold text-gray-950">Location and contact</h2>
                  {venue.address && (
                    <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-gray-600">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-gray-950" />
                      {venue.address}
                    </p>
                  )}
                  {venue.website && (
                    <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <Globe2 className="h-4 w-4 text-gray-950" />
                      {venue.website}
                    </p>
                  )}
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default VenueDetailsPage
