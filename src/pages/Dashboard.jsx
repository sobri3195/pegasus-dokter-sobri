import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    totalVulnerabilities: 0,
    severityCounts: { critical: 0, high: 0, medium: 0, low: 0 },
    averageRiskScore: 0,
    recentScans: []
  })
  const [trends, setTrends] = useState([])

  useEffect(() => {
    loadStats()
    loadTrends()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadStats()
      loadTrends()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.log('Failed to load stats')
    }
  }

  const loadTrends = async () => {
    try {
      const response = await fetch('/api/trends')
      if (response.ok) {
        const data = await response.json()
        setTrends(data)
      }
    } catch (error) {
      console.log('Failed to load trends')
    }
  }

  const statCards = [
    {
      title: 'Total Scans',
      value: stats.totalScans,
      icon: '📊',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Vulnerabilities',
      value: stats.totalVulnerabilities,
      icon: '🔍',
      color: 'bg-purple-500',
    },
    {
      title: 'Critical Issues',
      value: stats.severityCounts.critical,
      icon: '🔴',
      color: 'bg-red-500',
    },
    {
      title: 'Average Risk Score',
      value: stats.averageRiskScore,
      icon: '📈',
      color: stats.averageRiskScore >= 80 ? 'bg-green-500' : stats.averageRiskScore >= 60 ? 'bg-orange-500' : 'bg-red-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Vulnerability Distribution</h2>
          {stats.severityCounts && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Critical</span>
                <span className="text-sm font-bold text-purple-600">{stats.severityCounts.critical || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalVulnerabilities > 0 ? (stats.severityCounts.critical / stats.totalVulnerabilities * 100) : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">High</span>
                <span className="text-sm font-bold text-red-600">{stats.severityCounts.high || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalVulnerabilities > 0 ? (stats.severityCounts.high / stats.totalVulnerabilities * 100) : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Medium</span>
                <span className="text-sm font-bold text-orange-600">{stats.severityCounts.medium || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalVulnerabilities > 0 ? (stats.severityCounts.medium / stats.totalVulnerabilities * 100) : 0}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Low</span>
                <span className="text-sm font-bold text-yellow-600">{stats.severityCounts.low || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalVulnerabilities > 0 ? (stats.severityCounts.low / stats.totalVulnerabilities * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Scans */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Scans</h2>
          {stats.recentScans && stats.recentScans.length > 0 ? (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {stats.recentScans.slice(0, 5).map((scan, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800 truncate">{scan.url}</p>
                      <p className="text-xs text-gray-500">{new Date(scan.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                    {scan.risk_score !== undefined && (
                      <div className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                        scan.risk_score >= 80 ? 'bg-green-100 text-green-800' : 
                        scan.risk_score >= 60 ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {scan.risk_score}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No scans yet. Start scanning to see results.</p>
          )}
        </div>
      </div>

      {/* Vulnerability Trends */}
      {trends.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Vulnerability Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="critical" stroke="#9333ea" name="Critical" strokeWidth={2} />
              <Line type="monotone" dataKey="high" stroke="#ef4444" name="High" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke="#f97316" name="Medium" strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke="#eab308" name="Low" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Scans per Day */}
      {trends.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Scan Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="scans" fill="#3b82f6" name="Scans" />
              <Bar dataKey="total" fill="#8b5cf6" name="Total Vulnerabilities" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">🔒 SecureAdmin - Advanced Security Scanner</h2>
        <p className="text-gray-600 mb-4">
          Comprehensive vulnerability scanning tool with AI-powered analysis and multi-layer detection.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">🎯 Core Features:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
              <li>Multi-layer vulnerability scanning (Layer 3-7)</li>
              <li>AI-assisted vulnerability classification</li>
              <li>Risk scoring system (0-100)</li>
              <li>SSL/TLS certificate analysis</li>
              <li>Security headers audit</li>
              <li>Port scanning & service detection</li>
            </ul>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <h3 className="font-semibold text-purple-800 mb-2">🚀 Advanced Features:</h3>
            <ul className="list-disc list-inside text-purple-700 space-y-1 text-sm">
              <li>Subdomain enumeration</li>
              <li>Directory & path discovery</li>
              <li>XSS & SQL injection testing (safe mode)</li>
              <li>Cookie security analysis</li>
              <li>External tools integration (nmap, whatweb, sslscan)</li>
              <li>Vulnerability trend tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
