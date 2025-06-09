// src/App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔗 YOUR N8N WEBHOOK URL HERE
  const WEBHOOK_URL = "https://mrezar.app.n8n.cloud/webhook-test/patient-portal-ui";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nationalCode.trim()) {
      alert("National Code is required.");
      return;
    }
    setLoading(true);
    setSummary("");

    const jsonPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationalCode: nationalCode.trim(),
    };

    const formData = new FormData();
    formData.append("json", JSON.stringify(jsonPayload));
    if (audioFile) formData.append("audio", audioFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setSummary(data.summary || JSON.stringify(data));
    } catch (err) {
      console.error("Submission error:", err);
      setSummary("❌ Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Patient Portal</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
          />
        </label>
        <label>
          National Code<span className="required">*</span>
          <input
            type="text"
            value={nationalCode}
            onChange={(e) => setNationalCode(e.target.value)}
            placeholder="123456789"
            required
          />
        </label>
        <label>
          Audio Upload (optional)
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files[0] || null)}
          />
        </label>
        <label>
          Blood Test Image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="summary">
        <h2>Summary from Workflow</h2>
        <pre>{summary || "No summary yet."}</pre>
      </div>
    </div>
  );
}

export default App;
