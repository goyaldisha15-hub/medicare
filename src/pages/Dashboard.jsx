import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import axios from "../api/axios";
import QuoteGenerator from "../components/QuoteGenerator";

const heartRateData = [
  { time: "6am", bpm: 62 }, { time: "8am", bpm: 74 }, { time: "10am", bpm: 88 },
  { time: "12pm", bpm: 95 }, { time: "2pm", bpm: 80 }, { time: "4pm", bpm: 76 },
  { time: "6pm", bpm: 84 }, { time: "8pm", bpm: 70 },
];

const vitals = [
  { label: "Heart Rate", value: "72 bpm", icon: "❤️", color: "#f43f5e", bg: "#fff1f2", border: "#fecdd3" },
  { label: "Blood Oxygen", value: "98%", icon: "🫁", color: "#06b6d4", bg: "#ecfeff", border: "#a5f3fc" },
  { label: "Temperature", value: "98.4°F", icon: "🌡️", color: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
  { label: "Blood Glucose", value: "94 mg/dL", icon: "🩸", color: "#8b5cf6", bg: "#faf5ff", border: "#e9d5ff" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { medications } = useAppContext();
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchTips = async () => {
  //     try {
  //       setTipsLoading(true);
  //       await axios.get("/drug/enforcement.json?limit=3");
  //       setTips([
  //         { id: 1, tip: "Drink 8 glasses of water daily 💧" },
  //         { id: 2, tip: "Take a 10 min walk after every meal 🚶" },
  //         { id: 3, tip: "Sleep 7-8 hours for optimal recovery 🌙" },
  //       ]);
  //     } catch (err) {
  //       setTips([{ id: 1, tip: "Stay healthy and hydrated! 💧" }]);
  //     } finally {
  //       setTipsLoading(false);
  //     }
  //   };
  //   fetchTips();
  // }, []);


  useEffect(() => {
    const fetchTips = async () => {
      try {
        setTipsLoading(true);
        const res = await axiosInstance.get("/drug/enforcement.json?limit=3");

        // API se jo data aaya usse tips banao
        const recalls = res.data.results.map((item, i) => ({
          id: i,
          tip: "⚠️ " + item.product_description?.slice(0, 60) + "..."
        }));
        setTips(recalls);
      } catch (err) {
        setTips([{ id: 1, tip: "Healthy raho, hydrated raho! 💧" }]);
      } finally {
        setTipsLoading(false);
      }
    };
    fetchTips();
  }, []);



  const takenCount = medications.filter((m) => m.taken).length;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg, #fdf4ff, #f0f9ff)", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar />

      <main style={{ marginLeft: "240px", flex: 1, padding: "32px 28px", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", margin: 0 }}>
            Good morning, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "14px", margin: "6px 0 0" }}>
            {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Vitals */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px", marginBottom: "24px" }}>
          {vitals.map((v) => (
            <div key={v.label} style={{
              background: v.bg, border: `1.5px solid ${v.border}`,
              borderRadius: "18px", padding: "20px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
            }}>
              <div style={{ fontSize: "26px", marginBottom: "8px" }}>{v.icon}</div>
              <div style={{ fontSize: "22px", fontWeight: "800", color: v.color }}>{v.value}</div>
              <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>{v.label}</div>
              <div style={{
                display: "inline-block", marginTop: "8px", fontSize: "11px", fontWeight: "600",
                padding: "3px 10px", borderRadius: "20px", background: v.border, color: v.color
              }}>Normal ✓</div>
            </div>
          ))}
        </div>


        <QuoteGenerator />



        {/* Chart + Meds Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" }}>

          {/* Heart Rate Chart */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #f3e8ff", boxShadow: "0 2px 12px rgba(139,92,246,0.06)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#1e1b4b" }}>Heart Rate Today</h3>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}>72 bpm average</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={heartRateData}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="time" tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false} domain={[55, 100]} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                <Area type="monotone" dataKey="bpm" stroke="#f43f5e" strokeWidth={2.5} fill="url(#hrGrad)" dot={{ fill: "#f43f5e", r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Medications Summary */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #f3e8ff", boxShadow: "0 2px 12px rgba(139,92,246,0.06)" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: "700", color: "#1e1b4b" }}>Medications</h3>
            <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#9ca3af" }}>{takenCount} of {medications.length} taken today</p>
            <div style={{
              width: "100%", height: "8px", background: "#f3e8ff", borderRadius: "99px", marginBottom: "20px"
            }}>
              <div style={{
                height: "100%", borderRadius: "99px",
                width: `${medications.length ? (takenCount / medications.length) * 100 : 0}%`,
                background: "linear-gradient(90deg, #8b5cf6, #06b6d4)",
                transition: "width 0.5s ease"
              }} />
            </div>
            {medications.slice(0, 3).map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "18px" }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#374151" }}>{m.name}</p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>{m.time}</p>
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px",
                  background: m.taken ? "#dcfce7" : "#fff1f2",
                  color: m.taken ? "#16a34a" : "#f43f5e"
                }}>{m.taken ? "✓" : "⏰"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Tips */}
        <div style={{ background: "#fff", borderRadius: "20px", padding: "22px", border: "1px solid #f3e8ff", boxShadow: "0 2px 12px rgba(139,92,246,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: "700", color: "#1e1b4b" }}>💡 Daily Health Tips</h3>
          {tipsLoading ? <Loading /> : (
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {tips.map((t) => (
                <div key={t.id} style={{
                  flex: "1", minWidth: "180px",
                  background: "linear-gradient(135deg, #faf5ff, #f0f9ff)",
                  border: "1px solid #e9d5ff", borderRadius: "14px", padding: "14px",
                  fontSize: "13px", color: "#4b5563", fontWeight: "500"
                }}>
                  {t.tip}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
