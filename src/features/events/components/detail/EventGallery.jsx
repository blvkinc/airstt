import { DetailMediaGallery } from '../../../../shared/components/detail/DetailMediaGallery'

export function EventGallery({ event }) {
  return <DetailMediaGallery title={event.title} images={event.images} showAllPhotosLabel="Show all photos" />
}
