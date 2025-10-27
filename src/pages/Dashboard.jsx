import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    highVulnerabilities: 0,
    mediumVulnerabilities: 0,
    lowVulnerabilities: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/data/scans.json')
      if (response.ok) {
        const scans = await response.json()
        
        let high = 0, medium = 0, low = 0
        scans.forEach(scan => {
          scan.vulnerabilities.forEach(vuln => {
            if (vuln.severity === 'High') high++
            else if (vuln.severity === 'Medium') medium++
            else if (vuln.severity === 'Low') low++
          })
        })

        setStats({
          totalScans: scans.length,
          highVulnerabilities: high,
          mediumVulnerabilities: medium,
          lowVulnerabilities: low,
        })
      }
    } catch (error) {
      console.log('No scan data available yet')
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
      title: 'High Severity',
      value: stats.highVulnerabilities,
      icon: '🔴',
      color: 'bg-red-500',
    },
    {
      title: 'Medium Severity',
      value: stats.mediumVulnerabilities,
      icon: '🟠',
      color: 'bg-orange-500',
    },
    {
      title: 'Low Severity',
      value: stats.lowVulnerabilities,
      icon: '🟡',
      color: 'bg-yellow-500',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
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

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Selamat Datang di SecureAdmin</h2>
        <p className="text-gray-600 mb-4">
          Aplikasi ini membantu Anda melakukan scanning vulnerability pada website target.
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Fitur Scanning:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Cek HTTP Status & Availability</li>
            <li>Validasi SSL Certificate</li>
            <li>Deteksi Security Headers</li>
            <li>Scan Open Ports (80, 443, 22, 21, 3306, 8080)</li>
            <li>Deteksi Redirect Chain</li>
            <li>Identifikasi Missing Security Headers</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
