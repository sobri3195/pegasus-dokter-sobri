import { useState, useEffect } from 'react'

const ScanComparison = () => {
  const [scans, setScans] = useState([])
  const [selectedScan1, setSelectedScan1] = useState('')
  const [selectedScan2, setSelectedScan2] = useState('')
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [timeline, setTimeline] = useState(null)
  const [timelineUrl, setTimelineUrl] = useState('')

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
    }
  }

  const handleCompare = async () => {
    if (!selectedScan1 || !selectedScan2) {
      alert('Please select two scans to compare')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/scans/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanId1: selectedScan1, scanId2: selectedScan2 })
      })

      if (response.ok) {
        const data = await response.json()
        setComparison(data)
      }
    } catch (error) {
      console.error('Comparison failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTimeline = async () => {
    if (!timelineUrl) {
      alert('Please enter a URL to view timeline')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/scans/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: timelineUrl })
      })

      if (response.ok) {
        const data = await response.json()
        setTimeline(data)
      }
    } catch (error) {
      console.error('Timeline loading failed:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📊 Scan Comparison</h1>
        <p className="text-gray-600 mt-1">Compare scan results and track improvements</p>
      </div>

      {/* Comparison Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Compare Two Scans</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Scan (Older)
            </label>
            <select
              value={selectedScan1}
              onChange={(e) => setSelectedScan1(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a scan...</option>
              {scans.map((scan) => (
                <option key={scan.id} value={scan.id}>
                  {scan.url} - {formatDate(scan.timestamp)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Scan (Newer)
            </label>
            <select
              value={selectedScan2}
              onChange={(e) => setSelectedScan2(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a scan...</option>
              {scans.map((scan) => (
                <option key={scan.id} value={scan.id}>
                  {scan.url} - {formatDate(scan.timestamp)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? 'Comparing...' : '🔄 Compare Scans'}
        </button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Comparison Results</h2>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${
              comparison.differences.improvement ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  comparison.differences.improvement ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparison.differences.riskScoreChange > 0 ? '+' : ''}
                  {comparison.differences.riskScoreChange}
                </div>
                <div className="text-sm text-gray-600">Risk Score Change</div>
                <div className={`text-sm font-medium mt-2 ${
                  comparison.differences.improvement ? 'text-green-600' : 'text-red-600'
                }`}>
                  {comparison.differences.improvement ? '✓ Improved' : '✗ Worsened'}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              comparison.differences.fixedVulnerabilities > 0 ? 'bg-green-50' : 'bg-gray-50'
            }`}>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {comparison.differences.fixedVulnerabilities}
                </div>
                <div className="text-sm text-gray-600">Fixed Vulnerabilities</div>
                <div className="text-xs text-gray-500 mt-2">
                  {comparison.differences.fixedVulnTypes.join(', ') || 'None'}
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              comparison.differences.newVulnerabilities > 0 ? 'bg-red-50' : 'bg-gray-50'
            }`}>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {comparison.differences.newVulnerabilities}
                </div>
                <div className="text-sm text-gray-600">New Vulnerabilities</div>
                <div className="text-xs text-gray-500 mt-2">
                  {comparison.differences.newVulnTypes.join(', ') || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scan 1 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Scan 1 (Older)</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">URL:</span> {comparison.scan1.url}</p>
                <p><span className="font-medium">Date:</span> {formatDate(comparison.scan1.timestamp)}</p>
                <p><span className="font-medium">Total Vulnerabilities:</span> {comparison.scan1.totalVulnerabilities}</p>
                <p><span className="font-medium">Risk Score:</span> {comparison.scan1.riskScore}/100</p>
                
                <div className="mt-4">
                  <p className="font-medium mb-2">Severity Breakdown:</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Critical:</span>
                      <span className="font-semibold text-purple-600">{comparison.scan1.severityCounts.critical}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>High:</span>
                      <span className="font-semibold text-red-600">{comparison.scan1.severityCounts.high}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Medium:</span>
                      <span className="font-semibold text-orange-600">{comparison.scan1.severityCounts.medium}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Low:</span>
                      <span className="font-semibold text-yellow-600">{comparison.scan1.severityCounts.low}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scan 2 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Scan 2 (Newer)</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">URL:</span> {comparison.scan2.url}</p>
                <p><span className="font-medium">Date:</span> {formatDate(comparison.scan2.timestamp)}</p>
                <p><span className="font-medium">Total Vulnerabilities:</span> {comparison.scan2.totalVulnerabilities}</p>
                <p><span className="font-medium">Risk Score:</span> {comparison.scan2.riskScore}/100</p>
                
                <div className="mt-4">
                  <p className="font-medium mb-2">Severity Breakdown:</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Critical:</span>
                      <span className="font-semibold text-purple-600">{comparison.scan2.severityCounts.critical}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>High:</span>
                      <span className="font-semibold text-red-600">{comparison.scan2.severityCounts.high}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Medium:</span>
                      <span className="font-semibold text-orange-600">{comparison.scan2.severityCounts.medium}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Low:</span>
                      <span className="font-semibold text-yellow-600">{comparison.scan2.severityCounts.low}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Scan Timeline</h2>
        
        <div className="flex gap-3 mb-4">
          <input
            type="url"
            value={timelineUrl}
            onChange={(e) => setTimelineUrl(e.target.value)}
            placeholder="Enter URL to view scan timeline..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={loadTimeline}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Loading...' : '📈 View Timeline'}
          </button>
        </div>

        {timeline && (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">URL: {timeline.url}</h3>
              <p className="text-sm text-gray-600">Total Scans: {timeline.totalScans}</p>
            </div>

            {timeline.timeline.length > 0 ? (
              <div className="space-y-4">
                {timeline.timeline.map((scan, index) => (
                  <div key={scan.id} className="relative pl-8 pb-4 border-l-2 border-gray-300">
                    <div className="absolute left-0 top-0 -ml-2 w-4 h-4 bg-blue-600 rounded-full"></div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {formatDate(scan.timestamp)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          scan.riskScore >= 80 ? 'bg-green-100 text-green-800' :
                          scan.riskScore >= 60 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          Risk: {scan.riskScore}/100
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Total:</span> {scan.totalVulnerabilities}
                        </div>
                        <div>
                          <span className="font-medium text-purple-600">Critical:</span> {scan.severityCounts.critical}
                        </div>
                        <div>
                          <span className="font-medium text-red-600">High:</span> {scan.severityCounts.high}
                        </div>
                        <div>
                          <span className="font-medium text-orange-600">Medium:</span> {scan.severityCounts.medium}
                        </div>
                      </div>

                      {index > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          Change: {scan.totalVulnerabilities - timeline.timeline[index - 1].totalVulnerabilities > 0 ? '+' : ''}
                          {scan.totalVulnerabilities - timeline.timeline[index - 1].totalVulnerabilities} vulnerabilities
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-8">No scans found for this URL</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ScanComparison
