import { useState, useRef } from "react";
import "./App.css";

const PRESETS = [
  { label: "Describe",          prompt: "Give a detailed description of everything you see in this image." },
  { label: "Find Objects",      prompt: "List every distinct object you can identify in this image." },
  { label: "Read Text",         prompt: "Extract and transcribe all visible text in this image." },
  { label: "Identify Location", prompt: "Where does this image appear to be taken? Describe the location or setting." },
  { label: "Mood & Tone",       prompt: "Describe the mood, atmosphere, and visual tone of this image." },
  { label: "Summarize",         prompt: "Give me a one-sentence summary of what this image shows." },
];

export default function App() {
  const [image, setImage]         = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [prompt, setPrompt]       = useState("");
  const [response, setResponse]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [dragOver, setDragOver]   = useState(false);

  const fileInputRef = useRef(null);

  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImageFile(file);
    setResponse("");
    setError("");
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver  = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = ()  => setDragOver(false);
  const handleDrop      = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleImage(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!imageFile || !prompt.trim()) return;
    setLoading(true);
    setError("");
    setResponse("");
    try {
      const form = new FormData();
      form.append("file", imageFile);
      form.append("prompt", prompt);
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      console.log("API response:", data);
      if (!res.ok) throw new Error(data.detail || `Server error: ${res.status}`);
      if (!data.response) throw new Error("Empty response from model.");
      setResponse(data.response);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setImageFile(null);
    setPrompt("");
    setResponse("");
    setError("");
  };

  return (
    <div className="app">

      {/* ── HEADER BAR ── */}
      <header className="header">
        <span className="header-title">Image Analyzer</span>
        <span className="header-sub">Powered by Gemini Flash</span>
      </header>

      {/* ── FOUR-QUADRANT GRID ── */}
      <div className="grid">

        {/* TOP LEFT — Preset prompts */}
        <section className="quadrant q-top-left">
          <p className="quad-label">Quick Prompts</p>
          <div className="presets">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                className={`preset-btn ${prompt === p.prompt ? "preset-btn--active" : ""}`}
                onClick={() => setPrompt(p.prompt)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* TOP RIGHT — Image uploader */}
        <section className="quadrant q-top-right">
          <p className="quad-label">Image</p>
          <div
            className={`drop-zone ${image ? "drop-zone--filled" : ""} ${dragOver ? "drop-zone--drag" : ""}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {image ? (
              <img src={image} alt="Preview" className="preview-img" />
            ) : (
              <div className="drop-placeholder">
                <div className="drop-arrow">↑</div>
                <p className="drop-text">Drop image here</p>
                <p className="drop-sub">or click to browse</p>
              </div>
            )}
          </div>
          {imageFile && <p className="filename">{imageFile.name}</p>}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleImage(e.target.files[0])}
          />
        </section>

        {/* BOTTOM LEFT — Text entry */}
        <section className="quadrant q-bottom-left">
          <p className="quad-label">Your Prompt</p>
          <textarea
            className="textarea"
            placeholder="Type a custom question, or pick one above…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="actions">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!image || !prompt.trim() || loading}
            >
              {loading ? "Analyzing…" : "Analyze →"}
            </button>
            <button className="btn btn-ghost" onClick={handleClear}>
              Clear
            </button>
          </div>
        </section>

        {/* BOTTOM RIGHT — Analysis output */}
        <section className="quadrant q-bottom-right">
          <p className="quad-label">Analysis</p>

          {loading && (
            <div className="response-state response-loading">
              <span className="spinner" />
              <span>Gemini is thinking…</span>
            </div>
          )}

          {error && !loading && (
            <div className="response-state response-error">
              <p className="error-title">Error</p>
              <p>{error}</p>
            </div>
          )}

          {response && !loading && (
            <div className="response-result">
              <p className="response-text">{response}</p>
            </div>
          )}

          {!response && !loading && !error && (
            <div className="response-state response-empty">
              <p>Your analysis will appear here once you submit.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}