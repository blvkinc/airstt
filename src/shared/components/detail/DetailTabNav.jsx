export function DetailTabNav({ tabs, activeTab, onTabChange, className = 'mb-8' }) {
  return (
    <div className={className}>
      <nav className="inline-flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-gray-100 p-1 shadow-inner shadow-black/[0.03]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`h-10 shrink-0 rounded-xl px-5 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-950 shadow-sm ring-1 ring-black/[0.04]'
                : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
