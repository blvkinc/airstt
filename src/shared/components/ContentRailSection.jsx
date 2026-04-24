const ContentRailSection = ({
  title,
  subtitle,
  items = [],
  renderItem,
  getItemKey,
  sectionClassName = 'space-y-4',
  headerClassName = 'flex items-end justify-between gap-4',
  titleClassName = 'text-3xl font-bold text-gray-900 mb-2',
  subtitleClassName = 'text-gray-500 text-lg',
  railClassName = 'flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory',
  itemClassName = 'min-w-[280px] sm:min-w-[320px] max-w-[320px] snap-start flex-shrink-0',
}) => {
  if (!Array.isArray(items) || items.length === 0 || typeof renderItem !== 'function') {
    return null
  }

  return (
    <section className={sectionClassName}>
      {(title || subtitle) && (
        <div className={headerClassName}>
          <div>
            {title && <h3 className={titleClassName}>{title}</h3>}
            {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
          </div>
        </div>
      )}

      <div className={railClassName}>
        {items.map((item, index) => (
          <div key={getItemKey ? getItemKey(item, index) : index} className={itemClassName}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </section>
  )
}

export default ContentRailSection
