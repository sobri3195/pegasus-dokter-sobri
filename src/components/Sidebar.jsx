const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'scan', name: 'Scan Website', icon: '🔍' },
    { id: 'results', name: 'Hasil Scan', icon: '📋' },
    { id: 'history', name: 'Advanced Search', icon: '🔎' },
    { id: 'scheduler', name: 'Scheduler', icon: '⏰' },
    { id: 'comparison', name: 'Comparison', icon: '📊' },
  ]

  return (
    <div className="w-64 bg-gray-800 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-bold">🛡️ SecureAdmin</h1>
        <p className="text-sm text-gray-400 mt-1">Vulnerability Scanner</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full text-left px-6 py-3 flex items-center space-x-3 transition-colors ${
              currentPage === item.id
                ? 'bg-blue-600 border-l-4 border-blue-400'
                : 'hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
        <p className="text-xs text-gray-400">© 2024 SecureAdmin</p>
        <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
      </div>
    </div>
  )
}

export default Sidebar
