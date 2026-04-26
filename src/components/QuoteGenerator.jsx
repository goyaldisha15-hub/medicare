import { useState, useEffect } from "react";

export default function AdviceGenerator() {
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      setAdvice(data.slip.advice);
    } catch (err) {
      setAdvice("Failed to fetch advice. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      padding: "24px",
      borderRadius: "16px",
      background: "#fff",
      border: "1px solid #e5e7eb",
      textAlign: "center",
      fontFamily: "Segoe UI"
    }}>
      <h2 style={{ marginBottom: "16px", color: "black" }}>💡 Daily Advice</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          "{advice}"
        </p>
      )}

      <button
        onClick={fetchAdvice}
        disabled={loading}
        style={{
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          background: "#6366f1",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        {loading ? "Fetching..." : "🔄 New Advice"}
      </button>
    </div>
  );
}