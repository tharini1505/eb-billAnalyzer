import { useEffect, useState } from "react"
import {ResponsiveContainer,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,BarChart,Bar,Legend} from "recharts"

function AnalyserResult({result,handleBackToHome,text,}) {

  const [historyData, setHistoryData] = useState([])
const [compareData, setCompareData] =useState(null)
const [tipsData, setTipsData] = useState(null)

const [historyError, setHistoryError] = useState("")
const [compareError, setCompareError] = useState("")
const [tipsError, setTipsError] = useState("")

const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {

    if (!result) return

    const consumerNumber = result.consumer_number || ""
    const area = result.region?.trim() || "Chennai"
    if (!consumerNumber) return

    // ---------------- HISTORY ----------------

    const fetchHistory = async () => {
      try {

        setHistoryError("")

        const response = await fetch(
                `https://project-1-7-0who.onrender.com/history/${encodeURIComponent(consumerNumber)}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch history")
        }

        const data = await response.json()

        console.log("History:", data)

        setHistoryData(Array.isArray(data) ? data : [])

      } catch (err) {

        console.log(err)
        setHistoryError(text.historyError)
      }
    }

    // ---------------- COMPARE ----------------

    const fetchCompare = async () => {
      try {

        setCompareError("")

        const response = await fetch(
          `https://project-1-7-0who.onrender.com/compare?area=${encodeURIComponent(area)}&units=${result.units_consumed}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch comparison")
        }

        const data = await response.json()

        console.log("Compare:", data)

        setCompareData(data)

      } catch (err) {

        console.error(err)
        setCompareError(text.comparisonError)
      }
    }

    // ---------------- TIPS ----------------

    const fetchTips = async () => {
      try {

        setTipsError("")

        const response = await fetch(
                  `https://project-1-7-0who.onrender.com/tips/${encodeURIComponent(consumerNumber)}`
          ) 

        if (!response.ok) {
          throw new Error("Failed to fetch tips")
        }

        const data = await response.json()

        console.log("Tips:", data)

        setTipsData(data)

      } catch (err) {

        console.error(err)
        setTipsError(text.tipsError)
      }
    }

   Promise.all([
        fetchHistory(),
        fetchCompare(),
        fetchTips()
      ])

  }, [result,text])

  if (!result) return null

  const formatMonth = (month) => {

    if (!month) return "-"

    const date = new Date(month)

    if (isNaN(date.getTime())) return month

    return date.toLocaleDateString(
  text.locale,
  {
    month: "short",
    year: "numeric",
  }
)
  }
  const sendDigest = async () => {
  try {
    setSendingEmail(true)

    const response = await fetch(
      "https://project-1-7-0who.onrender.com/send-digest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 0,
          consumer_number: result.consumer_number,
          bill_month: result.bill_month,
          tariff_category: result.tariff_category,
          units_consumed: result.units_consumed,
          amount_due: result.amount_due,
          ai_summary: result.ai_summary,
          saving_tips: result.saving_tips,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || text.reportFailed)
    }

    alert("✅ " + text.reportSent)

    console.log(data)

  } catch (err) {
    console.error(err)
    alert("❌ " + text.reportFailed)
  } finally {
    setSendingEmail(false)
  }
}


  const historyChartData = historyData.map((item, index) => ({
    month: item.month
      ? formatMonth(item.month)
      : `${text.bill} ${index + 1}`,
    units: Number(item.units) || 0,
    amount: Number(item.amount) || 0
  }))

  const compareChartData =
    compareData
      ? [
          {
           name: text.usage,
            YourUsage: Number(compareData.your_units) || 0,
            AreaAverage: Number(compareData.area_average) || 0
          }
        ]
      : []
  const getTamilSummary = () => {
  const units = result.units_consumed
  const amount = result.amount_due
  const category =
    result.tariff_category === "Domestic"
      ? "வீட்டு"
      : result.tariff_category === "Commercial"
      ? "வணிக"
      : "தொழிற்துறை"

  let usage = "  "
  let advice = "  "

  if (units <= 100) {
    usage = "குறைவான"
    advice = "உங்கள் மின்சார பயன்பாடு மிகவும் சிறப்பாக உள்ளது."
  } else if (units <= 250) {
    usage = "மிதமான"
    advice = "சில மின்சார சேமிப்பு நடவடிக்கைகள் மூலம் கட்டணத்தை மேலும் குறைக்கலாம்."
  } else {
    usage = "அதிகமான"
    advice = "மின்சார பயன்பாட்டை குறைப்பது உங்கள் கட்டணத்தை கணிசமாக குறைக்கும்."
  }

  return `உங்கள் ${category} மின்சார பயன்பாடு ${units} யூனிட்கள் ஆகும்.
  இந்த மாத மொத்த கட்டணம் ₹${amount}.
  இது ${usage} மின்சார பயன்பாட்டைக் காட்டுகிறது.
  ${advice}`
}
const tamilSavingTips = [
  "LED விளக்குகளை பயன்படுத்துங்கள்.",
  "பயன்பாட்டில் இல்லாத மின்சாதனங்களை அணைத்து வையுங்கள்.",
  "ஏசி வெப்பநிலையை 24°C முதல் 26°C வரை வைத்திருங்கள்.",
  "சலவை இயந்திரத்தை முழு சுமையுடன் இயக்குங்கள்.",
  "மின்சாரம் சேமிக்கும் சாதனங்களை பயன்படுத்துங்கள்."
]
    return (
    <div className="result-page">
      <div className="result-box">

        <h1 className="dashboard-title">{text.dashboardTitle}</h1>

        {/* OVERVIEW */}

        <div className="overview-grid">

  <div className="overview-card amount-highlight">
    <h3>{text.estimatedAmount}</h3>
    <p>₹{result.amount_due}</p>
  </div>

  <div className="overview-card">
    <h3>{text.unitsConsumed}</h3>
    <p>
      {result.units_consumed}
      {text.locale === "ta-IN" ? " யூனிட்கள்" : " kWh"}
    </p>
  </div>

  <div className="overview-card">
    <h3>{text.billMonth}</h3>
    <p>{formatMonth(result.bill_month)}</p>
  </div>

  <div className="overview-card">
    <h3>{text.tariffCategory}</h3>
    <p>{text.locale === "ta-IN"
        ? result.tariff_category === "Domestic"
          ? "வீட்டு"
          : result.tariff_category === "Commercial"
            ? "வணிக"
            : "தொழிற்துறை"
        : result.tariff_category}
    </p>
  </div>

  <div className="overview-card">
    <h3>{text.consumerNumber}</h3>
    <p>{result.consumer_number}</p>
  </div>

  <div className="overview-card">
    <h3>{text.region}</h3>
    <p>
  {
    result.region === "Chennai North"
      ? text.chennaiNorth
      : result.region === "Chennai South"
      ? text.chennaiSouth
      : result.region === "Coimbatore"
      ? text.coimbatore
      : result.region === "Madurai"
      ? text.madurai
      : result.region === "Thanjavur"
      ? text.thanjavur
      : result.region === "Trichy"
      ? text.trichy
      : result.region === "Salem"
      ? text.salem
      : result.region === "Tirunelveli"
      ? text.tirunelveli
      : result.region === "Vellore"
      ? text.vellore
      : result.region === "Erode"
      ? text.erode
      : text.unknown
  }
</p>
  </div>

</div>

        {/* AI SUMMARY */}

        <div className="insight-grid">

          <div className="info-card">
            <h2>{text.aiSummary}</h2>

            <p style={{ whiteSpace: "pre-line" }}>
              {text.locale === "ta-IN"
              ? getTamilSummary()
              : result.ai_summary || text.noSummary}
            </p>

          </div>
<div className="info-card">

  <h2>{text.costBreakdown}</h2>

  {result.cost_breakdown &&
  result.cost_breakdown.length > 0 ? (

    result.cost_breakdown.map((item, index) => (

      <div
        key={index}
        className="breakdown-item"
      >

        <p>
          <strong>{text.slab}:</strong> {item.slab}
        </p>

        <p>
          <strong>{text.units}:</strong> {item.units}
        </p>

        <p>
          <strong>{text.ratePerUnit}:</strong> ₹{item.rate}
        </p>

        <p>
          <strong>{text.energyCost}:</strong> ₹{item.cost}
        </p>

        {index !== result.cost_breakdown.length - 1 && <hr />}

      </div>

    ))

  ) : (

    <p>{text.noBreakdown}</p>

  )}

</div>

        </div>

        {/* HISTORY */}

        <div className="section-card">

          <h2>{text.billHistory}</h2>

          {historyError ? (

            <p className="error">
              {historyError}
            </p>

          ) : historyChartData.length === 0 ? (

            <p className="empty-text">{text.noHistory}</p>

          ) : (

            <div className="charts-grid">

              <div className="chart-card">

                <h3>{text.monthlyUnitsTrend}</h3>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <LineChart
                    data={historyChartData}
                  >

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
                     name={text.unitsConsumed}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

              <div className="chart-card">

                <h3>{text.monthlyBillAmount}</h3>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={historyChartData}
                  >

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="amount"
                      fill="#60a5fa"
                      radius={[8,8,0,0]}
                      name={text.estimatedAmount}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          )}

        </div>
                {/* USAGE COMPARISON */}

        <div className="section-card">

          <h2>{text.usageComparison}</h2>

          {compareError ? (

            <p className="error">
              {compareError}
            </p>

          ) : compareChartData.length === 0 ? (

            <p className="empty-text">{text.noComparison}</p>

          ) : (

            <>

              <div className="compare-stats">

  <div className="compare-mini-card">
    <span>{text.yourUsage}</span>
    <strong>{compareData.your_units} kWh</strong>
  </div>

  <div className="compare-mini-card">
    <span>{text.areaAverage}</span>
    <strong>{compareData.area_average} kWh</strong>
  </div>

  <div className="compare-mini-card">
    <span>{text.difference}</span>
    <strong>{compareData.difference} kWh</strong>
  </div>

  <div className="compare-mini-card">
    <span>{text.differencePercentage}</span>
    <strong>{compareData.percent_difference}%</strong>
  </div>

</div>

              <div className="chart-card compare-chart">

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <BarChart data={compareChartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="YourUsage"
                      fill="#2563eb"
                      radius={[8,8,0,0]}
                      name={text.yourUsage}
                    />

                    <Bar
                      dataKey="AreaAverage"
                      fill="#93c5fd"
                      radius={[8,8,0,0]}
                      name={text.areaAverage}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </>

          )}

        </div>
        {/* SAVING TIPS */}

        <div className="section-card">

          <h2>{text.savingTips}</h2>

          {result.saving_tips &&
          result.saving_tips.length > 0 ? (

            <ul className="tips-list">

              {(text.locale === "ta-IN"? tamilSavingTips: result.saving_tips
                ).map((tip,index)=>(
                    <li key={index}>{tip}</li>
              ))}

            </ul>

          ) : (

            <p>{text.noSavingTips}</p>

          )}

        </div>

        {/* EXTRA SMART TIPS */}

        <div className="section-card">

         <h2>{text.moreSmartTips}</h2>

          {tipsError ? (

            <p className="error">
              {tipsError}
            </p>

          ) : tipsData &&
            tipsData.saving_tips &&
            tipsData.saving_tips.length > 0 ? (

            <ul className="tips-list">

              {(text.locale === "ta-IN"? tamilSavingTips: tipsData.saving_tips).map((tip,index)=>(
                <li key={index}>
                  {tip}
                </li>

              ))}

            </ul>

          ) : (

            <p className="empty-text">{text.noAdditionalTips}</p>

          )}

        </div>
        <button className="email-btn" onClick={sendDigest}disabled={sendingEmail}>
            {sendingEmail ? text.sending : text.sendPdfReport}
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

export default AnalyserResult