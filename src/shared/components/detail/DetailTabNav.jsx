export function DetailTabNav({ tabs, activeTab, onTabChange, className = 'mb-8' }) {
  return (
    <div className={className}>
      <nav className="flex space-x-8 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`pb-4 px-1 font-medium text-sm transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
