import { useState } from "react"

function ManualForm({ setLoading, setResult }) {
  const [consumerNumber, setConsumerNumber] = useState("")
  const [billingMonth, setBillingMonth] = useState("")
  const [tariffCategory, setTariffCategory] = useState("Domestic")
  const [unitsConsumed, setUnitsConsumed] = useState("")
  const [error, setError] = useState("")

  const handle = async () => {
    setError("")

    if (
      !consumerNumber ||
      !billingMonth ||
      !tariffCategory ||
      !unitsConsumed
    ) {
      setError("Please fill all the fields")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append("user_id", "1")
      formData.append("consumer_number", consumerNumber)

      // Convert YYYY-MM -> YYYY-MM-01
      const formattedDate = `${billingMonth}-01`
      formData.append("bill_month", formattedDate)

      formData.append("tariff_category", tariffCategory)
      formData.append("units_consumed", Number(unitsConsumed))

      // DEBUG
      console.log("Sending bill_month:", formattedDate)

      const response = await fetch(
        "https://project-1-3-n0oe.onrender.com/upload-bill",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()

      console.log("MANUAL BILL RESPONSE:", data)

      if (!response.ok) {
        throw new Error(JSON.stringify(data.detail))
      }

      setResult(data)
    } catch (err) {
      console.error("Manual form error:", err)
      setError(err.message || "Something went wrong")
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
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
          placeholder="Enter Consumer Number"
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
        <label>Units Consumed</label>
        <input
          type="number"
          value={unitsConsumed}
          onChange={(e) => setUnitsConsumed(e.target.value)}
          placeholder="Enter Units"
        />
      </div>

      <button className="analyze-btn" onClick={handle}>
        Analyze Bill
      </button>
    </div>
  )
}

export default ManualForm