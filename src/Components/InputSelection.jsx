//import React from 'react'

function InputSelection({setMode}) {
  return (
    <>
    <div className="input">
        <button onClick={()=>setMode("pdf")}>Upload Bill</button>
        <button onClick={()=>setMode("manual")}>Manual Upload</button>
    </div>
    
    </>
  )
}

export default InputSelection
