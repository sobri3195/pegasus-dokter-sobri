import { useState } from 'react'

const ScanWebsite = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleScan = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:5000/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
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
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Medium':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Low':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-green-100 text-green-800 border-green-300'
    }
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
                Scanning...
              </span>
            ) : (
              '🔍 Start Scan'
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hasil Scan</h2>
          
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Target URL</p>
                <p className="font-semibold text-gray-800">{result.url}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-semibold ${result.status === 'Up' ? 'text-green-600' : 'text-red-600'}`}>
                  {result.status === 'Up' ? '✅ ' : '❌ '}
                  {result.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">HTTP Status</p>
                <p className="font-semibold text-gray-800">{result.http_status || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scan Time</p>
                <p className="font-semibold text-gray-800">{new Date(result.timestamp).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Vulnerabilities Detected</h3>
          
          {result.vulnerabilities && result.vulnerabilities.length > 0 ? (
            <div className="space-y-3">
              {result.vulnerabilities.map((vuln, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getSeverityColor(vuln.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold">{vuln.type}</span>
                        <span className="px-2 py-1 text-xs font-semibold rounded">
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-sm">{vuln.description}</p>
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
      )}
    </div>
  )
}

export default ScanWebsite
