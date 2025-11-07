import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000'

function UploadForm({ onUploadSuccess, loading, setLoading }) {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setMessage('')
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await axios.post(`${API_BASE_URL}/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setMessage(
        `✅ Success! ${response.data.rows_inserted} invoices uploaded, ${response.data.anomalies_detected} anomalies detected.`
      )
      setFile(null)
      onUploadSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to upload file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        📤 Upload CSV File
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100
              cursor-pointer"
            disabled={loading}
          />
          <p className="mt-2 text-xs text-gray-500">
            Expected columns: invoice_id, vendor, amount, date, source
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg
            hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed
            transition-colors duration-200 font-medium"
        >
          {loading ? 'Uploading...' : 'Upload & Analyze'}
        </button>

        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default UploadForm

