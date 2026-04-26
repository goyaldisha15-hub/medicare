import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";

const BODY_PARTS = [
  { id: "head", label: "Head", icon: "🧠", symptoms: ["Headache", "Dizziness", "Migraine", "Blurred vision"] },
  { id: "chest", label: "Chest", icon: "🫀", symptoms: ["Chest pain", "Shortness of breath", "Palpitations", "Tightness"] },
  { id: "stomach", label: "Stomach", icon: "🫃", symptoms: ["Nausea", "Vomiting", "Bloating", "Stomach pain"] },
  { id: "throat", label: "Throat", icon: "🗣️", symptoms: ["Sore throat", "Cough", "Difficulty swallowing"] },
  { id: "joints", label: "Joints", icon: "🦴", symptoms: ["Joint pain", "Swelling", "Stiffness", "Back pain"] },
  { id: "skin", label: "Skin", icon: "🩹", symptoms: ["Rash", "Itching", "Redness", "Bruising"] },
];

const URGENCY_CONFIG = {
  emergency: { color: "#f43f5e", bg: "#fff1f2", border: "#fecdd3", icon: "🚨", label: "Emergency — Call 1122 Now!" },
  high: { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", icon: "⚠️", label: "See a Doctor Today" },
  medium: { color: "#eab308", bg: "#fefce8", border: "#fef08a", icon: "⏰", label: "Schedule an Appointment" },
  low: { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", icon: "✅", label: "Monitor at Home" },
};


const MOCK_RESPONSES = [
  {
    keywords: ["Headache", "Migraine", "Dizziness"],
    response: {
      urgency: "low",
      conditions: ["Tension Headache", "Migraine"],
      advice: "Rest in a quiet, dark room and stay hydrated. Avoid screen exposure for some time.",
      specialist: "Neurologist",
      doList: ["Drink water", "Take proper rest"],
      dontList: ["Avoid loud noise", "Avoid stress"]
    }
  },
  {
    keywords: ["Chest pain", "Shortness of breath", "Palpitations"],
    response: {
      urgency: "high",
      conditions: ["Heart Disease", "Anxiety Attack"],
      advice: "Seek medical attention immediately if symptoms persist or worsen.",
      specialist: "Cardiologist",
      doList: ["Stay calm", "Sit down and rest"],
      dontList: ["Avoid exertion", "Do not ignore symptoms"]
    }
  },
  {
    keywords: ["Stomach pain", "Nausea", "Vomiting"],
    response: {
      urgency: "medium",
      conditions: ["Food Poisoning", "Gastritis"],
      advice: "Stay hydrated and avoid spicy food. If symptoms persist, consult a doctor.",
      specialist: "Gastroenterologist",
      doList: ["Drink ORS", "Eat light food"],
      dontList: ["Avoid junk food", "Avoid dehydration"]
    }
  },
  {
    keywords: ["Cough", "Sore throat"],
    response: {
      urgency: "low",
      conditions: ["Common Cold", "Viral Infection"],
      advice: "Take warm fluids and rest. Monitor for fever.",
      specialist: "General Physician",
      doList: ["Drink warm water", "Take steam"],
      dontList: ["Avoid cold drinks"]
    }
  }
];



export default function SymptomChecker() {
  const { symptomHistory, addSymptomRecord } = useAppContext();
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("checker");

  const toggleSymptom = (s) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const addCustom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms((prev) => [...prev, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const analyzeSymptoms = () => {
    if (selectedSymptoms.length === 0) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      let matched = null;

      for (let item of MOCK_RESPONSES) {
        if (item.keywords.some(k => selectedSymptoms.includes(k))) {
          matched = item.response;
          break;
        }
      }

      const fallback = {
        urgency: "medium",
        conditions: ["General Infection", "Unknown Condition"],
        advice: "Symptoms are unclear. Please consult a doctor if they persist.",
        specialist: "General Physician",
        doList: ["Rest", "Stay hydrated"],
        dontList: ["Avoid self-medication"]
      };

      const finalResult = matched || fallback;

      setResult(finalResult);
      addSymptomRecord({ symptoms: selectedSymptoms, result: finalResult });

      setLoading(false);
    }, 1200); // fake AI delay
  };

  const urgencyInfo = result ? URGENCY_CONFIG[result.urgency] : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #fdf4ff, #f0f9ff)", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />

      <main style={{ marginLeft: "240px", flex: 1, padding: "32px 28px", overflowY: "auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", margin: 0 }}>🤒 AI Symptom Checker</h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: "6px 0 0" }}>Powered by Claude AI — Not a substitute for professional medical advice</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "24px", background: "#fff", borderRadius: "14px", padding: "6px", border: "1px solid #e9d5ff", width: "fit-content" }}>
          {["checker", "history"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: "600", textTransform: "capitalize",
              background: activeTab === tab ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "transparent",
              color: activeTab === tab ? "#fff" : "#9ca3af",
              boxShadow: activeTab === tab ? "0 4px 12px rgba(139,92,246,0.3)" : "none",
            }}>{tab === "checker" ? "🔍 Checker" : `📋 History (${symptomHistory.length})`}</button>
          ))}
        </div>

        {activeTab === "checker" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

            {/* Left — Body Map + Symptoms */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Body Map */}
              <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #e9d5ff" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: "700", color: "#1e1b4b" }}>📍 Select Body Area</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {BODY_PARTS.map((part) => (
                    <button key={part.id} onClick={() => setSelectedPart(part)}
                      style={{
                        padding: "12px", borderRadius: "14px", border: `2px solid ${selectedPart?.id === part.id ? "#8b5cf6" : "#e9d5ff"}`,
                        background: selectedPart?.id === part.id ? "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.04))" : "#fafafa",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                        fontSize: "13px", fontWeight: "600", color: selectedPart?.id === part.id ? "#8b5cf6" : "#374151",
                        transition: "all 0.2s"
                      }}>
                      <span style={{ fontSize: "20px" }}>{part.icon}</span>
                      {part.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms from selected area */}
              {selectedPart && (
                <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #e9d5ff" }}>
                  <h3 style={{ margin: "0 0 14px", fontSize: "15px", fontWeight: "700", color: "#1e1b4b" }}>
                    {selectedPart.icon} {selectedPart.label} Symptoms
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {selectedPart.symptoms.map((s) => (
                      <button key={s} onClick={() => toggleSymptom(s)}
                        style={{
                          padding: "7px 14px", borderRadius: "20px", border: "none", cursor: "pointer",
                          fontSize: "13px", fontWeight: "600", transition: "all 0.2s",
                          background: selectedSymptoms.includes(s) ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "#f3e8ff",
                          color: selectedSymptoms.includes(s) ? "#fff" : "#8b5cf6",
                          boxShadow: selectedSymptoms.includes(s) ? "0 3px 10px rgba(139,92,246,0.3)" : "none"
                        }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom symptom input */}
              <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #e9d5ff" }}>
                <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "700", color: "#1e1b4b" }}>✏️ Add Custom Symptom</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    value={customSymptom} onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustom()}
                    placeholder="Type a symptom..."
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: "12px",
                      border: "1.5px solid #e9d5ff", fontSize: "14px", outline: "none",
                      background: "#fafafa", color: "#1e1b4b"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                    onBlur={(e) => e.target.style.borderColor = "#e9d5ff"}
                  />
                  <button onClick={addCustom}
                    style={{
                      padding: "10px 16px", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                      color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer",
                      fontSize: "13px", fontWeight: "700"
                    }}>Add</button>
                </div>
              </div>
            </div>

            {/* Right — Selected + Results */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Selected Symptoms */}
              <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #e9d5ff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1e1b4b" }}>
                    Selected Symptoms ({selectedSymptoms.length})
                  </h3>
                  {selectedSymptoms.length > 0 && (
                    <button onClick={() => setSelectedSymptoms([])}
                      style={{ background: "#fff1f2", border: "none", color: "#f43f5e", borderRadius: "8px", padding: "5px 10px", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}>
                      Clear All
                    </button>
                  )}
                </div>

                {selectedSymptoms.length === 0 ? (
                  <p style={{ color: "#c4b5fd", fontSize: "13px", textAlign: "center", padding: "20px 0" }}>
                    No symptoms selected yet.<br />Pick a body area to start.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                    {selectedSymptoms.map((s) => (
                      <span key={s} style={{
                        padding: "6px 12px", borderRadius: "20px",
                        background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(6,182,212,0.06))",
                        border: "1px solid #e9d5ff", fontSize: "12px", fontWeight: "600", color: "#8b5cf6",
                        display: "flex", alignItems: "center", gap: "6px"
                      }}>
                        {s}
                        <span onClick={() => toggleSymptom(s)} style={{ cursor: "pointer", color: "#f43f5e" }}>×</span>
                      </span>
                    ))}
                  </div>
                )}

                <button onClick={analyzeSymptoms} disabled={loading || selectedSymptoms.length === 0}
                  style={{
                    width: "100%", padding: "13px",
                    background: selectedSymptoms.length === 0 ? "#e9d5ff" : "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                    color: selectedSymptoms.length === 0 ? "#c4b5fd" : "#fff",
                    border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700",
                    cursor: selectedSymptoms.length === 0 ? "not-allowed" : "pointer",
                    boxShadow: selectedSymptoms.length > 0 ? "0 4px 16px rgba(139,92,246,0.3)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}>
                  {loading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 50 50" style={{ animation: "spin 0.8s linear infinite" }}>
                        <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="5" />
                        <circle cx="25" cy="25" r="20" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="80" strokeDashoffset="60" strokeLinecap="round" />
                      </svg>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      Analyzing with AI...
                    </>
                  ) : "🔍 Analyze with AI"}
                </button>
              </div>

              {/* Results */}
              {result && urgencyInfo && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                  {/* Urgency Alert */}
                  <div style={{
                    background: urgencyInfo.bg, border: `2px solid ${urgencyInfo.border}`,
                    borderRadius: "16px", padding: "16px 20px",
                    display: "flex", alignItems: "center", gap: "12px"
                  }}>
                    <span style={{ fontSize: "28px" }}>{urgencyInfo.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: urgencyInfo.color }}>{urgencyInfo.label}</p>
                      <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#6b7280" }}>See: {result.specialist}</p>
                    </div>
                  </div>

                  {/* Possible Conditions */}
                  <div style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: "1px solid #e9d5ff" }}>
                    <h4 style={{ margin: "0 0 10px", fontSize: "14px", fontWeight: "700", color: "#1e1b4b" }}>🩺 Possible Conditions</h4>
                    {result.conditions.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "#374151" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#8b5cf6", flexShrink: 0 }} />
                        {c}
                      </div>
                    ))}
                  </div>

                  {/* Do / Don't */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "14px", padding: "14px" }}>
                      <h4 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "700", color: "#16a34a" }}>✅ Do</h4>
                      {result.doList.map((d, i) => <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: "#374151" }}>• {d}</p>)}
                    </div>
                    <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: "14px", padding: "14px" }}>
                      <h4 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: "700", color: "#f43f5e" }}>❌ Don't</h4>
                      {result.dontList.map((d, i) => <p key={i} style={{ margin: "0 0 4px", fontSize: "12px", color: "#374151" }}>• {d}</p>)}
                    </div>
                  </div>

                  {/* Advice */}
                  <div style={{ background: "linear-gradient(135deg, #faf5ff, #f0f9ff)", border: "1px solid #e9d5ff", borderRadius: "14px", padding: "14px" }}>
                    <h4 style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: "700", color: "#8b5cf6" }}>💬 AI Advice</h4>
                    <p style={{ margin: 0, fontSize: "13px", color: "#4b5563", lineHeight: "1.6" }}>{result.advice}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {symptomHistory.length === 0 ? (
              <div style={{ background: "#fff", borderRadius: "20px", padding: "48px", textAlign: "center", border: "1px solid #e9d5ff" }}>
                <p style={{ fontSize: "40px", margin: "0 0 12px" }}>📋</p>
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>No symptom checks yet. Start your first analysis!</p>
              </div>
            ) : symptomHistory.map((record) => {
              const u = URGENCY_CONFIG[record.result?.urgency] || URGENCY_CONFIG.low;
              return (
                <div key={record.id} style={{ background: "#fff", borderRadius: "18px", padding: "20px", border: `1.5px solid ${u.border}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", color: "#9ca3af" }}>{record.date}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                        {record.symptoms.map((s) => (
                          <span key={s} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", background: "#f3e8ff", color: "#8b5cf6", fontWeight: "600" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "5px 12px", borderRadius: "20px", background: u.bg, color: u.color, border: `1px solid ${u.border}`, whiteSpace: "nowrap" }}>
                      {u.icon} {record.result?.urgency?.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>{record.result?.advice}</p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}