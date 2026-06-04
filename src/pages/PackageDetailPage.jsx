import { Navigate, useSearchParams } from 'react-router-dom'
import { getEventHref } from '../shared/lib/eventRoutes'

const PackageDetailPage = () => {
  const [searchParams] = useSearchParams()
  const eventId = searchParams.get('eventId') || searchParams.get('event_id')

  if (eventId) {
    return <Navigate to={`${getEventHref({ eventId })}?tab=packages`} replace />
  }

  return <Navigate to="/events" replace />
}

export default PackageDetailPage
