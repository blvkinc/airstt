import { Link, Navigate, useParams } from 'react-router-dom'
import { useEventPackagesCatalog } from '../features/catalog'
import { getEventHref } from '../shared/lib/eventRoutes'

const PackagesPage = () => {
  const { eventId } = useParams()
  const { data: event, loading, error, retry } = useEventPackagesCatalog(eventId)

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading event packages...</div>
  if (error?.status === 404) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h2><Link to="/events" className="btn-primary">Browse Events</Link></div></div>
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Couldn't load event packages</h2><p className="text-gray-600 mb-4">{error.message}</p><button onClick={retry} className="text-brand-purple">Try again</button></div></div>
  if (!event?.id) return null

  return <Navigate to={`${getEventHref(event)}?tab=packages`} replace />
}

export default PackagesPage
