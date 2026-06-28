function Dashboard({
  result,
  handleBackToResult,
  handleBackToHome,
  text,
}) {

  const formatBillMonth = (billMonth) => {
    if (!billMonth) return "N/A"

    const date = new Date(billMonth)

    if (isNaN(date.getTime())) return billMonth

    return date.toLocaleDateString(text.locale, {
      month: "long",
      year: "numeric",
    })
  }

  const getUsageLevel = (units) => {
    if (units <= 100) return text.lowUsage
    if (units <= 250) return text.moderateUsage
    return text.highUsage
  }

  const getUsageMessage = (units) => {
    if (units <= 100) {
      return text.lowUsageMessage
    }

    if (units <= 250) {
      return text.moderateUsageMessage
    }

    return text.highUsageMessage
  }

  return (
    <div className="dashboard-container">

      <h2 className="dashboard-title">
        {text.dashboardTitle}
      </h2>

      <div className="dashboard-summary-grid">

        <div className="dashboard-card highlight-card">
          <span>{text.estimatedAmount}</span>
          <strong>
            ₹{result?.amount_due ?? "N/A"}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>{text.unitsConsumed}</span>
          <strong>
            {result?.units_consumed
              ? `${result.units_consumed} kWh`
              : "N/A"}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>{text.billMonth}</span>
          <strong>
            {formatBillMonth(result?.bill_month)}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>{text.tariffCategory}</span>
          <strong>
            {result?.tariff_category || "N/A"}
          </strong>
        </div>

      </div>

      <div className="dashboard-insights-grid">

        <div className="dashboard-panel">

          <h3>{text.consumptionInsight}</h3>

          <p className="insight-badge">
            {getUsageLevel(result?.units_consumed || 0)}
          </p>

          <p>
            {getUsageMessage(result?.units_consumed || 0)}
          </p>

        </div>

        <div className="dashboard-panel">

          <h3>{text.costBreakdown}</h3>

          {result?.cost_breakdown ? (

            <>
              <p>
                <strong>{text.slab}:</strong>{" "}
                {result.cost_breakdown.slab}
              </p>

              <p>
                <strong>{text.units}:</strong>{" "}
                {result.cost_breakdown.units}
              </p>

              <p>
                <strong>{text.ratePerUnit}:</strong>{" "}
                ₹{result.cost_breakdown.rate}
              </p>

              <p>
                <strong>{text.energyCost}:</strong>{" "}
                ₹{result.cost_breakdown.cost}
              </p>
            </>

          ) : (

            <p>{text.noBreakdown}</p>

          )}

        </div>

      </div>

      <div className="dashboard-panel">

        <h3>{text.aiSummary}</h3>

        <p>
          {result?.ai_summary || text.noSummary}
        </p>

      </div>

      {result?.saving_tips &&
        result.saving_tips.length > 0 && (

        <div className="dashboard-panel">

          <h3>{text.savingTips}</h3>

          <ul className="dashboard-tips-list">

            {result.saving_tips.map((tip, index) => (

              <li key={index}>
                {tip}
              </li>

            ))}

          </ul>

        </div>

      )}

      <div className="dashboard-actions">

        <button
          className="secondary-btn"
          onClick={handleBackToResult}
        >
          {text.backToResult}
        </button>

        <button
          className="back-btn"
          onClick={handleBackToHome}
        >
          {text.analyzeAnotherBill}
        </button>

      </div>

    </div>
  )
}

export default Dashboard