import { useState, useEffect } from 'react'

const ScanWebsite = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [ultimateMode, setUltimateMode] = useState(false)
  const [backendStatus, setBackendStatus] = useState('checking')
  const [scanConfig, setScanConfig] = useState({
    port_scan: true,
    subdomain_enum: false,
    directory_enum: false,
    xss_test: false,
    sql_test: false,
    use_external_tools: false
  })
  const [ultimateConfig, setUltimateConfig] = useState({
    active_exploit_test: true,
    form_fuzzer: true,
    js_scanner: true,
    recursive_crawl: true,
    tech_fingerprint: true,
    credential_check: true,
    generate_report: false,
    max_crawl_depth: 2,
    max_pages: 30
  })

  useEffect(() => {
    checkBackendStatus()
    const interval = setInterval(checkBackendStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('/api/health')
      if (response.ok) {
        setBackendStatus('connected')
      } else {
        setBackendStatus('disconnected')
      }
    } catch (err) {
      setBackendStatus('disconnected')
    }
  }

  const handleScan = async (e) => {
    e.preventDefault()
    
    if (backendStatus !== 'connected') {
      setError('Backend server is not running. Please start the backend server with "npm run backend" in a separate terminal.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let endpoint, body
      
      if (ultimateMode) {
        endpoint = '/ultimate-scan'
        body = { url, config: ultimateConfig }
      } else if (advancedMode) {
        endpoint = '/advanced-scan'
        body = { url, config: scanConfig }
      } else {
        endpoint = '/scan'
        body = { url }
      }
      
      const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Scan failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error('Scan error:', err)
      setError(err.message || 'Failed to scan website. Please check the console for more details.')
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Scan Website</h1>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            backendStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
            backendStatus === 'disconnected' ? 'bg-red-500' : 
            'bg-yellow-500'
          }`}></div>
          <span className={`text-sm font-medium ${
            backendStatus === 'connected' ? 'text-green-600' : 
            backendStatus === 'disconnected' ? 'text-red-600' : 
            'text-yellow-600'
          }`}>
            {backendStatus === 'connected' ? 'Backend Connected' : 
             backendStatus === 'disconnected' ? 'Backend Disconnected' : 
             'Checking Backend...'}
          </span>
        </div>
      </div>

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

          {/* Scan Mode Selection */}
          <div className="mb-4 space-y-2">
            <label className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="scanMode"
                checked={!advancedMode && !ultimateMode}
                onChange={() => {
                  setAdvancedMode(false)
                  setUltimateMode(false)
                }}
                className="mr-3"
              />
              <div>
                <span className="text-gray-700 font-semibold">🔍 Basic Scan</span>
                <p className="text-xs text-gray-500">Quick security check</p>
              </div>
            </label>
            
            <label className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="scanMode"
                checked={advancedMode && !ultimateMode}
                onChange={() => {
                  setAdvancedMode(true)
                  setUltimateMode(false)
                }}
                className="mr-3"
              />
              <div>
                <span className="text-gray-700 font-semibold">🔬 Advanced Scan</span>
                <p className="text-xs text-gray-500">Deep vulnerability analysis with configurable options</p>
              </div>
            </label>
            
            <label className="flex items-center cursor-pointer p-3 border-2 border-blue-500 rounded-lg hover:bg-blue-50">
              <input
                type="radio"
                name="scanMode"
                checked={ultimateMode}
                onChange={() => {
                  setAdvancedMode(false)
                  setUltimateMode(true)
                }}
                className="mr-3"
              />
              <div>
                <span className="text-blue-700 font-semibold">🚀 Ultimate Scanner</span>
                <p className="text-xs text-blue-600">AI-powered, safe exploit testing, form fuzzer, CVE matching & more!</p>
              </div>
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
          
          {/* Ultimate Scanner Configuration */}
          {ultimateMode && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                <span className="text-2xl mr-2">🚀</span>
                Ultimate Scanner Features
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <label className="flex items-center p-2 bg-white rounded">
                  <input
                    type="checkbox"
                    checked={ultimateConfig.active_exploit_test}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, active_exploit_test: e.target.checked})}
                    className="mr-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">🔬 Active Exploit Testing</span>
                    <p className="text-xs text-gray-500">Safe XSS, SQLi, LFI testing</p>
                  </div>
                </label>
                
                <label className="flex items-center p-2 bg-white rounded">
                  <input
                    type="checkbox"
                    checked={ultimateConfig.form_fuzzer}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, form_fuzzer: e.target.checked})}
                    className="mr-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">📝 Form Fuzzer</span>
                    <p className="text-xs text-gray-500">Auto-detect & test all forms</p>
                  </div>
                </label>
                
                <label className="flex items-center p-2 bg-white rounded">
                  <input
                    type="checkbox"
                    checked={ultimateConfig.js_scanner}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, js_scanner: e.target.checked})}
                    className="mr-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">📦 JS Library Scanner</span>
                    <p className="text-xs text-gray-500">Check libraries for CVEs</p>
                  </div>
                </label>
                
                <label className="flex items-center p-2 bg-white rounded">
                  <input
                    type="checkbox"
                    checked={ultimateConfig.recursive_crawl}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, recursive_crawl: e.target.checked})}
                    className="mr-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">🕸️ Recursive Crawl</span>
                    <p className="text-xs text-gray-500">Crawl all internal pages</p>
                  </div>
                </label>
                
                <label className="flex items-center p-2 bg-white rounded">
                  <input
                    type="checkbox"
                    checked={ultimateConfig.tech_fingerprint}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, tech_fingerprint: e.target.checked})}
                    className="mr-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">🧬 Tech Fingerprinting</span>
                    <p className="text-xs text-gray-500">Identify CMS & frameworks</p>
                  </div>
                </label>
                
                <label className="flex items-center p-2 bg-white rounded">
                  <input
                    type="checkbox"
                    checked={ultimateConfig.credential_check}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, credential_check: e.target.checked})}
                    className="mr-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">🔒 Credential Checker</span>
                    <p className="text-xs text-gray-500">Analyze login security</p>
                  </div>
                </label>
                
                <label className="flex items-center p-2 bg-white rounded">
                  <input
                    type="checkbox"
                    checked={ultimateConfig.generate_report}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, generate_report: e.target.checked})}
                    className="mr-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">📄 Generate Report</span>
                    <p className="text-xs text-gray-500">HTML & PDF reports</p>
                  </div>
                </label>
              </div>
              
              <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Max Crawl Depth</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={ultimateConfig.max_crawl_depth}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, max_crawl_depth: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Max Pages to Crawl</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={ultimateConfig.max_pages}
                    onChange={(e) => setUltimateConfig({...ultimateConfig, max_pages: parseInt(e.target.value)})}
                    className="w-full px-2 py-1 border rounded text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">
                  <strong>⚠️ Note:</strong> Ultimate scan may take 2-5 minutes depending on the target size and configuration.
                  All exploit tests run in safe mode and won't harm the target.
                </p>
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
                {ultimateMode ? 'Running Ultimate Scan...' : advancedMode ? 'Running Deep Scan...' : 'Scanning...'}
              </span>
            ) : (
              ultimateMode ? '🚀 Start Ultimate Scan' : advancedMode ? '🔬 Start Advanced Scan' : '🔍 Start Basic Scan'
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

              {/* Tech Stack */}
              {result.findings.tech_stack && result.findings.tech_stack.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🧬 Technology Stack Detected</h3>
                  <div className="space-y-3">
                    {result.findings.tech_stack.map((tech, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-lg">{tech.name}</span>
                            <span className="px-2 py-1 text-xs bg-gray-100 rounded">{tech.type}</span>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded ${
                            tech.risk_level === 'High' ? 'bg-red-100 text-red-800' :
                            tech.risk_level === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {tech.risk_level} Risk
                          </span>
                        </div>
                        {tech.version && (
                          <p className="text-sm text-gray-600">Version: {tech.version}</p>
                        )}
                        {tech.common_vulns && tech.common_vulns.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">Common vulnerabilities:</p>
                            <ul className="list-disc list-inside text-xs text-gray-600 ml-2">
                              {tech.common_vulns.map((vuln, i) => (
                                <li key={i}>{vuln}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CVE Matches */}
              {result.findings.cve_matches && result.findings.cve_matches.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🐛 CVE Matches</h3>
                  <div className="space-y-3">
                    {result.findings.cve_matches.map((cve, idx) => (
                      <div key={idx} className="p-4 border-l-4 border-red-500 bg-red-50 rounded">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-red-800">{cve.cve}</h4>
                            <p className="text-sm text-gray-700 mt-1">
                              {cve.library || cve.cms} {cve.version && `(${cve.version})`}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded ${
                            cve.severity === 'Critical' ? 'bg-purple-100 text-purple-800' :
                            cve.severity === 'High' ? 'bg-red-100 text-red-800' :
                            cve.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cve.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{cve.description}</p>
                        {cve.reference && (
                          <a 
                            href={cve.reference} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View on NVD →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Forms Detected */}
              {result.findings.forms && result.findings.forms.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 Forms Detected</h3>
                  <p className="text-gray-600 mb-3">Found {result.findings.forms.length} form(s) on the website</p>
                  <div className="space-y-3">
                    {result.findings.forms.slice(0, 5).map((form, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{form.method} Form</span>
                          <span className="text-xs text-gray-500">{form.inputs?.length || 0} inputs</span>
                        </div>
                        <p className="text-xs text-gray-600 font-mono">{form.action || form.url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JS Libraries */}
              {result.findings.js_libraries && result.findings.js_libraries.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">📦 JavaScript Libraries</h3>
                  <div className="space-y-2">
                    {result.findings.js_libraries.map((lib, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded border flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{lib.name}</span>
                          {lib.version && (
                            <span className="ml-2 text-sm text-gray-600">v{lib.version}</span>
                          )}
                        </div>
                        {lib.check_cve && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            CVE Checked
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Crawled Pages */}
              {result.findings.crawled_pages && result.findings.crawled_pages.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🕸️ Crawled Pages</h3>
                  <p className="text-gray-600 mb-3">Crawled {result.findings.crawled_pages.length} page(s)</p>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {result.findings.crawled_pages.map((page, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-blue-600 truncate flex-1">{page.url}</span>
                          <div className="flex items-center space-x-2 ml-2">
                            <span className={`px-2 py-1 rounded ${
                              page.status_code === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {page.status_code}
                            </span>
                            <span className="text-gray-500">Depth: {page.depth}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Credential Issues */}
              {result.findings.credentials_issues && result.findings.credentials_issues.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🔒 Credential Security Issues</h3>
                  <div className="space-y-3">
                    {result.findings.credentials_issues.map((cred, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm">{cred.url}</span>
                          <span className={`px-3 py-1 text-xs font-semibold rounded ${
                            cred.security_label === 'Weak' ? 'bg-red-100 text-red-800' :
                            cred.security_label === 'Medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {cred.security_label}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {cred.issues.map((issue, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded text-sm">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{issue.issue}</span>
                                <span className={`px-2 py-1 text-xs rounded ${
                                  issue.severity === 'Critical' ? 'bg-purple-100 text-purple-800' :
                                  issue.severity === 'High' ? 'bg-red-100 text-red-800' :
                                  issue.severity === 'Medium' ? 'bg-orange-100 text-orange-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {issue.severity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{issue.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              {result.statistics && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">📊 Scan Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-blue-50 rounded text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.statistics.total_vulnerabilities || 0}</div>
                      <div className="text-xs text-gray-600">Total Vulnerabilities</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded text-center">
                      <div className="text-2xl font-bold text-purple-600">{result.statistics.pages_crawled || 0}</div>
                      <div className="text-xs text-gray-600">Pages Crawled</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded text-center">
                      <div className="text-2xl font-bold text-green-600">{result.statistics.forms_found || 0}</div>
                      <div className="text-xs text-gray-600">Forms Found</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded text-center">
                      <div className="text-2xl font-bold text-orange-600">{result.statistics.js_libraries_found || 0}</div>
                      <div className="text-xs text-gray-600">JS Libraries</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded text-center">
                      <div className="text-2xl font-bold text-red-600">{result.statistics.cve_matches || 0}</div>
                      <div className="text-xs text-gray-600">CVE Matches</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded text-center">
                      <div className="text-2xl font-bold text-yellow-600">{result.statistics.tech_stack_detected || 0}</div>
                      <div className="text-xs text-gray-600">Technologies</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reports */}
              {result.reports && (result.reports.html || result.reports.pdf) && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">📄 Generated Reports</h3>
                  <div className="flex space-x-4">
                    {result.reports.html && (
                      <a 
                        href={result.reports.html}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                      >
                        📄 Download HTML Report
                      </a>
                    )}
                    {result.reports.pdf && (
                      <a 
                        href={result.reports.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                      >
                        📑 Download PDF Report
                      </a>
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
