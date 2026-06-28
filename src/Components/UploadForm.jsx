import { useState } from "react"

function UploadForm({ setLoading, setResult, text }) {
  const [file, setFile] = useState(null)
  const [error, setError] = useState("")

  const handle = async () => {
    setError("")

    if (!file) {
      setError(text.uploadPdfError)
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)

      console.log("Uploading:", file.name)

      const response = await fetch(
        "https://project-1-7-0who.onrender.com/upload-bill",
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()

      console.log("UPLOAD RESPONSE:", data)

      if (!response.ok) {
        throw new Error(
          data.detail
          ? JSON.stringify(data.detail)
          : text.analysisFailed
        )
      }

      setResult(data)
    } catch (err) {
      console.error("Upload Error:", err)
      setError(err.message || text.backendError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="manualform">
      <h2>{text.uploadYourBill}</h2>

      {error && <p className="error">{error}</p>}

      <div className="inputmanual">
        <label htmlFor="billFile">{text.uploadPdfBill}</label>

        <input
          id="billFile"
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (<p className="helper-text">
                    📄 {file.name}
                  </p>
)}
      </div>

      <button className="analyze-btn" onClick={handle} disabled={file === null}>
            {text.analyzeBill}
      </button>
    </div>
  )
}

export default UploadForm