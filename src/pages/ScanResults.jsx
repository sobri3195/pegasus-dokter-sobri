import { useState, useEffect } from 'react'

const ScanResults = () => {
  const [scans, setScans] = useState([])
  const [filteredScans, setFilteredScans] = useState([])
  const [selectedScan, setSelectedScan] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    loadScans()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [scans, searchTerm, statusFilter, severityFilter, dateFilter])

  const loadScans = async () => {
    try {
      const response = await fetch('/api/scans')
      if (response.ok) {
        const data = await response.json()
        setScans(data.reverse())
      }
    } catch (error) {
      console.log('No scan history available')
      setScans([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...scans]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(scan => 
        scan.url.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(scan => scan.status === statusFilter)
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(scan => 
        scan.vulnerabilities.some(v => v.severity === severityFilter)
      )
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(scan => {
        const scanDate = new Date(scan.timestamp)
        const diffTime = Math.abs(now - scanDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        switch (dateFilter) {
          case 'today':
            return diffDays <= 1
          case 'week':
            return diffDays <= 7
          case 'month':
            return diffDays <= 30
          default:
            return true
        }
      })
    }

    setFilteredScans(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setSeverityFilter('all')
    setDateFilter('all')
  }

  // Export to JSON
  const exportToJSON = (scan = null) => {
    const dataToExport = scan || filteredScans
    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = scan 
      ? `scan-${scan.url.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.json`
      : `scan-history-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['URL', 'Status', 'HTTP Status', 'Vulnerabilities', 'Timestamp']
    const rows = filteredScans.map(scan => [
      scan.url,
      scan.status,
      scan.http_status || 'N/A',
      scan.vulnerabilities.length,
      new Date(scan.timestamp).toLocaleString('id-ID')
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `scan-history-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Export single scan to detailed text report
  const exportToReport = (scan) => {
    const report = `
VULNERABILITY SCAN REPORT
=========================

Target URL: ${scan.url}
Status: ${scan.status}
HTTP Status: ${scan.http_status || 'N/A'}
Scan Date: ${new Date(scan.timestamp).toLocaleString('id-ID')}
Total Vulnerabilities: ${scan.vulnerabilities.length}

SECURITY HEADERS:
-----------------
${Object.entries(scan.security_headers || {}).map(([key, value]) => 
  `${key}: ${value ? '✓ Present' : '✗ Missing'}`
).join('\n')}

VULNERABILITIES DETECTED:
-------------------------
${scan.vulnerabilities.length > 0 
  ? scan.vulnerabilities.map((v, i) => `
${i + 1}. ${v.type}
   Severity: ${v.severity}
   Description: ${v.description}
`).join('\n')
  : 'No vulnerabilities detected.'}

SSL/TLS INFORMATION:
--------------------
${scan.ssl_info ? `
Valid: ${scan.ssl_info.valid ? 'Yes' : 'No'}
Issuer: ${scan.ssl_info.issuer || 'N/A'}
Expires: ${scan.ssl_info.expires || 'N/A'}
` : 'Not available'}

---
Report generated: ${new Date().toLocaleString('id-ID')}
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `scan-report-${scan.url.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-orange-100 text-orange-800'
      case 'Low':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  const getSeverityBadge = (severity) => {
    const colors = {
      High: 'bg-red-500',
      Medium: 'bg-orange-500',
      Low: 'bg-yellow-500',
    }
    return colors[severity] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-blue-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-4 text-gray-600">Loading scan results...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Hasil Scan</h1>
        
        {/* Export Buttons */}
        {scans.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportToJSON()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <span>Export JSON</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter Section */}
      {scans.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">🔍 Filter & Search</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear All Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search URL
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by URL..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Up">Up</option>
                <option value="Down">Down</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Severity
              </label>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severity</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Filter Results Info */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredScans.length} of {scans.length} scans
          </div>
        </div>
      )}

      {filteredScans.length === 0 && scans.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Tidak Ada Hasil
          </h3>
          <p className="text-gray-500">
            Tidak ada scan yang sesuai dengan filter yang dipilih
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      ) : scans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <span className="text-6xl mb-4 block">📋</span>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Belum Ada Riwayat Scan
          </h3>
          <p className="text-gray-500">
            Mulai scan website untuk melihat riwayat dan hasil scan
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vulnerabilities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waktu Scan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredScans.map((scan, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{scan.url}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          scan.status === 'Up'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {scan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-1">
                        {scan.vulnerabilities.map((vuln, i) => (
                          <span
                            key={i}
                            className={`w-3 h-3 rounded-full ${getSeverityBadge(vuln.severity)}`}
                            title={`${vuln.severity}: ${vuln.type}`}
                          ></span>
                        ))}
                        {scan.vulnerabilities.length === 0 && (
                          <span className="text-sm text-gray-500">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(scan.timestamp).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedScan(scan)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => exportToJSON(scan)}
                          className="text-green-600 hover:text-green-900"
                          title="Export JSON"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => exportToReport(scan)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Export Report"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedScan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Detail Scan</h2>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Target URL</p>
                    <p className="font-semibold text-gray-800">{selectedScan.url}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className={`font-semibold ${selectedScan.status === 'Up' ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedScan.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">HTTP Status</p>
                    <p className="font-semibold text-gray-800">{selectedScan.http_status || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Scan Time</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedScan.timestamp).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Export buttons in modal */}
              <div className="mb-4 flex space-x-2">
                <button
                  onClick={() => exportToJSON(selectedScan)}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                  </svg>
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => exportToReport(selectedScan)}
                  className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export Report</span>
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Vulnerabilities</h3>
              
              {selectedScan.vulnerabilities.length > 0 ? (
                <div className="space-y-3">
                  {selectedScan.vulnerabilities.map((vuln, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${getSeverityColor(vuln.severity)}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold">{vuln.type}</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getSeverityColor(vuln.severity)}`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-sm">{vuln.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700">✅ Tidak ada vulnerability yang terdeteksi!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ScanResults
