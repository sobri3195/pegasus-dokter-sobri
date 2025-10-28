import { useState, useEffect } from 'react'

const ScanScheduler = () => {
  const [schedulers, setSchedulers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    frequency: 'daily',
    scanType: 'basic',
    enabled: true
  })

  useEffect(() => {
    loadSchedulers()
  }, [])

  const loadSchedulers = async () => {
    try {
      const response = await fetch('/api/schedulers')
      if (response.ok) {
        const data = await response.json()
        setSchedulers(data)
      }
    } catch (error) {
      console.error('Failed to load schedulers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/schedulers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await loadSchedulers()
        setShowForm(false)
        setFormData({
          name: '',
          url: '',
          frequency: 'daily',
          scanType: 'basic',
          enabled: true
        })
      }
    } catch (error) {
      console.error('Failed to create scheduler:', error)
    }
  }

  const toggleScheduler = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/schedulers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus })
      })

      if (response.ok) {
        await loadSchedulers()
      }
    } catch (error) {
      console.error('Failed to toggle scheduler:', error)
    }
  }

  const deleteScheduler = async (id) => {
    if (!confirm('Are you sure you want to delete this scheduler?')) return

    try {
      const response = await fetch(`/api/schedulers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadSchedulers()
      }
    } catch (error) {
      console.error('Failed to delete scheduler:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFrequencyBadge = (frequency) => {
    const colors = {
      daily: 'bg-green-100 text-green-800',
      weekly: 'bg-blue-100 text-blue-800',
      monthly: 'bg-purple-100 text-purple-800'
    }
    return colors[frequency] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schedulers...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">⏰ Scan Scheduler</h1>
          <p className="text-gray-600 mt-1">Automate your security scans</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          {showForm ? '❌ Cancel' : '➕ New Schedule'}
        </button>
      </div>

      {/* Add New Scheduler Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Schedule</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Daily Production Scan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scan Type *
                </label>
                <select
                  value={formData.scanType}
                  onChange={(e) => setFormData({ ...formData, scanType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basic">Basic Scan</option>
                  <option value="advanced">Advanced Scan</option>
                  <option value="ultimate">Ultimate Scan</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label className="ml-2 text-gray-700">
                Enable schedule immediately
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Create Schedule
            </button>
          </form>
        </div>
      )}

      {/* Schedulers List */}
      {schedulers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">⏰</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Schedules Yet</h3>
          <p className="text-gray-600 mb-4">Create your first automated scan schedule</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            ➕ Create Schedule
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {schedulers.map((scheduler) => (
            <div
              key={scheduler.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {scheduler.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFrequencyBadge(scheduler.frequency)}`}>
                      {scheduler.frequency}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      scheduler.enabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {scheduler.enabled ? '✓ Active' : '✗ Disabled'}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">
                    <span className="font-medium">URL:</span> {scheduler.url}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Type:</span> {scheduler.scanType}
                    </div>
                    <div>
                      <span className="font-medium">Total Runs:</span> {scheduler.totalRuns}
                    </div>
                    <div>
                      <span className="font-medium">Next Run:</span><br/>
                      {scheduler.nextRun ? formatDate(scheduler.nextRun) : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Last Run:</span><br/>
                      {scheduler.lastRun ? formatDate(scheduler.lastRun) : 'Never'}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleScheduler(scheduler.id, scheduler.enabled)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      scheduler.enabled
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {scheduler.enabled ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={() => deleteScheduler(scheduler.id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ScanScheduler
