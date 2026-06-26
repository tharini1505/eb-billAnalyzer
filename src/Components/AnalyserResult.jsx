import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend
} from "recharts"

function AnalyserResult({ result, handleBackToHome }) {
  const [historyData, setHistoryData] = useState([])
  const [compareData, setCompareData] = useState(null)
  const [tipsData, setTipsData] = useState(null)

  const [historyError, setHistoryError] = useState("")
  const [compareError, setCompareError] = useState("")
  const [tipsError, setTipsError] = useState("")

  useEffect(() => {
    if (!result) return

    const userId = 1
    const area = "chennai"

    const fetchHistory = async () => {
      try {
        setHistoryError("")

        const response = await fetch(
          `https://project-1-3-n0oe.onrender.com/history/${userId}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch history")
        }

        const data = await response.json()
        console.log("HISTORY DATA:", data)

        setHistoryData(Array.isArray(data) ? data : [])
      } catch (err) {
        console.log("History fetch error:", err)
        setHistoryError("Could not load bill history")
      }
    }

    const fetchCompare = async () => {
      try {
        setCompareError("")

        const compareUrl = `https://project-1-3-n0oe.onrender.com/compare?area=${area}&units=${result.units_consumed}`
        console.log("COMPARE URL:", compareUrl)

        const response = await fetch(compareUrl)

        if (!response.ok) {
          throw new Error("Failed to fetch comparison data")
        }

        const data = await response.json()
        console.log("COMPARE DATA:", data)

        setCompareData(data)
      } catch (err) {
        console.log("Compare fetch error:", err)
        setCompareError("Could not load comparison data")
      }
    }

    const fetchTips = async () => {
      try {
        setTipsError("")

        const response = await fetch(
          `https://project-1-3-n0oe.onrender.com/tips/${userId}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch tips")
        }

        const data = await response.json()
        console.log("TIPS DATA:", data)

        setTipsData(data)
      } catch (err) {
        console.log("Tips fetch error:", err)
        setTipsError("Could not load additional tips")
      }
    }

    fetchHistory()
    fetchCompare()
    fetchTips()
  }, [result])

  if (!result) return null

  const formatMonth = (monthString) => {
    if (!monthString) return "-"

    const date = new Date(monthString)
    if (isNaN(date.getTime())) return monthString

    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric"
    })
  }

  const historyChartData = historyData.map((item, index) => ({
    month: item.month ? formatMonth(item.month) : `Bill ${index + 1}`,
    units: Number(item.units) || 0,
    amount: Number(item.amount) || 0
  }))

  const compareChartData =
    compareData &&
    compareData.your_units !== undefined &&
    compareData.area_average !== undefined
      ? [
          {
            name: "Usage",
            YourUsage: Number(compareData.your_units) || 0,
            AreaAverage: Number(compareData.area_average) || 0
          }
        ]
      : []

  return (
    <div className="result-page">
      <div className="result-box">
        <h1 className="dashboard-title">Electricity Usage Dashboard</h1>

        {/* OVERVIEW */}
        <div className="overview-grid">
          <div className="overview-card amount-highlight">
            <h3>Estimated Amount</h3>
            <p>₹{result.amount_due}</p>
          </div>

          <div className="overview-card">
            <h3>Units Consumed</h3>
            <p>{result.units_consumed} kWh</p>
          </div>

          <div className="overview-card">
            <h3>Bill Month</h3>
            <p>{formatMonth(result.bill_month)}</p>
          </div>

          <div className="overview-card">
            <h3>Tariff Category</h3>
            <p>{result.tariff_category}</p>
          </div>
        </div>

        {/* SUMMARY + COST */}
        <div className="insight-grid">
          <div className="info-card">
            <h2>AI Summary</h2>
            <p>{result.ai_summary || "No AI summary available."}</p>
          </div>

          <div className="info-card">
            <h2>Cost Breakdown</h2>
            <p>
              <strong>Approx cost per unit:</strong>{" "}
              ₹
              {result.units_consumed
                ? (result.amount_due / result.units_consumed).toFixed(2)
                : 0}
            </p>
            <p>
              <strong>Total units:</strong> {result.units_consumed} kWh
            </p>
            <p>
              <strong>Total bill amount:</strong> ₹{result.amount_due}
            </p>
            <p>
              <strong>Bill ID:</strong> {result.bill_id}
            </p>
          </div>
        </div>

        {/* SAVING TIPS FROM RESULT */}
        {result.saving_tips && result.saving_tips.length > 0 && (
          <div className="section-card">
            <h2>Saving Tips</h2>
            <ul className="tips-list">
              {result.saving_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* HISTORY */}
        <div className="section-card">
          <h2>Bill History</h2>

          {historyError ? (
            <p className="error">{historyError}</p>
          ) : historyChartData.length === 0 ? (
            <p className="empty-text">No history available yet.</p>
          ) : (
            <div className="charts-grid">
              <div className="chart-card">
                <h3>Monthly Units Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="units"
                      stroke="#2563eb"
                      strokeWidth={3}
                      name="Units Consumed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Monthly Bill Amount</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={historyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      fill="#60a5fa"
                      radius={[8, 8, 0, 0]}
                      name="Bill Amount (₹)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* COMPARE */}
        <div className="section-card">
          <h2>Usage Comparison</h2>

          {compareError ? (
            <p className="error">{compareError}</p>
          ) : compareChartData.length === 0 ? (
            <p className="empty-text">No comparison data available.</p>
          ) : (
            <>
              <div className="compare-stats">
                <div className="compare-mini-card">
                  <span>Your Usage</span>
                  <strong>{compareData.your_units} kWh</strong>
                </div>

                <div className="compare-mini-card">
                  <span>Area Average</span>
                  <strong>{compareData.area_average} kWh</strong>
                </div>

                <div className="compare-mini-card">
                  <span>Difference</span>
                  <strong>{compareData.difference} kWh</strong>
                </div>

                <div className="compare-mini-card">
                  <span>Difference %</span>
                  <strong>{compareData.percent_difference}%</strong>
                </div>
              </div>

              <div className="chart-card compare-chart">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={compareChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="YourUsage"
                      fill="#2563eb"
                      radius={[8, 8, 0, 0]}
                      name="Your Usage"
                    />
                    <Bar
                      dataKey="AreaAverage"
                      fill="#93c5fd"
                      radius={[8, 8, 0, 0]}
                      name="Area Average"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>

        {/* EXTRA SMART TIPS */}
        <div className="section-card">
          <h2>More Smart Tips</h2>

          {tipsError ? (
            <p className="error">{tipsError}</p>
          ) : !tipsData || !tipsData.saving_tips || tipsData.saving_tips.length === 0 ? (
            <p className="empty-text">No extra tips available.</p>
          ) : (
            <ul className="tips-list">
              {tipsData.saving_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
        </div>

        <button className="back-btn" onClick={handleBackToHome}>
          Analyze Another Bill
        </button>
      </div>
    </div>
  )
}

export default AnalyserResult