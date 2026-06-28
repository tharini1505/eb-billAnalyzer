function InputSelection({ setMode, text }) {
  return (
    <div className="selection-container">
      <h2>{text.selectInputMethod}</h2>

      <div className="selection-buttons">
        <button onClick={() => setMode("upload")}> 
          {text.uploadBill}
        </button>

        <button onClick={() => setMode("manual")}>
          {text.manualEntry}
        </button>
      </div>
    </div>
  )
}

export default InputSelection