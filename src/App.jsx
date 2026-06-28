import { useState } from "react"
import en from "./language/en"
import ta from "./language/ta"
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

  // Language State
  const [language, setLanguage] = useState("en")
  const text = language === "en" ? en : ta

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

          <div className="language-switch">
            <button
              onClick={() =>
                setLanguage(language === "en" ? "ta" : "en")
              }
            >
              {language === "en" ? "தமிழ்" : "English"}
            </button>
          </div>

          <div className="hero-content">
            <h1>{text.homeTitle}</h1>
            <p>{text.homeSubtitle}</p>
          </div>

        </div>
      )}

      <div className="main-content">
        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>{text.analyzing}</p>
          </div>
        ) : showDashboard ? (
          <Dashboard
            result={result}
            handleBackToResult={handleBackToResult}
            handleBackToHome={handleBackToHome}
            text={text}
          />
        ) : result ? (
          <AnalyserResult
            result={result}
            handleBackToHome={handleBackToHome}
            handleViewDashboard={handleViewDashboard}
            text={text}
          />
        ) : mode === "" ? (
          <InputSelection
            setMode={setMode}
            text={text}
          />
        ) : mode === "upload" ? (
          <UploadForm
            setLoading={setLoading}
            setResult={setResult}
            text={text}
          />
        ) : mode === "manual" ? (
          <ManualForm
            loading={loading}
            setLoading={setLoading}
            setResult={setResult}
            text={text}
          />
        ) : null}
      </div>
    </div>
  )
}

export default App