import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"

function HistoryPanel() {
  const [historyData, setHistoryData] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true)
        setHistoryError("")

        const response = await fetch("https://project-1-19.onrender.com/history/1")
        if (!response.ok) {
          throw new Error("Failed to fetch history")
        }

        const data = await response.json()

        // Group same month entries together
        const grouped = {}

        data.forEach((item) => {
          const month = item.month || "Unknown"

          if (!grouped[month]) {
            grouped[month] = {
              month,
              totalUnits: 0,
              totalAmount: 0,
              count: 0
            }
          }

          grouped[month].totalUnits += Number(item.units || 0)
          grouped[month].totalAmount += Number(item.amount || 0)
          grouped[month].count += 1
        })

        // Convert grouped object to array
        const cleanedData = Object.values(grouped).map((item) => ({
          month: item.month,
          units: Math.round(item.totalUnits / item.count),   // average units
          amount: Math.round(item.totalAmount / item.count)  // average amount
        }))

        setHistoryData(cleanedData)
      } catch (err) {
        console.log(err)
        setHistoryError("Could not load bill history")
      } finally {
        setLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="history-panel">
      <h3 className="section-title">Bill History</h3>

      {loadingHistory && <p className="section-loading">Loading history...</p>}
      {historyError && <p className="section-error">{historyError}</p>}

      {!loadingHistory && !historyError && historyData.length > 0 && (
        <div className="history-grid">
          <div className="chart-card">
            <h4>Monthly Units Trend</h4>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="units"
                  name="Units Consumed"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Monthly Bill Amount</h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="amount"
                  name="Bill Amount (₹)"
                  fill="#60a5fa"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!loadingHistory && !historyError && historyData.length === 0 && (
        <p className="section-empty">No history data available</p>
      )}
    </div>
  )
}

export default HistoryPanel