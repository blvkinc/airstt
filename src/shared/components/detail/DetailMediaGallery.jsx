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

const galleryImageClassName = 'h-full w-full cursor-pointer object-cover transition-transform duration-500 hover:scale-[1.015]'

export function DetailMediaGallery({
  title,
  images,
  fallbackImage,
  showAllPhotosLabel,
  className = 'max-w-7xl mx-auto px-4 md:px-8 mb-8 md:mb-12',
  heightClassName = 'h-[300px] md:h-[500px]'
}) {
  const galleryImages = fillGalleryImages(images, fallbackImage)

  return (
    <div className={className}>
      <div className={`grid grid-cols-1 gap-2 overflow-hidden rounded-[22px] ring-1 ring-black/[0.04] md:grid-cols-4 md:rounded-[24px] ${heightClassName}`}>
        <div className="relative h-full overflow-hidden md:col-span-2">
          <img src={galleryImages[0]} alt={title} className={galleryImageClassName} />
        </div>
        <div className="hidden h-full flex-col gap-2 md:flex">
          <div className="relative h-1/2 overflow-hidden">
            <img src={galleryImages[1]} className={galleryImageClassName} alt={`${title} gallery 2`} />
          </div>
          <div className="relative h-1/2 overflow-hidden">
            <img src={galleryImages[2]} className={galleryImageClassName} alt={`${title} gallery 3`} />
          </div>
        </div>
        <div className="hidden h-full flex-col gap-2 md:flex">
          <div className="relative h-1/2 overflow-hidden">
            <img src={galleryImages[3]} className={galleryImageClassName} alt={`${title} gallery 4`} />
          </div>
          <div className="relative h-1/2 overflow-hidden">
            <img src={galleryImages[4]} className={galleryImageClassName} alt={`${title} gallery 5`} />
            {showAllPhotosLabel && (
              <div className="absolute bottom-4 right-4 rounded-full bg-white px-3 py-1.5 text-sm font-semibold shadow-[0_6px_20px_rgba(0,0,0,0.16)]">
                {showAllPhotosLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
