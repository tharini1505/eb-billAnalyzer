import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"

function UsageCharts({ result }) {
  if (!result) return null

  const currentBillData = [
    {
      name: "Current Bill",
      units: result.units_consumed || 0,
      amount: result.amount_due || 0
    }
  ]

  return (
    <div className="charts-section">
      <h3 className="charts-title">Current Bill Overview</h3>

      <div className="charts-grid single-chart">
        <div className="chart-card">
          <h4>Units vs Amount</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={currentBillData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="units"
                name="Units Consumed (kWh)"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="amount"
                name="Amount Due (₹)"
                fill="#60a5fa"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default UsageCharts