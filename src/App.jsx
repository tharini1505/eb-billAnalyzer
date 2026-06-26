import { useState } from "react"
import "./App.css"
import InputSelection from "./Components/InputSelection"
import UploadForm from "./Components/UploadForm"
import ManualForm from "./Components/ManualForm"
import AnalyserResult from "./Components/AnalyserResult"
import Dashboard from "./Components/Dashboard"

function App() {
  const [mode, setMode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [showDashboard, setShowDashboard] = useState(false)

  const handleBackToHome = () => {
    setMode("")
    setResult(null)
    setLoading(false)
    setShowDashboard(false)
  }

  const handleViewDashboard = () => {
    setShowDashboard(true)
  }

  const handleBackToResult = () => {
    setShowDashboard(false)
  }

  return (
    <div className="app">
      {!result && !showDashboard && (
        <div className="hero">
          <div className="hero-content">
            <h1>AI Electricity Bill Analyzer</h1>
            <p>Cut your cost by using AI integrated Electricity Bill Analyzer</p>
          </div>
        </div>
      )}

      <div className="main-content">
        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Analyzing your bill...</p>
          </div>
        ) : showDashboard ? (
          <Dashboard
            result={result}
            handleBackToResult={handleBackToResult}
            handleBackToHome={handleBackToHome}
          />
        ) : result ? (
          <AnalyserResult
            result={result}
            handleBackToHome={handleBackToHome}
            handleViewDashboard={handleViewDashboard}
          />
        ) : mode === "" ? (
          <InputSelection setMode={setMode} />
        ) : mode === "upload" ? (
          <UploadForm setLoading={setLoading} setResult={setResult} />
        ) : mode === "manual" ? (
          <ManualForm setLoading={setLoading} setResult={setResult} />
        ) : null}
      </div>
    </div>
  )
}

export default App