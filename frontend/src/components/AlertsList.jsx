function AlertsList({ anomalies }) {
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'bg-red-100 text-red-800 border-red-300'
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-blue-100 text-blue-800 border-blue-300'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (anomalies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500 text-lg">No anomalies detected yet.</p>
        <p className="text-gray-400 text-sm mt-2">
          Upload a CSV file to start detecting issues.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        🚨 Detected Alerts ({anomalies.length})
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {anomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-gray-800">
                    Invoice: {anomaly.invoice_id}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(
                      anomaly.score
                    )}`}
                  >
                    Score: {(anomaly.score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Vendor:</span>{' '}
                    <span className="font-medium">{anomaly.vendor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>{' '}
                    <span className="font-medium">₹{anomaly.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-gray-600 text-sm">Reason:</span>{' '}
                  <span className="text-sm font-medium text-gray-800">
                    {anomaly.reason}
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Detected: {formatDate(anomaly.created_at)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertsList

