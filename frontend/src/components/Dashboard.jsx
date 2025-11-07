import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard({ summary, anomalies }) {
  const chartData = useMemo(() => {
    // Group anomalies by vendor
    const vendorCounts = {}
    anomalies.forEach((anomaly) => {
      vendorCounts[anomaly.vendor] = (vendorCounts[anomaly.vendor] || 0) + 1
    })

    const vendors = Object.keys(vendorCounts)
    const counts = Object.values(vendorCounts)

    return {
      labels: vendors.length > 0 ? vendors : ['No anomalies'],
      datasets: [
        {
          label: 'Anomalies Detected',
          data: counts.length > 0 ? counts : [0],
          backgroundColor: 'rgba(99, 102, 241, 0.6)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2,
        },
      ],
    }
  }, [anomalies])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Anomalies by Vendor',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-3xl font-bold text-indigo-600 mt-2">
                {summary.total_invoices}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Flags</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {summary.active_flags}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div style={{ height: '300px' }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

