// src/App.js
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // State hooks
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [bloodTestFile, setBloodTestFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");

  // Replace this with your actual webhook URL
  const WEBHOOK_URL = "https://example.com/your-workflow-webhook";

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nationalCode.trim()) {
      alert("National Code is required.");
      return;
    }

    setLoading(true);
    setSummaryText(""); // clear any previous summary

    // Build multipart form data
    const formData = new FormData();
    formData.append("nationalCode", nationalCode.trim());

    if (firstName.trim()) {
      formData.append("firstName", firstName.trim());
    }
    if (lastName.trim()) {
      formData.append("lastName", lastName.trim());
    }
    if (audioFile) {
      formData.append("audio", audioFile);
    }
    if (bloodTestFile) {
      formData.append("bloodTestImage", bloodTestFile);
    }

    try {
      const response = await axios.post(WEBHOOK_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming the workflow returns JSON like { summary: "..." }
      if (response.data && response.data.summary) {
        setSummaryText(response.data.summary);
      } else {
        setSummaryText(
          "⚠️ Unexpected response format. Please check your webhook."
        );
      }
    } catch (err) {
      console.error(err);
      setSummaryText(
        "❌ Error calling the workflow. See console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <h1>Medical Dashboard</h1>
      <form onSubmit={handleSubmit}>
        {/* 1) Audio Upload Panel */}
        <div className="panel">
          <h2>Audio Upload (optional)</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              setAudioFile(e.target.files.length ? e.target.files[0] : null)
            }
          />
          {audioFile && <p>Selected: {audioFile.name}</p>}
        </div>

        {/* 2) Blood Test (Image) Upload Panel */}
        <div className="panel">
          <h2>Blood Test Upload (optional)</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setBloodTestFile(
                e.target.files.length ? e.target.files[0] : null
              )
            }
          />
          {bloodTestFile && <p>Selected: {bloodTestFile.name}</p>}
        </div>

        {/* 3) Patient Info Panel */}
        <div className="panel">
          <h2>Patient Information</h2>

          <label>
            First Name:
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
            />
          </label>

          <label>
            Last Name:
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
            />
          </label>

          <label>
            National Code: <span style={{ color: "red" }}>*</span>
            <input
              type="text"
              value={nationalCode}
              onChange={(e) => setNationalCode(e.target.value)}
              placeholder="Enter national code (required)"
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Processing…" : "Get Patient Information"}
          </button>
        </div>
      </form>

      {/* 4) Summary Area */}
      <div className="panel">
        <h2>Summary from Workflow</h2>
        <div className="summary-box">
          {summaryText ? summaryText : "No summary yet."}
        </div>
      </div>
    </div>
  );
}

export default App;
