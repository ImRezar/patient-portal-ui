// src/App.js
import React, { useState } from "react";
import {
  FaUser,
  FaIdBadge,
  FaMicrophone,
  FaImage,
  FaClipboardList,
} from "react-icons/fa";
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

    // Build multipart form-data
    const formData = new FormData();
    formData.append("firstName", firstName.trim());
    formData.append("lastName", lastName.trim());
    formData.append("nationalCode", nationalCode.trim());
    if (audioFile) formData.append("audioFile", audioFile);
    if (imageFile) formData.append("imageFile", imageFile);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary ?? JSON.stringify(data));
    } catch (error) {
      console.error("Submission error:", error);
      setSummary("❌ Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Patient Portal</h1>
      <div className="grid">
        <form onSubmit={handleSubmit} className="form">
          <label>
            <FaUser className="icon" />
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </label>

          <label>
            <FaUser className="icon" />
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </label>

          <label>
            <FaIdBadge className="icon" />
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
            <FaMicrophone className="icon" />
            Audio Upload (optional)
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0] || null)}
            />
          </label>

          <label>
            <FaImage className="icon" />
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
          <h2>
            <FaClipboardList className="icon" />
            Summary from Workflow
          </h2>
          <pre>{summary || "No summary yet."}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
