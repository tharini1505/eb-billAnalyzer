function Dashboard({ result, handleBackToResult, handleBackToHome }) {
  const formatBillMonth = (billMonth) => {
    if (!billMonth) return "N/A"

    const date = new Date(billMonth)
    if (isNaN(date)) return billMonth

    return date.toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric"
    })
  }

  const getUsageLevel = (units) => {
    if (units <= 100) return "Low Usage"
    if (units <= 250) return "Moderate Usage"
    return "High Usage"
  }

  const getUsageMessage = (units) => {
    if (units <= 100) {
      return "Your electricity usage is in a low range. Great control over consumption."
    }
    if (units <= 250) {
      return "Your electricity usage is moderate. There is room to reduce a bit more with small changes."
    }
    return "Your electricity usage is high. Reducing heavy appliance usage can significantly lower your bill."
  }

  const costPerUnit =
    result?.amount_due && result?.units_consumed
      ? (result.amount_due / result.units_consumed).toFixed(2)
      : "N/A"

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Electricity Usage Dashboard</h2>

      <div className="dashboard-summary-grid">
        <div className="dashboard-card highlight-card">
          <span>Estimated Amount</span>
          <strong>₹{result?.amount_due || "N/A"}</strong>
        </div>

        <div className="dashboard-card">
          <span>Units Consumed</span>
          <strong>
            {result?.units_consumed ? `${result.units_consumed} kWh` : "N/A"}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>Bill Month</span>
          <strong>{formatBillMonth(result?.bill_month)}</strong>
        </div>

        <div className="dashboard-card">
          <span>Tariff Category</span>
          <strong>{result?.tariff_category || "N/A"}</strong>
        </div>
      </div>

      <div className="dashboard-insights-grid">
        <div className="dashboard-panel">
          <h3>Consumption Insight</h3>
          <p className="insight-badge">{getUsageLevel(result?.units_consumed || 0)}</p>
          <p>{getUsageMessage(result?.units_consumed || 0)}</p>
        </div>

        <div className="dashboard-panel">
          <h3>Cost Breakdown</h3>
          <p><strong>Approx cost per unit:</strong> ₹{costPerUnit}</p>
          <p><strong>Total units:</strong> {result?.units_consumed ? `${result.units_consumed} kWh` : "N/A"}</p>
          <p><strong>Total bill amount:</strong> ₹{result?.amount_due || "N/A"}</p>
        </div>
      </div>

      <div className="dashboard-panel">
        <h3>AI Summary</h3>
        <p>{result?.ai_summary || "No AI summary available."}</p>
      </div>

      {result?.saving_tips && result.saving_tips.length > 0 && (
        <div className="dashboard-panel">
          <h3>Recommended Saving Tips</h3>
          <ul className="dashboard-tips-list">
            {result.saving_tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="dashboard-actions">
        <button className="secondary-btn" onClick={handleBackToResult}>
          Back to Result
        </button>

        <button className="back-btn" onClick={handleBackToHome}>
          Analyze Another Bill
        </button>
      </div>
    </div>
  )
}

export default Dashboard