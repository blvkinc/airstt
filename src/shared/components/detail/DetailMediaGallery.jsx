const fillGalleryImages = (images = [], fallbackImage = '') => {
  const sourceImages = images.filter(Boolean)

  if (!sourceImages.length && fallbackImage) {
    return Array(5).fill(fallbackImage)
  }

  if (sourceImages.length >= 5) {
    return sourceImages.slice(0, 5)
  }

  const repeated = [...sourceImages]

  while (repeated.length < 5) {
    repeated.push(sourceImages[repeated.length % sourceImages.length] || fallbackImage)
  }

  return repeated.slice(0, 5)
}

const galleryImageClassName = 'w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer'

export function DetailMediaGallery({
  title,
  images,
  fallbackImage,
  showAllPhotosLabel,
  className = 'max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-12',
  heightClassName = 'h-[300px] md:h-[500px]'
}) {
  const galleryImages = fillGalleryImages(images, fallbackImage)

  return (
    <div className={className}>
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-2 ${heightClassName} rounded-3xl overflow-hidden shadow-sm`}>
        <div className="md:col-span-2 relative h-full">
          <img src={galleryImages[0]} alt={title} className={galleryImageClassName} />
        </div>
        <div className="hidden md:flex flex-col gap-2 h-full">
          <div className="h-1/2 relative">
            <img src={galleryImages[1]} className={galleryImageClassName} alt={`${title} gallery 2`} />
          </div>
          <div className="h-1/2 relative">
            <img src={galleryImages[2]} className={galleryImageClassName} alt={`${title} gallery 3`} />
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-2 h-full">
          <div className="h-1/2 relative">
            <img src={galleryImages[3]} className={galleryImageClassName} alt={`${title} gallery 4`} />
          </div>
          <div className="h-1/2 relative">
            <img src={galleryImages[4]} className={galleryImageClassName} alt={`${title} gallery 5`} />
            {showAllPhotosLabel && (
              <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-md">
                {showAllPhotosLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
