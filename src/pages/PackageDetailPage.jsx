import { Navigate, useSearchParams } from 'react-router-dom'

const PackageDetailPage = () => {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') || searchParams.get('event_id')

  if (eventId) {
    return <Navigate to={`/events/${eventId}?tab=packages`} replace />
  }

  return <Navigate to="/events" replace />
}

export default PackageDetailPage
