import { useState } from "react"

function ManualForm({loading, setLoading, setResult,text}) {
  const [consumerNumber, setConsumerNumber] = useState("")
  const [billingMonth, setBillingMonth] = useState("")
  const [tariffCategory, setTariffCategory] = useState("Domestic")
  const [unitsConsumed, setUnitsConsumed] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    handle()
  }
}
  const handle = async () => {
  setError("")

  // Empty fields validation
  if (
    !consumerNumber ||
    !billingMonth ||
    !tariffCategory ||
    !unitsConsumed
  ) {
    setError(text.requiredFields)
    return
  }

  // Consumer Number Validation
  if (!/^\d{10}$/.test(consumerNumber)) {
    setError(text.invalidConsumer)
    return
  }

  const validRegionCodes = [
    "01","02","03","04","05",
    "06","07","08","09","10"
  ]

  const regionCode = consumerNumber.substring(0, 2)

  if (!validRegionCodes.includes(regionCode)) {
    setError(text.invalidConsumer)
    return
  }

  // Units validation
  if (Number(unitsConsumed) <= 0) {
    setError(text.invalidUnits)
    return
  }

  try {
    setLoading(true)

    const formData = new FormData()

    formData.append("consumer_number", consumerNumber)
    formData.append("bill_month", `${billingMonth}-01`)
    formData.append("tariff_category", tariffCategory)
    formData.append("units_consumed", Number(unitsConsumed))
    console.log("Tariff Category:", tariffCategory)
    const response = await fetch(
      "https://project-1-7-0who.onrender.com/upload-bill",
      {
        method: "POST",
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.detail
          ? JSON.stringify(data.detail)
          :  text.analysisFailed
      )
    }

    setSuccess(true)

        setTimeout(() => {
        setSuccess(false)
        setResult(data)
    }, 1000)

  } catch (err) {
    console.error(err)
    setError(err.message || text.somethingWrong)
  } finally {
    setLoading(false)
  }
}
  if (success) {
  return (
    <div className="manualform success-screen">
      <div className="success-icon">✅</div>

      <h2>{text.success}</h2>
      <p>{text.preparing}</p>
    </div>
  )
  }

  return (
    <div className="manualform">
     <h2>{text.enterBillDetails}</h2>

      {error && <p className="error">{error}</p>}

      <div className="inputmanual">
        <label>
            {text.consumerNumber} <span className="required">*</span>
        </label>

        <input autoFocus
            autoComplete="off"
            onKeyDown={handleKeyDown}
            type="text"
            placeholder={text.consumerExample}
            maxLength={10}
            value={consumerNumber}
            onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "")
            setConsumerNumber(value)
          }}
          />

        <small className="helper-text">
          {text.consumerHelper}
        </small>

<div className="region-card">
  <h4>{text.regionReference}</h4>

  <ul>
    <li><strong>01</strong> → {text.chennaiNorth}</li>
    <li><strong>02</strong> → {text.chennaiSouth}</li>
    <li><strong>03</strong> → {text.coimbatore}</li>
    <li><strong>04</strong> → {text.madurai}</li>
    <li><strong>05</strong> → {text.thanjavur}</li>
    <li><strong>06</strong> → {text.trichy}</li>
    <li><strong>07</strong> → {text.salem}</li>
    <li><strong>08</strong> → {text.tirunelveli}</li>
    <li><strong>09</strong> → {text.vellore}</li>
    <li><strong>10</strong> → {text.erode}</li>
  </ul>
</div>
      </div>

      <div className="inputmanual">
        <label>
            {text.billingMonth} <span className="required">*</span>
        </label>

        <input
          onKeyDown={handleKeyDown}
          type="month"
          value={billingMonth}
          onChange={(e) => setBillingMonth(e.target.value)}
        />
      </div>

      <div className="inputmanual">
        <label>
            {text.tariffCategory} <span className="required">*</span>
        </label>

        <select onKeyDown={handleKeyDown}
                value={tariffCategory}
                onChange={(e) => setTariffCategory(e.target.value)}>
  <option value="Domestic">{text.domestic}</option>
  <option value="Commercial">{text.commercial}</option>
</select>
      </div>

      <div className="inputmanual">
        <label>
            {text.unitsConsumed} <span className="required">*</span>
        </label>
        <input
          onKeyDown={handleKeyDown}
          type="number"
          min = "1"
          placeholder={text.unitsExample}
          value={unitsConsumed}
          onChange={(e) => {
            if (Number(e.target.value) >= 0)
              setUnitsConsumed(e.target.value)
            }}
        />
      </div>

      <button className="analyze-btn"  onClick={handle} disabled={loading}>
          {loading ? text.analyzing : text.analyzeBill}
      </button>
    </div>
  )
}

export default ManualForm