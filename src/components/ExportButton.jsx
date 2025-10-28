import { useState } from 'react'

const ExportButton = ({ scanId, scanIds, single = false }) => {
  const [showMenu, setShowMenu] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async (format) => {
    setExporting(true)
    try {
      let url
      if (single && scanId) {
        // Single export
        url = `/api/export/${scanId}/${format}`
        const response = await fetch(url)
        if (response.ok) {
          const blob = await response.blob()
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `scan-${scanId}.${format}`
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
      } else if (scanIds && scanIds.length > 0) {
        // Bulk export
        const response = await fetch('/api/export/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scanIds, format })
        })
        
        if (response.ok) {
          const blob = await response.blob()
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `scans-bulk.${format}`
          document.body.appendChild(link)
          link.click()
          link.remove()
        }
      }
      setShowMenu(false)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={exporting}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          exporting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {exporting ? (
          <span className="flex items-center">
            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Exporting...
          </span>
        ) : (
          <>
            📥 Export {single ? '' : `(${scanIds?.length || 0})`}
          </>
        )}
      </button>

      {showMenu && !exporting && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
          <div className="py-2">
            <button
              onClick={() => handleExport('json')}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center"
            >
              <span className="mr-3">📄</span>
              <span>Export as JSON</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center"
            >
              <span className="mr-3">📊</span>
              <span>Export as CSV</span>
            </button>
            <button
              onClick={() => handleExport('txt')}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors flex items-center"
            >
              <span className="mr-3">📝</span>
              <span>Export as TXT</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportButton
