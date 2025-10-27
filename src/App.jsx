import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import ScanWebsite from './pages/ScanWebsite'
import ScanResults from './pages/ScanResults'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'scan':
        return <ScanWebsite />
      case 'results':
        return <ScanResults />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

export default App
