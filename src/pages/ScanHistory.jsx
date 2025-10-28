import { useState, useEffect } from 'react'
import AdvancedSearch from '../components/AdvancedSearch'
import ExportButton from '../components/ExportButton'

const ScanHistory = () => {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedScans, setSelectedScans] = useState([])
  const [selectedScan, setSelectedScan] = useState(null)

  useEffect(() => {
    loadScans()
  }, [])

  const loadScans = async () => {
    try {
      const response = await fetch('/api/scans')
      if (response.ok) {
        const data = await response.json()
        setScans(data.reverse())
      }
    } catch (error) {
      console.error('Failed to load scans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (filters) => {
    setLoading(true)
    try {
      const response = await fetch('/api/scans/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })
      
      if (response.ok) {
        const data = await response.json()
        setScans(data.scans)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    loadScans()
  }

  const toggleScanSelection = (scanId) => {
    setSelectedScans(prev => 
      prev.includes(scanId)
        ? prev.filter(id => id !== scanId)
        : [...prev, scanId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedScans.length === scans.length) {
      setSelectedScans([])
    } else {
      setSelectedScans(scans.map(s => s.id))
    }
  }

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-purple-100 text-purple-800 border-purple-300',
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-orange-100 text-orange-800 border-orange-300',
      low: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
    return colors[severity?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading scan history...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Scan History</h1>
          <p className="text-gray-600 mt-1">
            Total: {scans.length} scans
            {selectedScans.length > 0 && ` | Selected: ${selectedScans.length}`}
          </p>
        </div>
        
        {selectedScans.length > 0 && (
          <div className="flex gap-3">
            <ExportButton scanIds={selectedScans} />
            <button
              onClick={() => setSelectedScans([])}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Advanced Search Component */}
      <AdvancedSearch onSearch={handleSearch} onClear={handleClearSearch} />

      {/* Bulk Actions */}
      {scans.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedScans.length === scans.length && scans.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 font-medium">
                Select All ({scans.length})
              </span>
            </label>
          </div>
          
          <div className="text-sm text-gray-600">
            {selectedScans.length > 0 ? (
              <span className="font-medium text-blue-600">
                {selectedScans.length} scan{selectedScans.length > 1 ? 's' : ''} selected
              </span>
            ) : (
              <span>Select scans to export in bulk</span>
            )}
          </div>
        </div>
      )}

      {/* Scan List */}
      {scans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No scans found</h3>
          <p className="text-gray-600">Try adjusting your search filters or perform a new scan.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                selectedScans.includes(scan.id) ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedScans.includes(scan.id)}
                      onChange={() => toggleScanSelection(scan.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Scan Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {scan.url}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDate(scan.timestamp)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <ExportButton scanId={scan.id} single={true} />
                        <button
                          onClick={() => setSelectedScan(selectedScan?.id === scan.id ? null : scan)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                        >
                          {selectedScan?.id === scan.id ? 'Hide' : 'Details'}
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 text-sm">Vulnerabilities:</span>
                        <span className="font-semibold text-gray-900">
                          {scan.vulnerabilities?.length || 0}
                        </span>
                      </div>
                      
                      {scan.risk_score !== undefined && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">Risk Score:</span>
                          <span className={`font-semibold ${
                            scan.risk_score >= 80 ? 'text-green-600' :
                            scan.risk_score >= 60 ? 'text-orange-600' : 'text-red-600'
                          }`}>
                            {scan.risk_score}/100
                          </span>
                        </div>
                      )}

                      {scan.scanner_version && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 text-sm">Scanner:</span>
                          <span className="text-gray-900 text-sm font-medium">
                            {scan.scanner_version}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Severity Tags */}
                    {scan.vulnerabilities && scan.vulnerabilities.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(scan.vulnerabilities.map(v => v.severity))].map(severity => (
                          <span
                            key={severity}
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(severity)}`}
                          >
                            {severity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedScan?.id === scan.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">Vulnerabilities Found:</h4>
                    {scan.vulnerabilities && scan.vulnerabilities.length > 0 ? (
                      <div className="space-y-3">
                        {scan.vulnerabilities.map((vuln, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(vuln.severity)}`}>
                                  {vuln.severity}
                                </span>
                                <h5 className="font-medium text-gray-900 mt-2">
                                  {vuln.type || 'Unknown Vulnerability'}
                                </h5>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {vuln.description || 'No description available'}
                            </p>
                            {vuln.location && (
                              <p className="text-xs text-gray-500">
                                <span className="font-medium">Location:</span> {vuln.location}
                              </p>
                            )}
                            {vuln.recommendation && (
                              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs text-blue-800">
                                  <span className="font-medium">💡 Recommendation:</span> {vuln.recommendation}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">No vulnerabilities detected.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ScanHistory
