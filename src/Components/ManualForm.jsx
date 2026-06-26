import { useState } from "react"

function ManualForm({ setLoading, setResult }) {
  const [consumerNumber, setConsumerNumber] = useState("")
  const [billingMonth, setBillingMonth] = useState("")
  const [tariffCategory, setTariffCategory] = useState("Domestic")
  const [unitsConsumed, setUnitsConsumed] = useState("")
  const [error, setError] = useState("")

  const handle = async () => {
    setError("")

    if (!consumerNumber || !billingMonth || !tariffCategory || !unitsConsumed) {
      setError("Please fill all the fields")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("user_id", "1")
      formData.append("consumer_number", consumerNumber)
      formData.append("bill_month", billingMonth)
      formData.append("tariff_category", tariffCategory)
      formData.append("units_consumed", unitsConsumed)

      const response = await fetch("https://project-1-fdwi.onrender.com/upload-bill", {
        method: "POST",
        body: formData
      })

      const data = await response.json()
      console.log("MANUAL BILL RESPONSE:", data)

      if (!response.ok) {
        const detailText =
          typeof data?.detail === "string"
            ? data.detail
            : JSON.stringify(data?.detail || "")

        if (detailText.includes("429") || detailText.includes("RESOURCE_EXHAUSTED")) {
          throw new Error(
            "AI usage limit reached on the backend. Please wait a bit and try again, or ask your backend teammate to add a fallback when Gemini quota is exhausted."
          )
        }

        throw new Error(detailText || "Failed to analyze bill")
      }

      setResult(data)
    } catch (err) {
      console.log("Manual form error:", err)
      setError(err.message || "Could not connect to backend")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="manualform">
      <h2>Enter Bill Details</h2>

      {error && <p className="error">{error}</p>}

      <div className="inputmanual">
        <label>Consumer Number</label>
        <input
          type="text"
          placeholder="Enter consumer number"
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
        />
      </div>

      <div className="inputmanual">
        <label>Billing Month</label>
        <input
          type="month"
          value={billingMonth}
          onChange={(e) => setBillingMonth(e.target.value)}
        />
      </div>

      <div className="inputmanual">
        <label>Tariff Category</label>
        <select
          value={tariffCategory}
          onChange={(e) => setTariffCategory(e.target.value)}
        >
          <option value="Domestic">Domestic</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>
      </div>

      <div className="inputmanual">
        <label>Units Consumed (kWh)</label>
        <input
          type="number"
          placeholder="Enter units consumed"
          value={unitsConsumed}
          onChange={(e) => setUnitsConsumed(e.target.value)}
        />
      </div>

      <button className="analyze-btn" onClick={handle}>
        Analyze Bill
      </button>
    </div>
  )
}

export default ManualForm