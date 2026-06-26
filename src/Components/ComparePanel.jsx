import { useEffect, useState } from "react"

function ComparePanel() {
  const [compareData, setCompareData] = useState(null)
  const [loadingCompare, setLoadingCompare] = useState(true)
  const [compareError, setCompareError] = useState("")

  useEffect(() => {
    const fetchCompare = async () => {
      try {
        setLoadingCompare(true)
        setCompareError("")

        const response = await fetch("https://project-1-19.onrender.com/compare")
        if (!response.ok) {
          throw new Error("Failed to fetch comparison data")
        }

        const data = await response.json()
        setCompareData(data)
      } catch (err) {
        console.log(err)
        setCompareError("Could not load comparison data")
      } finally {
        setLoadingCompare(false)
      }
    }

    fetchCompare()
  }, [])

  const getCompareMessage = () => {
    if (!compareData) return ""

    if (compareData.difference > 0) {
      return `Your usage is ${compareData.percent_difference}% above the area average.`
    }

    if (compareData.difference < 0) {
      return `Great! Your usage is ${Math.abs(compareData.percent_difference)}% below the area average.`
    }

    return "Your usage matches the area average."
  }

  return (
    <div className="compare-panel">
      <h3 className="section-title">Usage Comparison</h3>

      {loadingCompare && <p className="section-loading">Loading comparison...</p>}
      {compareError && <p className="section-error">{compareError}</p>}

      {!loadingCompare && !compareError && compareData && (
        <>
          <div className="compare-grid">
            <div className="compare-card">
              <span>Your Units</span>
              <strong>{compareData.your_units}</strong>
            </div>

            <div className="compare-card">
              <span>Area Average</span>
              <strong>{compareData.area_average}</strong>
            </div>

            <div className="compare-card">
              <span>Difference</span>
              <strong>{compareData.difference}</strong>
            </div>

            <div className="compare-card">
              <span>% Difference</span>
              <strong>{compareData.percent_difference}%</strong>
            </div>
          </div>

          <div className="insight-card">
            <h4>Comparison Insight</h4>
            <p>{getCompareMessage()}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default ComparePanel