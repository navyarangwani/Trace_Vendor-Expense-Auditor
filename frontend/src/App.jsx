import { useState, useEffect } from 'react'
import UploadForm from './components/UploadForm'
import Dashboard from './components/Dashboard'
import AlertsList from './components/AlertsList'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

function App() {
  const [summary, setSummary] = useState({ total_invoices: 0, active_flags: 0 })
  const [anomalies, setAnomalies] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      const [summaryRes, anomaliesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/summary`),
        axios.get(`${API_BASE_URL}/anomalies`)
      ])
      setSummary(summaryRes.data)
      setAnomalies(anomaliesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUploadSuccess = () => {
    fetchData()
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE_URL}/clear-all`)
        await fetchData()
        alert('All data cleared successfully!')
      } catch (error) {
        console.error('Error clearing data:', error)
        alert('Failed to clear data. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-gray-800">
              🔍 Trace – Vendor & Expense Auditor
            </h1>
            {(summary.total_invoices > 0 || summary.active_flags > 0) && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium text-sm"
              >
                🗑️ Clear All Data
              </button>
            )}
          </div>
          <p className="text-gray-600">
            Detect duplicate invoices, policy violations, and suspicious vendor transactions
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <UploadForm onUploadSuccess={handleUploadSuccess} loading={loading} setLoading={setLoading} />
          </div>
          <div className="lg:col-span-2">
            <Dashboard summary={summary} anomalies={anomalies} />
          </div>
        </div>

        <AlertsList anomalies={anomalies} />
      </div>
    </div>
  )
}

export default App

