function InputSelection({ setMode }) {
  return (
    <div className="selection-container">
      <h2>Choose Input Method</h2>

      <div className="selection-buttons">
        <button className="mode-btn" onClick={() => setMode("upload")}>
          Upload Bill
        </button>

        <button className="mode-btn" onClick={() => setMode("manual")}>
          Manual Upload
        </button>
      </div>
    </div>
  )
}

export default InputSelection