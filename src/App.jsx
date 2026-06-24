import './App.css'
import InputSelection from './Components/InputSelection.jsx'
import Hero from './Components/Hero.jsx'
import UploadForm from './Components/UploadForm.jsx'
import ManualForm from './Components/ManualForm.jsx'
import { useState } from 'react'
import LoadingScreen from './Components/LoadingScreen.jsx'

function App() {
  const [mode, setMode] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div>
      <Hero />
      <InputSelection setMode={setMode} />

      {mode && <h3 className='mode'>Selection mode: {mode}</h3>}

      {mode === "pdf" && <UploadForm setLoading={setLoading} />}
      {mode === "manual" && <ManualForm setLoading={setLoading} />}

      {loading && <LoadingScreen />}
    </div>
  )
}

export default App