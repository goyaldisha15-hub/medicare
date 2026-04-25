import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAppContext } from "../context/AppContext";

const ICONS = ["💊", "☀️", "🐟", "❤️", "🧪", "🌿", "💉", "🫀"];
const TIMES = ["6:00 AM", "8:00 AM", "12:00 PM", "2:00 PM", "6:00 PM", "9:00 PM", "10:00 PM"];

export default function Medications() {
  const { medications, toggleMedication, addMedication, deleteMedication } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", dose: "", time: "8:00 AM", icon: "💊" });
  const [formError, setFormError] = useState("");
  const [filter, setFilter] = useState("all");

  const takenCount = medications.filter((m) => m.taken).length;
  const progress = medications.length > 0 ? Math.round((takenCount / medications.length) * 100) : 0;

  const handleAdd = () => {
    if (!form.name.trim() || !form.dose.trim()) {
      setFormError("Name and dose are required");
      return;
    }
    addMedication({ name: form.name.trim(), dose: form.dose.trim(), time: form.time, icon: form.icon });
    setForm({ name: "", dose: "", time: "8:00 AM", icon: "💊" });
    setFormError("");
    setShowForm(false);
  };

  const filtered = medications.filter((m) => {
    if (filter === "taken") return m.taken;
    if (filter === "pending") return !m.taken;
    return true;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #fdf4ff, #f0f9ff)", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />

      <main style={{ marginLeft: "240px", flex: 1, padding: "32px 28px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", margin: 0 }}>💊 Medications</h1>
            <p style={{ color: "#9ca3af", fontSize: "14px", margin: "6px 0 0" }}>Track your daily medicines</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{
              padding: "11px 20px", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
              color: "#fff", border: "none", borderRadius: "14px", fontSize: "14px",
              fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 14px rgba(139,92,246,0.3)"
            }}>
            {showForm ? "✕ Cancel" : "+ Add Medication"}
          </button>
        </div>

        {/* Progress Card */}
        <div style={{
          background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
          borderRadius: "20px", padding: "24px 28px", marginBottom: "24px",
          boxShadow: "0 8px 24px rgba(139,92,246,0.25)", color: "#fff"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <div>
              <p style={{ margin: 0, fontSize: "14px", opacity: 0.85 }}>Today's Progress</p>
              <p style={{ margin: "4px 0 0", fontSize: "28px", fontWeight: "800" }}>{takenCount}/{medications.length} taken</p>
            </div>
            <div style={{ fontSize: "48px" }}>
              {progress === 100 ? "🎉" : progress >= 50 ? "💪" : "⏳"}
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "99px", height: "10px" }}>
            <div style={{
              height: "100%", borderRadius: "99px", background: "#fff",
              width: `${progress}%`, transition: "width 0.5s ease"
            }} />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: "13px", opacity: 0.8 }}>{progress}% complete</p>
        </div>

        {/* Add Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px", marginBottom: "20px", border: "1.5px solid #e9d5ff", boxShadow: "0 4px 20px rgba(139,92,246,0.08)" }}>
            <h3 style={{ margin: "0 0 18px", fontSize: "16px", fontWeight: "700", color: "#1e1b4b" }}>Add New Medication</h3>

            {/* Icon picker */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "8px" }}>Choose Icon</label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {ICONS.map((ic) => (
                  <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                    style={{
                      width: "40px", height: "40px", borderRadius: "10px", border: `2px solid ${form.icon === ic ? "#8b5cf6" : "#e9d5ff"}`,
                      background: form.icon === ic ? "rgba(139,92,246,0.1)" : "#fafafa",
                      fontSize: "20px", cursor: "pointer"
                    }}>{ic}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "16px" }}>
              {[
                { label: "Medicine Name", key: "name", placeholder: "e.g. Vitamin D3", type: "text" },
                { label: "Dose", key: "dose", placeholder: "e.g. 500mg", type: "text" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>{f.label}</label>
                  <input
                    type={f.type} value={form[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: "10px",
                      border: "1.5px solid #e9d5ff", fontSize: "14px", outline: "none",
                      boxSizing: "border-box", background: "#fafafa", color: "#1e1b4b"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                    onBlur={(e) => e.target.style.borderColor = "#e9d5ff"}
                  />
                </div>
              ))}

              {/* Time select */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Time</label>
                <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: "10px",
                    border: "1.5px solid #e9d5ff", fontSize: "14px", outline: "none",
                    background: "#fafafa", color: "#1e1b4b", cursor: "pointer"
                  }}>
                  {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {formError && (
              <p style={{ color: "#f43f5e", fontSize: "13px", margin: "0 0 12px", background: "#fff1f2", padding: "8px 12px", borderRadius: "8px", border: "1px solid #fecdd3" }}>
                ⚠️ {formError}
              </p>
            )}

            <button onClick={handleAdd}
              style={{
                padding: "11px 24px", background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                color: "#fff", border: "none", borderRadius: "12px",
                fontSize: "14px", fontWeight: "700", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(139,92,246,0.3)"
              }}>
              ✓ Add Medication
            </button>
          </div>
        )}

        {/* Filter */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["all", "taken", "pending"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "7px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
                fontSize: "13px", fontWeight: "600", textTransform: "capitalize",
                background: filter === f ? "linear-gradient(135deg, #8b5cf6, #7c3aed)" : "#fff",
                color: filter === f ? "#fff" : "#9ca3af",
                border: filter === f ? "none" : "1px solid #e9d5ff",
                boxShadow: filter === f ? "0 3px 10px rgba(139,92,246,0.25)" : "none"
              }}>
              {f === "all" ? `All (${medications.length})` : f === "taken" ? `✓ Taken (${medications.filter(m => m.taken).length})` : `⏰ Pending (${medications.filter(m => !m.taken).length})`}
            </button>
          ))}
        </div>

        {/* Medications List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtered.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "18px", padding: "40px", textAlign: "center", border: "1px solid #e9d5ff" }}>
              <p style={{ fontSize: "36px", margin: "0 0 10px" }}>💊</p>
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No medications in this category</p>
            </div>
          ) : filtered.map((med) => (
            <div key={med.id} style={{
              background: "#fff", border: `1.5px solid ${med.taken ? "#bbf7d0" : "#e9d5ff"}`,
              borderRadius: "18px", padding: "18px 20px",
              display: "flex", alignItems: "center", gap: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.03)", transition: "all 0.2s"
            }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px", fontSize: "24px",
                background: med.taken ? "#f0fdf4" : "rgba(139,92,246,0.06)",
                border: `1.5px solid ${med.taken ? "#bbf7d0" : "#e9d5ff"}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>{med.icon}</div>

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1e1b4b" }}>{med.name}</p>
                <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#9ca3af" }}>{med.dose} · {med.time}</p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => toggleMedication(med.id)}
                  style={{
                    padding: "7px 16px", borderRadius: "20px", border: "none", cursor: "pointer",
                    fontSize: "12px", fontWeight: "700", transition: "all 0.2s",
                    background: med.taken ? "#dcfce7" : "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                    color: med.taken ? "#16a34a" : "#fff",
                    boxShadow: med.taken ? "none" : "0 3px 10px rgba(139,92,246,0.25)"
                  }}>
                  {med.taken ? "✓ Taken" : "Mark Taken"}
                </button>

                <button onClick={() => deleteMedication(med.id)}
                  style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: "#fff1f2", border: "1px solid #fecdd3",
                    color: "#f43f5e", cursor: "pointer", fontSize: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}