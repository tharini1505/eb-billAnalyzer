import { useState } from "react"

function UploadForm({ setLoading, setResult }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")

  const handle = async () => {
    setError("")

    if (!file) {
      setError("Please upload a bill file")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("user_id", "1")
      formData.append("file", file)

      const response = await fetch("https://project-1-3-n0oe.onrender.com", {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || "Failed to upload bill")
      }

      setResult(data)
    } catch (err) {
      console.log(err)
      setError(err.message || "Could not connect to backend")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="manualform">
      <h2>Upload Your Electricity Bill</h2>

      {error && <p className="error">{error}</p>}

      <div className="inputmanual">
        <label htmlFor="billFile">Upload Bill File</label>
        <input
          id="billFile"
          name="billFile"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button className="submit-btn" onClick={handle}>
        Analyze Bill
      </button>
    </div>
  )
}

export default UploadForm