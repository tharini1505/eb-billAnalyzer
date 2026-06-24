import { useState } from "react";
function UploadForm({ setLoading }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handle = async () => {
    setError("");

    if (!file) {
      setError("Please upload a file");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: file.name,
          status: "pending"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save file");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.log(err);
      setError("Could not connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <h2>Upload Your Electricity Bill</h2>

      {error && <p>{error}</p>}

      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handle}>
        Analyze Bill
      </button>

      {result && (
        <div className="result-box">
          <h3>Bill Uploaded Successfully</h3>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>File Name:</strong> {result.fileName}</p>
          <p><strong>Status:</strong> {result.status}</p>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
