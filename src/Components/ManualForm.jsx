import { useState } from "react"

function ManualForm({ setLoading }) {
  const [consumerNumber, setConsumerNumber] = useState("")
  const [billingMonth, setBillingMonth] = useState("")
  const [tariffCategory, setTariffCategory] = useState("Domestic")
  const [unitsConsumed, setUnitsConsumed] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)

  const handle = async () => {
    setError("")

    if (!consumerNumber || !billingMonth || !tariffCategory || !unitsConsumed) {
      setError("Please fill all the fields")
      return
    }

    const billData = {
      consumerNumber,
      billingMonth,
      tariffCategory,
      unitsConsumed
    }

    try {
      setLoading(true)

      const response = await fetch("http://localhost:3000/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(billData)
      })

      if (!response.ok) {
        throw new Error("Failed to save bill")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.log(err)
      setError("Could not connect to JSON server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="manualform">
      <h2>Enter Bill details</h2>

      {error && <p className="error">{error}</p>}

      <div className="inputmanual">
        <label>Consumer Number:</label>
        <input
          type="text"
          placeholder="Enter consumer number"
          value={consumerNumber}
          onChange={(e) => setConsumerNumber(e.target.value)}
        />
      </div>

      <div className="inputmanual">
        <label>Billing month:</label>
        <input
          type="month"
          value={billingMonth}
          onChange={(e) => setBillingMonth(e.target.value)}
        />
      </div>

      <div className="inputmanual">
        <label>Tariff Category:</label>
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
          placeholder="Units consumed"
          value={unitsConsumed}
          onChange={(e) => setUnitsConsumed(e.target.value)}
        />
      </div>

      <button onClick={handle}>Analyze Bill</button>

      {result && (
        <div className="result-box">
          <h3>Saved Bill</h3>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>Consumer Number:</strong> {result.consumerNumber}</p>
          <p><strong>Billing Month:</strong> {result.billingMonth}</p>
          <p><strong>Tariff Category:</strong> {result.tariffCategory}</p>
          <p><strong>Units Consumed:</strong> {result.unitsConsumed}</p>
        </div>
      )}
    </div>
  )
}

export default ManualForm