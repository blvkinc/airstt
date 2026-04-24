import { motion } from 'framer-motion'

const defaultChipTransition = { duration: 0.5, ease: 'easeOut' }

const isItemSelected = (selectedCategory, item, label) => {
  if (Array.isArray(selectedCategory)) {
    return selectedCategory.includes(item.id) || selectedCategory.includes(label)
  }

  if (selectedCategory?.id) {
    return selectedCategory.id === item.id
  }

  return selectedCategory?.displayName === label || selectedCategory === label
}

export default function PublicCategoryPillRow({
  items = [],
  selectedCategory = null,
  onSelect,
  rowClassName = 'flex flex-wrap justify-center gap-3 mt-8',
  selectedItemClassName,
  itemClassName,
  getItemKey = (item) => item.id ?? item.slug ?? item.name,
  getItemLabel = (item) => item.displayName ?? item.name ?? item.slug,
}) {
  if (items.length === 0) return null

  return (
    <motion.div
      className={rowClassName}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {items.map((item, index) => {
        const label = getItemLabel(item)
        if (!label) return null

        const selected = isItemSelected(selectedCategory, item, label)

        return (
          <motion.button
            key={getItemKey(item) ?? label}
            type="button"
            onClick={() => onSelect?.(item)}
            className={selected ? selectedItemClassName : itemClassName}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...defaultChipTransition, delay: 0.7 + (index * 0.1) }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {label}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
