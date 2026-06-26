import { useEffect, useState } from "react"

function TipsPanel() {
  const [tipsData, setTipsData] = useState(null)
  const [loadingTips, setLoadingTips] = useState(true)
  const [tipsError, setTipsError] = useState("")

  useEffect(() => {
    const fetchTips = async () => {
      try {
        setLoadingTips(true)
        setTipsError("")

        const response = await fetch("https://project-1-19.onrender.com/tips/1")
        if (!response.ok) {
          throw new Error("Failed to fetch extra tips")
        }

        const data = await response.json()
        setTipsData(data)
      } catch (err) {
        console.log(err)
        setTipsError("Could not load tips")
      } finally {
        setLoadingTips(false)
      }
    }

    fetchTips()
  }, [])

  const getPerformanceMessage = () => {
    if (!tipsData) return ""

    if (tipsData.percent_difference < 0) {
      return "Nice! Your consumption is below the average, but you can still optimize further."
    }

    if (tipsData.percent_difference > 0) {
      return "Your consumption is above average. These tips can help you reduce your bill."
    }

    return "Your usage is close to average. Small changes can still improve savings."
  }

  return (
    <div className="tips-panel">
      <h3 className="section-title">Smart Saving Tips</h3>

      {loadingTips && <p className="section-loading">Loading tips...</p>}
      {tipsError && <p className="section-error">{tipsError}</p>}

      {!loadingTips && !tipsError && tipsData && (
        <>
          <div className="tips-performance-card">
            <h4>Energy Performance</h4>
            <p>{getPerformanceMessage()}</p>
            <span className="tips-badge">
              {tipsData.percent_difference}% vs area average
            </span>
          </div>

          {tipsData.saving_tips && tipsData.saving_tips.length > 0 && (
            <div className="tips-list-card">
              <h4>Recommended Actions</h4>
              <ul className="extra-tips-list">
                {tipsData.saving_tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TipsPanel