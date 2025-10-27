import { useState } from 'react'

const ScanWebsite = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [scanConfig, setScanConfig] = useState({
    port_scan: true,
    subdomain_enum: false,
    directory_enum: false,
    xss_test: false,
    sql_test: false,
    use_external_tools: false
  })

  const handleScan = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const endpoint = advancedMode ? '/advanced-scan' : '/scan'
      const body = advancedMode ? { url, config: scanConfig } : { url }
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Scan failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to scan website. Make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-green-100 text-green-800 border-green-300'
    }
  }

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getRiskScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-orange-100'
    return 'bg-red-100'
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Scan Website</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleScan}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
              Target URL
            </label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-gray-500 text-xs mt-2">
              Masukkan URL lengkap termasuk protocol (http:// atau https://)
            </p>
          </div>

          {/* Advanced Scan Toggle */}
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={advancedMode}
                onChange={(e) => setAdvancedMode(e.target.checked)}
                className="mr-2"
              />
              <span className="text-gray-700 font-semibold">🔬 Advanced Scan Mode</span>
            </label>
          </div>

          {/* Advanced Configuration */}
          {advancedMode && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-3">Scan Configuration</h3>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scanConfig.port_scan}
                    onChange={(e) => setScanConfig({...scanConfig, port_scan: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Port Scanning</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scanConfig.subdomain_enum}
                    onChange={(e) => setScanConfig({...scanConfig, subdomain_enum: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Subdomain Enumeration</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scanConfig.directory_enum}
                    onChange={(e) => setScanConfig({...scanConfig, directory_enum: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">Directory Enumeration</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scanConfig.xss_test}
                    onChange={(e) => setScanConfig({...scanConfig, xss_test: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">XSS Testing</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scanConfig.sql_test}
                    onChange={(e) => setScanConfig({...scanConfig, sql_test: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">SQL Injection Testing</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={scanConfig.use_external_tools}
                    onChange={(e) => setScanConfig({...scanConfig, use_external_tools: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-600">External Tools (nmap, etc.)</span>
                </label>
              </div>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                {advancedMode ? 'Running Deep Scan...' : 'Scanning...'}
              </span>
            ) : (
              `🔍 ${advancedMode ? 'Start Advanced Scan' : 'Start Scan'}`
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Risk Score Section */}
          {result.risk_score !== undefined && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Risk Assessment</h2>
              <div className="flex items-center justify-center">
                <div className={`w-48 h-48 rounded-full flex items-center justify-center ${getRiskScoreBg(result.risk_score)}`}>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getRiskScoreColor(result.risk_score)}`}>
                      {result.risk_score}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Risk Score</div>
                    <div className={`text-lg font-semibold mt-1 ${getRiskScoreColor(result.risk_score)}`}>
                      {result.risk_level?.level || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="ml-8 flex-1">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Security Level</span>
                      <span className="text-sm font-medium text-gray-700">{result.risk_score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all ${
                          result.risk_score >= 80 ? 'bg-green-600' : 
                          result.risk_score >= 60 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${result.risk_score}%` }}
                      ></div>
                    </div>
                  </div>
                  {result.summary && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50 p-3 rounded">
                        <div className="text-2xl font-bold text-purple-600">{result.summary.critical || 0}</div>
                        <div className="text-xs text-gray-600">Critical</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-2xl font-bold text-red-600">{result.summary.high || 0}</div>
                        <div className="text-xs text-gray-600">High</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded">
                        <div className="text-2xl font-bold text-orange-600">{result.summary.medium || 0}</div>
                        <div className="text-xs text-gray-600">Medium</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded">
                        <div className="text-2xl font-bold text-yellow-600">{result.summary.low || 0}</div>
                        <div className="text-xs text-gray-600">Low</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scan Results</h2>
            
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Target URL</p>
                  <p className="font-semibold text-gray-800">{result.url}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-semibold ${result.status === 'Up' || result.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.status === 'Up' || result.status === 'completed' ? '✅ ' : '❌ '}
                    {result.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scan Type</p>
                  <p className="font-semibold text-gray-800">{result.scan_type || 'basic'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scan Time</p>
                  <p className="font-semibold text-gray-800">{new Date(result.timestamp).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>

            {/* Vulnerabilities */}
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Vulnerabilities Detected</h3>
            
            {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
              <div className="space-y-3">
                {result.vulnerabilities.map((vuln, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getSeverityColor(vuln.severity)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-bold">{vuln.type}</span>
                          <span className="px-2 py-1 text-xs font-semibold rounded bg-white">
                            {vuln.severity}
                          </span>
                          {vuln.category && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                              {vuln.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm mb-2">{vuln.description}</p>
                        {vuln.recommendation && (
                          <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs">
                            <span className="font-semibold">💡 Recommendation: </span>
                            {vuln.recommendation}
                          </div>
                        )}
                        {vuln.details && (
                          <details className="mt-2">
                            <summary className="text-xs font-semibold cursor-pointer">Show Details</summary>
                            <pre className="text-xs mt-2 p-2 bg-white bg-opacity-50 rounded overflow-auto">
                              {JSON.stringify(vuln.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700">✅ Tidak ada vulnerability yang terdeteksi!</p>
              </div>
            )}
          </div>

          {/* Additional Findings */}
          {result.findings && (
            <div className="space-y-4">
              {/* Subdomains */}
              {result.findings.subdomains && result.findings.subdomains.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🔍 Discovered Subdomains</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.findings.subdomains.map((subdomain, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {subdomain}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Directories */}
              {result.findings.directories && result.findings.directories.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">📁 Hidden Paths Found</h3>
                  <div className="space-y-2">
                    {result.findings.directories.map((dir, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-mono text-sm">{dir.path}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded ${
                            dir.status === 200 ? 'bg-green-100 text-green-800' : 
                            dir.status === 403 ? 'bg-red-100 text-red-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            Status: {dir.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            dir.risk === 'High' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {dir.risk} Risk
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Open Ports */}
              {result.findings.open_ports && result.findings.open_ports.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🔓 Open Ports</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {result.findings.open_ports.map((port, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded text-center">
                        <div className="text-2xl font-bold text-gray-700">{port.port}</div>
                        <div className="text-xs text-gray-600">{port.service}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SSL Info */}
              {result.findings.ssl_info && Object.keys(result.findings.ssl_info).length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🔒 SSL/TLS Certificate Info</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {result.findings.ssl_info.version && (
                      <div>
                        <p className="text-sm text-gray-500">TLS Version</p>
                        <p className="font-semibold">{result.findings.ssl_info.version}</p>
                      </div>
                    )}
                    {result.findings.ssl_info.cipher && (
                      <div>
                        <p className="text-sm text-gray-500">Cipher Suite</p>
                        <p className="font-semibold text-xs">{result.findings.ssl_info.cipher[0]}</p>
                      </div>
                    )}
                    {result.findings.ssl_info.expires && (
                      <div>
                        <p className="text-sm text-gray-500">Expires</p>
                        <p className="font-semibold">{result.findings.ssl_info.expires}</p>
                      </div>
                    )}
                    {result.findings.ssl_info.days_until_expiry !== undefined && (
                      <div>
                        <p className="text-sm text-gray-500">Days Until Expiry</p>
                        <p className={`font-semibold ${
                          result.findings.ssl_info.days_until_expiry < 30 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {result.findings.ssl_info.days_until_expiry} days
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* External Tools Results */}
              {result.findings.tool_results && Object.keys(result.findings.tool_results).length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🛠️ External Tools Output</h3>
                  {Object.entries(result.findings.tool_results).map(([tool, output]) => (
                    <details key={tool} className="mb-3">
                      <summary className="font-semibold cursor-pointer text-blue-600 hover:text-blue-800">
                        {tool.toUpperCase()} Results
                      </summary>
                      <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-auto max-h-96">
                        {output}
                      </pre>
                    </details>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ScanWebsite
