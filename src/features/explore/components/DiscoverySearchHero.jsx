import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import PublicCategoryPillRow from '../../../shared/components/PublicCategoryPillRow'
import { Button } from '../../../shared/ui/button'

const defaultContainerTransition = { duration: 0.8, ease: 'easeOut' }

export default function DiscoverySearchHero({
  backgroundImage,
  backgroundAlt,
  title,
  description,
  searchPlaceholder,
  searchTerm,
  onSearchTermChange,
  onSearch,
  onSearchKeyDown,
  searchButtonClassName,
  searchButtonStyle,
  categoryItems = [],
  selectedCategory,
  onCategorySelect,
  selectedCategoryClassName,
  categoryClassName,
  contentClassName = 'relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8',
  chipRowClassName = 'flex flex-wrap justify-center gap-2 mt-4',
}) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          src={backgroundImage}
          alt={backgroundAlt}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      <div className={contentClassName}>
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={defaultContainerTransition}
        >
          {title}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/80 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...defaultContainerTransition, delay: 0.2 }}
        >
          {description}
        </motion.p>

        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...defaultContainerTransition, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-20"
          >
            <div className="bg-white p-2 rounded-full shadow-2xl flex items-center pl-4 sm:pl-6 pr-2 py-2">
              <Search strokeWidth={1.5} className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 shrink-0" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(event) => onSearchTermChange(event.target.value)}
                onKeyDown={onSearchKeyDown}
                className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder:text-gray-400 text-base sm:text-lg w-full min-w-0"
              />
              <Button
                onClick={onSearch}
                className={searchButtonClassName}
                style={searchButtonStyle}
              >
                Search
              </Button>
            </div>
          </motion.div>

          <PublicCategoryPillRow
            items={categoryItems}
            selectedCategory={selectedCategory}
            onSelect={onCategorySelect}
            rowClassName={chipRowClassName}
            selectedItemClassName={selectedCategoryClassName}
            itemClassName={categoryClassName}
          />
        </motion.div>
      </div>
    </section>
  )
}
